<template>
  <div class="container">
    <Breadcrumb :items="['指南', '使用117P6版']" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" title="使用117P6版">
          <a-steps :current="state.step">
            <a-step>选择固件类型</a-step>
            <a-step>使用自定义固件</a-step>
            <a-step>完成</a-step>
          </a-steps>
          <a-divider/>
          <div v-show="state.step == 1" style="min-height: 300px; margin: 50px;">
            <p style="font-size: 1.2em; font-weight: bold;">你是否想要扩容你的设备以支持中文信道存储：</p>
            <a-radio-group type="button" v-model="state.kIt">
              <a-radio value="yes">是的，我想要硬件改造我的设备</a-radio>
              <a-radio value="no">不，我不需要中文信道</a-radio>
            </a-radio-group>
            <br>
            <div v-show="state.kIt == 'yes'">
              <p style="color: #ff0000; font-weight: bold;">声明：本方案及相应固件均为技术探索用途。对原机进行改造需要相应专业知识且可能存在安全和法律风险。使用本方案和固件代表您已认可风险并自行承担后果，包括且不限于财产损失、人员伤亡、违法犯罪等。</p>
              <p style="font-weight: bold; font-size: 1.2em;">一、相关法律</p>
              <p>
                自制、改装、拼装的无线电发射设备，应符合国家相关技术标准，并按照工信部官网链接（<a href="http://www.miit.gov.cn/jgsj/wgj/kpzs/art/2022/art_c1ffd3c47e3f455dad38246579092136.html" target="_blank" rel="noopener noreferrer">http://www.miit.gov.cn/jgsj/wgj/kpzs/art/2022/art_c1ffd3c47e3f455dad38246579092136.html</a>，或通过工信部官网-工业和信息化部-机关司局-无管局-科普知识-《关于申请设置、使用业余无线电台所用无线电发射设备相关事宜的说明》)所列情况，提供相应材料。
              </p>
              <p style="font-weight: bold; font-size: 1.2em;">二、所需工具</p>
              <p>
                写频线、螺丝刀套装、电烙铁、焊锡丝、助焊剂、精密电器清洁剂（可选）、撬棒（可选）、万用表（可选）。
              </p>
              <p style="font-weight: bold; font-size: 1.2em;">三、购买扩容芯片</p>
              <p>芯片型号：<span style="color: #ff0000;">M24M02-DRMN6</span> 或其它 SOP-8 封装 I²C 总线 2Mbit EEPROM 芯片。考虑到芯片质量及操作失误可能导致的损坏，建议多买几片备用。</p>
            </div>
            <div v-show="state.kIt == 'no'">
              <p style="color: #ff0000; font-weight: bold;">声明：本方案及相应固件均为技术探索用途。对原机进行改造需要相应专业知识且可能存在安全和法律风险。使用本方案和固件代表您已认可风险并自行承担后果，包括且不限于财产损失、人员伤亡、违法犯罪等。</p>
              <p style="font-weight: bold; font-size: 1.2em;">一、所需工具</p>
              <p>
                写频线。
              </p>
            </div>
          </div>
          <div v-show="state.step == 1" style="text-align: center;">
            <a-button type="primary" :disabled="!state.kIt" @click="state.step = 2">下一步</a-button>
          </div>
          <div v-show="state.step == 2" style="min-height: 300px; text-align: center; color: #C9CDD4; ">
            <a-spin :loading="state.loading" tip="处理中..." style="width: 100%;">
              <a-collapse :activeKey="state.flashStep" @change="(e: any)=>{state.flashStep = e; if(e[0] == 'six'){state.finish = true;}}" accordion>
                <a-collapse-item header="备份原机数据" key="one">
                  <div style="text-align: left;">
                    <p>在对设备进行操作前，应备份原机出厂的配置、校准数据，以保证发射性能符合国家标准。（请妥善保存备份文件）</p>
                    <p>
                      <a-space>
                        <a-button type="primary" :disabled="state.backed" @click="backupIt">备份</a-button><span v-show="state.backed" style="color: #C9CDD4;">已备份✔</span>&nbsp;
                        <a-button type="primary" :disabled="!state.backed" @click="state.kIt == 'yes' ? state.flashStep[0] = 'two' : state.flashStep[0] = 'three'">下一步</a-button>
                      </a-space>
                    </p>
                  </div>
                </a-collapse-item>
                <a-collapse-item v-show="state.kIt == 'yes'" header="拆机" key="two">
                  <div style="text-align: left;">
                    <p>视频教程链接：
                      <a href="https://www.bilibili.com/video/BV1ib4y137Ah" target="_blank" rel="noopener noreferrer">https://www.bilibili.com/video/BV1ib4y137Ah</a>
                      <span style="color: #ff0000;">（硬件拆解及焊接部分可参照本视频，软件刷机部分请务必以本指南为准。）</span>
                    </p>
                    <div>
                      ①拆掉电池、天线和旋钮盖。<br>
                      ②用撬棒插入主机背面底部正中位置缝隙，向上撬出铝制背板。③向下后方抽出背板。前盖和主板间有扬声器导线连接，此处用力不要过猛，控制幅度，以免拉断导线。<br>
                      ④拿掉耳机口挡板。<br>
                      ⑤建议将扬声器导线拆焊，以免阻碍后续拆解和焊接，导致拉断导线。最后组装时再对扬声器导线进行焊接。<br>
                      ⑥拆卸屏幕（难点，请认真看视频教程！）。在屏幕左下角卡扣位置，用撬棒向内按压同时向上抬起即可拆卸左侧，屏幕左侧松脱后另一侧拆卸相对简单。此处用力不要过猛，控制幅度，屏幕完全拆卸后应妥善固定，以免拉断、折断背面上方排线。<br>
                      ⑦拆卸全部 5 颗螺丝并分离背板。
                    </div>
                    <img :src="cj1">
                    <div>
                      需要更换的芯片位于主板背面右下角，型号为 BL24C64A。
                    </div>
                    <img :src="cj2">
                    <div>
                      ①拆焊及焊接。有动手能力的朋友自行操作，要求芯片方向正确（以第1 脚圆点为准），焊点饱满，无虚焊、短路，芯片周围的电子元器件保持完好。建议用300℃以上小刀头烙铁配合助焊剂，不建议用热风枪（高手除外）。手残党可以去手机维修店更换，费用5-30 元不等。若周围元件遭到破坏，可按下图参数更换补救。
                    </div>
                    <img :src="cj3">
                    <div>
                      ②将主板装回背板。（背板上 3x5mm 导热硅胶垫若脱落，请务必装回对应凸起位置；电池触点部分过背板孔时当心压弯。）<br>
                      ③装入电池，按住 PTT 键开机，进入刷机模式（此时手电筒常亮、屏幕无显示）。如无法进入刷机模式，检查电池接触片是否错位、焊点及周边元件是否完好。
                    </div>
                    <div style="color: #ff0000; font-weight: bold;">
                      此时先不要完全组装手台，待后续工作全部完成后再行组装，以便故障返工。此阶段如尝试正常开机后显示异常、电量异常、接收异常等均为正常情况，不用担心。后续操作后会恢复正常。
                    </div>
                    <div>
                      <a-button type="primary" @click="state.flashStep[0] = 'three'">下一步</a-button>
                    </div>
                  </div>
                </a-collapse-item>
                <a-collapse-item header="刷入固件" key="three">
                  <div style="text-align: left;">
                    <p>断开写频线，按住 PTT 键开机，进入刷机模式（此时手电筒常亮、屏幕无显示），手电筒常亮后插回写频线。</p>
                    <p>
                      <a-space>
                        <a-button type="primary" :disabled="state.flashIt" @click="iFlashIt">刷入固件</a-button>
                        <a-button type="primary" :disabled="!state.flashIt" @click="state.kIt == 'yes' ? state.flashStep[0] = 'four' : finishIt()">下一步</a-button>
                      </a-space>
                    </p>
                  </div>
                </a-collapse-item>
                <a-collapse-item v-show="state.kIt == 'yes'" header="刷回原机数据" key="four">
                  <div style="text-align: left;">
                    <p>正常开机，使设备处于开机状态，点击刷回备份数据。</p>
                    <p>
                      <a-space>
                        <a-button type="primary" :disabled="state.restoreBackupIt" @click="restoreBackup">刷回备份数据</a-button>
                        <a-button type="primary" :disabled="!state.restoreBackupIt" @click="state.flashStep[0] = 'five'">下一步</a-button>
                      </a-space>
                    </p>
                  </div>
                </a-collapse-item>
                <a-collapse-item v-show="state.kIt == 'yes'" header="刷入字库" key="five">
                  <div style="text-align: left;">
                    <p>正常开机，使设备处于开机状态，点击刷入字库。</p>
                    <p>
                      <a-space>
                        <a-button type="primary" :disabled="state.flashFontIt" @click="flashFont">刷入字库</a-button>
                        <a-button type="primary" :disabled="!state.flashFontIt" @click="finishIt">下一步</a-button>
                      </a-space>
                    </p>
                  </div>
                </a-collapse-item>
                <a-collapse-item header="完全组装" key="six">
                  <div style="text-align: left;">如果扩容，按拆解顺序进行焊接和组装。</div>
                </a-collapse-item>
              </a-collapse>
            </a-spin>
          </div>
          <div v-show="state.step == 2" style="text-align: center;">
            <a-space>
              <a-button @click="state.step = 1">上一步</a-button>
              <a-button type="primary" :disabled="!state.finish" @click="state.step = 3">完成</a-button>
            </a-space>
          </div>
          <div v-show="state.step == 3" style="min-height: 300px; text-align: center; color: #C9CDD4; ">
            <a-result
              class="result"
              status="success"
              subtitle="刷入成功"
            />
            <a-button type="primary" @click="()=>{router.push('/chirp/base');}">
              返回首页
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/store';
import { eeprom_write, eeprom_reboot, eeprom_init, eeprom_read, flash_flashFirmware, connect, disconnect, sendPacket, unpackVersion, readPacket, unpack } from '@/utils/serial.js';
import cj1 from './assets/cj1.png'
import cj2 from './assets/cj2.png'
import cj3 from './assets/cj3.png'

