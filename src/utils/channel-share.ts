/**
 * 信道分享数据：把 k5web 的信道对象数组压成一个 URL 安全的字符串，
 * 对方粘贴即可导入，不再依赖分享链接的 query。
 *
 * 与 miniprogram utils/channel-share.js **格式完全一致**：
 *   格式（小端）：
 *     version(1) | count(2) | [ index(2) | bitmap(8) | 非零字节... ] × count | crc32(4)
 *   bitmap 的每一位标记对应字节是否非零，只存非零字节 —— 64B 块里大量保留位为 0，
 *   因此无损且体积很小。该字符串上传到分享码服务器后，用一串数字分享码即可取回。
 *
 * 差异只在"信道原始字节"的来源：
 *   - miniprogram：K8 寄存器块，固定 64B，由 K8.encodeChannel(ch, old) 重建
 *   - k5web：信道是对象，由 packChannel() 序列化成 64B（K8 寄存器布局，见下）
 * envelope（version / count / index / 8-byte bitmap / crc32 / base64url）完全相同，
 * 因此可以共用同一个分享码服务（api.vicicode.cn/procps/），
 * 且小程序用 K8.decodeChannel 解出的信道与 k5web 一致。
 *
 * 64B 布局（对齐 k8-layout.js 的 encodeChannel/decodeChannel，小端）：
 *   [0..3]   rxRaw     uint32 LE，频率 raw = MHz × 100000
 *   [4..7]   diffRaw   uint32 LE，|txRaw - rxRaw|
 *   [8]      aprsPtt
 *   [9]      aprsTxChannel
 *   [10]     rxToneType（低 4 位） 0=无 1=CTCSS 2=DCS 3=反向 DCS
 *   [11]     txToneType（低 4 位）
 *   [12]     freqDir（低 4 位） 0=tx=rx+diff 2=tx=rx-diff
 *   [13]     bandwidth
 *   [14]     step（K8 步进下标）
 *   [15]     encryption（扰频）
 *   [16]     power（K8 表 ['低功率','高功率','超高功率']；k5web 低→0，中→0，高→1）
 *   [17]     busy
 *   [18]     reverse
 *   [19]     dtmfDecode
 *   [20]     pttid
 *   [21]     demode（模式：K8 0=FM 1=AM 2=CW；k5web FM→0, AM→1, USB→AM(1)）
 *   [22]     scanlist（K8 表 ['无','1','2',...,'32','扫描所有']：0=无, 1=列表1, 2=列表2；取第一个选中的）
 *   [23]     squelch（固定 4）
 *   [24..39] name  16B，设备按 GBK 存储（非 UTF-8）
 *   [40..43] rxTone  uint32 LE，由 encodeTone 编码
 *   [44..47] txTone  uint32 LE
 *   [60]     signal
 *   [61]     aprsSwitch
 */

export const SLOT_SIZE = 64

/** Uint8Array → base64url 字符串 */
function toB64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** base64url 字符串 → Uint8Array */
function fromB64Url(text: string): Uint8Array {
  let s = String(text || '').replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  const binary = atob(s)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function readU16(b: Uint8Array, o: number): number { return b[o] | (b[o + 1] << 8) }
function readU32(b: Uint8Array, o: number): number {
  return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0
}
function putU32(out: Uint8Array, o: number, v: number): number {
  out[o] = v & 0xFF; out[o + 1] = (v >>> 8) & 0xFF
  out[o + 2] = (v >>> 16) & 0xFF; out[o + 3] = (v >>> 24) & 0xFF
  return v
}

/** 标准 CRC32（反射多项式 0xEDB88320，与 channel-share.js 的 backup.crc32 同族） */
function crc32(bytes: Uint8Array): number {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i]
    for (let k = 0; k < 8; k++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1))
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

export interface ShareItem {
  index: number
  raw: Uint8Array
}

