<template>
  <div v-if="isWeixin || isQQ" style="text-align: center;">
    <div style="height: 75vh; display: flex; flex-direction: column; align-items: center;">
      <div style="padding: 20px; padding-top: 35vh; font-size: 1.5rem;">如需浏览，请长按网址复制后使用浏览器访问</div>
      <p style="padding: 20px; background-color: #F1F1F1;">{{ link }}</p>
    </div>
    <div style="color: #AAAAAA;">{{ ua }}</div>
  </div>
  <t-config-provider v-if="reloadLang && !isWeixin && !isQQ" :global-config="locale">
    <a-config-provider :locale="locale">
      <router-view />
      <global-setting />
    </a-config-provider>
  </t-config-provider>
</template>

<script lang="ts" setup>
  import { computed, h, ref } from 'vue';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import tdesignZhCN from 'tdesign-vue-next/esm/locale/zh_CN';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import tdesignEnUS from 'tdesign-vue-next/esm/locale/en_US';
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

  const reloadLang = ref(true);
  const ua = navigator.userAgent;
  const isWeixin = ua.indexOf('MicroMessenger') != -1 ? true : false;
  const isQQ = ua.indexOf('QQ/') != -1 ? true : false;
  const link = location.href;

  const locale = computed(() => {
    let lang = undefined;
    reloadLang.value = false;
    switch (currentLocale.value) {
      case 'zh-CN':
        sessionStorage.setItem('noticeConnectK5', '请先连接手台！')
        sessionStorage.setItem('noticeVersionNoSupport', '固件版本不匹配')
        lang = {...zhCN, ...tdesignZhCN};
        break;
      default:
        sessionStorage.setItem('noticeConnectK5', 'Connect first!')
        sessionStorage.setItem('noticeVersionNoSupport', 'Firmware not supported')
        lang = {...enUS, ...tdesignEnUS};
    }
    setTimeout(() => {
      reloadLang.value = true;
    }, 1000);
    return lang;
  });
</script>
