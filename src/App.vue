<template>
  <div v-if="(isWeixin || isQQ) && route.path !== '/satloc'" style="text-align: center;">
    <div style="height: 75vh; display: flex; flex-direction: column; align-items: center;">
      <div style="padding: 20px; padding-top: 35vh; font-size: 1.5rem;">如需浏览，请长按网址复制后使用浏览器访问</div>
      <p style="padding: 20px; background-color: #F1F1F1;">{{ link }}</p>
    </div>
    <div style="color: #AAAAAA;">{{ ua }}</div>
  </div>
  <t-config-provider v-if="reloadLang && !((isWeixin || isQQ) && route.path !== '/satloc')" :global-config="locale">
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
  import { useRoute } from 'vue-router';
  import { DialogPlugin } from 'tdesign-vue-next';

  const route = useRoute();

  window.TextEncodingIndexes = { encodingIndexes: encodingIndexes };
  window.TextEncoder = TextEncoder;
  window.TextDecoder = TextDecoder;

  // 遥测
  if(import.meta.env.VITE_METER_SITE.split(',').indexOf(location.hostname) !== -1){
    const aegis = new Aegis({
        id: 'yr5DeslJkz3Qn20jg0', // 上报 id
        reportApiSpeed: true, // 接口测速
        reportAssetSpeed: true, // 静态资源测速
        spa: true, // spa 应用页面跳转的时候开启 pv 计算
        hostUrl: 'https://rumt-zh.com'
    });
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

  if(location.hostname === 'k5.vicicode.com'){
    fetch('/cdn-cgi/trace').then(e=>e.text()).then(e=>{
      if(e.indexOf('loc=CN') !== -1){
        DialogPlugin.confirm({
          header: '提示',
          body: '🚀 国内用户推荐访问国内镜像以获得极速体验～',
          className: 't-dialog-new-class1 t-dialog-new-class2',
          style: 'color: rgba(0, 0, 0, 0.6)',
          cancelBtn: '7 天内不再显示',
          confirmBtn: '🚀 立刻前往',
          onConfirm: () => {
            location.href = 'https://k5.vicicode.cn'
          },
          onCancel: () => {
            localStorage.setItem('cnNotice', new Date().getTime().toString());
          }
        })
      }
    })
  }

</script>
