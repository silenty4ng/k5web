import{w as h,J as u}from"./index.b0564292.js";import{bL as p,aK as f,g as d}from"./arco.768e32d2.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function _(){var i=d();return function(l,r){var t,n;r||(r=i.slots);var c=((t=r)===null||t===void 0||(n=t.default)===null||n===void 0?void 0:n.call(t))||[],s=[],v=function o(e){if(!!u(e))return e.forEach(function(a){if(a.children&&u(a.children)){if(a.type!==f)return;o(a.children)}else s.push(a)}),s};return v(c).filter(function(o){var e;return(e=o.type.name)===null||e===void 0?void 0:e.endsWith(l)})}}function g(){var i=d();return function(){var l,r=i.slots,t=(r==null||(l=r.default)===null||l===void 0?void 0:l.call(r))||[];return t.filter(function(n){return h(n.type)==="symbol"&&!n.children?!1:n.type!==p}).map(function(n){return n.children&&u(n.children)&&n.type===f?n.children:n}).flat()}}export{g as a,_ as u};
