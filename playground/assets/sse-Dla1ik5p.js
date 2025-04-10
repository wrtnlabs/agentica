import{z as r,L as st,J as at}from"./types-Co05Usx1.js";class tt extends Error{constructor(t,n){super(t),this.name="ParseError",this.type=n.type,this.field=n.field,this.value=n.value,this.line=n.line}}function j(e){}function ct(e){if(typeof e=="function")throw new TypeError("`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?");const{onEvent:t=j,onError:n=j,onRetry:i=j,onComment:s}=e;let o="",a=!0,l,h="",p="";function L(d){const _=a?d.replace(/^\xEF\xBB\xBF/,""):d,[E,D]=ht(`${o}${_}`);for(const z of E)O(z);o=D,a=!1}function O(d){if(d===""){H();return}if(d.startsWith(":")){s&&s(d.slice(d.startsWith(": ")?2:1));return}const _=d.indexOf(":");if(_!==-1){const E=d.slice(0,_),D=d[_+1]===" "?2:1,z=d.slice(_+D);A(E,z,d);return}A(d,"",d)}function A(d,_,E){switch(d){case"event":p=_;break;case"data":h=`${h}${_}
`;break;case"id":l=_.includes("\0")?void 0:_;break;case"retry":/^\d+$/.test(_)?i(parseInt(_,10)):n(new tt(`Invalid \`retry\` value: "${_}"`,{type:"invalid-retry",value:_,line:E}));break;default:n(new tt(`Unknown field "${d.length>20?`${d.slice(0,20)}…`:d}"`,{type:"unknown-field",field:d,value:_,line:E}));break}}function H(){h.length>0&&t({id:l,event:p||void 0,data:h.endsWith(`
`)?h.slice(0,-1):h}),l=void 0,h="",p=""}function M(d={}){o&&d.consume&&O(o),a=!0,l=void 0,h="",p="",o=""}return{feed:L,reset:M}}function ht(e){const t=[];let n="",i=0;for(;i<e.length;){const s=e.indexOf("\r",i),o=e.indexOf(`
`,i);let a=-1;if(s!==-1&&o!==-1?a=Math.min(s,o):s!==-1?a=s:o!==-1&&(a=o),a===-1){n=e.slice(i);break}else{const l=e.slice(i,a);t.push(l),i=a+1,e[i-1]==="\r"&&e[i]===`
`&&i++}}return[t,n]}class et extends Event{constructor(t,n){var i,s;super(t),this.code=(i=n==null?void 0:n.code)!=null?i:void 0,this.message=(s=n==null?void 0:n.message)!=null?s:void 0}[Symbol.for("nodejs.util.inspect.custom")](t,n,i){return i(nt(this),n)}[Symbol.for("Deno.customInspect")](t,n){return t(nt(this),n)}}function lt(e){const t=globalThis.DOMException;return typeof t=="function"?new t(e,"SyntaxError"):new SyntaxError(e)}function F(e){return e instanceof Error?"errors"in e&&Array.isArray(e.errors)?e.errors.map(F).join(", "):"cause"in e&&e.cause instanceof Error?`${e}: ${F(e.cause)}`:e.message:`${e}`}function nt(e){return{type:e.type,message:e.message,code:e.code,defaultPrevented:e.defaultPrevented,cancelable:e.cancelable,timeStamp:e.timeStamp}}var it=e=>{throw TypeError(e)},X=(e,t,n)=>t.has(e)||it("Cannot "+n),c=(e,t,n)=>(X(e,t,"read from private field"),n?n.call(e):t.get(e)),f=(e,t,n)=>t.has(e)?it("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,n),u=(e,t,n,i)=>(X(e,t,"write to private field"),t.set(e,n),n),v=(e,t,n)=>(X(e,t,"access private method"),n),w,m,k,N,W,x,b,I,y,T,C,S,R,g,G,q,B,rt,J,Z,U,K,Q;class $ extends EventTarget{constructor(t,n){var i,s;super(),f(this,g),this.CONNECTING=0,this.OPEN=1,this.CLOSED=2,f(this,w),f(this,m),f(this,k),f(this,N),f(this,W),f(this,x),f(this,b),f(this,I,null),f(this,y),f(this,T),f(this,C,null),f(this,S,null),f(this,R,null),f(this,q,async o=>{var a;c(this,T).reset();const{body:l,redirected:h,status:p,headers:L}=o;if(p===204){v(this,g,U).call(this,"Server sent HTTP 204, not reconnecting",204),this.close();return}if(h?u(this,k,new URL(o.url)):u(this,k,void 0),p!==200){v(this,g,U).call(this,`Non-200 status code (${p})`,p);return}if(!(L.get("content-type")||"").startsWith("text/event-stream")){v(this,g,U).call(this,'Invalid content type, expected "text/event-stream"',p);return}if(c(this,w)===this.CLOSED)return;u(this,w,this.OPEN);const O=new Event("open");if((a=c(this,R))==null||a.call(this,O),this.dispatchEvent(O),typeof l!="object"||!l||!("getReader"in l)){v(this,g,U).call(this,"Invalid response body, expected a web ReadableStream",p),this.close();return}const A=new TextDecoder,H=l.getReader();let M=!0;do{const{done:d,value:_}=await H.read();_&&c(this,T).feed(A.decode(_,{stream:!d})),d&&(M=!1,c(this,T).reset(),v(this,g,K).call(this))}while(M)}),f(this,B,o=>{u(this,y,void 0),!(o.name==="AbortError"||o.type==="aborted")&&v(this,g,K).call(this,F(o))}),f(this,J,o=>{typeof o.id=="string"&&u(this,I,o.id);const a=new MessageEvent(o.event||"message",{data:o.data,origin:c(this,k)?c(this,k).origin:c(this,m).origin,lastEventId:o.id||""});c(this,S)&&(!o.event||o.event==="message")&&c(this,S).call(this,a),this.dispatchEvent(a)}),f(this,Z,o=>{u(this,x,o)}),f(this,Q,()=>{u(this,b,void 0),c(this,w)===this.CONNECTING&&v(this,g,G).call(this)});try{if(t instanceof URL)u(this,m,t);else if(typeof t=="string")u(this,m,new URL(t,dt()));else throw new Error("Invalid URL")}catch{throw lt("An invalid or illegal string was specified")}u(this,T,ct({onEvent:c(this,J),onRetry:c(this,Z)})),u(this,w,this.CONNECTING),u(this,x,3e3),u(this,W,(i=n==null?void 0:n.fetch)!=null?i:globalThis.fetch),u(this,N,(s=n==null?void 0:n.withCredentials)!=null?s:!1),v(this,g,G).call(this)}get readyState(){return c(this,w)}get url(){return c(this,m).href}get withCredentials(){return c(this,N)}get onerror(){return c(this,C)}set onerror(t){u(this,C,t)}get onmessage(){return c(this,S)}set onmessage(t){u(this,S,t)}get onopen(){return c(this,R)}set onopen(t){u(this,R,t)}addEventListener(t,n,i){const s=n;super.addEventListener(t,s,i)}removeEventListener(t,n,i){const s=n;super.removeEventListener(t,s,i)}close(){c(this,b)&&clearTimeout(c(this,b)),c(this,w)!==this.CLOSED&&(c(this,y)&&c(this,y).abort(),u(this,w,this.CLOSED),u(this,y,void 0))}}w=new WeakMap,m=new WeakMap,k=new WeakMap,N=new WeakMap,W=new WeakMap,x=new WeakMap,b=new WeakMap,I=new WeakMap,y=new WeakMap,T=new WeakMap,C=new WeakMap,S=new WeakMap,R=new WeakMap,g=new WeakSet,G=function(){u(this,w,this.CONNECTING),u(this,y,new AbortController),c(this,W)(c(this,m),v(this,g,rt).call(this)).then(c(this,q)).catch(c(this,B))},q=new WeakMap,B=new WeakMap,rt=function(){var e;const t={mode:"cors",redirect:"follow",headers:{Accept:"text/event-stream",...c(this,I)?{"Last-Event-ID":c(this,I)}:void 0},cache:"no-store",signal:(e=c(this,y))==null?void 0:e.signal};return"window"in globalThis&&(t.credentials=this.withCredentials?"include":"same-origin"),t},J=new WeakMap,Z=new WeakMap,U=function(e,t){var n;c(this,w)!==this.CLOSED&&u(this,w,this.CLOSED);const i=new et("error",{code:t,message:e});(n=c(this,C))==null||n.call(this,i),this.dispatchEvent(i)},K=function(e,t){var n;if(c(this,w)===this.CLOSED)return;u(this,w,this.CONNECTING);const i=new et("error",{code:t,message:e});(n=c(this,C))==null||n.call(this,i),this.dispatchEvent(i),u(this,b,setTimeout(c(this,Q),c(this,x)))},Q=new WeakMap,$.CONNECTING=0,$.OPEN=1,$.CLOSED=2;function dt(){const e="document"in globalThis?globalThis.document:void 0;return e&&typeof e=="object"&&"baseURI"in e&&typeof e.baseURI=="string"?e.baseURI:void 0}let Y;Y=globalThis.crypto;async function ut(e){return(await Y).getRandomValues(new Uint8Array(e))}async function pt(e){const t="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";let n="";const i=await ut(e);for(let s=0;s<e;s++){const o=i[s]%t.length;n+=t[o]}return n}async function _t(e){return await pt(e)}async function ft(e){const t=await(await Y).subtle.digest("SHA-256",new TextEncoder().encode(e));return btoa(String.fromCharCode(...new Uint8Array(t))).replace(/\//g,"_").replace(/\+/g,"-").replace(/=/g,"")}async function wt(e){if(e||(e=43),e<43||e>128)throw`Expected a length between 43 and 128. Received ${e}.`;const t=await _t(e),n=await ft(t);return{code_verifier:t,code_challenge:n}}const gt=r.object({issuer:r.string(),authorization_endpoint:r.string(),token_endpoint:r.string(),registration_endpoint:r.string().optional(),scopes_supported:r.array(r.string()).optional(),response_types_supported:r.array(r.string()),response_modes_supported:r.array(r.string()).optional(),grant_types_supported:r.array(r.string()).optional(),token_endpoint_auth_methods_supported:r.array(r.string()).optional(),token_endpoint_auth_signing_alg_values_supported:r.array(r.string()).optional(),service_documentation:r.string().optional(),revocation_endpoint:r.string().optional(),revocation_endpoint_auth_methods_supported:r.array(r.string()).optional(),revocation_endpoint_auth_signing_alg_values_supported:r.array(r.string()).optional(),introspection_endpoint:r.string().optional(),introspection_endpoint_auth_methods_supported:r.array(r.string()).optional(),introspection_endpoint_auth_signing_alg_values_supported:r.array(r.string()).optional(),code_challenge_methods_supported:r.array(r.string()).optional()}).passthrough(),ot=r.object({access_token:r.string(),token_type:r.string(),expires_in:r.number().optional(),scope:r.string().optional(),refresh_token:r.string().optional()}).strip();r.object({error:r.string(),error_description:r.string().optional(),error_uri:r.string().optional()});const vt=r.object({redirect_uris:r.array(r.string()).refine(e=>e.every(t=>URL.canParse(t)),{message:"redirect_uris must contain valid URLs"}),token_endpoint_auth_method:r.string().optional(),grant_types:r.array(r.string()).optional(),response_types:r.array(r.string()).optional(),client_name:r.string().optional(),client_uri:r.string().optional(),logo_uri:r.string().optional(),scope:r.string().optional(),contacts:r.array(r.string()).optional(),tos_uri:r.string().optional(),policy_uri:r.string().optional(),jwks_uri:r.string().optional(),jwks:r.any().optional(),software_id:r.string().optional(),software_version:r.string().optional()}).strip(),yt=r.object({client_id:r.string(),client_secret:r.string().optional(),client_id_issued_at:r.number().optional(),client_secret_expires_at:r.number().optional()}).strip(),mt=vt.merge(yt);r.object({error:r.string(),error_description:r.string().optional()}).strip();r.object({token:r.string(),token_type_hint:r.string().optional()}).strip();class P extends Error{constructor(t){super(t??"Unauthorized")}}async function V(e,{serverUrl:t,authorizationCode:n}){const i=await Et(t);let s=await Promise.resolve(e.clientInformation());if(!s){if(n!==void 0)throw new Error("Existing OAuth client information is required when exchanging an authorization code");if(!e.saveClientInformation)throw new Error("OAuth client information must be saveable for dynamic registration");const h=await bt(t,{metadata:i,clientMetadata:e.clientMetadata});await e.saveClientInformation(h),s=h}if(n!==void 0){const h=await e.codeVerifier(),p=await Tt(t,{metadata:i,clientInformation:s,authorizationCode:n,codeVerifier:h,redirectUri:e.redirectUrl});return await e.saveTokens(p),"AUTHORIZED"}const o=await e.tokens();if(o!=null&&o.refresh_token)try{const h=await St(t,{metadata:i,clientInformation:s,refreshToken:o.refresh_token});return await e.saveTokens(h),"AUTHORIZED"}catch(h){console.error("Could not refresh OAuth tokens:",h)}const{authorizationUrl:a,codeVerifier:l}=await kt(t,{metadata:i,clientInformation:s,redirectUrl:e.redirectUrl});return await e.saveCodeVerifier(l),await e.redirectToAuthorization(a),"REDIRECT"}async function Et(e,t){var n;const i=new URL("/.well-known/oauth-authorization-server",e);let s;try{s=await fetch(i,{headers:{"MCP-Protocol-Version":(n=t==null?void 0:t.protocolVersion)!==null&&n!==void 0?n:st}})}catch(o){if(o instanceof TypeError)s=await fetch(i);else throw o}if(s.status!==404){if(!s.ok)throw new Error(`HTTP ${s.status} trying to load well-known OAuth metadata`);return gt.parse(await s.json())}}async function kt(e,{metadata:t,clientInformation:n,redirectUrl:i}){const s="code",o="S256";let a;if(t){if(a=new URL(t.authorization_endpoint),!t.response_types_supported.includes(s))throw new Error(`Incompatible auth server: does not support response type ${s}`);if(!t.code_challenge_methods_supported||!t.code_challenge_methods_supported.includes(o))throw new Error(`Incompatible auth server: does not support code challenge method ${o}`)}else a=new URL("/authorize",e);const l=await wt(),h=l.code_verifier,p=l.code_challenge;return a.searchParams.set("response_type",s),a.searchParams.set("client_id",n.client_id),a.searchParams.set("code_challenge",p),a.searchParams.set("code_challenge_method",o),a.searchParams.set("redirect_uri",String(i)),{authorizationUrl:a,codeVerifier:h}}async function Tt(e,{metadata:t,clientInformation:n,authorizationCode:i,codeVerifier:s,redirectUri:o}){const a="authorization_code";let l;if(t){if(l=new URL(t.token_endpoint),t.grant_types_supported&&!t.grant_types_supported.includes(a))throw new Error(`Incompatible auth server: does not support grant type ${a}`)}else l=new URL("/token",e);const h=new URLSearchParams({grant_type:a,client_id:n.client_id,code:i,code_verifier:s,redirect_uri:String(o)});n.client_secret&&h.set("client_secret",n.client_secret);const p=await fetch(l,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:h});if(!p.ok)throw new Error(`Token exchange failed: HTTP ${p.status}`);return ot.parse(await p.json())}async function St(e,{metadata:t,clientInformation:n,refreshToken:i}){const s="refresh_token";let o;if(t){if(o=new URL(t.token_endpoint),t.grant_types_supported&&!t.grant_types_supported.includes(s))throw new Error(`Incompatible auth server: does not support grant type ${s}`)}else o=new URL("/token",e);const a=new URLSearchParams({grant_type:s,client_id:n.client_id,refresh_token:i});n.client_secret&&a.set("client_secret",n.client_secret);const l=await fetch(o,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:a});if(!l.ok)throw new Error(`Token refresh failed: HTTP ${l.status}`);return ot.parse(await l.json())}async function bt(e,{metadata:t,clientMetadata:n}){let i;if(t){if(!t.registration_endpoint)throw new Error("Incompatible auth server: does not support dynamic client registration");i=new URL(t.registration_endpoint)}else i=new URL("/register",e);const s=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!s.ok)throw new Error(`Dynamic client registration failed: HTTP ${s.status}`);return mt.parse(await s.json())}class Ct extends Error{constructor(t,n,i){super(`SSE error: ${n}`),this.code=t,this.event=i}}class Pt{constructor(t,n){this._url=t,this._eventSourceInit=n==null?void 0:n.eventSourceInit,this._requestInit=n==null?void 0:n.requestInit,this._authProvider=n==null?void 0:n.authProvider}async _authThenStart(){var t;if(!this._authProvider)throw new P("No auth provider");let n;try{n=await V(this._authProvider,{serverUrl:this._url})}catch(i){throw(t=this.onerror)===null||t===void 0||t.call(this,i),i}if(n!=="AUTHORIZED")throw new P;return await this._startOrAuth()}async _commonHeaders(){const t={};if(this._authProvider){const n=await this._authProvider.tokens();n&&(t.Authorization=`Bearer ${n.access_token}`)}return t}_startOrAuth(){return new Promise((t,n)=>{var i;this._eventSource=new $(this._url.href,(i=this._eventSourceInit)!==null&&i!==void 0?i:{fetch:(s,o)=>this._commonHeaders().then(a=>fetch(s,{...o,headers:{...a,Accept:"text/event-stream"}}))}),this._abortController=new AbortController,this._eventSource.onerror=s=>{var o;if(s.code===401&&this._authProvider){this._authThenStart().then(t,n);return}const a=new Ct(s.code,s.message,s);n(a),(o=this.onerror)===null||o===void 0||o.call(this,a)},this._eventSource.onopen=()=>{},this._eventSource.addEventListener("endpoint",s=>{var o;const a=s;try{if(this._endpoint=new URL(a.data,this._url),this._endpoint.origin!==this._url.origin)throw new Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`)}catch(l){n(l),(o=this.onerror)===null||o===void 0||o.call(this,l),this.close();return}t()}),this._eventSource.onmessage=s=>{var o,a;const l=s;let h;try{h=at.parse(JSON.parse(l.data))}catch(p){(o=this.onerror)===null||o===void 0||o.call(this,p);return}(a=this.onmessage)===null||a===void 0||a.call(this,h)}})}async start(){if(this._eventSource)throw new Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");return await this._startOrAuth()}async finishAuth(t){if(!this._authProvider)throw new P("No auth provider");if(await V(this._authProvider,{serverUrl:this._url,authorizationCode:t})!=="AUTHORIZED")throw new P("Failed to authorize")}async close(){var t,n,i;(t=this._abortController)===null||t===void 0||t.abort(),(n=this._eventSource)===null||n===void 0||n.close(),(i=this.onclose)===null||i===void 0||i.call(this)}async send(t){var n,i,s;if(!this._endpoint)throw new Error("Not connected");try{const o=await this._commonHeaders(),a=new Headers({...o,...(n=this._requestInit)===null||n===void 0?void 0:n.headers});a.set("content-type","application/json");const l={...this._requestInit,method:"POST",headers:a,body:JSON.stringify(t),signal:(i=this._abortController)===null||i===void 0?void 0:i.signal},h=await fetch(this._endpoint,l);if(!h.ok){if(h.status===401&&this._authProvider){if(await V(this._authProvider,{serverUrl:this._url})!=="AUTHORIZED")throw new P;return this.send(t)}const p=await h.text().catch(()=>null);throw new Error(`Error POSTing to endpoint (HTTP ${h.status}): ${p}`)}}catch(o){throw(s=this.onerror)===null||s===void 0||s.call(this,o),o}}}export{Pt as SSEClientTransport,Ct as SseError};
