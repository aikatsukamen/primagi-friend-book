if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return i[e]||(r=new Promise((async r=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=r}else importScripts(e),r()}))),r.then((()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]}))},r=(r,i)=>{Promise.all(r.map(e)).then((e=>i(1===e.length?e[0]:e)))},i={require:Promise.resolve(r)};self.define=(r,o,c)=>{i[r]||(i[r]=Promise.resolve().then((()=>{let i={};const s={uri:location.origin+r.slice(1)};return Promise.all(o.map((r=>{switch(r){case"exports":return i;case"module":return s;default:return e(r)}}))).then((e=>{const r=c(...e);return i.default||(i.default=r),i}))})))}}define("./service-worker.js",["./workbox-f929b32b"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"favicon.ico",revision:"39f19d4f7e7c282c41d1c64d937e96e9"},{url:"font/NotoSansJP-Bold.otf2.woff",revision:"484ff05f9f2c0ad7e092c5321cbf79e5"},{url:"font/NotoSansJP-Regular2.woff",revision:"65dee0df720c84d2847223531e34a7ac"},{url:"img/card.png",revision:"4d03d4efee27f56c0dd3c6410d0497f8"},{url:"img/icon-accessory.jpg",revision:"fc3a7bfd37245455e12ab1f914cee468"},{url:"img/icon-bottoms.jpg",revision:"3a96eb3a68d19aab8df988d85e9afb13"},{url:"img/icon-shoes.jpg",revision:"b6f21f5072c3557a49101ce54965cdb4"},{url:"img/icon-tb.jpg",revision:"fbac6d339e060e60b374fcef76a89fc0"},{url:"img/icon-tops.jpg",revision:"c62ce273080596442030588d97cd305a"},{url:"img/img_load_err.jpg",revision:"f10e86577b492c2fc63335d2716fae10"},{url:"index.html",revision:"81ebbed5ff358a5aa1b04012e867d5ec"},{url:"logo128.png",revision:"e0cba6cedd63f80246c0165abcc0aa0e"},{url:"logo512.png",revision:"41b0e30cef0bb6dbf054fa6d3e7f3c29"},{url:"main.js",revision:"e9e642ecbe72a87536aebad6195f5243"},{url:"manifest.json",revision:"097e7682a2b6379cb61367cb1b90aa76"}],{}),e.registerRoute(/https:\/\/cdn.primagi.jp\/.*/,new e.CacheFirst({cacheName:"primagi",plugins:[new e.ExpirationPlugin({maxEntries:3e3,maxAgeSeconds:2592e3,purgeOnQuotaError:!0}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
//# sourceMappingURL=service-worker.js.map