/** items: [{ index, raw:Uint8Array(64) }] → base64url 字符串（与 channel-share.js 的 encode 完全相同） */
export function encode(items: ShareItem[]): string {
  const list = (items || []).filter(x => x && x.raw && x.raw.length === SLOT_SIZE)
  if (!list.length) throw new Error('没有可分享的信道')
  const bytes: number[] = [1, list.length & 0xFF, (list.length >> 8) & 0xFF]
  list.forEach(item => {
    const i = Math.max(0, parseInt(String(item.index), 10) || 0)
    const raw = item.raw
    bytes.push(i & 0xFF, (i >> 8) & 0xFF)
    const bitmap = [0, 0, 0, 0, 0, 0, 0, 0]
    const nonZero: number[] = []
    for (let b = 0; b < SLOT_SIZE; b++) {
      if (raw[b]) {
        bitmap[b >> 3] |= (1 << (b & 7))
        nonZero.push(raw[b])
      }
    }
    bitmap.forEach(v => bytes.push(v))
    nonZero.forEach(v => bytes.push(v))
  })

  const body = new Uint8Array(bytes)
  const crc = crc32(body) >>> 0
  const out = new Uint8Array(body.length + 4)
  out.set(body, 0)
  out[body.length] = crc & 0xFF
  out[body.length + 1] = (crc >>> 8) & 0xFF
  out[body.length + 2] = (crc >>> 16) & 0xFF
  out[body.length + 3] = (crc >>> 24) & 0xFF
  return toB64Url(out)
}

/** base64url 字符串 → [{ index, raw:Uint8Array(64) }]，数据不完整会抛错 */
export function decode(text: string): ShareItem[] {
  const b = fromB64Url(text)
  if (b.length < 7) throw new Error('分享数据为空')
  if (b[0] !== 1) throw new Error('分享数据版本不支持')

  const body = b.slice(0, b.length - 4)
  const crc = readU32(b, b.length - 4)
  if (crc32(body) !== crc) {
    throw new Error('分享数据不完整，分享码可能已失效，请重新生成')
  }

  const count = readU16(body, 1)
  if (count < 1) throw new Error('分享数据里的信道数量异常')
  let p = 3
  const items: ShareItem[] = []
  for (let n = 0; n < count; n++) {
    if (p + 10 > body.length) throw new Error('分享数据不完整')
    const index = readU16(body, p)
    p += 2
    const bitmap = body.slice(p, p + 8)
    p += 8
    const raw = new Uint8Array(SLOT_SIZE)
    for (let byte = 0; byte < SLOT_SIZE; byte++) {
      if (bitmap[byte >> 3] & (1 << (byte & 7))) {
        if (p >= body.length) throw new Error('分享数据不完整')
        raw[byte] = body[p++]
      }
    }
    items.push({ index, raw })
  }
  if (p !== body.length) throw new Error('分享数据格式错误')
  return items
}

/* ---------- K8 寄存器布局（对齐 k8-layout.js） ---------- */

/** 频率字符串 → raw（MHz × 100000）。与 k8-layout.js 的 mhzToRaw 一致 */
function mhzToRaw(text: any): number {
  const v = parseFloat(String(text || '').trim())
  if (!isFinite(v) || v <= 0) return 0
  return Math.round(v * 100000) >>> 0
}
/** raw → 频率字符串。与 k8-layout.js 的 freqToMhz 一致 */
function freqToMhz(raw: number): string {
  const r = raw >>> 0
  if (!r || r === 0xFFFFFFFF) return ''
  return (r / 100000).toFixed(5).replace(/0+$/, '').replace(/\.$/, '')
}

/** 编码亚音值（对齐 k8-layout.js 的 encodeTone）。
 *  type=1 CTCSS：text 为频率（如 88.5），返回 Math.round(parseFloat×10)
 *  type=2/3 DCS：text 为 3 位数字（如 023），打包成位字段
 */
