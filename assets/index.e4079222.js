import{v as M,d as H,ab as N,B as U,_ as L}from"./index.767799dd.js";/* empty css               *//* empty css               */import{d as V,r as y,c as O,bz as j,C as F,D as G,aI as i,aH as r,G as S,aN as f,aM as g,u as h,a6 as W,b7 as Z,bg as q,bB as J,bF as Q}from"./arco.4840bb92.js";import{u as X}from"./loading.be8dc599.js";import{e as v,a as C,u as w,f as Y,h as D,s as ee,b,g as te}from"./serial.d615852e.js";import{I as P}from"./index.619f718e.js";import{M as ae}from"./move.2a80314e.js";import{T as ne}from"./index.36555294.js";import"./chart.2ff044ff.js";import"./vue.b2a11794.js";import"./dep-71c4f289.3a3d098d.js";import"./index.1a102e07.js";import"./form-model.d0bcd6c4.js";import"./slot.055cf4a1.js";const oe={class:"container"},re={name:"Mdc"},se=V({...re,setup(ie){const{t:m}=M.exports.useI18n(),o=H(),{loading:I,setLoading:u}=X(!1),a=y({renderData:Array.from({length:16}).map(e=>({})),pageSize:16,nowPage:1}),z=y({showHide:0}),R=e=>{a.renderData=e.newData},A=O(()=>[{colKey:"drag",title:m("cps.sort"),width:46},{title:"#",colKey:"index",align:"left",width:100},{title:m("cps.contact"),colKey:"name",width:250,align:"left",cell:(e,{row:t})=>t.name?t.name.replace(/[^a-zA-Z0-9_]/g,""):void 0,edit:{component:P,props:{clearable:!0},onEdited:e=>{const t=[...a.renderData];t.splice((a.nowPage-1)*a.pageSize+e.rowIndex,1,e.newRowData),a.renderData=t}}},{title:m("cps.mdcid"),colKey:"mdcid",align:"left",width:200,cell:(e,{row:t})=>parseInt(t.mdcid,16)<=65535?parseInt(t.mdcid,16).toString(16):void 0,edit:{component:P,props:{clearable:!0},onEdited:e=>{e.newRowData.mdcid=e.newRowData.mdcid?e.newRowData.mdcid.toLowerCase():void 0;const t=[...a.renderData];t.splice((a.nowPage-1)*a.pageSize+e.rowIndex,1,e.newRowData),a.renderData=t}}},{title:m("cps.operate"),colKey:"operate",align:"left",width:150}]),T=async()=>{var d,c;if(o.connectState!=!0){alert(sessionStorage.getItem("noticeConnectK5"));return}await v(o.connectPort),u(!0);let e=new Uint8Array(256);for(let n=7424;n<7680;n+=16){const s=await C(o.connectPort,n,16,(d=o.configuration)==null?void 0:d.uart);e.set(s,n-7424)}const t=[];for(let n=0;n<256;n+=16)w(e.subarray(n,n+2))!="ffff"?t.push({name:Y(e.subarray(n+2,n+16),(c=o.configuration)==null?void 0:c.charset).trim(),mdcid:w(e.subarray(n,n+1))+w(e.subarray(n+1,n+2))}):t.push({});a.renderData=t,u(!1)},$=async()=>{var t,d,c,n;if(o.connectState!=!0){alert(sessionStorage.getItem("noticeConnectK5"));return}await v(o.connectPort),u(!0);for(let s=0;s<256;s+=16)if(a.renderData[s/16].mdcid){const l=new Uint8Array(16).fill(32);l.set(D(a.renderData[s/16].mdcid.padStart(4,"0").substring(0,2))),l.set(D(a.renderData[s/16].mdcid.padStart(4,"0").substring(2,4)),1),l.set(ee(a.renderData[s/16].name),2),await b(o.connectPort,s+7424,l,16,(t=o.configuration)==null?void 0:t.uart)}else await b(o.connectPort,s+7424,D("ffffffffffffffffffffffffffffffff"),16,(d=o.configuration)==null?void 0:d.uart);const e=await C(o.connectPort,8176,16,(c=o.configuration)==null?void 0:c.uart);e.set([16],16-1),await b(o.connectPort,8176,e,16,(n=o.configuration)==null?void 0:n.uart),await te(o.connectPort),u(!1)},B=async e=>{const t=[...a.renderData];t.splice(e,1,{scanlist:[]}),a.renderData=t};return(e,t)=>{const d=N,c=W,n=Z,s=q,l=J,k=Q,K=U,x=ne,E=j;return F(),G("div",oe,[i(d,{items:[e.$t("menu.dashboard"),e.$t("menu.cps.mdc")]},null,8,["items"]),i(E,{class:"general-card"},{title:r(()=>[S("span",{onClick:t[0]||(t[0]=()=>{z.showHide+=1})},f(e.$t("menu.cps.mdc")+e.$t("global.onStart")),1)]),default:r(()=>[i(k,{style:{"margin-bottom":"16px"}},{default:r(()=>[i(l,{span:12},{default:r(()=>[i(s,null,{default:r(()=>[i(n,{type:"primary",onClick:T},{icon:r(()=>[i(c)]),default:r(()=>[g(" "+f(e.$t("cps.onDeviceRead")),1)]),_:1}),i(n,{onClick:$},{icon:r(()=>[i(c)]),default:r(()=>[g(" "+f(e.$t("cps.onDeviceWrite")),1)]),_:1})]),_:1})]),_:1})]),_:1}),i(x,{class:"ttable",loading:h(I),size:"medium",columns:A.value,data:a.renderData,pagination:{defaultPageSize:a.pageSize,total:a.renderData.length,defaultCurrent:1,pageSizeOptions:[15,30,50,100,200]},onChange:t[1]||(t[1]=p=>{a.pageSize=p.pagination.pageSize,a.nowPage=p.pagination.current}),bordered:"","lazy-load":"",headerAffixedTop:{offsetTop:60},hover:!0,"drag-sort":"row-handler",onDragSort:R},{drag:r(({row:p,rowIndex:_})=>[S("span",null,[i(h(ae))])]),index:r(({row:p,rowIndex:_})=>[g(f((a.nowPage-1)*a.pageSize+_+1),1)]),operate:r(({row:p,rowIndex:_})=>[i(K,{theme:"default",variant:"dashed",onClick:ce=>B((a.nowPage-1)*a.pageSize+_)},{default:r(()=>[g(f(e.$t("cps.clear")),1)]),_:2},1032,["onClick"])]),_:1},8,["loading","columns","data","pagination"])]),_:1})])}}});const Ce=L(se,[["__scopeId","data-v-2223802a"]]);export{Ce as default};
