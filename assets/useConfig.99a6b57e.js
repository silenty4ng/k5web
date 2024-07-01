import{f as n,d as o}from"./index.d41050dc.js";import{c as i}from"./arco.7f845a67.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function c(r,e){(e==null||e>r.length)&&(e=r.length);for(var t=0,a=new Array(e);t<e;t++)a[t]=r[t];return a}function u(r,e){if(!!r){if(typeof r=="string")return c(r,e);var t=Object.prototype.toString.call(r).slice(8,-1);if(t==="Object"&&r.constructor&&(t=r.constructor.name),t==="Map"||t==="Set")return Array.from(r);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return c(r,e)}}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function s(r){if(Array.isArray(r))return c(r)}function l(r){if(typeof Symbol<"u"&&r[Symbol.iterator]!=null||r["@@iterator"]!=null)return Array.from(r)}function f(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function y(r){return s(r)||l(r)||u(r)||f()}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function d(r,e){if(n(r)!="object"||!r)return r;var t=r[Symbol.toPrimitive];if(t!==void 0){var a=t.call(r,e||"default");if(n(a)!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(r)}function v(r){var e=d(r,"string");return n(e)=="symbol"?e:e+""}function p(r,e,t){return e=v(e),e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function g(r){var e=o("classPrefix"),t=e.classPrefix;return i(function(){return r?"".concat(t.value,"-").concat(r):t.value})}function x(){var r=o("classPrefix"),e=r.classPrefix;return{SIZE:i(function(){return{small:"".concat(e.value,"-size-s"),medium:"".concat(e.value,"-size-m"),large:"".concat(e.value,"-size-l"),default:"",xs:"".concat(e.value,"-size-xs"),xl:"".concat(e.value,"-size-xl"),block:"".concat(e.value,"-size-full-width")}}),STATUS:i(function(){return{loading:"".concat(e.value,"-is-loading"),loadMore:"".concat(e.value,"-is-load-more"),disabled:"".concat(e.value,"-is-disabled"),focused:"".concat(e.value,"-is-focused"),success:"".concat(e.value,"-is-success"),error:"".concat(e.value,"-is-error"),warning:"".concat(e.value,"-is-warning"),selected:"".concat(e.value,"-is-selected"),active:"".concat(e.value,"-is-active"),checked:"".concat(e.value,"-is-checked"),current:"".concat(e.value,"-is-current"),hidden:"".concat(e.value,"-is-hidden"),visible:"".concat(e.value,"-is-visible"),expanded:"".concat(e.value,"-is-expanded"),indeterminate:"".concat(e.value,"-is-indeterminate")}})}}export{p as _,x as a,y as b,u as c,l as d,v as t,g as u};
