import{e as B,q as E,_ as g}from"./index.0670e48a.js";/* empty css              *//* empty css              *//* empty css               *//* empty css               */import{d as w,r as A,bC as k,C as v,D as C,aI as s,aH as c,aM as p,aN as x,G as D,n as m,aZ as N,b8 as I,bA as P,bD as S,bI as T}from"./arco.06c99ad2.js";import{d as F,c as H,r as _,j as V,k as f,l as M,m as j}from"./serial.c741fbda.js";import"./chart.3b6dbf01.js";import"./vue.3660be0a.js";const L={class:"container"},R=["innerHTML"],U={name:"Flash"},q=w({...U,setup(z){const i=B(),t=A({status:"\u70B9\u51FB\u66F4\u65B0\u6309\u94AE\u66F4\u65B0\u56FA\u4EF6\u5230\u8BBE\u5907<br/><br/>",binaryFile:void 0,binaryName:""}),b=()=>{const a=document.createElement("input");a.type="file",a.onchange=async()=>{const u=new Blob([a.files[0]],{type:"application/octet-stream"}),r=new Uint8Array(await u.arrayBuffer());t.binaryFile=r,t.binaryName=a.files[0].name},a.click()},y=async()=>{if(!t.binaryFile){alert("\u8BF7\u9009\u62E9\u6587\u4EF6");return}i.connectPort&&await F(i.connectPort);let a=await H();await _(a,24,1e3);const u=V(t.binaryFile),r=new Uint8Array([48,5,u.length,0,...u]);await f(a,r),await _(a,24);const o=M(t.binaryFile);if(o.length>61439)throw new Error("Last resort boundary check failed. Whoever touched the code is an idiot.");for(let e=0;e<o.length;e+=256){const l=o.slice(e,e+256),d=j(l,e,o.length);try{await f(a,d),await _(a,26)}catch(n){return console.log("Flash command rejected. Aborting."),Promise.reject(n)}t.status=t.status+`\u66F4\u65B0\u8FDB\u5EA6 ${(e/o.length*100).toFixed(1)}%<br/>`,m(()=>{const n=document==null?void 0:document.getElementById("statusArea");n&&(n.scrollTop=n==null?void 0:n.scrollHeight)})}t.status=t.status+"\u66F4\u65B0\u8FDB\u5EA6 100.0%<br/>",t.status=t.status+"\u56FA\u4EF6\u66F4\u65B0\u6210\u529F",m(()=>{const e=document==null?void 0:document.getElementById("statusArea");e&&(e.scrollTop=e==null?void 0:e.scrollHeight)}),F(a),i.updateSettings({connectState:!1})};return(a,u)=>{const r=E,o=N,e=I,l=P,d=k,n=S,h=T;return v(),C("div",L,[s(r,{items:["\u5C0F\u5DE5\u5177","\u56FA\u4EF6\u5347\u7EA7"]}),s(h,{gutter:20,align:"stretch"},{default:c(()=>[s(n,{span:24},{default:c(()=>[s(d,{class:"general-card",title:"\u56FA\u4EF6\u5347\u7EA7\uFF08\u624B\u53F0\u5E94\u5728\u5237\u673A\u6A21\u5F0F\u4E0B\uFF09"},{default:c(()=>[s(e,null,{default:c(()=>[s(o,{onClick:b},{default:c(()=>[p(x(t.binaryFile?t.binaryName:"\u9009\u62E9\u56FA\u4EF6"),1)]),_:1}),s(o,{type:"primary",disabled:!t.binaryFile,onClick:y},{default:c(()=>[p("\u66F4\u65B0")]),_:1},8,["disabled"])]),_:1}),s(l),D("div",{id:"statusArea",style:{height:"20em","background-color":"azure",color:"silver",overflow:"auto",padding:"20px"},innerHTML:t.status},null,8,R)]),_:1})]),_:1})]),_:1})])}}});const Y=g(q,[["__scopeId","data-v-058c0020"]]);export{Y as default};