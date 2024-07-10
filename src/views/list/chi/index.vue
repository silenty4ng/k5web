<template>
  <div class="container">
    <Breadcrumb :items="[$t('menu.list'), $t('menu.font')]" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card">
          <template #title>
            <span @click="()=>{state.showHide += 1}">{{ $t('menu.font') + $t('global.onStart') }}</span>
          </template>
          <a-space>
            <t-card bordered style="width: 420px;">
              <template #header>
                {{ $t('tool.fontwrite') }}
                <div>
                  <a-radio-group type="button" size="mini" v-model="state.lang">
                    <a-radio value="Simplified_Chinese">{{$t('tool.Simplified_Chinese')}}</a-radio>
                    <a-radio value="Traditional_Chinese">{{$t('tool.Traditional_Chinese')}}</a-radio>
                  </a-radio-group>
                </div>
              </template>
              <div>
                <a-button v-show="state.lang == 'Simplified_Chinese'" @click="restore(1)">{{ $t('tool.writefontwrite') }}</a-button>
                <a-button v-show="state.lang == 'Traditional_Chinese'" @click="restore(6)">{{ $t('tool.writefontwrite') }}</a-button>
              </div>
            </t-card>
            <t-card bordered>
              <template #header>
                {{ $t('tool.pinyinwrite') }}
              </template>
              <a-space>
                <a-button @click="restore(4)">{{ $t('tool.writepinyin') }}</a-button>
              </a-space>
            </t-card>
            <t-card bordered>
              <template #header>
                {{ $t('tool.ssbpatch') }}
              </template>
              <a-space>
                <a-button @click="restore(5)">{{ $t('tool.writessbpatch') }}</a-button>
              </a-space>
            </t-card>
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
import { eeprom_write, eeprom_reboot, eeprom_init, check_eeprom } from '@/utils/serial.js';

const appStore = useAppStore();

const state = reactive({
  status: "点击写入按钮写入字库到设备<br/><br/>",
  eepromType: "",
  showHide: 0,
  lang: 'Simplified_Chinese'
})

const restoreRange = async (start: any = 0, uint8Array: any) => {
  await eeprom_init(appStore.connectPort);
  for (let i = start; i < uint8Array.length + start; i += 0x80) {
    await eeprom_write(appStore.connectPort, i, uint8Array.slice(i - start, i - start + 0x80), uint8Array.slice(i - start, i - start + 0x80).length, appStore.configuration?.uart);
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
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  if(appStore.configuration?.uart == "official"){
    alert(sessionStorage.getItem('noticeVersionNoSupport'));
    return;
  }
  state.status = state.status + "正在下载字库...<br />"
  let fontPacket = undefined
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
  if(type == 5){
    const eepromSize = await check_eeprom(appStore.connectPort, appStore.configuration?.uart);
    if(eepromSize != 0x40000 && eepromSize != 0x80000){
      state.status = state.status + "只支持 2Mbit 以上 EEPROM 写入<br/>";
      return
    }
    fontPacket = await fetch('/ssb.bin')
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
    await restoreRange(0x3C228, binary)
    return;
  }
  if(type == 1){
    if(appStore.configuration?.charset == "losehu"){
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
    if(appStore.configuration?.charset == "gb2312"){
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
  }
  if(type == 6){
    if(appStore.configuration?.charset == "gb2312"){
      fontPacket = await fetch('/new_font_k_f.bin')
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
    }else{
      alert('不支持的版本')
    }
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
