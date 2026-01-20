<template>
  <div class="container">
    <Breadcrumb :items="[$t('menu.list'), $t('menu.flash')]" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" :title="$t('menu.flash') + $t('global.onBoot')">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <a-space>
                <a-button :disabled="state.isFlashing" @click="selectFile">{{ state.binaryFile ? state.binaryName : $t('tool.selectFirmware') }}</a-button>
                <a-button type="primary" :disabled="!state.binaryFile || state.isFlashing" @click="flashIt">{{ $t('tool.flash') }}</a-button>
              </a-space>
            </div>
            <div>
              <a-radio-group type="button" size="mini" v-model="state.protocol">
                <a-radio value="Official">Official</a-radio>
                <a-radio value="K1">K1</a-radio>
                <a-radio value="UVE5">UVE5</a-radio>
              </a-radio-group>
            </div>
          </div>
          <a-divider />
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <div style="color: var(--color-text-2);">进度条</div>
              <div style="color: var(--color-text-1); font-weight: bold;">{{ state.progress.toFixed(1) }}%</div>
            </div>
            <a-progress :percent="state.progress / 100" :show-text="false" />
            <div style="margin-top: 6px; color: var(--color-text-3);">{{ state.phase }}</div>
          </div>
          <div id="statusArea" style="height: 20em; background-color: var(--color-bg-3); color: var(--color-text-3); overflow: auto; padding: 20px"
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
import { disconnect, connect, readPacket, sendPacket, unpackVersion, unpack, flash_generateCommand, readPacketNoVerify, flash_generateK1Command, uve5_flashFirmware } from '@/utils/serial.js';
import { DialogPlugin } from 'tdesign-vue-next';

const appStore = useAppStore();

const state : {
  status: any,
  binaryName: any,
  binaryFile: any,
  protocol: string,
  progress: number,
  phase: string,
  isFlashing: boolean
} = reactive({
  status: "点击更新按钮更新固件到设备<br/><br/>",
  binaryFile: undefined,
  binaryName: '',
  protocol: 'Official',
  progress: 0,
  phase: '',
  isFlashing: false
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
  const confirmDialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '提示',
    body: '泉盛 K5/K6 当前在售两个硬件版本，如使用第三方固件请先与商家确认可以升级到第三方固件。',
    className: 't-dialog-new-class1 t-dialog-new-class2',
    style: 'color: rgba(0, 0, 0, 0.6)',
    confirmBtn: '我知道了',
    cancelBtn: null,
    closeBtn: false,
    onConfirm: () => { confirmDialog.destroy() },
    closeOnEscKeydown: false,
    closeOnOverlayClick: false
  })
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

  // Throttle status DOM updates to avoid UI stalls during high-frequency logs.
  const statusMaxChars = 200_000;
  let statusPending: string[] = [];
  let statusFlushTimer: number | null = null;
  const flushStatus = () => {
    statusFlushTimer = null;
    if (!statusPending.length) return;
    state.status = state.status + statusPending.join('<br/>') + '<br/>';
    statusPending = [];
    if (typeof state.status === 'string' && state.status.length > statusMaxChars) {
      state.status = state.status.slice(-Math.floor(statusMaxChars * 0.75));
    }
    nextTick(()=>{
      const textarea = document?.getElementById('statusArea');
      if(textarea)textarea.scrollTop = textarea?.scrollHeight;
    })
  }
  const appendStatus = (line: string) => {
    statusPending.push(line);
    if (statusFlushTimer === null) {
      statusFlushTimer = window.setTimeout(flushStatus, 50);
    }
  }

  if (state.isFlashing) return;
  state.isFlashing = true;
  state.progress = 0;
  state.phase = '';

  if(appStore.connectPort){
    await disconnect(appStore.connectPort);
  }

  const baudRate = state.protocol === 'UVE5' ? 115200 : 38400;
  let _connect: any = null;
  try {
    _connect = await connect(baudRate);
    if(!_connect){
      appendStatus('串口连接失败');
      return;
    }

    if(state.protocol === 'UVE5'){
      state.phase = '刷写中...';
      appendStatus('UVE5：开始刷写（115200bps）');
      let lastLoggedPctInt = -1;
      await uve5_flashFirmware(_connect, state.binaryFile, {
        onLog: (msg: string) => {
          appendStatus(msg);
        },
        onProgress: (sent: number, total: number) => {
          const pct = total > 0 ? (sent / total) * 100 : 0;
          const pctFixed = Math.min(100, Math.max(0, Number(pct.toFixed(1))));
          state.progress = pctFixed;
          state.phase = `刷写中... ${pctFixed.toFixed(1)}%`;

          // 避免刷屏：只在整数百分比变化时输出一次（以及 0%/100%）
          const pctInt = Math.floor(pctFixed);
          if (pctInt !== lastLoggedPctInt || pctInt === 0 || pctInt === 100) {
            lastLoggedPctInt = pctInt;
            appendStatus(`更新进度 ${pctFixed.toFixed(1)}%`);
          }
        }
      })
      state.progress = 100;
      state.phase = '完成';
      appendStatus('UVE5：固件刷写完成');
      return;
    }

  if(state.protocol == 'Official'){
    await readPacket(_connect, 0x18, 1000);
  }
  if(state.protocol == 'K1'){
    await readPacketNoVerify(_connect);
  }
  const rawVersion = unpackVersion(state.binaryFile);
  const _data = new Uint8Array([0x30, 0x5, rawVersion.length, 0x0, ...rawVersion]);

  if(state.protocol == 'Official' || state.protocol == 'K1'){
    if(state.protocol == 'K1'){
      await sendPacket(_connect, _data);
      await readPacketNoVerify(_connect);
    }else{
      await sendPacket(_connect, [48,5,16,0,42,79,69,70,87,45,76,79,83,69,72,85,0,0,0,0]); // 发送固定握手数据
      await readPacket(_connect, 0x18);
    }
  }
  
  const firmware = unpack(state.binaryFile);
  
  if (firmware.length > 0xf000 && state.protocol == 'Official') {
    alert('最后的边界检查失败。不管是谁修改了代码，他都是个白痴。');
    throw new Error('Last resort boundary check failed. Whoever touched the code is an idiot.');
  }

  for (let i = 0; i < firmware.length; i += 0x100) {
      const data = firmware.slice(i, i + 0x100);
      let command = undefined;
      if(state.protocol == 'K1'){
        command = flash_generateK1Command(data, i, firmware.length);
      }else{
        command = flash_generateCommand(data, i, firmware.length);
      }
      try {
          await sendPacket(_connect, command);
          if(state.protocol == 'Official'){
            await readPacket(_connect, 0x1a);
          }else{
            await readPacketNoVerify(_connect, 10 * 1000);
          }
      } catch (e) {
          console.log('Flash command rejected. Aborting.');
          return Promise.reject(e);
      }

      appendStatus(`更新进度 ${((i / firmware.length) * 100).toFixed(1)}%`)
      state.progress = Math.min(100, Math.max(0, Number((((i / firmware.length) * 100)).toFixed(1))));
  }
  appendStatus("更新进度 100.0%");
  state.progress = 100;
  appendStatus("固件更新成功");
  flushStatus();
  }
  catch(e: any){
    state.phase = '失败';
    appendStatus(`${state.protocol}：失败 - ${e?.message ?? e}`);
    flushStatus();
  }
  finally {
    try {
      if (_connect) await disconnect(_connect);
    } catch {}
    appStore.updateSettings({ connectState: false });
    state.isFlashing = false;
  }
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
