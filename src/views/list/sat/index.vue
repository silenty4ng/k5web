<template>
  <div class="container">
    <a-modal width="650px" v-model:visible="state.selfSatModal" @ok="addSelfSat">
      <template #title>
        {{ $t("sat.selfSatInfo") }}
      </template>
      <div>
        <a-textarea v-model="state.selfSatInfo" style="height: 120px;"placeholder="ISS (ZARYA)             
1 25544U 98067A   24320.36274227  .00015569  00000+0  28188-3 0  9999
2 25544  51.6413 286.4173 0007936 217.3657 298.3197 15.49809951481990"/>
      </div>
    </a-modal>
    <a-modal v-model:visible="state.visible" @ok="handleOk" :ok-text="$t('tool.scaned')">
      <template #title>
        {{ $t('tool.scanqr') }}
      </template>
      <div style="text-align: center;">
        <img :src="state.qrcode" /><br>
        {{ $t('tool.scannotice') }}
      </div>
    </a-modal>
    <Breadcrumb :items="[$t('menu.list'), $t('menu.satellite')]" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" :title="$t('menu.satellite') + $t('global.onStart')">
          <a-spin :loading="loading" style="width: 100%;" tip="正在处理 ...">
            <a-form-item :label-col-style="{ width: '25%' }" field="dt" :label="$t('tool.brtime')" @click="()=>{state.showHide += 1}">
              {{ state.dt }}
            </a-form-item>
            <a-form-item v-show="state.showHide >= 5" :label-col-style="{ width: '25%' }" field="dtCustom" label="自定义时间">
              <div>
                <a-date-picker
                style="width: 220px; margin: 0 24px 24px 0;"
                show-time
                :time-picker-props="{ defaultValue: '00:00:00' }"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="state.dtCustom"
              />
              &nbsp;&nbsp;<t-button size="small" theme="success" @click="writeTime">写入时间到台站</t-button>
              </div>
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="sat" :label="$t('tool.selectSatellite')">
              <div style="width: 100%;">
                <a-select v-model="state.sat" @change="changeSat" :placeholder="$t('tool.selectSatellite') + '...'" allow-search allow-clear>
                  <a-option v-for="item in state.satData" :key="item.name" :value="item.name">{{ item.name }}</a-option>
                </a-select>
                <a-link @click="()=>{state.selfSatModal = true}" style="margin-top: 10px;">{{ $t("sat.addSelfSat") }}</a-link>
              </div>
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="lng" :label="$t('tool.longitude')">
              <a-input-number ref="lngRef" :precision="6" v-model="state.lng" />
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="lat" :label="$t('tool.latitude')">
              <a-input-number ref="latRef" :precision="6" v-model="state.lat" />
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="alt" :label="$t('tool.altitude')">
              <a-input-number ref="altRef" :precision="0" v-model="state.alt" />
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" label="">
              <a-space>
                <a-button @click="getLocation">{{ $t('tool.brlonlat') }}</a-button>
                <a-button @click="scanLocation">{{ $t('tool.phonelonlat') }}</a-button>
                <a-button type="primary" @click="getPass">{{ $t('tool.satpasstime') }}</a-button>
              </a-space>
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="pass" :label="$t('tool.selectPassTime')">
              <a-select v-model="state.pass" allow-search allow-clear>
                <a-option v-for="item in state.passOption" :key="item[0] + '|' + item[1]"
                  :value="item[0] + '|' + item[1]">{{ item[0] + " - " + item[1] }}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item v-show="state.showHide >= 5" :label-col-style="{ width: '25%' }" field="passCustom" label="自定义过境时间">
              <a-range-picker
                style="width: 360px; margin: 0 24px 24px 0;"
                show-time
                :time-picker-props="{ defaultValue: ['00:00:00', '00:00:00'] }"
                format="YYYY-MM-DD HH:mm:ss"
                v-model="state.passCustom"
              />
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="tx" :label="$t('tool.txFreq')">
              <a-input-number :precision="5" v-model="state.tx" />
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="txTone" :label="$t('tool.txTone')">
              <a-select v-model="state.txTone" allow-search allow-clear>
                <a-option :value="0">{{ $t('tool.off') }}</a-option>
                <a-option v-for="item in state.CTCSSOption" :key="item" :value="item">{{ item.toFixed(1) }}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="rx" :label="$t('tool.rxFreq')">
              <a-input-number :precision="5" v-model="state.rx" />
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="rxTone" :label="$t('tool.rxTone')">
              <a-select v-model="state.rxTone" allow-search allow-clear>
                <a-option :value="0">{{ $t('tool.off') }}</a-option>
                <a-option v-for="item in state.CTCSSOption" :key="item" :value="item">{{ item.toFixed(1) }}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" label="">
              <a-button type="primary" @click="writeIt">{{ $t('tool.writeData') }}</a-button>
            </a-form-item>
            <a-divider />
            <div id="statusArea"
              style="height: 20em; background-color: var(--color-bg-3); color: var(--color-text-3); overflow: auto; padding: 20px"
              v-html="state.status"></div>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/store';
