import{u as C,a as h,_ as i,b as w}from"./useConfig.f6485710.js";import{d as x,c as P,aI as c}from"./arco.7f845a67.js";import{b as k,c as j,d as _,w as I}from"./index.4eb55f07.js";import{u as N}from"./useDisabled.110213c8.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var T={content:{type:[String,Function]},default:{type:[String,Function]},disabled:{type:Boolean,default:void 0},download:{type:[String,Boolean]},hover:{type:String,default:"underline",validator:function(e){return e?["color","underline"].includes(e):!0}},href:{type:String,default:""},prefixIcon:{type:Function},size:{type:String,default:"medium",validator:function(e){return e?["small","medium","large"].includes(e):!0}},suffixIcon:{type:Function},target:{type:String,default:""},theme:{type:String,default:"default",validator:function(e){return e?["default","primary","danger","warning","success"].includes(e):!0}},underline:Boolean,onClick:Function};/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function m(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(l){return Object.getOwnPropertyDescriptor(t,l).enumerable})),n.push.apply(n,r)}return n}function D(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?m(Object(n),!0).forEach(function(r){i(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}var E=x({name:"TLink",props:D({},T),emits:["click"],setup:function(e,n){var r=n.emit,l=k(),s=j(),a=C("link"),d=h(),p=d.STATUS,g=d.SIZE,y=_("classPrefix"),b=y.classPrefix,o=N(),O=P(function(){return["".concat(a.value),"".concat(a.value,"--theme-").concat(e.theme),i(i(i(i({},g.value[e.size],e.size!=="medium"),p.value.disabled,o.value),"".concat(b.value,"-is-underline"),e.underline),"".concat(a.value,"--hover-").concat(e.hover),!o.value)]}),S=function(u){o.value||r("click",u)};return function(){var f=l("default","content"),u=s("prefixIcon"),v=s("suffixIcon");return c("a",{class:w(O.value),href:o.value||!e.href?void 0:e.href,target:e.target?e.target:void 0,download:e.download?e.download:void 0,onClick:S},[u?c("span",{class:"".concat(a.value,"__prefix-icon")},[u]):null,f,v?c("span",{class:"".concat(a.value,"__suffix-icon")},[v]):null])}}});/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var B=I(E);export{B as L};