function encodeTone(type: number, text: any): number {
  const t = parseInt(String(type), 10) || 0
  const s = String(text == null ? '' : text).trim()
  if (!s) return 0
  if (t === 1) {
    const n = Math.round(parseFloat(s) * 10)
    return isFinite(n) && n > 0 ? (n >>> 0) : 0
  }
  if (t === 2 || t === 3) {
    const digits = s.replace(/\D/g, '').slice(0, 3)
    if (digits.length !== 3) return 0
    let v = 0
    for (let i = 0; i < 3; i++) v |= (parseInt(digits[i], 10) & 7) << (3 * (2 - i))
    return v >>> 0
  }
  return 0
}
/** 解码亚音值（对齐 k8-layout.js 的 decodeTone） */
function decodeTone(type: number, raw: number): string {
  const t = parseInt(String(type), 10) || 0
  const v = raw >>> 0
  if (t === 1) return (v / 10).toFixed(1)
  if (t === 2 || t === 3) {
    if (!v) return ''
    return String((v >> 6) & 7) + String((v >> 3) & 7) + String(v & 7)
  }
  return ''
}

/** K8 步进表（对齐 k8-layout.js 的 OPTIONS.step），下标即设备存储值 */
const K8_STEP_KHZ = [1, 1.5, 2, 2.5, 5, 6.25, 8.33, 9, 10, 12.5, 15, 20, 25]
/** k5web 的步进值（kHz）→ K8 步进下标；无精确匹配取最接近 */
function k8StepIndex(val: any): number {
  const v = parseFloat(String(val || '').trim())
  if (!isFinite(v) || v <= 0) return 0
  for (let i = 0; i < K8_STEP_KHZ.length; i++) {
    if (Math.abs(K8_STEP_KHZ[i] - v) < 0.005) return i
  }
  let best = 0, bestDiff = Infinity
  for (let i = 0; i < K8_STEP_KHZ.length; i++) {
    const d = Math.abs(K8_STEP_KHZ[i] - v)
    if (d < bestDiff) { bestDiff = d; best = i }
  }
  return best
}

/** k5web pttid 标签 → K8 pttid 值。K8: 0=关闭 1=开始 2=结束 3=开始和结束 */
function k8Pttid(label: any): number {
  const s = String(label || '').trim()
  if (s === '上线码' || s === '开始') return 1
  if (s === '下线码' || s === '结束') return 2
  if (s === '上线+下线码' || s === '开始和结束' || s === 'Quindar码') return 3
  return 0
}
/** K8 pttid 值 → k5web pttid 标签 */
function k5webPttid(v: number): string {
  if (v === 1) return '上线码'
  if (v === 2) return '下线码'
  if (v === 3) return '上线+下线码'
  return ''
}

/** k5web mode → K8 demode。K8: 0=FM 1=AM 2=CW（设备无 USB，USB 映射到 AM） */
function k8Demode(mode: any): number {
  const s = String(mode || '').trim()
  if (s === '1') return 1   // AM
  if (s === '2') return 1   // USB → AM（设备无 USB）
  return 0                  // FM
}
/** K8 demode → k5web mode */
function k5webDemode(v: number): string {
  if (v === 1) return '1'
  if (v === 2) return '2'
  return '0'
}

/** k5web scanlist → K8 scanlist 字节。
 *  K8 表：['无', '1', '2', ..., '32', '扫描所有MR信道']
 *  即 0=无, 1=列表1, 2=列表2, ..., 32=列表32, 33=扫描所有
 *  k5web 的 I/II 对应列表 1/2，因此 I→1, II→2；空→0(无) */
function k8Scanlist(sl: any): number {
  const arr = Array.isArray(sl) ? sl : []
  if (arr.length === 0) return 0  // 无
  // 使用第一个选中的
  const first = arr[0]
  if (first === 'I') return 1      // 列表 1
  if (first === 'II') return 2     // 列表 2
  return 0
}
function k5webScanlist(v: number): string[] {
  if (v === 1) return ['I']   // 列表 1
  if (v === 2) return ['II']  // 列表 2
  return []  // 0(无) 或其他 → 空
}

