import{o as s,p as f,k as d}from"./index.2f1d1caf.js";import{bp as c,aK as v,g as o}from"./arco.13f9ef32.js";/**
 * tdesign v1.9.9
 * (c) 2024 tdesign
 * @license MIT
 */function y(){var l=o();return function(e,t){var r,n;t||(t=l.slots);var u=((r=t)===null||r===void 0||(n=r.default)===null||n===void 0?void 0:n.call(r))||[];return s(u).filter(function(i){var a;return(a=i.type.name)===null||a===void 0?void 0:a.endsWith(e)})}}function m(){var l=o();return function(){var e,t=l.slots,r=(t==null||(e=t.default)===null||e===void 0?void 0:e.call(t))||[];return r.filter(function(n){return f(n.type)==="symbol"&&!n.children?!1:n.type!==c}).map(function(n){return n.children&&d(n.children)&&n.type===v?n.children:n}).flat()}}export{y as a,m as u};
