import{t as Y,u as Z,N as w,ad as ee,O as te,_ as ae}from"./index.375cf361.js";/* empty css              *//* empty css              *//* empty css              *//* empty css               *//* empty css               *//* empty css               *//* empty css               *//* empty css               */import{d as oe,r as E,o as ne,bT as se,bI as le,C as c,D as b,aI as t,aH as e,G as _,u as m,aK as x,aM as s,aN as r,aJ as L,aE as v,b7 as $,bh as ie,bU as re,bV as ue,bK as de,bO as ce,bm as pe,bn as me}from"./arco.b087a425.js";import{g as _e}from"./vue.23fb8a9a.js";import{R as fe,L as he,a as ge,D as we,T as be,U as ve}from"./index.af2a3d13.js";import{s as ke,P as ye}from"./dep-71c4f289.d48f5327.js";import{L as xe}from"./index.6d7866f2.js";import{I as Ae}from"./index.3d2df98f.js";import{F as Fe,a as Ce}from"./index.bf9a32a0.js";import"./chart.836a9fe2.js";import"./slot.8613cd1d.js";import"./index.101a004d.js";import"./form-model.968f8b89.js";import"./index.241c1211.js";const Ee=k=>(pe("data-v-64830bd8"),k=k(),me(),k),Le={class:"container"},$e={style:{"margin-right":"20px"}},Ie={style:{color:"#373737",margin:"10px"}},Ue={style:{display:"flex","align-items":"center","justify-content":"space-between"}},Be={style:{display:"flex",width:"100%"}},De={style:{width:"90%"}},Ve=Ee(()=>_("br",null,null,-1)),Se={style:{width:"40%",margin:"auto","text-align":"center"}},Pe={name:"Backup"},Re=oe({...Pe,setup(k){Y();const p=Z(),I=_e(),l=E({binaryFile:void 0,loading:!1,showPanel:!1,showUpload:!1,refLoading:!1,myList:[],total:0,page:1,nowpage:[]}),i=E({title:"",desc:"",firmware:[]});ne(async()=>{F({current:1})});const F=async o=>{l.page=o.current;const n=await w.get("https://k5ws.vicicode.cn/api/channel/index?server=1&limit=12&page="+o.current+"&t="+Date.now());l.total=n.data.total,l.nowpage=n.data.list},h=async()=>{l.refLoading=!0,l.showPanel=!0;const o=await w.post("https://k5ws.vicicode.cn/api/channel/my?server=1",{},{headers:{"ba-user-token":p.accountId}});l.myList=o.data,l.refLoading=!1},U=()=>{i.title="",i.desc="",i.firmware=[],l.showUpload=!0},B=async()=>{if(i.title==""||i.firmware.code==0){$.error({content:"\u672A\u586B\u5199\u540D\u79F0\u53CA\u4E0A\u4F20\u6587\u4EF6",duration:5*1e3});return}await w.post("https://k5ws.vicicode.cn/api/channel/add?server=1",{title:i.title,desc:i.desc,data:i.firmware[0].response.data.file.url},{headers:{"ba-user-token":p.accountId}}),l.showUpload=!1,h()},D=async o=>{await w.post("https://k5ws.vicicode.cn/api/channel/del?server=1",{id:o},{headers:{"ba-user-token":p.accountId}}),h()},V=async o=>{l.nowpage.filter(n=>{n.id==o&&(n.star+=1)}),await w.post("https://k5ws.vicicode.cn/api/channel/star?server=1",{id:o}),$.success({content:"\u70B9\u8D5E\u6210\u529F",duration:5*1e3})},S=()=>{h()},P=o=>{I.push({path:"/chirp/channel",query:{url:o}})},R=(o,n)=>{fetch(o).then(g=>g.blob()).then(g=>{const d=URL.createObjectURL(g),u=document.createElement("a");u.href=d,u.download=n+".xlsx",document.body.appendChild(u),u.click(),document.body.removeChild(u)})};return(o,n)=>{const g=ee,d=ie,u=ke,N=re,T=ue,z=se,M=ye,j=le,O=de,K=ce,A=te,q=xe,G=he,H=ge,C=we,J=Ae,y=Fe,Q=be,W=ve,X=Ce;return c(),b("div",Le,[t(g,{items:[o.$t("menu.workshop"),o.$t("menu.channel")]},null,8,["items"]),t(K,{gutter:20,align:"stretch"},{default:e(()=>[t(O,{span:24},{default:e(()=>[t(j,{class:"general-card",title:o.$t("menu.channel")},{extra:e(()=>[_("div",$e,[m(p).name?(c(),b(x,{key:0},[t(d,{onClick:h},{default:e(()=>[s("\xA0\xA0"+r(m(p).name)+"\xA0\xA0",1)]),_:1}),t(d,{onClick:h},{default:e(()=>[s("\xA0\xA0"+r(o.$t("global.upload"))+"\xA0\xA0",1)]),_:1}),t(d,{onClick:n[0]||(n[0]=a=>m(p).logout())},{default:e(()=>[s("\xA0\xA0"+r(o.$t("global.logout"))+"\xA0\xA0",1)]),_:1})],64)):(c(),b(x,{key:1},[t(d,{onClick:n[1]||(n[1]=a=>m(p).setInfo({showLogin:!0}))},{default:e(()=>[s("\xA0\xA0"+r(o.$t("global.login"))+"\xA0\xA0",1)]),_:1}),t(d,{onClick:n[2]||(n[2]=a=>m(p).setInfo({showRegister:!0}))},{default:e(()=>[s("\xA0\xA0"+r(o.$t("global.register"))+"\xA0\xA0",1)]),_:1}),_("span",Ie,r(o.$t("global.loginUpload")),1)],64))])]),default:e(()=>[t(z,null,{default:e(()=>[(c(!0),b(x,null,L(l.nowpage,a=>(c(),v(T,{style:{width:"100%"}},{actions:e(()=>[t(u,{style:{"margin-left":"1rem"}},{default:e(()=>[s(r(a.create_time_text),1)]),_:2},1024),t(d,{onClick:f=>V(a.id)},{default:e(()=>[s("\u{1F44D}\uFF08"+r(a.star)+"\uFF09",1)]),_:2},1032,["onClick"]),t(d,{onClick:f=>R("https://k5ws.vicicode.cn"+a.file,a.title)},{default:e(()=>[s(r(o.$t("global.download")),1)]),_:2},1032,["onClick"]),t(d,{onClick:f=>P("https://k5ws.vicicode.cn"+a.file)},{default:e(()=>[s(r(o.$t("global.use")),1)]),_:2},1032,["onClick"])]),default:e(()=>[t(N,{description:a.desc},{title:e(()=>[t(u,{theme:"primary",variant:"outline"},{default:e(()=>{var f;return[s(r((f=a.user)==null?void 0:f.nickname),1)]}),_:2},1024),s(" "+r(a.title),1)]),_:2},1032,["description"])]),_:2},1024))),256))]),_:1}),t(M,{onChange:F,style:{margin:"10px"},total:l.total,current:l.page,pageSize:12,showPageNumber:"",showPageSize:!1},null,8,["total","current"])]),_:1},8,["title"])]),_:1})]),_:1}),t(C,{visible:l.showPanel,"onUpdate:visible":n[3]||(n[3]=a=>l.showPanel=a),size:"50%",header:"\u6211\u7684\u5206\u4EAB",footer:!1},{default:e(()=>[_("div",Ue,[t(A,{style:{margin:"10px"},onClick:U},{default:e(()=>[s("\u4E0A\u4F20\u65B0\u5206\u4EAB")]),_:1}),t(A,{loading:l.refLoading,shape:"circle",theme:"outline",onClick:S},{icon:e(()=>[t(m(fe))]),_:1},8,["loading"])]),t(H,{split:!0},{default:e(()=>[(c(!0),b(x,null,L(l.myList,a=>(c(),v(G,null,{default:e(()=>[_("div",Be,[_("div",De,[a.status==0?(c(),v(u,{key:0,theme:"primary",variant:"outline"},{default:e(()=>[s("\u5BA1\u6838\u4E2D")]),_:1})):a.status==1?(c(),v(u,{key:1,theme:"primary",variant:"outline"},{default:e(()=>[s("\u5DF2\u5BA1\u6838")]),_:1})):(c(),v(u,{key:2,theme:"primary",variant:"outline"},{default:e(()=>[s("\u5DF2\u9A73\u56DE")]),_:1})),s(" "+r(a.title)+" ",1),Ve,s(" "+r(a.desc),1)]),_("div",Se,[t(u,null,{default:e(()=>[s(r(a.create_time_text),1)]),_:2},1024),s("\xA0 "),t(q,{theme:"primary",hover:"color",onClick:f=>D(a.id)},{default:e(()=>[s("\u5220\u9664")]),_:2},1032,["onClick"])])])]),_:2},1024))),256))]),_:1})]),_:1},8,["visible"]),t(C,{visible:l.showUpload,"onUpdate:visible":n[7]||(n[7]=a=>l.showUpload=a),size:"25%",header:"\u4E0A\u4F20\u65B0\u56FA\u4EF6",footer:!1},{default:e(()=>[t(X,{data:i,"reset-type":"initial",colon:"",onSubmit:B},{default:e(()=>[t(y,{label:"\u5206\u4EAB\u540D\u79F0",name:"title","label-align":"top"},{default:e(()=>[t(J,{modelValue:i.title,"onUpdate:modelValue":n[4]||(n[4]=a=>i.title=a)},null,8,["modelValue"])]),_:1}),t(y,{label:"\u5206\u4EAB\u63CF\u8FF0",name:"desc","label-align":"top"},{default:e(()=>[t(Q,{maxlength:200,autosize:{minRows:5,maxRows:10},modelValue:i.desc,"onUpdate:modelValue":n[5]||(n[5]=a=>i.desc=a),clearable:""},null,8,["modelValue"])]),_:1}),t(y,{label:"\u4FE1\u9053\u6587\u4EF6",name:"firmware","label-align":"top"},{default:e(()=>[t(W,{modelValue:i.firmware,"onUpdate:modelValue":n[6]||(n[6]=a=>i.firmware=a),action:"https://k5ws.vicicode.cn/api/ajax/upload?server=1","abridge-name":[8,6],headers:{"ba-user-token":m(p).accountId},theme:"file-input",placeholder:"\u672A\u9009\u62E9\u6587\u4EF6"},null,8,["modelValue","headers"])]),_:1}),t(y,{"label-align":"top"},{default:e(()=>[t(A,{theme:"primary",type:"submit",block:""},{default:e(()=>[s("\u63D0\u4EA4\u5BA1\u6838")]),_:1})]),_:1})]),_:1},8,["data"])]),_:1},8,["visible"])])}}});const st=ae(Re,[["__scopeId","data-v-64830bd8"]]);export{st as default};
