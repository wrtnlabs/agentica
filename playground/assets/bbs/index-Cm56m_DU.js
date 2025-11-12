import{j as m,o as j,r as b,T as g}from"../client-B3aq8qpT.js";import{q as T,t as _,r as v,s as x,w as $,x as P,y as U,z as R,E as F,v as k,d as M,_ as y,V as w,c as S,F as q,T as D,B as O}from"../VendorConfigurationMovie-RyNqJgVh.js";import{D as L}from"../Divider-DX1xhf0M.js";class I{constructor(o){this.props=o,this.operations_=T.compose({controllers:o.controllers,config:o.config}),this.histories_=(o.histories??[]).map(s=>_({operations:this.operations_.group,history:s})),this.token_usage_=this.props.tokenUsage!==void 0?this.props.tokenUsage instanceof v?this.props.tokenUsage:new v(this.props.tokenUsage):v.zero(),this.listeners_=new Map,this.semaphore_=o.vendor.semaphore!=null?typeof o.vendor.semaphore=="object"?o.vendor.semaphore:new x(o.vendor.semaphore):null}clone(){var o;return new I({...this.props,histories:(o=this.props.histories)==null?void 0:o.slice()})}async conversate(o,s={}){var i,n,f,C;const l=[],c=async h=>{try{await this.dispatch(h),"toHistory"in h&&("join"in h?l.push(async()=>(await h.join(),h.toHistory())):l.push(async()=>h.toHistory()))}catch{}},a=$({contents:Array.isArray(o)?o:typeof o=="string"?[{type:"text",text:o}]:[o]});c(a).catch(()=>{});const r=this.getContext({prompt:a,dispatch:c,usage:this.token_usage_,abortSignal:s.abortSignal}),e=await P(r,this.operations_.array);e.length&&((n=(i=this.props.config)==null?void 0:i.executor)==null?void 0:n.describe)!==null&&((C=(f=this.props.config)==null?void 0:f.executor)==null?void 0:C.describe)!==!1&&await U(r,e);const t=await Promise.all(l.map(async h=>h()));return this.histories_.push(...t),t}getConfig(){return this.props.config}getVendor(){return this.props.vendor}getOperations(){return this.operations_.array}getControllers(){return this.props.controllers}getHistories(){return this.histories_}getTokenUsage(){return this.token_usage_}getContext(o){const s=R({vendor:this.props.vendor,config:this.props.config,dispatch:o.dispatch,abortSignal:o.abortSignal,usage:this.token_usage_});return{operations:this.operations_,config:this.props.config,histories:this.histories_,prompt:o.prompt,dispatch:o.dispatch,request:this.semaphore_===null?s:async(l,c)=>{await this.semaphore_.acquire();try{return await s(l,c)}finally{this.semaphore_.release().catch(()=>{})}}}}on(o,s){return F(this.listeners_,o,()=>new Set).add(s),this}off(o,s){const l=this.listeners_.get(o);return l!==void 0&&(l.delete(s),l.size===0&&this.listeners_.delete(o)),this}async dispatch(o){const s=this.listeners_.get(o.type);s!==void 0&&await Promise.all(Array.from(s).map(async l=>{try{await l(o)}catch{}}))}}var B={};Object.defineProperty(B,"__esModule",{value:!0});var u=B._isFormatUri=void 0;const E=d=>z.test(d)&&K.test(d);u=B._isFormatUri=E;const z=/\/|:/,K=/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;var A={};Object.defineProperty(A,"__esModule",{value:!0});var p=A._isFormatUuid=void 0;const N=d=>W.test(d);p=A._isFormatUuid=N;const W=/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;class G{constructor(){this.articles=[]}index(){return this.articles}create(o){const s={id:k(),title:o.input.title,body:o.input.body,thumbnail:o.input.thumbnail,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};return this.articles.push(s),s}update(o){const s=this.articles.find(l=>l.id===o.id);if(s===void 0)throw new Error("Unable to find the matched article.");o.input.title!==void 0&&(s.title=o.input.title),o.input.body!==void 0&&(s.body=o.input.body),o.input.thumbnail!==void 0&&(s.thumbnail=o.input.thumbnail),s.updated_at=new Date().toISOString()}erase(o){const s=this.articles.findIndex(l=>l.id===o.id);if(s===-1)throw new Error("Unable to find the matched article.");this.articles.splice(s,1)}}const H={chatgpt:{model:"chatgpt",options:{reference:!0,strict:!1,separate:null},functions:[{name:"index",parameters:{type:"object",properties:{},additionalProperties:!1,required:[],$defs:{IBbsArticle:{description:"Article entity.\n\n`IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).",type:"object",properties:{id:{description:`Primary Key.


@format uuid`,type:"string"},created_at:{description:`Creation time of the article.


@format date-time`,type:"string"},updated_at:{description:`Last updated time of the article.


@format date-time`,type:"string"},title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",description:`@format uri
@contentMediaType image/*`}]}},required:["id","created_at","updated_at","title","body","thumbnail"]}}},output:{type:"array",items:{$ref:"#/$defs/IBbsArticle"}},description:`Get all articles.

List up every articles archived in the BBS DB.`,validate:d=>({success:!0,data:d})},{name:"create",parameters:{description:" Properties of create function",type:"object",properties:{input:{description:"Information of the article to create",$ref:"#/$defs/IBbsArticle.ICreate"}},required:["input"],additionalProperties:!1,$defs:{"IBbsArticle.ICreate":{description:"Information of the article to create.",type:"object",properties:{title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",description:`@format uri
@contentMediaType image/*`}]}},required:["title","body","thumbnail"]},IBbsArticle:{description:"Article entity.\n\n`IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).",type:"object",properties:{id:{description:`Primary Key.


@format uuid`,type:"string"},created_at:{description:`Creation time of the article.


@format date-time`,type:"string"},updated_at:{description:`Last updated time of the article.


@format date-time`,type:"string"},title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",description:`@format uri
@contentMediaType image/*`}]}},required:["id","created_at","updated_at","title","body","thumbnail"]}}},output:{$ref:"#/$defs/IBbsArticle"},description:`Create a new article.

Writes a new article and archives it into the DB.`,validate:(()=>{const d=e=>typeof e.input=="object"&&e.input!==null&&o(e.input),o=e=>typeof e.title=="string"&&typeof e.body=="string"&&(e.thumbnail===null||typeof e.thumbnail=="string"&&u(e.thumbnail)),s=(e,t,i=!0)=>[(typeof e.input=="object"&&e.input!==null||r(i,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input}))&&l(e.input,t+".input",i)||r(i,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input})].every(n=>n),l=(e,t,i=!0)=>[typeof e.title=="string"||r(i,{path:t+".title",expected:"string",value:e.title}),typeof e.body=="string"||r(i,{path:t+".body",expected:"string",value:e.body}),e.thumbnail===null||typeof e.thumbnail=="string"&&(u(e.thumbnail)||r(i,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||r(i,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null)',value:e.thumbnail})].every(n=>n),c=e=>typeof e=="object"&&e!==null&&d(e);let a,r;return e=>{if(c(e)===!1){a=[],r=y(a),((i,n,f=!0)=>(typeof i=="object"&&i!==null||r(!0,{path:n+"",expected:"__type",value:i}))&&s(i,n+"",!0)||r(!0,{path:n+"",expected:"__type",value:i}))(e,"$input",!0);const t=a.length===0;return t?{success:t,data:e}:{success:t,errors:a,data:e}}return{success:!0,data:e}}})()},{name:"update",parameters:{description:" Properties of update function",type:"object",properties:{id:{description:`Target article's {@link IBbsArticle.id}.


@format uuid`,type:"string"},input:{description:"New content to update.",$ref:"#/$defs/PartialIBbsArticle.ICreate"}},required:["id","input"],additionalProperties:!1,$defs:{"PartialIBbsArticle.ICreate":{description:"Make all properties in T optional",type:"object",properties:{title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",description:`@format uri
@contentMediaType image/*`}]}},required:[]}}},description:`Update an article.

Updates an article with new content.`,validate:(()=>{const d=e=>typeof e.id=="string"&&p(e.id)&&typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1&&o(e.input),o=e=>(e.title===void 0||typeof e.title=="string")&&(e.body===void 0||typeof e.body=="string")&&(e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&u(e.thumbnail)),s=(e,t,i=!0)=>[typeof e.id=="string"&&(p(e.id)||r(i,{path:t+".id",expected:'string & Format<"uuid">',value:e.id}))||r(i,{path:t+".id",expected:'(string & Format<"uuid">)',value:e.id}),(typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1||r(i,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input}))&&l(e.input,t+".input",i)||r(i,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input})].every(n=>n),l=(e,t,i=!0)=>[e.title===void 0||typeof e.title=="string"||r(i,{path:t+".title",expected:"(string | undefined)",value:e.title}),e.body===void 0||typeof e.body=="string"||r(i,{path:t+".body",expected:"(string | undefined)",value:e.body}),e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&(u(e.thumbnail)||r(i,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||r(i,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null | undefined)',value:e.thumbnail})].every(n=>n),c=e=>typeof e=="object"&&e!==null&&d(e);let a,r;return e=>{if(c(e)===!1){a=[],r=y(a),((i,n,f=!0)=>(typeof i=="object"&&i!==null||r(!0,{path:n+"",expected:"__type",value:i}))&&s(i,n+"",!0)||r(!0,{path:n+"",expected:"__type",value:i}))(e,"$input",!0);const t=a.length===0;return t?{success:t,data:e}:{success:t,errors:a,data:e}}return{success:!0,data:e}}})()},{name:"erase",parameters:{description:" Properties of erase function",type:"object",properties:{id:{description:`Target article's {@link IBbsArticle.id}.


@format uuid`,type:"string"}},required:["id"],additionalProperties:!1,$defs:{}},description:`Erase an article.

Erases an article from the DB.`,validate:(()=>{const d=a=>typeof a.id=="string"&&p(a.id),o=(a,r,e=!0)=>[typeof a.id=="string"&&(p(a.id)||c(e,{path:r+".id",expected:'string & Format<"uuid">',value:a.id}))||c(e,{path:r+".id",expected:'(string & Format<"uuid">)',value:a.id})].every(t=>t),s=a=>typeof a=="object"&&a!==null&&d(a);let l,c;return a=>{if(s(a)===!1){l=[],c=y(l),((e,t,i=!0)=>(typeof e=="object"&&e!==null||c(!0,{path:t+"",expected:"__type",value:e}))&&o(e,t+"",!0)||c(!0,{path:t+"",expected:"__type",value:e}))(a,"$input",!0);const r=l.length===0;return r?{success:r,data:a}:{success:r,errors:l,data:a}}return{success:!0,data:a}}})()}]},claude:{model:"claude",options:{reference:!0,separate:null},functions:[{name:"index",parameters:{type:"object",properties:{},additionalProperties:!1,required:[],$defs:{IBbsArticle:{description:"Article entity.\n\n`IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).",type:"object",properties:{id:{description:"Primary Key.",type:"string",format:"uuid"},created_at:{description:"Creation time of the article.",type:"string",format:"date-time"},updated_at:{description:"Last updated time of the article.",type:"string",format:"date-time"},title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,oneOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:["id","created_at","updated_at","title","body","thumbnail"]}}},output:{description:"List of every articles",type:"array",items:{$ref:"#/$defs/IBbsArticle"}},description:`Get all articles.

List up every articles archived in the BBS DB.`,validate:d=>({success:!0,data:d})},{name:"create",parameters:{description:" Properties of create function",type:"object",properties:{input:{description:"Information of the article to create",$ref:"#/$defs/IBbsArticle.ICreate"}},required:["input"],additionalProperties:!1,$defs:{"IBbsArticle.ICreate":{description:"Information of the article to create.",type:"object",properties:{title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,oneOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:["title","body","thumbnail"]},IBbsArticle:{description:"Article entity.\n\n`IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).",type:"object",properties:{id:{description:"Primary Key.",type:"string",format:"uuid"},created_at:{description:"Creation time of the article.",type:"string",format:"date-time"},updated_at:{description:"Last updated time of the article.",type:"string",format:"date-time"},title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,oneOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:["id","created_at","updated_at","title","body","thumbnail"]}}},output:{$ref:"#/$defs/IBbsArticle"},description:`Create a new article.

Writes a new article and archives it into the DB.`,validate:(()=>{const d=e=>typeof e.input=="object"&&e.input!==null&&o(e.input),o=e=>typeof e.title=="string"&&typeof e.body=="string"&&(e.thumbnail===null||typeof e.thumbnail=="string"&&u(e.thumbnail)),s=(e,t,i=!0)=>[(typeof e.input=="object"&&e.input!==null||r(i,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input}))&&l(e.input,t+".input",i)||r(i,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input})].every(n=>n),l=(e,t,i=!0)=>[typeof e.title=="string"||r(i,{path:t+".title",expected:"string",value:e.title}),typeof e.body=="string"||r(i,{path:t+".body",expected:"string",value:e.body}),e.thumbnail===null||typeof e.thumbnail=="string"&&(u(e.thumbnail)||r(i,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||r(i,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null)',value:e.thumbnail})].every(n=>n),c=e=>typeof e=="object"&&e!==null&&d(e);let a,r;return e=>{if(c(e)===!1){a=[],r=y(a),((i,n,f=!0)=>(typeof i=="object"&&i!==null||r(!0,{path:n+"",expected:"__type",value:i}))&&s(i,n+"",!0)||r(!0,{path:n+"",expected:"__type",value:i}))(e,"$input",!0);const t=a.length===0;return t?{success:t,data:e}:{success:t,errors:a,data:e}}return{success:!0,data:e}}})()},{name:"update",parameters:{description:" Properties of update function",type:"object",properties:{id:{description:"Target article's {@link IBbsArticle.id}.",type:"string",format:"uuid"},input:{description:"New content to update.",$ref:"#/$defs/PartialIBbsArticle.ICreate"}},required:["id","input"],additionalProperties:!1,$defs:{"PartialIBbsArticle.ICreate":{description:"Make all properties in T optional",type:"object",properties:{title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,oneOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:[]}}},description:`Update an article.

Updates an article with new content.`,validate:(()=>{const d=e=>typeof e.id=="string"&&p(e.id)&&typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1&&o(e.input),o=e=>(e.title===void 0||typeof e.title=="string")&&(e.body===void 0||typeof e.body=="string")&&(e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&u(e.thumbnail)),s=(e,t,i=!0)=>[typeof e.id=="string"&&(p(e.id)||r(i,{path:t+".id",expected:'string & Format<"uuid">',value:e.id}))||r(i,{path:t+".id",expected:'(string & Format<"uuid">)',value:e.id}),(typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1||r(i,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input}))&&l(e.input,t+".input",i)||r(i,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input})].every(n=>n),l=(e,t,i=!0)=>[e.title===void 0||typeof e.title=="string"||r(i,{path:t+".title",expected:"(string | undefined)",value:e.title}),e.body===void 0||typeof e.body=="string"||r(i,{path:t+".body",expected:"(string | undefined)",value:e.body}),e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&(u(e.thumbnail)||r(i,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||r(i,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null | undefined)',value:e.thumbnail})].every(n=>n),c=e=>typeof e=="object"&&e!==null&&d(e);let a,r;return e=>{if(c(e)===!1){a=[],r=y(a),((i,n,f=!0)=>(typeof i=="object"&&i!==null||r(!0,{path:n+"",expected:"__type",value:i}))&&s(i,n+"",!0)||r(!0,{path:n+"",expected:"__type",value:i}))(e,"$input",!0);const t=a.length===0;return t?{success:t,data:e}:{success:t,errors:a,data:e}}return{success:!0,data:e}}})()},{name:"erase",parameters:{description:" Properties of erase function",type:"object",properties:{id:{description:"Target article's {@link IBbsArticle.id}.",type:"string",format:"uuid"}},required:["id"],additionalProperties:!1,$defs:{}},description:`Erase an article.

Erases an article from the DB.`,validate:(()=>{const d=a=>typeof a.id=="string"&&p(a.id),o=(a,r,e=!0)=>[typeof a.id=="string"&&(p(a.id)||c(e,{path:r+".id",expected:'string & Format<"uuid">',value:a.id}))||c(e,{path:r+".id",expected:'(string & Format<"uuid">)',value:a.id})].every(t=>t),s=a=>typeof a=="object"&&a!==null&&d(a);let l,c;return a=>{if(s(a)===!1){l=[],c=y(l),((e,t,i=!0)=>(typeof e=="object"&&e!==null||c(!0,{path:t+"",expected:"__type",value:e}))&&o(e,t+"",!0)||c(!0,{path:t+"",expected:"__type",value:e}))(a,"$input",!0);const r=l.length===0;return r?{success:r,data:a}:{success:r,errors:l,data:a}}return{success:!0,data:a}}})()}]},gemini:{model:"gemini",options:{reference:!0,separate:null},functions:[{name:"index",parameters:{type:"object",properties:{},additionalProperties:!1,required:[],$defs:{IBbsArticle:{description:"Article entity.\n\n`IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).",type:"object",properties:{id:{description:"Primary Key.",type:"string",format:"uuid"},created_at:{description:"Creation time of the article.",type:"string",format:"date-time"},updated_at:{description:"Last updated time of the article.",type:"string",format:"date-time"},title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:["id","created_at","updated_at","title","body","thumbnail"]}}},output:{description:"List of every articles",type:"array",items:{$ref:"#/$defs/IBbsArticle"}},description:`Get all articles.

List up every articles archived in the BBS DB.`,validate:d=>({success:!0,data:d})},{name:"create",parameters:{description:" Properties of create function",type:"object",properties:{input:{description:"Information of the article to create",$ref:"#/$defs/IBbsArticle.ICreate"}},required:["input"],additionalProperties:!1,$defs:{"IBbsArticle.ICreate":{description:"Information of the article to create.",type:"object",properties:{title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:["title","body","thumbnail"]},IBbsArticle:{description:"Article entity.\n\n`IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).",type:"object",properties:{id:{description:"Primary Key.",type:"string",format:"uuid"},created_at:{description:"Creation time of the article.",type:"string",format:"date-time"},updated_at:{description:"Last updated time of the article.",type:"string",format:"date-time"},title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:["id","created_at","updated_at","title","body","thumbnail"]}}},output:{$ref:"#/$defs/IBbsArticle"},description:`Create a new article.

Writes a new article and archives it into the DB.`,validate:(()=>{const d=e=>typeof e.input=="object"&&e.input!==null&&o(e.input),o=e=>typeof e.title=="string"&&typeof e.body=="string"&&(e.thumbnail===null||typeof e.thumbnail=="string"&&u(e.thumbnail)),s=(e,t,i=!0)=>[(typeof e.input=="object"&&e.input!==null||r(i,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input}))&&l(e.input,t+".input",i)||r(i,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input})].every(n=>n),l=(e,t,i=!0)=>[typeof e.title=="string"||r(i,{path:t+".title",expected:"string",value:e.title}),typeof e.body=="string"||r(i,{path:t+".body",expected:"string",value:e.body}),e.thumbnail===null||typeof e.thumbnail=="string"&&(u(e.thumbnail)||r(i,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||r(i,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null)',value:e.thumbnail})].every(n=>n),c=e=>typeof e=="object"&&e!==null&&d(e);let a,r;return e=>{if(c(e)===!1){a=[],r=y(a),((i,n,f=!0)=>(typeof i=="object"&&i!==null||r(!0,{path:n+"",expected:"__type",value:i}))&&s(i,n+"",!0)||r(!0,{path:n+"",expected:"__type",value:i}))(e,"$input",!0);const t=a.length===0;return t?{success:t,data:e}:{success:t,errors:a,data:e}}return{success:!0,data:e}}})()},{name:"update",parameters:{description:" Properties of update function",type:"object",properties:{id:{description:"Target article's {@link IBbsArticle.id}.",type:"string",format:"uuid"},input:{description:"New content to update.",$ref:"#/$defs/PartialIBbsArticle.ICreate"}},required:["id","input"],additionalProperties:!1,$defs:{"PartialIBbsArticle.ICreate":{description:"Make all properties in T optional",type:"object",properties:{title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:[]}}},description:`Update an article.

Updates an article with new content.`,validate:(()=>{const d=e=>typeof e.id=="string"&&p(e.id)&&typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1&&o(e.input),o=e=>(e.title===void 0||typeof e.title=="string")&&(e.body===void 0||typeof e.body=="string")&&(e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&u(e.thumbnail)),s=(e,t,i=!0)=>[typeof e.id=="string"&&(p(e.id)||r(i,{path:t+".id",expected:'string & Format<"uuid">',value:e.id}))||r(i,{path:t+".id",expected:'(string & Format<"uuid">)',value:e.id}),(typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1||r(i,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input}))&&l(e.input,t+".input",i)||r(i,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input})].every(n=>n),l=(e,t,i=!0)=>[e.title===void 0||typeof e.title=="string"||r(i,{path:t+".title",expected:"(string | undefined)",value:e.title}),e.body===void 0||typeof e.body=="string"||r(i,{path:t+".body",expected:"(string | undefined)",value:e.body}),e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&(u(e.thumbnail)||r(i,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||r(i,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null | undefined)',value:e.thumbnail})].every(n=>n),c=e=>typeof e=="object"&&e!==null&&d(e);let a,r;return e=>{if(c(e)===!1){a=[],r=y(a),((i,n,f=!0)=>(typeof i=="object"&&i!==null||r(!0,{path:n+"",expected:"__type",value:i}))&&s(i,n+"",!0)||r(!0,{path:n+"",expected:"__type",value:i}))(e,"$input",!0);const t=a.length===0;return t?{success:t,data:e}:{success:t,errors:a,data:e}}return{success:!0,data:e}}})()},{name:"erase",parameters:{description:" Properties of erase function",type:"object",properties:{id:{description:"Target article's {@link IBbsArticle.id}.",type:"string",format:"uuid"}},required:["id"],additionalProperties:!1,$defs:{}},description:`Erase an article.

Erases an article from the DB.`,validate:(()=>{const d=a=>typeof a.id=="string"&&p(a.id),o=(a,r,e=!0)=>[typeof a.id=="string"&&(p(a.id)||c(e,{path:r+".id",expected:'string & Format<"uuid">',value:a.id}))||c(e,{path:r+".id",expected:'(string & Format<"uuid">)',value:a.id})].every(t=>t),s=a=>typeof a=="object"&&a!==null&&d(a);let l,c;return a=>{if(s(a)===!1){l=[],c=y(l),((e,t,i=!0)=>(typeof e=="object"&&e!==null||c(!0,{path:t+"",expected:"__type",value:e}))&&o(e,t+"",!0)||c(!0,{path:t+"",expected:"__type",value:e}))(a,"$input",!0);const r=l.length===0;return r?{success:r,data:a}:{success:r,errors:l,data:a}}return{success:!0,data:a}}})()}]},"3.0":{model:"3.0",options:{recursive:3,constraint:!0,separate:null},functions:[{name:"index",parameters:{type:"object",properties:{},additionalProperties:!1,required:[]},output:{type:"array",items:{type:"object",properties:{id:{type:"string",format:"uuid",description:"Primary Key."},created_at:{type:"string",format:"date-time",description:"Creation time of the article."},updated_at:{type:"string",format:"date-time",description:"Last updated time of the article."},title:{type:"string",description:`Title of the article.

Representative title of the article.`},body:{type:"string",description:`Content body.

Content body of the article writtn in the markdown format.`},thumbnail:{type:"string",format:"uri",contentMediaType:"image/*",nullable:!0,description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`}},required:["id","created_at","updated_at","title","body","thumbnail"],description:`Description of the current {@link IBbsArticle} type:

> Article entity.
> 
> \`IBbsArticle\` is an entity representing an article in the BBS (Bulletin Board System).`,additionalProperties:!1},description:"List of every articles"},description:`Get all articles.

List up every articles archived in the BBS DB.`,validate:d=>({success:!0,data:d})},{name:"create",parameters:{type:"object",properties:{input:{type:"object",properties:{title:{type:"string",description:`Title of the article.

Representative title of the article.`},body:{type:"string",description:`Content body.

Content body of the article writtn in the markdown format.`},thumbnail:{type:"string",format:"uri",contentMediaType:"image/*",nullable:!0,description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`}},required:["title","body","thumbnail"],description:`Information of the article to create

------------------------------

Description of the current {@link IBbsArticle.ICreate} type:

> Information of the article to create.

------------------------------

Description of the parent {@link IBbsArticle} type:

> Article entity.
> 
> \`IBbsArticle\` is an entity representing an article in the BBS (Bulletin Board System).`,additionalProperties:!1}},required:["input"],description:" Properties of create function",additionalProperties:!1},output:{type:"object",properties:{id:{type:"string",format:"uuid",description:"Primary Key."},created_at:{type:"string",format:"date-time",description:"Creation time of the article."},updated_at:{type:"string",format:"date-time",description:"Last updated time of the article."},title:{type:"string",description:`Title of the article.

Representative title of the article.`},body:{type:"string",description:`Content body.

Content body of the article writtn in the markdown format.`},thumbnail:{type:"string",format:"uri",contentMediaType:"image/*",nullable:!0,description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`}},required:["id","created_at","updated_at","title","body","thumbnail"],description:`Description of the current {@link IBbsArticle} type:

> Article entity.
> 
> \`IBbsArticle\` is an entity representing an article in the BBS (Bulletin Board System).`,additionalProperties:!1},description:`Create a new article.

Writes a new article and archives it into the DB.`,validate:(()=>{const d=e=>typeof e.input=="object"&&e.input!==null&&o(e.input),o=e=>typeof e.title=="string"&&typeof e.body=="string"&&(e.thumbnail===null||typeof e.thumbnail=="string"&&u(e.thumbnail)),s=(e,t,i=!0)=>[(typeof e.input=="object"&&e.input!==null||r(i,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input}))&&l(e.input,t+".input",i)||r(i,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input})].every(n=>n),l=(e,t,i=!0)=>[typeof e.title=="string"||r(i,{path:t+".title",expected:"string",value:e.title}),typeof e.body=="string"||r(i,{path:t+".body",expected:"string",value:e.body}),e.thumbnail===null||typeof e.thumbnail=="string"&&(u(e.thumbnail)||r(i,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||r(i,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null)',value:e.thumbnail})].every(n=>n),c=e=>typeof e=="object"&&e!==null&&d(e);let a,r;return e=>{if(c(e)===!1){a=[],r=y(a),((i,n,f=!0)=>(typeof i=="object"&&i!==null||r(!0,{path:n+"",expected:"__type",value:i}))&&s(i,n+"",!0)||r(!0,{path:n+"",expected:"__type",value:i}))(e,"$input",!0);const t=a.length===0;return t?{success:t,data:e}:{success:t,errors:a,data:e}}return{success:!0,data:e}}})()},{name:"update",parameters:{type:"object",properties:{id:{type:"string",format:"uuid",description:"Target article's {@link IBbsArticle.id}."},input:{type:"object",properties:{title:{type:"string",description:`Title of the article.

Representative title of the article.`},body:{type:"string",description:`Content body.

Content body of the article writtn in the markdown format.`},thumbnail:{type:"string",format:"uri",contentMediaType:"image/*",nullable:!0,description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`}},required:[],description:`New content to update.

------------------------------

Description of the current {@link PartialIBbsArticle.ICreate} type:

> Make all properties in T optional`,additionalProperties:!1}},required:["id","input"],description:" Properties of update function",additionalProperties:!1},description:`Update an article.

Updates an article with new content.`,validate:(()=>{const d=e=>typeof e.id=="string"&&p(e.id)&&typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1&&o(e.input),o=e=>(e.title===void 0||typeof e.title=="string")&&(e.body===void 0||typeof e.body=="string")&&(e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&u(e.thumbnail)),s=(e,t,i=!0)=>[typeof e.id=="string"&&(p(e.id)||r(i,{path:t+".id",expected:'string & Format<"uuid">',value:e.id}))||r(i,{path:t+".id",expected:'(string & Format<"uuid">)',value:e.id}),(typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1||r(i,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input}))&&l(e.input,t+".input",i)||r(i,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input})].every(n=>n),l=(e,t,i=!0)=>[e.title===void 0||typeof e.title=="string"||r(i,{path:t+".title",expected:"(string | undefined)",value:e.title}),e.body===void 0||typeof e.body=="string"||r(i,{path:t+".body",expected:"(string | undefined)",value:e.body}),e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&(u(e.thumbnail)||r(i,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||r(i,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null | undefined)',value:e.thumbnail})].every(n=>n),c=e=>typeof e=="object"&&e!==null&&d(e);let a,r;return e=>{if(c(e)===!1){a=[],r=y(a),((i,n,f=!0)=>(typeof i=="object"&&i!==null||r(!0,{path:n+"",expected:"__type",value:i}))&&s(i,n+"",!0)||r(!0,{path:n+"",expected:"__type",value:i}))(e,"$input",!0);const t=a.length===0;return t?{success:t,data:e}:{success:t,errors:a,data:e}}return{success:!0,data:e}}})()},{name:"erase",parameters:{type:"object",properties:{id:{type:"string",format:"uuid",description:"Target article's {@link IBbsArticle.id}."}},required:["id"],description:" Properties of erase function",additionalProperties:!1},description:`Erase an article.

Erases an article from the DB.`,validate:(()=>{const d=a=>typeof a.id=="string"&&p(a.id),o=(a,r,e=!0)=>[typeof a.id=="string"&&(p(a.id)||c(e,{path:r+".id",expected:'string & Format<"uuid">',value:a.id}))||c(e,{path:r+".id",expected:'(string & Format<"uuid">)',value:a.id})].every(t=>t),s=a=>typeof a=="object"&&a!==null&&d(a);let l,c;return a=>{if(s(a)===!1){l=[],c=y(l),((e,t,i=!0)=>(typeof e=="object"&&e!==null||c(!0,{path:t+"",expected:"__type",value:e}))&&o(e,t+"",!0)||c(!0,{path:t+"",expected:"__type",value:e}))(a,"$input",!0);const r=l.length===0;return r?{success:r,data:a}:{success:r,errors:l,data:a}}return{success:!0,data:a}}})()}]},"3.1":{model:"3.1",options:{reference:!0,constraint:!0,separate:null},functions:[{name:"index",parameters:{type:"object",properties:{},additionalProperties:!1,required:[],$defs:{IBbsArticle:{description:"Article entity.\n\n`IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).",type:"object",properties:{id:{description:"Primary Key.",type:"string",format:"uuid"},created_at:{description:"Creation time of the article.",type:"string",format:"date-time"},updated_at:{description:"Last updated time of the article.",type:"string",format:"date-time"},title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,oneOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:["id","created_at","updated_at","title","body","thumbnail"]}}},output:{description:"List of every articles",type:"array",items:{$ref:"#/$defs/IBbsArticle"}},description:`Get all articles.

List up every articles archived in the BBS DB.`,validate:d=>({success:!0,data:d})},{name:"create",parameters:{description:" Properties of create function",type:"object",properties:{input:{description:"Information of the article to create",$ref:"#/$defs/IBbsArticle.ICreate"}},required:["input"],additionalProperties:!1,$defs:{"IBbsArticle.ICreate":{description:"Information of the article to create.",type:"object",properties:{title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,oneOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:["title","body","thumbnail"]},IBbsArticle:{description:"Article entity.\n\n`IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).",type:"object",properties:{id:{description:"Primary Key.",type:"string",format:"uuid"},created_at:{description:"Creation time of the article.",type:"string",format:"date-time"},updated_at:{description:"Last updated time of the article.",type:"string",format:"date-time"},title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,oneOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:["id","created_at","updated_at","title","body","thumbnail"]}}},output:{$ref:"#/$defs/IBbsArticle"},description:`Create a new article.

Writes a new article and archives it into the DB.`,validate:(()=>{const d=e=>typeof e.input=="object"&&e.input!==null&&o(e.input),o=e=>typeof e.title=="string"&&typeof e.body=="string"&&(e.thumbnail===null||typeof e.thumbnail=="string"&&u(e.thumbnail)),s=(e,t,i=!0)=>[(typeof e.input=="object"&&e.input!==null||r(i,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input}))&&l(e.input,t+".input",i)||r(i,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input})].every(n=>n),l=(e,t,i=!0)=>[typeof e.title=="string"||r(i,{path:t+".title",expected:"string",value:e.title}),typeof e.body=="string"||r(i,{path:t+".body",expected:"string",value:e.body}),e.thumbnail===null||typeof e.thumbnail=="string"&&(u(e.thumbnail)||r(i,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||r(i,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null)',value:e.thumbnail})].every(n=>n),c=e=>typeof e=="object"&&e!==null&&d(e);let a,r;return e=>{if(c(e)===!1){a=[],r=y(a),((i,n,f=!0)=>(typeof i=="object"&&i!==null||r(!0,{path:n+"",expected:"__type",value:i}))&&s(i,n+"",!0)||r(!0,{path:n+"",expected:"__type",value:i}))(e,"$input",!0);const t=a.length===0;return t?{success:t,data:e}:{success:t,errors:a,data:e}}return{success:!0,data:e}}})()},{name:"update",parameters:{description:" Properties of update function",type:"object",properties:{id:{description:"Target article's {@link IBbsArticle.id}.",type:"string",format:"uuid"},input:{description:"New content to update.",$ref:"#/$defs/PartialIBbsArticle.ICreate"}},required:["id","input"],additionalProperties:!1,$defs:{"PartialIBbsArticle.ICreate":{description:"Make all properties in T optional",type:"object",properties:{title:{description:`Title of the article.

Representative title of the article.`,type:"string"},body:{description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,oneOf:[{type:"null"},{type:"string",format:"uri",contentMediaType:"image/*"}]}},required:[]}}},description:`Update an article.

Updates an article with new content.`,validate:(()=>{const d=e=>typeof e.id=="string"&&p(e.id)&&typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1&&o(e.input),o=e=>(e.title===void 0||typeof e.title=="string")&&(e.body===void 0||typeof e.body=="string")&&(e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&u(e.thumbnail)),s=(e,t,i=!0)=>[typeof e.id=="string"&&(p(e.id)||r(i,{path:t+".id",expected:'string & Format<"uuid">',value:e.id}))||r(i,{path:t+".id",expected:'(string & Format<"uuid">)',value:e.id}),(typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1||r(i,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input}))&&l(e.input,t+".input",i)||r(i,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input})].every(n=>n),l=(e,t,i=!0)=>[e.title===void 0||typeof e.title=="string"||r(i,{path:t+".title",expected:"(string | undefined)",value:e.title}),e.body===void 0||typeof e.body=="string"||r(i,{path:t+".body",expected:"(string | undefined)",value:e.body}),e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&(u(e.thumbnail)||r(i,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||r(i,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null | undefined)',value:e.thumbnail})].every(n=>n),c=e=>typeof e=="object"&&e!==null&&d(e);let a,r;return e=>{if(c(e)===!1){a=[],r=y(a),((i,n,f=!0)=>(typeof i=="object"&&i!==null||r(!0,{path:n+"",expected:"__type",value:i}))&&s(i,n+"",!0)||r(!0,{path:n+"",expected:"__type",value:i}))(e,"$input",!0);const t=a.length===0;return t?{success:t,data:e}:{success:t,errors:a,data:e}}return{success:!0,data:e}}})()},{name:"erase",parameters:{description:" Properties of erase function",type:"object",properties:{id:{description:"Target article's {@link IBbsArticle.id}.",type:"string",format:"uuid"}},required:["id"],additionalProperties:!1,$defs:{}},description:`Erase an article.

Erases an article from the DB.`,validate:(()=>{const d=a=>typeof a.id=="string"&&p(a.id),o=(a,r,e=!0)=>[typeof a.id=="string"&&(p(a.id)||c(e,{path:r+".id",expected:'string & Format<"uuid">',value:a.id}))||c(e,{path:r+".id",expected:'(string & Format<"uuid">)',value:a.id})].every(t=>t),s=a=>typeof a=="object"&&a!==null&&d(a);let l,c;return a=>{if(s(a)===!1){l=[],c=y(l),((e,t,i=!0)=>(typeof e=="object"&&e!==null||c(!0,{path:t+"",expected:"__type",value:e}))&&o(e,t+"",!0)||c(!0,{path:t+"",expected:"__type",value:e}))(a,"$input",!0);const r=l.length===0;return r?{success:r,data:a}:{success:r,errors:l,data:a}}return{success:!0,data:a}}})()}]}};function V(d){const o=new G,s=new I({model:"chatgpt",vendor:{api:d.api,model:d.vendorModel},controllers:[{protocol:"class",name:"bbs",application:H[d.schemaModel],execute:o}],config:{locale:d.locale,timezone:d.timezone}});return m.jsx(M,{agent:s})}function J(){const[d,o]=b.useState(w.defaultConfig()),[s,l]=b.useState(window.navigator.language),[c,a]=b.useState(!1);return m.jsx("div",{style:{width:"100%",height:"100%",overflow:c===!0?void 0:"auto"},children:c===!0?m.jsx(V,{api:new S({apiKey:d.apiKey,baseURL:d.baseURL,dangerouslyAllowBrowser:!0}),vendorModel:d.vendorModel,schemaModel:d.schemaModel,locale:s}):m.jsxs(q,{style:{width:"calc(100% - 60px)",padding:15,margin:15},children:[m.jsx(g,{variant:"h6",children:"BBS AI Chatbot"}),m.jsx("br",{}),m.jsx(L,{}),m.jsx("br",{}),"Demonstration of Agentica with TypeScript Controller Class.",m.jsx("br",{}),m.jsx("br",{}),m.jsx(g,{variant:"h6",children:" OpenAI Configuration "}),m.jsx("br",{}),m.jsx(w,{config:d,onChange:o}),m.jsx("br",{}),m.jsx(g,{variant:"h6",children:" Membership Information "}),m.jsx("br",{}),m.jsx(D,{onChange:r=>l(r.target.value),defaultValue:s,label:"Locale",variant:"outlined",error:s.length===0}),m.jsx("br",{}),m.jsx("br",{}),m.jsx(O,{component:"a",fullWidth:!0,variant:"contained",color:"info",size:"large",disabled:d.apiKey.length===0||d.vendorModel.length===0||d.schemaModel.length===0||s.length===0,onClick:()=>a(!0),children:"Start AI Chatbot"})]})})}j(window.document.getElementById("root")).render(m.jsx(J,{}));