const appStore = useAppStore();
const router = useRouter();

const state : {
  step: any,
  flashStep: any,
  backed: any,
  kIt: any,
  flashIt: any,
  restoreBackupIt: any,
  loading: any,
  flashFontIt: any,
  finish: any
} = reactive({
  step: 1,
  flashStep: ['one'],
  backed: undefined,
  kIt: undefined,
  flashIt: false,
  restoreBackupIt: false,
  loading: false,
  flashFontIt: false,
  finish: false
})

const backupRange = async (start: any, end: any, name: any = new Date() + '_backup.bin') =>{
  await eeprom_init(appStore.connectPort);
  let rawEEPROM = new Uint8Array(end - start);
  for (let i = start; i < end; i += 0x80) {
    const data = await eeprom_read(appStore.connectPort, i);
    rawEEPROM.set(data, i - start);
  }
  const blob = new Blob([rawEEPROM], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return rawEEPROM;
}

const restoreRange = async (start: any = 0, uint8Array: any) => {
  await eeprom_init(appStore.connectPort);
  for (let i = start; i < uint8Array.length + start; i += 0x80) {
    await eeprom_write(appStore.connectPort, i, uint8Array.slice(i - start, i - start + 0x80));
  }
  await eeprom_reboot(appStore.connectPort);
}

const finishIt = () => {
  state.flashStep[0] = 'six'
  state.finish = true
}

const backupIt = async () => {
  if(appStore.connectState != true){alert('点击右上角“连接”按钮连接手台。'); return;};
  state.loading = true
  state.backed = await backupRange(0, 0x2000);
  console.log(state.backed)
  state.loading = false
}

const iFlashIt = async () => {
  state.loading = true
  let fontPacket = undefined
  if(state.kIt == 'yes'){
    fontPacket = await fetch('/LOSEHU117P6K.bin')
  }else{
    fontPacket = await fetch('/LOSEHU117P6.bin')
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
  if(appStore.connectPort){
    await disconnect(appStore.connectPort);
  }
  let _connect = await connect();
  await readPacket(_connect, 0x18, 1000);
  const rawVersion = unpackVersion(binary);
  const _data = new Uint8Array([0x30, 0x5, rawVersion.length, 0x0, ...rawVersion]);
  await sendPacket(_connect, _data);
  await readPacket(_connect, 0x18)
  await flash_flashFirmware(_connect, unpack(binary))
  appStore.updateSettings({ connectPort: _connect });
  state.flashIt = true
  state.loading = false
}

const restoreBackup = async () => {
  if(appStore.connectState != true){alert('点击右上角“连接”按钮连接手台。'); return;};
  state.loading = true
  await restoreRange(0, state.backed);
  state.restoreBackupIt = true;
  state.loading = false
}

const flashFont = async () => {
  state.loading = true
  const fontPacket = await fetch('/old_font.bin')
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
  state.flashFontIt = true;
  state.loading = false
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
