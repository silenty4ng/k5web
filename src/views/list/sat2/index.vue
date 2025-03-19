<template>
  <div class="container">
    <a-modal width="650px" v-model:visible="state.selfSatModal" @ok="addSelfSat">
      <template #title>
        {{ $t("sat.selfSatInfo") }}
      </template>
      <div>
        <a-textarea v-model="state.selfSatInfo" style="height: 120px;" placeholder="ISS (ZARYA)             
  1 25544U 98067A   24320.36274227  .00015569  00000+0  28188-3 0  9999
  2 25544  51.6413 286.4173 0007936 217.3657 298.3197 15.49809951481990" />
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
    <Breadcrumb :items="[$t('menu.list'), $t('menu.satellite2')]" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" :title="$t('menu.satellite2') + $t('global.onStart')">
          <a-spin :loading="loading" style="width: 100%;" tip="正在处理 ...">
            <a-form-item :label-col-style="{ width: '25%' }" field="dt" :label="$t('tool.brtime')"
              @click="() => { state.showHide += 1 }">
              {{ state.dt }}
            </a-form-item>
            <a-form-item v-show="state.showHide >= 5" :label-col-style="{ width: '25%' }" field="dtCustom"
              label="自定义时间">
              <div>
                <a-date-picker style="width: 220px; margin: 0 24px 24px 0;" show-time
                  :time-picker-props="{ defaultValue: '00:00:00' }" format="YYYY-MM-DD HH:mm:ss"
                  v-model="state.dtCustom" />
                &nbsp;&nbsp;<t-button size="small" theme="success" @click="writeTime">写入时间到台站</t-button>
              </div>
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="sat" :label="$t('tool.selectSatellite')">
              <div style="width: 100%;">
                <a-select v-model="state.sat" @change="changeSat" :placeholder="$t('tool.selectSatellite') + '...'"
                  allow-search allow-clear>
                  <a-option v-for="item in state.satData" :key="item.name" :value="item.name">{{ item.name }}</a-option>
                </a-select>
                <a-link @click="() => { state.selfSatModal = true }" style="margin-top: 10px;">{{ $t("sat.addSelfSat")
                  }}</a-link>
              </div>
            </a-form-item>
            <a-form-item :label-col-style="{ width: '25%' }" field="sat" label="">
              <t-table ref="tableRef" row-key="key" :columns="columns" :data="state.satsData"
              :editable-cell-state="editableCellState" bordered lazy-load />
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
import { ref, reactive, nextTick, onMounted, onUnmounted, computed } from 'vue';
import { useAppStore } from '@/store';
import { eeprom_write, eeprom_reboot, eeprom_init, hexReverseStringToUint8Array, stringToUint8Array } from '@/utils/serial.js';
import useLoading from '@/hooks/loading';
import QRCode from 'qrcode';
import { Input, Select } from 'tdesign-vue-next';

const { loading, setLoading } = useLoading(true);

const appStore = useAppStore();

const lngRef: any = ref(null)
const latRef: any = ref(null)
const altRef: any = ref(null)

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
  satsData: any[]
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
  CTCSSOption: [0, 67.0, 69.3, 71.9, 74.4, 77.0, 79.7, 82.5, 85.4,
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
  satsData: []
})

const editableCellState = (cellParams) => {
  // 第一行不允许编辑
  const { row } = cellParams;
  return row.status !== 2;
};

const tableRef = ref();

