<template>
  <div class="container">
    <Breadcrumb :items="['小工具', '字库写入']" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card">
          <template #title>
            <span @click="()=>{state.showHide += 1}">字库写入</span>
          </template>
          <a-space>
            <a-button @click="restore(1)">写入 117 字库</a-button>
            <a-button @click="restore(2)">写入 118+ 字库</a-button>
            <!-- <a-button @click="restore(3)">写入 118+ 字库（H）</a-button> -->
            <a-button @click="restore(4)">写入拼音检索表（2Mbit EEPROM可用）</a-button>
            <!-- <a-button v-show="state.showHide >= 5" @click="restore(5)">写入拼音检索表（测试）</a-button> -->
          </a-space>
          <a-divider />
          <div id="statusArea" style="height: 20em; background-color: azure; color: silver; overflow: auto; padding: 20px" v-html="state.status"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, nextTick } from 'vue';
import { useAppStore } from '@/store';
import { eeprom_write, eeprom_reboot, eeprom_init } from '@/utils/serial.js';

const appStore = useAppStore();

const state = reactive({
  status: "点击写入按钮写入字库到设备<br/><br/>",
  eepromType: "",
  showHide: 0
})

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

const restore = async(type: any = 1) => {
  if(appStore.connectState != true){alert('请先连接手台！'); return;};
  if(appStore.configuration?.uart == "official"){
    alert('固件版本不匹配');
    return;
  }
  if((type == 1 && appStore.configuration?.charset != "losehu") || (type == 1 && appStore.configuration?.K != true)){
    alert('固件版本不匹配');
    return;
  }
  if(type == 2 && appStore.configuration?.charset != "gb2312"){
    alert('固件版本不匹配');
    return;
  }
  state.status = state.status + "正在下载字库...<br />"
  let fontPacket = undefined
  if(type == 1){
    fontPacket = await fetch('/old_font.bin')
    const reader = fontPacket.body.getReader();
    const chunks = [];
    while(true) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      chunks.push(...value)
    }
    const binary = new Uint8Array(chunks)
    await restoreRange(0x02000, binary)
    return;
  }
  if(type == 2){
    fontPacket = await fetch('/new_font_k.bin')
    const reader = fontPacket.body.getReader();
    const chunks = [];
    while(true) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      chunks.push(...value)
    }
    const binary = new Uint8Array(chunks)
    await restoreRange(0x02480, binary)
    return;
  }
  if(type == 3){
    fontPacket = await fetch('/new_font_h.bin')
    const reader = fontPacket.body.getReader();
    const chunks = [];
    while(true) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      chunks.push(...value)
    }
    const binary = new Uint8Array(chunks)
    await restoreRange(0x02480, binary)
    return;
  }
  if(type == 4){
    if(appStore.configuration?.newpinyin){
      fontPacket = await fetch('/pinyin_plus.bin')
    }else{
      fontPacket = await fetch('/pinyin.bin')
    }
    const reader = fontPacket.body.getReader();
    const chunks = [];
    while(true) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      chunks.push(...value)
    }
    const binary = new Uint8Array(chunks)
    await restoreRange(0x20000, binary)
    return;
  }
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
