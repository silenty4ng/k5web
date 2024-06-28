/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function n(r,e){(e==null||e>r.length)&&(e=r.length);for(var t=0,a=new Array(e);t<e;t++)a[t]=r[t];return a}function o(r,e){if(!!r){if(typeof r=="string")return n(r,e);var t=Object.prototype.toString.call(r).slice(8,-1);if(t==="Object"&&r.constructor&&(t=r.constructor.name),t==="Map"||t==="Set")return Array.from(r);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return n(r,e)}}/**
 * tdesign v1.9.4
 * (c) 2024 tdesign
 * @license MIT
 */function u(r){if(Array.isArray(r))return n(r)}function i(r){if(typeof Symbol<"u"&&r[Symbol.iterator]!=null||r["@@iterator"]!=null)return Array.from(r)}function f(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function y(r){return u(r)||i(r)||o(r)||f()}export{y as _,o as a,i as b};
