<template>
  <div class="container">
    <Breadcrumb :items="[$t('menu.dashboard'), $t('menu.cps.settings')]" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" :title="$t('menu.cps.settings') + $t('global.onStart')">
          <a-row style="margin-bottom: 16px">
            <a-col :span="12">
              <a-space>
                <a-button type="primary" @click="readChannel">
                  <template #icon>
                    <icon-plus />
                  </template>
                  {{ $t('cps.onDeviceRead') }}
                </a-button>
                <a-button @click="writeChannel">
                  <template #icon>
                    <icon-plus />
                  </template>
                  {{ $t('cps.onDeviceWrite') }}
                </a-button>
              </a-space>
            </a-col>
          </a-row>
          <a-spin :loading="loading" style="width: 100%;">
            <a-form-item :label-col-style="{width: '25%'}" field="logo_line1" :label="$t('cps.line1')">
              <a-input v-model="state.logo_line1" />
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" field="logo_line2" :label="$t('cps.line2')">
              <a-input v-model="state.logo_line2" />
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" field="dtmfid" :label="$t('cps.dtmfid')">
              <a-input v-model="state.dtmfid" />
            </a-form-item>
            <a-form-item :label-col-style="{width: '25%'}" field="mdclocplay" :label="$t('cps.mdclocplay')">
              <a-switch v-model="state.mdc_audio_local" type="round"/>
            </a-form-item>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, nextTick } from 'vue';
import useLoading from '@/hooks/loading';
import { useAppStore } from '@/store';
import { eeprom_write, eeprom_reboot, eeprom_init, eeprom_read, uint8ArrayToString, stringToUint8Array } from '@/utils/serial.js';

const appStore = useAppStore();
const { loading, setLoading } = useLoading(false);

const state = reactive({
  logo_line1: '',
  logo_line2: '',
  mdc_audio_local: true,
  dtmfid: ''
})

const readChannel = async() => {
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  await eeprom_init(appStore.connectPort);
  setLoading(true)
  if(appStore.configuration?.charset == "losehu"){
    let logo = new Uint8Array(0x026);
    logo.set(await eeprom_read(appStore.connectPort, 0x1e320, 0x026, appStore.configuration?.uart), 0)
    state.logo_line1 = uint8ArrayToString(logo.subarray(0, 0x13), appStore.configuration?.charset)
    state.logo_line2 = uint8ArrayToString(logo.subarray(0x13, 0x26), appStore.configuration?.charset)
  }else if(appStore.configuration?.charset == "gb2312"){
    let logo = new Uint8Array(0x024);
    logo.set(await eeprom_read(appStore.connectPort, 0x02000, 0x024, appStore.configuration?.uart), 0)
    state.logo_line1 = uint8ArrayToString(logo.subarray(0, 0x12), appStore.configuration?.charset)
    state.logo_line2 = uint8ArrayToString(logo.subarray(0x12, 0x024), appStore.configuration?.charset)
  }else{
    let logo = new Uint8Array(0x020);
    logo.set(await eeprom_read(appStore.connectPort, 0xEB0, 0x020, appStore.configuration?.uart), 0)
    state.logo_line1 = uint8ArrayToString(logo.subarray(0, 0x10), appStore.configuration?.charset)
    state.logo_line2 = uint8ArrayToString(logo.subarray(0x10, 0x20), appStore.configuration?.charset)
  }

  const dtmfid = await eeprom_read(appStore.connectPort, 0xEE0, 0x03, appStore.configuration?.uart)
  state.dtmfid = uint8ArrayToString(dtmfid)

  if(parseInt(await eeprom_read(appStore.connectPort, 0x01FFD, 0x01, appStore.configuration?.uart)) == 0){
    state.mdc_audio_local = false
  }else{
    state.mdc_audio_local = true
  }

  setLoading(false)
}

const writeChannel = async() => {
  if(appStore.connectState != true){alert(sessionStorage.getItem('noticeConnectK5')); return;};
  setLoading(true)
  await eeprom_init(appStore.connectPort);
  if(appStore.configuration?.charset == "losehu"){
    let logo = new Uint8Array(0x26);
    logo.set(stringToUint8Array(state.logo_line1, appStore.configuration?.charset).subarray(0, 0x13), 0);
    logo.set(stringToUint8Array(state.logo_line2, appStore.configuration?.charset).subarray(0, 0x13), 0x13);
    await eeprom_write(appStore.connectPort, 0x1e31e, [18, 18], 0x02, appStore.configuration?.uart);
    await eeprom_write(appStore.connectPort, 0x1e320, logo, 0x26, appStore.configuration?.uart);
  }else if(appStore.configuration?.charset == "gb2312"){
    let logo = new Uint8Array(0x24);
    logo.set(stringToUint8Array(state.logo_line1, appStore.configuration?.charset).subarray(0, 0x12), 0);
    logo.set(stringToUint8Array(state.logo_line2, appStore.configuration?.charset).subarray(0, 0x12), 0x12);
    await eeprom_write(appStore.connectPort, 0x02024, [18, 18], 0x02, appStore.configuration?.uart);
    await eeprom_write(appStore.connectPort, 0x02000, logo, 0x24, appStore.configuration?.uart);
  }else{
    let logo = new Uint8Array(0x020);
    logo.set(stringToUint8Array(state.logo_line1, appStore.configuration?.charset).subarray(0, 0x10), 0);
    logo.set(stringToUint8Array(state.logo_line2, appStore.configuration?.charset).subarray(0, 0x10), 0x10);
    await eeprom_write(appStore.connectPort, 0xEB0, logo, 0x20, appStore.configuration?.uart);
  }
  if(state.dtmfid == ''){
    await eeprom_write(appStore.connectPort, 0xEE0, new Uint8Array([0xff, 0xff, 0xff]), 0x03, appStore.configuration?.uart);
  }else{
    await eeprom_write(appStore.connectPort, 0xEE0, new Uint8Array([
        stringToUint8Array(state.dtmfid.padStart(3, '0').split('')[0]),
        stringToUint8Array(state.dtmfid.padStart(3, '0').split('')[1]), 
        stringToUint8Array(state.dtmfid.padStart(3, '0').split('')[2])
      ]), 0x03, appStore.configuration?.uart);
  }
  if(appStore.configuration?.localmdc){
    await eeprom_write(appStore.connectPort, 0x01FFD, new Uint8Array([state.mdc_audio_local ? 1 : 0]), 0x01, appStore.configuration?.uart);
  }
  await eeprom_reboot(appStore.connectPort);
  setLoading(false)
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
