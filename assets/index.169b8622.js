import{d as Ft,g as vt,_ as It}from"./index.4032364f.js";import{ac as xt,ad as Vt,a8 as Tt,a2 as At,b as Ct,a0 as Dt,P as kt,f as Ut,a1 as Pt,ab as $t,d as Ot,k as Bt,ae as Rt,O as Nt,U as Et,_ as Lt}from"./@arco-design.5e2b2073.js";import"./vue.83b9e9de.js";import{e as M,g as it,h as u,b as c,s as qt}from"./serial.d615852e.js";import{u as Mt}from"./loading.3552afe6.js";import{b as Ht}from"./qrcode.ce560eaa.js";import{B as zt}from"./tdesign-vue-next.de6f3c5b.js";import{d as Yt,r as H,h as Zt,l as jt,m as Jt,o as w,a as I,x as n,u as i,z as f,A as g,e as F,_ as Kt,N as ut,O as pt,F as D,Q as k,s as U,D as dt,b9 as Qt,b8 as Gt}from"./@vue.2faf1d8e.js";import"./vue-echarts.5aab67d4.js";import"./resize-detector.a8854a64.js";import"./echarts.5b0e6023.js";import"./zrender.ce26131e.js";import"./tslib.c6ba9914.js";import"./vue-router.2630bdf9.js";import"./nprogress.b0a22fe3.js";import"./@intlify.d4358f23.js";import"./mitt.550594b0.js";import"./pinia.84b4adc6.js";import"./vue-demi.61f15e01.js";import"./axios.f3f20840.js";import"./vue-i18n.3095106f.js";import"./@vueuse.7fb11548.js";import"./aegis-web-sdk.846094f8.js";import"./@zxing.8654f0db.js";import"./vue-matomo.4c7efa96.js";import"./b-tween.8dd4e2fe.js";import"./dayjs.4c867136.js";import"./b-validate.1fdaeb97.js";import"./number-precision.5cddbed2.js";import"./resize-observer-polyfill.2b976e6e.js";import"./scroll-into-view-if-needed.0a5da943.js";import"./compute-scroll-into-view.17358474.js";import"./tdesign-icons-vue-next.6eb4e7b8.js";import"./sortablejs.b2e3c7c4.js";import"./@popperjs.f3f73334.js";import"./dijkstrajs.5ad0a308.js";const Wt=x=>(Qt("data-v-10614cc6"),x=x(),Gt(),x),Xt={class:"container"},te={style:{"text-align":"center"}},ee=["src"],ae=Wt(()=>F("br",null,null,-1)),oe={style:{width:"100%"}},se=["innerHTML"],le={name:"Sat"},ne=Yt({...le,setup(x){const{loading:ct,setLoading:b}=Mt(!0),l=Ft(),P=H(null),$=H(null),O=H(null),t=Zt({uuid:"",qrcode:"",visible:!1,showHide:0,status:"\u70B9\u51FB\u5199\u5165\u6309\u94AE\u5199\u5165\u536B\u661F\u6570\u636E\u5230\u8BBE\u5907<br/><br/>",sat:"",satData:[],lng:0,lat:0,alt:0,tx:0,rx:0,txTone:0,rxTone:0,CTCSSOption:[67,69.3,71.9,74.4,77,79.7,82.5,85.4,88.5,91.5,94.8,97.4,100,103.5,107.2,110.9,114.8,118.8,123,127.3,131.8,136.5,141.3,146.2,151.4,156.7,159.8,162.2,165.5,167.9,171.3,173.8,177.3,179.9,183.5,186.2,189.9,192.8,196.6,199.5,203.5,206.5,210.7,218.1,225.7,229.1,233.6,241.8,250.3,254.1],pass:void 0,passOption:[],dt:"",timer:void 0,passCustom:void 0,dtCustom:void 0,freqDb:[],selfSatModal:!1,selfSatInfo:""});jt(async()=>{try{if(sessionStorage.getItem("satFrequenciesRst"))t.freqDb=JSON.parse(sessionStorage.getItem("satFrequenciesRst")||"[]");else{const e=await(await fetch("https://github.jobcher.com/gh/https://raw.githubusercontent.com/palewire/ham-satellite-database/main/data/amsat-active-frequencies.json")).text();t.freqDb=JSON.parse(e),sessionStorage.setItem("satFrequenciesRst",e)}}catch{}t.lng=parseFloat(localStorage.getItem("myLng")||"0"),t.lat=parseFloat(localStorage.getItem("myLat")||"0"),t.alt=parseFloat(localStorage.getItem("myAlt")||"0"),await P.value.$forceUpdate(),await $.value.$forceUpdate(),await O.value.$forceUpdate(),t.lng=parseFloat(P.value.inputRef.modelValue||"0"),t.lat=parseFloat($.value.inputRef.modelValue||"0"),t.alt=parseFloat(O.value.inputRef.modelValue||"0"),t.timer=setInterval(()=>{t.dt=new Date().toLocaleString(),localStorage.setItem("myLng",t.lng.toString()),localStorage.setItem("myLat",t.lat.toString()),localStorage.setItem("myAlt",t.alt.toString())},1e3)}),Jt(()=>{try{clearInterval(t.timer)}catch{}});const mt=async()=>{if(l.connectState!=!0){alert(sessionStorage.getItem("noticeConnectK5"));return}b(!0),await M(l.connectPort),await z(),await it(l.connectPort),b(!1)},z=async()=>{var o;const e=t.dtCustom?new Date(t.dtCustom):new Date,a=[...u(parseInt(e.getFullYear().toString().substring(2,4)).toString(16)),...u((e.getMonth()+1).toString(16)),...u(e.getDate().toString(16)),...u(e.getHours().toString(16)),...u(e.getMinutes().toString(16)),...u(e.getSeconds().toString(16))];await c(l.connectPort,11200,new Uint8Array(a),6,(o=l.configuration)==null?void 0:o.uart)},ft=async e=>{const a=t.satData.find(o=>o.name==e);if(a&&a.path){t.status+="<br/>\u536B\u661F\u53C2\u6570\uFF1A<br/>",a.path.map(r=>{t.status+=r+"<br/>"});let o=!1;t.freqDb.map(r=>{a.path[1].split(" ")[1]==r.norad_id&&r.mode.indexOf("FM")!=-1&&(console.log(r),o=!0,t.tx=r.uplink?parseFloat(r.uplink.split("/")[0]):0,t.rx=r.downlink?parseFloat(r.downlink.split("/")[0]):0,t.txTone=parseFloat([0,...t.CTCSSOption].reduce((m,p)=>r.mode.indexOf(p)!=-1?p:m)))}),o||(t.tx=0,t.rx=0,t.txTone=0,t.rxTone=0)}dt(()=>{const o=document==null?void 0:document.getElementById("statusArea");o&&(o.scrollTop=o==null?void 0:o.scrollHeight)})};(async()=>{b(!0);let e="";sessionStorage.getItem("satRst")?e=sessionStorage.getItem("satRst")||"":(e=await(await fetch("https://celestrak.org/NORAD/elements/amateur.txt")).text(),sessionStorage.setItem("satRst",e));const a=e.split(/\r?\n/),o=[];let r={};for(let m=0;m<a.length;m++)Number.isNaN(parseInt(a[m].substring(0,1)))?(r.name&&r.name!=""&&(o.push(r),r={}),r.name=a[m]):(r.path||(r.path=[]),r.path.push(a[m]));t.satData=o,b(!1)})();const Y=async()=>{b(!0),navigator.geolocation.getCurrentPosition(e=>{e.coords&&(t.lat=e.coords.latitude,t.lng=e.coords.longitude,e.coords.altitude&&(t.alt=e.coords.altitude))}),b(!1)};Y();const gt=async()=>{t.visible=!0,t.uuid=crypto.randomUUID(),t.qrcode=await Ht.toDataURL(location.origin+"/#/satloc?uuid="+t.uuid,{width:250}),console.log(t.uuid)},_t=async()=>{const e=await(await fetch("https://k5.vicicode.cn/api/lol",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({func:1,uuid:t.uuid})})).json(),a=JSON.parse(e.cache);a.length>=3&&(t.lng=a[0],t.lat=a[1],t.alt=a[2])},bt=async(e=0,a)=>{var o;await M(l.connectPort);for(let r=e;r<a.length+e;r+=128)await c(l.connectPort,r,a.slice(r-e,r-e+128),128,(o=l.configuration)==null?void 0:o.uart),t.status=t.status+"\u5199\u5165\u8FDB\u5EA6\uFF1A"+((r-e)/a.length*100).toFixed(1)+"%<br/>",dt(()=>{const m=document==null?void 0:document.getElementById("statusArea");m&&(m.scrollTop=m==null?void 0:m.scrollHeight)});t.status=t.status+"\u5199\u5165\u8FDB\u5EA6\uFF1A100.0%<br/>"},wt=async()=>{if(!t.sat){alert("\u8BF7\u9009\u62E9\u536B\u661F\uFF01");return}b(!0);const e=await(await fetch("https://k5.vicicode.cn/api/pass",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({sat:t.sat,sat_line_1:t.satData.find(o=>o.name==t.sat).path[0],sat_line_2:t.satData.find(o=>o.name==t.sat).path[1],lat:t.lat,lng:t.lng,alt:t.alt,tz:Intl.DateTimeFormat().resolvedOptions().timeZone})})).json(),a=[];for(let o=0;o<e.pass_times.length;o++)try{let r;Date.parse(e.departure_times[o])-Date.parse(e.pass_times[o])>0?r=[e.pass_times[o],e.departure_times[o]]:r=[e.pass_times[o],e.departure_times[o+1]],a.push(r)}catch{}a.length>0?t.pass=a[0][0]+"|"+a[0][1]:t.pass=void 0,t.passOption=a,b(!1)},yt=async()=>{var T,A,s,Z,j,J,K,Q,G,W,X,tt,et,at,ot,st,lt,nt;if(l.connectState!=!0){alert(sessionStorage.getItem("noticeConnectK5"));return}if(((T=l.configuration)==null?void 0:T.sat)!=!0){alert(sessionStorage.getItem("noticeVersionNoSupport"));return}if(!t.sat){alert("\u8BF7\u9009\u62E9\u536B\u661F\uFF01");return}if(t.passCustom&&(t.pass=t.passCustom[0]+"|"+t.passCustom[1]),!t.pass){alert("\u8BF7\u9009\u62E9\u8FC7\u5883\u65F6\u95F4\uFF01");return}b(!0);const e=await(await fetch("https://k5.vicicode.cn/api/doppler",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({sat:t.sat,sat_line_1:t.satData.find(h=>h.name==t.sat).path[0],sat_line_2:t.satData.find(h=>h.name==t.sat).path[1],lat:t.lat,lng:t.lng,alt:t.alt,tx:t.tx,rx:t.rx,pass_time:t.pass.split("|")[0],departure_time:t.pass.split("|")[1],tz:Intl.DateTimeFormat().resolvedOptions().timeZone})})).json(),a=t.sat,o=t.pass.split("|")[0],r=o.split("-")[0].substring(2,4),m=o.split("-")[1],p=o.split("-")[2].split(" ")[0],B=o.split(" ")[1].split(":")[0],R=o.split(" ")[1].split(":")[1],y=o.split(" ")[1].split(":")[2],_=t.pass.split("|")[1],N=_.split("-")[0].substring(2,4),S=_.split("-")[1],v=_.split("-")[2].split(" ")[0],E=_.split(" ")[1].split(":")[0],L=_.split(" ")[1].split(":")[1],q=_.split(" ")[1].split(":")[2];await M(l.connectPort);let d=new Uint8Array(10);d.set(qt(a.trim()).subarray(0,9)),await c(l.connectPort,11168,d,10,(A=l.configuration)==null?void 0:A.uart),await c(l.connectPort,11178,u(parseInt(r).toString(16)).subarray(0,1),1,(s=l.configuration)==null?void 0:s.uart),await c(l.connectPort,11179,u(parseInt(m).toString(16)).subarray(0,1),1,(Z=l.configuration)==null?void 0:Z.uart),await c(l.connectPort,11180,u(parseInt(p).toString(16)).subarray(0,1),1,(j=l.configuration)==null?void 0:j.uart),await c(l.connectPort,11181,u(parseInt(B).toString(16)).subarray(0,1),1,(J=l.configuration)==null?void 0:J.uart),await c(l.connectPort,11182,u(parseInt(R).toString(16)).subarray(0,1),1,(K=l.configuration)==null?void 0:K.uart),await c(l.connectPort,11183,u(parseInt(y).toString(16)).subarray(0,1),1,(Q=l.configuration)==null?void 0:Q.uart),await c(l.connectPort,11184,u(parseInt(N).toString(16)).subarray(0,1),1,(G=l.configuration)==null?void 0:G.uart),await c(l.connectPort,11185,u(parseInt(S).toString(16)).subarray(0,1),1,(W=l.configuration)==null?void 0:W.uart),await c(l.connectPort,11186,u(parseInt(v).toString(16)).subarray(0,1),1,(X=l.configuration)==null?void 0:X.uart),await c(l.connectPort,11187,u(parseInt(E).toString(16)).subarray(0,1),1,(tt=l.configuration)==null?void 0:tt.uart),await c(l.connectPort,11188,u(parseInt(L).toString(16)).subarray(0,1),1,(et=l.configuration)==null?void 0:et.uart),await c(l.connectPort,11189,u(parseInt(q).toString(16)).subarray(0,1),1,(at=l.configuration)==null?void 0:at.uart),d=new Uint8Array(2),d.set(u(((Date.parse(_)-Date.parse(o))/1e3).toString(16)).subarray(0,2)),await c(l.connectPort,11190,d,2,(ot=l.configuration)==null?void 0:ot.uart),d=new Uint8Array(2),t.txTone&&t.txTone>0&&d.set(u(parseInt((t.txTone*10).toFixed(0)).toString(16)).subarray(0,2)),await c(l.connectPort,11192,d,2,(st=l.configuration)==null?void 0:st.uart),d=new Uint8Array(2),t.rxTone&&t.rxTone>0&&d.set(u(parseInt((t.rxTone*10).toFixed(0)).toString(16)).subarray(0,2)),await c(l.connectPort,11194,d,2,(lt=l.configuration)==null?void 0:lt.uart),d=new Uint8Array(4),d.set(u(((Date.parse(o)-Date.parse("2000-01-01 00:00:00"))/1e3).toString(16)).subarray(0,4)),await c(l.connectPort,11196,d,4,(nt=l.configuration)==null?void 0:nt.uart);const V=[];e.shift_array.filter((h,C)=>C%2===0).map(h=>{const C=new Uint8Array(4),rt=new Uint8Array(4);C.set(u(parseInt(((t.tx*1e6+h[0])/10).toFixed(0)).toString(16))),rt.set(u(parseInt(((t.rx*1e6+h[1])/10).toFixed(0)).toString(16))),V.push(...C,...rt)}),d=new Uint8Array(7680),d.set(new Uint8Array(V).subarray(0,7680)),await bt(123392,d),await z(),await it(l.connectPort),b(!1)},St=e=>!!new RegExp("^(https?:\\/\\/)?((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*(\\?[;&a-zA-Z\\d%_.~+=-]*)?(\\#[-a-zA-Z\\d_]*)?$","i").test(e),ht=async()=>{St(t.selfSatInfo)&&(t.selfSatInfo=await(await fetch(t.selfSatInfo)).text());const e=(t.selfSatInfo+`
`).split(/\r?\n/),a=[];let o={};for(let r=0;r<e.length;r++)Number.isNaN(parseInt(e[r].substring(0,1)))?(o.name&&o.name!=""&&(a.push(o),o={}),o.name=e[r]):(o.path||(o.path=[]),o.path.push(e[r]));t.satData=a.concat(t.satData),t.selfSatInfo=""};return(e,a)=>{const o=xt,r=Ut,m=vt,p=Pt,B=Vt,R=zt,y=$t,_=Tt,N=At,S=Ct,v=Ot,E=Bt,L=Rt,q=Nt,d=Dt,V=kt,T=Et,A=Lt;return w(),I("div",Xt,[n(r,{width:"650px",visible:t.selfSatModal,"onUpdate:visible":a[1]||(a[1]=s=>t.selfSatModal=s),onOk:ht},{title:i(()=>[f(g(e.$t("sat.selfSatInfo")),1)]),default:i(()=>[F("div",null,[n(o,{modelValue:t.selfSatInfo,"onUpdate:modelValue":a[0]||(a[0]=s=>t.selfSatInfo=s),style:{height:"120px"},placeholder:`ISS (ZARYA)             \r
1 25544U 98067A   24320.36274227  .00015569  00000+0  28188-3 0  9999\r
2 25544  51.6413 286.4173 0007936 217.3657 298.3197 15.49809951481990`},null,8,["modelValue"])])]),_:1},8,["visible"]),n(r,{visible:t.visible,"onUpdate:visible":a[2]||(a[2]=s=>t.visible=s),onOk:_t,"ok-text":e.$t("tool.scaned")},{title:i(()=>[f(g(e.$t("tool.scanqr")),1)]),default:i(()=>[F("div",te,[F("img",{src:t.qrcode},null,8,ee),ae,f(" "+g(e.$t("tool.scannotice")),1)])]),_:1},8,["visible","ok-text"]),n(m,{items:[e.$t("menu.list"),e.$t("menu.satellite")]},null,8,["items"]),n(A,{gutter:20,align:"stretch"},{default:i(()=>[n(T,{span:24},{default:i(()=>[n(V,{class:"general-card",title:e.$t("menu.satellite")+e.$t("global.onStart")},{default:i(()=>[n(d,{loading:Kt(ct),style:{width:"100%"},tip:"\u6B63\u5728\u5904\u7406 ..."},{default:i(()=>[n(p,{"label-col-style":{width:"25%"},field:"dt",label:e.$t("tool.brtime"),onClick:a[3]||(a[3]=()=>{t.showHide+=1})},{default:i(()=>[f(g(t.dt),1)]),_:1},8,["label"]),ut(n(p,{"label-col-style":{width:"25%"},field:"dtCustom",label:"\u81EA\u5B9A\u4E49\u65F6\u95F4"},{default:i(()=>[F("div",null,[n(B,{style:{width:"220px",margin:"0 24px 24px 0"},"show-time":"","time-picker-props":{defaultValue:"00:00:00"},format:"YYYY-MM-DD HH:mm:ss",modelValue:t.dtCustom,"onUpdate:modelValue":a[4]||(a[4]=s=>t.dtCustom=s)},null,8,["modelValue"]),f(" \xA0\xA0"),n(R,{size:"small",theme:"success",onClick:mt},{default:i(()=>[f("\u5199\u5165\u65F6\u95F4\u5230\u53F0\u7AD9")]),_:1})])]),_:1},512),[[pt,t.showHide>=5]]),n(p,{"label-col-style":{width:"25%"},field:"sat",label:e.$t("tool.selectSatellite")},{default:i(()=>[F("div",oe,[n(_,{modelValue:t.sat,"onUpdate:modelValue":a[5]||(a[5]=s=>t.sat=s),onChange:ft,placeholder:e.$t("tool.selectSatellite")+"...","allow-search":"","allow-clear":""},{default:i(()=>[(w(!0),I(D,null,k(t.satData,s=>(w(),U(y,{key:s.name,value:s.name},{default:i(()=>[f(g(s.name),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue","placeholder"]),n(N,{onClick:a[6]||(a[6]=()=>{t.selfSatModal=!0}),style:{"margin-top":"10px"}},{default:i(()=>[f(g(e.$t("sat.addSelfSat")),1)]),_:1})])]),_:1},8,["label"]),n(p,{"label-col-style":{width:"25%"},field:"lng",label:e.$t("tool.longitude")},{default:i(()=>[n(S,{ref_key:"lngRef",ref:P,precision:6,modelValue:t.lng,"onUpdate:modelValue":a[7]||(a[7]=s=>t.lng=s)},null,8,["modelValue"])]),_:1},8,["label"]),n(p,{"label-col-style":{width:"25%"},field:"lat",label:e.$t("tool.latitude")},{default:i(()=>[n(S,{ref_key:"latRef",ref:$,precision:6,modelValue:t.lat,"onUpdate:modelValue":a[8]||(a[8]=s=>t.lat=s)},null,8,["modelValue"])]),_:1},8,["label"]),n(p,{"label-col-style":{width:"25%"},field:"alt",label:e.$t("tool.altitude")},{default:i(()=>[n(S,{ref_key:"altRef",ref:O,precision:0,modelValue:t.alt,"onUpdate:modelValue":a[9]||(a[9]=s=>t.alt=s)},null,8,["modelValue"])]),_:1},8,["label"]),n(p,{"label-col-style":{width:"25%"},label:""},{default:i(()=>[n(E,null,{default:i(()=>[n(v,{onClick:Y},{default:i(()=>[f(g(e.$t("tool.brlonlat")),1)]),_:1}),n(v,{onClick:gt},{default:i(()=>[f(g(e.$t("tool.phonelonlat")),1)]),_:1}),n(v,{type:"primary",onClick:wt},{default:i(()=>[f(g(e.$t("tool.satpasstime")),1)]),_:1})]),_:1})]),_:1}),n(p,{"label-col-style":{width:"25%"},field:"pass",label:e.$t("tool.selectPassTime")},{default:i(()=>[n(_,{modelValue:t.pass,"onUpdate:modelValue":a[10]||(a[10]=s=>t.pass=s),"allow-search":"","allow-clear":""},{default:i(()=>[(w(!0),I(D,null,k(t.passOption,s=>(w(),U(y,{key:s[0]+"|"+s[1],value:s[0]+"|"+s[1]},{default:i(()=>[f(g(s[0]+" - "+s[1]),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])]),_:1},8,["label"]),ut(n(p,{"label-col-style":{width:"25%"},field:"passCustom",label:"\u81EA\u5B9A\u4E49\u8FC7\u5883\u65F6\u95F4"},{default:i(()=>[n(L,{style:{width:"360px",margin:"0 24px 24px 0"},"show-time":"","time-picker-props":{defaultValue:["00:00:00","00:00:00"]},format:"YYYY-MM-DD HH:mm:ss",modelValue:t.passCustom,"onUpdate:modelValue":a[11]||(a[11]=s=>t.passCustom=s)},null,8,["modelValue"])]),_:1},512),[[pt,t.showHide>=5]]),n(p,{"label-col-style":{width:"25%"},field:"tx",label:e.$t("tool.txFreq")},{default:i(()=>[n(S,{precision:5,modelValue:t.tx,"onUpdate:modelValue":a[12]||(a[12]=s=>t.tx=s)},null,8,["modelValue"])]),_:1},8,["label"]),n(p,{"label-col-style":{width:"25%"},field:"txTone",label:e.$t("tool.txTone")},{default:i(()=>[n(_,{modelValue:t.txTone,"onUpdate:modelValue":a[13]||(a[13]=s=>t.txTone=s),"allow-search":"","allow-clear":""},{default:i(()=>[n(y,{value:0},{default:i(()=>[f(g(e.$t("tool.off")),1)]),_:1}),(w(!0),I(D,null,k(t.CTCSSOption,s=>(w(),U(y,{key:s,value:s},{default:i(()=>[f(g(s.toFixed(1)),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])]),_:1},8,["label"]),n(p,{"label-col-style":{width:"25%"},field:"rx",label:e.$t("tool.rxFreq")},{default:i(()=>[n(S,{precision:5,modelValue:t.rx,"onUpdate:modelValue":a[14]||(a[14]=s=>t.rx=s)},null,8,["modelValue"])]),_:1},8,["label"]),n(p,{"label-col-style":{width:"25%"},field:"rxTone",label:e.$t("tool.rxTone")},{default:i(()=>[n(_,{modelValue:t.rxTone,"onUpdate:modelValue":a[15]||(a[15]=s=>t.rxTone=s),"allow-search":"","allow-clear":""},{default:i(()=>[n(y,{value:0},{default:i(()=>[f(g(e.$t("tool.off")),1)]),_:1}),(w(!0),I(D,null,k(t.CTCSSOption,s=>(w(),U(y,{key:s,value:s},{default:i(()=>[f(g(s.toFixed(1)),1)]),_:2},1032,["value"]))),128))]),_:1},8,["modelValue"])]),_:1},8,["label"]),n(p,{"label-col-style":{width:"25%"},label:""},{default:i(()=>[n(v,{type:"primary",onClick:yt},{default:i(()=>[f(g(e.$t("tool.writeData")),1)]),_:1})]),_:1}),n(q),F("div",{id:"statusArea",style:{height:"20em","background-color":"var(--color-bg-3)",color:"var(--color-text-3)",overflow:"auto",padding:"20px"},innerHTML:t.status},null,8,se)]),_:1},8,["loading"])]),_:1},8,["title"])]),_:1})]),_:1})])}}});const ze=It(ne,[["__scopeId","data-v-10614cc6"]]);export{ze as default};