import { eeprom_write, eeprom_reboot, eeprom_init, hexReverseStringToUint8Array, stringToUint8Array } from '@/utils/serial.js';
import useLoading from '@/hooks/loading';
import QRCode from 'qrcode';

const { loading, setLoading } = useLoading(true);

const appStore = useAppStore();

const lngRef : any = ref(null)
const latRef : any = ref(null)
const altRef : any = ref(null)

const state: {
  uuid: string,
  qrcode: string,
  showHide: number,
  status: string,
  sat: string,
  satData: any[],
  lng: number,
  lat: number,
  alt: number,
  tx: number,
  rx: number,
  txTone: number | undefined,
  CTCSSOption: any[],
  pass: any,
  passOption: any[],
  rxTone: number | undefined,
  dt: any,
  timer: any,
  passCustom: any,
  dtCustom: any,
  freqDb: any,
  visible: boolean,
  selfSatModal: boolean,
  selfSatInfo: string,
} = reactive({
  uuid: '',
  qrcode: '',
  visible: false,
  showHide: 0,
  status: "点击写入按钮写入卫星数据到设备<br/><br/>",
  sat: '',
  satData: [],
  lng: 0,
  lat: 0,
  alt: 0,
  tx: 0,
  rx: 0,
  txTone: 0,
  rxTone: 0,
  CTCSSOption: [67.0, 69.3, 71.9, 74.4, 77.0, 79.7, 82.5, 85.4,
    88.5, 91.5, 94.8, 97.4, 100.0, 103.5, 107.2, 110.9,
    114.8, 118.8, 123.0, 127.3, 131.8, 136.5, 141.3, 146.2,
    151.4, 156.7, 159.8, 162.2, 165.5, 167.9, 171.3, 173.8,
    177.3, 179.9, 183.5, 186.2, 189.9, 192.8, 196.6, 199.5,
    203.5, 206.5, 210.7, 218.1, 225.7, 229.1, 233.6, 241.8,
    250.3, 254.1],
  pass: undefined,
  passOption: [],
  dt: '',
  timer: undefined,
  passCustom: undefined,
  dtCustom: undefined,
  freqDb: [],
  selfSatModal: false,
  selfSatInfo: '',
})

onMounted(async ()=>{
  try{
    if(sessionStorage.getItem('satFrequenciesRst')){
      state.freqDb = JSON.parse(sessionStorage.getItem('satFrequenciesRst') || "[]")
    }else{
      const rst = await (await fetch('https://github.jobcher.com/gh/https://raw.githubusercontent.com/palewire/ham-satellite-database/main/data/amsat-active-frequencies.json')).text()
      state.freqDb = JSON.parse(rst)
      sessionStorage.setItem("satFrequenciesRst", rst)
    }
  }
  catch{}

  state.lng = parseFloat(localStorage.getItem('myLng') || '0')
  state.lat = parseFloat(localStorage.getItem('myLat') || '0')
  state.alt = parseFloat(localStorage.getItem('myAlt') || '0')

  await lngRef.value.$forceUpdate()
  await latRef.value.$forceUpdate()
  await altRef.value.$forceUpdate()
  state.lng = parseFloat(lngRef.value.inputRef.modelValue || '0')
  state.lat = parseFloat(latRef.value.inputRef.modelValue || '0')
  state.alt = parseFloat(altRef.value.inputRef.modelValue || '0')

  state.timer = setInterval(()=>{
    state.dt = new Date().toLocaleString()
    localStorage.setItem('myLng', state.lng.toString());
    localStorage.setItem('myLat', state.lat.toString());
    localStorage.setItem('myAlt', state.alt.toString());
  }, 1000)
})

onUnmounted(()=>{
  try{
    clearInterval(state.timer)
  }catch{}
})

const writeTime = async () => {
  if (appStore.connectState != true) { alert(sessionStorage.getItem('noticeConnectK5')); return; };
  setLoading(true)
  await eeprom_init(appStore.connectPort);
  await syncTime();
  await eeprom_reboot(appStore.connectPort);
  setLoading(false)
}

