import{d as Q,r as nt,bI as ut,bJ as it,C as v,aE as C,aH as e,aI as n,aM as a,aN as p,u as m,a$ as ct,b0 as rt,G as o,bw as lt,bK as st,bG as _t,b8 as dt,bi as pt,bL as mt,bM as ht,bN as ft,bm as gt,bn as wt,D as bt}from"./arco.13f9ef32.js";import{v as Ft,t as kt,_ as U}from"./index.ff963f0a.js";/* empty css              *//* empty css               *//* empty css              *//* empty css               *//* empty css               *//* empty css              */import{e as vt,a as r,b as l}from"./serial.d615852e.js";import{L as yt}from"./index.6e8f3b8b.js";import"./chart.5acd6cf6.js";import"./vue.eb9ee7d7.js";const Bt=""+new URL("../jjgg.jpg",import.meta.url).href,St=""+new URL("../gy.png",import.meta.url).href,At=""+new URL("../mm_facetoface_collect_qrcode_1714392837792.png",import.meta.url).href,Et=""+new URL("../1722745910257.jpg",import.meta.url).href,u=f=>(gt("data-v-9969a58a"),f=f(),wt(),f),Ct=u(()=>o("br",null,null,-1)),Pt=u(()=>o("br",null,null,-1)),Dt=u(()=>o("br",null,null,-1)),Mt=u(()=>o("br",null,null,-1)),xt=u(()=>o("br",null,null,-1)),It=u(()=>o("br",null,null,-1)),Nt=u(()=>o("br",null,null,-1)),$t=u(()=>o("br",null,null,-1)),Vt=u(()=>o("div",{style:{"margin-top":"50px"}},"\xA0",-1)),Tt=u(()=>o("div",null,[o("img",{style:{width:"100%"},alt:"ads",src:Bt})],-1)),Kt=u(()=>o("img",{class:"tencent",style:{"margin-bottom":"10px"},width:"200px",src:St},null,-1)),zt=u(()=>o("img",{width:"300",src:At},null,-1)),Lt=u(()=>o("img",{width:"300",src:Et},null,-1)),Ot=u(()=>o("br",null,null,-1)),Rt=u(()=>o("br",null,null,-1)),jt=u(()=>o("br",null,null,-1)),Gt=u(()=>o("div",{class:"halloween"},[o("div",{class:"head"},[o("div",{class:"skull"},[o("div",{class:"eyes"},[o("div",{class:"eye eye-left"}),o("div",{class:"eye eye-right"})])])]),o("div",{class:"body"}),o("div",{class:"legs"})],-1)),Jt=u(()=>o("br",null,null,-1)),Qt=u(()=>o("br",null,null,-1)),Ut=Q({__name:"banner",setup(f){var M;const{t:s}=Ft.exports.useI18n(),t=kt(),y=nt({eepromSize:s("workplace.clickCheck"),activeKey:JSON.parse((M=localStorage.getItem("mainActiveKey"))!=null?M:"[2]")}),W=i=>{localStorage.setItem("mainActiveKey",JSON.stringify(i))},Z=async()=>{var g,B,S,w,b,d,_,A,h,E,F,k,I,N,$,V,T,K,z,L,O,R,j,G,J;let i=s("workplace.unk");const x=[Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256),Math.round(Math.random()*256)];await vt(t.connectPort);const c=new Uint8Array(x);if(((g=t.configuration)==null?void 0:g.uart)=="official"){const P=await r(t.connectPort,0,8,(B=t.configuration)==null?void 0:B.uart);await l(t.connectPort,0,c,8,(S=t.configuration)==null?void 0:S.uart);const D=await r(t.connectPort,0,8,(w=t.configuration)==null?void 0:w.uart);c.toString()==D.toString()&&(i=s("global.8kb")),await l(t.connectPort,0,P,8,(b=t.configuration)==null?void 0:b.uart)}else{const P=await r(t.connectPort,0,8,(d=t.configuration)==null?void 0:d.uart);await l(t.connectPort,0,c,8,(_=t.configuration)==null?void 0:_.uart);const D=await r(t.connectPort,0,8,(A=t.configuration)==null?void 0:A.uart);c.toString()==D.toString()&&(i=s("global.8kb")),await l(t.connectPort,0,P,8,(h=t.configuration)==null?void 0:h.uart);const H=await r(t.connectPort,131064,8,(E=t.configuration)==null?void 0:E.uart);await l(t.connectPort,131064,c,8,(F=t.configuration)==null?void 0:F.uart);const Y=await r(t.connectPort,131064,8,(k=t.configuration)==null?void 0:k.uart);c.toString()==Y.toString()&&(i=s("global.128kb")),await l(t.connectPort,131064,H,8,(I=t.configuration)==null?void 0:I.uart);const q=await r(t.connectPort,262136,8,(N=t.configuration)==null?void 0:N.uart);await l(t.connectPort,262136,c,8,($=t.configuration)==null?void 0:$.uart);const X=await r(t.connectPort,262136,8,(V=t.configuration)==null?void 0:V.uart);c.toString()==X.toString()&&(i=s("global.256kb")),await l(t.connectPort,262136,q,8,(T=t.configuration)==null?void 0:T.uart);const tt=await r(t.connectPort,393208,8,(K=t.configuration)==null?void 0:K.uart);await l(t.connectPort,393208,c,8,(z=t.configuration)==null?void 0:z.uart);const ot=await r(t.connectPort,393208,8,(L=t.configuration)==null?void 0:L.uart);c.toString()==ot.toString()&&(i=s("global.384kb")),await l(t.connectPort,393208,tt,8,(O=t.configuration)==null?void 0:O.uart);const et=await r(t.connectPort,524280,8,(R=t.configuration)==null?void 0:R.uart);await l(t.connectPort,524280,c,8,(j=t.configuration)==null?void 0:j.uart);const at=await r(t.connectPort,524280,8,(G=t.configuration)==null?void 0:G.uart);c.toString()==at.toString()&&(i=s("global.512kb")),await l(t.connectPort,524280,et,8,(J=t.configuration)==null?void 0:J.uart)}y.eepromSize=i};return(i,x)=>{const c=lt,g=st,B=_t,S=dt,w=ut,b=pt,d=yt,_=mt,A=ht,h=ft,E=it;return v(),C(g,{class:"banner"},{default:e(()=>[n(g,null,{default:e(()=>[n(c,{heading:5,style:{"margin-top":"0"}},{default:e(()=>[a(p(m(t).connectState?i.$t("workplace.welcomeSuc"):i.$t("workplace.welcome")),1)]),_:1})]),_:1}),n(B,{class:"panel-border"}),n(b,null,{default:e(()=>[ct(n(w,{style:{marginTop:"2em",marginBottom:"2em"},title:i.$t("workplace.info")},{default:e(()=>{var F,k;return[a(p(i.$t("workplace.current"))+p(m(t).firmwareVersion)+" ",1),Ct,a(" "+p(i.$t("workplace.writeconfig"))+p((F=m(t).configuration)==null?void 0:F.name)+" ",1),Pt,a(" "+p(i.$t("workplace.eepromSize"))+p(y.eepromSize)+" "+p(y.eepromSize!=m(s)("workplace.clickCheck")&&((k=m(t).configuration)==null?void 0:k.uart)=="official"?m(s)("workplace.clickNotice"):"")+" ",1),n(S,{size:"mini",type:"primary",onClick:Z},{default:e(()=>[a(p(i.$t("workplace.checkIt")),1)]),_:1})]}),_:1},8,["title"]),[[rt,m(t).connectState]])]),_:1}),o("div",null,[n(c,{heading:5},{default:e(()=>[a("\u8BF4\u660E\uFF1A")]),_:1}),n(_,null,{default:e(()=>[a("\u25C6 \u4F7F\u7528\u5E94\u7B2C\u4E00\u65F6\u95F4"),n(d,{theme:"primary",href:"/#/tool/backup"},{default:e(()=>[a("\u5907\u4EFD")]),_:1}),a("\u914D\u7F6E\u53CA\u6821\u51C6\u6570\u636E\u3002")]),_:1}),Dt,n(_,null,{default:e(()=>[a("\u25C6 \u9664\u201C\u56FA\u4EF6\u5347\u7EA7\u201D\u529F\u80FD\u624B\u53F0\u5E94\u5904\u4E8E\u5237\u673A\u6A21\u5F0F\u70B9\u51FB\u66F4\u65B0\u6309\u94AE\u9009\u62E9\u8BBE\u5907\u66F4\u65B0\uFF0C\u5176\u4F59\u529F\u80FD\u624B\u53F0\u5747\u9700\u8981\u5728\u6B63\u5E38\u6A21\u5F0F\u8FDE\u63A5\u3002")]),_:1}),Mt,n(_,null,{default:e(()=>[a("\u25C6 \u841D\u535C\uFF08LOSEHU\uFF09\u56FA\u4EF6\u76F8\u5173\u95EE\u9898\u8BF7\u79FB\u6B65\uFF1A"),n(d,{theme:"primary",href:"https://github.com/losehu/uv-k5-firmware-custom",target:"_blank"},{default:e(()=>[a("https://github.com/losehu/uv-k5-firmware-custom")]),_:1}),a(" \u3002")]),_:1}),xt,n(_,null,{default:e(()=>[a("\u25C6 K5Web \u5B98\u6269\u5237\u4E2D\u6587\u6559\u7A0B\uFF08BG3ODZ\uFF09\uFF1A"),n(d,{theme:"primary",href:"https://www.bilibili.com/video/BV1Ab421p7rN",target:"_blank"},{default:e(()=>[a("https://www.bilibili.com/video/BV1Ab421p7rN")]),_:1}),a(" \u3002")]),_:1}),It,n(_,null,{default:e(()=>[a("\u25C6 K5Web \u81EA\u6269\u5237\u4E2D\u6587\u6559\u7A0B\uFF08BG3ODZ\uFF09\uFF1A"),n(d,{theme:"primary",href:"https://www.bilibili.com/video/BV1Qk2BYDErN",target:"_blank"},{default:e(()=>[a("https://www.bilibili.com/video/BV1Qk2BYDErN")]),_:1}),a(" \u3002")]),_:1}),Nt,n(_,null,{default:e(()=>[a("\u25C6 K5Web \u4F7F\u7528\u89C6\u9891\u6559\u7A0B\uFF08BG3ODZ\uFF09\uFF1A"),n(d,{theme:"primary",href:"https://www.bilibili.com/video/BV1Q4421D75x",target:"_blank"},{default:e(()=>[a("https://www.bilibili.com/video/BV1Q4421D75x")]),_:1}),a(" \u3002")]),_:1}),$t,n(_,null,{default:e(()=>[a("\u25C6 K5Web \u4F7F\u7528\u89C6\u9891\u6559\u7A0B\uFF08BG7QJV\uFF09\uFF1A"),n(d,{theme:"primary",href:"https://www.douyin.com/video/7378314511419313458",target:"_blank"},{default:e(()=>[a("https://www.douyin.com/video/7378314511419313458")]),_:1}),a(" \u3002")]),_:1})]),Vt,o("div",null,[n(E,{"default-active-key":y.activeKey,accordion:"",onChange:W},{default:e(()=>[(v(),C(h,{header:"\u5E7F\u544A\u533A",key:1},{default:e(()=>[n(b,null,{default:e(()=>[n(w,{hoverable:"",style:{width:"600px"}},{cover:e(()=>[Tt]),default:e(()=>[n(A,{title:"BG4IWE \u6295\u653E"})]),_:1})]),_:1})]),_:1})),(v(),C(h,{header:"\u817E\u8BAF\u516C\u76CA",key:2},{default:e(()=>[Kt]),_:1})),(v(),C(h,{header:"\u997F\u997F\u996D\u996D",key:3},{default:e(()=>[zt,Lt,Ot,Rt,a(" TRON / TRX\uFF1ATPaSnHJ2cRCQjjv7TyAFJDamb3mZSSz1At ")]),_:1}))]),_:1},8,["default-active-key"])]),jt,Gt,Jt,Qt]),_:1})}}});const Wt=U(Ut,[["__scopeId","data-v-9969a58a"]]),Zt={class:"container"},Ht={class:"left-side"},Yt={class:"panel"},qt={name:"Dashboard"},Xt=Q({...qt,setup(f){return(s,t)=>(v(),bt("div",Zt,[o("div",Ht,[o("div",Yt,[n(Wt)])])]))}});const po=U(Xt,[["__scopeId","data-v-8f743d99"]]);export{po as default};