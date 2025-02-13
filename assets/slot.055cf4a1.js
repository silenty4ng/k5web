import{a9 as s,a4 as f,V as d}from"./index.767799dd.js";import{bw as c,aK as v,g as o}from"./arco.4840bb92.js";/**
 * tdesign v1.9.9
 * (c) 2024 tdesign
 * @license MIT
 */function y(){var a=o();return function(e,t){var r,n;t||(t=a.slots);var u=((r=t)===null||r===void 0||(n=r.default)===null||n===void 0?void 0:n.call(r))||[];return s(u).filter(function(i){var l;return(l=i.type.name)===null||l===void 0?void 0:l.endsWith(e)})}}function m(){var a=o();return function(){var e,t=a.slots,r=(t==null||(e=t.default)===null||e===void 0?void 0:e.call(t))||[];return r.filter(function(n){return f(n.type)==="symbol"&&!n.children?!1:n.type!==c}).map(function(n){return n.children&&d(n.children)&&n.type===v?n.children:n}).flat()}}export{y as a,m as u};