const syncTime = async () => {
  const date = state.dtCustom ? new Date(state.dtCustom) : new Date();
  const dateArray = [
    ...hexReverseStringToUint8Array(parseInt(date.getFullYear().toString().substring(2,4)).toString(16)),
    ...hexReverseStringToUint8Array((date.getMonth() + 1).toString(16)),
    ...hexReverseStringToUint8Array(date.getDate().toString(16)),
    ...hexReverseStringToUint8Array(date.getHours().toString(16)),
    ...hexReverseStringToUint8Array(date.getMinutes().toString(16)),
    ...hexReverseStringToUint8Array(date.getSeconds().toString(16))
  ]
  await eeprom_write(appStore.connectPort, 0x02BC0, new Uint8Array(dateArray), 0x06, appStore.configuration?.uart);
}

const changeSat = async (sat: any) => {
  const data = state.satData.find(e => e.name == sat);
  if (data && data.path) {
    state.status += '<br/>卫星参数：<br/>'
    data.path.map((e: string) => {
      state.status += e + '<br/>'
    })
    let freqFlag = false
    state.freqDb.map((e: any)=>{
      if(data.path[1].split(" ")[1] == e.norad_id && e.mode.indexOf('FM') != -1){
        console.log(e)
        freqFlag = true
        state.tx = e.uplink ? parseFloat(e.uplink.split('/')[0]) : 0
        state.rx = e.downlink ? parseFloat(e.downlink.split('/')[0]) : 0
        state.txTone = parseFloat([0, ...state.CTCSSOption].reduce((_e: any, _n: any)=>{
          return e.mode.indexOf(_n) != -1 ? _n : _e
        }))
      }
    })
    if(!freqFlag){
      state.tx = 0
      state.rx = 0
      state.txTone = 0
      state.rxTone = 0
    }
  }
  nextTick(() => {
    const textarea = document?.getElementById('statusArea');
    if (textarea) textarea.scrollTop = textarea?.scrollHeight;
  })
}

const initSat = async () => {
  setLoading(true)
  let rst = ''
  if(sessionStorage.getItem('satRst')){
    rst = sessionStorage.getItem('satRst') || ""
  }else{
    rst = await (await fetch('https://celestrak.org/NORAD/elements/amateur.txt')).text()
    sessionStorage.setItem('satRst', rst)
  }
  const lines = rst.split(/\r?\n/);
  const sat = [];
  let _sat: any = {};
  for (let i = 0; i < lines.length; i++) {
    if (Number.isNaN(parseInt(lines[i].substring(0, 1)))) {
      if (_sat.name && _sat.name != '') {
        sat.push(_sat)
        _sat = {}
      }
      _sat.name = lines[i]
    } else {
      if (!_sat.path) { _sat.path = [] }
      _sat.path.push(lines[i])
    }
  }
  state.satData = sat
  setLoading(false)
}
initSat()
const getLocation = async () => {
  setLoading(true)
  navigator.geolocation.getCurrentPosition((e) => {
    if (e.coords) {
      state.lat = e.coords.latitude
      state.lng = e.coords.longitude
      if (e.coords.altitude) state.alt = e.coords.altitude
    }
  });
  setLoading(false)
}
getLocation()

const scanLocation = async () => {
  state.visible = true
  state.uuid = crypto.randomUUID()
  state.qrcode = await QRCode.toDataURL(location.origin + '/#/satloc?uuid=' + state.uuid, { width: 250 })
  console.log(state.uuid)
}

const handleOk = async () => {
  const lol = await (await fetch('https://k5.vicicode.cn/api/lol', {
    method: "POST",
    mode: "cors",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
        func: 1,
        uuid: state.uuid
    })
  })).json();
  const jsonLol = JSON.parse(lol.cache);
  if(jsonLol.length >= 3){
    state.lng = jsonLol[0],
    state.lat = jsonLol[1],
    state.alt = jsonLol[2]
  }
}

const restoreRange = async (start: any = 0, uint8Array: any) => {
  await eeprom_init(appStore.connectPort);
  for (let i = start; i < uint8Array.length + start; i += 0x40) {
    await eeprom_write(appStore.connectPort, i, uint8Array.slice(i - start, i - start + 0x40), 0x40, appStore.configuration?.uart);
    state.status = state.status + "写入进度：" + (((i - start) / uint8Array.length) * 100).toFixed(1) + "%<br/>";
    nextTick(() => {
      const textarea = document?.getElementById('statusArea');
      if (textarea) textarea.scrollTop = textarea?.scrollHeight;
    })
  }
  state.status = state.status + "写入进度：100.0%<br/>";
}