/* ---------- GBK 编解码（对齐 miniprogram utils/gbk.js） ---------- */
// 小程序没有 GBK TextDecoder，k5web 用 @zxing/text-encoding 的 GB18030 编码器
// （已验证与 miniprogram 的 gbk-table.js 逐字节一致，见 _gbktest.mjs）
import '@zxing/text-encoding/es2015/encoding-indexes'
import { TextEncoder as _TE, TextDecoder as _TD } from '@zxing/text-encoding'
const gbkEnc = new _TE('gbk', { NONSTANDARD_allowLegacyEncoding: true } as any)
const gbkDec = new _TD('gbk')

/** 把字符串写入定长字段，GBK 编码，不足补 0x00，超出按字节截断且不切断双字节字符 */
function writeGBK(out: Uint8Array, offset: number, len: number, value: string): void {
  out.fill(0, offset, offset + len)
  const bytes = gbkEnc.encode(String(value == null ? '' : value))
  let pos = 0
  let i = 0
  while (i < bytes.length && pos < len) {
    const b = bytes[i]
    if (b >= 0x81 && b <= 0xFE && i + 1 < bytes.length) {
      if (pos + 2 > len) break
      out[offset + pos] = b
      out[offset + pos + 1] = bytes[i + 1]
      pos += 2
      i += 2
    } else {
      out[offset + pos] = b
      pos += 1
      i += 1
    }
  }
}
/** 从定长字段读出 GBK 字符串（0x00/0xFF 视为结束） */
function readGBK(bytes: Uint8Array, offset: number, len: number): string {
  const slice = bytes.slice(offset, offset + len)
  let end = slice.indexOf(0)
  if (end < 0) end = slice.length
  const valid = slice.slice(0, end)
  if (!valid.length) return ''
  return gbkDec.decode(valid).replace(/[\u3000 ]+$/, '').trim()
}

export interface ChannelOptions {
  CTCSSOption: number[]
  DCSOption: number[]
  stepOption: number[]
  pttidOption: string[]
}

/** 把一个 k5web 信道对象序列化成 K8 定长 64B（对齐 k8-layout.js 的 encodeChannel） */
export function packChannel(ch: any, opts: ChannelOptions): Uint8Array {
  const out = new Uint8Array(SLOT_SIZE)

  const rx = mhzToRaw(ch?.rx)
  const tx = mhzToRaw(ch?.tx)
  if (rx) putU32(out, 0, rx)
  if (rx && tx) putU32(out, 4, (tx >= rx ? (tx - rx) : (rx - tx)) >>> 0)

  out[8] = parseInt(ch?.aprsPtt, 10) || 0
  out[9] = parseInt(ch?.aprsTxChannel, 10) || 0

  const rxTone = parseInt(ch?.rxTone, 10) || 0
  const txTone = parseInt(ch?.txTone, 10) || 0
  // 只有亚音类型和具体频率/码都设了才生效，否则视为无亚音
  // （避免"设了 CTCSS 却没选频率"时设备收到类型=1 但频率=0 的无效配置）
  const rxToneEffective = (rxTone === 1 && ch?.rxCTCSS != null) || ((rxTone === 2 || rxTone === 3) && ch?.rxDCS != null) ? rxTone : 0
  const txToneEffective = (txTone === 1 && ch?.txCTCSS != null) || ((txTone === 2 || txTone === 3) && ch?.txDCS != null) ? txTone : 0
  out[10] = rxToneEffective & 0x0F
  out[11] = txToneEffective & 0x0F
  out[12] = (tx && rx && tx < rx ? 2 : 0) & 0x0F
  out[13] = parseInt(ch?.bandwidth, 10) || 0
  out[14] = k8StepIndex(ch?.step)
  out[15] = parseInt(ch?.scramb, 10) || 0
  // 功率：K8 表为 ['低功率','高功率','超高功率']，无"中"。
  // k5web 低(0)→K8 低(0)；中(1)→低(0)；高(2)→K8 高(1)（不能写 2，那是超高功率）
  const pw = parseInt(ch?.power, 10)
  out[16] = pw === 2 ? 1 : 0
  out[17] = ch?.busy ? 1 : 0
  out[18] = ch?.reverse ? 1 : 0
  out[19] = ch?.dtmf ? 1 : 0
  out[20] = k8Pttid(ch?.pttid)
  out[21] = k8Demode(ch?.mode)
  out[22] = k8Scanlist(ch?.scanlist)
  out[23] = 4  // 静噪固定为 4

  if (ch?.name != null && String(ch.name) !== '') writeGBK(out, 24, 16, String(ch.name))

  if (rxToneEffective === 1 && ch?.rxCTCSS != null) putU32(out, 40, encodeTone(1, ch.rxCTCSS) >>> 0)
  else if ((rxToneEffective === 2 || rxToneEffective === 3) && ch?.rxDCS != null) putU32(out, 40, encodeTone(2, String(ch.rxDCS).padStart(3, '0')) >>> 0)
  if (txToneEffective === 1 && ch?.txCTCSS != null) putU32(out, 44, encodeTone(1, ch.txCTCSS) >>> 0)
  else if ((txToneEffective === 2 || txToneEffective === 3) && ch?.txDCS != null) putU32(out, 44, encodeTone(2, String(ch.txDCS).padStart(3, '0')) >>> 0)

  out[60] = parseInt(ch?.signal, 10) || 0
  out[61] = ch?.aprsSwitch ? 1 : 0

  return out
}

