<template>
  <div class="container">
    <Breadcrumb :items="['小工具', '开机图片']" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-spin :loading="state.loading" tip="写入中..." style="width: 100%;">
          <a-card class="general-card" title="开机图片">
            <a-tabs :active-key="state.activeKey" @change="(e)=>{state.activeKey = e}">
              <a-tab-pane :key="1" title="LOSEHU 117"></a-tab-pane>
              <a-tab-pane :key="2" title="LOSEHU 118+"></a-tab-pane>
            </a-tabs>
            <div id="canvasDiv" style="zoom: 250%;"></div>
            <br>
            <a-space>
              <a-button @click="selectFile">选择图片</a-button>
              <a-button type="primary" :disabled="!state.binaryFile" @click="flashIt">写入</a-button>
            </a-space>
          </a-card>
        </a-spin>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, nextTick } from 'vue';
import { useAppStore } from '@/store';
import { eeprom_write, eeprom_reboot, eeprom_init } from '@/utils/serial.js';

const appStore = useAppStore();

const state : {
  activeKey: any,
  binaryFile: any,
  loading: boolean
} = reactive({
  activeKey: 1,
  binaryFile: undefined,
  loading: false
})

const selectFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = async () => {
    const blob = new Blob([input.files[0]], { type: 'application/octet-stream' });
    const file = URL.createObjectURL(blob);
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    const canvas2 = canvas.cloneNode();
    const canvasDiv = document.getElementById('canvasDiv');
    canvasDiv.innerHTML = "";
    canvasDiv?.append(canvas, canvas2);
    
    const img = new Image()
    img.src = file;
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, 128, 64);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
      function getPixel(x: any, y: any) {
          const index = y * 128 + x;
          const i = index * 4;
          return imageData[i] + imageData[i + 1] + imageData[i + 2] > 128 * 3 ? 0 : 1;
      }

      const ctx2 = canvas2.getContext('2d');
      const imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
      for (let y = 0; y < 64; y++) {
          for (let x = 0; x < 128; x++) {
              const index = y * 128 + x;
              const i = index * 4;
              const pixel = !getPixel(x, y);
              imageData2.data[i] = pixel * 255;
              imageData2.data[i + 1] = pixel * 255;
              imageData2.data[i + 2] = pixel * 255;
              imageData2.data[i + 3] = 255;
          }
      }
      ctx2.putImageData(imageData2, 0, 0);

      const outputArray = new Uint8Array(1024);
      // getPixel(i) outputs the pixel value for any x y coordinate. 0 = black, 1 = white.
      // the outputArray is 1024 bytes, where each byte is 8 pixels IN VERTICAL ORDER.

      let i = 0;
      for (let y = 0; y < 64; y += 8) {
          for (let x = 0; x < 128; x++) {
              let byte = 0;
              for (let i = 0; i < 8; i++) {
                  byte |= getPixel(x, y + i) << i;
              }
              outputArray[i++] = byte;
          }
      }

      state.binaryFile = outputArray;
    }
  };
  input.click();
}

const flashIt = async () => {
  if(appStore.connectState != true){alert('请先连接手台！'); return;};
  state.loading = true
  let position = 0x1E350;
  if(state.activeKey == 2)position = 0x2080;
  await eeprom_init(appStore.connectPort);
  const rawEEPROM = state.binaryFile;
  for (let i = position; i < rawEEPROM.length + position; i += 0x80) {
    await eeprom_write(appStore.connectPort, i, rawEEPROM.slice(i - position, i - position + 0x80));
  }
  await eeprom_reboot(appStore.connectPort);
  state.loading = false
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
