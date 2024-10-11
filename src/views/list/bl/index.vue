<template>
    <div class="container">
      <Breadcrumb :items="[$t('menu.list'), $t('bl')]" />
      <a-card class="general-card" :loading="loading">
        <template #title>
          <div style="color: red; font-weight: bold;">
            ⚠：实验性功能 使用可能会损坏手台
            <div style="height: 2rem;">⚠：使用说明：
              <t-link theme="primary" href="https://github.com/losehu/uv-k5-bootloader-custom/releases" target="_blank">https://github.com/losehu/uv-k5-bootloader-custom/releases</t-link>
            </div>
          </div>
            {{ $t('bl') }} {{ $t('global.onStart') }}
        </template>
        <a-row style="margin-bottom: 16px">
          <a-col :span="12">
            <a-space style="width: 130%">
              <!-- <a-button type="primary" @click="readConfig">
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('cps.onDeviceRead') }}（仅用于检视已用区块）
              </a-button> -->
              <a-button @click="writeConfig">
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('cps.onDeviceWrite') }}
              </a-button> （固件名称仅支持英文）
            </a-space>
          </a-col>
        </a-row>
        <div style="display: flex; justify-content: space-between; margin-left: 10px; margin-right: 10px; align-items: flex-end; margin-bottom: 3px;">
          <div>EEPROM：</div>
          <div>
            {{ state.showAdd }}
            <t-button size="small" variant="outline" @click="clearAll(256)">清空</t-button>
          </div>
        </div>
        <div style="width: 100%; overflow: scroll; user-select: none;">
          <div style="height: 328px; display: flex; flex-direction: column; margin: 0; padding: 0; flex-wrap: wrap">
            <div
              @click="clearEp2(index)"
              :ondragover="(event: any)=>{showAdd(index);event.preventDefault()}"
              :ondrop="()=>{targetOver(item, index)}"
              :title="
                item == -2 ? '引导程序占用区' : (item != -1 ? state.rom[item].binaryName : 
                (index * 64 + 0x40000).toString(16).toUpperCase() + ' - ' + (index * 64 + 0x40000 + 63).toString(16).toUpperCase()
              )"
              :style="item == -1 ? 'background-color: white; border: 1px solid #ddd; height: 10px;' : (
                item == -2 ? 'background-color: #373737; border: 1px solid #ddd; height: 10px;' : 'background-color: ' + state.rom[item].color + '; border: 1px solid #ddd; height: 10px;'
              )"
              :key="index" v-for="(item, index) in state.calendar">
              &nbsp;
            </div>
          </div>
        </div>
        <a-button style="margin-bottom: 10px;" @click="selectFile">{{ state.binaryFile ? state.binaryName : $t('tool.selectFirmware') }}</a-button>（选择固件后将固件卡片拖拽到上方 EEPROM）
        <br>
        <t-space break-line>
          <t-card draggable="true" :ondragstart="()=>{state.nowDrag = index}" v-for="(item, index) in state.rom" :title="item.binaryName" :bordered="true" hover-shadow :style="{ width: '400px' }">
            <template #actions>
              <div :style="'width: 10px; height: 10px; background-color: ' + item.color + ';'"></div>
            </template>
            <t-input v-model="item.binaryName" @change="changeName(index)" show-limit-number :maxlength="13" />
          </t-card>
        </t-space>
      </a-card>
        <div id="statusArea" style="height: 20em; background-color: azure; color: silver; overflow: auto; padding: 20px; margin-top: 10px;"
        v-html="state.status"></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import { useAppStore } from '@/store';
  import { eeprom_write, eeprom_reboot, eeprom_init, eeprom_read, uint8ArrayToString, stringToUint8Array, check_eeprom, hexReverseStringToUint8Array, unpack } from '@/utils/serial.js';
  import { onMounted, reactive, nextTick } from 'vue';

  const appStore = useAppStore();
  const { loading, setLoading } = useLoading(true);

  const state : any = reactive({
    calendar: [],
    rom: [],
    bl: undefined,
    blName: '',
    nowDrag: -1,
    showAdd: '',
    status: ''
  })

  const readRange = async (start: any, end: any) =>{
    await eeprom_init(appStore.connectPort);
    let rawEEPROM = new Uint8Array(end - start);
    for (let i = start; i < end; i += 0x40) {
      const data = await eeprom_read(appStore.connectPort, i, 0x40, appStore.configuration?.uart);
      rawEEPROM.set(data, i - start);
    }
    return rawEEPROM;
  }

  const writeRange = async (start: any = 0, uint8Array: any, remark: string = '') => {
    for (let i = start; i < uint8Array.length + start; i += 0xC0) {
      await eeprom_write(appStore.connectPort, i, uint8Array.slice(i - start, i - start + 0xC0), uint8Array.slice(i - start, i - start + 0xC0).length, appStore.configuration?.uart);
      state.status = state.status + remark +  "写入进度：" + (((i - start) / uint8Array.length) * 100).toFixed(1) + "%<br/>";
      nextTick(()=>{
        const textarea = document?.getElementById('statusArea');
        if(textarea)textarea.scrollTop = textarea?.scrollHeight;
      })
    }
  }

  const showAdd = async (index: any) => {
    state.showAdd = (index * 64 + 0x40000).toString(16).toUpperCase()
    setTimeout(() => {
      state.showAdd = ''
    }, 5000);
  }

  onMounted(()=>{
    loadBL()
    const calendar = []
    for(let i=0; i < 262144 / 64; i++){
      if(i < 0x44000 / 64 / 16 - 16){
        calendar.push(-2);
      }else{
        calendar.push(-1);
      }
    }
    state.calendar = calendar
  })

  const loadBL = async() => {
    const latestVersion = JSON.parse(await (await fetch('https://k5.vicicode.cn/diyapi/bl.json')).text())!.latest;
    state.blName = latestVersion;
    const fontPacket = await fetch('https://k5.vicicode.cn/diyapi/' + latestVersion);
    if(fontPacket.body){
      const reader = fontPacket.body.getReader();
      const chunks = [];
      while(true) {
        const {done, value} = await reader.read();
        if (done) {
          break;
        }
        chunks.push(...value)
      }
      let bl = new Uint8Array(0x3000);
      bl.set(chunks, 0);
      state.bl = bl;
      setLoading(false);
    }
  }

  const readConfig = () =>{

  }

  const writeConfig = async () => {
    if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
    const eepromSize = await check_eeprom(appStore.connectPort, appStore.configuration?.uart);
    setLoading(true);
    if(eepromSize < 0x80000){
      alert("只支持 4Mbit 以上 EEPROM 写入");
      setLoading(false);
      return
    }
    await eeprom_init(appStore.connectPort);
    await writeRange(0x41000, state.bl, '引导程序');

    const firmware = [];
    for(let i = 256; i < 4096; i++){
      if(state.calendar[i] >= 0){
        console.log(i);
        firmware.push({
          ...state.rom[state.calendar[i]],
          start: 0x40000 + i * 0x40,
          end: 0x40000 + (i + Math.ceil(state.rom[state.calendar[i]].binaryFile.length / 0x40)) * 0x40 - 1,
        })
        i += Math.ceil(state.rom[state.calendar[i]].binaryFile.length / 0x40) - 1;
      }
    }
    await writeRange(0x40000, new Uint8Array([firmware.length]), '固件数量');

    const _name_bl_array = new Uint8Array(8);
    _name_bl_array.set(stringToUint8Array(state.blName.split('.')[0]))
    await writeRange(0X40008, _name_bl_array, '引导程序版本')

    const writeMeta: any = [];
    firmware.map((item: any)=>{
      const _meta_name = new Uint8Array(16)
      const _meta_address_start = new Uint8Array(4)
      const _meta_address_end = new Uint8Array(4)
      _meta_name.set(stringToUint8Array(item.binaryName.replace(/[^\x00-\xff]/g, '')))
      _meta_address_start.set(hexReverseStringToUint8Array((item.start).toString(16)));
      _meta_address_end.set(hexReverseStringToUint8Array((item.end).toString(16)));
      writeMeta.push(..._meta_name, ..._meta_address_start, ..._meta_address_end, ...new Uint8Array(8))
    })
    await writeRange(0x40020, writeMeta, '固件元数据')

    for(let i = 0; i < firmware.length; i++){
      await writeRange(firmware[i].start, firmware[i].binaryFile, firmware[i].binaryName + ' 固件文件')
    }

    await eeprom_reboot(appStore.connectPort);
    state.status = state.status + "写入完成<br/>";
    setLoading(false);
  }

  const selectFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = async () => {
      if(input.files){
        for(let i = 0; i < input.files.length; i++){
          const blob = new Blob([input.files[i]], { type: 'application/octet-stream' });
          const rawEEPROM = new Uint8Array(await blob.arrayBuffer());
          const firmware = {
            binaryFile: unpack(rawEEPROM),
            binaryName: input.files[i].name.replace(/[^\x00-\xff]/g, ''),
            color: getColor()
          }
          state.rom.push(firmware)
        }
      }
    };
    input.click();
  }

  const targetOver = (can: number, slot: any) => {
    if(slot < 256){
      return
    }
    if(slot + Math.ceil(state.rom[state.nowDrag].binaryFile.length / 0x40) > 4096){
      return
    }
    if(can == 2){
      return
    }
    for(let i = slot; i < slot + Math.ceil(state.rom[state.nowDrag].binaryFile.length / 0x40); i += 1){
      clearEp(i);
    }
    for(let i = slot; i < slot + Math.ceil(state.rom[state.nowDrag].binaryFile.length / 0x40); i += 1){
      state.calendar[i] = state.nowDrag
    }
    console.log((slot * 64 + 0x40000).toString(16))
    console.log((Math.ceil(state.rom[state.nowDrag].binaryFile.length / 0x40) * 0x40 + (slot * 64 + 0x40000) - 1).toString(16))
  }

  const getColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const clearEp = (i: number) => {
    if(i > 4095 || i < 256){
      return
    }
    let flag = 0
    if(state.calendar[i] != -1){
      flag = 1
      state.calendar[i] = -1
    }
    if(flag){
      if(state.calendar[i - 1] != -1){
        clearEp(i - 1)
      }
      if(state.calendar[i + 1] != -1){
        clearEp(i + 1)
      }
    }
  }

  const clearEp2 = (i: number) => {
    if(i > 4095 || i < 256){
      return
    }
    let flag = -99
    if(state.calendar[i] != -1){
      flag = state.calendar[i]
      state.calendar[i] = -1
    }
    if(state.calendar[i - 1] === flag){
      clearEp2(i - 1)
    }
    if(state.calendar[i + 1] === flag){
      clearEp2(i + 1)
    }
  }

  const clearAll = (i: number) => {
    if(i > 4095 || i < 256){
      return
    }
    state.calendar[i] = -1
    clearAll(i + 1)
  }

  const changeName = (val: any) => {
    state.rom[val].binaryName = state.rom[val].binaryName.replace(/[^\x00-\xff]/g, '')
  };
  </script>
  
  <script lang="ts">
    export default {
      name: 'BL',
    };
  </script>
  
  <style scoped lang="less">
    :deep(::-webkit-scrollbar-thumb){
      border-radius: 0 !important;
    }
    :deep(.scrollbar::-webkit-scrollbar) {
      height: 10px;
    }
    :deep(.t-table__content::-webkit-scrollbar) {
      height: 15px;
    }
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
    .ttable {
      :deep(.t-table__affixed-header-elm-wrap){
        height: 60px !important;
      }
      :deep(.t-table__content){
        scrollbar-width: auto !important;
      }
    }
  </style>
  