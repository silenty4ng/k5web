import"./vue.83b9e9de.js";import{P as nt,Q as ut,n as it,U as rt,O as ct,d as lt,k as st,V as _t,W as dt,X as pt}from"./@arco-design.5e2b2073.js";import{d as mt,_ as W}from"./index.063b0b40.js";import{e as ht,a as c,b as l}from"./serial.d615852e.js";import{L as ft}from"./tdesign-vue-next.de6f3c5b.js";import{d as G,h as gt,o as y,s as C,u as e,x as n,z as a,A as p,_ as m,N as wt,O as Ft,e as o,b9 as bt,b8 as kt,a as yt}from"./@vue.2faf1d8e.js";import{v as vt}from"./vue-i18n.3095106f.js";import"./@intlify.d4358f23.js";import"./b-tween.8dd4e2fe.js";import"./dayjs.4c867136.js";import"./b-validate.1fdaeb97.js";import"./number-precision.5cddbed2.js";import"./resize-observer-polyfill.2b976e6e.js";import"./scroll-into-view-if-needed.0a5da943.js";import"./compute-scroll-into-view.17358474.js";import"./vue-echarts.5aab67d4.js";import"./resize-detector.a8854a64.js";import"./echarts.5b0e6023.js";import"./zrender.ce26131e.js";import"./tslib.c6ba9914.js";import"./vue-router.2630bdf9.js";import"./nprogress.b0a22fe3.js";import"./mitt.550594b0.js";import"./pinia.84b4adc6.js";import"./vue-demi.61f15e01.js";import"./axios.f3f20840.js";import"./@vueuse.7fb11548.js";import"./aegis-web-sdk.846094f8.js";import"./@zxing.8654f0db.js";import"./vue-matomo.4c7efa96.js";import"./tdesign-icons-vue-next.6eb4e7b8.js";import"./sortablejs.b2e3c7c4.js";import"./@popperjs.f3f73334.js";const Bt=""+new URL("../jjgg.jpg",import.meta.url).href,At=""+new URL("../gy.png",import.meta.url).href,St=""+new URL("../mm_facetoface_collect_qrcode_1714392837792.png",import.meta.url).href,Et=""+new URL("../1722745910257.jpg",import.meta.url).href,u=f=>(bt("data-v-e935ab5e"),f=f(),kt(),f),Ct=u(()=>o("br",null,null,-1)),Pt=u(()=>o("br",null,null,-1)),Dt=u(()=>o("br",null,null,-1)),Mt=u(()=>o("br",null,null,-1)),xt=u(()=>o("br",null,null,-1)),zt=u(()=>o("br",null,null,-1)),It=u(()=>o("br",null,null,-1)),Nt=u(()=>o("br",null,null,-1)),Vt=u(()=>o("br",null,null,-1)),$t=u(()=>o("div",{style:{"margin-top":"50px"}},"\xA0",-1)),Ot=u(()=>o("div",null,[o("img",{loading:"lazy",style:{width:"100%"},alt:"ads",src:Bt})],-1)),Tt=u(()=>o("img",{loading:"lazy",class:"tencent",style:{"margin-bottom":"10px"},width:"200px",src:At},null,-1)),Kt=u(()=>o("img",{loading:"lazy",width:"300",src:St},null,-1)),Rt=u(()=>o("img",{loading:"lazy",width:"300",src:Et},null,-1)),jt=u(()=>o("br",null,null,-1)),Lt=u(()=>o("br",null,null,-1)),Qt=u(()=>o("br",null,null,-1)),Ut=u(()=>o("div",{class:"halloween"},[o("div",{class:"head"},[o("div",{class:"skull"},[o("div",{class:"eyes"},[o("div",{class:"eye eye-left"}),o("div",{class:"eye eye-right"})])])]),o("div",{class:"body"}),o("div",{class:"legs"})],-1)),Wt=u(()=>o("br",null,null,-1)),Gt=u(()=>o("br",null,null,-1)),Jt=G({__name:"banner",setup(f){var M;const{t:s}=vt.exports.useI18n(),t=mt(),v=gt({eepromSize:s("workplace.clickCheck"),activeKey:JSON.parse((M=localStorage.getItem("mainActiveKey"))!=null?M:"[2]")}),J=i=>{localStorage.setItem("mainActiveKey",JSON.stringify(i))},Z=async()=>{var g,B,A,w,F,d,_,S,h,E,b,k,z,I,N,V,$,O,T,K,R,j,L,Q,U;let i=s("workplace.unk");const x=[Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256)];await ht(t.connectPort);const r=new Uint8Array(x);if(((g=t.configuration)==null?void 0:g.uart)=="official"){const P=await c(t.connectPort,0,8,(B=t.configuration)==null?void 0:B.uart);await l(t.connectPort,0,r,8,(A=t.configuration)==null?void 0:A.uart);const D=await c(t.connectPort,0,8,(w=t.configuration)==null?void 0:w.uart);r.toString()==D.toString()&&(i=s("global.8kb")),await l(t.connectPort,0,P,8,(F=t.configuration)==null?void 0:F.uart)}else{const P=await c(t.connectPort,0,8,(d=t.configuration)==null?void 0:d.uart);await l(t.connectPort,0,r,8,(_=t.configuration)==null?void 0:_.uart);const D=await c(t.connectPort,0,8,(S=t.configuration)==null?void 0:S.uart);r.toString()==D.toString()&&(i=s("global.8kb")),await l(t.connectPort,0,P,8,(h=t.configuration)==null?void 0:h.uart);const H=await c(t.connectPort,131064,8,(E=t.configuration)==null?void 0:E.uart);await l(t.connectPort,131064,r,8,(b=t.configuration)==null?void 0:b.uart);const X=await c(t.connectPort,131064,8,(k=t.configuration)==null?void 0:k.uart);r.toString()==X.toString()&&(i=s("global.128kb")),await l(t.connectPort,131064,H,8,(z=t.configuration)==null?void 0:z.uart);const Y=await c(t.connectPort,262136,8,(I=t.configuration)==null?void 0:I.uart);await l(t.connectPort,262136,r,8,(N=t.configuration)==null?void 0:N.uart);const q=await c(t.connectPort,262136,8,(V=t.configuration)==null?void 0:V.uart);r.toString()==q.toString()&&(i=s("global.256kb")),await l(t.connectPort,262136,Y,8,($=t.configuration)==null?void 0:$.uart);const tt=await c(t.connectPort,393208,8,(O=t.configuration)==null?void 0:O.uart);await l(t.connectPort,393208,r,8,(T=t.configuration)==null?void 0:T.uart);const ot=await c(t.connectPort,393208,8,(K=t.configuration)==null?void 0:K.uart);r.toString()==ot.toString()&&(i=s("global.384kb")),await l(t.connectPort,393208,tt,8,(R=t.configuration)==null?void 0:R.uart);const et=await c(t.connectPort,524280,8,(j=t.configuration)==null?void 0:j.uart);await l(t.connectPort,524280,r,8,(L=t.configuration)==null?void 0:L.uart);const at=await c(t.connectPort,524280,8,(Q=t.configuration)==null?void 0:Q.uart);r.toString()==at.toString()&&(i=s("global.512kb")),await l(t.connectPort,524280,et,8,(U=t.configuration)==null?void 0:U.uart)}v.eepromSize=i};return(i,x)=>{const r=it,g=rt,B=ct,A=lt,w=nt,F=st,d=ft,_=_t,S=dt,h=pt,E=ut;return y(),C(g,{class:"banner"},{default:e(()=>[n(g,null,{default:e(()=>[n(r,{heading:5,style:{"margin-top":"0"}},{default:e(()=>[a(p(m(t).connectState?i.$t("workplace.welcomeSuc"):i.$t("workplace.welcome")),1)]),_:1})]),_:1}),n(B,{class:"panel-border"}),n(F,null,{default:e(()=>[wt(n(w,{style:{marginTop:"2em",marginBottom:"2em"},title:i.$t("workplace.info")},{default:e(()=>{var b,k;return[a(p(i.$t("workplace.current"))+p(m(t).firmwareVersion)+" ",1),Ct,a(" "+p(i.$t("workplace.writeconfig"))+p((b=m(t).configuration)==null?void 0:b.name)+" ",1),Pt,a(" "+p(i.$t("workplace.eepromSize"))+p(v.eepromSize)+" "+p(v.eepromSize!=m(s)("workplace.clickCheck")&&((k=m(t).configuration)==null?void 0:k.uart)=="official"?m(s)("workplace.clickNotice"):"")+" ",1),n(A,{size:"mini",type:"primary",onClick:Z},{default:e(()=>[a(p(i.$t("workplace.checkIt")),1)]),_:1})]}),_:1},8,["title"]),[[Ft,m(t).connectState]])]),_:1}),o("div",null,[n(r,{heading:5},{default:e(()=>[a("\u8BF4\u660E\uFF1A")]),_:1}),n(_,null,{default:e(()=>[a("\u25C6 \u4F7F\u7528\u5E94\u7B2C\u4E00\u65F6\u95F4"),n(d,{theme:"primary",href:"/#/tool/backup"},{default:e(()=>[a("\u5907\u4EFD")]),_:1}),a("\u914D\u7F6E\u53CA\u6821\u51C6\u6570\u636E\u3002")]),_:1}),Dt,n(_,null,{default:e(()=>[a("\u25C6 \u9664\u201C\u56FA\u4EF6\u5347\u7EA7\u201D\u529F\u80FD\u624B\u53F0\u5E94\u5904\u4E8E\u5237\u673A\u6A21\u5F0F\u70B9\u51FB\u66F4\u65B0\u6309\u94AE\u9009\u62E9\u8BBE\u5907\u66F4\u65B0\uFF0C\u5176\u4F59\u529F\u80FD\u624B\u53F0\u5747\u9700\u8981\u5728\u6B63\u5E38\u6A21\u5F0F\u8FDE\u63A5\u3002")]),_:1}),Mt,n(_,null,{default:e(()=>[a("\u25C6 \u841D\u535C\uFF08LOSEHU\uFF09\u56FA\u4EF6\u76F8\u5173\u95EE\u9898\u8BF7\u79FB\u6B65\uFF1A"),n(d,{theme:"primary",href:"https://github.com/losehu/uv-k5-firmware-custom",target:"_blank"},{default:e(()=>[a("https://github.com/losehu/uv-k5-firmware-custom")]),_:1}),a(" \u3002")]),_:1}),xt,n(_,null,{default:e(()=>[a("\u25C6 K5Web \u5B98\u6269\u5237\u4E2D\u6587\u6559\u7A0B\uFF08BG3ODZ\uFF09\uFF1A"),n(d,{theme:"primary",href:"https://www.bilibili.com/video/BV1Ab421p7rN",target:"_blank"},{default:e(()=>[a("https://www.bilibili.com/video/BV1Ab421p7rN")]),_:1}),a(" \u3002")]),_:1}),zt,n(_,null,{default:e(()=>[a("\u25C6 K5Web \u81EA\u6269\u5237\u4E2D\u6587\u6559\u7A0B\uFF08BG3ODZ\uFF09\uFF1A"),n(d,{theme:"primary",href:"https://www.bilibili.com/video/BV1Qk2BYDErN",target:"_blank"},{default:e(()=>[a("https://www.bilibili.com/video/BV1Qk2BYDErN")]),_:1}),a(" \u3002")]),_:1}),It,n(_,null,{default:e(()=>[a("\u25C6 K5Web \u4F7F\u7528\u89C6\u9891\u6559\u7A0B\uFF08BG3ODZ\uFF09\uFF1A"),n(d,{theme:"primary",href:"https://www.bilibili.com/video/BV1Q4421D75x",target:"_blank"},{default:e(()=>[a("https://www.bilibili.com/video/BV1Q4421D75x")]),_:1}),a(" \u3002")]),_:1}),Nt,n(_,null,{default:e(()=>[a("\u25C6 K5Web \u4F7F\u7528\u89C6\u9891\u6559\u7A0B\uFF08BG7QJV\uFF09\uFF1A"),n(d,{theme:"primary",href:"https://www.douyin.com/video/7378314511419313458",target:"_blank"},{default:e(()=>[a("https://www.douyin.com/video/7378314511419313458")]),_:1}),a(" \u3002")]),_:1}),Vt,n(_,null,{default:e(()=>[a("\u25C6 \u611F\u8C22"),n(d,{theme:"primary",href:"/#/chirp/thanks"},{default:e(()=>[a("\u5404\u4F4D")]),_:1}),a("\u5BF9 K5Web \u7684\u652F\u6301\uFF0C\u672C\u7AD9\u5C06\u81F3\u5C11\u7EF4\u62A4\u81F3 2026\u5E7411\u670821\u65E5 23:59:59\u3002")]),_:1})]),$t,o("div",null,[n(E,{"default-active-key":v.activeKey,accordion:"",onChange:J},{default:e(()=>[(y(),C(h,{header:"\u5E7F\u544A\u533A",key:1},{default:e(()=>[n(F,null,{default:e(()=>[n(w,{hoverable:"",style:{width:"600px"}},{cover:e(()=>[Ot]),default:e(()=>[n(S,{title:"BG4IWE \u6295\u653E"})]),_:1})]),_:1})]),_:1})),(y(),C(h,{header:"\u817E\u8BAF\u516C\u76CA",key:2},{default:e(()=>[Tt]),_:1})),(y(),C(h,{header:"\u997F\u997F\u996D\u996D",key:3},{default:e(()=>[Kt,Rt,jt,Lt,a(" TRON / TRX\uFF1ATPaSnHJ2cRCQjjv7TyAFJDamb3mZSSz1At ")]),_:1}))]),_:1},8,["default-active-key"])]),Qt,Ut,Wt,Gt]),_:1})}}});const Zt=W(Jt,[["__scopeId","data-v-e935ab5e"]]),Ht={class:"container"},Xt={class:"left-side"},Yt={class:"panel"},qt={name:"Dashboard"},to=G({...qt,setup(f){return(s,t)=>(y(),yt("div",Ht,[o("div",Xt,[o("div",Yt,[n(Zt)])])]))}});const No=W(to,[["__scopeId","data-v-8f743d99"]]);export{No as default};
