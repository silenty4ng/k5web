import{u as A,a as B,_ as d,b as N}from"./useConfig.3a51a7af.js";import{f as R,o as I,bt as z,d as D,c as P,aI as k,h as F}from"./arco.7f845a67.js";import{L as M}from"./index.c9d9f013.js";import{M as w,d as X,c as $,b as K,w as U}from"./index.e1698f3e.js";import{u as V}from"./useDisabled.242d5b98.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var W={block:Boolean,content:{type:[String,Function]},default:{type:[String,Function]},disabled:{type:Boolean,default:void 0},ghost:Boolean,href:{type:String,default:""},icon:{type:Function},loading:Boolean,shape:{type:String,default:"rectangle",validator:function(e){return e?["rectangle","square","round","circle"].includes(e):!0}},size:{type:String,default:"medium",validator:function(e){return e?["extra-small","small","medium","large"].includes(e):!0}},suffix:{type:Function},tag:{type:String,validator:function(e){return e?["button","a","div"].includes(e):!0}},theme:{type:String,validator:function(e){return e?["default","primary","danger","warning","success"].includes(e):!0}},type:{type:String,default:"button",validator:function(e){return e?["submit","reset","button"].includes(e):!0}},variant:{type:String,default:"base",validator:function(e){return e?["base","outline","dashed","text"].includes(e):!0}},onClick:Function};/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var J=w.expand,Z=w.ripple,q=w.fade;function H(){var t=X("animation"),e=t.globalConfig,n=function(s){var u,c,r=e.value;return r&&!((u=r.exclude)!==null&&u!==void 0&&u.includes(s))&&((c=r.include)===null||c===void 0?void 0:c.includes(s))};return{keepExpand:n(J),keepRipple:n(Z),keepFade:n(q)}}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function j(t,e){var n=Object.keys(e);n.forEach(function(a){t.style[a]=e[a]})}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var O=200,G="rgba(0, 0, 0, 0)",Q="rgba(0, 0, 0, 0.35)",Y=function(e,n){var a;if(n)return n;if(e!=null&&(a=e.dataset)!==null&&a!==void 0&&a.ripple){var s=e.dataset.ripple;return s}var u=getComputedStyle(e).getPropertyValue("--ripple-color");return u||Q};function ee(t,e){var n=R(null),a=A(),s=H(),u=s.keepRipple,c=function(b){var i=t.value,h=Y(i,e==null?void 0:e.value);if(!(b.button!==0||!t||!u)&&!(i.classList.contains("".concat(a.value,"-is-active"))||i.classList.contains("".concat(a.value,"-is-disabled"))||i.classList.contains("".concat(a.value,"-is-checked"))||i.classList.contains("".concat(a.value,"-is-loading")))){var m=getComputedStyle(i),v=parseInt(m.borderWidth,10),y=v>0?v:0,f=i.offsetWidth,o=i.offsetHeight;n.value.parentNode===null&&(j(n.value,{position:"absolute",left:"".concat(0-y,"px"),top:"".concat(0-y,"px"),width:"".concat(f,"px"),height:"".concat(o,"px"),borderRadius:m.borderRadius,pointerEvents:"none",overflow:"hidden"}),i.appendChild(n.value));var l=document.createElement("div");j(l,{marginTop:"0",marginLeft:"0",right:"".concat(f,"px"),width:"".concat(f+20,"px"),height:"100%",transition:"transform ".concat(O,"ms cubic-bezier(.38, 0, .24, 1), background ").concat(O*2,"ms linear"),transform:"skewX(-8deg)",pointerEvents:"none",position:"absolute",zIndex:0,backgroundColor:h,opacity:"0.9"});for(var x=new WeakMap,C=i.children.length,g=0;g<C;++g){var p=i.children[g];p.style.zIndex===""&&p!==n.value&&(p.style.zIndex="1",x.set(p,!0))}var S=i.style.position?i.style.position:getComputedStyle(i).position;(S===""||S==="static")&&(i.style.position="relative"),n.value.insertBefore(l,n.value.firstChild),setTimeout(function(){l.style.transform="translateX(".concat(f,"px)")},0);var T=function _(){l.style.backgroundColor=G,t.value&&(t.value.removeEventListener("pointerup",_,!1),t.value.removeEventListener("pointerleave",_,!1),setTimeout(function(){l.remove(),n.value.children.length===0&&n.value.remove()},O*2+100))};t.value.addEventListener("pointerup",T,!1),t.value.addEventListener("pointerleave",T,!1)}};I(function(){var r=t==null?void 0:t.value;!r||(n.value=document.createElement("div"),r.addEventListener("pointerdown",c,!1))}),z(function(){var r;t==null||(r=t.value)===null||r===void 0||r.removeEventListener("pointerdown",c,!1)})}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function L(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(s){return Object.getOwnPropertyDescriptor(t,s).enumerable})),n.push.apply(n,a)}return n}function E(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?L(Object(n),!0).forEach(function(a){d(t,a,n[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):L(Object(n)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(n,a))})}return t}var te=D({name:"TButton",props:W,setup:function(e,n){var a=n.attrs,s=n.slots,u=$(),c=K(),r=A("button"),b=B(),i=b.STATUS,h=b.SIZE,m=R();ee(m);var v=V(),y=P(function(){var o=e.theme,l=e.variant;return o||(l==="base"?"primary":"default")}),f=P(function(){return["".concat(r.value),"".concat(r.value,"--variant-").concat(e.variant),"".concat(r.value,"--theme-").concat(y.value),d(d(d(d(d(d({},h.value[e.size],e.size!=="medium"),i.value.disabled,v.value),i.value.loading,e.loading),"".concat(r.value,"--shape-").concat(e.shape),e.shape!=="rectangle"),"".concat(r.value,"--ghost"),e.ghost),h.value.block,e.block)]});return function(){var o=c("default","content"),l=e.loading?k(M,{inheritColor:!0},null):u("icon"),x=l&&!o,C=e.suffix||s.suffix?k("span",{className:"".concat(r.value,"__suffix")},[u("suffix")]):null;o=o?k("span",{class:"".concat(r.value,"__text")},[o]):"",l&&(o=[l,o]),C&&(o=[o].concat(C));var g=function(){return!e.tag&&e.href?"a":e.tag||"button"},p={class:[].concat(N(f.value),[d({},"".concat(r.value,"--icon-only"),x)]),type:e.type,disabled:v.value||e.loading,href:e.href,tabindex:v.value?void 0:"0"};return F(g(),E(E(E({ref:m},a),p),{},{onClick:e.onClick}),[o])}}});/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var ue=U(te);export{ue as B,ee as u};