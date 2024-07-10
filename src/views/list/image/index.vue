<template>
  <div class="container">
    <Breadcrumb :items="[$t('menu.list'), $t('menu.image')]" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-spin :loading="state.loading" tip="写入中..." style="width: 100%;">
          <a-card class="general-card" :title="$t('menu.image') + $t('global.onStart')">
            <div id="canvasDiv" style="zoom: 250%; display: none"></div>
            <div>
              <table style="padding: 0; margin: 0; border-spacing: 0">
                <tr v-for="col, y in state.matrix">
                  <td @mousedown="state.mousedown = true; changePixel(x, y)" @mouseup="state.mousedown = false;" @mouseover="changePixel(x, y)" v-for="row, x in col" :style="'background-color: ' + row + '; height: 5px; width: 3.5px;'"></td>
                </tr>
              </table>
            </div>
            <br>
            <a-space>
              <a-button @click="selectFile">{{ $t('tool.selectImage') }}</a-button>
              <a-button :disabled="state.matrix.length < 64" @click="negativeIt">{{ $t('image.negative') }}</a-button>
              <a-button :disabled="state.matrix.length < 64" @click="saveIt">{{ $t('cps.save') }}</a-button>
              <a-button type="primary" :disabled="state.matrix.length < 64" @click="flashIt">{{ $t('tool.write') }}</a-button>
            </a-space>
          </a-card>
        </a-spin>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/store';
import { eeprom_write, eeprom_reboot, eeprom_init } from '@/utils/serial.js';

const appStore = useAppStore();

const state : {
  binaryFile: any,
  loading: boolean,
  matrix: any,
  mousedown: boolean
} = reactive({
  binaryFile: undefined,
  loading: false,
  matrix: [],
  mousedown: false
})

const route = useRoute();

onMounted(async ()=>{
  if(route.query.url){
    const img = await fetch(route.query.url, {
      responseType: 'blob'
    });
    useImg(window.URL.createObjectURL(await img.blob()))
  }
})

const negativeIt = () => {
  const matrix = state.matrix
  matrix.map((y: any, yi: any)=>{
    y.map((x: any, xi: any)=>{
      matrix[yi][xi] = x == '#fff' ? '#000' : '#fff'
    })
  })
  state.matrix = matrix
}

const changePixel = (x: int, y: int) => {
  if(state.mousedown){
    const matrix = state.matrix
    matrix[y][x] = state.matrix[y][x] == '#fff' ? '#000' : '#fff'
    state.matrix = matrix
  }
}

const useImg = (url: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    const canvas2 = canvas.cloneNode();
    const canvasDiv = document.getElementById('canvasDiv');
    canvasDiv.innerHTML = "";
    canvasDiv?.append(canvas, canvas2);
    const img = new Image()
    img.src = url;
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, 128, 64);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
      function getPixel(x: any, y: any) {
          const index = y * 128 + x;
          const i = index * 4;
          return imageData[i] + imageData[i + 1] + imageData[i + 2] > 128 * 3 ? 0 : 1;
      }

      const matrix = [];

      for (let y = 0; y < 64; y++) {
          matrix.push([])
          matrix[y] = []
          for (let x = 0; x < 128; x++) {
              const pixel = !getPixel(x, y);
              matrix[y][x] = pixel ? '#fff' : '#000';
          }
      }

      state.matrix = matrix
    }
}

const selectFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = async () => {
    const blob = new Blob([input.files[0]], { type: 'application/octet-stream' });
    const file = URL.createObjectURL(blob);
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    
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
      
      const matrix = [];

      for (let y = 0; y < 64; y++) {
          matrix.push([])
          matrix[y] = []
          for (let x = 0; x < 128; x++) {
              const pixel = !getPixel(x, y);
              matrix[y][x] = pixel ? '#fff' : '#000';
          }
      }

      state.matrix = matrix
    }
  };
  input.click();
}

const saveIt = async () => {
  const matrix = state.matrix
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if(ctx){
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
  }
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 128; x++) {
      if(matrix[y][x] == '#000'){
        ctx?.beginPath();
        ctx?.rect(x, y, 1, 1);
        ctx?.fill();
      }
    }
  }
  const el = document.createElement('a');
  el.href = canvas.toDataURL("image/jpeg", 1.0);
  el.download = 'image.jpg';
  el.click()
}

const flashIt = async () => {
    const outputArray = new Uint8Array(1024);
    // getPixel(i) outputs the pixel value for any x y coordinate. 0 = black, 1 = white.
    // the outputArray is 1024 bytes, where each byte is 8 pixels IN VERTICAL ORDER.

    let i = 0;
    for (let y = 0; y < 64; y += 8) {
        for (let x = 0; x < 128; x++) {
            let byte = 0;
            for (let i = 0; i < 8; i++) {
              byte |= (state.matrix[y + i][x] == '#000' ? 1 : 0 ) << i;
            }
            outputArray[i++] = byte;
        }
    }

    state.binaryFile = outputArray;
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  if(appStore.configuration?.uart == "official"){
    alert(sessionStorage.getItem('noticeVersionNoSupport'));
    return;
  }
  if(appStore.configuration?.charset != "losehu" && appStore.configuration?.charset != "gb2312"){
    alert(sessionStorage.getItem('noticeVersionNoSupport'));
    return;
  }
  state.loading = true
  let position = 0x1E350;
  if(appStore.configuration?.charset == "gb2312")position = 0x2080;
  await eeprom_init(appStore.connectPort);
  const rawEEPROM = state.binaryFile;
  for (let i = position; i < rawEEPROM.length + position; i += 0x80) {
    await eeprom_write(appStore.connectPort, i, rawEEPROM.slice(i - position, i - position + 0x80), rawEEPROM.slice(i - position, i - position + 0x80).length, appStore.configuration?.uart);
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
