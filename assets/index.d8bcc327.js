import{s as A,ac as N,_ as O}from"./index.413febc1.js";/* empty css              *//* empty css              *//* empty css               *//* empty css                *//* empty css               */import{d as V,r as C,o as I,bW as P,bI as $,C as R,D as S,aI as s,aH as c,G as p,aM as m,aN as y,n as b,b8 as T,bi as x,bX as D,bG as H,bK as M,bO as j}from"./arco.76adc92f.js";import{f as q}from"./vue.107cc2d0.js";import{d as h,c as U,r as f,j as G,k as g,l as L,m as z,n as W}from"./serial.c6b76da8.js";import"./chart.d41e8c5b.js";const K={class:"container"},X={style:{display:"flex","justify-content":"space-between","align-items":"center"}},J=["innerHTML"],Q={name:"Flash"},Y=V({...Q,setup(Z){const _=A(),e=C({status:"\u70B9\u51FB\u66F4\u65B0\u6309\u94AE\u66F4\u65B0\u56FA\u4EF6\u5230\u8BBE\u5907<br/><br/>",binaryFile:void 0,binaryName:"",protocol:"Official"}),d=q();I(async()=>{var t;if(d.query.url){const o=await fetch(d.query.url),r=(t=o==null?void 0:o.body)==null?void 0:t.getReader();if(r){const n=[];for(;;){const{done:l,value:u}=await r.read();if(l)break;n.push(...u)}const a=new Uint8Array(n);e.binaryFile=a,e.binaryName=d.query.url.substring(d.query.url.lastIndexOf("/")+1).split("?")[0]+" "}}});const F=()=>{const t=document.createElement("input");t.type="file",t.onchange=async()=>{const o=new Blob([t.files[0]],{type:"application/octet-stream"}),r=new Uint8Array(await o.arrayBuffer());e.binaryFile=r,e.binaryName=t.files[0].name},t.click()},w=async()=>{if(!e.binaryFile){alert("\u8BF7\u9009\u62E9\u6587\u4EF6");return}_.connectPort&&await h(_.connectPort);let t=await U();e.protocol=="Official"&&await f(t,24,1e3);const o=G(e.binaryFile),r=new Uint8Array([48,5,o.length,0,...o]);e.protocol=="Official"&&(await g(t,r),await f(t,24));const n=L(e.binaryFile);if(n.length>61439)throw new Error("Last resort boundary check failed. Whoever touched the code is an idiot.");for(let a=0;a<n.length;a+=256){const l=n.slice(a,a+256),u=z(l,a,n.length);try{await g(t,u),e.protocol=="Official"?await f(t,26):await W(t)}catch(i){return console.log("Flash command rejected. Aborting."),Promise.reject(i)}e.status=e.status+`\u66F4\u65B0\u8FDB\u5EA6 ${(a/n.length*100).toFixed(1)}%<br/>`,b(()=>{const i=document==null?void 0:document.getElementById("statusArea");i&&(i.scrollTop=i==null?void 0:i.scrollHeight)})}e.status=e.status+"\u66F4\u65B0\u8FDB\u5EA6 100.0%<br/>",e.status=e.status+"\u56FA\u4EF6\u66F4\u65B0\u6210\u529F",b(()=>{const a=document==null?void 0:document.getElementById("statusArea");a&&(a.scrollTop=a==null?void 0:a.scrollHeight)}),h(t),_.updateSettings({connectState:!1})};return(t,o)=>{const r=N,n=T,a=x,l=P,u=D,i=H,B=$,v=M,k=j;return R(),S("div",K,[s(r,{items:[t.$t("menu.list"),t.$t("menu.flash")]},null,8,["items"]),s(k,{gutter:20,align:"stretch"},{default:c(()=>[s(v,{span:24},{default:c(()=>[s(B,{class:"general-card",title:t.$t("menu.flash")+t.$t("global.onBoot")},{default:c(()=>[p("div",X,[p("div",null,[s(a,null,{default:c(()=>[s(n,{onClick:F},{default:c(()=>[m(y(e.binaryFile?e.binaryName:t.$t("tool.selectFirmware")),1)]),_:1}),s(n,{type:"primary",disabled:!e.binaryFile,onClick:w},{default:c(()=>[m(y(t.$t("tool.flash")),1)]),_:1},8,["disabled"])]),_:1})]),p("div",null,[s(u,{type:"button",size:"mini",modelValue:e.protocol,"onUpdate:modelValue":o[0]||(o[0]=E=>e.protocol=E)},{default:c(()=>[s(l,{value:"Official"},{default:c(()=>[m("Official")]),_:1})]),_:1},8,["modelValue"])])]),s(i),p("div",{id:"statusArea",style:{height:"20em","background-color":"azure",color:"silver",overflow:"auto",padding:"20px"},innerHTML:e.status},null,8,J)]),_:1},8,["title"])]),_:1})]),_:1})])}}});const ut=O(Y,[["__scopeId","data-v-165ad539"]]);export{ut as default};