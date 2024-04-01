<template>
  <a-config-provider :locale="locale">
    <router-view />
    <global-setting />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import GlobalSetting from '@/components/global-setting/index.vue';
  import useLocale from '@/hooks/locale';
  import Aegis from 'aegis-web-sdk';
  import { encodingIndexes } from "@zxing/text-encoding/es2015/encoding-indexes";
  import { TextEncoder, TextDecoder } from "@zxing/text-encoding";

  window.TextEncodingIndexes = { encodingIndexes: encodingIndexes };
  window.TextEncoder = TextEncoder;
  window.TextDecoder = TextDecoder;

  // 遥测
  if(location.hostname == 'k5.vicicode.com' || location.hostname == 'k5.lhw711.cn' || location.hostname == 'mm.md' || location.hostname == 'k5.mm.md'){
    const aegis = new Aegis({
        id: 'yr5DeslJkz3Qn20jg0', // 上报 id
        reportApiSpeed: true, // 接口测速
        reportAssetSpeed: true, // 静态资源测速
        spa: true, // spa 应用页面跳转的时候开启 pv 计算
        hostUrl: 'https://rumt-zh.com'
    });
    const shynet = document.createElement('script');
    shynet.defer;
    shynet.src = "https://shynet.vicicode.com/ingress/4c1dcea4-75c5-45e2-a641-25f211adbad6/script.js";
    document.body.append(shynet);
  }

  const { currentLocale } = useLocale();
  const locale = computed(() => {
    switch (currentLocale.value) {
      case 'zh-CN':
        return zhCN;
      default:
        return zhCN;
    }
  });
</script>
