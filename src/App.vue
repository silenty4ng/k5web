<template>
  <t-config-provider v-if="reloadLang" :global-config="locale">
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

  const renderQa = () => {
    return h("img", { src: '/qrcode_1714310463601.jpg', height: 440 });
  }

  const renderPopup = () => {
    return h("img", { src: '/1714006925783.jpg', height: 440 });
  }

  const renderShang = () => {
    return h("img", { src: '/mm_facetoface_collect_qrcode_1714392837792.png', height: 440 });
  }

  const { currentLocale } = useLocale();

  const reloadLang = ref(true);

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
