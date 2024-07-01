<template>
  <div class="container">
    <Breadcrumb :items="[$t('menu.list'), $t('menu.flash')]" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" :title="$t('menu.flash') + $t('global.onBoot')">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <a-space>
                <a-button @click="selectFile">{{ state.binaryFile ? state.binaryName : $t('tool.selectFirmware') }}</a-button>
                <a-button type="primary" :disabled="!state.binaryFile" @click="flashIt">{{ $t('tool.flash') }}</a-button>
              </a-space>
            </div>
            <div>
              <a-radio-group type="button" size="mini" v-model="state.protocol">
                <a-radio value="Official">Official</a-radio>
                <a-radio value="Losehu">Losehu</a-radio>
              </a-radio-group>
            </div>
          </div>
          <a-divider />
          <div id="statusArea" style="height: 20em; background-color: azure; color: silver; overflow: auto; padding: 20px"
            v-html="state.status"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/store';
import { disconnect, connect, readPacket, sendPacket, unpackVersion, unpack, flash_generateCommand, readPacketNoVerify } from '@/utils/serial.js';

const appStore = useAppStore();

const state : {
  status: any,
  binaryName: any,
  binaryFile: any,
  protocol: string
} = reactive({
  status: "点击更新按钮更新固件到设备<br/><br/>",
  binaryFile: undefined,
  binaryName: '',
  protocol: 'Official'
})

const route = useRoute();

onMounted(async ()=>{
  if(route.query.url){
    const packet = await fetch(route.query.url)
    const reader = packet?.body?.getReader();
    if(reader){
      const chunks = [];
      while(true) {
        const {done, value} = await reader.read();
        if (done) {
          break;
        }
        chunks.push(...value)
      }
      const binary = new Uint8Array(chunks)
      state.binaryFile = binary
      state.binaryName = route.query.url.substring(route.query.url.lastIndexOf('/') + 1).split('?')[0] + ' '
    }
  }
})

const selectFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = async () => {
    const blob = new Blob([input.files[0]], { type: 'application/octet-stream' });
    const rawEEPROM = new Uint8Array(await blob.arrayBuffer());
    state.binaryFile = rawEEPROM
    state.binaryName = input.files[0].name
  };
  input.click();
}

const flashIt = async () => {
  if(!state.binaryFile){
    alert('请选择文件');
    return;
  }
  if(appStore.connectPort){
    await disconnect(appStore.connectPort);
  }
  let _connect = await connect();
  await readPacket(_connect, 0x18, 1000);
  const rawVersion = unpackVersion(state.binaryFile);
  const _data = new Uint8Array([0x30, 0x5, rawVersion.length, 0x0, ...rawVersion]);
  await sendPacket(_connect, _data);
  await readPacket(_connect, 0x18)

  if(state.protocol == 'Official'){
    await sendPacket(_connect, _data);
    await readPacket(_connect, 0x18);
  }
  
  const firmware = unpack(state.binaryFile);
  
  if (firmware.length > 0xefff) throw new Error('Last resort boundary check failed. Whoever touched the code is an idiot.');

  for (let i = 0; i < firmware.length; i += 0x100) {
      const data = firmware.slice(i, i + 0x100);
      const command = flash_generateCommand(data, i, firmware.length);

      try {
          await sendPacket(_connect, command);
          if(state.protocol == 'Official'){
            await readPacket(_connect, 0x1a);
          }else{
            await readPacketNoVerify(_connect);
          }
      } catch (e) {
          console.log('Flash command rejected. Aborting.');
          return Promise.reject(e);
      }

      state.status = state.status + `更新进度 ${((i / firmware.length) * 100).toFixed(1)}%<br/>`
      nextTick(()=>{
        const textarea = document?.getElementById('statusArea');
        if(textarea)textarea.scrollTop = textarea?.scrollHeight;
      })
  }
  state.status = state.status + "更新进度 100.0%<br/>";
  state.status = state.status + "固件更新成功";
  nextTick(()=>{
    const textarea = document?.getElementById('statusArea');
    if(textarea)textarea.scrollTop = textarea?.scrollHeight;
  })
  disconnect(_connect);
  appStore.updateSettings({ connectState: false });
}
</script>

<script lang="ts">
export default {
  name: 'Flash',
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
