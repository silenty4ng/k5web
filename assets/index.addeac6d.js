import{O as m,d as _}from"./@arco-design.5e2b2073.js";import"./vue.83b9e9de.js";import{d as F,h as f,l as h,a as g,N as p,O as d,e as o,z as n,x as i,A as r,u as y,b9 as v,b8 as A,o as b}from"./@vue.2faf1d8e.js";import{_ as D}from"./index.4032364f.js";import"./b-tween.8dd4e2fe.js";import"./dayjs.4c867136.js";import"./@intlify.d4358f23.js";import"./b-validate.1fdaeb97.js";import"./number-precision.5cddbed2.js";import"./resize-observer-polyfill.2b976e6e.js";import"./scroll-into-view-if-needed.0a5da943.js";import"./compute-scroll-into-view.17358474.js";import"./vue-echarts.5aab67d4.js";import"./resize-detector.a8854a64.js";import"./echarts.5b0e6023.js";import"./zrender.ce26131e.js";import"./tslib.c6ba9914.js";import"./vue-router.2630bdf9.js";import"./nprogress.b0a22fe3.js";import"./mitt.550594b0.js";import"./pinia.84b4adc6.js";import"./vue-demi.61f15e01.js";import"./axios.f3f20840.js";import"./vue-i18n.3095106f.js";import"./@vueuse.7fb11548.js";import"./aegis-web-sdk.846094f8.js";import"./@zxing.8654f0db.js";import"./tdesign-vue-next.de6f3c5b.js";import"./tdesign-icons-vue-next.6eb4e7b8.js";import"./sortablejs.b2e3c7c4.js";import"./@popperjs.f3f73334.js";import"./vue-matomo.4c7efa96.js";const s=a=>(v("data-v-da2b92fd"),a=a(),A(),a),S={class:"container"},x={style:{"background-color":"#fff",padding:"10%"}},B=s(()=>o("br",null,null,-1)),C={style:{"background-color":"#fff",padding:"10%"}},E=s(()=>o("p",{style:{"font-size":"1.5rem","font-weight":"bold"}}," \u83B7\u53D6\u4FE1\u606F\uFF08Information\uFF09 ",-1)),k={name:"SatLoc"},w=F({...k,setup(a){const t=f({lat:0,lng:0,alt:0,type:0,uuid:""});h(()=>{t.uuid=new URLSearchParams(location.hash.replace("#/satloc?","")).get("uuid"),navigator.geolocation.getCurrentPosition(e=>{e.coords&&(t.lat=e.coords.latitude,t.lng=e.coords.longitude,e.coords.altitude&&(t.alt=e.coords.altitude))})});const c=async()=>{await fetch("https://k5.vicicode.cn/api/lol",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({func:0,uuid:t.uuid,cache:JSON.stringify([t.lng,t.lat,t.alt])})}),t.type=1};return(e,N)=>{const u=m,l=_;return b(),g("div",S,[p(o("div",x,[n(" \u8BF7\u70B9\u51FB\u7F51\u9875\u201C\u5DF2\u626B\u7801\u4E0A\u4F20\u201D\u6309\u94AE "),B,n(' Please click on the "Scanned and Uploaded" button on PC page. ')],512),[[d,t.type!=0]]),p(o("div",C,[E,i(u),o("p",null," \u53F0\u7AD9\u7ECF\u5EA6\uFF08Longitude\uFF09\uFF1A"+r(t.lng),1),i(u),o("p",null," \u53F0\u7AD9\u7EAC\u5EA6\uFF08Latitude\uFF09\uFF1A"+r(t.lat),1),i(u),o("p",null," \u53F0\u7AD9\u6D77\u62D4\uFF08Altitude\uFF09\uFF1A"+r(t.alt),1),i(u),i(l,{type:"primary",onClick:c},{default:y(()=>[n("\u4E0A\u4F20\uFF08Upload\uFF09")]),_:1})],512),[[d,t.type==0]])])}}});const st=D(w,[["__scopeId","data-v-da2b92fd"]]);export{st as default};
