import{v as D,ac as E,_ as V}from"./index.413febc1.js";/* empty css              *//* empty css              *//* empty css               *//* empty css                */import{d as $,r as B,w as H,o as R,bW as T,bI as I,C as p,D as v,aI as l,aH as i,u as A,G as y,aM as c,aN as h,aK as k,aJ as x,aE as S,bX as J,b8 as F,bh as G,bK as K,bO as Y}from"./arco.76adc92f.js";import{g as q}from"./vue.107cc2d0.js";import{u as W}from"./loading.e4b365a7.js";import{L as X}from"./index.f132f61a.js";import{S as z}from"./index.43e2a6eb.js";import"./chart.d41e8c5b.js";import"./slot.c1690aae.js";const P={class:"container"},Q={name:"DIY"},Z=$({...Q,setup(tt){const L=q(),{t:M}=D.exports.useI18n(),N=()=>{L.push({path:"/tool/flash",query:{url:"https://k6.vicicode.cn/diyapi/LOSEHU"+t.flag.join("")+".bin?v="+new Date().getTime()}})},O=()=>{fetch("https://k6.vicicode.cn/diyapi/LOSEHU"+t.flag.join("")+".bin?v="+new Date().getTime()).then(e=>e.blob()).then(e=>{const o=URL.createObjectURL(e),n=document.createElement("a");n.href=o,n.download="LOSEHU-CUSTOM-"+t.flag.join("")+".bin",document.body.appendChild(n),n.click(),document.body.removeChild(n)})},t=B({versions:[],flag:[],disMatrix:[],disName:[],showSort:[]});H(()=>[...t.flag],()=>{w()});const w=()=>{t.flag.map((e,o)=>{t.disMatrix[o].forEach((n,r)=>{t.versions.indexOf("LOSEHU"+t.flag.join("").substring(0,o)+r+t.flag.join("").substring(o+1)+".bin")==-1?t.disMatrix[o].set(r,!0):t.disMatrix[o].set(r,!1)})})},{loading:C,setLoading:b}=W(!0);return R(async()=>{b(!0);let e=await(await fetch("https://k6.vicicode.cn/diyapi/function.json?v="+new Date().getTime())).text();e=JSON.parse(e);let o=[],n=[];e.map(a=>{o[a[a.length-1]-1]=a,n.push(a[a.length-1]-1)}),e=o;let r=[],_=[];e.map(a=>{let m=new Map,d=new Map;for(let s=a[0]*2+1;s<a[0]*3+1;s++)m.set(a[s],!1),M("idea.diy")!=="LOSEHU DIY"?d.set(a[s],a[s-a[0]-a[0]]):d.set(a[s],a[s-a[0]]);r.push(m),_.push(d)}),t.flag=new Array(e.length).fill("0"),t.disName=_,t.disMatrix=r,t.showSort=n;const g=await(await fetch("https://k6.vicicode.cn/diyapi/version.json?v="+new Date().getTime())).text();t.versions=JSON.parse(g),w(),b(!1)}),(e,o)=>{const n=E,r=X,_=T,g=J,a=F,m=G,d=z,s=I,U=K,j=Y;return p(),v("div",P,[l(n,{items:[e.$t("menu.workshop"),e.$t("idea.diy")]},null,8,["items"]),l(j,{gutter:20,align:"stretch"},{default:i(()=>[l(U,{span:24},{default:i(()=>[l(s,{class:"general-card",title:e.$t("idea.diy"),loading:A(C)},{default:i(()=>[l(d,{direction:"vertical"},{default:i(()=>[y("div",null,[c(h(e.$t("oi")),1),l(r,{theme:"primary",href:"https://github.com/losehu/uv-k5-firmware-custom",target:"_blank"},{default:i(()=>[c("https://github.com/losehu/uv-k5-firmware-custom")]),_:1})]),(p(!0),v(k,null,x(t.showSort,f=>(p(),S(g,{modelValue:t.flag[f],"onUpdate:modelValue":u=>t.flag[f]=u,type:"button"},{default:i(()=>[(p(!0),v(k,null,x(t.disMatrix[f],u=>(p(),S(_,{value:u[0],disabled:u[1]},{default:i(()=>[c(h(t.disName[f].get(u[0])),1)]),_:2},1032,["value","disabled"]))),256))]),_:2},1032,["modelValue","onUpdate:modelValue"]))),256)),y("div",null,[l(a,{type:"primary",onClick:N},{default:i(()=>[c(h(e.$t("diy.generate")),1)]),_:1}),c("\xA0\xA0 "),l(m,{onClick:O},{default:i(()=>[c(h(e.$t("global.download")),1)]),_:1})])]),_:1})]),_:1},8,["title","loading"])]),_:1})]),_:1})])}}});const _t=V(Z,[["__scopeId","data-v-09e34cfd"]]);export{_t as default};