import{j as a,o as T,r as y,T as v}from"../client-BVv4NBtY.js";import{a as f,_ as b}from"../_isFormatUri-YqTfGpHo.js";import{v as C,A as w,e as _,f as R,F as S,T as x,R as P,c as j,d as A,B as U}from"../AgenticaChatApplication-B11uTJIM.js";import{D as k}from"../Divider-DaLcPLlq.js";var I={};Object.defineProperty(I,"__esModule",{value:!0});var g=I._validateReport=void 0;const F=d=>{const l=o=>{if(d.length===0)return!0;const s=d[d.length-1].path;return o.length>s.length||s.substring(0,o.length)!==o};return(o,s)=>(o&&l(s.path)&&d.push(s),!1)};g=I._validateReport=F;class D{constructor(){this.articles=[]}index(){return this.articles}create(l){const o={id:C(),title:l.input.title,body:l.input.body,thumbnail:l.input.thumbnail,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};return this.articles.push(o),o}update(l){const o=this.articles.find(s=>s.id===l.id);if(o===void 0)throw new Error("Unable to find the matched article.");l.input.title!==void 0&&(o.title=l.input.title),l.input.body!==void 0&&(o.body=l.input.body),l.input.thumbnail!==void 0&&(o.thumbnail=l.input.thumbnail),o.updated_at=new Date().toISOString()}erase(l){const o=this.articles.findIndex(s=>s.id===l.id);if(o===-1)throw new Error("Unable to find the matched article.");this.articles.splice(o,1)}}const M=d=>{const l=new D,o=new w({model:"chatgpt",vendor:{api:new _({apiKey:d.apiKey,dangerouslyAllowBrowser:!0}),model:d.model??"gpt-4o-mini"},controllers:[{protocol:"class",name:"bbs",application:{model:"chatgpt",options:{reference:!1,strict:!1,separate:null},functions:[{name:"index",parameters:{type:"object",properties:{},additionalProperties:!1,required:[],$defs:{}},output:{description:"List of every articles",type:"array",items:{description:"Article entity.\n\n`IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).",type:"object",properties:{id:{title:"Primary Key",description:`Primary Key.


@format uuid`,type:"string"},created_at:{title:"Creation time of the article",description:`Creation time of the article.


@format date-time`,type:"string"},updated_at:{title:"Last updated time of the article",description:`Last updated time of the article.


@format date-time`,type:"string"},title:{title:"Title of the article",description:`Title of the article.

Representative title of the article.`,type:"string"},body:{title:"Content body",description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{title:"Thumbnail image URI",description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",description:`@format uri
@contentMediaType image/*`}]}},required:["id","created_at","updated_at","title","body","thumbnail"]}},description:`Get all articles.

List up every articles archived in the BBS DB.`,validate:s=>({success:!0,data:s})},{name:"create",parameters:{description:" Properties of create function",type:"object",properties:{input:{description:`Information of the article to create.

------------------------------

Description of the current {@link IBbsArticle.ICreate} type:

> Information of the article to create.

------------------------------

Description of the parent {@link IBbsArticle} type:

> Article entity.
> 
> \`IBbsArticle\` is an entity representing an article in the BBS (Bulletin Board System).`,type:"object",properties:{title:{title:"Title of the article",description:`Title of the article.

Representative title of the article.`,type:"string"},body:{title:"Content body",description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{title:"Thumbnail image URI",description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",description:`@format uri
@contentMediaType image/*`}]}},required:["title","body","thumbnail"]}},required:["input"],additionalProperties:!1,$defs:{}},output:{description:"Article entity.\n\n`IBbsArticle` is an entity representing an article in the BBS (Bulletin Board System).",type:"object",properties:{id:{title:"Primary Key",description:`Primary Key.


@format uuid`,type:"string"},created_at:{title:"Creation time of the article",description:`Creation time of the article.


@format date-time`,type:"string"},updated_at:{title:"Last updated time of the article",description:`Last updated time of the article.


@format date-time`,type:"string"},title:{title:"Title of the article",description:`Title of the article.

Representative title of the article.`,type:"string"},body:{title:"Content body",description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{title:"Thumbnail image URI",description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",description:`@format uri
@contentMediaType image/*`}]}},required:["id","created_at","updated_at","title","body","thumbnail"]},description:`Create a new article.

Writes a new article and archives it into the DB.`,validate:(()=>{const s=e=>typeof e.input=="object"&&e.input!==null&&p(e.input),p=e=>typeof e.title=="string"&&typeof e.body=="string"&&(e.thumbnail===null||typeof e.thumbnail=="string"&&f(e.thumbnail)),m=(e,t,r=!0)=>[(typeof e.input=="object"&&e.input!==null||n(r,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input}))&&h(e.input,t+".input",r)||n(r,{path:t+".input",expected:"IBbsArticle.ICreate",value:e.input})].every(c=>c),h=(e,t,r=!0)=>[typeof e.title=="string"||n(r,{path:t+".title",expected:"string",value:e.title}),typeof e.body=="string"||n(r,{path:t+".body",expected:"string",value:e.body}),e.thumbnail===null||typeof e.thumbnail=="string"&&(f(e.thumbnail)||n(r,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||n(r,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null)',value:e.thumbnail})].every(c=>c),u=e=>typeof e=="object"&&e!==null&&s(e);let i,n;return e=>{if(u(e)===!1){i=[],n=g(i),((r,c,B=!0)=>(typeof r=="object"&&r!==null||n(!0,{path:c+"",expected:"__type",value:r}))&&m(r,c+"",!0)||n(!0,{path:c+"",expected:"__type",value:r}))(e,"$input",!0);const t=i.length===0;return t?{success:t,data:e}:{success:t,errors:i,data:e}}return{success:!0,data:e}}})()},{name:"update",parameters:{description:" Properties of update function",type:"object",properties:{id:{title:"Target article's {@link IBbsArticle.id}",description:`Target article's {@link IBbsArticle.id}.


@format uuid`,type:"string"},input:{description:`Make all properties in T optional

------------------------------

Description of the current {@link PartialIBbsArticle.ICreate} type:

> Make all properties in T optional`,type:"object",properties:{title:{title:"Title of the article",description:`Title of the article.

Representative title of the article.`,type:"string"},body:{title:"Content body",description:`Content body.

Content body of the article writtn in the markdown format.`,type:"string"},thumbnail:{title:"Thumbnail image URI",description:`Thumbnail image URI.

Thumbnail image URI which can represent the article.

If configured as \`null\`, it means that no thumbnail image in the article.`,anyOf:[{type:"null"},{type:"string",description:`@format uri
@contentMediaType image/*`}]}},required:[]}},required:["id","input"],additionalProperties:!1,$defs:{}},description:`Update an article.

Updates an article with new content.`,validate:(()=>{const s=e=>typeof e.id=="string"&&b(e.id)&&typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1&&p(e.input),p=e=>(e.title===void 0||typeof e.title=="string")&&(e.body===void 0||typeof e.body=="string")&&(e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&f(e.thumbnail)),m=(e,t,r=!0)=>[typeof e.id=="string"&&(b(e.id)||n(r,{path:t+".id",expected:'string & Format<"uuid">',value:e.id}))||n(r,{path:t+".id",expected:'(string & Format<"uuid">)',value:e.id}),(typeof e.input=="object"&&e.input!==null&&Array.isArray(e.input)===!1||n(r,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input}))&&h(e.input,t+".input",r)||n(r,{path:t+".input",expected:"Partial<IBbsArticle.ICreate>",value:e.input})].every(c=>c),h=(e,t,r=!0)=>[e.title===void 0||typeof e.title=="string"||n(r,{path:t+".title",expected:"(string | undefined)",value:e.title}),e.body===void 0||typeof e.body=="string"||n(r,{path:t+".body",expected:"(string | undefined)",value:e.body}),e.thumbnail===null||e.thumbnail===void 0||typeof e.thumbnail=="string"&&(f(e.thumbnail)||n(r,{path:t+".thumbnail",expected:'string & Format<"uri">',value:e.thumbnail}))||n(r,{path:t+".thumbnail",expected:'((string & Format<"uri"> & ContentMediaType<"image/*">) | null | undefined)',value:e.thumbnail})].every(c=>c),u=e=>typeof e=="object"&&e!==null&&s(e);let i,n;return e=>{if(u(e)===!1){i=[],n=g(i),((r,c,B=!0)=>(typeof r=="object"&&r!==null||n(!0,{path:c+"",expected:"__type",value:r}))&&m(r,c+"",!0)||n(!0,{path:c+"",expected:"__type",value:r}))(e,"$input",!0);const t=i.length===0;return t?{success:t,data:e}:{success:t,errors:i,data:e}}return{success:!0,data:e}}})()},{name:"erase",parameters:{description:" Properties of erase function",type:"object",properties:{id:{title:"Target article's {@link IBbsArticle.id}",description:`Target article's {@link IBbsArticle.id}.


@format uuid`,type:"string"}},required:["id"],additionalProperties:!1,$defs:{}},description:`Erase an article.

Erases an article from the DB.`,validate:(()=>{const s=i=>typeof i.id=="string"&&b(i.id),p=(i,n,e=!0)=>[typeof i.id=="string"&&(b(i.id)||u(e,{path:n+".id",expected:'string & Format<"uuid">',value:i.id}))||u(e,{path:n+".id",expected:'(string & Format<"uuid">)',value:i.id})].every(t=>t),m=i=>typeof i=="object"&&i!==null&&s(i);let h,u;return i=>{if(m(i)===!1){h=[],u=g(h),((e,t,r=!0)=>(typeof e=="object"&&e!==null||u(!0,{path:t+"",expected:"__type",value:e}))&&p(e,t+"",!0)||u(!0,{path:t+"",expected:"__type",value:e}))(i,"$input",!0);const n=h.length===0;return n?{success:n,data:i}:{success:n,errors:h,data:i}}return{success:!0,data:i}}})()}]},execute:l}],config:{locale:d.locale,timezone:d.timezone,executor:{initialize:null}}});return a.jsx(R,{agent:o})};function O(){const[d,l]=y.useState(""),[o,s]=y.useState("gpt-4o-mini"),[p,m]=y.useState(window.navigator.language),[h,u]=y.useState(!1);return a.jsx("div",{style:{width:"100%",height:"100%"},children:h===!0?a.jsx(M,{apiKey:d,model:o,locale:p}):a.jsxs(S,{style:{width:"calc(100% - 60px)",padding:15,margin:15},children:[a.jsx(v,{variant:"h6",children:"BBS AI Chatbot"}),a.jsx("br",{}),a.jsx(k,{}),a.jsx("br",{}),"Demonstration of Agentica with TypeScript Controller Class.",a.jsx("br",{}),a.jsx("br",{}),a.jsx(v,{variant:"h6",children:" OpenAI Configuration "}),a.jsx(x,{onChange:i=>l(i.target.value),defaultValue:d,label:"OpenAI API Key",variant:"outlined",placeholder:"Your OpenAI API Key",error:d.length===0}),a.jsx("br",{}),a.jsxs(P,{defaultValue:o,onChange:(i,n)=>s(n),style:{paddingLeft:15},children:[a.jsx(j,{control:a.jsx(A,{}),label:"GPT-4o Mini",value:"gpt-4o-mini"}),a.jsx(j,{control:a.jsx(A,{}),label:"GPT-4o",value:"gpt-4o"})]}),a.jsx("br",{}),a.jsx(v,{variant:"h6",children:" Membership Information "}),a.jsx("br",{}),a.jsx(x,{onChange:i=>m(i.target.value),defaultValue:p,label:"Locale",variant:"outlined",error:p.length===0}),a.jsx("br",{}),a.jsx("br",{}),a.jsx(U,{component:"a",fullWidth:!0,variant:"contained",color:"info",size:"large",disabled:d.length===0||p.length===0,onClick:()=>u(!0),children:"Start AI Chatbot"})]})})}T(window.document.getElementById("root")).render(a.jsx(O,{}));
