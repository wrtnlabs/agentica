import{M as K,N as Y,q as X}from"./client-B3aq8qpT.js";import{J as Q}from"./types-Co05Usx1.js";var E={exports:{}};const w={},Z=Object.freeze(Object.defineProperty({__proto__:null,default:w},Symbol.toStringTag,{value:"Module"})),v=K(Z);var S,H;function ee(){if(H)return S;H=1;var e={};S=s,s.sync=i;var n=v;function t(o,l){var u=l.pathExt!==void 0?l.pathExt:e.PATHEXT;if(!u||(u=u.split(";"),u.indexOf("")!==-1))return!0;for(var c=0;c<u.length;c++){var a=u[c].toLowerCase();if(a&&o.substr(-a.length).toLowerCase()===a)return!0}return!1}function r(o,l,u){return!o.isSymbolicLink()&&!o.isFile()?!1:t(l,u)}function s(o,l,u){n.stat(o,function(c,a){u(c,c?!1:r(a,o,l))})}function i(o,l){return r(n.statSync(o),o,l)}return S}var b,j;function ne(){if(j)return b;j=1,b=n,n.sync=t;var e=v;function n(i,o,l){e.stat(i,function(u,c){l(u,u?!1:r(c,o))})}function t(i,o){return r(e.statSync(i),o)}function r(i,o){return i.isFile()&&s(i,o)}function s(i,o){var l=i.mode,u=i.uid,c=i.gid,a=o.uid!==void 0?o.uid:process.getuid&&process.getuid(),f=o.gid!==void 0?o.gid:process.getgid&&process.getgid(),d=parseInt("100",8),h=parseInt("010",8),p=parseInt("001",8),_=d|h,x=l&p||l&h&&c===f||l&d&&u===a||l&_&&a===0;return x}return b}var g;process.platform==="win32"||Y.TESTING_WINDOWS?g=ee():g=ne();var te=P;P.sync=re;function P(e,n,t){if(typeof n=="function"&&(t=n,n={}),!t){if(typeof Promise!="function")throw new TypeError("callback not provided");return new Promise(function(r,s){P(e,n||{},function(i,o){i?s(i):r(o)})})}g(e,n||{},function(r,s){r&&(r.code==="EACCES"||n&&n.ignoreErrors)&&(r=null,s=!1),t(r,s)})}function re(e,n){try{return g.sync(e,n||{})}catch(t){if(n&&n.ignoreErrors||t.code==="EACCES")return!1;throw t}}var y={};const m=process.platform==="win32"||y.OSTYPE==="cygwin"||y.OSTYPE==="msys",k=v,se=m?";":":",F=te,W=e=>Object.assign(new Error(`not found: ${e}`),{code:"ENOENT"}),z=(e,n)=>{const t=n.colon||se,r=e.match(/\//)||m&&e.match(/\\/)?[""]:[...m?[process.cwd()]:[],...(n.path||y.PATH||"").split(t)],s=m?n.pathExt||y.PATHEXT||".EXE;.CMD;.BAT;.COM":"",i=m?s.split(t):[""];return m&&e.indexOf(".")!==-1&&i[0]!==""&&i.unshift(""),{pathEnv:r,pathExt:i,pathExtExe:s}},U=(e,n,t)=>{typeof n=="function"&&(t=n,n={}),n||(n={});const{pathEnv:r,pathExt:s,pathExtExe:i}=z(e,n),o=[],l=c=>new Promise((a,f)=>{if(c===r.length)return n.all&&o.length?a(o):f(W(e));const d=r[c],h=/^".*"$/.test(d)?d.slice(1,-1):d,p=k.join(h,e),_=!h&&/^\.[\\\/]/.test(e)?e.slice(0,2)+p:p;a(u(_,c,0))}),u=(c,a,f)=>new Promise((d,h)=>{if(f===s.length)return d(l(a+1));const p=s[f];F(c+p,{pathExt:i},(_,x)=>{if(!_&&x)if(n.all)o.push(c+p);else return d(c+p);return d(u(c,a,f+1))})});return t?l(0).then(c=>t(null,c),t):l(0)},oe=(e,n)=>{n=n||{};const{pathEnv:t,pathExt:r,pathExtExe:s}=z(e,n),i=[];for(let o=0;o<t.length;o++){const l=t[o],u=/^".*"$/.test(l)?l.slice(1,-1):l,c=k.join(u,e),a=!u&&/^\.[\\\/]/.test(e)?e.slice(0,2)+c:c;for(let f=0;f<r.length;f++){const d=a+r[f];try{if(F.sync(d,{pathExt:s}))if(n.all)i.push(d);else return d}catch{}}}if(n.all&&i.length)return i;if(n.nothrow)return null;throw W(e)};var ie=U;U.sync=oe;var T={exports:{}},ce={};const q=(e={})=>{const n=e.env||ce;return(e.platform||process.platform)!=="win32"?"PATH":Object.keys(n).reverse().find(r=>r.toUpperCase()==="PATH")||"Path"};T.exports=q;T.exports.default=q;var ae=T.exports,le={};const I=v,ue=ie,fe=ae;function B(e,n){const t=e.options.env||le,r=process.cwd(),s=e.options.cwd!=null,i=s&&process.chdir!==void 0&&!process.chdir.disabled;if(i)try{process.chdir(e.options.cwd)}catch{}let o;try{o=ue.sync(e.command,{path:t[fe({env:t})],pathExt:n?I.delimiter:void 0})}catch{}finally{i&&process.chdir(r)}return o&&(o=I.resolve(s?e.options.cwd:"",o)),o}function de(e){return B(e)||B(e,!0)}var he=de,O={};const C=/([()\][%!^"`<>&|;, *?])/g;function pe(e){return e=e.replace(C,"^$1"),e}function ve(e,n){return e=`${e}`,e=e.replace(/(?=(\\+?)?)\1"/g,'$1$1\\"'),e=e.replace(/(?=(\\+?)?)\1$/,"$1$1"),e=`"${e}"`,e=e.replace(C,"^$1"),n&&(e=e.replace(C,"^$1")),e}O.command=pe;O.argument=ve;var me=/^#!(.*)/;const Ee=me;var _e=(e="")=>{const n=e.match(Ee);if(!n)return null;const[t,r]=n[0].replace(/#! ?/,"").split(" "),s=t.split("/").pop();return s==="env"?r:r?`${s} ${r}`:s};const $=v,we=_e;function ge(e){const t=Buffer.alloc(150);let r;try{r=$.openSync(e,"r"),$.readSync(r,t,0,150,0),$.closeSync(r)}catch{}return we(t.toString())}var ye=ge,xe={};const Se=v,D=he,L=O,be=ye,$e=process.platform==="win32",Ce=/\.(?:com|exe)$/i,Pe=/node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;function Te(e){e.file=D(e);const n=e.file&&be(e.file);return n?(e.args.unshift(e.file),e.command=n,D(e)):e.file}function Oe(e){if(!$e)return e;const n=Te(e),t=!Ce.test(n);if(e.options.forceShell||t){const r=Pe.test(n);e.command=Se.normalize(e.command),e.command=L.command(e.command),e.args=e.args.map(i=>L.argument(i,r));const s=[e.command].concat(e.args).join(" ");e.args=["/d","/s","/c",`"${s}"`],e.command=xe.comspec||"cmd.exe",e.options.windowsVerbatimArguments=!0}return e}function Ae(e,n,t){n&&!Array.isArray(n)&&(t=n,n=null),n=n?n.slice(0):[],t=Object.assign({},t);const r={command:e,args:n,options:t,file:void 0,original:{command:e,args:n}};return t.shell?r:Oe(r)}var Ne=Ae;const A=process.platform==="win32";function N(e,n){return Object.assign(new Error(`${n} ${e.command} ENOENT`),{code:"ENOENT",errno:"ENOENT",syscall:`${n} ${e.command}`,path:e.command,spawnargs:e.args})}function Re(e,n){if(!A)return;const t=e.emit;e.emit=function(r,s){if(r==="exit"){const i=V(s,n);if(i)return t.call(e,"error",i)}return t.apply(e,arguments)}}function V(e,n){return A&&e===1&&!n.file?N(n.original,"spawn"):null}function Me(e,n){return A&&e===1&&!n.file?N(n.original,"spawnSync"):null}var He={hookChildProcess:Re,verifyENOENT:V,verifyENOENTSync:Me,notFoundError:N};const G=v,R=Ne,M=He;function J(e,n,t){const r=R(e,n,t),s=G.spawn(r.command,r.args,r.options);return M.hookChildProcess(s,r),s}function je(e,n,t){const r=R(e,n,t),s=G.spawnSync(r.command,r.args,r.options);return s.error=s.error||M.verifyENOENTSync(s.status,r),s}E.exports=J;E.exports.spawn=J;E.exports.sync=je;E.exports._parse=R;E.exports._enoent=M;var Ie=E.exports;const Be=X(Ie);class De{append(n){this._buffer=this._buffer?Buffer.concat([this._buffer,n]):n}readMessage(){if(!this._buffer)return null;const n=this._buffer.indexOf(`
`);if(n===-1)return null;const t=this._buffer.toString("utf8",0,n).replace(/\r$/,"");return this._buffer=this._buffer.subarray(n+1),Le(t)}clear(){this._buffer=void 0}}function Le(e){return Q.parse(JSON.parse(e))}function ke(e){return JSON.stringify(e)+`
`}const Fe=w.platform==="win32"?["APPDATA","HOMEDRIVE","HOMEPATH","LOCALAPPDATA","PATH","PROCESSOR_ARCHITECTURE","SYSTEMDRIVE","SYSTEMROOT","TEMP","USERNAME","USERPROFILE"]:["HOME","LOGNAME","PATH","SHELL","TERM","USER"];function We(){const e={};for(const n of Fe){const t=w.env[n];t!==void 0&&(t.startsWith("()")||(e[n]=t))}return e}class Ve{constructor(n){this._abortController=new AbortController,this._readBuffer=new De,this._serverParams=n}async start(){if(this._process)throw new Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");return new Promise((n,t)=>{var r,s,i,o,l,u;this._process=Be(this._serverParams.command,(r=this._serverParams.args)!==null&&r!==void 0?r:[],{env:(s=this._serverParams.env)!==null&&s!==void 0?s:We(),stdio:["pipe","pipe",(i=this._serverParams.stderr)!==null&&i!==void 0?i:"inherit"],shell:!1,signal:this._abortController.signal,windowsHide:w.platform==="win32"&&ze(),cwd:this._serverParams.cwd}),this._process.on("error",c=>{var a,f;if(c.name==="AbortError"){(a=this.onclose)===null||a===void 0||a.call(this);return}t(c),(f=this.onerror)===null||f===void 0||f.call(this,c)}),this._process.on("spawn",()=>{n()}),this._process.on("close",c=>{var a;this._process=void 0,(a=this.onclose)===null||a===void 0||a.call(this)}),(o=this._process.stdin)===null||o===void 0||o.on("error",c=>{var a;(a=this.onerror)===null||a===void 0||a.call(this,c)}),(l=this._process.stdout)===null||l===void 0||l.on("data",c=>{this._readBuffer.append(c),this.processReadBuffer()}),(u=this._process.stdout)===null||u===void 0||u.on("error",c=>{var a;(a=this.onerror)===null||a===void 0||a.call(this,c)})})}get stderr(){var n,t;return(t=(n=this._process)===null||n===void 0?void 0:n.stderr)!==null&&t!==void 0?t:null}processReadBuffer(){for(var n,t;;)try{const r=this._readBuffer.readMessage();if(r===null)break;(n=this.onmessage)===null||n===void 0||n.call(this,r)}catch(r){(t=this.onerror)===null||t===void 0||t.call(this,r)}}async close(){this._abortController.abort(),this._process=void 0,this._readBuffer.clear()}send(n){return new Promise(t=>{var r;if(!(!((r=this._process)===null||r===void 0)&&r.stdin))throw new Error("Not connected");const s=ke(n);this._process.stdin.write(s)?t():this._process.stdin.once("drain",t)})}}function ze(){return"type"in w}export{Fe as DEFAULT_INHERITED_ENV_VARS,Ve as StdioClientTransport,We as getDefaultEnvironment};
