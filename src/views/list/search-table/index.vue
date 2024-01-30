<template>
  <div class="container">
    <Breadcrumb :items="['写频', '信道管理']" />
    <a-card class="general-card" :title="$t('信道管理')">
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="readChannel">
              <template #icon>
                <icon-plus />
              </template>
              从设备读取
            </a-button>
            <a-button @click="writeChannel">
              <template #icon>
                <icon-plus />
              </template>
              写入设备
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table v-bind:loading="loading" :columns="columns" :data="state.renderData" style="margin-top: 20px" :pagination="{pageSize: 15, current: state.nowPage}" @page-change="(e)=>{state.nowPage = e}">
        <template #index="{ record, rowIndex }">
          {{(state.nowPage - 1) * 15 + rowIndex + 1}}
        </template>
        <template #name="{ record, rowIndex }">
          <a-input v-model="record.name" />
        </template>
        <template #bandwidth="{ record, rowIndex }">
          <a-select v-model="record.bandwidth" allow-clear>
            <a-option v-for="value of Object.keys(state.bandwidthOption)" :value="value">{{state.bandwidthOption[value] ?? value}}</a-option>
          </a-select>
        </template>
        <template #tx="{ record, rowIndex }">
          <a-input-number v-model="record.tx" :precision="5" />
        </template>
        <template #rx="{ record, rowIndex }">
          <a-input-number v-model="record.rx" :precision="5" />
        </template>
        <template #power="{ record, rowIndex }">
          <a-select v-model="record.power" allow-clear>
            <a-option v-for="value of Object.keys(state.powerOption)" :value="value">{{state.powerOption[value] ?? value}}</a-option>
          </a-select>
        </template>
        <template #rxTone="{ record, rowIndex }">
          <a-select v-model="record.rxTone" allow-clear>
            <a-option v-for="value of Object.keys(state.toneOption)" :value="value">{{state.toneOption[value] ?? value}}</a-option>
          </a-select>
        </template>
        <template #rxCTCSS="{ record, rowIndex }">
          <a-select v-model="record.rxCTCSS" allow-clear>
            <a-option v-for="value of state.CTCSSOption" :value="value">{{value.toFixed(1)}}</a-option>
          </a-select>
        </template>
        <template #rxDCS="{ record, rowIndex }">
          <a-select v-model="record.rxDCS" allow-clear>
            <a-option v-for="value of state.DCSOption" :value="value">{{"0" + value}}</a-option>
          </a-select>
        </template>
        <template #txTone="{ record, rowIndex }">
          <a-select v-model="record.txTone" allow-clear>
            <a-option v-for="value of Object.keys(state.toneOption)" :value="value">{{state.toneOption[value] ?? value}}</a-option>
          </a-select>
        </template>
        <template #txCTCSS="{ record, rowIndex }">
          <a-select v-model="record.txCTCSS" allow-clear>
            <a-option v-for="value of state.CTCSSOption" :value="value">{{value.toFixed(1)}}</a-option>
          </a-select>
        </template>
        <template #txDCS="{ record, rowIndex }">
          <a-select v-model="record.txDCS" allow-clear>
            <a-option v-for="value of state.DCSOption" :value="value">{{"0" + value}}</a-option>
          </a-select>
        </template>
        <template #step="{ record, rowIndex }">
          <a-select v-model="record.step" allow-clear>
            <a-option v-for="value of state.stepOption" :value="value">{{value.toFixed(1)}}</a-option>
          </a-select>
        </template>
        <template #reverse="{ record, rowIndex }">
          <a-switch v-model="record.reverse" />
        </template>
        <template #scramb="{ record, rowIndex }">
          <a-select v-model="record.scramb" allow-clear>
            <a-option v-for="value of state.scrambOption">{{value}}</a-option>
          </a-select>
        </template>
        <template #busy="{ record, rowIndex }">
          <a-switch v-model="record.busy" />
        </template>
        <template #pttid="{ record, rowIndex }">
          <a-select v-model="record.pttid" allow-clear>
            <a-option v-for="value of state.pttidOption">{{value}}</a-option>
          </a-select>
        </template>
        <template #mode="{ record, rowIndex }">
          <a-select v-model="record.mode" allow-clear>
            <a-option v-for="value of Object.keys(state.modeOption)" :value="value">{{state.modeOption[value] ?? value}}</a-option>
          </a-select>
        </template>
        <template #dtmf="{ record, rowIndex }">
          <a-switch v-model="record.dtmf" />
        </template>
        <template #operate="{ record, rowIndex }">
          <a-button @click="clearRow((state.nowPage - 1) * 15 + rowIndex)">清空</a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { eeprom_read, uint8ArrayToHexReverseString, uint8ArrayToString, hexReverseStringToUint8Array, stringToUint8Array, eeprom_write, eeprom_reboot, eeprom_init } from '@/utils/serial.js';
  import { useAppStore } from '@/store';
  const appStore = useAppStore();

  const { loading, setLoading } = useLoading(false);
  const { t } = useI18n();
  const state: {
    stepOption: any[],
    scrambOption: any[],
    renderData: any[],
    powerOption: any[],
    DCSOption: any[],
    toneOption: any[],
    CTCSSOption: any[],
    pttidOption: any[],
    modeOption: any[]
  } = reactive({
    nowPage: 1,
    bandwidthOption: {'0': '25KHz', '1': '12.5KHz'},
    modeOption: {'0': 'FM', '1': 'AM', '2': 'USB'},
    powerOption: {'0': '低', '1': '中', '2': '高'},
    toneOption: {'1':'亚音频','2':'数字亚音','3':'反向数字亚音'},
    CTCSSOption: [67.0, 69.3, 71.9, 74.4, 77.0, 79.7, 82.5, 85.4,
    88.5, 91.5, 94.8, 97.4, 100.0, 103.5, 107.2, 110.9,
    114.8, 118.8, 123.0, 127.3, 131.8, 136.5, 141.3, 146.2,
    151.4, 156.7, 159.8, 162.2, 165.5, 167.9, 171.3, 173.8,
    177.3, 179.9, 183.5, 186.2, 189.9, 192.8, 196.6, 199.5,
    203.5, 206.5, 210.7, 218.1, 225.7, 229.1, 233.6, 241.8,
    250.3, 254.1],
    DCSOption: [23,  25,  26,  31,  32,  36,  43,  47,  51,  53,  54,
    65,  71,  72,  73,  74,  114, 115, 116, 122, 125, 131,
    132, 134, 143, 145, 152, 155, 156, 162, 165, 172, 174,
    205, 212, 223, 225, 226, 243, 244, 245, 246, 251, 252,
    255, 261, 263, 265, 266, 271, 274, 306, 311, 315, 325,
    331, 332, 343, 346, 351, 356, 364, 365, 371, 411, 412,
    413, 423, 431, 432, 445, 446, 452, 454, 455, 462, 464,
    465, 466, 503, 506, 516, 523, 526, 532, 546, 565, 606,
    612, 624, 627, 631, 632, 654, 662, 664, 703, 712, 723,
    731, 732, 734, 743, 754],
    stepOption: [2.50, 5.00, 6.25, 10.00, 12.50, 25.00, 8.33, 0.01, 0.05, 0.10, 0.25, 0.50, 1.00, 1.25, 9.00, 15.00, 20.00, 30.00, 50.00, 100.00, 125.00, 200.00, 250.00, 500.00],
    scrambOption: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    pttidOption: ['上线码', '下线码', '上线+下线码', 'Quindar码'],
    renderData: []
  })

  const initData = () => {
    const data:any = [];
    Array.from({length: 200}).map(e=>{
      data.push({});
    })
    state.renderData = data;
  }
  initData()

  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
      width: 70
    },
    {
      title: '信道名称',
      dataIndex: 'name',
      slotName: 'name',
      width: 200
    },
    {
      title: '带宽',
      dataIndex: 'bandwidth',
      slotName: 'bandwidth',
      width: 150
    },
    {
      title: '接收频率',
      dataIndex: 'rx',
      slotName: 'rx',
      width: 150
    },
    {
      title: '发送频率',
      dataIndex: 'tx',
      slotName: 'tx',
      width: 150
    },
    {
      title: '发送功率',
      dataIndex: 'power',
      slotName: 'power',
      width: 150
    },
    {
      title: '接收亚音类型',
      dataIndex: 'rxTone',
      slotName: 'rxTone',
      width: 150
    },
    {
      title: '接收亚音频（Hz）',
      dataIndex: 'rxCTCSS',
      slotName: 'rxCTCSS',
      width: 150
    },
    {
      title: '接收亚音数码',
      dataIndex: 'rxDCS',
      slotName: 'rxDCS',
      width: 150
    },
    {
      title: '发送亚音类型',
      dataIndex: 'txTone',
      slotName: 'txTone',
      width: 150
    },
    {
      title: '发送亚音频（Hz）',
      dataIndex: 'txCTCSS',
      slotName: 'txCTCSS',
      width: 150
    },
    {
      title: '发送亚音数码',
      dataIndex: 'txDCS',
      slotName: 'txDCS',
      width: 150
    },
    {
      title: '频率步进',
      dataIndex: 'step',
      slotName: 'step',
      width: 150
    },
    {
      title: '倒频',
      dataIndex: 'reverse',
      slotName: 'reverse',
      width: 150
    },
    {
      title: '加密',
      dataIndex: 'scramb',
      slotName: 'scramb',
      width: 150
    },
    {
      title: '繁忙禁发',
      dataIndex: 'busy',
      slotName: 'busy',
      width: 150
    },
    {
      title: '信令码',
      dataIndex: 'pttid',
      slotName: 'pttid',
      width: 150
    },
    {
      title: '信道模式',
      dataIndex: 'mode',
      slotName: 'mode',
      width: 150
    },
    {
      title: 'DTMF解码',
      dataIndex: 'dtmf',
      slotName: 'dtmf',
      width: 150
    },
    {
      title: '操作',
      dataIndex: 'operate',
      slotName: 'operate',
      width: 150
    },
  ]);

  const readChannel = async() => {
    if(appStore.connectState != true){alert('请先连接手台！'); return;};
    await eeprom_init(appStore.connectPort);
    setLoading(true)
    let rawEEPROM  = new Uint8Array(0x0C80);
    for (let i = 0; i < 0x0C80; i += 0x80) {
      const _data = await eeprom_read(appStore.connectPort, i)
      rawEEPROM.set(_data, i)
    }
    let rawEEPROM3 = new Uint8Array(0x0C80);
    for (let i = 0x0F50; i < 0x1BD0; i += 0x80) {
      const _data = await eeprom_read(appStore.connectPort, i, 0x80)
      rawEEPROM3.set(_data, i - 0x0F50)
    }
    let x = 0;
    const _renderData = [];
    for (let i = 0; i < 0x0C80; i += 0x10) {
      const _channel = uint8ArrayToHexReverseString(rawEEPROM.subarray(i, i + 0x10))
      console.log(_channel)
      const _channelData : any = {}
      _channelData.rx           = _channel.substr(24, 8) != "ffffffff" ? parseInt(_channel.substr(24, 8), 16) / 100000 : undefined
      if(_channelData.rx){
        _channelData.offset     = _channel.substr(16, 8) != "00000000" ? parseInt(_channel.substr(16, 8), 16) / 100000 : undefined
        _channelData.txcodeflag = _channel.substr(9, 1)
        if(_channelData.txcodeflag == "1"){
          _channelData.tx = _channelData.rx + _channelData.offset
        }
        if(_channelData.txcodeflag == "2"){
          _channelData.tx = _channelData.rx - _channelData.offset
        }
        _channelData.txTone     = parseInt(_channel.substr(10, 1), 16) > 0 ? parseInt(_channel.substr(10, 1), 16).toString() : undefined
        _channelData.rxTone     = parseInt(_channel.substr(11, 1), 16) > 0 ? parseInt(_channel.substr(11, 1), 16).toString() : undefined
        if(_channelData.txTone == "1"){
          _channelData.txCTCSS = state.CTCSSOption[parseInt(_channel.substr(12, 2), 16)]
        }
        if(_channelData.txTone == "2" || _channelData.txTone == "3"){
          _channelData.txDCS   = state.DCSOption[parseInt(_channel.substr(12, 2), 16)]
        }
        if(_channelData.rxTone == "1"){
          _channelData.rxCTCSS = state.CTCSSOption[parseInt(_channel.substr(14, 2), 16)]
        }
        if(_channelData.rxTone == "2" || _channelData.rxTone == "3"){
          _channelData.rxDCS   = state.DCSOption[parseInt(_channel.substr(14, 2), 16)]
        }
        _channelData.step      = state.stepOption[parseInt(_channel.substr(2, 2), 16)]
        _channelData.scramb    = parseInt(_channel.substr(0, 2), 16) > 0 ? parseInt(_channel.substr(0, 2), 16).toString() : undefined
        _channelData.power_reverse_busy_width = parseInt(_channel.substr(6, 2), 16)
        _channelData.reverse   = _channelData.power_reverse_busy_width >> 0 & 0x01 ? true : false
        _channelData.bandwidth = (_channelData.power_reverse_busy_width >> 1 & 0x01).toString()
        _channelData.power     = (_channelData.power_reverse_busy_width >> 2 & 0x03).toString()
        _channelData.busy      = _channelData.power_reverse_busy_width >> 4 & 0x01 ? true : false
        _channelData.pttid_dtmf = parseInt(_channel.substr(4, 2), 16)
        _channelData.pttid     = state.pttidOption[(_channelData.pttid_dtmf >> 1) - 1]
        _channelData.dtmf      = _channelData.pttid_dtmf >> 0 & 0x01 ? true : false
        _channelData.mode      = parseInt(_channel.substr(8, 1), 16).toString()
        _channelData.name      = uint8ArrayToString(rawEEPROM3.subarray(i, i + 0x10))
      }
      _renderData.push(_channelData)
      x += 1;
    }
    state.renderData = _renderData;
    setLoading(false)
  }
  const writeChannel = async() =>{
    if(appStore.connectState != true){alert('请先连接手台！'); return;};
    await eeprom_init(appStore.connectPort);
    setLoading(true)
    let rawEEPROM  = new Uint8Array(0x0C80);
    let rawEEPROM2 = new Uint8Array(0x0C8);
    let rawEEPROM3 = new Uint8Array(0x0C80);
    let i = 0
    state.renderData.map(_channel=>{
      if(_channel.rx){
        let _channelhex = ""
        _channelhex += parseInt(_channel.scramb) > 0 ? parseInt(_channel.scramb).toString(16).padStart(2, '0') : '00'
        _channelhex += state.stepOption.indexOf(_channel.step) >= 0 ? state.stepOption.indexOf(_channel.step).toString(16).padStart(2, '0') : '00'

        let _pttid_dtmf = (state.pttidOption.indexOf(_channel.pttid) + 1) << 1
        _pttid_dtmf += _channel.dtmf ? 1 : 0
        _channelhex += _pttid_dtmf.toString(16).padStart(2, '0')

        let _power_reverse_busy_width = _channel.busy ? 1 << 4 : 0
        _power_reverse_busy_width += _channel.power << 2
        _power_reverse_busy_width += _channel.bandwidth << 1
        _power_reverse_busy_width += _channel.reverse ? 1 : 0
        _channelhex += _power_reverse_busy_width.toString(16).padStart(2, '0')

        _channelhex += _channel.mode ? _channel.mode.toString(16) : "0"

        if(_channel.tx > 0 && _channel.tx > _channel.rx){
          _channelhex += "1"
        }else if(_channel.tx > 0 && _channel.tx < _channel.rx){
          _channelhex += "2"
        }else{
          _channelhex += "0"
        }

        _channelhex += parseInt(_channel.txTone) > 0 ? _channel.txTone.toString(16) : "0"
        _channelhex += parseInt(_channel.rxTone) > 0 ? _channel.rxTone.toString(16) : "0"
        switch(_channel.txTone){
          case "1":
            _channelhex += state.CTCSSOption.indexOf(_channel.txCTCSS).toString(16).padStart(2, '0')
            break;
          case "2":
          case "3":
            _channelhex += state.DCSOption.indexOf(_channel.txDCS).toString(16).padStart(2, '0')
            break;
          default:
            _channelhex += "00"
        }
        switch(_channel.rxTone){
          case "1":
            _channelhex += state.CTCSSOption.indexOf(_channel.rxCTCSS).toString(16).padStart(2, '0')
            break;
          case "2":
          case "3":
            _channelhex += state.DCSOption.indexOf(_channel.rxDCS).toString(16).padStart(2, '0')
            break;
          default:
            _channelhex += "00"
        }

        const _tx = _channel.tx && _channel.rx ? Math.abs(parseInt((_channel.tx * 100000).toFixed(0)) - parseInt((_channel.rx * 100000).toFixed(0))) : NaN
        _channelhex += !Number.isNaN(_tx) ? _tx.toString(16).padStart(8, '0') : '00000000'
        _channelhex += parseInt((_channel.rx * 100000).toFixed(0)).toString(16).padStart(8, '0')

        console.log(_channelhex)
        rawEEPROM.set(hexReverseStringToUint8Array(_channelhex), i)
        rawEEPROM2.set([0xC5], i >> 4)

        const mergedArray = new Uint8Array(0x10);
        mergedArray.set(stringToUint8Array(_channel.name).subarray(0, 0x10), 0);
        rawEEPROM3.set(mergedArray, i)
      }else{
        rawEEPROM.set(hexReverseStringToUint8Array("ffffffffffffffffffffffffffffffff"), i)
        rawEEPROM2.set([0x0F], i >> 4)
        rawEEPROM3.set(hexReverseStringToUint8Array("ffffffffffffffffffffffffffffffff"), i)
      }
      i += 0x10
    })
    for (let i = 0; i < 0x0C80; i += 0x80) {
      await eeprom_write(appStore.connectPort, i, rawEEPROM.slice(i, i + 0x80));
    }
    await eeprom_write(appStore.connectPort, 0x0D60, rawEEPROM2, 0x0C8);
    for (let i = 0x0F50; i < 0x1BD0; i += 0x80) {
      await eeprom_write(appStore.connectPort, i, rawEEPROM3.slice(i - 0x0F50, i - 0x0F50 + 0x80));
    }
    await eeprom_reboot(appStore.connectPort);
    setLoading(false)
  }
  const clearRow = async (row: any) =>{
    state.renderData[row] = {}
  }
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
