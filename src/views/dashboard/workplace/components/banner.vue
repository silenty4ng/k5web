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
      <a-typography-text>◆ K5Web 官扩刷中文教程（BG3ODZ）：<t-link theme="primary" href="https://www.bilibili.com/video/BV1Ab421p7rN" target="_blank">https://www.bilibili.com/video/BV1Ab421p7rN</t-link> 。</a-typography-text><br>
      <a-typography-text>◆ K5Web 使用视频教程（BG3ODZ）：<t-link theme="primary" href="https://www.bilibili.com/video/BV1Q4421D75x" target="_blank">https://www.bilibili.com/video/BV1Q4421D75x</t-link> 。</a-typography-text><br>
      <a-typography-text>◆ K5Web 使用视频教程（BG7QJV）：<t-link theme="primary" href="https://www.douyin.com/video/7378314511419313458" target="_blank">https://www.douyin.com/video/7378314511419313458</t-link> 。</a-typography-text>
    </div>
    <div style="margin-top: 50px;">&nbsp;</div>
    <div>
      <a-collapse :default-active-key="[1]" accordion>
        <a-collapse-item header="广告区" :key="1">
          <a-card hoverable :style="{ width: '600px' }">
            <template #cover>
              <div
              >
                <img
                  :style="{ width: '100%' }"
                  alt="ads"
                  src="/jjgg.jpg"
                />
              </div>
            </template>
            <a-card-meta title="BG4IWE 投放">
            </a-card-meta>
          </a-card>
        </a-collapse-item>
        <a-collapse-item header="腾讯公益" :key="2">
          <img class="tencent" style="margin-bottom: 10px;" width="200px" src="/gy.png" />
        </a-collapse-item>
        <a-collapse-item header="饿饿饭饭" :key="3">
          <img width="300" src="/mm_facetoface_collect_qrcode_1714392837792.png" >
          <img width="300" src="/1722745910257.jpg" >
          <br><br>
          TRON / TRX：TPaSnHJ2cRCQjjv7TyAFJDamb3mZSSz1At
        </a-collapse-item>
      </a-collapse>
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
  :deep(.arco-collapse-item-content-expend){
    background-color: var(--color-bg-2);
  }
  :deep(.arco-collapse-item-content-box){
    background-color: var(--color-bg-2);
  }
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
