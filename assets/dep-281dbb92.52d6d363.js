import{q as p,s as y,t as C,a7 as d,ao as P,ap as h,aq as S,ar as F,Z as L,N as $,as as w,at as A,au as j}from"./index.abea991e.js";import{d as E,c as o}from"./arco.7dae27b5.js";import{o as D,p as G,j as _,k as z,f as I,m as K}from"./index.f3a75336.js";function f(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,a)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?f(Object(t),!0).forEach(function(a){C(e,a,t[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):f(Object(t)).forEach(function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))})}return e}var N={tag:"svg",attrs:{fill:"none",viewBox:"0 0 24 24",width:"1em",height:"1em"},children:[{tag:"path",attrs:{fill:"currentColor",d:"M7.05 5.64L12 10.59l4.95-4.95 1.41 1.41L13.41 12l4.95 4.95-1.41 1.41L12 13.41l-4.95 4.95-1.41-1.41L10.59 12 5.64 7.05l1.41-1.41z"}}]},R=E({name:"CloseIcon",props:{size:{type:String},onClick:{type:Function}},setup(e,n){var{attrs:t}=n,a=o(()=>e.size),{className:r,style:s}=p(a),i=o(()=>["t-icon","t-icon-close",r.value]),l=o(()=>c(c({},s.value),t.style)),m=o(()=>({class:i.value,style:l.value,onClick:O=>{var u;return(u=e.onClick)===null||u===void 0?void 0:u.call(e,{e:O})}}));return()=>y(N,m.value)}});const je=R;/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function Ee(e){var n=d("icon"),t=n.globalConfig,a={};return Object.keys(e).forEach(function(r){var s;a[r]=((s=t.value)===null||s===void 0?void 0:s[r])||e[r]}),a}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function k(e){var n=e==null?0:e.length;return n?e[n-1]:void 0}var M=k;/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var v=P,x=F,T=L,g=v?v.isConcatSpreadable:void 0;function U(e){return T(e)||x(e)||!!(g&&e&&e[g])}var q=U,B=D,Y=q;function b(e,n,t,a,r){var s=-1,i=e.length;for(t||(t=Y),r||(r=[]);++s<i;){var l=e[s];n>0&&t(l)?n>1?b(l,n-1,t,a,r):B(r,l):a||(r[r.length]=l)}return r}var Z=b,H=Z;function J(e){var n=e==null?0:e.length;return n?H(e,1):[]}var Q=J,V=Q,W=h,X=S;function ee(e){return X(W(e,void 0,V),e+"")}var ne=ee;/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var te=K,ae=A;function re(e,n){return n.length<2?e:te(e,ae(n,0,-1))}var se=re,le=_,oe=M,ie=se,ue=z;function fe(e,n){return n=le(n,e),e=ie(e,n),e==null||delete e[ue(oe(n))]}var ce=fe,ve=j;function ge(e){return ve(e)?void 0:e}var _e=ge,be=$,me=I,Oe=ce,pe=_,ye=w,Ce=_e,de=ne,Pe=G,he=1,Se=2,Fe=4,Le=de(function(e,n){var t={};if(e==null)return t;var a=!1;n=be(n,function(s){return s=pe(s,e),a||(a=s.length>1),s}),ye(e,Pe(e),t),a&&(t=me(t,he|Se|Fe,Ce));for(var r=n.length;r--;)Oe(t,n[r]);return t}),De=Le;export{je as C,Z as _,ne as a,M as l,De as o,Ee as u};
