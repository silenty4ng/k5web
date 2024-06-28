import{b as v,w as m,_ as g,ak as y}from"./index.d0c9d757.js";/* empty css              */import{d as b,aI as o,bI as h,C as O,D as j,aH as u,aM as f,aN as d}from"./arco.7f845a67.js";import{u as w,_ as c}from"./useConfig.f1b2a203.js";import"./chart.95d38b48.js";import"./vue.0bef8fc5.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var P={align:{type:String,default:"center",validator:function(t){return t?["left","right","center"].includes(t):!0}},content:{type:[String,Function]},dashed:Boolean,default:{type:[String,Function]},layout:{type:String,default:"horizontal",validator:function(t){return t?["horizontal","vertical"].includes(t):!0}},theme:{type:String,validator:function(t){return t?["horizontal","vertical"].includes(t):!0}}};/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),n.push.apply(n,r)}return n}function S(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?_(Object(n),!0).forEach(function(r){c(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}var $=b({name:"TDivider",props:S({},P),setup:function(t){var n=w("divider"),r=v();return function(){var i=t.layout,p=t.dashed,s=t.align,a=r("default","content"),l=["".concat(n.value),["".concat(n.value,"--").concat(i)],c(c(c({},"".concat(n.value,"--dashed"),!!p),"".concat(n.value,"--with-text"),!!a),"".concat(n.value,"--with-text-").concat(s),!!a)];return o("div",{class:l},[a&&o("span",{class:"".concat(n.value,"__inner-text")},[a])])}}});/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var C=m($);const D={name:"BL"};const x={class:"container"};function N(e,t,n,r,i,p){const s=y,a=C,l=h;return O(),j("div",x,[o(s,{items:[e.$t("menu.list"),e.$t("bl")]},null,8,["items"]),o(l,{class:"general-card"},{title:u(()=>[f(d(e.$t("bl"))+" "+d(e.$t("global.onStart")),1)]),default:u(()=>[o(a,null,{default:u(()=>[f(d(e.$t("cs")),1)]),_:1})]),_:1})])}const T=g(D,[["render",N],["__scopeId","data-v-c8ef48f4"]]);export{T as default};
