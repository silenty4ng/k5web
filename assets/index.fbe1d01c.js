import{e as j,i as v,_ as w}from"./helper.f1ff4a0e.js";import{u as x,_ as l}from"./useConfig.e95fe182.js";import{d as z,c as m,aI as u,aK as N}from"./arco.949c921a.js";import{c as _,M as C,N as y,w as F}from"./index.d4000d74.js";import{a as T}from"./slot.b263f39f.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var k={align:{type:String,validator:function(e){return e?["start","end","center","baseline"].includes(e):!0}},breakLine:Boolean,direction:{type:String,default:"horizontal",validator:function(e){return e?["vertical","horizontal"].includes(e):!0}},separator:{type:[String,Function]},size:{type:[String,Number,Array],default:"medium"}};/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function g(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(f){return Object.getOwnPropertyDescriptor(t,f).enumerable})),r.push.apply(r,a)}return r}function b(t){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?g(Object(r),!0).forEach(function(a){l(t,a,r[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):g(Object(r)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(r,a))})}return t}var O={small:"8px",medium:"16px",large:"24px"},A=j(),D=z({name:"TSpace",props:b(b({},k),{},{forceFlexGapPolyfill:Boolean}),setup:function(e){var r=x("space"),a=_(),f=T(),p=m(function(){return e.forceFlexGapPolyfill||A}),S=m(function(){var n="";C(e.size)?n=e.size.map(function(o){return v(o)?"".concat(o,"px"):y(o)&&O[o]||o}).join(" "):y(e.size)?n=O[e.size]||e.size:v(e.size)&&(n="".concat(e.size,"px"));var i={};if(p.value){var d=n.split(" "),c=w(d,2),s=c[0],h=c[1];i["--td-space-column-gap"]=s,i["--td-space-row-gap"]=h||s}else i.gap=n;return i});function P(){var n=f(),i=a("separator");return n.map(function(d,c){var s=c+1!==n.length&&i;return u(N,null,[u("div",{class:"".concat(r.value,"-item")},[d]),s&&u("div",{class:"".concat(r.value,"-item-separator")},[i])])})}return function(){var n=["".concat(r.value),l(l(l(l({},"".concat(r.value,"-align-").concat(e.align),e.align),"".concat(r.value,"-").concat(e.direction),e.direction),"".concat(r.value,"--break-line"),e.breakLine),"".concat(r.value,"--polyfill"),p.value)];return u("div",{class:n,style:S.value},[P()])}}});/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var J=F(D);export{J as S};
