import{al as _,a7 as R,y as P,am as I,an as N,z,M as F,U as M,L as d,T as $,F as U}from"./index.abea991e.js";import{f as A,o as X,aZ as K,c as O,i as V,g as W,d as Z,aI as x,h as G}from"./arco.7dae27b5.js";import{L as J}from"./index.f3a75336.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var q={block:Boolean,content:{type:[String,Function]},default:{type:[String,Function]},disabled:{type:Boolean,default:void 0},ghost:Boolean,href:{type:String,default:""},icon:{type:Function},loading:Boolean,shape:{type:String,default:"rectangle",validator:function(e){return e?["rectangle","square","round","circle"].includes(e):!0}},size:{type:String,default:"medium",validator:function(e){return e?["extra-small","small","medium","large"].includes(e):!0}},suffix:{type:Function},tag:{type:String,validator:function(e){return e?["button","a","div"].includes(e):!0}},theme:{type:String,validator:function(e){return e?["default","primary","danger","warning","success"].includes(e):!0}},type:{type:String,default:"button",validator:function(e){return e?["submit","reset","button"].includes(e):!0}},variant:{type:String,default:"base",validator:function(e){return e?["base","outline","dashed","text"].includes(e):!0}},onClick:Function};/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var H=_.expand,Q=_.ripple,Y=_.fade;function ee(){var t=R("animation"),e=t.globalConfig,a=function(o){var u,c,r=e.value;return r&&!((u=r.exclude)!==null&&u!==void 0&&u.includes(o))&&((c=r.include)===null||c===void 0?void 0:c.includes(o))};return{keepExpand:a(H),keepRipple:a(Q),keepFade:a(Y)}}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function B(t,e){var a=Object.keys(e);a.forEach(function(n){t.style[n]=e[n]})}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var E=200,te="rgba(0, 0, 0, 0)",ae="rgba(0, 0, 0, 0.35)",ne=function(e,a){var n;if(a)return a;if(e!=null&&(n=e.dataset)!==null&&n!==void 0&&n.ripple){var o=e.dataset.ripple;return o}var u=getComputedStyle(e).getPropertyValue("--ripple-color");return u||ae};function re(t,e){var a=A(null),n=P(),o=ee(),u=o.keepRipple,c=function(g){var i=t.value,y=ne(i,e==null?void 0:e.value);if(!(g.button!==0||!t||!u)&&!(i.classList.contains("".concat(n.value,"-is-active"))||i.classList.contains("".concat(n.value,"-is-disabled"))||i.classList.contains("".concat(n.value,"-is-checked"))||i.classList.contains("".concat(n.value,"-is-loading")))){var b=getComputedStyle(i),v=parseInt(b.borderWidth,10),h=v>0?v:0,f=i.offsetWidth,l=i.offsetHeight;a.value.parentNode===null&&(B(a.value,{position:"absolute",left:"".concat(0-h,"px"),top:"".concat(0-h,"px"),width:"".concat(f,"px"),height:"".concat(l,"px"),borderRadius:b.borderRadius,pointerEvents:"none",overflow:"hidden"}),i.appendChild(a.value));var s=document.createElement("div");B(s,{marginTop:"0",marginLeft:"0",right:"".concat(f,"px"),width:"".concat(f+20,"px"),height:"100%",transition:"transform ".concat(E,"ms cubic-bezier(.38, 0, .24, 1), background ").concat(E*2,"ms linear"),transform:"skewX(-8deg)",pointerEvents:"none",position:"absolute",zIndex:0,backgroundColor:y,opacity:"0.9"});for(var k=new WeakMap,C=i.children.length,m=0;m<C;++m){var p=i.children[m];p.style.zIndex===""&&p!==a.value&&(p.style.zIndex="1",k.set(p,!0))}var T=i.style.position?i.style.position:getComputedStyle(i).position;(T===""||T==="static")&&(i.style.position="relative"),a.value.insertBefore(s,a.value.firstChild),setTimeout(function(){s.style.transform="translateX(".concat(f,"px)")},0);var w=function L(){s.style.backgroundColor=te,t.value&&(t.value.removeEventListener("pointerup",L,!1),t.value.removeEventListener("pointerleave",L,!1),setTimeout(function(){s.remove(),a.value.children.length===0&&a.value.remove()},E*2+100))};t.value.addEventListener("pointerup",w,!1),t.value.addEventListener("pointerleave",w,!1)}};X(function(){var r=t==null?void 0:t.value;!r||(a.value=document.createElement("div"),r.addEventListener("pointerdown",c,!1))}),K(function(){var r;t==null||(r=t.value)===null||r===void 0||r.removeEventListener("pointerdown",c,!1)})}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var ie=I,oe=N,le="[object Boolean]";function ue(t){return t===!0||t===!1||oe(t)&&ie(t)==le}var S=ue;/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function se(t){var e=W(),a=O(function(){return e.props.disabled}),n=V("formDisabled",Object.create(null));return O(function(){var o;return S(t==null?void 0:t.beforeDisabled.value)?t.beforeDisabled.value:S(a.value)?a.value:S(t==null?void 0:t.afterDisabled.value)?t.afterDisabled.value:S((o=n.disabled)===null||o===void 0?void 0:o.value)?n.disabled.value:!1})}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function D(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable})),a.push.apply(a,n)}return a}function j(t){for(var e=1;e<arguments.length;e++){var a=arguments[e]!=null?arguments[e]:{};e%2?D(Object(a),!0).forEach(function(n){d(t,n,a[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):D(Object(a)).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(a,n))})}return t}var ce=Z({name:"TButton",props:q,setup:function(e,a){var n=a.attrs,o=a.slots,u=z(),c=F(),r=P("button"),g=M(),i=g.STATUS,y=g.SIZE,b=A();re(b);var v=se(),h=O(function(){var l=e.theme,s=e.variant;return l||(s==="base"?"primary":"default")}),f=O(function(){return["".concat(r.value),"".concat(r.value,"--variant-").concat(e.variant),"".concat(r.value,"--theme-").concat(h.value),d(d(d(d(d(d({},y.value[e.size],e.size!=="medium"),i.value.disabled,v.value),i.value.loading,e.loading),"".concat(r.value,"--shape-").concat(e.shape),e.shape!=="rectangle"),"".concat(r.value,"--ghost"),e.ghost),y.value.block,e.block)]});return function(){var l=c("default","content"),s=e.loading?x(J,{inheritColor:!0},null):u("icon"),k=s&&!l,C=e.suffix||o.suffix?x("span",{className:"".concat(r.value,"__suffix")},[u("suffix")]):null;l=l?x("span",{class:"".concat(r.value,"__text")},[l]):"",s&&(l=[s,l]),C&&(l=[l].concat(C));var m=function(){return!e.tag&&e.href?"a":e.tag||"button"},p={class:[].concat($(f.value),[d({},"".concat(r.value,"--icon-only"),k)]),type:e.type,disabled:v.value||e.loading,href:e.href,tabindex:v.value?void 0:"0"};return G(m(),j(j(j({ref:b},n),p),{},{onClick:e.onClick}),[l])}}});/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var pe=U(ce);export{pe as B,re as a,S as i,se as u};
