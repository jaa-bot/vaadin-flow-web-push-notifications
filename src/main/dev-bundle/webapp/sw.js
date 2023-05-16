try{self["workbox:core:6.5.3"]&&_()}catch{}const W=(n,...e)=>{let t=n;return e.length>0&&(t+=` :: ${JSON.stringify(e)}`),t},D=W;class l extends Error{constructor(e,t){const s=D(e,t);super(s),this.name=e,this.details=t}}const j=new Set,f={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:typeof registration<"u"?registration.scope:""},k=n=>[f.prefix,n,f.suffix].filter(e=>e&&e.length>0).join("-"),F=n=>{for(const e of Object.keys(f))n(e)},P={updateDetails:n=>{F(e=>{typeof n[e]=="string"&&(f[e]=n[e])})},getGoogleAnalyticsName:n=>n||k(f.googleAnalytics),getPrecacheName:n=>n||k(f.precache),getPrefix:()=>f.prefix,getRuntimeName:n=>n||k(f.runtime),getSuffix:()=>f.suffix};function N(n,e){const t=new URL(n);for(const s of e)t.searchParams.delete(s);return t.href}async function q(n,e,t,s){const r=N(e.url,t);if(e.url===r)return n.match(e,s);const a=Object.assign(Object.assign({},s),{ignoreSearch:!0}),i=await n.keys(e,a);for(const c of i){const o=N(c.url,t);if(r===o)return n.match(c,s)}}let w;function H(){if(w===void 0){const n=new Response("");if("body"in n)try{new Response(n.body),w=!0}catch{w=!1}w=!1}return w}class V{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}async function B(){for(const n of j)await n()}const $=n=>new URL(String(n),location.href).href.replace(new RegExp(`^${location.origin}`),"");function O(n){return new Promise(e=>setTimeout(e,n))}function E(n,e){const t=e();return n.waitUntil(t),t}async function G(n,e){let t=null;if(n.url&&(t=new URL(n.url).origin),t!==self.location.origin)throw new l("cross-origin-copy-response",{origin:t});const s=n.clone(),r={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},a=e?e(r):r,i=H()?s.body:await s.blob();return new Response(i,a)}function Q(){self.addEventListener("activate",()=>self.clients.claim())}try{self["workbox:precaching:6.5.3"]&&_()}catch{}const z="__WB_REVISION__";function J(n){if(!n)throw new l("add-to-cache-list-unexpected-type",{entry:n});if(typeof n=="string"){const a=new URL(n,location.href);return{cacheKey:a.href,url:a.href}}const{revision:e,url:t}=n;if(!t)throw new l("add-to-cache-list-unexpected-type",{entry:n});if(!e){const a=new URL(t,location.href);return{cacheKey:a.href,url:a.href}}const s=new URL(t,location.href),r=new URL(t,location.href);return s.searchParams.set(z,e),{cacheKey:s.href,url:r.href}}class X{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if(e.type==="install"&&t&&t.originalRequest&&t.originalRequest instanceof Request){const r=t.originalRequest.url;s?this.notUpdatedURLs.push(r):this.updatedURLs.push(r)}return s}}}class Y{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:t,params:s})=>{const r=(s==null?void 0:s.cacheKey)||this._precacheController.getCacheKeyForURL(t.url);return r?new Request(r,{headers:t.headers}):t},this._precacheController=e}}try{self["workbox:strategies:6.5.3"]&&_()}catch{}function m(n){return typeof n=="string"?new Request(n):n}class Z{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new V,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const s of this._plugins)this._pluginStateMap.set(s,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:t}=this;let s=m(e);if(s.mode==="navigate"&&t instanceof FetchEvent&&t.preloadResponse){const i=await t.preloadResponse;if(i)return i}const r=this.hasCallback("fetchDidFail")?s.clone():null;try{for(const i of this.iterateCallbacks("requestWillFetch"))s=await i({request:s.clone(),event:t})}catch(i){if(i instanceof Error)throw new l("plugin-error-request-will-fetch",{thrownErrorMessage:i.message})}const a=s.clone();try{let i;i=await fetch(s,s.mode==="navigate"?void 0:this._strategy.fetchOptions);for(const c of this.iterateCallbacks("fetchDidSucceed"))i=await c({event:t,request:a,response:i});return i}catch(i){throw r&&await this.runCallbacks("fetchDidFail",{error:i,event:t,originalRequest:r.clone(),request:a.clone()}),i}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=m(e);let s;const{cacheName:r,matchOptions:a}=this._strategy,i=await this.getCacheKey(t,"read"),c=Object.assign(Object.assign({},a),{cacheName:r});s=await caches.match(i,c);for(const o of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await o({cacheName:r,matchOptions:a,cachedResponse:s,request:i,event:this.event})||void 0;return s}async cachePut(e,t){const s=m(e);await O(0);const r=await this.getCacheKey(s,"write");if(!t)throw new l("cache-put-with-no-response",{url:$(r.url)});const a=await this._ensureResponseSafeToCache(t);if(!a)return!1;const{cacheName:i,matchOptions:c}=this._strategy,o=await self.caches.open(i),h=this.hasCallback("cacheDidUpdate"),g=h?await q(o,r.clone(),["__WB_REVISION__"],c):null;try{await o.put(r,h?a.clone():a)}catch(u){if(u instanceof Error)throw u.name==="QuotaExceededError"&&await B(),u}for(const u of this.iterateCallbacks("cacheDidUpdate"))await u({cacheName:i,oldResponse:g,newResponse:a.clone(),request:r,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let r=e;for(const a of this.iterateCallbacks("cacheKeyWillBeUsed"))r=m(await a({mode:t,request:r,event:this.event,params:this.params}));this._cacheKeys[s]=r}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if(typeof t[e]=="function"){const s=this._pluginStateMap.get(t);yield a=>{const i=Object.assign(Object.assign({},a),{state:s});return t[e](i)}}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const r of this.iterateCallbacks("cacheWillUpdate"))if(t=await r({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&t.status!==200&&(t=void 0),t}}class T{constructor(e={}){this.cacheName=P.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s=typeof e.request=="string"?new Request(e.request):e.request,r="params"in e?e.params:void 0,a=new Z(this,{event:t,request:s,params:r}),i=this._getResponse(a,s,t),c=this._awaitComplete(i,a,s,t);return[i,c]}async _getResponse(e,t,s){await e.runCallbacks("handlerWillStart",{event:s,request:t});let r;try{if(r=await this._handle(t,e),!r||r.type==="error")throw new l("no-response",{url:t.url})}catch(a){if(a instanceof Error){for(const i of e.iterateCallbacks("handlerDidError"))if(r=await i({error:a,event:s,request:t}),r)break}if(!r)throw a}for(const a of e.iterateCallbacks("handlerWillRespond"))r=await a({event:s,request:t,response:r});return r}async _awaitComplete(e,t,s,r){let a,i;try{a=await e}catch{}try{await t.runCallbacks("handlerDidRespond",{event:r,request:s,response:a}),await t.doneWaiting()}catch(c){c instanceof Error&&(i=c)}if(await t.runCallbacks("handlerDidComplete",{event:r,request:s,response:a,error:i}),t.destroy(),i)throw i}}class d extends T{constructor(e={}){e.cacheName=P.getPrecacheName(e.cacheName),super(e),this._fallbackToNetwork=e.fallbackToNetwork!==!1,this.plugins.push(d.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&t.event.type==="install"?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let s;const r=t.params||{};if(this._fallbackToNetwork){const a=r.integrity,i=e.integrity,c=!i||i===a;s=await t.fetch(new Request(e,{integrity:e.mode!=="no-cors"?i||a:void 0})),a&&c&&e.mode!=="no-cors"&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,s.clone()))}else throw new l("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return s}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();const s=await t.fetch(e);if(!await t.cachePut(e,s.clone()))throw new l("bad-precaching-response",{url:e.url,status:s.status});return s}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,r]of this.plugins.entries())r!==d.copyRedirectedCacheableResponsesPlugin&&(r===d.defaultPrecacheCacheabilityPlugin&&(e=s),r.cacheWillUpdate&&t++);t===0?this.plugins.push(d.defaultPrecacheCacheabilityPlugin):t>1&&e!==null&&this.plugins.splice(e,1)}}d.defaultPrecacheCacheabilityPlugin={async cacheWillUpdate({response:n}){return!n||n.status>=400?null:n}};d.copyRedirectedCacheableResponsesPlugin={async cacheWillUpdate({response:n}){return n.redirected?await G(n):n}};class ee{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new d({cacheName:P.getPrecacheName(e),plugins:[...t,new Y({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const t=[];for(const s of e){typeof s=="string"?t.push(s):s&&s.revision===void 0&&t.push(s.url);const{cacheKey:r,url:a}=J(s),i=typeof s!="string"&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(a)&&this._urlsToCacheKeys.get(a)!==r)throw new l("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(a),secondEntry:r});if(typeof s!="string"&&s.integrity){if(this._cacheKeysToIntegrities.has(r)&&this._cacheKeysToIntegrities.get(r)!==s.integrity)throw new l("add-to-cache-list-conflicting-integrities",{url:a});this._cacheKeysToIntegrities.set(r,s.integrity)}if(this._urlsToCacheKeys.set(a,r),this._urlsToCacheModes.set(a,i),t.length>0){const c=`Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(c)}}}install(e){return E(e,async()=>{const t=new X;this.strategy.plugins.push(t);for(const[a,i]of this._urlsToCacheKeys){const c=this._cacheKeysToIntegrities.get(i),o=this._urlsToCacheModes.get(a),h=new Request(a,{integrity:c,cache:o,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:i},request:h,event:e}))}const{updatedURLs:s,notUpdatedURLs:r}=t;return{updatedURLs:s,notUpdatedURLs:r}})}activate(e){return E(e,async()=>{const t=await self.caches.open(this.strategy.cacheName),s=await t.keys(),r=new Set(this._urlsToCacheKeys.values()),a=[];for(const i of s)r.has(i.url)||(await t.delete(i),a.push(i.url));return{deletedURLs:a}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(e){const t=this.getCacheKeyForURL(e);if(!t)throw new l("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=Object.assign({cacheKey:t},s.params),this.strategy.handle(s))}}let U;const b=()=>(U||(U=new ee),U);try{self["workbox:routing:6.5.3"]&&_()}catch{}const I="GET",R=n=>n&&typeof n=="object"?n:{handle:n};class p{constructor(e,t,s=I){this.handler=R(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=R(e)}}class te extends p{constructor(e,t,s){const r=({url:a})=>{const i=e.exec(a.href);if(i&&!(a.origin!==location.origin&&i.index!==0))return i.slice(1)};super(r,t,s)}}class se{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&e.data.type==="CACHE_URLS"){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(r=>{typeof r=="string"&&(r=[r]);const a=new Request(...r);return this.handleRequest({request:a,event:e})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const r=s.origin===location.origin,{params:a,route:i}=this.findMatchingRoute({event:t,request:e,sameOrigin:r,url:s});let c=i&&i.handler;const o=e.method;if(!c&&this._defaultHandlerMap.has(o)&&(c=this._defaultHandlerMap.get(o)),!c)return;let h;try{h=c.handle({url:s,request:e,event:t,params:a})}catch(u){h=Promise.reject(u)}const g=i&&i.catchHandler;return h instanceof Promise&&(this._catchHandler||g)&&(h=h.catch(async u=>{if(g)try{return await g.handle({url:s,request:e,event:t,params:a})}catch(K){K instanceof Error&&(u=K)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw u})),h}findMatchingRoute({url:e,sameOrigin:t,request:s,event:r}){const a=this._routes.get(s.method)||[];for(const i of a){let c;const o=i.match({url:e,sameOrigin:t,request:s,event:r});if(o)return c=o,(Array.isArray(c)&&c.length===0||o.constructor===Object&&Object.keys(o).length===0||typeof o=="boolean")&&(c=void 0),{route:i,params:c}}return{}}setDefaultHandler(e,t=I){this._defaultHandlerMap.set(t,R(e))}setCatchHandler(e){this._catchHandler=R(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new l("unregister-route-but-not-found-with-method",{method:e.method});const t=this._routes.get(e.method).indexOf(e);if(t>-1)this._routes.get(e.method).splice(t,1);else throw new l("unregister-route-route-not-registered")}}let y;const ne=()=>(y||(y=new se,y.addFetchListener(),y.addCacheListener()),y);function M(n,e,t){let s;if(typeof n=="string"){const a=new URL(n,location.href),i=({url:c})=>c.href===a.href;s=new p(i,e,t)}else if(n instanceof RegExp)s=new te(n,e,t);else if(typeof n=="function")s=new p(n,e,t);else if(n instanceof p)s=n;else throw new l("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});return ne().registerRoute(s),s}function re(n,e=[]){for(const t of[...n.searchParams.keys()])e.some(s=>s.test(t))&&n.searchParams.delete(t);return n}function*ae(n,{ignoreURLParametersMatching:e=[/^utm_/,/^fbclid$/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:r}={}){const a=new URL(n,location.href);a.hash="",yield a.href;const i=re(a,e);if(yield i.href,t&&i.pathname.endsWith("/")){const c=new URL(i.href);c.pathname+=t,yield c.href}if(s){const c=new URL(i.href);c.pathname+=".html",yield c.href}if(r){const c=r({url:a});for(const o of c)yield o.href}}class ie extends p{constructor(e,t){const s=({request:r})=>{const a=e.getURLsToCacheKeys();for(const i of ae(r.url,t)){const c=a.get(i);if(c){const o=e.getIntegrityForCacheKey(c);return{cacheKey:c,integrity:o}}}};super(s,e.strategy)}}function ce(n){const e=b(),t=new ie(e,n);M(t)}function v(n){return b().getCacheKeyForURL(n)}function x(n){return b().matchPrecache(n)}function oe(n){b().precache(n)}function le(n,e){oe(n),ce(e)}class he extends p{constructor(e,{allowlist:t=[/./],denylist:s=[]}={}){super(r=>this._match(r),e),this._allowlist=t,this._denylist=s}_match({url:e,request:t}){if(t&&t.mode!=="navigate")return!1;const s=e.pathname+e.search;for(const r of this._denylist)if(r.test(s))return!1;return!!this._allowlist.some(r=>r.test(s))}}const ue={cacheWillUpdate:async({response:n})=>n.status===200||n.status===0?n:null};class fe extends T{constructor(e={}){super(e),this.plugins.some(t=>"cacheWillUpdate"in t)||this.plugins.unshift(ue),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){const s=[],r=[];let a;if(this._networkTimeoutSeconds){const{id:o,promise:h}=this._getTimeoutPromise({request:e,logs:s,handler:t});a=o,r.push(h)}const i=this._getNetworkPromise({timeoutId:a,request:e,logs:s,handler:t});r.push(i);const c=await t.waitUntil((async()=>await t.waitUntil(Promise.race(r))||await i)());if(!c)throw new l("no-response",{url:e.url});return c}_getTimeoutPromise({request:e,logs:t,handler:s}){let r;return{promise:new Promise(i=>{r=setTimeout(async()=>{i(await s.cacheMatch(e))},this._networkTimeoutSeconds*1e3)}),id:r}}async _getNetworkPromise({timeoutId:e,request:t,logs:s,handler:r}){let a,i;try{i=await r.fetchAndCachePut(t)}catch(c){c instanceof Error&&(a=c)}return e&&clearTimeout(e),(a||!i)&&(i=await r.cacheMatch(t)),i}}class de extends T{constructor(e={}){super(e),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let s,r;try{const a=[t.fetch(e)];if(this._networkTimeoutSeconds){const i=O(this._networkTimeoutSeconds*1e3);a.push(i)}if(r=await Promise.race(a),!r)throw new Error(`Timed out the network response after ${this._networkTimeoutSeconds} seconds.`)}catch(a){a instanceof Error&&(s=a)}if(!r)throw new l("no-response",{url:e.url,error:s});return r}}importScripts("sw-runtime-resources-precache.js");self.skipWaiting();Q();let C=[{url:".",revision:"aea71d732accea5510e67c94dac60106"},{url:"VAADIN/build/component-picker-19f78778.js",revision:"6b29ff950e55f671b7504bdb04e0bfa8"},{url:"VAADIN/build/custom-element-73470d87.js",revision:"2270326cccb541a14f5c5c8652189a59"},{url:"VAADIN/build/FlowBootstrap-feff2646.js",revision:"86c7b60228bd60b898bd22f12bb25dd6"},{url:"VAADIN/build/FlowClient-e0ae8105.js",revision:"13e03ad4a52f97667815473c7dfdffcb"},{url:"VAADIN/build/generated-flow-imports-f33ff66a.js",revision:"70b6d3db8800292c2de213400d916c49"},{url:"VAADIN/build/indexhtml-85137d32.js",revision:"a704c1a703c190a6e44b027cec5b6e2b"}],pe=C.findIndex(n=>n.url===".")>=0;var A;(A=self.additionalManifestEntries)!=null&&A.length&&C.push(...self.additionalManifestEntries.filter(n=>n.url!=="."||!pe));const ge=".",we=new URL(self.registration.scope);async function ye(n){const e=await n.text();return new Response(e.replace(/<base\s+href=[^>]*>/,`<base href="${self.registration.scope}">`),n)}function me(n){return C.some(e=>v(e.url)===v(`${n}`))}let L=!1;function S(){return{async fetchDidFail(){L=!0},async fetchDidSucceed({response:n}){return L=!1,n}}}const Re=new de({plugins:[S()]});new fe({plugins:[S()]});M(new he(async n=>{async function e(){const s=await x(ge);return s?ye(s):void 0}function t(){return n.url.pathname===we.pathname?e():me(n.url)?x(n.request):e()}if(!self.navigator.onLine){const s=await t();if(s)return s}try{return await Re.handle(n)}catch(s){const r=await t();if(r)return r;throw s}}));le(C);self.addEventListener("message",n=>{var e;typeof n.data!="object"||!("method"in n.data)||n.data.method==="Vaadin.ServiceWorker.isConnectionLost"&&"id"in n.data&&((e=n.source)==null||e.postMessage({id:n.data.id,result:L},[]))});self.addEventListener("push",n=>{var t;const e=(t=n.data)==null?void 0:t.json();e&&self.registration.showNotification(e.title,{body:e.body})});self.addEventListener("notificationclick",n=>{n.notification.close(),n.waitUntil(be())});async function be(){const n=new URL("/",self.location.origin).href,t=(await self.clients.matchAll({type:"window"})).find(s=>s.url===n);return t?t.focus():self.clients.openWindow(n)}