const columns = computed(() => [
  {
    title: '卫星名称',
    colKey: 'satName',
  },
  {
    title: '上行频率',
    colKey: 'txFreq',
    align: 'left',
    edit: {
      component: Input,
      props: {
        clearable: true,
        autofocus: true,
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext: any) => ({
        onBlur: () => {
          console.log('失去焦点', editContext);
        },
        onEnter: (ctx: any) => {
          ctx?.e?.preventDefault();
          console.log('onEnter', ctx);
        },
      }),
      // 除了点击非自身元素退出编辑态之外，还有哪些事件退出编辑态
      abortEditOnEvent: ['onEnter'],
      // 编辑完成，退出编辑态后触发
      onEdited: (context: any) => {
        console.log(context);
        const newData = [...state.satsData];
        newData.splice(context.rowIndex, 1, context.newRowData);
        state.satsData = newData;
        console.log('Edit firstName:', context);
      },
      rules: [
        { required: true, message: '不能为空' },
      ],
      defaultEditable: true,
    },
  },
  {
    title: '上行亚音',
    colKey: 'txTone',
    edit: {
      component: Select,
      // props, 透传全部属性到 Select 组件
      props: {
        clearable: true,
        options: state.CTCSSOption.map((e:any)=>{return {label: e, value: e}}),
      },
      on: (editContext: any) => ({
        onChange: (params: any) => {
          console.log('status changed', editContext, params);
        },
      }),
      // 除了点击非自身元素退出编辑态之外，还有哪些事件退出编辑态
      // abortEditOnEvent: ['onChange'],
      // 编辑完成，退出编辑态后触发
      onEdited: (context: any) => {
        state.satsData.splice(context.rowIndex, 1, context.newRowData);
        console.log('Edit Framework:', context);
      },
    },
  },
  {
    title: '下行频率',
    colKey: 'rxFreq',
    align: 'left',
    edit: {
      component: Input,
      props: {
        clearable: true,
        autofocus: true,
      },
      // 触发校验的时机（when to validate)
      validateTrigger: 'change',
      // 透传给 component: Input 的事件（也可以在 edit.props 中添加）
      on: (editContext: any) => ({
        onBlur: () => {
          console.log('失去焦点', editContext);
        },
        onEnter: (ctx: any) => {
          ctx?.e?.preventDefault();
          console.log('onEnter', ctx);
        },
      }),
      // 除了点击非自身元素退出编辑态之外，还有哪些事件退出编辑态
      abortEditOnEvent: ['onEnter'],
      // 编辑完成，退出编辑态后触发
      onEdited: (context: any) => {
        console.log(context);
        const newData = [...state.satsData];
        newData.splice(context.rowIndex, 1, context.newRowData);
        state.satsData = newData;
        console.log('Edit firstName:', context);
      },
      rules: [
        { required: true, message: '不能为空' },
      ],
      defaultEditable: true,
    },
  },
  {
    title: '下行亚音',
    colKey: 'rxTone',
    edit: {
      component: Select,
      // props, 透传全部属性到 Select 组件
      props: {
        clearable: true,
        options: state.CTCSSOption.map((e:any)=>{return {label: e, value: e}}),
      },
      on: (editContext: any) => ({
        onChange: (params: any) => {
          console.log('status changed', editContext, params);
        },
      }),
      // 除了点击非自身元素退出编辑态之外，还有哪些事件退出编辑态
      // abortEditOnEvent: ['onChange'],
      // 编辑完成，退出编辑态后触发
      onEdited: (context: any) => {
        state.satsData.splice(context.rowIndex, 1, context.newRowData);
        console.log('Edit Framework:', context);
      },
    },
  }
]);

onMounted(async () => {
  try {
    if (sessionStorage.getItem('satFrequenciesRst')) {
      state.freqDb = JSON.parse(sessionStorage.getItem('satFrequenciesRst') || "[]")
    } else {
      const rst = await (await fetch('https://github.jobcher.com/gh/https://raw.githubusercontent.com/palewire/ham-satellite-database/main/data/amsat-active-frequencies.json')).text()
      state.freqDb = JSON.parse(rst)
      sessionStorage.setItem("satFrequenciesRst", rst)
    }
  }
  catch { }

  state.timer = setInterval(() => {
    state.dt = new Date().toLocaleString()
    localStorage.setItem('myLng', state.lng.toString());
    localStorage.setItem('myLat', state.lat.toString());
    localStorage.setItem('myAlt', state.alt.toString());
  }, 1000)
})

onUnmounted(() => {
  try {
    clearInterval(state.timer)
  } catch { }
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
    ...hexReverseStringToUint8Array(parseInt(date.getUTCFullYear().toString().substring(2, 4)).toString(16)),
    ...hexReverseStringToUint8Array((date.getUTCMonth() + 1).toString(16)),
    ...hexReverseStringToUint8Array(date.getUTCDate().toString(16)),
    ...hexReverseStringToUint8Array(date.getUTCHours().toString(16)),
    ...hexReverseStringToUint8Array(date.getUTCMinutes().toString(16)),
    ...hexReverseStringToUint8Array(date.getUTCSeconds().toString(16))
  ]
  await eeprom_write(appStore.connectPort, 0x02BA0, new Uint8Array(dateArray), 0x06, appStore.configuration?.uart);
}

