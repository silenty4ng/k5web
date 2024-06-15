import{c as v,b as f}from"./useConfig.ca36cd5a.js";import{f as b,i as d}from"./index.fbda348e.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function h(e){if(Array.isArray(e))return e}function m(e,t){var r=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(r!=null){var a,i,n,o,u=[],l=!0,c=!1;try{if(n=(r=r.call(e)).next,t===0){if(Object(r)!==r)return;l=!1}else for(;!(l=(a=n.call(r)).done)&&(u.push(a.value),u.length!==t);l=!0);}catch(s){c=!0,i=s}finally{try{if(!l&&r.return!=null&&(o=r.return(),Object(o)!==o))return}finally{if(c)throw i}}return u}}function g(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function N(e,t){return h(e)||m(e,t)||v(e,t)||g()}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */var p=b,y=d,_="[object Number]";function A(e){return typeof e=="number"||y(e)&&p(e)==_}var E=A;/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function M(){if(typeof navigator>"u"||!navigator)return Number.MAX_SAFE_INTEGER;var e=navigator,t=e.userAgent,r=t.indexOf("compatible")>-1&&t.indexOf("MSIE")>-1,a=t.indexOf("Trident")>-1&&t.indexOf("rv:11.0")>-1;if(r){var i=new RegExp("MSIE (\\d+\\.\\d+);"),n=t.match(i);if(!n)return-1;var o=parseFloat(n[1]);return o<7?6:o}return a?11:Number.MAX_SAFE_INTEGER}function T(){var e,t,r;if(typeof navigator>"u"||!navigator)return!1;var a=navigator.userAgent,i=a.match(/AppleWebKit.+Chrome\/(.+) Safari\/.+/i);if(Number(i==null||(e=i[1])===null||e===void 0?void 0:e.split(".")[0])<100)return!0;var n=a.match(/AppleWebKit.+Version\/(.+) Safari\/.+/i);if(Number(n==null||(t=n[1])===null||t===void 0?void 0:t.split(".")[0])<12)return!0;var o=M();if(o<=11)return!0;var u=a.match(/Firefox\/(.+)/i);return Number(u==null||(r=u[1])===null||r===void 0?void 0:r.split(".")[0])<100}function F(e,t){var r=E(t);if(!e||e.length===0)return r?{length:0,characters:e}:0;for(var a=0,i=0;i<e.length;i++){var n=0;if(e.charCodeAt(i)>127?n=2:n=1,r&&a+n>t)return{length:a,characters:e.slice(0,i)};a+=n}return r?{length:a,characters:e}:a}function O(e){return f(e!=null?e:"").length}function j(e,t,r){return f(r!=null?r:"").slice().length===t?r||"":f(e!=null?e:"").slice(0,t).join("")}export{N as _,F as a,M as b,h as c,g as d,T as e,O as g,E as i,j as l};
