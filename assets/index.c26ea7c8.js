import{e as k,as as P,_ as R}from"./index.e890ba1d.js";/* empty css              *//* empty css              *//* empty css               */import{d as F,r as U,o as V,bH as H,bO as O,C as b,D as w,aI as f,aH as _,G as v,aK as C,aJ as M,F as T,aM as $,aN as B,a$ as A,ba as j,bI as q,bL as z,be as K,bf as G}from"./arco.f43727df.js";import{h as J}from"./vue.cbdb927d.js";import{e as Q,b as W,g as X}from"./serial.c741fbda.js";import"./chart.3c227ebb.js";const E=y=>(K("data-v-935d49c8"),y=y(),G(),y),Y={class:"container"},Z=E(()=>v("div",{id:"canvasDiv",style:{zoom:"250%",display:"none"}},null,-1)),tt={style:{padding:"0",margin:"0","border-spacing":"0"}},et=["onMousedown","onMouseover"],ot=E(()=>v("br",null,null,-1)),nt={name:"Backup"},at=F({...nt,setup(y){const g=k(),i=U({binaryFile:void 0,loading:!1,matrix:[],mousedown:!1}),I=J();V(async()=>{if(I.query.url){const t=await fetch(I.query.url,{responseType:"blob"});D(window.URL.createObjectURL(await t.blob()))}});const S=(t,s)=>{if(i.mousedown){const l=i.matrix;l[s][t]=i.matrix[s][t]=="#fff"?"#000":"#fff",i.matrix=l}},D=t=>{const s=document.createElement("canvas");s.width=128,s.height=64;const l=s.cloneNode(),o=document.getElementById("canvasDiv");o.innerHTML="",o==null||o.append(s,l);const p=new Image;p.src=t,p.onload=()=>{const r=s.getContext("2d");r==null||r.drawImage(p,0,0,128,64);const m=r==null?void 0:r.getImageData(0,0,s.width,s.height).data;function d(e,n){const a=(n*128+e)*4;return m[a]+m[a+1]+m[a+2]>128*3?0:1}const u=[];for(let e=0;e<64;e++){u.push([]),u[e]=[];for(let n=0;n<128;n++){const c=!d(n,e);u[e][n]=c?"#fff":"#000"}}i.matrix=u}},L=()=>{const t=document.createElement("input");t.type="file",t.onchange=async()=>{const s=new Blob([t.files[0]],{type:"application/octet-stream"}),l=URL.createObjectURL(s),o=document.createElement("canvas");o.width=128,o.height=64;const p=o.cloneNode(),r=document.getElementById("canvasDiv");r.innerHTML="",r==null||r.append(o,p);const m=new Image;m.src=l,m.onload=()=>{const d=o.getContext("2d");d==null||d.drawImage(m,0,0,128,64);const u=d==null?void 0:d.getImageData(0,0,o.width,o.height).data;function e(c,a){const x=(a*128+c)*4;return u[x]+u[x+1]+u[x+2]>128*3?0:1}const n=[];for(let c=0;c<64;c++){n.push([]),n[c]=[];for(let a=0;a<128;a++){const h=!e(a,c);n[c][a]=h?"#fff":"#000"}}i.matrix=n}},t.click()},N=async()=>{var p,r,m,d,u;const t=new Uint8Array(1024);let s=0;for(let e=0;e<64;e+=8)for(let n=0;n<128;n++){let c=0;for(let a=0;a<8;a++)c|=(i.matrix[e+a][n]=="#000"?1:0)<<a;t[s++]=c}if(i.binaryFile=t,g.connectState!=!0){alert(sessionStorage.getItem("noticeConnectK5"));return}if(((p=g.configuration)==null?void 0:p.uart)=="official"){alert(sessionStorage.getItem("noticeVersionNoSupport"));return}if(((r=g.configuration)==null?void 0:r.charset)!="losehu"&&((m=g.configuration)==null?void 0:m.charset)!="gb2312"){alert(sessionStorage.getItem("noticeVersionNoSupport"));return}i.loading=!0;let l=123728;((d=g.configuration)==null?void 0:d.charset)=="gb2312"&&(l=8320),await Q(g.connectPort);const o=i.binaryFile;for(let e=l;e<o.length+l;e+=128)await W(g.connectPort,e,o.slice(e-l,e-l+128),128,(u=g.configuration)==null?void 0:u.uart);await X(g.connectPort),i.loading=!1};return(t,s)=>{const l=P,o=A,p=j,r=H,m=O,d=q,u=z;return b(),w("div",Y,[f(l,{items:[t.$t("menu.list"),t.$t("menu.image")]},null,8,["items"]),f(u,{gutter:20,align:"stretch"},{default:_(()=>[f(d,{span:24},{default:_(()=>[f(m,{loading:i.loading,tip:"\u5199\u5165\u4E2D...",style:{width:"100%"}},{default:_(()=>[f(r,{class:"general-card",title:t.$t("menu.image")+t.$t("global.onStart")},{default:_(()=>[Z,v("div",null,[v("table",tt,[(b(!0),w(C,null,M(i.matrix,(e,n)=>(b(),w("tr",null,[(b(!0),w(C,null,M(e,(c,a)=>(b(),w("td",{onMousedown:h=>{i.mousedown=!0,S(a,n)},onMouseup:s[0]||(s[0]=h=>{i.mousedown=!1}),onMouseover:h=>S(a,n),style:T("background-color: "+c+"; height: 5px; width: 3.5px;")},null,44,et))),256))]))),256))])]),ot,f(p,null,{default:_(()=>[f(o,{onClick:L},{default:_(()=>[$(B(t.$t("tool.selectImage")),1)]),_:1}),f(o,{type:"primary",disabled:i.matrix.length<64,onClick:N},{default:_(()=>[$(B(t.$t("tool.write")),1)]),_:1},8,["disabled"])]),_:1})]),_:1},8,["title"])]),_:1},8,["loading"])]),_:1})]),_:1})])}}});const pt=R(at,[["__scopeId","data-v-935d49c8"]]);export{pt as default};