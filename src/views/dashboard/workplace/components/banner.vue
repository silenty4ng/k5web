<template>
  <a-col class="banner">
    <a-col>
      <a-typography-title :heading="5" style="margin-top: 0">
        {{ appStore.connectState ? "欢迎你~，连接成功！" : "欢迎你~，点击右上角“连接”按钮连接手台。" }}
      </a-typography-title>
    </a-col>
    <a-divider class="panel-border" />
    <a-space>
      <a-card v-show="appStore.connectState" :style="{ marginTop: '2em', marginBottom: '2em' }" title="手台信息">
          当前固件版本：{{ appStore.firmwareVersion }} <br />
          匹配写频配置：{{ appStore.configuration?.name }} <br />
          存储大小：{{ state.eepromSize }} <a-button size="mini" type="primary" @click="checkEeprom">检测</a-button>
      </a-card>
    </a-space>
    <div>
      <img style="margin-bottom: 10px;" width="600px" src="/gy.png" />
    </div>
  </a-col>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useAppStore } from '@/store';
  import { eeprom_write, eeprom_reboot, eeprom_init, eeprom_read } from '@/utils/serial.js';

  const appStore = useAppStore();

  const state = reactive({
    eepromSize: "点击检测按钮检测"
  })

  const checkEeprom = async () => {
    let eepromSize = '未知、故障、不可用';
    const random = [
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256)
    ]
    await eeprom_init(appStore.connectPort);
    const rawEEPROM = new Uint8Array(random);
    if(appStore.configuration?.uart == 'official'){
      const bk1 = await eeprom_read(appStore.connectPort, 0, 0x08, appStore.configuration?.uart);
      await eeprom_write(appStore.connectPort, 0, rawEEPROM, 0x08, appStore.configuration?.uart);
      const check1 = await eeprom_read(appStore.connectPort, 0, 0x08, appStore.configuration?.uart);
      if(rawEEPROM.toString() == check1.toString()){
        eepromSize = '8KB（64Kbit）'
      }
      await eeprom_write(appStore.connectPort, 0, bk1, 0x08, appStore.configuration?.uart);
    }else{
      const bk1 = await eeprom_read(appStore.connectPort, 0, 0x08, appStore.configuration?.uart);
      await eeprom_write(appStore.connectPort, 0, rawEEPROM, 0x08, appStore.configuration?.uart);
      const check1 = await eeprom_read(appStore.connectPort, 0, 0x08, appStore.configuration?.uart);
      if(rawEEPROM.toString() == check1.toString()){
        eepromSize = '8KB（64Kbit）'
      }
      await eeprom_write(appStore.connectPort, 0, bk1, 0x08, appStore.configuration?.uart);

      const bk2 = await eeprom_read(appStore.connectPort, 0x1FFF8, 0x08, appStore.configuration?.uart);
      await eeprom_write(appStore.connectPort, 0x1FFF8, rawEEPROM, 0x08, appStore.configuration?.uart);
      const check2 = await eeprom_read(appStore.connectPort, 0x1FFF8, 0x08, appStore.configuration?.uart);
      if(rawEEPROM.toString() == check2.toString()){
        eepromSize = '128KB（1Mbit）'
      }
      await eeprom_write(appStore.connectPort, 0x1FFF8, bk2, 0x08, appStore.configuration?.uart);

      const bk3 = await eeprom_read(appStore.connectPort, 0x3FFF8, 0x08, appStore.configuration?.uart);
      await eeprom_write(appStore.connectPort, 0x3FFF8, rawEEPROM, 0x08, appStore.configuration?.uart);
      const check3 = await eeprom_read(appStore.connectPort, 0x3FFF8, 0x08, appStore.configuration?.uart);
      if(rawEEPROM.toString() == check3.toString()){
        eepromSize = '256KB（2Mbit）'
      }
      await eeprom_write(appStore.connectPort, 0x3FFF8, bk3, 0x08, appStore.configuration?.uart);

      const bk4 = await eeprom_read(appStore.connectPort, 0x7FFF8, 0x08, appStore.configuration?.uart);
      await eeprom_write(appStore.connectPort, 0x7FFF8, rawEEPROM, 0x08, appStore.configuration?.uart);
      const check4 = await eeprom_read(appStore.connectPort, 0x7FFF8, 0x08, appStore.configuration?.uart);
      if(rawEEPROM.toString() == check4.toString()){
        eepromSize = '512KB（4Mbit）'
      }
      await eeprom_write(appStore.connectPort, 0x7FFF8, bk4, 0x08, appStore.configuration?.uart);
    }
    state.eepromSize = eepromSize;
  }
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    padding: 20px 20px 0 20px;
    background-color: var(--color-bg-2);
    border-radius: 4px 4px 0 0;
  }

  :deep(.arco-icon-home) {
    margin-right: 6px;
  }
</style>
