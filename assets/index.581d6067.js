import{d as R,c as t,aI as a,bg as V}from"./arco.06c99ad2.js";import{a as W,b as u,c as X,o as Z,w as k}from"./tnode.0682d731.js";import{L as q}from"./index.c72e94fc.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var G={actions:{type:[String,Function]},avatar:{type:[String,Function]},bordered:{type:Boolean,default:!0},content:{type:[String,Function]},cover:{type:[String,Function]},default:{type:[String,Function]},description:{type:[String,Function]},footer:{type:[String,Function]},header:{type:[String,Function]},headerBordered:Boolean,hoverShadow:Boolean,loading:{type:[Boolean,Function],default:!1},loadingProps:{type:Object},shadow:Boolean,size:{type:String,default:"medium",validator:function(e){return e?["medium","small"].includes(e):!0}},status:{type:String,default:""},subtitle:{type:[String,Function]},theme:{type:String,default:"normal",validator:function(e){return e?["normal","poster1","poster2"].includes(e):!0}},title:{type:[String,Function]}};/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function K(i){return typeof i=="function"||Object.prototype.toString.call(i)==="[object Object]"&&!V(i)}var Q=R({name:"TCard",props:G,setup:function(e,w){var o=w.slots,n=W(),l=u("card"),b=X(),y=b.SIZE,p=t(function(){var r=[l.value];return e.size==="small"&&r.push("".concat(y.value[e.size])),e.bordered&&r.push("".concat(l.value,"--bordered")),e.shadow&&r.push("".concat(l.value,"--shadow")),e.hoverShadow&&r.push("".concat(l.value,"--shadow-hover")),r}),d=t(function(){var r=["".concat(l.value,"__header")];return e.headerBordered?r.concat("".concat(l.value,"__title--bordered")):["".concat(l.value,"__header")]}),F=u("card__header-wrapper"),N=u("card__avatar"),B=u("card__title"),T=u("card__subtitle"),O=u("card__description"),c=u("card__actions"),P=u("card__body"),j=u("card__cover"),x=u("card__footer"),A=u("card__footer-wrapper"),v=t(function(){return e.theme==="poster2"}),f=t(function(){return e.title||o.title}),h=t(function(){return e.header||o.header}),_=t(function(){return e.subtitle||o.subtitle}),C=t(function(){return e.avatar||o.avatar}),m=t(function(){return e.description||o.description}),g=t(function(){return e.status||o.status}),s=t(function(){return e.actions||o.actions}),E=t(function(){return e.footer||o.footer}),H=t(function(){return e.cover||o.cover}),I=t(function(){return e.loading||o.loading}),z=t(function(){return e.content||o.content||e.default||o.default}),L=t(function(){return h.value||f.value||_.value||m.value||C.value||g.value&&v.value||s.value&&!v.value}),D=t(function(){return E.value||s.value&&v.value}),J=function(){return h.value?a("div",{class:d.value},[n("header")]):a("div",{class:d.value},[a("div",{class:F.value},[C.value&&a("div",{class:N.value},[n("avatar")]),a("div",null,[f.value&&a("div",{class:B.value},[n("title")]),_.value&&a("div",{class:T.value},[n("subtitle")]),m.value&&a("p",{class:O.value},[n("description")])])]),s.value&&!v.value&&a("div",{class:c.value},[n("actions")]),g.value&&a("div",{class:c.value},[n("status")])])},M=function(){var S=Z(e.cover);return a("div",{class:j.value},[S?a("img",{src:e.cover},null):n("cover")])};return function(){var r=a("div",{class:p.value},[L.value?J():null,H.value?M():null,z.value&&a("div",{class:P.value},[n("default")||n("content")]),D.value&&a("div",{class:x.value},[a("div",{class:A.value},[n("footer")]),s.value&&v.value&&a("div",{class:c.value},[n("actions")])])]);return I.value?n("loading")||a(q,e.loadingProps,K(r)?r:{default:function(){return[r]}}):r}}});/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var ee=k(Q);export{ee as C};