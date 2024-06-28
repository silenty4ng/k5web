import{f as c,d as n}from"./index.d0c9d757.js";import{c as r}from"./arco.7f845a67.js";/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function s(a,e){if(c(a)!="object"||!a)return a;var i=a[Symbol.toPrimitive];if(i!==void 0){var t=i.call(a,e||"default");if(c(t)!="object")return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(a)}function u(a){var e=s(a,"string");return c(e)=="symbol"?e:e+""}function v(a,e,i){return e=u(e),e in a?Object.defineProperty(a,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):a[e]=i,a}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function f(a){var e=n("classPrefix"),i=e.classPrefix;return r(function(){return a?"".concat(i.value,"-").concat(a):i.value})}function d(){var a=n("classPrefix"),e=a.classPrefix;return{SIZE:r(function(){return{small:"".concat(e.value,"-size-s"),medium:"".concat(e.value,"-size-m"),large:"".concat(e.value,"-size-l"),default:"",xs:"".concat(e.value,"-size-xs"),xl:"".concat(e.value,"-size-xl"),block:"".concat(e.value,"-size-full-width")}}),STATUS:r(function(){return{loading:"".concat(e.value,"-is-loading"),loadMore:"".concat(e.value,"-is-load-more"),disabled:"".concat(e.value,"-is-disabled"),focused:"".concat(e.value,"-is-focused"),success:"".concat(e.value,"-is-success"),error:"".concat(e.value,"-is-error"),warning:"".concat(e.value,"-is-warning"),selected:"".concat(e.value,"-is-selected"),active:"".concat(e.value,"-is-active"),checked:"".concat(e.value,"-is-checked"),current:"".concat(e.value,"-is-current"),hidden:"".concat(e.value,"-is-hidden"),visible:"".concat(e.value,"-is-visible"),expanded:"".concat(e.value,"-is-expanded"),indeterminate:"".concat(e.value,"-is-indeterminate")}})}}export{v as _,d as a,u as t,f as u};
