import{n as T,o as C,p as H,M as m,E as _,q as R,r as E,s as S,t as v,w as I,x as y,y as N,z as $,D as M,R as P,J as O,K as L}from"./VendorConfigurationMovie-BIxuM71E.js";import"./client-B3aq8qpT.js";const k=6e4;class x{constructor(e){this._options=e,this._requestMessageId=0,this._requestHandlers=new Map,this._requestHandlerAbortControllers=new Map,this._notificationHandlers=new Map,this._responseHandlers=new Map,this._progressHandlers=new Map,this._timeoutInfo=new Map,this.setNotificationHandler(T,r=>{const t=this._requestHandlerAbortControllers.get(r.params.requestId);t==null||t.abort(r.params.reason)}),this.setNotificationHandler(C,r=>{this._onprogress(r)}),this.setRequestHandler(H,r=>({}))}_setupTimeout(e,r,t,s,o=!1){this._timeoutInfo.set(e,{timeoutId:setTimeout(s,r),startTime:Date.now(),timeout:r,maxTotalTimeout:t,resetTimeoutOnProgress:o,onTimeout:s})}_resetTimeout(e){const r=this._timeoutInfo.get(e);if(!r)return!1;const t=Date.now()-r.startTime;if(r.maxTotalTimeout&&t>=r.maxTotalTimeout)throw this._timeoutInfo.delete(e),new m(_.RequestTimeout,"Maximum total timeout exceeded",{maxTotalTimeout:r.maxTotalTimeout,totalElapsed:t});return clearTimeout(r.timeoutId),r.timeoutId=setTimeout(r.onTimeout,r.timeout),!0}_cleanupTimeout(e){const r=this._timeoutInfo.get(e);r&&(clearTimeout(r.timeoutId),this._timeoutInfo.delete(e))}async connect(e){this._transport=e,this._transport.onclose=()=>{this._onclose()},this._transport.onerror=r=>{this._onerror(r)},this._transport.onmessage=r=>{"method"in r?"id"in r?this._onrequest(r):this._onnotification(r):this._onresponse(r)},await this._transport.start()}_onclose(){var e;const r=this._responseHandlers;this._responseHandlers=new Map,this._progressHandlers.clear(),this._transport=void 0,(e=this.onclose)===null||e===void 0||e.call(this);const t=new m(_.ConnectionClosed,"Connection closed");for(const s of r.values())s(t)}_onerror(e){var r;(r=this.onerror)===null||r===void 0||r.call(this,e)}_onnotification(e){var r;const t=(r=this._notificationHandlers.get(e.method))!==null&&r!==void 0?r:this.fallbackNotificationHandler;t!==void 0&&Promise.resolve().then(()=>t(e)).catch(s=>this._onerror(new Error(`Uncaught error in notification handler: ${s}`)))}_onrequest(e){var r,t,s;const o=(r=this._requestHandlers.get(e.method))!==null&&r!==void 0?r:this.fallbackRequestHandler;if(o===void 0){(t=this._transport)===null||t===void 0||t.send({jsonrpc:"2.0",id:e.id,error:{code:_.MethodNotFound,message:"Method not found"}}).catch(n=>this._onerror(new Error(`Failed to send an error response: ${n}`)));return}const i=new AbortController;this._requestHandlerAbortControllers.set(e.id,i);const c={signal:i.signal,sessionId:(s=this._transport)===null||s===void 0?void 0:s.sessionId};Promise.resolve().then(()=>o(e,c)).then(n=>{var l;if(!i.signal.aborted)return(l=this._transport)===null||l===void 0?void 0:l.send({result:n,jsonrpc:"2.0",id:e.id})},n=>{var l,u;if(!i.signal.aborted)return(l=this._transport)===null||l===void 0?void 0:l.send({jsonrpc:"2.0",id:e.id,error:{code:Number.isSafeInteger(n.code)?n.code:_.InternalError,message:(u=n.message)!==null&&u!==void 0?u:"Internal error"}})}).catch(n=>this._onerror(new Error(`Failed to send response: ${n}`))).finally(()=>{this._requestHandlerAbortControllers.delete(e.id)})}_onprogress(e){const{progressToken:r,...t}=e.params,s=Number(r),o=this._progressHandlers.get(s);if(!o){this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(e)}`));return}const i=this._responseHandlers.get(s),c=this._timeoutInfo.get(s);if(c&&i&&c.resetTimeoutOnProgress)try{this._resetTimeout(s)}catch(n){i(n);return}o(t)}_onresponse(e){const r=Number(e.id),t=this._responseHandlers.get(r);if(t===void 0){this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(e)}`));return}if(this._responseHandlers.delete(r),this._progressHandlers.delete(r),this._cleanupTimeout(r),"result"in e)t(e);else{const s=new m(e.error.code,e.error.message,e.error.data);t(s)}}get transport(){return this._transport}async close(){var e;await((e=this._transport)===null||e===void 0?void 0:e.close())}request(e,r,t){return new Promise((s,o)=>{var i,c,n,l,u;if(!this._transport){o(new Error("Not connected"));return}((i=this._options)===null||i===void 0?void 0:i.enforceStrictCapabilities)===!0&&this.assertCapabilityForMethod(e.method),(c=t==null?void 0:t.signal)===null||c===void 0||c.throwIfAborted();const d=this._requestMessageId++,b={...e,jsonrpc:"2.0",id:d};t!=null&&t.onprogress&&(this._progressHandlers.set(d,t.onprogress),b.params={...e.params,_meta:{progressToken:d}});const g=a=>{var h;this._responseHandlers.delete(d),this._progressHandlers.delete(d),this._cleanupTimeout(d),(h=this._transport)===null||h===void 0||h.send({jsonrpc:"2.0",method:"notifications/cancelled",params:{requestId:d,reason:String(a)}}).catch(p=>this._onerror(new Error(`Failed to send cancellation: ${p}`))),o(a)};this._responseHandlers.set(d,a=>{var h;if(!(!((h=t==null?void 0:t.signal)===null||h===void 0)&&h.aborted)){if(a instanceof Error)return o(a);try{const p=r.parse(a.result);s(p)}catch(p){o(p)}}}),(n=t==null?void 0:t.signal)===null||n===void 0||n.addEventListener("abort",()=>{var a;g((a=t==null?void 0:t.signal)===null||a===void 0?void 0:a.reason)});const w=(l=t==null?void 0:t.timeout)!==null&&l!==void 0?l:k,q=()=>g(new m(_.RequestTimeout,"Request timed out",{timeout:w}));this._setupTimeout(d,w,t==null?void 0:t.maxTotalTimeout,q,(u=t==null?void 0:t.resetTimeoutOnProgress)!==null&&u!==void 0?u:!1),this._transport.send(b).catch(a=>{this._cleanupTimeout(d),o(a)})})}async notification(e){if(!this._transport)throw new Error("Not connected");this.assertNotificationCapability(e.method);const r={...e,jsonrpc:"2.0"};await this._transport.send(r)}setRequestHandler(e,r){const t=e.shape.method.value;this.assertRequestHandlerCapability(t),this._requestHandlers.set(t,(s,o)=>Promise.resolve(r(e.parse(s),o)))}removeRequestHandler(e){this._requestHandlers.delete(e)}assertCanSetRequestHandler(e){if(this._requestHandlers.has(e))throw new Error(`A request handler for ${e} already exists, which would be overridden`)}setNotificationHandler(e,r){this._notificationHandlers.set(e.shape.method.value,t=>Promise.resolve(r(e.parse(t))))}removeNotificationHandler(e){this._notificationHandlers.delete(e)}}function A(f,e){return Object.entries(e).reduce((r,[t,s])=>(s&&typeof s=="object"?r[t]=r[t]?{...r[t],...s}:s:r[t]=s,r),{...f})}class j extends x{constructor(e,r){var t;super(r),this._clientInfo=e,this._capabilities=(t=r==null?void 0:r.capabilities)!==null&&t!==void 0?t:{}}registerCapabilities(e){if(this.transport)throw new Error("Cannot register capabilities after connecting to transport");this._capabilities=A(this._capabilities,e)}assertCapability(e,r){var t;if(!(!((t=this._serverCapabilities)===null||t===void 0)&&t[e]))throw new Error(`Server does not support ${e} (required for ${r})`)}async connect(e,r){await super.connect(e);try{const t=await this.request({method:"initialize",params:{protocolVersion:R,capabilities:this._capabilities,clientInfo:this._clientInfo}},E,r);if(t===void 0)throw new Error(`Server sent invalid initialize result: ${t}`);if(!S.includes(t.protocolVersion))throw new Error(`Server's protocol version is not supported: ${t.protocolVersion}`);this._serverCapabilities=t.capabilities,this._serverVersion=t.serverInfo,this._instructions=t.instructions,await this.notification({method:"notifications/initialized"})}catch(t){throw this.close(),t}}getServerCapabilities(){return this._serverCapabilities}getServerVersion(){return this._serverVersion}getInstructions(){return this._instructions}assertCapabilityForMethod(e){var r,t,s,o,i;switch(e){case"logging/setLevel":if(!(!((r=this._serverCapabilities)===null||r===void 0)&&r.logging))throw new Error(`Server does not support logging (required for ${e})`);break;case"prompts/get":case"prompts/list":if(!(!((t=this._serverCapabilities)===null||t===void 0)&&t.prompts))throw new Error(`Server does not support prompts (required for ${e})`);break;case"resources/list":case"resources/templates/list":case"resources/read":case"resources/subscribe":case"resources/unsubscribe":if(!(!((s=this._serverCapabilities)===null||s===void 0)&&s.resources))throw new Error(`Server does not support resources (required for ${e})`);if(e==="resources/subscribe"&&!this._serverCapabilities.resources.subscribe)throw new Error(`Server does not support resource subscriptions (required for ${e})`);break;case"tools/call":case"tools/list":if(!(!((o=this._serverCapabilities)===null||o===void 0)&&o.tools))throw new Error(`Server does not support tools (required for ${e})`);break;case"completion/complete":if(!(!((i=this._serverCapabilities)===null||i===void 0)&&i.completions))throw new Error(`Server does not support completions (required for ${e})`);break}}assertNotificationCapability(e){var r;switch(e){case"notifications/roots/list_changed":if(!(!((r=this._capabilities.roots)===null||r===void 0)&&r.listChanged))throw new Error(`Client does not support roots list changed notifications (required for ${e})`);break}}assertRequestHandlerCapability(e){switch(e){case"sampling/createMessage":if(!this._capabilities.sampling)throw new Error(`Client does not support sampling capability (required for ${e})`);break;case"roots/list":if(!this._capabilities.roots)throw new Error(`Client does not support roots capability (required for ${e})`);break}}async ping(e){return this.request({method:"ping"},v,e)}async complete(e,r){return this.request({method:"completion/complete",params:e},I,r)}async setLoggingLevel(e,r){return this.request({method:"logging/setLevel",params:{level:e}},v,r)}async getPrompt(e,r){return this.request({method:"prompts/get",params:e},y,r)}async listPrompts(e,r){return this.request({method:"prompts/list",params:e},N,r)}async listResources(e,r){return this.request({method:"resources/list",params:e},$,r)}async listResourceTemplates(e,r){return this.request({method:"resources/templates/list",params:e},M,r)}async readResource(e,r){return this.request({method:"resources/read",params:e},P,r)}async subscribeResource(e,r){return this.request({method:"resources/subscribe",params:e},v,r)}async unsubscribeResource(e,r){return this.request({method:"resources/unsubscribe",params:e},v,r)}async callTool(e,r=O,t){return this.request({method:"tools/call",params:e},r,t)}async listTools(e,r){return this.request({method:"tools/list",params:e},L,r)}async sendRootsListChanged(){return this.notification({method:"notifications/roots/list_changed"})}}export{j as Client};
