import{j as h,b as w,k as x,l as p,m,n as z,f as o,i as N,w as C}from"./index.cab20bfd.js";import{d as _,c as y,aI as u,aK as F}from"./arco.9755215d.js";import{u as k}from"./slot.c069f826.js";/**
 * tdesign v1.9.9
 * (c) 2024 tdesign
 * @license MIT
 */var T={align:{type:String,validator:function(e){return e?["start","end","center","baseline"].includes(e):!0}},breakLine:Boolean,direction:{type:String,default:"horizontal",validator:function(e){return e?["vertical","horizontal"].includes(e):!0}},separator:{type:[String,Function]},size:{type:[String,Number,Array],default:"medium"}};/**
 * tdesign v1.9.9
 * (c) 2024 tdesign
 * @license MIT
 */function g(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(f){return Object.getOwnPropertyDescriptor(t,f).enumerable})),r.push.apply(r,a)}return r}function b(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?g(Object(r),!0).forEach(function(a){o(t,a,r[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):g(Object(r)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(r,a))})}return t}var O={small:"8px",medium:"16px",large:"24px"},A=h(),D=_({name:"TSpace",props:b(b({},T),{},{forceFlexGapPolyfill:Boolean}),setup:function(e){var r=w("space"),a=N(),f=k(),v=y(function(){return e.forceFlexGapPolyfill||A}),S=y(function(){var n="";x(e.size)?n=e.size.map(function(l){return p(l)?"".concat(l,"px"):m(l)&&O[l]||l}).join(" "):m(e.size)?n=O[e.size]||e.size:p(e.size)&&(n="".concat(e.size,"px"));var i={};if(v.value){var d=n.split(" "),c=z(d,2),s=c[0],j=c[1];i["--td-space-column-gap"]=s,i["--td-space-row-gap"]=j||s}else i.gap=n;return i});function P(){var n=f(),i=a("separator");return n.map(function(d,c){var s=c+1!==n.length&&i;return u(F,null,[u("div",{class:"".concat(r.value,"-item")},[d]),s&&u("div",{class:"".concat(r.value,"-item-separator")},[i])])})}return function(){var n=["".concat(r.value),o(o(o(o({},"".concat(r.value,"-align-").concat(e.align),e.align),"".concat(r.value,"-").concat(e.direction),e.direction),"".concat(r.value,"--break-line"),e.breakLine),"".concat(r.value,"--polyfill"),v.value)];return u("div",{class:n,style:S.value},[P()])}}});/**
 * tdesign v1.9.9
 * (c) 2024 tdesign
 * @license MIT
 */var G=C(D);export{G as S};