const changeSat = async (sat: any) => {
  const data = state.satData.find(e => e.name == sat);
  if (data && data.path) {
    state.status += '<br/>卫星参数：<br/>'
    data.path.map((e: string) => {
      state.status += e + '<br/>'
    })
    let freqFlag = false
    state.freqDb.map((e: any) => {
      if (data.path[1].split(" ")[1] == e.norad_id && e.mode.indexOf('FM') != -1) {
        console.log(e)
        freqFlag = true
        state.tx = e.uplink ? parseFloat(e.uplink.split('/')[0]) : 0
        state.rx = e.downlink ? parseFloat(e.downlink.split('/')[0]) : 0
        state.txTone = parseFloat(state.CTCSSOption.reduce((_e: any, _n: any) => {
          return e.mode.indexOf(_n) != -1 ? _n : _e
        }))
      }
    })
    if (!freqFlag) {
      state.tx = 0
      state.rx = 0
      state.txTone = 0
      state.rxTone = 0
    }
    state.satsData.push({
      "satName": sat,
      "line": data.path,
      "txFreq": state.tx,
      "txTone": state.txTone,
      "rxFreq": state.rx,
      "rxTone": state.rxTone
    })
    console.log(state.satsData)
  }
  nextTick(() => {
    const textarea = document?.getElementById('statusArea');
    if (textarea) textarea.scrollTop = textarea?.scrollHeight;
  })
}

const initSat = async () => {
  setLoading(true)
  let rst = ''
  if (sessionStorage.getItem('satRst')) {
    rst = sessionStorage.getItem('satRst') || ""
  } else {
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
  if (jsonLol.length >= 3) {
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

const writeIt = async () => {
  if (appStore.connectState != true) { alert(sessionStorage.getItem('noticeConnectK5')); return; };
  if(appStore.configuration?.sat2 != true){
    alert(sessionStorage.getItem('noticeVersionNoSupport'));
    return;
  }
  setLoading(true)
  await eeprom_init(appStore.connectPort);
  // console.log(state.satsData)
  let payload = new Uint8Array(160 * 45)
  for(let i = 0; i < state.satsData.length; i++){
    const sat = state.satsData[i]
    //0x1E200~0x20000每160B是一个卫星的TLE
    // 9B名称 69B第一行 69B第二行 2B上行亚音 2B下行亚音 4B上行频率 4B下行频率
    // 卫星名称
    payload.set(stringToUint8Array(sat.satName).subarray(0,9), i * 160)
    // 第一行
    payload.set(stringToUint8Array(sat.line[0]).subarray(0,69), i * 160 + 9)
    // 第二行
    payload.set(stringToUint8Array(sat.line[1]).subarray(0,69), i * 160 + 9 + 69)
    // 上行亚音
    const _txTone = new Uint8Array(2)
    if (sat.txTone && sat.txTone > 0) {
      _txTone.set(hexReverseStringToUint8Array(parseInt((sat.txTone * 10).toFixed(0)).toString(16)).subarray(0, 0x02))
    }
    payload.set(_txTone, i * 160 + 9 + 69 + 69)
    // 下行亚音
    const _rxTone = new Uint8Array(2)
    if (sat.rxTone && sat.rxTone > 0) {
      _rxTone.set(hexReverseStringToUint8Array(parseInt((sat.rxTone * 10).toFixed(0)).toString(16)).subarray(0, 0x02))
    }
    payload.set(_rxTone, i * 160 + 9 + 69 + 69 + 2)
    // 上行频率
    const _tx = new Uint8Array(4)
    _tx.set(hexReverseStringToUint8Array(parseInt(((sat.txFreq * 1000000) / 10).toFixed(0)).toString(16)))
    payload.set(_tx, i * 160 + 9 + 69 + 69 + 2 + 2)
    // 下行频率
    const _rx = new Uint8Array(4)
    _rx.set(hexReverseStringToUint8Array(parseInt(((sat.rxFreq * 1000000) / 10).toFixed(0)).toString(16)))
    payload.set(_rx, i * 160 + 9 + 69 + 69 + 2 + 2 + 4)
  }
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
  if (isValidURL(state.selfSatInfo)) {
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
}
</style>