/** 把 K8 定长 64B 还原成 k5web 信道对象（对齐 k8-layout.js 的 decodeChannel） */
export function unpackChannel(raw: Uint8Array, opts: ChannelOptions, index?: number): any {
  const b = raw instanceof Uint8Array ? raw : new Uint8Array(raw || [])
  const rxRaw = readU32(b, 0)
  const diffRaw = readU32(b, 4)
  const dir = b[12] & 0x0F
  const txRaw = dir === 2 ? (rxRaw - diffRaw) >>> 0 : ((rxRaw + diffRaw) >>> 0)

  const rxToneType = b[10] & 0x0F
  const txToneType = b[11] & 0x0F

  const ch: any = { index }
  ch.rx = freqToMhz(rxRaw)
  ch.tx = freqToMhz(txRaw)
  ch.name = readGBK(b, 24, 16)
  ch.aprsPtt = b[8]
  ch.aprsTxChannel = b[9]
  ch.rxTone = rxToneType ? String(rxToneType) : undefined
  ch.txTone = txToneType ? String(txToneType) : undefined
  ch.bandwidth = String(b[13] || 0)
  const stepIdx = k8StepIndexReverse(b[14], opts.stepOption)
  ch.step = stepIdx >= 0 ? opts.stepOption[stepIdx] : undefined
  ch.scramb = b[15] || undefined
  // K8 功率表 ['低功率','高功率','超高功率'] → k5web ['低','中','高']
  // K8 低(0)→k5web 低(0)；K8 高(1)→k5web 高(2)；K8 超高(2)→k5web 高(2)
  const k8pw = b[16]
  ch.power = k8pw === 0 ? '0' : '2'
  ch.busy = !!b[17]
  ch.reverse = !!b[18]
  ch.dtmf = !!b[19]
  ch.pttid = k5webPttid(b[20])
  ch.mode = k5webDemode(b[21])
  ch.scanlist = k5webScanlist(b[22])
  ch.squelch = b[23] || undefined
  ch.rxCTCSS = rxToneType === 1 ? parseFloat(decodeTone(rxToneType, readU32(b, 40))) || undefined : undefined
  ch.rxDCS = (rxToneType === 2 || rxToneType === 3) ? parseInt(decodeTone(rxToneType, readU32(b, 40)), 10) || undefined : undefined
  ch.txCTCSS = txToneType === 1 ? parseFloat(decodeTone(txToneType, readU32(b, 44))) || undefined : undefined
  ch.txDCS = (txToneType === 2 || txToneType === 3) ? parseInt(decodeTone(txToneType, readU32(b, 44)), 10) || undefined : undefined
  ch.signal = b[60] || undefined
  ch.aprsSwitch = !!b[61]
  return ch
}

