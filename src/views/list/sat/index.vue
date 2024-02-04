<template>
  <div class="container">
    <Breadcrumb :items="['小工具', '卫星写入']" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" title="卫星写入">
          <a-spin :loading="loading" style="width: 100%;" tip="正在下载卫星数据 ...">
            <a-form-item :label-col-style="{width: '25%'}" field="sat" label="选择卫星">
              <a-select v-model="state.sat" @change="changeSat" placeholder="选择卫星 ..." allow-search allow-clear>
                <a-option v-for="item in state.satData" :key="item.name" :value="item.name">{{item.name}}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" field="lng" label="台站经度">
              <a-input-number :precision="6" v-model="state.lng" />
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" field="lat" label="台站纬度">
              <a-input-number :precision="6" v-model="state.lat" />
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" field="alt" label="台站海拔">
              <a-input-number :precision="0" v-model="state.alt" />
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" label="">
              <a-space>
                <a-button @click="getLocation">浏览器获取经纬度</a-button>
                <a-button @click="getPass">获取卫星过境时间</a-button>
              </a-space>
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" field="pass" label="选择过境时间">
              <a-select v-model="state.pass" allow-search allow-clear>
                <a-option v-for="item in state.passOption" :key="item[0] + '|' + item[1]" :value="item[0] + '|' + item[1]">{{item[0] + " - " + item[1]}}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" field="tx" label="上行频率">
              <a-input-number :precision="5" v-model="state.tx" />
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" field="txTone" label="上行亚音">
              <a-select v-model="state.txTone" allow-search allow-clear>
                <a-option v-for="item in state.CTCSSOption" :key="item" :value="item">{{item.toFixed(1)}}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" field="rx" label="下行频率">
              <a-input-number :precision="5" v-model="state.rx" />
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" label="">
              <a-button @click="writeIt">写入数据</a-button>
            </a-form-item>
            <a-divider />
            <div id="statusArea" style="height: 20em; background-color: azure; color: silver; overflow: auto; padding: 20px" v-html="state.status"></div>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, nextTick } from 'vue';
import { useAppStore } from '@/store';
import { eeprom_write, eeprom_reboot, eeprom_init } from '@/utils/serial.js';
import useLoading from '@/hooks/loading';

const { loading, setLoading } = useLoading(true);

const appStore = useAppStore();

const state : {
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
  passOption: any[]
} = reactive({
  status: "点击写入按钮写入卫星数据到设备<br/><br/>",
  sat: '',
  satData: [],
  lng: 0,
  lat: 0,
  alt: 0,
  tx: 0,
  rx: 0,
  txTone: undefined,
  CTCSSOption: [67.0, 69.3, 71.9, 74.4, 77.0, 79.7, 82.5, 85.4,
    88.5, 91.5, 94.8, 97.4, 100.0, 103.5, 107.2, 110.9,
    114.8, 118.8, 123.0, 127.3, 131.8, 136.5, 141.3, 146.2,
    151.4, 156.7, 159.8, 162.2, 165.5, 167.9, 171.3, 173.8,
    177.3, 179.9, 183.5, 186.2, 189.9, 192.8, 196.6, 199.5,
    203.5, 206.5, 210.7, 218.1, 225.7, 229.1, 233.6, 241.8,
    250.3, 254.1],
  pass: undefined,
  passOption: []
})

const changeSat = async (sat: any) => {
  const data = state.satData.find(e=>e.name == sat);
  if(data && data.path){
    state.status += '<br/>卫星参数：<br/>'
    data.path.map((e:string)=>{
      state.status += e + '<br/>'
    })
  }
  nextTick(()=>{
    const textarea = document?.getElementById('statusArea');
    if(textarea)textarea.scrollTop = textarea?.scrollHeight;
  })
}

const initSat = async () => {
  setLoading(true)
  const rst = await (await fetch('https://celestrak.org/NORAD/elements/amateur.txt')).text()
  const lines = rst.split(/\r?\n/);
  const sat = [];
  let _sat:any = {};
  for(let i = 0; i < lines.length; i++){
    if(Number.isNaN(parseInt(lines[i].substring(0, 1)))){
      if(_sat.name && _sat.name != ''){
        sat.push(_sat)
        _sat = {}
      }
      _sat.name = lines[i]
    }else{
      if(!_sat.path){_sat.path = []}
      _sat.path.push(lines[i])
    }
  }
  state.satData = sat
  setLoading(false)
}
initSat()
const getLocation = async () => {
  navigator.geolocation.getCurrentPosition((e)=>{
    if(e.coords){
      state.lat = e.coords.latitude
      state.lng = e.coords.longitude
      if(e.coords.altitude)state.alt = e.coords.altitude
    }
  });
}
getLocation()

const restoreRange = async (start: any = 0, uint8Array: any) => {
  await eeprom_init(appStore.connectPort);
  for (let i = start; i < uint8Array.length + start; i += 0x80) {
    await eeprom_write(appStore.connectPort, i, uint8Array.slice(i - start, i - start + 0x80), 0x80, appStore.configuration?.uart);
    state.status = state.status + "写入进度：" + (((i - start) / uint8Array.length) * 100).toFixed(1) + "%<br/>";
    nextTick(()=>{
      const textarea = document?.getElementById('statusArea');
      if(textarea)textarea.scrollTop = textarea?.scrollHeight;
    })
  }
  state.status = state.status + "写入进度：100.0%<br/>";
  await eeprom_reboot(appStore.connectPort);
}

const getPass = async () => {
  if(!state.sat){alert('请选择卫星！'); return;}; 
  const res = await (await fetch('https://k5.vicicode.com/api/pass', {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sat: state.sat,
      sat_line_1: state.satData.find(e=>e.name == state.sat).path[0],
      sat_line_2: state.satData.find(e=>e.name == state.sat).path[1],
      lat: state.lat,
      lng: state.lng,
      alt: state.alt
    })
  })).json()
  const passOption = []
  for(let i=0; i<res.pass_times.length; i++){
    const _passOption = [res.pass_times[i], res.departure_times[i]]
    passOption.push(_passOption)
  }
  state.pass = undefined
  state.passOption = passOption
}

const writeIt = async() => {
  if(appStore.connectState != true){alert('请先连接手台！'); return;};
  // if(appStore.configuration?.sat != true){
  //   alert('固件版本不匹配');
  //   return;
  // }
  if(!state.pass){alert('请选择过境时间！'); return;};
  const res = await (await fetch('https://k5.vicicode.com/api/doppler', {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sat: state.sat,
      sat_line_1: state.satData.find(e=>e.name == state.sat).path[0],
      sat_line_2: state.satData.find(e=>e.name == state.sat).path[1],
      lat: state.lat,
      lng: state.lng,
      alt: state.alt,
      tx: state.tx,
      rx: state.rx,
      pass_time: state.pass.split('|')[0],
      departure_time: state.pass.split('|')[1]
    })
  })).json()
  state.status += JSON.stringify(res.shift_array) + '<br/>'
}
</script>

<script lang="ts">
  export default {
    name: 'Chi',
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
