<template>
  <div class="container">
    <Breadcrumb :items="['小工具', '备份/还原']" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" title="备份/还原">
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
import { check_eeprom, eeprom_read, eeprom_write, eeprom_reboot } from '@/utils/serial.js';

const appStore = useAppStore();

const state = reactive({
  status: "点击备份按钮将生成EEPROM备份文件<br/><br/>",
  eepromType: ""
})

const checkEeprom = async () => {
  await check_eeprom();
}

const backup = async() => {
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
  let rawEEPROM = new Uint8Array(_max);
  for (let i = 0; i < _max; i += 0x80) {
    const data = await eeprom_read(appStore.connectPort, i);
    rawEEPROM.set(data, i);
    state.status = state.status + "备份进度：" + ((i / _max) * 100).toFixed(1) + "%<br/>";
    nextTick(()=>{
      const textarea = document?.getElementById('statusArea');
      if(textarea)textarea.scrollTop = textarea?.scrollHeight;
    })
  }
  state.status = state.status + "备份进度：100%<br/>";
  nextTick(()=>{
    const textarea = document?.getElementById('statusArea');
    if(textarea)textarea.scrollTop = textarea?.scrollHeight;
  })
  console.log(rawEEPROM);
  const blob = new Blob([rawEEPROM], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = new Date() + '_backup.bin';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const restore = async() => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = async() => {
    const blob = new Blob([input.files[0]], {type: 'application/octet-stream' });
    const rawEEPROM = new Uint8Array(await blob.arrayBuffer());
    for (let i = 0; i < input.files[0].size; i += 0x80) {
      await eeprom_write(appStore.connectPort, i, rawEEPROM.slice(i, i + 0x80));
      state.status = state.status + "恢复进度：" + ((i / input.files[0].size) * 100).toFixed(1) + "%<br/>";
      nextTick(()=>{
        const textarea = document?.getElementById('statusArea');
        if(textarea)textarea.scrollTop = textarea?.scrollHeight;
      })
    }
    state.status = state.status + "恢复进度：100%<br/>";
    eeprom_reboot(appStore.connectPort);
  };
  input.click();
}
</script>

<script lang="ts">
  export default {
    name: 'Card',
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
