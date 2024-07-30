<template>
  <a-col class="banner">
    <a-col>
      <a-typography-title :heading="5" style="margin-top: 0">
        {{ appStore.connectState ? $t('workplace.welcomeSuc') : $t('workplace.welcome') }}
      </a-typography-title>
    </a-col>
    <a-divider class="panel-border" />
    <a-space>
      <a-card v-show="appStore.connectState" :style="{ marginTop: '2em', marginBottom: '2em' }" :title="$t('workplace.info')">
          {{ $t('workplace.current') }}{{ appStore.firmwareVersion }} <br />
          {{ $t('workplace.writeconfig') }}{{ appStore.configuration?.name }} <br />
          {{ $t('workplace.eepromSize') }}{{ state.eepromSize }} {{ state.eepromSize != t('workplace.clickCheck') &&  appStore.configuration?.uart == 'official' ? t('workplace.clickNotice') : ''}} <a-button size="mini" type="primary" @click="checkEeprom">{{ $t('workplace.checkIt') }}</a-button>
      </a-card>
    </a-space>
    <div>
      <a-typography-title :heading="5">说明：</a-typography-title>
      <a-typography-text>◆ 使用应第一时间<t-link theme="primary" href="/#/tool/backup">备份</t-link>配置及校准数据。</a-typography-text><br>
      <a-typography-text>◆ 除“固件升级”功能手台应处于刷机模式点击更新按钮选择设备更新，其余功能手台均需要在正常模式连接。</a-typography-text><br>
      <a-typography-text>◆ 萝卜（LOSEHU）固件相关问题请移步：<t-link theme="primary" href="https://github.com/losehu/uv-k5-firmware-custom" target="_blank">https://github.com/losehu/uv-k5-firmware-custom</t-link> 。</a-typography-text><br>
      <a-typography-text>◆ K5Web 使用视频教程（BG7QJV）：<t-link theme="primary" href="https://www.douyin.com/video/7378314511419313458" target="_blank">https://www.douyin.com/video/7378314511419313458</t-link> 。</a-typography-text><br>
      <a-typography-text>◆ K5Web 使用视频教程（BG3ODZ）：<t-link theme="primary" href="https://www.bilibili.com/video/BV1Q4421D75x" target="_blank">https://www.bilibili.com/video/BV1Q4421D75x</t-link> 。</a-typography-text>
    </div>
    <div>
      <a-typography-title :heading="5">腾讯公益：</a-typography-title>
      <img class="tencent" style="margin-bottom: 10px;" width="200px" src="/gy.png" />
    </div>
    <div>
      <a-typography-title :heading="5">广告区：</a-typography-title>
      <div style="border: 1px dashed; display: inline-block;">
        <img style="margin: 20px; " class="tencent" height="200px" src="/jjgg.jpg" />
      </div>
    </div>
    <br>
    <br>
  </a-col>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useAppStore } from '@/store';
  import { eeprom_write, eeprom_reboot, eeprom_init, eeprom_read } from '@/utils/serial.js';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const appStore = useAppStore();

  const state = reactive({
    eepromSize: t('workplace.clickCheck')
  })

  const checkEeprom = async () => {
    let eepromSize = t('workplace.unk');
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
        eepromSize = t('global.8kb')
      }
      await eeprom_write(appStore.connectPort, 0, bk1, 0x08, appStore.configuration?.uart);
    }else{
      const bk1 = await eeprom_read(appStore.connectPort, 0, 0x08, appStore.configuration?.uart);
      await eeprom_write(appStore.connectPort, 0, rawEEPROM, 0x08, appStore.configuration?.uart);
      const check1 = await eeprom_read(appStore.connectPort, 0, 0x08, appStore.configuration?.uart);
      if(rawEEPROM.toString() == check1.toString()){
        eepromSize = t('global.8kb')
      }
      await eeprom_write(appStore.connectPort, 0, bk1, 0x08, appStore.configuration?.uart);

      const bk2 = await eeprom_read(appStore.connectPort, 0x1FFF8, 0x08, appStore.configuration?.uart);
      await eeprom_write(appStore.connectPort, 0x1FFF8, rawEEPROM, 0x08, appStore.configuration?.uart);
      const check2 = await eeprom_read(appStore.connectPort, 0x1FFF8, 0x08, appStore.configuration?.uart);
      if(rawEEPROM.toString() == check2.toString()){
        eepromSize = t('global.128kb')
      }
      await eeprom_write(appStore.connectPort, 0x1FFF8, bk2, 0x08, appStore.configuration?.uart);

      const bk3 = await eeprom_read(appStore.connectPort, 0x3FFF8, 0x08, appStore.configuration?.uart);
      await eeprom_write(appStore.connectPort, 0x3FFF8, rawEEPROM, 0x08, appStore.configuration?.uart);
      const check3 = await eeprom_read(appStore.connectPort, 0x3FFF8, 0x08, appStore.configuration?.uart);
      if(rawEEPROM.toString() == check3.toString()){
        eepromSize = t('global.256kb')
      }
      await eeprom_write(appStore.connectPort, 0x3FFF8, bk3, 0x08, appStore.configuration?.uart);

      const bk4 = await eeprom_read(appStore.connectPort, 0x7FFF8, 0x08, appStore.configuration?.uart);
      await eeprom_write(appStore.connectPort, 0x7FFF8, rawEEPROM, 0x08, appStore.configuration?.uart);
      const check4 = await eeprom_read(appStore.connectPort, 0x7FFF8, 0x08, appStore.configuration?.uart);
      if(rawEEPROM.toString() == check4.toString()){
        eepromSize = t('global.512kb')
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

  body[arco-theme='dark'] { 
    .tencent {
      filter: invert(1) hue-rotate(180deg);
    }
  }
</style>
