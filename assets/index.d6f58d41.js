import{m as j,ak as K,_ as G}from"./index.c4ad0b59.js";/* empty css              *//* empty css              *//* empty css               */import{d as W,r as Z,o as q,bI as Q,C as h,D as E,aI as c,aH as i,aM as m,aN as b,G as d,aK as x,aJ as S,F as N,aE as X,u as Y,a6 as ee,a$ as te,ba as ae,bJ as oe,bL as ne,be as re,bf as se,n as le}from"./arco.7f845a67.js";import{u as ie}from"./loading.1a4e75f4.js";import{i as ce,e as ue,s as D,h as M,g as de,l as pe,b as me}from"./serial.c6b76da8.js";import{B as _e}from"./index.b619bc90.js";import{I as ge}from"./index.28d45399.js";import{C as fe}from"./index.bb31a8df.js";import{S as he}from"./index.3ca10597.js";import"./chart.95d38b48.js";import"./vue.0bef8fc5.js";import"./useConfig.72fe6f25.js";import"./index.afea8a64.js";import"./helper.1bee26d0.js";import"./useDisabled.54b0051c.js";import"./useGlobalIcon.ac7d6aea.js";import"./slot.33f80bbb.js";const k=F=>(re("data-v-a3f3183c"),F=F(),se(),F),be={class:"container"},Fe=k(()=>d("div",{style:{color:"red","font-weight":"bold"}},"\u26A0\uFF1A\u5B9E\u9A8C\u6027\u529F\u80FD \u4F7F\u7528\u53EF\u80FD\u4F1A\u635F\u574F\u624B\u53F0",-1)),we={style:{display:"flex","justify-content":"space-between","margin-left":"10px","margin-right":"10px","align-items":"flex-end","margin-bottom":"3px"}},ye=k(()=>d("div",null,"EEPROM\uFF1A",-1)),Ae={style:{width:"100%",overflow:"scroll","user-select":"none"}},Ee={style:{height:"328px",display:"flex","flex-direction":"column",margin:"0",padding:"0","flex-wrap":"wrap"}},ve=["onClick","ondragover","ondrop","title"],Ce=k(()=>d("br",null,null,-1)),ke=["innerHTML"],Be={name:"BL"},xe=W({...Be,setup(F){const p=j(),{loading:U,setLoading:w}=ie(!0),t=Z({calendar:[],rom:[],bl:void 0,blName:"",nowDrag:-1,showAdd:"",status:""}),g=async(e=0,a,n="")=>{var l;for(let r=e;r<a.length+e;r+=192)await me(p.connectPort,r,a.slice(r-e,r-e+192),a.slice(r-e,r-e+192).length,(l=p.configuration)==null?void 0:l.uart),t.status=t.status+n+"\u5199\u5165\u8FDB\u5EA6\uFF1A"+((r-e)/a.length*100).toFixed(1)+"%<br/>",le(()=>{const o=document==null?void 0:document.getElementById("statusArea");o&&(o.scrollTop=o==null?void 0:o.scrollHeight)})},$=async e=>{t.showAdd=(e*64+262144).toString(16).toUpperCase(),setTimeout(()=>{t.showAdd=""},5e3)};q(()=>{I();const e=[];for(let a=0;a<262144/64;a++)a<278528/64/16-16?e.push(-2):e.push(-1);t.calendar=e});const I=async()=>{const e=JSON.parse(await(await fetch("https://k5.vicicode.com/diyapi/bl.json")).text()).latest;t.blName=e;const a=await fetch("https://k5.vicicode.com/diyapi/"+e);if(a.body){const n=a.body.getReader(),l=[];for(;;){const{done:o,value:_}=await n.read();if(o)break;l.push(..._)}let r=new Uint8Array(12288);r.set(l,0),t.bl=r,w(!1)}},P=async()=>{var r;if(p.connectState!=!0){alert(sessionStorage.getItem("noticeConnectK5"));return}const e=await ce(p.connectPort,(r=p.configuration)==null?void 0:r.uart);if(w(!0),e<524288){alert("\u53EA\u652F\u6301 4Mbit \u4EE5\u4E0A EEPROM \u5199\u5165"),w(!1);return}await ue(p.connectPort),await g(266240,t.bl,"\u5F15\u5BFC\u7A0B\u5E8F");const a=[];for(let o=256;o<4096;o++)t.calendar[o]>=0&&(console.log(o),a.push({...t.rom[t.calendar[o]],start:262144+o*64,end:262144+(o+Math.ceil(t.rom[t.calendar[o]].binaryFile.length/64))*64-1}),o+=Math.ceil(t.rom[t.calendar[o]].binaryFile.length/64)-1);await g(262144,new Uint8Array([a.length]),"\u56FA\u4EF6\u6570\u91CF");const n=new Uint8Array(8);n.set(D(t.blName.split(".")[0])),await g(262152,n,"\u5F15\u5BFC\u7A0B\u5E8F\u7248\u672C");const l=[];a.map(o=>{const _=new Uint8Array(16),y=new Uint8Array(4),A=new Uint8Array(4);_.set(D(o.binaryName)),y.set(M(o.start.toString(16))),A.set(M(o.end.toString(16))),l.push(..._,...y,...A,...new Uint8Array(8))}),await g(262176,l,"\u56FA\u4EF6\u5143\u6570\u636E");for(let o=0;o<a.length;o++)await g(a[o].start,a[o].binaryFile,a[o].binaryName+" \u56FA\u4EF6\u6587\u4EF6");await de(p.connectPort),t.status=t.status+"\u5199\u5165\u5B8C\u6210<br/>",w(!1)},L=()=>{const e=document.createElement("input");e.type="file",e.onchange=async()=>{if(e.files){const a=new Blob([e.files[0]],{type:"application/octet-stream"}),n=new Uint8Array(await a.arrayBuffer()),l={binaryFile:pe(n),binaryName:e.files[0].name,color:T()};t.rom.push(l)}},e.click()},R=(e,a)=>{if(!(a<256)&&!(a+Math.ceil(t.rom[t.nowDrag].binaryFile.length/64)>4096)&&e!=2){for(let n=a;n<a+Math.ceil(t.rom[t.nowDrag].binaryFile.length/64);n+=1)v(n);for(let n=a;n<a+Math.ceil(t.rom[t.nowDrag].binaryFile.length/64);n+=1)t.calendar[n]=t.nowDrag;console.log((a*64+262144).toString(16)),console.log((Math.ceil(t.rom[t.nowDrag].binaryFile.length/64)*64+(a*64+262144)-1).toString(16))}},T=()=>{for(var e="0123456789ABCDEF",a="#",n=0;n<6;n++)a+=e[Math.floor(Math.random()*16)];return a},v=e=>{if(e>4095||e<256)return;let a=0;t.calendar[e]!=-1&&(a=1,t.calendar[e]=-1),a&&(t.calendar[e-1]!=-1&&v(e-1),t.calendar[e+1]!=-1&&v(e+1))},C=e=>{if(e>4095||e<256)return;let a=-99;t.calendar[e]!=-1&&(a=t.calendar[e],t.calendar[e]=-1),t.calendar[e-1]===a&&C(e-1),t.calendar[e+1]===a&&C(e+1)},B=e=>{e>4095||e<256||(t.calendar[e]=-1,B(e+1))},V=e=>{t.rom[e].binaryName=t.rom[e].binaryName.replace(/[^\a-\z\A-\Z0-9.]/g,"")};return(e,a)=>{const n=K,l=ee,r=te,o=ae,_=oe,y=ne,A=_e,O=ge,z=fe,H=he,J=Q;return h(),E("div",be,[c(n,{items:[e.$t("menu.list"),e.$t("bl")]},null,8,["items"]),c(J,{class:"general-card",loading:Y(U)},{title:i(()=>[Fe,m(" "+b(e.$t("bl"))+" "+b(e.$t("global.onStart")),1)]),default:i(()=>[c(y,{style:{"margin-bottom":"16px"}},{default:i(()=>[c(_,{span:12},{default:i(()=>[c(o,{style:{width:"130%"}},{default:i(()=>[c(r,{onClick:P},{icon:i(()=>[c(l)]),default:i(()=>[m(" "+b(e.$t("cps.onDeviceWrite")),1)]),_:1}),m(" \uFF08\u56FA\u4EF6\u540D\u79F0\u4EC5\u652F\u6301\u82F1\u6587\uFF09 ")]),_:1})]),_:1})]),_:1}),d("div",we,[ye,d("div",null,[m(b(t.showAdd)+" ",1),c(A,{size:"small",variant:"outline",onClick:a[0]||(a[0]=s=>B(256))},{default:i(()=>[m("\u6E05\u7A7A")]),_:1})])]),d("div",Ae,[d("div",Ee,[(h(!0),E(x,null,S(t.calendar,(s,u)=>(h(),E("div",{onClick:f=>C(u),ondragover:f=>{$(u),f.preventDefault()},ondrop:()=>{R(s,u)},title:s==-2?"\u5F15\u5BFC\u7A0B\u5E8F\u5360\u7528\u533A":s!=-1?t.rom[s].binaryName:(u*64+262144).toString(16).toUpperCase()+" - "+(u*64+262144+63).toString(16).toUpperCase(),style:N(s==-1?"background-color: white; border: 1px solid #ddd; height: 10px;":s==-2?"background-color: #373737; border: 1px solid #ddd; height: 10px;":"background-color: "+t.rom[s].color+"; border: 1px solid #ddd; height: 10px;"),key:u}," \xA0 ",12,ve))),128))])]),c(r,{style:{"margin-bottom":"10px"},onClick:L},{default:i(()=>[m(b(t.binaryFile?t.binaryName:e.$t("tool.selectFirmware")),1)]),_:1}),m("\uFF08\u9009\u62E9\u56FA\u4EF6\u540E\u5C06\u56FA\u4EF6\u5361\u7247\u62D6\u62FD\u5230\u4E0A\u65B9 EEPROM\uFF09 "),Ce,c(H,{"break-line":""},{default:i(()=>[(h(!0),E(x,null,S(t.rom,(s,u)=>(h(),X(z,{draggable:"true",ondragstart:()=>{t.nowDrag=u},title:s.binaryName,bordered:!0,"hover-shadow":"",style:{width:"400px"}},{actions:i(()=>[d("div",{style:N("width: 10px; height: 10px; background-color: "+s.color+";")},null,4)]),default:i(()=>[c(O,{modelValue:s.binaryName,"onUpdate:modelValue":f=>s.binaryName=f,onChange:f=>V(u),"show-limit-number":"",maxlength:13},null,8,["modelValue","onUpdate:modelValue","onChange"])]),_:2},1032,["ondragstart","title"]))),256))]),_:1})]),_:1},8,["loading"]),d("div",{id:"statusArea",style:{height:"20em","background-color":"azure",color:"silver",overflow:"auto",padding:"20px","margin-top":"10px"},innerHTML:t.status},null,8,ke)])}}});const We=G(xe,[["__scopeId","data-v-a3f3183c"]]);export{We as default};