/** K8 步进下标 → k5web stepOption 中的原始值（取最接近的） */
function k8StepIndexReverse(k8Idx: number, stepOption: number[]): number {
  if (k8Idx < 0 || k8Idx >= K8_STEP_KHZ.length) return -1
  const khz = K8_STEP_KHZ[k8Idx]
  let best = -1, bestDiff = Infinity
  for (let i = 0; i < stepOption.length; i++) {
    const d = Math.abs(stepOption[i] - khz)
    if (d < bestDiff) { bestDiff = d; best = i }
  }
  return best
}

/** 从信道数组构造分享码（只保留有 name 的有效信道）。opts 用于枚举字段的编解码 */
export function buildPayload(channels: any[], opts: ChannelOptions): { payload: string; items: ShareItem[]; count: number } {
  const list = (channels || []).filter(c => c && typeof c === 'object' && c.name)
  if (!list.length) throw new Error('没有可分享的信道')
  const items = list.map((ch, idx) => ({ index: idx, raw: packChannel(ch, opts) }))
  return { payload: encode(items), items, count: items.length }
}

/** 解出可用于展示的信道对象 */
export function describe(items: ShareItem[], opts: ChannelOptions): any[] {
  return items.map(item => unpackChannel(item.raw, opts, item.index))
}

/**
 * 分享码服务端接口（与 miniprogram utils/share-code.js 同一套服务）。
 *
 * POST https://api.vicicode.cn/procps/
 *   body: info=<分享数据>（application/x-www-form-urlencoded）
 *   返回: {"code": 200, "id": <分享码>}（信道，同步）
 *
 * 注意：服务端把 id 以数字字面量输出，且读取时用 (int) 强转，
 * 因此这里全程按字符串处理，不做 JSON.parse，也不做数值转换，
 * 避免精度丢失和前导零被吃掉。
 *
 * miniprogram 版本还会额外传 code（wx.login 的 code）供服务端换 openid 做内容审核；
 * k5web 是网页环境、没有 wx.login，因此这里只传 info，不做微信内容审核。
 */
export const SHARE_CODE_URL = 'https://api.vicicode.cn/procps/'

export interface PublishResult {
  code?: string
  pending?: boolean
  traceId?: string
}

/** 上传分享数据 → 分享码 */
export async function publish(payload: string): Promise<PublishResult> {
  const info = String(payload || '')
  if (!info) throw new Error('没有可上传的信道数据')

  const res = await fetch(SHARE_CODE_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'info=' + encodeURIComponent(info)
  })
  const text = await res.text()
  if (res.status < 200 || res.status >= 300) {
    let msg = ''
    try {
      const obj = JSON.parse(text)
      msg = obj.error || obj.message || ''
    } catch (e) {}
    throw new Error(msg ? (`服务器返回 HTTP ${res.status}：${msg}`) : (`服务器返回 HTTP ${res.status}`))
  }

  const pending = text.match(/"trace_id"\s*:\s*"([^"]+)"?/)
  if (pending) return { pending: true, traceId: pending[1] }

  const m = text.match(/"id"\s*:\s*"?([0-9]+)"?/)
  if (!m) {
    let msg = ''
    try {
      const obj = JSON.parse(text)
      msg = obj.error || obj.message || ''
    } catch (e) {}
    throw new Error(msg ? (`生成分享码失败：${msg}`) : (`服务器未返回分享码：${text.slice(0, 80)}`))
  }
  return { code: m[1] }
}

