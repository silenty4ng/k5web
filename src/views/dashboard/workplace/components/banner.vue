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

  const appStore = useAppStore();

  const state = reactive({
    eepromSize: "点击检测按钮检测"
  })

  const checkEeprom = async () => {
    alert('TODO');
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
