import{t as B,ad as E,_ as S}from"./index.b5a2f1c9.js";/* empty css              *//* empty css              *//* empty css               *//* empty css               *//* empty css                */import{d as A,r as F,bW as R,bI as T,C as D,D as V,aI as n,aH as o,G as y,aN as p,aM as _,a$ as k,b0 as C,bX as H,b8 as I,bi as P,bG as U,bK as M,bO as N,n as G}from"./arco.9755215d.js";import{i as z,e as K,b as L,g as O}from"./serial.c6b76da8.js";import{C as W}from"./index.775bd006.js";import"./chart.e5f26fc3.js";import"./vue.e23f7fca.js";const X={class:"container"},j=["innerHTML"],q={name:"Chi"},J=A({...q,setup(Q){const u=B(),r=F({status:"\u70B9\u51FB\u5199\u5165\u6309\u94AE\u5199\u5165\u5B57\u5E93\u5230\u8BBE\u5907<br/><br/>",eepromType:"",showHide:0,lang:"Simplified_Chinese"}),g=async(t=0,e)=>{var b;await K(u.connectPort);for(let s=t;s<e.length+t;s+=128)await L(u.connectPort,s,e.slice(s-t,s-t+128),e.slice(s-t,s-t+128).length,(b=u.configuration)==null?void 0:b.uart),r.status=r.status+"\u5199\u5165\u8FDB\u5EA6\uFF1A"+((s-t)/e.length*100).toFixed(1)+"%<br/>",G(()=>{const f=document==null?void 0:document.getElementById("statusArea");f&&(f.scrollTop=f==null?void 0:f.scrollHeight)});r.status=r.status+"\u5199\u5165\u8FDB\u5EA6\uFF1A100.0%<br/>",await O(u.connectPort)},v=async(t=1)=>{var b,s,f,m,w,h;if(u.connectState!=!0){alert(sessionStorage.getItem("noticeConnectK5"));return}if(((b=u.configuration)==null?void 0:b.uart)=="official"){alert(sessionStorage.getItem("noticeVersionNoSupport"));return}r.status=r.status+"\u6B63\u5728\u4E0B\u8F7D\u5B57\u5E93...<br />";let e;if(t==4){(s=u.configuration)!=null&&s.newpinyin?e=await fetch("/pinyin_plus.bin"):e=await fetch("/pinyin.bin");const l=e.body.getReader(),a=[];for(;;){const{done:c,value:i}=await l.read();if(c)break;a.push(...i)}const d=new Uint8Array(a);await g(131072,d);return}if(t==5){const l=await z(u.connectPort,(f=u.configuration)==null?void 0:f.uart);if(l!=262144&&l!=524288){r.status=r.status+"\u53EA\u652F\u6301 2Mbit \u4EE5\u4E0A EEPROM \u5199\u5165<br/>";return}e=await fetch("/ssb.bin");const a=e.body.getReader(),d=[];for(;;){const{done:i,value:$}=await a.read();if(i)break;d.push(...$)}const c=new Uint8Array(d);await g(246312,c);return}if(t==1){if(((m=u.configuration)==null?void 0:m.charset)=="losehu"){e=await fetch("/old_font.bin");const l=e.body.getReader(),a=[];for(;;){const{done:c,value:i}=await l.read();if(c)break;a.push(...i)}const d=new Uint8Array(a);await g(8192,d);return}if(((w=u.configuration)==null?void 0:w.charset)=="gb2312"){e=await fetch("/new_font_k.bin");const l=e.body.getReader(),a=[];for(;;){const{done:c,value:i}=await l.read();if(c)break;a.push(...i)}const d=new Uint8Array(a);await g(9344,d);return}}if(t==6)if(((h=u.configuration)==null?void 0:h.charset)=="gb2312"){e=await fetch("/new_font_k_f.bin");const l=e.body.getReader(),a=[];for(;;){const{done:c,value:i}=await l.read();if(c)break;a.push(...i)}const d=new Uint8Array(a);await g(9344,d);return}else alert("\u4E0D\u652F\u6301\u7684\u7248\u672C")};return(t,e)=>{const b=E,s=R,f=H,m=I,w=W,h=P,l=U,a=T,d=M,c=N;return D(),V("div",X,[n(b,{items:[t.$t("menu.list"),t.$t("menu.font")]},null,8,["items"]),n(c,{gutter:20,align:"stretch"},{default:o(()=>[n(d,{span:24},{default:o(()=>[n(a,{class:"general-card"},{title:o(()=>[y("span",{onClick:e[0]||(e[0]=()=>{r.showHide+=1})},p(t.$t("menu.font")+t.$t("global.onStart")),1)]),default:o(()=>[n(h,null,{default:o(()=>[n(w,{bordered:"",style:{width:"420px"}},{header:o(()=>[_(p(t.$t("tool.fontwrite"))+" ",1),y("div",null,[n(f,{type:"button",size:"mini",modelValue:r.lang,"onUpdate:modelValue":e[1]||(e[1]=i=>r.lang=i)},{default:o(()=>[n(s,{value:"Simplified_Chinese"},{default:o(()=>[_(p(t.$t("tool.Simplified_Chinese")),1)]),_:1}),n(s,{value:"Traditional_Chinese"},{default:o(()=>[_(p(t.$t("tool.Traditional_Chinese")),1)]),_:1})]),_:1},8,["modelValue"])])]),default:o(()=>[y("div",null,[k(n(m,{onClick:e[2]||(e[2]=i=>v(1))},{default:o(()=>[_(p(t.$t("tool.writefontwrite")),1)]),_:1},512),[[C,r.lang=="Simplified_Chinese"]]),k(n(m,{onClick:e[3]||(e[3]=i=>v(6))},{default:o(()=>[_(p(t.$t("tool.writefontwrite")),1)]),_:1},512),[[C,r.lang=="Traditional_Chinese"]])])]),_:1}),n(w,{bordered:""},{header:o(()=>[_(p(t.$t("tool.pinyinwrite")),1)]),default:o(()=>[n(h,null,{default:o(()=>[n(m,{onClick:e[4]||(e[4]=i=>v(4))},{default:o(()=>[_(p(t.$t("tool.writepinyin")),1)]),_:1})]),_:1})]),_:1}),n(w,{bordered:""},{header:o(()=>[_(p(t.$t("tool.ssbpatch")),1)]),default:o(()=>[n(h,null,{default:o(()=>[n(m,{onClick:e[5]||(e[5]=i=>v(5))},{default:o(()=>[_(p(t.$t("tool.writessbpatch")),1)]),_:1})]),_:1})]),_:1})]),_:1}),n(l),y("div",{id:"statusArea",style:{height:"20em","background-color":"var(--color-bg-3)",color:"var(--color-text-3)",overflow:"auto",padding:"20px"},innerHTML:r.status},null,8,j)]),_:1})]),_:1})]),_:1})])}}});const ue=S(J,[["__scopeId","data-v-c809b00a"]]);export{ue as default};