/** 分享码 → 分享数据 */
export async function fetchCode(code: string): Promise<string> {
  const id = String(code == null ? '' : code).replace(/[^0-9]/g, '')
  if (!/^\d{6,20}$/.test(id)) throw new Error('分享码应为 6-20 位数字')
  const res = await fetch(SHARE_CODE_URL + '?id=' + encodeURIComponent(id), { method: 'GET' })
  const info = (await res.text()).trim()
  if (!info) throw new Error('分享码不存在或已失效，请核对后重试或让对方重新生成')
  if (!/^[A-Za-z0-9_-]+$/.test(info)) {
    throw new Error('读取到的内容不是有效的分享数据，分享码可能已失效')
  }
  return info
}

/* ---------- 图片分享码（对齐 miniprogram utils/logo-share.js） ----------
 * 格式（小端）：
 *   version(1) | bitmap(1024) | crc32(4)
 * 该字符串上传到分享码服务器后，用一串数字分享码即可取回。
 * 分享的是原始 1024B 位图（SSD1306 页格式），与 k8-layout.js 的
 * startLogoBits / packStartLogo 极性一致，不含文件头，体积固定。 */

export const IMG_SIZE = 1024  // 128×64 / 8 = 1024 字节

/** 把 128×64 像素矩阵打包成 1024B（与 flashIt 的 outputArray 布局一致：
 *  每列 8 像素→1 字节，bit j = 行 (yGroup + j)，yGroup = 0,8,16,...,56 */
export function packImage(matrix: string[][]): Uint8Array {
  const out = new Uint8Array(IMG_SIZE)
  let i = 0
  for (let y = 0; y < 64; y += 8) {
    for (let x = 0; x < 128; x++) {
      let byte = 0
      for (let j = 0; j < 8; j++) {
        if (matrix[y + j] && matrix[y + j][x] === '#000') byte |= (1 << j)
      }
      out[i++] = byte
    }
  }
  return out
}

/** 1024B → 128×64 像素矩阵（逆 packImage） */
export function unpackImage(bytes: Uint8Array): string[][] {
  const matrix: string[][] = []
  for (let y = 0; y < 64; y++) {
    matrix[y] = []
    for (let x = 0; x < 128; x++) matrix[y][x] = '#fff'
  }
  let i = 0
  for (let y = 0; y < 64; y += 8) {
    for (let x = 0; x < 128; x++) {
      const byte = bytes[i++] || 0
      for (let j = 0; j < 8; j++) {
        matrix[y + j][x] = (byte >> j) & 1 ? '#000' : '#fff'
      }
    }
  }
  return matrix
}

/** 图片 envelope 编码（对齐 logo-share.js）：version(1) | bitmap(1024) | crc32(4) */
export function encodeImage(threshold: number, matrix: string[][]): string {
  const data = packImage(matrix)
  const body = new Uint8Array(IMG_SIZE + 1)
  body[0] = 1  // VERSION
  body.set(data, 1)
  const crc = crc32(body) >>> 0
  const out = new Uint8Array(body.length + 4)
  out.set(body, 0)
  out[body.length] = crc & 0xFF
  out[body.length + 1] = (crc >>> 8) & 0xFF
  out[body.length + 2] = (crc >>> 16) & 0xFF
  out[body.length + 3] = (crc >>> 24) & 0xFF
  return toB64Url(out)
}

/** 图片 envelope 解码（对齐 logo-share.js）→ matrix */
export function decodeImage(text: string): { matrix: string[][] } {
  const b = fromB64Url(text)
  if (b.length < IMG_SIZE + 5) throw new Error('分享数据为空')
  if (b[0] !== 1) throw new Error('分享数据版本不支持')
  const body = b.slice(0, b.length - 4)
  const crc = readU32(b, b.length - 4)
  if (crc32(body) !== crc) throw new Error('分享数据不完整，分享码可能已失效，请让对方重新生成')
  if (body.length !== IMG_SIZE + 1) throw new Error('分享数据格式错误')
  return { matrix: unpackImage(new Uint8Array(body.slice(1))) }
}