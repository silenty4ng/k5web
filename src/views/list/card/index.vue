<template>
  <div class="container">
    <Breadcrumb :items="[$t('menu.list'), $t('menu.rb')]" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card">
          <template #title>
            <span @click="()=>{state.showHide += 1}">{{ $t('menu.rb') + $t('global.onStart') }}</span>
          </template>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" :title="$t('tool.quickbackup')">
            <a-space>
              <a-button type="primary" @click="backupConfig">{{ $t('tool.backupConfig') }}</a-button>
              <a-button @click="restoreConfig">{{ $t('tool.restoreConfig') }}</a-button>
              <a-button type="primary" @click="backupCalibration">{{ $t('tool.backupCalibration') }}</a-button>
              <a-button @click="restoreCalibration">{{ $t('tool.restoreCalibration') }}</a-button>
            </a-space>
          </a-tab-pane>
          <a-tab-pane key="2" :title="$t('tool.fullbackup')">
              <a-space>
                <a-button type="primary" @click="backup">{{ $t('tool.backup') }}</a-button>
                <a-input v-show="state.showHide >= 5" v-model="state.startInfo" />
                <a-button @click="restore">{{ $t('tool.restore') }}</a-button>
                <a-select v-model="state.eepromType" :style="{width:'320px'}" :placeholder="$t('tool.selectSize')">
                  <a-option value="1">{{ $t('global.8kb') }}</a-option>
                  <a-option value="2">{{ $t('global.128kb') }}</a-option>
                  <a-option value="3">{{ $t('global.256kb') }}</a-option>
                  <a-option value="4">{{ $t('global.512kb') }}</a-option>
                </a-select>
                <a-button type="text" @click="checkEeprom">{{ $t('tool.autocheck') }}</a-button>
              </a-space>
          </a-tab-pane>
          <a-tab-pane key="3" :title="$t('tool.cleardata')">
            <a-space>
              <a-button type="primary" @click="showClearDialog">{{ $t('tool.cleardata') }}</a-button>
            </a-space>
          </a-tab-pane>
        </a-tabs>
        <a-divider />
        <div id="statusArea" style="height: 20em; background-color: azure; color: silver; overflow: auto; padding: 20px" v-html="state.status"></div>
        </a-card>
      </a-col>
    </a-row>
    <t-dialog
      v-model:visible="state.showDialog"
      theme="warning"
      :header="state.dialogTitle >= 3 ? $t('tool.first') + state.dialogTitle + $t('tool.firstTitle') + $t('tool.last') : $t('tool.first') + state.dialogTitle + $t('tool.firstTitle')"
      :body="$t('tool.clearMessage')"
      @confirm="onClickConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, nextTick } from 'vue';
import { useAppStore } from '@/store';
import { check_eeprom, eeprom_read, eeprom_write, eeprom_reboot, eeprom_init } from '@/utils/serial.js';

const appStore = useAppStore();

const state = reactive({
  status: "点击备份按钮将生成 EEPROM 备份文件<br/><br/>",
  eepromType: "",
  showHide: 0,
  startInfo: "0x00",
  showDialog: false,
  dialogTitle: 1
})

const onClickConfirm = () => {
  if(state.dialogTitle >= 3){
    state.showDialog = false;
    clearEEPROM();
    return;
  }
  state.dialogTitle += 1;
}

const showClearDialog = () => {
  state.dialogTitle = 1;
  state.showDialog = true;
}

const checkEeprom = async () => {
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  const eepromSize = await check_eeprom(appStore.connectPort, appStore.configuration?.uart);
  switch(eepromSize){
    case 0x2000:
      state.eepromType = "1";
      break;
    case 0x20000:
      state.eepromType = "2";
      break;
    case 0x40000:
      state.eepromType = "3";
      break;
    case 0x80000:
      state.eepromType = "4";
      break;
    default:
      break;
  }
}

const clearEEPROM = async () => {
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  const eepromSize = await check_eeprom(appStore.connectPort, appStore.configuration?.uart);
  let rawEEPROM = new Uint8Array(0x80).fill(0xff);
  for (let i = 0; i < eepromSize; i += 0x80) {
    await eeprom_write(appStore.connectPort, i, rawEEPROM, 0x80, appStore.configuration?.uart);
    state.status = state.status + "清空进度：" + (((i - 0) / eepromSize) * 100).toFixed(1) + "%<br/>";
    nextTick(()=>{
      const textarea = document?.getElementById('statusArea');
      if(textarea)textarea.scrollTop = textarea?.scrollHeight;
    })
  }
  await eeprom_reboot(appStore.connectPort);
}

const backupRange = async (start: any, end: any, name: any = new Date() + '_backup.bin') =>{
  await eeprom_init(appStore.connectPort);
  let rawEEPROM = new Uint8Array(end - start);
  for (let i = start; i < end; i += 0x80) {
    const data = await eeprom_read(appStore.connectPort, i, 0x80, appStore.configuration?.uart);
    rawEEPROM.set(data, i - start);
    state.status = state.status + "备份进度：" + (((i - start) / rawEEPROM.length) * 100).toFixed(1) + "%<br/>";
    nextTick(()=>{
      const textarea = document?.getElementById('statusArea');
      if(textarea)textarea.scrollTop = textarea?.scrollHeight;
    })
  }
  state.status = state.status + "备份进度：100.0%<br/>";
  nextTick(()=>{
    const textarea = document?.getElementById('statusArea');
    if(textarea)textarea.scrollTop = textarea?.scrollHeight;
  })
  console.log(rawEEPROM);
  const blob = new Blob([rawEEPROM], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const restoreRange = async (start: any = 0) => {
  await eeprom_init(appStore.connectPort);
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.bin';
  input.onchange = async() => {
    const blob = new Blob([input.files[0]], {type: 'application/octet-stream' });
    const rawEEPROM = new Uint8Array(await blob.arrayBuffer());
    for (let i = start; i < input.files[0].size + start; i += 0x80) {
      await eeprom_write(appStore.connectPort, i, rawEEPROM.slice(i - start, i - start + 0x80), 0x80, appStore.configuration?.uart);
      state.status = state.status + "恢复进度：" + (((i - start) / input.files[0].size) * 100).toFixed(1) + "%<br/>";
      nextTick(()=>{
        const textarea = document?.getElementById('statusArea');
        if(textarea)textarea.scrollTop = textarea?.scrollHeight;
      })
    }
    state.status = state.status + "恢复进度：100.0%<br/>";
    await eeprom_reboot(appStore.connectPort);
  };
  input.click();
}

const backupConfig = async() => {
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  await backupRange(0, 0x1E00, 'config.bin')
}
const backupCalibration = async() => {
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  await backupRange(0x1E00, 0x2000, 'calibration.bin')
}

const restoreConfig = async() =>{
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  await restoreRange()
}
const restoreCalibration = async() =>{
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  await restoreRange(0x1E00)
}

const backup = async() => {
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  let _max = 0x2000;
  switch(state.eepromType){
    case "1":
      _max = 0x2000;
      break;
    case "2":
      _max = 0x20000;
      break;
    case "3":
      _max = 0x40000;
      break;
    case "4":
      _max = 0x80000;
      break;
    default:
      _max = 0x2000;
  }
  if(appStore.configuration?.uart == "official" && _max >= 0x20000){
    alert('该固件不支持备份扩容空间');
    return;
  }
  await backupRange(0, _max)
}

const restore = async() => {
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  await restoreRange(parseInt(state.startInfo))
}
</script>

<script lang="ts">
  export default {
    name: 'Backup',
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
