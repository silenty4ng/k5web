import{w as c,O as y,P as p,z as m}from"./index.b3bd651f.js";import{c as s}from"./arco.768e32d2.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function f(e,r){(r==null||r>e.length)&&(r=e.length);for(var t=0,a=new Array(r);t<r;t++)a[t]=e[t];return a}function b(e,r){if(!!e){if(typeof e=="string")return f(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);if(t==="Object"&&e.constructor&&(t=e.constructor.name),t==="Map"||t==="Set")return Array.from(e);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return f(e,r)}}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function g(e){if(Array.isArray(e))return f(e)}function A(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function _(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function v(e){return g(e)||A(e)||b(e)||_()}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function x(e,r){if(c(e)!="object"||!e)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var a=t.call(e,r||"default");if(c(a)!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(r==="string"?String:Number)(e)}function T(e){var r=x(e,"string");return c(r)=="symbol"?r:r+""}function z(e,r,t){return r=T(r),r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function E(e){if(Array.isArray(e))return e}function I(e,r){var t=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(t!=null){var a,i,n,o,u=[],l=!0,d=!1;try{if(n=(t=t.call(e)).next,r===0){if(Object(t)!==t)return;l=!1}else for(;!(l=(a=n.call(t)).done)&&(u.push(a.value),u.length!==r);l=!0);}catch(h){d=!0,i=h}finally{try{if(!l&&t.return!=null&&(o=t.return(),Object(o)!==o))return}finally{if(d)throw i}}return u}}function P(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function G(e,r){return E(e)||I(e,r)||b(e,r)||P()}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var w=y,M=p,S="[object Number]";function O(e){return typeof e=="number"||M(e)&&w(e)==S}var j=O;/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function C(){if(typeof navigator>"u"||!navigator)return Number.MAX_SAFE_INTEGER;var e=navigator,r=e.userAgent,t=r.indexOf("compatible")>-1&&r.indexOf("MSIE")>-1,a=r.indexOf("Trident")>-1&&r.indexOf("rv:11.0")>-1;if(t){var i=new RegExp("MSIE (\\d+\\.\\d+);"),n=r.match(i);if(!n)return-1;var o=parseFloat(n[1]);return o<7?6:o}return a?11:Number.MAX_SAFE_INTEGER}function R(){var e,r,t;if(typeof navigator>"u"||!navigator)return!1;var a=navigator.userAgent,i=a.match(/AppleWebKit.+Chrome\/(.+) Safari\/.+/i);if(Number(i==null||(e=i[1])===null||e===void 0?void 0:e.split(".")[0])<100)return!0;var n=a.match(/AppleWebKit.+Version\/(.+) Safari\/.+/i);if(Number(n==null||(r=n[1])===null||r===void 0?void 0:r.split(".")[0])<12)return!0;var o=C();if(o<=11)return!0;var u=a.match(/Firefox\/(.+)/i);return Number(u==null||(t=u[1])===null||t===void 0?void 0:t.split(".")[0])<100}function U(e,r){var t=j(r);if(!e||e.length===0)return t?{length:0,characters:e}:0;for(var a=0,i=0;i<e.length;i++){var n=0;if(e.charCodeAt(i)>127?n=2:n=1,t&&a+n>r)return{length:a,characters:e.slice(0,i)};a+=n}return t?{length:a,characters:e}:a}function W(e){return v(e!=null?e:"").length}function $(e,r,t){return v(t!=null?t:"").slice().length===r?t||"":v(e!=null?e:"").slice(0,r).join("")}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function k(e){var r=m("classPrefix"),t=r.classPrefix;return s(function(){return e?"".concat(t.value,"-").concat(e):t.value})}function K(){var e=m("classPrefix"),r=e.classPrefix;return{SIZE:s(function(){return{small:"".concat(r.value,"-size-s"),medium:"".concat(r.value,"-size-m"),large:"".concat(r.value,"-size-l"),default:"",xs:"".concat(r.value,"-size-xs"),xl:"".concat(r.value,"-size-xl"),block:"".concat(r.value,"-size-full-width")}}),STATUS:s(function(){return{loading:"".concat(r.value,"-is-loading"),loadMore:"".concat(r.value,"-is-load-more"),disabled:"".concat(r.value,"-is-disabled"),focused:"".concat(r.value,"-is-focused"),success:"".concat(r.value,"-is-success"),error:"".concat(r.value,"-is-error"),warning:"".concat(r.value,"-is-warning"),selected:"".concat(r.value,"-is-selected"),active:"".concat(r.value,"-is-active"),checked:"".concat(r.value,"-is-checked"),current:"".concat(r.value,"-is-current"),hidden:"".concat(r.value,"-is-hidden"),visible:"".concat(r.value,"-is-visible"),expanded:"".concat(r.value,"-is-expanded"),indeterminate:"".concat(r.value,"-is-indeterminate")}})}}export{G as _,U as a,K as b,z as c,v as d,C as e,E as f,W as g,A as h,j as i,b as j,P as k,$ as l,R as m,T as t,k as u};