const getPass = async () => {
  if (!state.sat) { alert('请选择卫星！'); return; };
  setLoading(true)
  const res = await (await fetch('https://k5.vicicode.cn/api/pass', {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sat: state.sat,
      sat_line_1: state.satData.find(e => e.name == state.sat).path[0],
      sat_line_2: state.satData.find(e => e.name == state.sat).path[1],
      lat: state.lat,
      lng: state.lng,
      alt: state.alt,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
  })).json()
  const passOption = []
  for (let i = 0; i < res.pass_times.length; i++) {
    try{
      let _passOption = undefined
      if((Date.parse(res.departure_times[i]) - Date.parse(res.pass_times[i])) > 0){
        _passOption = [res.pass_times[i], res.departure_times[i]]
      }else{
        _passOption = [res.pass_times[i], res.departure_times[i + 1]]
      }
      passOption.push(_passOption)
    }catch{}
  }
  if (passOption.length > 0) {
    state.pass = passOption[0][0] + "|" + passOption[0][1]
  } else {
    state.pass = undefined
  }
  state.passOption = passOption
  setLoading(false)
}

const writeIt = async () => {
  if (appStore.connectState != true) { alert(sessionStorage.getItem('noticeConnectK5')); return; };
  if(appStore.configuration?.sat != true){
    alert(sessionStorage.getItem('noticeVersionNoSupport'));
    return;
  }
  if (!state.sat) { alert('请选择卫星！'); return; };
  if(state.passCustom){
    state.pass = state.passCustom[0] + "|" + state.passCustom[1]
  }
  if (!state.pass) { alert('请选择过境时间！'); return; };
  setLoading(true)
  const res = await (await fetch('https://k5.vicicode.cn/api/doppler', {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sat: state.sat,
      sat_line_1: state.satData.find(e => e.name == state.sat).path[0],
      sat_line_2: state.satData.find(e => e.name == state.sat).path[1],
      lat: state.lat,
      lng: state.lng,
      alt: state.alt,
      tx: state.tx,
      rx: state.rx,
      pass_time: state.pass.split('|')[0],
      departure_time: state.pass.split('|')[1],
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
  })).json()
  
  const sat = state.sat
  const pass = state.pass.split('|')[0]
  const pass_year = pass.split('-')[0].substring(2, 4)
  const pass_month = pass.split('-')[1]
  const pass_day = pass.split('-')[2].split(' ')[0]
  const pass_hour = pass.split(' ')[1].split(':')[0]
  const pass_min = pass.split(' ')[1].split(':')[1]
  const pass_sec = pass.split(' ')[1].split(':')[2]
  const departure = state.pass.split('|')[1]
  const departure_year = departure.split('-')[0].substring(2, 4)
  const departure_month = departure.split('-')[1]
  const departure_day = departure.split('-')[2].split(' ')[0]
  const departure_hour = departure.split(' ')[1].split(':')[0]
  const departure_min = departure.split(' ')[1].split(':')[1]
  const departure_sec = departure.split(' ')[1].split(':')[2]
  // console.log(sat.trim(), new Date(pass), pass_year, pass_month, pass_day, pass_hour, pass_min, pass_sec)
  // console.log(sat.trim(), new Date(departure), departure_year, departure_month, departure_day, departure_hour, departure_min, departure_sec)
  
  await eeprom_init(appStore.connectPort);
  // 卫星名称
  let payload = new Uint8Array(10)
  payload.set(stringToUint8Array(sat.trim()).subarray(0, 9))
  await eeprom_write(appStore.connectPort, 0x2BA0, payload, 10, appStore.configuration?.uart);
  // 写入过境始末
  await eeprom_write(appStore.connectPort, 0x2BAA, hexReverseStringToUint8Array(parseInt(pass_year).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BAB, hexReverseStringToUint8Array(parseInt(pass_month).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BAC, hexReverseStringToUint8Array(parseInt(pass_day).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BAD, hexReverseStringToUint8Array(parseInt(pass_hour).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BAE, hexReverseStringToUint8Array(parseInt(pass_min).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BAF, hexReverseStringToUint8Array(parseInt(pass_sec).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BB0, hexReverseStringToUint8Array(parseInt(departure_year).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BB1, hexReverseStringToUint8Array(parseInt(departure_month).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BB2, hexReverseStringToUint8Array(parseInt(departure_day).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BB3, hexReverseStringToUint8Array(parseInt(departure_hour).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BB4, hexReverseStringToUint8Array(parseInt(departure_min).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  await eeprom_write(appStore.connectPort, 0x2BB5, hexReverseStringToUint8Array(parseInt(departure_sec).toString(16)).subarray(0, 1), 0x01, appStore.configuration?.uart);
  // 总过境时间
  payload = new Uint8Array(2)
  payload.set(hexReverseStringToUint8Array(((Date.parse(departure) - Date.parse(pass)) / 1000).toString(16)).subarray(0, 0x02))
  await eeprom_write(appStore.connectPort, 0x2BB6, payload, 0x02, appStore.configuration?.uart);
  // 手台的发射接收亚音
  payload = new Uint8Array(2)
  if(state.txTone && state.txTone > 0){
    payload.set(hexReverseStringToUint8Array(parseInt((state.txTone * 10).toFixed(0)).toString(16)).subarray(0, 0x02))
  }
  await eeprom_write(appStore.connectPort, 0x2BB8, payload, 0x02, appStore.configuration?.uart);
  payload = new Uint8Array(2)
  if(state.rxTone && state.rxTone > 0){
    payload.set(hexReverseStringToUint8Array(parseInt((state.rxTone * 10).toFixed(0)).toString(16)).subarray(0, 0x02))
  }
  await eeprom_write(appStore.connectPort, 0x2BBA, payload, 0x02, appStore.configuration?.uart);
  // 开始过境时间的UNIX时间戳与2000年1月1日UNIX时间戳的差
  payload = new Uint8Array(4)
  payload.set(hexReverseStringToUint8Array(((Date.parse(pass) - Date.parse('2000-01-01 00:00:00')) / 1000).toString(16)).subarray(0, 0x04))
  await eeprom_write(appStore.connectPort, 0x2BBC, payload, 0x04, appStore.configuration?.uart);

  const shift_arr: any = []
  res.shift_array.filter((num: any, index: any) => index % 2 === 0).map((e: any)=>{
    const _tx = new Uint8Array(4)
    const _rx = new Uint8Array(4)
    _tx.set(hexReverseStringToUint8Array(parseInt(((state.tx * 1000000 + e[0]) / 10).toFixed(0)).toString(16)))
    _rx.set(hexReverseStringToUint8Array(parseInt(((state.rx * 1000000 + e[1]) / 10).toFixed(0)).toString(16)))
    shift_arr.push(..._tx, ..._rx)
  })
  payload = new Uint8Array(0x1E00)
  payload.set(new Uint8Array(shift_arr).subarray(0, 0x1E00))
  await restoreRange(0x1E200, payload)
  await syncTime()
  await eeprom_reboot(appStore.connectPort);
  setLoading(false)
}

const isValidURL = (url: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // 协议 (http 或 https)
        '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // 域名
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // 或者 IP 地址 (IPv4)
        '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // 端口号和路径
        '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // 查询字符串
        '(\\#[-a-zA-Z\\d_]*)?$', 'i'); // 锚点
    return !!pattern.test(url);
}

const addSelfSat = async () => {
  if(isValidURL(state.selfSatInfo)){
    state.selfSatInfo = await (await fetch(state.selfSatInfo)).text()
  }
  const lines = (state.selfSatInfo + "\n").split(/\r?\n/);
  const sat = [];
  let _sat: any = {};
  for (let i = 0; i < lines.length; i++) {
    if (Number.isNaN(parseInt(lines[i].substring(0, 1)))) {
      if (_sat.name && _sat.name != '') {
        sat.push(_sat)
        _sat = {}
      }
      _sat.name = lines[i]
    } else {
      if (!_sat.path) { _sat.path = [] }
      _sat.path.push(lines[i])
    }
  }
  state.satData = sat.concat(state.satData)
  state.selfSatInfo = ''
}
</script>

<script lang="ts">
export default {
  name: 'Sat',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;

  :deep(.arco-list-content) {
    overflow-x: hidden;
  }

  :deep(.arco-card-meta-title) {
    font-size: 14px;
  }
}

:deep(.arco-list-col) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

:deep(.arco-list-item) {
  width: 33%;
}

:deep(.block-title) {
  margin: 0 0 12px 0;
  font-size: 14px;
}

:deep(.list-wrap) {

  // min-height: 140px;
  .list-row {
    align-items: stretch;

    .list-col {
      margin-bottom: 16px;
    }
  }

  :deep(.arco-space) {
    width: 100%;

    .arco-space-item {
      &:last-child {
        flex: 1;
      }
    }
  }
}</style>
