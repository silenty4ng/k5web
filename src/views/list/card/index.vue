<template>
  <div class="container">
    <Breadcrumb :items="['小工具', '备份/还原']" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" title="备份/还原">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" title="快捷备份">
            <a-space>
              <a-button type="primary" @click="backupConfig">备份配置</a-button>
              <a-button @click="restoreConfig">恢复配置</a-button>
              <a-button type="primary" @click="backupCalibration">备份校准</a-button>
              <a-button @click="restoreCalibration">恢复校准</a-button>
            </a-space>
          </a-tab-pane>
          <a-tab-pane key="2" title="完整备份">
              <a-space>
                <a-button type="primary" @click="backup">备份</a-button>
                <a-button @click="restore">恢复</a-button>
                <a-select v-model="state.eepromType" :style="{width:'320px'}" placeholder="选择EEPROM大小">
                  <a-option value="1">8KB（64Kbit）</a-option>
                  <a-option value="2">128KB（1Mbit）</a-option>
                  <a-option value="3">256KB（2Mbit）</a-option>
                  <a-option value="4">512KB（4Mbit）</a-option>
                </a-select>
                <a-button type="text" @click="checkEeprom">自动检测</a-button>
              </a-space>
          </a-tab-pane>
        </a-tabs>
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
import { check_eeprom, eeprom_read, eeprom_write, eeprom_reboot, eeprom_init } from '@/utils/serial.js';

const appStore = useAppStore();

const state = reactive({
  status: "点击备份按钮将生成 EEPROM 备份文件<br/><br/>",
  eepromType: ""
})

const checkEeprom = async () => {
  if(appStore.connectState != true){alert('请先连接手台！'); return;};
  await check_eeprom();
}

const backupRange = async (start: any, end: any, name: any = new Date() + '_backup.bin') =>{
  await eeprom_init(appStore.connectPort);
  let rawEEPROM = new Uint8Array(end - start);
  for (let i = start; i < end; i += 0x80) {
    const data = await eeprom_read(appStore.connectPort, i);
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
  input.onchange = async() => {
    const blob = new Blob([input.files[0]], {type: 'application/octet-stream' });
    const rawEEPROM = new Uint8Array(await blob.arrayBuffer());
    for (let i = start; i < input.files[0].size + start; i += 0x80) {
      await eeprom_write(appStore.connectPort, i, rawEEPROM.slice(i - start, i - start + 0x80));
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
  if(appStore.connectState != true){alert('请先连接手台！'); return;};
  await backupRange(0, 0x1E00, 'config.bin')
}
const backupCalibration = async() => {
  if(appStore.connectState != true){alert('请先连接手台！'); return;};
  await backupRange(0x1E00, 0x2000, 'calibration.bin')
}

const restoreConfig = async() =>{
  if(appStore.connectState != true){alert('请先连接手台！'); return;};
  await restoreRange()
}
const restoreCalibration = async() =>{
  if(appStore.connectState != true){alert('请先连接手台！'); return;};
  await restoreRange(0x1E00)
}

const backup = async() => {
  if(appStore.connectState != true){alert('请先连接手台！'); return;};
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
  await backupRange(0, _max)
}

const restore = async() => {
  if(appStore.connectState != true){alert('请先连接手台！'); return;};
  await restoreRange()
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
