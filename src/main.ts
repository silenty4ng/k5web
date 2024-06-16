import { createApp } from 'vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import './mock';
import App from './App.vue';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/assets/style/global.less';
import '@/api/interceptor';
import 'tdesign-vue-next/es/style/index.css';
import Updater from "./utils/AutoUpdate.js";
import VueMatomo from 'vue-matomo';

const AutoUpdate = new Updater()
AutoUpdate.on('update',()=>{
  setTimeout(async()=>{
      const result = confirm('当前网站有更新，请点击确定刷新页面体验');
      if(result){
        location.reload();
      }
  },500)
})

const app = createApp(App);

app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);

if(location.hostname == 'k5.vicicode.com' || location.hostname == 'k5.lhw711.cn' || location.hostname == 'mm.md' || location.hostname == 'k5.mm.md'){
  app.use(VueMatomo, {
    host: '//analytics.vicicode.com',
    siteId: 2,
  })
}

app.mount('#app');
