import{o as h,k as u}from"./index.00fa277a.js";import{bp as p,aK as f,g as d}from"./arco.c29bba08.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function _(){var o=d();return function(l,r){var t,n;r||(r=o.slots);var c=((t=r)===null||t===void 0||(n=t.default)===null||n===void 0?void 0:n.call(t))||[],s=[],v=function i(e){if(!!u(e))return e.forEach(function(a){if(a.children&&u(a.children)){if(a.type!==f)return;i(a.children)}else s.push(a)}),s};return v(c).filter(function(i){var e;return(e=i.type.name)===null||e===void 0?void 0:e.endsWith(l)})}}function g(){var o=d();return function(){var l,r=o.slots,t=(r==null||(l=r.default)===null||l===void 0?void 0:l.call(r))||[];return t.filter(function(n){return h(n.type)==="symbol"&&!n.children?!1:n.type!==p}).map(function(n){return n.children&&u(n.children)&&n.type===f?n.children:n}).flat()}}export{_ as a,g as u};
