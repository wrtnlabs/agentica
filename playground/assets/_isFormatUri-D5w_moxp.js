var Du=Object.defineProperty;var Lu=(e,t,n)=>t in e?Du(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var Pt=(e,t,n)=>Lu(e,typeof t!="symbol"?t+"":t,n);import{g as Mu,n as bo,u as Qn,o as $n,p as Bu,P as Xn,q as Gu,r as Fu,s as So,t as Hu,v as Ju,w as Uu,M as ju,x as $u,A as Ct,H as qu,C as mi,j as Vu,_ as bn,y as zu,B as qn,a as Wu,I as Hr,z as Yu}from"./index-OZsaCgkq.js";import{O as Ku,x as Qu,r as W,j as E,e as de,z as te,f as Oe,P as Xu,g as _e,a as ve,u as xe,Q as Zu,S as el,d as Zi,s as fe,m as we,n as nt,B as Li,D as nn,c as It,i as Me,h as tl,C as nl,A as il,M as rl,N as Vn,q as Ao,R as er,T as it}from"./client-CpqWRuez.js";const al=Ku();function ol({props:e,name:t,defaultTheme:n,themeId:i}){let r=Qu(n);return i&&(r=r[i]||r),Mu({theme:r,name:t,props:e})}const sl=Xu(),ul=al("div",{name:"MuiContainer",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[`maxWidth${te(String(n.maxWidth))}`],n.fixed&&t.fixed,n.disableGutters&&t.disableGutters]}}),ll=e=>ol({props:e,name:"MuiContainer",defaultTheme:sl}),cl=(e,t)=>{const n=l=>_e(t,l),{classes:i,fixed:r,disableGutters:a,maxWidth:o}=e,u={root:["root",o&&`maxWidth${te(String(o))}`,r&&"fixed",a&&"disableGutters"]};return Oe(u,n,i)};function pl(e={}){const{createStyledComponent:t=ul,useThemeProps:n=ll,componentName:i="MuiContainer"}=e,r=t(({theme:o,ownerState:u})=>({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",...!u.disableGutters&&{paddingLeft:o.spacing(2),paddingRight:o.spacing(2),[o.breakpoints.up("sm")]:{paddingLeft:o.spacing(3),paddingRight:o.spacing(3)}}}),({theme:o,ownerState:u})=>u.fixed&&Object.keys(o.breakpoints.values).reduce((l,c)=>{const p=c,d=o.breakpoints.values[p];return d!==0&&(l[o.breakpoints.up(p)]={maxWidth:`${d}${o.breakpoints.unit}`}),l},{}),({theme:o,ownerState:u})=>({...u.maxWidth==="xs"&&{[o.breakpoints.up("xs")]:{maxWidth:Math.max(o.breakpoints.values.xs,444)}},...u.maxWidth&&u.maxWidth!=="xs"&&{[o.breakpoints.up(u.maxWidth)]:{maxWidth:`${o.breakpoints.values[u.maxWidth]}${o.breakpoints.unit}`}}}));return W.forwardRef(function(u,l){const c=n(u),{className:p,component:d="div",disableGutters:I=!1,fixed:f=!1,maxWidth:A="lg",classes:_,...M}=c,x={...c,component:d,disableGutters:I,fixed:f,maxWidth:A},V=cl(x,i);return E.jsx(r,{as:d,ownerState:x,className:de(V.root,p),ref:l,...M})})}function hl(e){return _e("MuiCollapse",e)}ve("MuiCollapse",["root","horizontal","vertical","entered","hidden","wrapper","wrapperInner"]);const dl=e=>{const{orientation:t,classes:n}=e,i={root:["root",`${t}`],entered:["entered"],hidden:["hidden"],wrapper:["wrapper",`${t}`],wrapperInner:["wrapperInner",`${t}`]};return Oe(i,hl,n)},fl=fe("div",{name:"MuiCollapse",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[n.orientation],n.state==="entered"&&t.entered,n.state==="exited"&&!n.in&&n.collapsedSize==="0px"&&t.hidden]}})(we(({theme:e})=>({height:0,overflow:"hidden",transition:e.transitions.create("height"),variants:[{props:{orientation:"horizontal"},style:{height:"auto",width:0,transition:e.transitions.create("width")}},{props:{state:"entered"},style:{height:"auto",overflow:"visible"}},{props:{state:"entered",orientation:"horizontal"},style:{width:"auto"}},{props:({ownerState:t})=>t.state==="exited"&&!t.in&&t.collapsedSize==="0px",style:{visibility:"hidden"}}]}))),ml=fe("div",{name:"MuiCollapse",slot:"Wrapper",overridesResolver:(e,t)=>t.wrapper})({display:"flex",width:"100%",variants:[{props:{orientation:"horizontal"},style:{width:"auto",height:"100%"}}]}),Il=fe("div",{name:"MuiCollapse",slot:"WrapperInner",overridesResolver:(e,t)=>t.wrapperInner})({width:"100%",variants:[{props:{orientation:"horizontal"},style:{width:"auto",height:"100%"}}]}),fn=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiCollapse"}),{addEndListener:r,children:a,className:o,collapsedSize:u="0px",component:l,easing:c,in:p,onEnter:d,onEntered:I,onEntering:f,onExit:A,onExited:_,onExiting:M,orientation:x="vertical",style:V,timeout:R=Zu.standard,TransitionComponent:K=bo,...X}=i,v={...i,orientation:x,collapsedSize:u},j=dl(v),L=Qn(),H=el(),J=W.useRef(null),T=W.useRef(),F=typeof u=="number"?`${u}px`:u,h=x==="horizontal",C=h?"width":"height",O=W.useRef(null),z=Zi(n,O),Y=Z=>Ce=>{if(Z){const ge=O.current;Ce===void 0?Z(ge):Z(ge,Ce)}},U=()=>J.current?J.current[h?"clientWidth":"clientHeight"]:0,Q=Y((Z,Ce)=>{J.current&&h&&(J.current.style.position="absolute"),Z.style[C]=F,d&&d(Z,Ce)}),b=Y((Z,Ce)=>{const ge=U();J.current&&h&&(J.current.style.position="");const{duration:$e,easing:Ye}=$n({style:V,timeout:R,easing:c},{mode:"enter"});if(R==="auto"){const bt=L.transitions.getAutoHeightDuration(ge);Z.style.transitionDuration=`${bt}ms`,T.current=bt}else Z.style.transitionDuration=typeof $e=="string"?$e:`${$e}ms`;Z.style[C]=`${ge}px`,Z.style.transitionTimingFunction=Ye,f&&f(Z,Ce)}),Se=Y((Z,Ce)=>{Z.style[C]="auto",I&&I(Z,Ce)}),Fe=Y(Z=>{Z.style[C]=`${U()}px`,A&&A(Z)}),S=Y(_),Ne=Y(Z=>{const Ce=U(),{duration:ge,easing:$e}=$n({style:V,timeout:R,easing:c},{mode:"exit"});if(R==="auto"){const Ye=L.transitions.getAutoHeightDuration(Ce);Z.style.transitionDuration=`${Ye}ms`,T.current=Ye}else Z.style.transitionDuration=typeof ge=="string"?ge:`${ge}ms`;Z.style[C]=F,Z.style.transitionTimingFunction=$e,M&&M(Z)}),st=Z=>{R==="auto"&&H.start(T.current||0,Z),r&&r(O.current,Z)};return E.jsx(K,{in:p,onEnter:Q,onEntered:Se,onEntering:b,onExit:Fe,onExited:S,onExiting:Ne,addEndListener:st,nodeRef:O,timeout:R==="auto"?null:R,...X,children:(Z,{ownerState:Ce,...ge})=>E.jsx(fl,{as:l,className:de(j.root,o,{entered:j.entered,exited:!p&&F==="0px"&&j.hidden}[Z]),style:{[h?"minWidth":"minHeight"]:F,...V},ref:z,ownerState:{...v,state:Z},...ge,children:E.jsx(ml,{ownerState:{...v,state:Z},className:j.wrapper,ref:J,children:E.jsx(Il,{ownerState:{...v,state:Z},className:j.wrapperInner,children:a})})})})});fn&&(fn.muiSupportAuto=!0);const Eo=W.createContext({});function gl(e){return _e("MuiAccordion",e)}const _n=ve("MuiAccordion",["root","heading","rounded","expanded","disabled","gutters","region"]),yl=e=>{const{classes:t,square:n,expanded:i,disabled:r,disableGutters:a}=e;return Oe({root:["root",!n&&"rounded",i&&"expanded",r&&"disabled",!a&&"gutters"],heading:["heading"],region:["region"]},gl,t)},bl=fe(Xn,{name:"MuiAccordion",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[{[`& .${_n.region}`]:t.region},t.root,!n.square&&t.rounded,!n.disableGutters&&t.gutters]}})(we(({theme:e})=>{const t={duration:e.transitions.duration.shortest};return{position:"relative",transition:e.transitions.create(["margin"],t),overflowAnchor:"none","&::before":{position:"absolute",left:0,top:-1,right:0,height:1,content:'""',opacity:1,backgroundColor:(e.vars||e).palette.divider,transition:e.transitions.create(["opacity","background-color"],t)},"&:first-of-type":{"&::before":{display:"none"}},[`&.${_n.expanded}`]:{"&::before":{opacity:0},"&:first-of-type":{marginTop:0},"&:last-of-type":{marginBottom:0},"& + &":{"&::before":{display:"none"}}},[`&.${_n.disabled}`]:{backgroundColor:(e.vars||e).palette.action.disabledBackground}}}),we(({theme:e})=>({variants:[{props:t=>!t.square,style:{borderRadius:0,"&:first-of-type":{borderTopLeftRadius:(e.vars||e).shape.borderRadius,borderTopRightRadius:(e.vars||e).shape.borderRadius},"&:last-of-type":{borderBottomLeftRadius:(e.vars||e).shape.borderRadius,borderBottomRightRadius:(e.vars||e).shape.borderRadius,"@supports (-ms-ime-align: auto)":{borderBottomLeftRadius:0,borderBottomRightRadius:0}}}},{props:t=>!t.disableGutters,style:{[`&.${_n.expanded}`]:{margin:"16px 0"}}}]}))),Sl=fe("h3",{name:"MuiAccordion",slot:"Heading",overridesResolver:(e,t)=>t.heading})({all:"unset"}),Al=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiAccordion"}),{children:r,className:a,defaultExpanded:o=!1,disabled:u=!1,disableGutters:l=!1,expanded:c,onChange:p,square:d=!1,slots:I={},slotProps:f={},TransitionComponent:A,TransitionProps:_,...M}=i,[x,V]=Bu({controlled:c,default:o,name:"Accordion",state:"expanded"}),R=W.useCallback(U=>{V(!x),p&&p(U,!x)},[x,p,V]),[K,...X]=W.Children.toArray(r),v=W.useMemo(()=>({expanded:x,disabled:u,disableGutters:l,toggle:R}),[x,u,l,R]),j={...i,square:d,disabled:u,disableGutters:l,expanded:x},L=yl(j),H={transition:A,...I},J={transition:_,...f},T={slots:H,slotProps:J},[F,h]=nt("root",{elementType:bl,externalForwardedProps:{...T,...M},className:de(L.root,a),shouldForwardComponentProp:!0,ownerState:j,ref:n,additionalProps:{square:d}}),[C,O]=nt("heading",{elementType:Sl,externalForwardedProps:T,className:L.heading,ownerState:j}),[z,Y]=nt("transition",{elementType:fn,externalForwardedProps:T,ownerState:j});return E.jsxs(F,{...h,children:[E.jsx(C,{...O,children:E.jsx(Eo.Provider,{value:v,children:K})}),E.jsx(z,{in:x,timeout:"auto",...Y,children:E.jsx("div",{"aria-labelledby":K.props.id,id:K.props["aria-controls"],role:"region",className:L.region,children:X})})]})});function El(e){return _e("MuiAccordionDetails",e)}ve("MuiAccordionDetails",["root"]);const Tl=e=>{const{classes:t}=e;return Oe({root:["root"]},El,t)},Cl=fe("div",{name:"MuiAccordionDetails",slot:"Root",overridesResolver:(e,t)=>t.root})(we(({theme:e})=>({padding:e.spacing(1,2,2)}))),kl=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiAccordionDetails"}),{className:r,...a}=i,o=i,u=Tl(o);return E.jsx(Cl,{className:de(u.root,r),ref:n,ownerState:o,...a})});function Ol(e){return _e("MuiAccordionSummary",e)}const Dt=ve("MuiAccordionSummary",["root","expanded","focusVisible","disabled","gutters","contentGutters","content","expandIconWrapper"]),_l=e=>{const{classes:t,expanded:n,disabled:i,disableGutters:r}=e;return Oe({root:["root",n&&"expanded",i&&"disabled",!r&&"gutters"],focusVisible:["focusVisible"],content:["content",n&&"expanded",!r&&"contentGutters"],expandIconWrapper:["expandIconWrapper",n&&"expanded"]},Ol,t)},xl=fe(Li,{name:"MuiAccordionSummary",slot:"Root",overridesResolver:(e,t)=>t.root})(we(({theme:e})=>{const t={duration:e.transitions.duration.shortest};return{display:"flex",width:"100%",minHeight:48,padding:e.spacing(0,2),transition:e.transitions.create(["min-height","background-color"],t),[`&.${Dt.focusVisible}`]:{backgroundColor:(e.vars||e).palette.action.focus},[`&.${Dt.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity},[`&:hover:not(.${Dt.disabled})`]:{cursor:"pointer"},variants:[{props:n=>!n.disableGutters,style:{[`&.${Dt.expanded}`]:{minHeight:64}}}]}})),Nl=fe("span",{name:"MuiAccordionSummary",slot:"Content",overridesResolver:(e,t)=>t.content})(we(({theme:e})=>({display:"flex",textAlign:"start",flexGrow:1,margin:"12px 0",variants:[{props:t=>!t.disableGutters,style:{transition:e.transitions.create(["margin"],{duration:e.transitions.duration.shortest}),[`&.${Dt.expanded}`]:{margin:"20px 0"}}}]}))),vl=fe("span",{name:"MuiAccordionSummary",slot:"ExpandIconWrapper",overridesResolver:(e,t)=>t.expandIconWrapper})(we(({theme:e})=>({display:"flex",color:(e.vars||e).palette.action.active,transform:"rotate(0deg)",transition:e.transitions.create("transform",{duration:e.transitions.duration.shortest}),[`&.${Dt.expanded}`]:{transform:"rotate(180deg)"}}))),Rl=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiAccordionSummary"}),{children:r,className:a,expandIcon:o,focusVisibleClassName:u,onClick:l,slots:c,slotProps:p,...d}=i,{disabled:I=!1,disableGutters:f,expanded:A,toggle:_}=W.useContext(Eo),M=J=>{_&&_(J),l&&l(J)},x={...i,expanded:A,disabled:I,disableGutters:f},V=_l(x),R={slots:c,slotProps:p},[K,X]=nt("root",{ref:n,shouldForwardComponentProp:!0,className:de(V.root,a),elementType:xl,externalForwardedProps:{...R,...d},ownerState:x,additionalProps:{focusRipple:!1,disableRipple:!0,disabled:I,"aria-expanded":A,focusVisibleClassName:de(V.focusVisible,u)},getSlotProps:J=>({...J,onClick:T=>{var F;(F=J.onClick)==null||F.call(J,T),M(T)}})}),[v,j]=nt("content",{className:V.content,elementType:Nl,externalForwardedProps:R,ownerState:x}),[L,H]=nt("expandIconWrapper",{className:V.expandIconWrapper,elementType:vl,externalForwardedProps:R,ownerState:x});return E.jsxs(K,{...X,children:[E.jsx(v,{...j,children:r}),o&&E.jsx(L,{...H,children:o})]})});function Pl(e){return _e("MuiAppBar",e)}ve("MuiAppBar",["root","positionFixed","positionAbsolute","positionSticky","positionStatic","positionRelative","colorDefault","colorPrimary","colorSecondary","colorInherit","colorTransparent","colorError","colorInfo","colorSuccess","colorWarning"]);const wl=e=>{const{color:t,position:n,classes:i}=e,r={root:["root",`color${te(t)}`,`position${te(n)}`]};return Oe(r,Pl,i)},Jr=(e,t)=>e?`${e==null?void 0:e.replace(")","")}, ${t})`:t,Dl=fe(Xn,{name:"MuiAppBar",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[`position${te(n.position)}`],t[`color${te(n.color)}`]]}})(we(({theme:e})=>({display:"flex",flexDirection:"column",width:"100%",boxSizing:"border-box",flexShrink:0,variants:[{props:{position:"fixed"},style:{position:"fixed",zIndex:(e.vars||e).zIndex.appBar,top:0,left:"auto",right:0,"@media print":{position:"absolute"}}},{props:{position:"absolute"},style:{position:"absolute",zIndex:(e.vars||e).zIndex.appBar,top:0,left:"auto",right:0}},{props:{position:"sticky"},style:{position:"sticky",zIndex:(e.vars||e).zIndex.appBar,top:0,left:"auto",right:0}},{props:{position:"static"},style:{position:"static"}},{props:{position:"relative"},style:{position:"relative"}},{props:{color:"inherit"},style:{"--AppBar-color":"inherit"}},{props:{color:"default"},style:{"--AppBar-background":e.vars?e.vars.palette.AppBar.defaultBg:e.palette.grey[100],"--AppBar-color":e.vars?e.vars.palette.text.primary:e.palette.getContrastText(e.palette.grey[100]),...e.applyStyles("dark",{"--AppBar-background":e.vars?e.vars.palette.AppBar.defaultBg:e.palette.grey[900],"--AppBar-color":e.vars?e.vars.palette.text.primary:e.palette.getContrastText(e.palette.grey[900])})}},...Object.entries(e.palette).filter(nn(["contrastText"])).map(([t])=>({props:{color:t},style:{"--AppBar-background":(e.vars??e).palette[t].main,"--AppBar-color":(e.vars??e).palette[t].contrastText}})),{props:t=>t.enableColorOnDark===!0&&!["inherit","transparent"].includes(t.color),style:{backgroundColor:"var(--AppBar-background)",color:"var(--AppBar-color)"}},{props:t=>t.enableColorOnDark===!1&&!["inherit","transparent"].includes(t.color),style:{backgroundColor:"var(--AppBar-background)",color:"var(--AppBar-color)",...e.applyStyles("dark",{backgroundColor:e.vars?Jr(e.vars.palette.AppBar.darkBg,"var(--AppBar-background)"):null,color:e.vars?Jr(e.vars.palette.AppBar.darkColor,"var(--AppBar-color)"):null})}},{props:{color:"transparent"},style:{"--AppBar-background":"transparent","--AppBar-color":"inherit",backgroundColor:"var(--AppBar-background)",color:"var(--AppBar-color)",...e.applyStyles("dark",{backgroundImage:"none"})}}]}))),Ur=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiAppBar"}),{className:r,color:a="primary",enableColorOnDark:o=!1,position:u="fixed",...l}=i,c={...i,color:a,position:u,enableColorOnDark:o},p=wl(c);return E.jsx(Dl,{square:!0,component:"header",ownerState:c,elevation:4,className:de(p.root,r,u==="fixed"&&"mui-fixed"),ref:n,...l})}),Ll=It(E.jsx("path",{d:"M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"}),"Cancel");function Ml(e){return _e("MuiChip",e)}const oe=ve("MuiChip",["root","sizeSmall","sizeMedium","colorDefault","colorError","colorInfo","colorPrimary","colorSecondary","colorSuccess","colorWarning","disabled","clickable","clickableColorPrimary","clickableColorSecondary","deletable","deletableColorPrimary","deletableColorSecondary","outlined","filled","outlinedPrimary","outlinedSecondary","filledPrimary","filledSecondary","avatar","avatarSmall","avatarMedium","avatarColorPrimary","avatarColorSecondary","icon","iconSmall","iconMedium","iconColorPrimary","iconColorSecondary","label","labelSmall","labelMedium","deleteIcon","deleteIconSmall","deleteIconMedium","deleteIconColorPrimary","deleteIconColorSecondary","deleteIconOutlinedColorPrimary","deleteIconOutlinedColorSecondary","deleteIconFilledColorPrimary","deleteIconFilledColorSecondary","focusVisible"]),Bl=e=>{const{classes:t,disabled:n,size:i,color:r,iconColor:a,onDelete:o,clickable:u,variant:l}=e,c={root:["root",l,n&&"disabled",`size${te(i)}`,`color${te(r)}`,u&&"clickable",u&&`clickableColor${te(r)}`,o&&"deletable",o&&`deletableColor${te(r)}`,`${l}${te(r)}`],label:["label",`label${te(i)}`],avatar:["avatar",`avatar${te(i)}`,`avatarColor${te(r)}`],icon:["icon",`icon${te(i)}`,`iconColor${te(a)}`],deleteIcon:["deleteIcon",`deleteIcon${te(i)}`,`deleteIconColor${te(r)}`,`deleteIcon${te(l)}Color${te(r)}`]};return Oe(c,Ml,t)},Gl=fe("div",{name:"MuiChip",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e,{color:i,iconColor:r,clickable:a,onDelete:o,size:u,variant:l}=n;return[{[`& .${oe.avatar}`]:t.avatar},{[`& .${oe.avatar}`]:t[`avatar${te(u)}`]},{[`& .${oe.avatar}`]:t[`avatarColor${te(i)}`]},{[`& .${oe.icon}`]:t.icon},{[`& .${oe.icon}`]:t[`icon${te(u)}`]},{[`& .${oe.icon}`]:t[`iconColor${te(r)}`]},{[`& .${oe.deleteIcon}`]:t.deleteIcon},{[`& .${oe.deleteIcon}`]:t[`deleteIcon${te(u)}`]},{[`& .${oe.deleteIcon}`]:t[`deleteIconColor${te(i)}`]},{[`& .${oe.deleteIcon}`]:t[`deleteIcon${te(l)}Color${te(i)}`]},t.root,t[`size${te(u)}`],t[`color${te(i)}`],a&&t.clickable,a&&i!=="default"&&t[`clickableColor${te(i)})`],o&&t.deletable,o&&i!=="default"&&t[`deletableColor${te(i)}`],t[l],t[`${l}${te(i)}`]]}})(we(({theme:e})=>{const t=e.palette.mode==="light"?e.palette.grey[700]:e.palette.grey[300];return{maxWidth:"100%",fontFamily:e.typography.fontFamily,fontSize:e.typography.pxToRem(13),display:"inline-flex",alignItems:"center",justifyContent:"center",height:32,color:(e.vars||e).palette.text.primary,backgroundColor:(e.vars||e).palette.action.selected,borderRadius:32/2,whiteSpace:"nowrap",transition:e.transitions.create(["background-color","box-shadow"]),cursor:"unset",outline:0,textDecoration:"none",border:0,padding:0,verticalAlign:"middle",boxSizing:"border-box",[`&.${oe.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity,pointerEvents:"none"},[`& .${oe.avatar}`]:{marginLeft:5,marginRight:-6,width:24,height:24,color:e.vars?e.vars.palette.Chip.defaultAvatarColor:t,fontSize:e.typography.pxToRem(12)},[`& .${oe.avatarColorPrimary}`]:{color:(e.vars||e).palette.primary.contrastText,backgroundColor:(e.vars||e).palette.primary.dark},[`& .${oe.avatarColorSecondary}`]:{color:(e.vars||e).palette.secondary.contrastText,backgroundColor:(e.vars||e).palette.secondary.dark},[`& .${oe.avatarSmall}`]:{marginLeft:4,marginRight:-4,width:18,height:18,fontSize:e.typography.pxToRem(10)},[`& .${oe.icon}`]:{marginLeft:5,marginRight:-6},[`& .${oe.deleteIcon}`]:{WebkitTapHighlightColor:"transparent",color:e.vars?`rgba(${e.vars.palette.text.primaryChannel} / 0.26)`:Me(e.palette.text.primary,.26),fontSize:22,cursor:"pointer",margin:"0 5px 0 -6px","&:hover":{color:e.vars?`rgba(${e.vars.palette.text.primaryChannel} / 0.4)`:Me(e.palette.text.primary,.4)}},variants:[{props:{size:"small"},style:{height:24,[`& .${oe.icon}`]:{fontSize:18,marginLeft:4,marginRight:-4},[`& .${oe.deleteIcon}`]:{fontSize:16,marginRight:4,marginLeft:-4}}},...Object.entries(e.palette).filter(nn(["contrastText"])).map(([n])=>({props:{color:n},style:{backgroundColor:(e.vars||e).palette[n].main,color:(e.vars||e).palette[n].contrastText,[`& .${oe.deleteIcon}`]:{color:e.vars?`rgba(${e.vars.palette[n].contrastTextChannel} / 0.7)`:Me(e.palette[n].contrastText,.7),"&:hover, &:active":{color:(e.vars||e).palette[n].contrastText}}}})),{props:n=>n.iconColor===n.color,style:{[`& .${oe.icon}`]:{color:e.vars?e.vars.palette.Chip.defaultIconColor:t}}},{props:n=>n.iconColor===n.color&&n.color!=="default",style:{[`& .${oe.icon}`]:{color:"inherit"}}},{props:{onDelete:!0},style:{[`&.${oe.focusVisible}`]:{backgroundColor:e.vars?`rgba(${e.vars.palette.action.selectedChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.focusOpacity}))`:Me(e.palette.action.selected,e.palette.action.selectedOpacity+e.palette.action.focusOpacity)}}},...Object.entries(e.palette).filter(nn(["dark"])).map(([n])=>({props:{color:n,onDelete:!0},style:{[`&.${oe.focusVisible}`]:{background:(e.vars||e).palette[n].dark}}})),{props:{clickable:!0},style:{userSelect:"none",WebkitTapHighlightColor:"transparent",cursor:"pointer","&:hover":{backgroundColor:e.vars?`rgba(${e.vars.palette.action.selectedChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.hoverOpacity}))`:Me(e.palette.action.selected,e.palette.action.selectedOpacity+e.palette.action.hoverOpacity)},[`&.${oe.focusVisible}`]:{backgroundColor:e.vars?`rgba(${e.vars.palette.action.selectedChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.focusOpacity}))`:Me(e.palette.action.selected,e.palette.action.selectedOpacity+e.palette.action.focusOpacity)},"&:active":{boxShadow:(e.vars||e).shadows[1]}}},...Object.entries(e.palette).filter(nn(["dark"])).map(([n])=>({props:{color:n,clickable:!0},style:{[`&:hover, &.${oe.focusVisible}`]:{backgroundColor:(e.vars||e).palette[n].dark}}})),{props:{variant:"outlined"},style:{backgroundColor:"transparent",border:e.vars?`1px solid ${e.vars.palette.Chip.defaultBorder}`:`1px solid ${e.palette.mode==="light"?e.palette.grey[400]:e.palette.grey[700]}`,[`&.${oe.clickable}:hover`]:{backgroundColor:(e.vars||e).palette.action.hover},[`&.${oe.focusVisible}`]:{backgroundColor:(e.vars||e).palette.action.focus},[`& .${oe.avatar}`]:{marginLeft:4},[`& .${oe.avatarSmall}`]:{marginLeft:2},[`& .${oe.icon}`]:{marginLeft:4},[`& .${oe.iconSmall}`]:{marginLeft:2},[`& .${oe.deleteIcon}`]:{marginRight:5},[`& .${oe.deleteIconSmall}`]:{marginRight:3}}},...Object.entries(e.palette).filter(nn()).map(([n])=>({props:{variant:"outlined",color:n},style:{color:(e.vars||e).palette[n].main,border:`1px solid ${e.vars?`rgba(${e.vars.palette[n].mainChannel} / 0.7)`:Me(e.palette[n].main,.7)}`,[`&.${oe.clickable}:hover`]:{backgroundColor:e.vars?`rgba(${e.vars.palette[n].mainChannel} / ${e.vars.palette.action.hoverOpacity})`:Me(e.palette[n].main,e.palette.action.hoverOpacity)},[`&.${oe.focusVisible}`]:{backgroundColor:e.vars?`rgba(${e.vars.palette[n].mainChannel} / ${e.vars.palette.action.focusOpacity})`:Me(e.palette[n].main,e.palette.action.focusOpacity)},[`& .${oe.deleteIcon}`]:{color:e.vars?`rgba(${e.vars.palette[n].mainChannel} / 0.7)`:Me(e.palette[n].main,.7),"&:hover, &:active":{color:(e.vars||e).palette[n].main}}}}))]}})),Fl=fe("span",{name:"MuiChip",slot:"Label",overridesResolver:(e,t)=>{const{ownerState:n}=e,{size:i}=n;return[t.label,t[`label${te(i)}`]]}})({overflow:"hidden",textOverflow:"ellipsis",paddingLeft:12,paddingRight:12,whiteSpace:"nowrap",variants:[{props:{variant:"outlined"},style:{paddingLeft:11,paddingRight:11}},{props:{size:"small"},style:{paddingLeft:8,paddingRight:8}},{props:{size:"small",variant:"outlined"},style:{paddingLeft:7,paddingRight:7}}]});function jr(e){return e.key==="Backspace"||e.key==="Delete"}const tr=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiChip"}),{avatar:r,className:a,clickable:o,color:u="default",component:l,deleteIcon:c,disabled:p=!1,icon:d,label:I,onClick:f,onDelete:A,onKeyDown:_,onKeyUp:M,size:x="medium",variant:V="filled",tabIndex:R,skipFocusWhenDisabled:K=!1,...X}=i,v=W.useRef(null),j=Zi(v,n),L=Q=>{Q.stopPropagation(),A&&A(Q)},H=Q=>{Q.currentTarget===Q.target&&jr(Q)&&Q.preventDefault(),_&&_(Q)},J=Q=>{Q.currentTarget===Q.target&&A&&jr(Q)&&A(Q),M&&M(Q)},T=o!==!1&&f?!0:o,F=T||A?Li:l||"div",h={...i,component:F,disabled:p,size:x,color:u,iconColor:W.isValidElement(d)&&d.props.color||u,onDelete:!!A,clickable:T,variant:V},C=Bl(h),O=F===Li?{component:l||"div",focusVisibleClassName:C.focusVisible,...A&&{disableRipple:!0}}:{};let z=null;A&&(z=c&&W.isValidElement(c)?W.cloneElement(c,{className:de(c.props.className,C.deleteIcon),onClick:L}):E.jsx(Ll,{className:de(C.deleteIcon),onClick:L}));let Y=null;r&&W.isValidElement(r)&&(Y=W.cloneElement(r,{className:de(C.avatar,r.props.className)}));let U=null;return d&&W.isValidElement(d)&&(U=W.cloneElement(d,{className:de(C.icon,d.props.className)})),E.jsxs(Gl,{as:F,className:de(C.root,a),disabled:T&&p?!0:void 0,onClick:f,onKeyDown:H,onKeyUp:J,ref:j,tabIndex:K&&p?-1:R,ownerState:h,...O,...X,children:[Y||U,E.jsx(Fl,{className:de(C.label),ownerState:h,children:I}),z]})});function Hl(e){return _e("MuiCard",e)}ve("MuiCard",["root"]);const Jl=e=>{const{classes:t}=e;return Oe({root:["root"]},Hl,t)},Ul=fe(Xn,{name:"MuiCard",slot:"Root",overridesResolver:(e,t)=>t.root})({overflow:"hidden"}),nr=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiCard"}),{className:r,raised:a=!1,...o}=i,u={...i,raised:a},l=Jl(u);return E.jsx(Ul,{className:de(l.root,r),elevation:a?8:void 0,ref:n,ownerState:u,...o})});function jl(e){return _e("MuiCardActions",e)}ve("MuiCardActions",["root","spacing"]);const $l=e=>{const{classes:t,disableSpacing:n}=e;return Oe({root:["root",!n&&"spacing"]},jl,t)},ql=fe("div",{name:"MuiCardActions",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,!n.disableSpacing&&t.spacing]}})({display:"flex",alignItems:"center",padding:8,variants:[{props:{disableSpacing:!1},style:{"& > :not(style) ~ :not(style)":{marginLeft:8}}}]}),To=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiCardActions"}),{disableSpacing:r=!1,className:a,...o}=i,u={...i,disableSpacing:r},l=$l(u);return E.jsx(ql,{className:de(l.root,a),ownerState:u,ref:n,...o})});function Vl(e){return _e("MuiCardContent",e)}ve("MuiCardContent",["root"]);const zl=e=>{const{classes:t}=e;return Oe({root:["root"]},Vl,t)},Wl=fe("div",{name:"MuiCardContent",slot:"Root",overridesResolver:(e,t)=>t.root})({padding:16,"&:last-child":{paddingBottom:24}}),mn=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiCardContent"}),{className:r,component:a="div",...o}=i,u={...i,component:a},l=zl(u);return E.jsx(Wl,{as:a,className:de(l.root,r),ownerState:u,ref:n,...o})}),$r=pl({createStyledComponent:fe("div",{name:"MuiContainer",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[`maxWidth${te(String(n.maxWidth))}`],n.fixed&&t.fixed,n.disableGutters&&t.disableGutters]}}),useThemeProps:e=>xe({props:e,name:"MuiContainer"})});function Yl(e,t,n){const i=t.getBoundingClientRect(),r=n&&n.getBoundingClientRect(),a=So(t);let o;if(t.fakeTransform)o=t.fakeTransform;else{const c=a.getComputedStyle(t);o=c.getPropertyValue("-webkit-transform")||c.getPropertyValue("transform")}let u=0,l=0;if(o&&o!=="none"&&typeof o=="string"){const c=o.split("(")[1].split(")")[0].split(",");u=parseInt(c[4],10),l=parseInt(c[5],10)}return e==="left"?r?`translateX(${r.right+u-i.left}px)`:`translateX(${a.innerWidth+u-i.left}px)`:e==="right"?r?`translateX(-${i.right-r.left-u}px)`:`translateX(-${i.left+i.width-u}px)`:e==="up"?r?`translateY(${r.bottom+l-i.top}px)`:`translateY(${a.innerHeight+l-i.top}px)`:r?`translateY(-${i.top-r.top+i.height-l}px)`:`translateY(-${i.top+i.height-l}px)`}function Kl(e){return typeof e=="function"?e():e}function xn(e,t,n){const i=Kl(n),r=Yl(e,t,i);r&&(t.style.webkitTransform=r,t.style.transform=r)}const Ql=W.forwardRef(function(t,n){const i=Qn(),r={enter:i.transitions.easing.easeOut,exit:i.transitions.easing.sharp},a={enter:i.transitions.duration.enteringScreen,exit:i.transitions.duration.leavingScreen},{addEndListener:o,appear:u=!0,children:l,container:c,direction:p="down",easing:d=r,in:I,onEnter:f,onEntered:A,onEntering:_,onExit:M,onExited:x,onExiting:V,style:R,timeout:K=a,TransitionComponent:X=bo,...v}=t,j=W.useRef(null),L=Zi(Gu(l),j,n),H=U=>Q=>{U&&(Q===void 0?U(j.current):U(j.current,Q))},J=H((U,Q)=>{xn(p,U,c),Hu(U),f&&f(U,Q)}),T=H((U,Q)=>{const b=$n({timeout:K,style:R,easing:d},{mode:"enter"});U.style.webkitTransition=i.transitions.create("-webkit-transform",{...b}),U.style.transition=i.transitions.create("transform",{...b}),U.style.webkitTransform="none",U.style.transform="none",_&&_(U,Q)}),F=H(A),h=H(V),C=H(U=>{const Q=$n({timeout:K,style:R,easing:d},{mode:"exit"});U.style.webkitTransition=i.transitions.create("-webkit-transform",Q),U.style.transition=i.transitions.create("transform",Q),xn(p,U,c),M&&M(U)}),O=H(U=>{U.style.webkitTransition="",U.style.transition="",x&&x(U)}),z=U=>{o&&o(j.current,U)},Y=W.useCallback(()=>{j.current&&xn(p,j.current,c)},[p,c]);return W.useEffect(()=>{if(I||p==="down"||p==="right")return;const U=Fu(()=>{j.current&&xn(p,j.current,c)}),Q=So(j.current);return Q.addEventListener("resize",U),()=>{U.clear(),Q.removeEventListener("resize",U)}},[p,I,c]),W.useEffect(()=>{I||Y()},[I,Y]),E.jsx(X,{nodeRef:j,onEnter:J,onEntered:F,onEntering:T,onExit:C,onExited:O,onExiting:h,addEndListener:z,appear:u,in:I,timeout:K,...v,children:(U,{ownerState:Q,...b})=>W.cloneElement(l,{ref:L,style:{visibility:U==="exited"&&!I?"hidden":void 0,...R,...l.props.style},...b})})});function Xl(e){return _e("MuiDrawer",e)}ve("MuiDrawer",["root","docked","paper","anchorLeft","anchorRight","anchorTop","anchorBottom","paperAnchorLeft","paperAnchorRight","paperAnchorTop","paperAnchorBottom","paperAnchorDockedLeft","paperAnchorDockedRight","paperAnchorDockedTop","paperAnchorDockedBottom","modal"]);const Co=(e,t)=>{const{ownerState:n}=e;return[t.root,(n.variant==="permanent"||n.variant==="persistent")&&t.docked,t.modal]},Zl=e=>{const{classes:t,anchor:n,variant:i}=e,r={root:["root",`anchor${te(n)}`],docked:[(i==="permanent"||i==="persistent")&&"docked"],modal:["modal"],paper:["paper",`paperAnchor${te(n)}`,i!=="temporary"&&`paperAnchorDocked${te(n)}`]};return Oe(r,Xl,t)},ec=fe(ju,{name:"MuiDrawer",slot:"Root",overridesResolver:Co})(we(({theme:e})=>({zIndex:(e.vars||e).zIndex.drawer}))),tc=fe("div",{shouldForwardProp:tl,name:"MuiDrawer",slot:"Docked",skipVariantsResolver:!1,overridesResolver:Co})({flex:"0 0 auto"}),nc=fe(Xn,{name:"MuiDrawer",slot:"Paper",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.paper,t[`paperAnchor${te(n.anchor)}`],n.variant!=="temporary"&&t[`paperAnchorDocked${te(n.anchor)}`]]}})(we(({theme:e})=>({overflowY:"auto",display:"flex",flexDirection:"column",height:"100%",flex:"1 0 auto",zIndex:(e.vars||e).zIndex.drawer,WebkitOverflowScrolling:"touch",position:"fixed",top:0,outline:0,variants:[{props:{anchor:"left"},style:{left:0}},{props:{anchor:"top"},style:{top:0,left:0,right:0,height:"auto",maxHeight:"100%"}},{props:{anchor:"right"},style:{right:0}},{props:{anchor:"bottom"},style:{top:"auto",left:0,bottom:0,right:0,height:"auto",maxHeight:"100%"}},{props:({ownerState:t})=>t.anchor==="left"&&t.variant!=="temporary",style:{borderRight:`1px solid ${(e.vars||e).palette.divider}`}},{props:({ownerState:t})=>t.anchor==="top"&&t.variant!=="temporary",style:{borderBottom:`1px solid ${(e.vars||e).palette.divider}`}},{props:({ownerState:t})=>t.anchor==="right"&&t.variant!=="temporary",style:{borderLeft:`1px solid ${(e.vars||e).palette.divider}`}},{props:({ownerState:t})=>t.anchor==="bottom"&&t.variant!=="temporary",style:{borderTop:`1px solid ${(e.vars||e).palette.divider}`}}]}))),ko={left:"right",right:"left",top:"down",bottom:"up"};function ic(e){return["left","right"].includes(e)}function rc({direction:e},t){return e==="rtl"&&ic(t)?ko[t]:t}const ac=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiDrawer"}),r=Qn(),a=Ju(),o={enter:r.transitions.duration.enteringScreen,exit:r.transitions.duration.leavingScreen},{anchor:u="left",BackdropProps:l,children:c,className:p,elevation:d=16,hideBackdrop:I=!1,ModalProps:{BackdropProps:f,...A}={},onClose:_,open:M=!1,PaperProps:x={},SlideProps:V,TransitionComponent:R,transitionDuration:K=o,variant:X="temporary",slots:v={},slotProps:j={},...L}=i,H=W.useRef(!1);W.useEffect(()=>{H.current=!0},[]);const J=rc({direction:a?"rtl":"ltr"},u),F={...i,anchor:u,elevation:d,open:M,variant:X,...L},h=Zl(F),C={slots:{transition:R,...v},slotProps:{paper:x,transition:V,...j,backdrop:Uu(j.backdrop||{...l,...f},{transitionDuration:K})}},[O,z]=nt("root",{ref:n,elementType:ec,className:de(h.root,h.modal,p),shouldForwardComponentProp:!0,ownerState:F,externalForwardedProps:{...C,...L,...A},additionalProps:{open:M,onClose:_,hideBackdrop:I,slots:{backdrop:C.slots.backdrop},slotProps:{backdrop:C.slotProps.backdrop}}}),[Y,U]=nt("paper",{elementType:nc,shouldForwardComponentProp:!0,className:de(h.paper,x.className),ownerState:F,externalForwardedProps:C,additionalProps:{elevation:X==="temporary"?d:0,square:!0}}),[Q,b]=nt("docked",{elementType:tc,ref:n,className:de(h.root,h.docked,p),ownerState:F,externalForwardedProps:C,additionalProps:L}),[Se,Fe]=nt("transition",{elementType:Ql,ownerState:F,externalForwardedProps:C,additionalProps:{in:M,direction:ko[J],timeout:K,appear:H.current}}),S=E.jsx(Y,{...U,children:c});if(X==="permanent")return E.jsx(Q,{...b,children:S});const Ne=E.jsx(Se,{...Fe,children:S});return X==="persistent"?E.jsx(Q,{...b,children:Ne}):E.jsx(O,{...z,children:Ne})}),Oo=W.createContext();function oc(e){return _e("MuiTable",e)}ve("MuiTable",["root","stickyHeader"]);const sc=e=>{const{classes:t,stickyHeader:n}=e;return Oe({root:["root",n&&"stickyHeader"]},oc,t)},uc=fe("table",{name:"MuiTable",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,n.stickyHeader&&t.stickyHeader]}})(we(({theme:e})=>({display:"table",width:"100%",borderCollapse:"collapse",borderSpacing:0,"& caption":{...e.typography.body2,padding:e.spacing(2),color:(e.vars||e).palette.text.secondary,textAlign:"left",captionSide:"bottom"},variants:[{props:({ownerState:t})=>t.stickyHeader,style:{borderCollapse:"separate"}}]}))),qr="table",lc=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiTable"}),{className:r,component:a=qr,padding:o="normal",size:u="medium",stickyHeader:l=!1,...c}=i,p={...i,component:a,padding:o,size:u,stickyHeader:l},d=sc(p),I=W.useMemo(()=>({padding:o,size:u,stickyHeader:l}),[o,u,l]);return E.jsx(Oo.Provider,{value:I,children:E.jsx(uc,{as:a,role:a===qr?null:"table",ref:n,className:de(d.root,r),ownerState:p,...c})})}),Zn=W.createContext();function cc(e){return _e("MuiTableBody",e)}ve("MuiTableBody",["root"]);const pc=e=>{const{classes:t}=e;return Oe({root:["root"]},cc,t)},hc=fe("tbody",{name:"MuiTableBody",slot:"Root",overridesResolver:(e,t)=>t.root})({display:"table-row-group"}),dc={variant:"body"},Vr="tbody",fc=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiTableBody"}),{className:r,component:a=Vr,...o}=i,u={...i,component:a},l=pc(u);return E.jsx(Zn.Provider,{value:dc,children:E.jsx(hc,{className:de(l.root,r),as:a,ref:n,role:a===Vr?null:"rowgroup",ownerState:u,...o})})});function mc(e){return _e("MuiTableCell",e)}const Ic=ve("MuiTableCell",["root","head","body","footer","sizeSmall","sizeMedium","paddingCheckbox","paddingNone","alignLeft","alignCenter","alignRight","alignJustify","stickyHeader"]),gc=e=>{const{classes:t,variant:n,align:i,padding:r,size:a,stickyHeader:o}=e,u={root:["root",n,o&&"stickyHeader",i!=="inherit"&&`align${te(i)}`,r!=="normal"&&`padding${te(r)}`,`size${te(a)}`]};return Oe(u,mc,t)},yc=fe("td",{name:"MuiTableCell",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[n.variant],t[`size${te(n.size)}`],n.padding!=="normal"&&t[`padding${te(n.padding)}`],n.align!=="inherit"&&t[`align${te(n.align)}`],n.stickyHeader&&t.stickyHeader]}})(we(({theme:e})=>({...e.typography.body2,display:"table-cell",verticalAlign:"inherit",borderBottom:e.vars?`1px solid ${e.vars.palette.TableCell.border}`:`1px solid
    ${e.palette.mode==="light"?nl(Me(e.palette.divider,1),.88):il(Me(e.palette.divider,1),.68)}`,textAlign:"left",padding:16,variants:[{props:{variant:"head"},style:{color:(e.vars||e).palette.text.primary,lineHeight:e.typography.pxToRem(24),fontWeight:e.typography.fontWeightMedium}},{props:{variant:"body"},style:{color:(e.vars||e).palette.text.primary}},{props:{variant:"footer"},style:{color:(e.vars||e).palette.text.secondary,lineHeight:e.typography.pxToRem(21),fontSize:e.typography.pxToRem(12)}},{props:{size:"small"},style:{padding:"6px 16px",[`&.${Ic.paddingCheckbox}`]:{width:24,padding:"0 12px 0 16px","& > *":{padding:0}}}},{props:{padding:"checkbox"},style:{width:48,padding:"0 0 0 4px"}},{props:{padding:"none"},style:{padding:0}},{props:{align:"left"},style:{textAlign:"left"}},{props:{align:"center"},style:{textAlign:"center"}},{props:{align:"right"},style:{textAlign:"right",flexDirection:"row-reverse"}},{props:{align:"justify"},style:{textAlign:"justify"}},{props:({ownerState:t})=>t.stickyHeader,style:{position:"sticky",top:0,zIndex:2,backgroundColor:(e.vars||e).palette.background.default}}]}))),qe=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiTableCell"}),{align:r="inherit",className:a,component:o,padding:u,scope:l,size:c,sortDirection:p,variant:d,...I}=i,f=W.useContext(Oo),A=W.useContext(Zn),_=A&&A.variant==="head";let M;o?M=o:M=_?"th":"td";let x=l;M==="td"?x=void 0:!x&&_&&(x="col");const V=d||A&&A.variant,R={...i,align:r,component:M,padding:u||(f&&f.padding?f.padding:"normal"),size:c||(f&&f.size?f.size:"medium"),sortDirection:p,stickyHeader:V==="head"&&f&&f.stickyHeader,variant:V},K=gc(R);let X=null;return p&&(X=p==="asc"?"ascending":"descending"),E.jsx(yc,{as:M,ref:n,className:de(K.root,a),"aria-sort":X,scope:x,ownerState:R,...I})});function bc(e){return _e("MuiTableHead",e)}ve("MuiTableHead",["root"]);const Sc=e=>{const{classes:t}=e;return Oe({root:["root"]},bc,t)},Ac=fe("thead",{name:"MuiTableHead",slot:"Root",overridesResolver:(e,t)=>t.root})({display:"table-header-group"}),Ec={variant:"head"},zr="thead",Tc=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiTableHead"}),{className:r,component:a=zr,...o}=i,u={...i,component:a},l=Sc(u);return E.jsx(Zn.Provider,{value:Ec,children:E.jsx(Ac,{as:a,className:de(l.root,r),ref:n,role:a===zr?null:"rowgroup",ownerState:u,...o})})});function Cc(e){return _e("MuiToolbar",e)}ve("MuiToolbar",["root","gutters","regular","dense"]);const kc=e=>{const{classes:t,disableGutters:n,variant:i}=e;return Oe({root:["root",!n&&"gutters",i]},Cc,t)},Oc=fe("div",{name:"MuiToolbar",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,!n.disableGutters&&t.gutters,t[n.variant]]}})(we(({theme:e})=>({position:"relative",display:"flex",alignItems:"center",variants:[{props:({ownerState:t})=>!t.disableGutters,style:{paddingLeft:e.spacing(2),paddingRight:e.spacing(2),[e.breakpoints.up("sm")]:{paddingLeft:e.spacing(3),paddingRight:e.spacing(3)}}},{props:{variant:"dense"},style:{minHeight:48}},{props:{variant:"regular"},style:e.mixins.toolbar}]}))),Wr=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiToolbar"}),{className:r,component:a="div",disableGutters:o=!1,variant:u="regular",...l}=i,c={...i,component:a,disableGutters:o,variant:u},p=kc(c);return E.jsx(Oc,{as:a,className:de(p.root,r),ref:n,ownerState:c,...l})});function _c(e){return _e("MuiTableRow",e)}const Yr=ve("MuiTableRow",["root","selected","hover","head","footer"]),xc=e=>{const{classes:t,selected:n,hover:i,head:r,footer:a}=e;return Oe({root:["root",n&&"selected",i&&"hover",r&&"head",a&&"footer"]},_c,t)},Nc=fe("tr",{name:"MuiTableRow",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,n.head&&t.head,n.footer&&t.footer]}})(we(({theme:e})=>({color:"inherit",display:"table-row",verticalAlign:"middle",outline:0,[`&.${Yr.hover}:hover`]:{backgroundColor:(e.vars||e).palette.action.hover},[`&.${Yr.selected}`]:{backgroundColor:e.vars?`rgba(${e.vars.palette.primary.mainChannel} / ${e.vars.palette.action.selectedOpacity})`:Me(e.palette.primary.main,e.palette.action.selectedOpacity),"&:hover":{backgroundColor:e.vars?`rgba(${e.vars.palette.primary.mainChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.hoverOpacity}))`:Me(e.palette.primary.main,e.palette.action.selectedOpacity+e.palette.action.hoverOpacity)}}}))),Kr="tr",Nn=W.forwardRef(function(t,n){const i=xe({props:t,name:"MuiTableRow"}),{className:r,component:a=Kr,hover:o=!1,selected:u=!1,...l}=i,c=W.useContext(Zn),p={...i,component:a,hover:o,selected:u,head:c&&c.variant==="head",footer:c&&c.variant==="footer"},d=xc(p);return E.jsx(Nc,{as:a,ref:n,className:de(d.root,r),role:a===Kr?null:"row",ownerState:p,...l})});class an{constructor(t){if(t===void 0){const n=an.zero();this.aggregate=n.aggregate,this.initialize=n.initialize,this.select=n.select,this.cancel=n.cancel,this.call=n.call,this.describe=n.describe}else this.aggregate=t.aggregate,this.initialize=t.initialize,this.select=t.select,this.cancel=t.cancel,this.call=t.call,this.describe=t.describe}increment(t){const n=(i,r)=>{i.total+=r.total,i.input.total+=r.input.total,i.input.cached+=r.input.cached,i.output.total+=r.output.total,i.output.reasoning+=r.output.reasoning,i.output.accepted_prediction+=r.output.accepted_prediction,i.output.rejected_prediction+=r.output.rejected_prediction};n(this.aggregate,t.aggregate),n(this.initialize,t.initialize),n(this.select,t.select),n(this.cancel,t.cancel),n(this.call,t.call),n(this.describe,t.describe)}toJSON(){return(()=>{const t=a=>({aggregate:n(a.aggregate),initialize:n(a.initialize),select:n(a.select),cancel:n(a.cancel),call:n(a.call),describe:n(a.describe)}),n=a=>({total:a.total,input:i(a.input),output:r(a.output)}),i=a=>({total:a.total,cached:a.cached}),r=a=>({total:a.total,reasoning:a.reasoning,accepted_prediction:a.accepted_prediction,rejected_prediction:a.rejected_prediction});return a=>t(a)})()(this)}static zero(){const t=()=>({total:0,input:{total:0,cached:0},output:{total:0,reasoning:0,accepted_prediction:0,rejected_prediction:0}});return new an({aggregate:t(),initialize:t(),select:t(),cancel:t(),call:t(),describe:t()})}static plus(t,n){const i=new an(t);return i.increment(n.toJSON()),i}}function _o(e,t,n){const i=e.get(t);if(i!==void 0)return i;const r=n();return e.set(t,r),r}function vc(e){var l;const t=e.controllers.length===1||(()=>{const c=e.controllers.map(p=>p.application.functions.map(d=>d.name)).flat();return new Set(c).size===c.length})(),n=(c,p)=>t?c:`_${p}_${c}`,i=e.controllers.map((c,p)=>c.protocol==="http"?c.application.functions.map(d=>({protocol:"http",controller:c,function:d,name:n(d.name,p),toJSON:()=>({protocol:"http",controller:c.name,function:d.name,name:n(d.name,p)})})):c.application.functions.map(d=>({protocol:"class",controller:c,function:d,name:n(d.name,p),toJSON:()=>({protocol:"class",controller:c.name,function:d.name,name:n(d.name,p)})}))).flat(),r=(l=e.config)==null?void 0:l.capacity,a=r!==void 0&&i.length>r?Rc({array:i,capacity:r}):void 0,o=new Map,u=new Map;for(const c of i)o.set(c.name,c),_o(u,c.controller.name,()=>new Map).set(c.name,c);return{array:i,divided:a,flat:o,group:u}}function Rc(e){const t=Math.ceil(e.array.length/e.capacity),n=Math.ceil(e.array.length/t),i=e.array.slice();return Array.from({length:t},()=>i.splice(0,n))}const Pc={compose:vc};function wc(e){var r,a,o,u,l;const t=e.usage[e.kind];t.total+=e.completionUsage.total_tokens,t.input.total+=e.completionUsage.prompt_tokens,t.input.total+=((r=e.completionUsage.prompt_tokens_details)==null?void 0:r.audio_tokens)??0,t.input.cached+=((a=e.completionUsage.prompt_tokens_details)==null?void 0:a.cached_tokens)??0,t.output.total+=e.completionUsage.completion_tokens,t.output.accepted_prediction+=((o=e.completionUsage.completion_tokens_details)==null?void 0:o.accepted_prediction_tokens)??0,t.output.reasoning+=((u=e.completionUsage.completion_tokens_details)==null?void 0:u.reasoning_tokens)??0,t.output.rejected_prediction+=((l=e.completionUsage.completion_tokens_details)==null?void 0:l.rejected_prediction_tokens)??0;const n=c=>Object.entries(e.usage).filter(([p])=>p!=="aggregate").map(([,p])=>c(p)).reduce((p,d)=>p+d,0),i=e.usage.aggregate;i.total=n(c=>c.total),i.input.total=n(c=>c.input.total),i.input.cached=n(c=>c.input.cached),i.output.total=n(c=>c.output.total),i.output.reasoning=n(c=>c.output.reasoning),i.output.accepted_prediction=n(c=>c.output.accepted_prediction),i.output.rejected_prediction=n(c=>c.output.rejected_prediction)}const Dc={aggregate:wc},ke=[];for(let e=0;e<256;++e)ke.push((e+256).toString(16).slice(1));function Lc(e,t=0){return(ke[e[t+0]]+ke[e[t+1]]+ke[e[t+2]]+ke[e[t+3]]+"-"+ke[e[t+4]]+ke[e[t+5]]+"-"+ke[e[t+6]]+ke[e[t+7]]+"-"+ke[e[t+8]]+ke[e[t+9]]+"-"+ke[e[t+10]]+ke[e[t+11]]+ke[e[t+12]]+ke[e[t+13]]+ke[e[t+14]]+ke[e[t+15]]).toLowerCase()}let Ii;const Mc=new Uint8Array(16);function Bc(){if(!Ii){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");Ii=crypto.getRandomValues.bind(crypto)}return Ii(Mc)}const Gc=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Qr={randomUUID:Gc};function ir(e,t,n){var r;if(Qr.randomUUID&&!e)return Qr.randomUUID();e=e||{};const i=e.random??((r=e.rng)==null?void 0:r.call(e))??Bc();if(i.length<16)throw new Error("Random bytes length must be >= 16");return i[6]=i[6]&15|64,i[8]=i[8]&63|128,Lc(i)}function Ut(e){return e.type==="describe"?[]:e.type==="text"?[{role:e.role,content:e.text}]:e.type==="select"||e.type==="cancel"?[{role:"assistant",tool_calls:[{type:"function",id:e.id,function:{name:`${e.type}Functions`,arguments:JSON.stringify({functions:e.selections.map(t=>({name:t.operation.function.name,reason:t.reason}))})}}]},{role:"tool",tool_call_id:e.id,content:""}]:[{role:"assistant",tool_calls:[{type:"function",id:e.id,function:{name:e.operation.name,arguments:JSON.stringify(e.arguments)}}]},{role:"tool",tool_call_id:e.id,content:JSON.stringify({function:{protocol:e.operation.protocol,description:e.operation.function.description,parameters:e.operation.function.parameters,output:e.operation.function.output,...e.operation.protocol==="http"?{method:e.operation.function.method,path:e.operation.function.path}:{}},...e.operation.protocol==="http"?{status:e.value.status,data:e.value.body}:{value:e.value}})}]}function Sn(e){const t={type:"text",role:e.role,text:e.text};return{...t,toJSON:()=>t}}function xo(e){return{type:"describe",text:e.text,executes:e.executes,toJSON:()=>({type:"describe",text:e.text,executes:e.executes.map(t=>t.toJSON())})}}function ei(e){return{type:"select",id:e.id,selections:e.selections,toJSON:()=>({type:"select",id:e.id,selections:e.selections.map(t=>t.toJSON())})}}function ti(e){return{type:"cancel",id:e.id,selections:e.selections,toJSON:()=>({type:"cancel",id:e.id,selections:e.selections.map(t=>t.toJSON())})}}function At(e){return{type:"execute",protocol:e.operation.protocol,id:e.id,operation:e.operation,arguments:e.arguments,value:e.value,toJSON:()=>({type:"execute",protocol:e.operation.protocol,id:e.id,operation:e.operation.toJSON(),arguments:e.arguments,value:e.value})}}function Fc(){const e={type:"initialize"};return{type:e.type,toJSON:()=>e}}function Hc(e){return{type:"select",selection:e.selection,toJSON:()=>({type:"select",selection:e.selection.toJSON()}),toHistory:()=>ei({id:ir(),selections:[e.selection]})}}function No(e){return{type:"cancel",selection:e.selection,toJSON:()=>({type:"cancel",selection:e.selection.toJSON()})}}function vo(e){return{type:"call",id:e.id,operation:e.operation,arguments:e.arguments,toJSON:()=>({type:"call",id:e.id,operation:e.operation.toJSON(),arguments:e.arguments})}}function Xr(e){return{type:"validate",id:e.id,operation:e.operation,result:e.result,toJSON:()=>({type:"validate",id:e.id,operation:e.operation.toJSON(),result:e.result})}}function Jc(e){return{type:"execute",protocol:e.operation.protocol,id:e.id,operation:e.operation,arguments:e.arguments,value:e.value,toJSON:()=>({type:"execute",protocol:e.operation.protocol,id:e.id,operation:e.operation.toJSON(),arguments:e.arguments,value:e.value}),toHistory:()=>At(e)}}function ni(e){return{type:"text",role:e.role,stream:e.stream,join:e.join,toJSON:()=>({type:"text",role:e.role,done:e.done(),text:e.get()}),toHistory:()=>({type:"text",role:e.role,text:e.get(),toJSON:()=>({type:"text",role:e.role,text:e.get()})})}}function Uc(e){return{type:"describe",executes:e.executes,stream:e.stream,join:e.join,toJSON:()=>({type:"describe",executes:e.executes.map(t=>t.toJSON()),done:e.done(),text:e.get()}),toHistory:()=>({type:"describe",executes:e.executes,text:e.get(),toJSON:()=>({type:"describe",executes:e.executes.map(t=>t.toJSON()),text:e.get()})})}}function jc(e){return{type:"request",source:e.source,body:e.body,options:e.options}}const Zr={};class rr{constructor(t){this.closure_=t,this.value_=Zr}get(...t){return this.value_===Zr&&(this.value_=this.closure_(...t)),this.value_}}const _t={CANCEL:`You are a helpful assistant for cancelling functions which are prepared to call.

Use the supplied tools to select some functions to cancel of \`getApiFunctions()\` returned.

If you can't find any proper function to select, don't talk, don't do anything.`,COMMON:`At first, the user's language locale code is "\${locale}". When you are conversating with the user or describing the function calling result, consider it and always translate to the target locale language. Never conversate with different locale language text with the user.

At second, the user's timezone is "\${timezone}", and ISO datetime is \${datetime}. When you are conversating with the user, consider current time and user belonged timezone.`,DESCRIBE:`You are a helpful assistant describing return values of function calls.

Above messages are the list of function call histories. When describing the return values, please do not too much shortly summarize them. Instead, provide detailed descriptions as much as.

Also, its content format must be markdown. If required, utilize the mermaid syntax for drawing some diagrams. When image contents are, just put them through the markdown image syntax.

At last, if user's language locale code is different with your description, please translate it to the user's language.`,EXECUTE:`You are a helpful assistant for tool calling.

Use the supplied tools to assist the user.

If previous messages are not enough to compose the arguments, you can ask the user to write more information. By the way, when asking the user to write more information, make the text concise and clear.

For reference, in the "tool" role message content, the \`function\` property means metadata of the API operation. In other words, it is the function schema describing its purpose, parameters and return value types. And then the \`data\` property is the return value from the target function calling.`,INITIALIZE:`You are a helpful assistant.

Use the supplied tools to assist the user.`,SELECT:`You are a helpful assistant for selecting functions to call.

Use the supplied tools to select some functions of \`getApiFunctions()\` returned.

When selecting functions to call, pay attention to the relationship between functions. In particular, check the prerequisites between each function.

If you can't find any proper function to select, just type your own message. By the way, when typing your own message, please consider the user's language locale code. If your message is different with the user's language, please translate it to the user's.`};var $c={};const qc=new rr(()=>{const e=t=>typeof t=="object"&&t!==null;return typeof global=="object"&&e(global)&&e(global.process)&&e(global.process.versions)&&typeof global.process.versions.node<"u"}),Vc=new rr(()=>{var e;return qc.get()?((e=$c.LANG)==null?void 0:e.split(".")[0])??"en-US":navigator.language}),zc=new rr(()=>Intl.DateTimeFormat().resolvedOptions().timeZone);function Wc(e){var i;if(((i=e==null?void 0:e.systemPrompt)==null?void 0:i.common)!==void 0)return e.systemPrompt.common(e);const t=(e==null?void 0:e.locale)??Vc.get(),n=(e==null?void 0:e.timezone)??zc.get();return _t.COMMON.replace("${locale}",t).replace("${timezone}",n).replace("${datetime}",new Date().toISOString())}const jt={write:Wc};function Yc(e){return typeof e.initialize=="function"}function Ot(e){return{operation:e.operation,reason:e.reason,toJSON:()=>({operation:e.operation.toJSON(),reason:e.reason})}}var ar={};class Kc extends Error{constructor(n){super(n.message||`Error on ${n.method}(): invalid type${n.path?` on ${n.path}`:""}, expect to be ${n.expected}`);Pt(this,"method");Pt(this,"path");Pt(this,"expected");Pt(this,"value");Pt(this,"fake_expected_typed_value_");const i=new.target.prototype;Object.setPrototypeOf?Object.setPrototypeOf(this,i):this.__proto__=i,this.method=n.method,this.path=n.path,this.expected=n.expected,this.value=n.value}}const Qc=Object.freeze(Object.defineProperty({__proto__:null,TypeGuardError:Kc},Symbol.toStringTag,{value:"Module"})),Xc=rl(Qc);Object.defineProperty(ar,"__esModule",{value:!0});var q=ar._assertGuard=void 0;const Zc=Xc,ep=(e,t,n)=>{if(e===!0)throw n?n(t):new Zc.TypeGuardError(t);return!1};q=ar._assertGuard=ep;function Ro(e,t){return{accepted_prediction_tokens:(e.accepted_prediction_tokens??0)+(t.accepted_prediction_tokens??0),reasoning_tokens:(e.reasoning_tokens??0)+(t.reasoning_tokens??0),rejected_prediction_tokens:(e.rejected_prediction_tokens??0)+(t.rejected_prediction_tokens??0)}}function Po(e,t){return{audio_tokens:(e.audio_tokens??0)+(t.audio_tokens??0),cached_tokens:(e.cached_tokens??0)+(t.cached_tokens??0)}}function tp(e,t){return{prompt_tokens:(e.prompt_tokens??0)+(t.prompt_tokens??0),completion_tokens:(e.completion_tokens??0)+(t.completion_tokens??0),total_tokens:(e.total_tokens??0)+(t.total_tokens??0),completion_tokens_details:Ro(e.completion_tokens_details??{accepted_prediction_tokens:0,reasoning_tokens:0,rejected_prediction_tokens:0},t.completion_tokens_details??{accepted_prediction_tokens:0,reasoning_tokens:0,rejected_prediction_tokens:0}),prompt_tokens_details:Po(e.prompt_tokens_details??{audio_tokens:0,cached_tokens:0},t.prompt_tokens_details??{audio_tokens:0,cached_tokens:0})}}const np={sum:tp,sumCompletionTokenDetail:Ro,sumPromptTokenDetail:Po};function ip(e){const t=e instanceof Uint8Array?$u.toUtf8(e):e;return(()=>{const n=h=>typeof h.id=="string"&&Array.isArray(h.choices)&&h.choices.every(C=>typeof C=="object"&&C!==null&&i(C))&&typeof h.created=="number"&&typeof h.model=="string"&&h.object==="chat.completion.chunk"&&(h.service_tier===null||h.service_tier===void 0||h.service_tier==="scale"||h.service_tier==="default")&&(h.system_fingerprint===void 0||typeof h.system_fingerprint=="string")&&(h.usage===null||h.usage===void 0||typeof h.usage=="object"&&h.usage!==null&&d(h.usage)),i=h=>typeof h.delta=="object"&&h.delta!==null&&Array.isArray(h.delta)===!1&&r(h.delta)&&(h.finish_reason===null||h.finish_reason==="stop"||h.finish_reason==="length"||h.finish_reason==="tool_calls"||h.finish_reason==="content_filter"||h.finish_reason==="function_call")&&typeof h.index=="number"&&(h.logprobs===null||h.logprobs===void 0||typeof h.logprobs=="object"&&h.logprobs!==null&&l(h.logprobs)),r=h=>(h.content===null||h.content===void 0||typeof h.content=="string")&&(h.function_call===void 0||typeof h.function_call=="object"&&h.function_call!==null&&Array.isArray(h.function_call)===!1&&a(h.function_call))&&(h.refusal===null||h.refusal===void 0||typeof h.refusal=="string")&&(h.role===void 0||h.role==="developer"||h.role==="system"||h.role==="user"||h.role==="assistant"||h.role==="tool")&&(h.tool_calls===void 0||Array.isArray(h.tool_calls)&&h.tool_calls.every(C=>typeof C=="object"&&C!==null&&o(C))),a=h=>(h.arguments===void 0||typeof h.arguments=="string")&&(h.name===void 0||typeof h.name=="string"),o=h=>typeof h.index=="number"&&(h.id===void 0||typeof h.id=="string")&&(h.function===void 0||typeof h.function=="object"&&h.function!==null&&Array.isArray(h.function)===!1&&u(h.function))&&(h.type===void 0||h.type==="function"),u=h=>(h.arguments===void 0||typeof h.arguments=="string")&&(h.name===void 0||typeof h.name=="string"),l=h=>(h.content===null||Array.isArray(h.content)&&h.content.every(C=>typeof C=="object"&&C!==null&&c(C)))&&(h.refusal===null||Array.isArray(h.refusal)&&h.refusal.every(C=>typeof C=="object"&&C!==null&&c(C))),c=h=>typeof h.token=="string"&&(h.bytes===null||Array.isArray(h.bytes)&&h.bytes.every(C=>typeof C=="number"))&&typeof h.logprob=="number"&&Array.isArray(h.top_logprobs)&&h.top_logprobs.every(C=>typeof C=="object"&&C!==null&&p(C)),p=h=>typeof h.token=="string"&&(h.bytes===null||Array.isArray(h.bytes)&&h.bytes.every(C=>typeof C=="number"))&&typeof h.logprob=="number",d=h=>typeof h.completion_tokens=="number"&&typeof h.prompt_tokens=="number"&&typeof h.total_tokens=="number"&&(h.completion_tokens_details===void 0||typeof h.completion_tokens_details=="object"&&h.completion_tokens_details!==null&&Array.isArray(h.completion_tokens_details)===!1&&I(h.completion_tokens_details))&&(h.prompt_tokens_details===void 0||typeof h.prompt_tokens_details=="object"&&h.prompt_tokens_details!==null&&Array.isArray(h.prompt_tokens_details)===!1&&f(h.prompt_tokens_details)),I=h=>(h.accepted_prediction_tokens===void 0||typeof h.accepted_prediction_tokens=="number")&&(h.audio_tokens===void 0||typeof h.audio_tokens=="number")&&(h.reasoning_tokens===void 0||typeof h.reasoning_tokens=="number")&&(h.rejected_prediction_tokens===void 0||typeof h.rejected_prediction_tokens=="number"),f=h=>(h.audio_tokens===void 0||typeof h.audio_tokens=="number")&&(h.cached_tokens===void 0||typeof h.cached_tokens=="number"),A=(h,C,O=!0)=>(typeof h.id=="string"||q(O,{method:"json.assertParse",path:C+".id",expected:"string",value:h.id},T))&&((Array.isArray(h.choices)||q(O,{method:"json.assertParse",path:C+".choices",expected:"Array<ChatCompletionChunk.Choice>",value:h.choices},T))&&h.choices.every((z,Y)=>(typeof z=="object"&&z!==null||q(O,{method:"json.assertParse",path:C+".choices["+Y+"]",expected:"ChatCompletionChunk.Choice",value:z},T))&&_(z,C+".choices["+Y+"]",O)||q(O,{method:"json.assertParse",path:C+".choices["+Y+"]",expected:"ChatCompletionChunk.Choice",value:z},T))||q(O,{method:"json.assertParse",path:C+".choices",expected:"Array<ChatCompletionChunk.Choice>",value:h.choices},T))&&(typeof h.created=="number"||q(O,{method:"json.assertParse",path:C+".created",expected:"number",value:h.created},T))&&(typeof h.model=="string"||q(O,{method:"json.assertParse",path:C+".model",expected:"string",value:h.model},T))&&(h.object==="chat.completion.chunk"||q(O,{method:"json.assertParse",path:C+".object",expected:'"chat.completion.chunk"',value:h.object},T))&&(h.service_tier===null||h.service_tier===void 0||h.service_tier==="scale"||h.service_tier==="default"||q(O,{method:"json.assertParse",path:C+".service_tier",expected:'("default" | "scale" | null | undefined)',value:h.service_tier},T))&&(h.system_fingerprint===void 0||typeof h.system_fingerprint=="string"||q(O,{method:"json.assertParse",path:C+".system_fingerprint",expected:"(string | undefined)",value:h.system_fingerprint},T))&&(h.usage===null||h.usage===void 0||(typeof h.usage=="object"&&h.usage!==null||q(O,{method:"json.assertParse",path:C+".usage",expected:"(CompletionUsage | null | undefined)",value:h.usage},T))&&j(h.usage,C+".usage",O)||q(O,{method:"json.assertParse",path:C+".usage",expected:"(CompletionUsage | null | undefined)",value:h.usage},T)),_=(h,C,O=!0)=>((typeof h.delta=="object"&&h.delta!==null&&Array.isArray(h.delta)===!1||q(O,{method:"json.assertParse",path:C+".delta",expected:"ChatCompletionChunk.Choice.Delta",value:h.delta},T))&&M(h.delta,C+".delta",O)||q(O,{method:"json.assertParse",path:C+".delta",expected:"ChatCompletionChunk.Choice.Delta",value:h.delta},T))&&(h.finish_reason===null||h.finish_reason==="stop"||h.finish_reason==="length"||h.finish_reason==="tool_calls"||h.finish_reason==="content_filter"||h.finish_reason==="function_call"||q(O,{method:"json.assertParse",path:C+".finish_reason",expected:'("content_filter" | "function_call" | "length" | "stop" | "tool_calls" | null)',value:h.finish_reason},T))&&(typeof h.index=="number"||q(O,{method:"json.assertParse",path:C+".index",expected:"number",value:h.index},T))&&(h.logprobs===null||h.logprobs===void 0||(typeof h.logprobs=="object"&&h.logprobs!==null||q(O,{method:"json.assertParse",path:C+".logprobs",expected:"(ChatCompletionChunk.Choice.Logprobs | null | undefined)",value:h.logprobs},T))&&K(h.logprobs,C+".logprobs",O)||q(O,{method:"json.assertParse",path:C+".logprobs",expected:"(ChatCompletionChunk.Choice.Logprobs | null | undefined)",value:h.logprobs},T)),M=(h,C,O=!0)=>(h.content===null||h.content===void 0||typeof h.content=="string"||q(O,{method:"json.assertParse",path:C+".content",expected:"(null | string | undefined)",value:h.content},T))&&(h.function_call===void 0||(typeof h.function_call=="object"&&h.function_call!==null&&Array.isArray(h.function_call)===!1||q(O,{method:"json.assertParse",path:C+".function_call",expected:"(ChatCompletionChunk.Choice.Delta.FunctionCall | undefined)",value:h.function_call},T))&&x(h.function_call,C+".function_call",O)||q(O,{method:"json.assertParse",path:C+".function_call",expected:"(ChatCompletionChunk.Choice.Delta.FunctionCall | undefined)",value:h.function_call},T))&&(h.refusal===null||h.refusal===void 0||typeof h.refusal=="string"||q(O,{method:"json.assertParse",path:C+".refusal",expected:"(null | string | undefined)",value:h.refusal},T))&&(h.role===void 0||h.role==="developer"||h.role==="system"||h.role==="user"||h.role==="assistant"||h.role==="tool"||q(O,{method:"json.assertParse",path:C+".role",expected:'("assistant" | "developer" | "system" | "tool" | "user" | undefined)',value:h.role},T))&&(h.tool_calls===void 0||(Array.isArray(h.tool_calls)||q(O,{method:"json.assertParse",path:C+".tool_calls",expected:"(Array<ChatCompletionChunk.Choice.Delta.ToolCall> | undefined)",value:h.tool_calls},T))&&h.tool_calls.every((z,Y)=>(typeof z=="object"&&z!==null||q(O,{method:"json.assertParse",path:C+".tool_calls["+Y+"]",expected:"ChatCompletionChunk.Choice.Delta.ToolCall",value:z},T))&&V(z,C+".tool_calls["+Y+"]",O)||q(O,{method:"json.assertParse",path:C+".tool_calls["+Y+"]",expected:"ChatCompletionChunk.Choice.Delta.ToolCall",value:z},T))||q(O,{method:"json.assertParse",path:C+".tool_calls",expected:"(Array<ChatCompletionChunk.Choice.Delta.ToolCall> | undefined)",value:h.tool_calls},T)),x=(h,C,O=!0)=>(h.arguments===void 0||typeof h.arguments=="string"||q(O,{method:"json.assertParse",path:C+".arguments",expected:"(string | undefined)",value:h.arguments},T))&&(h.name===void 0||typeof h.name=="string"||q(O,{method:"json.assertParse",path:C+".name",expected:"(string | undefined)",value:h.name},T)),V=(h,C,O=!0)=>(typeof h.index=="number"||q(O,{method:"json.assertParse",path:C+".index",expected:"number",value:h.index},T))&&(h.id===void 0||typeof h.id=="string"||q(O,{method:"json.assertParse",path:C+".id",expected:"(string | undefined)",value:h.id},T))&&(h.function===void 0||(typeof h.function=="object"&&h.function!==null&&Array.isArray(h.function)===!1||q(O,{method:"json.assertParse",path:C+'["function"]',expected:"(ChatCompletionChunk.Choice.Delta.ToolCall.Function | undefined)",value:h.function},T))&&R(h.function,C+'["function"]',O)||q(O,{method:"json.assertParse",path:C+'["function"]',expected:"(ChatCompletionChunk.Choice.Delta.ToolCall.Function | undefined)",value:h.function},T))&&(h.type===void 0||h.type==="function"||q(O,{method:"json.assertParse",path:C+".type",expected:'("function" | undefined)',value:h.type},T)),R=(h,C,O=!0)=>(h.arguments===void 0||typeof h.arguments=="string"||q(O,{method:"json.assertParse",path:C+".arguments",expected:"(string | undefined)",value:h.arguments},T))&&(h.name===void 0||typeof h.name=="string"||q(O,{method:"json.assertParse",path:C+".name",expected:"(string | undefined)",value:h.name},T)),K=(h,C,O=!0)=>(h.content===null||(Array.isArray(h.content)||q(O,{method:"json.assertParse",path:C+".content",expected:"(Array<ChatCompletionTokenLogprob> | null)",value:h.content},T))&&h.content.every((z,Y)=>(typeof z=="object"&&z!==null||q(O,{method:"json.assertParse",path:C+".content["+Y+"]",expected:"ChatCompletionTokenLogprob",value:z},T))&&X(z,C+".content["+Y+"]",O)||q(O,{method:"json.assertParse",path:C+".content["+Y+"]",expected:"ChatCompletionTokenLogprob",value:z},T))||q(O,{method:"json.assertParse",path:C+".content",expected:"(Array<ChatCompletionTokenLogprob> | null)",value:h.content},T))&&(h.refusal===null||(Array.isArray(h.refusal)||q(O,{method:"json.assertParse",path:C+".refusal",expected:"(Array<ChatCompletionTokenLogprob> | null)",value:h.refusal},T))&&h.refusal.every((z,Y)=>(typeof z=="object"&&z!==null||q(O,{method:"json.assertParse",path:C+".refusal["+Y+"]",expected:"ChatCompletionTokenLogprob",value:z},T))&&X(z,C+".refusal["+Y+"]",O)||q(O,{method:"json.assertParse",path:C+".refusal["+Y+"]",expected:"ChatCompletionTokenLogprob",value:z},T))||q(O,{method:"json.assertParse",path:C+".refusal",expected:"(Array<ChatCompletionTokenLogprob> | null)",value:h.refusal},T)),X=(h,C,O=!0)=>(typeof h.token=="string"||q(O,{method:"json.assertParse",path:C+".token",expected:"string",value:h.token},T))&&(h.bytes===null||(Array.isArray(h.bytes)||q(O,{method:"json.assertParse",path:C+".bytes",expected:"(Array<number> | null)",value:h.bytes},T))&&h.bytes.every((z,Y)=>typeof z=="number"||q(O,{method:"json.assertParse",path:C+".bytes["+Y+"]",expected:"number",value:z},T))||q(O,{method:"json.assertParse",path:C+".bytes",expected:"(Array<number> | null)",value:h.bytes},T))&&(typeof h.logprob=="number"||q(O,{method:"json.assertParse",path:C+".logprob",expected:"number",value:h.logprob},T))&&((Array.isArray(h.top_logprobs)||q(O,{method:"json.assertParse",path:C+".top_logprobs",expected:"Array<ChatCompletionTokenLogprob.TopLogprob>",value:h.top_logprobs},T))&&h.top_logprobs.every((z,Y)=>(typeof z=="object"&&z!==null||q(O,{method:"json.assertParse",path:C+".top_logprobs["+Y+"]",expected:"ChatCompletionTokenLogprob.TopLogprob",value:z},T))&&v(z,C+".top_logprobs["+Y+"]",O)||q(O,{method:"json.assertParse",path:C+".top_logprobs["+Y+"]",expected:"ChatCompletionTokenLogprob.TopLogprob",value:z},T))||q(O,{method:"json.assertParse",path:C+".top_logprobs",expected:"Array<ChatCompletionTokenLogprob.TopLogprob>",value:h.top_logprobs},T)),v=(h,C,O=!0)=>(typeof h.token=="string"||q(O,{method:"json.assertParse",path:C+".token",expected:"string",value:h.token},T))&&(h.bytes===null||(Array.isArray(h.bytes)||q(O,{method:"json.assertParse",path:C+".bytes",expected:"(Array<number> | null)",value:h.bytes},T))&&h.bytes.every((z,Y)=>typeof z=="number"||q(O,{method:"json.assertParse",path:C+".bytes["+Y+"]",expected:"number",value:z},T))||q(O,{method:"json.assertParse",path:C+".bytes",expected:"(Array<number> | null)",value:h.bytes},T))&&(typeof h.logprob=="number"||q(O,{method:"json.assertParse",path:C+".logprob",expected:"number",value:h.logprob},T)),j=(h,C,O=!0)=>(typeof h.completion_tokens=="number"||q(O,{method:"json.assertParse",path:C+".completion_tokens",expected:"number",value:h.completion_tokens},T))&&(typeof h.prompt_tokens=="number"||q(O,{method:"json.assertParse",path:C+".prompt_tokens",expected:"number",value:h.prompt_tokens},T))&&(typeof h.total_tokens=="number"||q(O,{method:"json.assertParse",path:C+".total_tokens",expected:"number",value:h.total_tokens},T))&&(h.completion_tokens_details===void 0||(typeof h.completion_tokens_details=="object"&&h.completion_tokens_details!==null&&Array.isArray(h.completion_tokens_details)===!1||q(O,{method:"json.assertParse",path:C+".completion_tokens_details",expected:"(CompletionUsage.CompletionTokensDetails | undefined)",value:h.completion_tokens_details},T))&&L(h.completion_tokens_details,C+".completion_tokens_details",O)||q(O,{method:"json.assertParse",path:C+".completion_tokens_details",expected:"(CompletionUsage.CompletionTokensDetails | undefined)",value:h.completion_tokens_details},T))&&(h.prompt_tokens_details===void 0||(typeof h.prompt_tokens_details=="object"&&h.prompt_tokens_details!==null&&Array.isArray(h.prompt_tokens_details)===!1||q(O,{method:"json.assertParse",path:C+".prompt_tokens_details",expected:"(CompletionUsage.PromptTokensDetails | undefined)",value:h.prompt_tokens_details},T))&&H(h.prompt_tokens_details,C+".prompt_tokens_details",O)||q(O,{method:"json.assertParse",path:C+".prompt_tokens_details",expected:"(CompletionUsage.PromptTokensDetails | undefined)",value:h.prompt_tokens_details},T)),L=(h,C,O=!0)=>(h.accepted_prediction_tokens===void 0||typeof h.accepted_prediction_tokens=="number"||q(O,{method:"json.assertParse",path:C+".accepted_prediction_tokens",expected:"(number | undefined)",value:h.accepted_prediction_tokens},T))&&(h.audio_tokens===void 0||typeof h.audio_tokens=="number"||q(O,{method:"json.assertParse",path:C+".audio_tokens",expected:"(number | undefined)",value:h.audio_tokens},T))&&(h.reasoning_tokens===void 0||typeof h.reasoning_tokens=="number"||q(O,{method:"json.assertParse",path:C+".reasoning_tokens",expected:"(number | undefined)",value:h.reasoning_tokens},T))&&(h.rejected_prediction_tokens===void 0||typeof h.rejected_prediction_tokens=="number"||q(O,{method:"json.assertParse",path:C+".rejected_prediction_tokens",expected:"(number | undefined)",value:h.rejected_prediction_tokens},T)),H=(h,C,O=!0)=>(h.audio_tokens===void 0||typeof h.audio_tokens=="number"||q(O,{method:"json.assertParse",path:C+".audio_tokens",expected:"(number | undefined)",value:h.audio_tokens},T))&&(h.cached_tokens===void 0||typeof h.cached_tokens=="number"||q(O,{method:"json.assertParse",path:C+".cached_tokens",expected:"(number | undefined)",value:h.cached_tokens},T)),J=h=>typeof h=="object"&&h!==null&&n(h);let T;const F=(h,C)=>(J(h)===!1&&(T=C,((O,z,Y=!0)=>(typeof O=="object"&&O!==null||q(!0,{method:"json.assertParse",path:z+"",expected:"ChatCompletionChunk & { usage: CompletionUsage | null | undefined; }",value:O},T))&&A(O,z+"",!0)||q(!0,{method:"json.assertParse",path:z+"",expected:"ChatCompletionChunk & { usage: CompletionUsage | null | undefined; }",value:O},T))(h,"$input",!0)),h);return(h,C)=>F(JSON.parse(h),C)})()(t)}function wo(e,t){const n=e.choices;t.choices.forEach(r=>{const a=n[r.index];if(a!=null){n[r.index]=Do(a,r);return}n[r.index]={index:r.index,finish_reason:r.finish_reason??null,logprobs:r.logprobs??null,message:{tool_calls:r.delta.tool_calls!==void 0?r.delta.tool_calls.reduce((o,u)=>{var l,c;return o[u.index]={id:u.id??"",type:"function",function:{name:((l=u.function)==null?void 0:l.name)??"",arguments:((c=u.function)==null?void 0:c.arguments)??""}},o},[]):void 0,content:r.delta.content??null,refusal:r.delta.refusal??null,role:"assistant"}}});const i=t.usage==null?e.usage:e.usage==null?t.usage:np.sum(e.usage,t.usage);return{...e,choices:n,usage:i}}function rp(e){const t=e[0];if(t===void 0)throw new Error("No chunks received");return e.reduce(wo,{id:t.id,choices:[],created:t.created,model:t.model,object:"chat.completion",usage:void 0,service_tier:t.service_tier,system_fingerprint:t.system_fingerprint})}function Do(e,t){var n;if(e.finish_reason==null&&t.finish_reason!=null&&(e.finish_reason=t.finish_reason),e.logprobs==null&&t.logprobs!=null&&(e.logprobs=t.logprobs),t.delta.content!=null&&(e.message.content==null?e.message.content=t.delta.content:e.message.content+=t.delta.content),t.delta.refusal!=null&&(e.message.refusal==null?e.message.refusal=t.delta.refusal:e.message.refusal+=t.delta.refusal),t.delta.tool_calls!=null){(n=e.message).tool_calls??(n.tool_calls=[]);const i=e.message.tool_calls;t.delta.tool_calls.forEach(r=>{var o,u;const a=i[r.index];if(a!=null){i[r.index]=Lo(a,r);return}i[r.index]={id:r.id??"",type:"function",function:{name:((o=r.function)==null?void 0:o.name)??"",arguments:((u=r.function)==null?void 0:u.arguments)??""}}})}return e}function Lo(e,t){return t.function!=null&&(e.function.arguments+=t.function.arguments??"",e.function.name+=t.function.name??""),e.id+=t.id??"",e}const rt={transformCompletionChunk:ip,accumulate:wo,merge:rp,mergeChoice:Do,mergeToolCalls:Lo};async function ap(e){const t=e.getReader(),n=[];for(;;){const{done:i,value:r}=await t.read();if(i)break;n.push(r)}return n}async function op(e,t,n){const i=e.getReader();let r=n??null;for(;;){const{done:a,value:o}=await i.read();if(a)break;if(r===null){r=o;continue}r=t(r,o)}return r}function sp(e){return new ReadableStream({start:n=>{n.enqueue(e),n.close()}})}function up(e,t){const n=e.getReader();return new ReadableStream({pull:async i=>{const{done:r,value:a}=await n.read();r?i.close():i.enqueue(t(a))}})}const Qe={readAll:ap,reduce:op,to:sp,transform:up};async function ii(e,t){const n=e.stack.findIndex(r=>r.operation.name===t.name);if(n===-1)return null;const i=e.stack[n];return e.stack.splice(n,1),await e.dispatch(No({selection:Ot({operation:i.operation,reason:t.reason})})),i}async function lp(e,t){var o,u,l,c,p;const n=await e.request("call",{messages:[{role:"system",content:jt.write(e.config)},...e.histories.map(Ut).flat(),{role:"user",content:e.prompt.text},...((u=(o=e.config)==null?void 0:o.systemPrompt)==null?void 0:u.execute)===null?[]:[{role:"system",content:((p=(c=(l=e.config)==null?void 0:l.systemPrompt)==null?void 0:c.execute)==null?void 0:p.call(c,e.histories))??_t.EXECUTE}]],tools:t.map(d=>({type:"function",function:{name:d.name,description:d.function.description,parameters:d.function.separated!==void 0?d.function.separated.llm??{type:"object",properties:{},required:[],additionalProperties:!1,$defs:{}}:d.function.parameters}})),tool_choice:"auto",parallel_tool_calls:!1}),i=[],r=await Qe.readAll(n),a=rt.merge(r);for(const d of a.choices){for(const I of d.message.tool_calls??[])if(I.type==="function"){const f=e.operations.flat.get(I.function.name);if(f===void 0)continue;i.push(async()=>{const A=vo({id:I.id,operation:f,arguments:JSON.parse(I.function.arguments)});A.operation.protocol==="http"&&hp({operation:A.operation,arguments:A.arguments}),await e.dispatch(A);const _=await Mo(e,A,0);return e.dispatch(Jc({id:A.id,operation:A.operation,arguments:_.arguments,value:_.value})),Yc(e)&&(await ii(e,{name:A.operation.name,reason:"completed"}),e.dispatch(No({selection:Ot({operation:A.operation,reason:"complete"})}))),[_,ti({id:A.id,selections:[Ot({operation:A.operation,reason:"complete"})]})]})}d.message.role==="assistant"&&d.message.content!==null&&d.message.content.length>0&&i.push(async()=>{const I=Sn({role:"assistant",text:d.message.content});return e.dispatch(ni({role:"assistant",get:()=>I.text,done:()=>!0,stream:Qe.to(I.text),join:async()=>Promise.resolve(I.text)})),[I]})}return(await Promise.all(i.map(async d=>d()))).flat()}async function Mo(e,t,n){var i,r,a;if(t.operation.protocol==="http"){const o=t.operation.function.validate(t.arguments);if(o.success===!1&&(e.dispatch(Xr({id:t.id,operation:t.operation,result:o})),n++<(((i=e.config)==null?void 0:i.retry)??Ct.RETRY))){const u=await gi(e,t,n,o.errors);if(u!==null)return u}try{const u=await cp(t.operation,t.arguments);return(((u.status===400||u.status===404||u.status===422)&&n++<(((r=e.config)==null?void 0:r.retry)??Ct.RETRY)&&typeof u.body)===!1===!1?await gi(e,t,n,u.body):null)??At({operation:t.operation,id:t.id,arguments:t.arguments,value:u})}catch(u){return At({operation:t.operation,id:t.id,arguments:t.arguments,value:{status:500,headers:{},body:u instanceof Error?{...u,name:u.name,message:u.message}:u}})}}else{const o=t.operation.function.validate(t.arguments);if(o.success===!1)return e.dispatch(Xr({id:t.id,operation:t.operation,result:o})),(n++<(((a=e.config)==null?void 0:a.retry)??Ct.RETRY)?await gi(e,t,n,o.errors):null)??At({id:t.id,operation:t.operation,arguments:t.arguments,value:{name:"TypeGuardError",message:"Invalid arguments.",errors:o.errors}});try{const u=await pp(t.operation,t.arguments);return At({id:t.id,operation:t.operation,arguments:t.arguments,value:u})}catch(u){return At({id:t.id,operation:t.operation,arguments:t.arguments,value:u instanceof Error?{...u,name:u.name,message:u.message}:u})}}}async function cp(e,t){const n={connection:e.controller.connection,application:e.controller.application,function:e.function};return e.controller.execute!==void 0?e.controller.execute({...n,arguments:t}):qu.propagate({...n,input:t})}async function pp(e,t){const n=e.controller.execute;return typeof n=="function"?await n({application:e.controller.application,function:e.function,arguments:t}):n[e.function.name](t)}async function gi(e,t,n,i){var l,c,p,d,I,f,A;const r=await e.request("call",{messages:[{role:"system",content:jt.write(e.config)},...e.histories.map(Ut).flat(),{role:"user",content:e.prompt.text},...((c=(l=e.config)==null?void 0:l.systemPrompt)==null?void 0:c.execute)===null?[]:[{role:"system",content:((I=(d=(p=e.config)==null?void 0:p.systemPrompt)==null?void 0:d.execute)==null?void 0:I.call(d,e.histories))??_t.EXECUTE}],{role:"assistant",tool_calls:[{type:"function",id:t.id,function:{name:t.operation.name,arguments:JSON.stringify(t.arguments)}}]},{role:"tool",content:typeof i=="string"?i:JSON.stringify(i),tool_call_id:t.id},{role:"system",content:["You A.I. assistant has composed wrong arguments.","","Correct it at the next function calling."].join(`
`)}],tools:[{type:"function",function:{name:t.operation.name,description:t.operation.function.description,parameters:t.operation.function.separated!==void 0?((f=t.operation.function.separated)==null?void 0:f.llm)??{$defs:{},type:"object",properties:{},additionalProperties:!1,required:[]}:t.operation.function.parameters}}],tool_choice:"auto",parallel_tool_calls:!1}),a=await Qe.readAll(r),u=(((A=rt.merge(a).choices[0])==null?void 0:A.message.tool_calls)??[]).find(_=>_.type==="function"&&_.function.name===t.operation.name);return u===void 0?null:Mo(e,vo({id:u.id,operation:t.operation,arguments:JSON.parse(u.function.arguments)}),n)}function hp(e){var n;if(e.operation.protocol!=="http")return;const t=e.operation.function.route();t.body!==null&&((n=t.operation().requestBody)==null?void 0:n.required)===!0&&"body"in e.arguments&&Bn(e.operation.function.parameters.$defs,e.operation.function.parameters.properties.body)&&(e.arguments.body={}),t.query!==null&&"query"in e.arguments&&e.arguments.query===void 0&&(e.arguments.query={})}function Bn(e,t){return mi.isObject(t)||mi.isReference(t)&&Bn(e,e[t.$ref.split("/").at(-1)])||mi.isAnyOf(t)&&t.anyOf.every(n=>Bn(e,n))||Vu.isOneOf(t)&&t.oneOf.every(n=>Bn(e,n))}const dp={functions:[{name:"cancelFunctions",parameters:{description:` Properties of the function

------------------------------

Current Type: {@link __IChatFunctionReference.IProps}`,type:"object",properties:{functions:{title:"List of target functions",description:"List of target functions.",type:"array",items:{description:"Current Type: {@link ___IChatFunctionReference}",type:"object",properties:{reason:{title:"The reason of the function selection",description:`The reason of the function selection.

Just write the reason why you've determined to select this function.`,type:"string"},name:{title:"Name of the target function to call",description:"Name of the target function to call.",type:"string"}},required:["reason","name"]}}},required:["functions"],additionalProperties:!1,$defs:{}},description:`Cancel a function from the candidate list to call.

If you A.I. agent has understood that the user wants to cancel
some candidate functions to call from the conversation, please cancel
them through this function.

Also, when you A.I. find a function that has been selected by the candidate
pooling, cancel the function by calling this function. For reference, the
candidate pooling means that user wants only one function to call, but you A.I.
agent selects multiple candidate functions because the A.I. agent can't specify
only one thing due to lack of specificity or homogeneity of candidate functions.

Additionally, if you A.I. agent wants to cancel same function multiply, you can
do it by assigning the same function name multiply in the \`functions\` property.`,validate:(()=>{const e=u=>Array.isArray(u.functions)&&u.functions.every(l=>typeof l=="object"&&l!==null&&t(l)),t=u=>typeof u.reason=="string"&&typeof u.name=="string",n=(u,l,c=!0)=>[(Array.isArray(u.functions)||o(c,{path:l+".functions",expected:"Array<___IChatFunctionReference>",value:u.functions}))&&u.functions.map((p,d)=>(typeof p=="object"&&p!==null||o(c,{path:l+".functions["+d+"]",expected:"___IChatFunctionReference",value:p}))&&i(p,l+".functions["+d+"]",c)||o(c,{path:l+".functions["+d+"]",expected:"___IChatFunctionReference",value:p})).every(p=>p)||o(c,{path:l+".functions",expected:"Array<___IChatFunctionReference>",value:u.functions})].every(p=>p),i=(u,l,c=!0)=>[typeof u.reason=="string"||o(c,{path:l+".reason",expected:"string",value:u.reason}),typeof u.name=="string"||o(c,{path:l+".name",expected:"string",value:u.name})].every(p=>p),r=u=>typeof u=="object"&&u!==null&&e(u);let a,o;return u=>{if(r(u)===!1){a=[],o=bn(a),((c,p,d=!0)=>(typeof c=="object"&&c!==null||o(!0,{path:p+"",expected:"__IChatFunctionReference.IProps",value:c}))&&n(c,p+"",!0)||o(!0,{path:p+"",expected:"__IChatFunctionReference.IProps",value:c}))(u,"$input",!0);const l=a.length===0;return l?{success:l,data:u}:{success:l,errors:a,data:u}}return{success:!0,data:u}}})()}]};async function fp(e){var a;if(e.operations.divided===void 0)return Gn(e,e.operations.array,0);const t=e.operations.divided.map(()=>[]),n=[],i=await Promise.all(e.operations.divided.map(async(o,u)=>Gn({...e,stack:t[u],dispatch:async l=>{n.push(l)}},o,0)));if(t.every(o=>o.length===0))return i[0];if((((a=e.config)==null?void 0:a.eliticism)??Ct.ELITICISM)===!0)return Gn(e,t.flat().map(o=>e.operations.group.get(o.operation.controller.name).get(o.operation.function.name)),0);const r=ti({id:ir(),selections:[]});for(const o of n)o.type==="select"&&(r.selections.push(o.selection),await ii(e,{name:o.selection.operation.name,reason:o.selection.reason}));return[r]}async function Gn(e,t,n,i){var l,c,p,d;const r=await e.request("cancel",{messages:[{role:"system",content:jt.write(e.config)},{role:"assistant",tool_calls:[{type:"function",id:"getApiFunctions",function:{name:"getApiFunctions",arguments:JSON.stringify({})}}]},{role:"tool",tool_call_id:"getApiFunctions",content:JSON.stringify(t.map(I=>({name:I.name,description:I.function.description,...I.protocol==="http"?{method:I.function.method,path:I.function.path,tags:I.function.tags}:{}})))},...e.histories.map(Ut).flat(),{role:"user",content:e.prompt.text},{role:"system",content:((p=(c=(l=e.config)==null?void 0:l.systemPrompt)==null?void 0:c.cancel)==null?void 0:p.call(c,e.histories))??_t.CANCEL},...mp(i??[])],tools:dp.functions.map(I=>({type:"function",function:{name:I.name,description:I.description,parameters:I.parameters}})),tool_choice:"auto",parallel_tool_calls:!0}),a=await Qe.readAll(r),o=rt.merge(a);if(n++<(((d=e.config)==null?void 0:d.retry)??Ct.RETRY)){const I=[];for(const f of o.choices)for(const A of f.message.tool_calls??[]){if(A.function.name!=="cancelFunctions")continue;const _=JSON.parse(A.function.arguments),M=(()=>{const x=L=>Array.isArray(L.functions)&&L.functions.every(H=>typeof H=="object"&&H!==null&&V(H)),V=L=>typeof L.reason=="string"&&typeof L.name=="string",R=(L,H,J=!0)=>[(Array.isArray(L.functions)||j(J,{path:H+".functions",expected:"Array<___IChatFunctionReference>",value:L.functions}))&&L.functions.map((T,F)=>(typeof T=="object"&&T!==null||j(J,{path:H+".functions["+F+"]",expected:"___IChatFunctionReference",value:T}))&&K(T,H+".functions["+F+"]",J)||j(J,{path:H+".functions["+F+"]",expected:"___IChatFunctionReference",value:T})).every(T=>T)||j(J,{path:H+".functions",expected:"Array<___IChatFunctionReference>",value:L.functions})].every(T=>T),K=(L,H,J=!0)=>[typeof L.reason=="string"||j(J,{path:H+".reason",expected:"string",value:L.reason}),typeof L.name=="string"||j(J,{path:H+".name",expected:"string",value:L.name})].every(T=>T),X=L=>typeof L=="object"&&L!==null&&x(L);let v,j;return L=>{if(X(L)===!1){v=[],j=bn(v),((J,T,F=!0)=>(typeof J=="object"&&J!==null||j(!0,{path:T+"",expected:"__IChatFunctionReference.IProps",value:J}))&&R(J,T+"",!0)||j(!0,{path:T+"",expected:"__IChatFunctionReference.IProps",value:J}))(L,"$input",!0);const H=v.length===0;return H?{success:H,data:L}:{success:H,errors:v,data:L}}return{success:!0,data:L}}})()(_);M.success===!1&&I.push({id:A.id,name:A.function.name,validation:M})}if(I.length>0)return Gn(e,t,n,I)}const u=[];for(const I of o.choices)if(I.message.tool_calls!=null)for(const f of I.message.tool_calls){if(f.type!=="function"||f.function.name!=="cancelFunctions")continue;const A=(()=>{const M=R=>Array.isArray(R.functions)&&R.functions.every(K=>typeof K=="object"&&K!==null&&x(K)),x=R=>typeof R.reason=="string"&&typeof R.name=="string",V=R=>typeof R=="object"&&R!==null&&M(R);return R=>(R=JSON.parse(R),V(R)?R:null)})()(f.function.arguments);if(A===null)continue;const _=ti({id:f.id,selections:[]});for(const M of A.functions){const x=await ii(e,M);x!==null&&_.selections.push(x)}_.selections.length!==0&&u.push(_)}return u}function mp(e){return e.map(t=>[{role:"assistant",tool_calls:[{type:"function",id:t.id,function:{name:t.name,arguments:JSON.stringify(t.validation.data)}}]},{role:"tool",content:JSON.stringify(t.validation.errors),tool_call_id:t.id},{role:"system",content:["You A.I. assistant has composed wrong typed arguments.","","Correct it at the next function calling."].join(`
`)}]).flat()}class Ip{constructor(){this.queue=[],this.resolvers=[],this.closeResolvers=[],this.emptyResolvers=[],this.closed=!1}enqueue(t){var n;this.queue.push(t),this.resolvers.length>0&&((n=this.resolvers.shift())==null||n({value:this.queue.shift(),done:!1}))}async dequeue(){return this.queue.length>0?{value:this.queue.shift(),done:!1}:this.closed?(this.emptyResolvers.length>0&&(this.emptyResolvers.forEach(t=>t()),this.emptyResolvers=[]),{value:void 0,done:!0}):new Promise(t=>this.resolvers.push(t))}isEmpty(){return this.queue.length===0}isClosed(){return this.closed}done(){return this.isClosed()&&this.isEmpty()}close(){var t;for(this.closed=!0;this.resolvers.length>0;)(t=this.resolvers.shift())==null||t({value:void 0,done:!0});this.closeResolvers.forEach(n=>n())}async waitUntilEmpty(){return this.isEmpty()?Promise.resolve():new Promise(t=>{this.emptyResolvers.push(t)})}async waitClosed(){return this.isClosed()?Promise.resolve():new Promise(t=>{this.closeResolvers.push(t)})}}class Bo{constructor(){this.queue=new Ip,this.consumer=new ReadableStream({pull:async t=>{const{value:n,done:i}=await this.queue.dequeue();if(i===!0){t.close();return}t.enqueue(n)}})}produce(t){this.queue.enqueue(t)}close(){this.queue.close()}done(){return this.queue.done()}async waitClosed(){await this.queue.waitClosed()}async waitUntilEmpty(){await this.queue.waitUntilEmpty()}}async function gp(e,t){var o,u,l;if(t.length===0)return[];const n=await e.request("describe",{messages:[{role:"system",content:jt.write(e.config)},...t.map(Ut).flat(),{role:"system",content:((l=(u=(o=e.config)==null?void 0:o.systemPrompt)==null?void 0:u.describe)==null?void 0:l.call(u,t))??_t.DESCRIBE}]}),i=[],r=await Qe.reduce(n,async(c,p)=>{const d=await c,I=f=>{for(const A of f){if(A.finish_reason!=null){i[A.index].mpsc.close();continue}if(A.delta.content==null)continue;if(i[A.index]!=null){i[A.index].content+=A.delta.content,i[A.index].mpsc.produce(A.delta.content);continue}const _=new Bo;i[A.index]={content:A.delta.content,mpsc:_},_.produce(A.delta.content),e.dispatch(Uc({executes:t,stream:_.consumer,done:()=>_.done(),get:()=>{var M;return((M=i[A.index])==null?void 0:M.content)??""},join:async()=>(await _.waitClosed(),i[A.index].content)}))}};return d.object==="chat.completion.chunk"?(I([d,p].flatMap(f=>f.choices)),rt.merge([d,p])):(I(p.choices),rt.accumulate(d,p))});if(r==null)throw new Error("No completion received");return r.choices.map(c=>c.message.role==="assistant"?c.message.content:null).filter(c=>c!==null).map(c=>xo({executes:t,text:c}))}const vn=[{name:"getApiFunctions",parameters:{description:"Current Type: {@link object}",type:"object",properties:{},required:[],additionalProperties:!1,$defs:{RecordstringIChatGptSchema:{description:"Construct a type with a set of properties K of type T",type:"object",properties:{},required:[],additionalProperties:{$ref:"#/$defs/IChatGptSchema"}},IChatGptSchema:{title:"Type schema info of the ChatGPT",description:`Type schema info of the ChatGPT.

\`IChatGptSchema\` is a type schema info of the ChatGPT function calling.

\`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
speciifcation; {@link OpenApiV3_1.IJsonSchema}.

However, the \`IChatGptSchema\` does not follow the entire specification of
the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.

- Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
- Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
- Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
- Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
- Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
- Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
- Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
- When {@link IChatGptSchema.IConfig.strict} mode
  - Every object properties must be required
  - Do not allow {@link IChatGptSchema.IObject.additionalProperties}

If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,

- {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
- {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
- {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
- {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
- No tuple type {@link OpenApi.IJsonSchema.ITuple} support
- When {@link IChatGptSchema.IConfig.strict} mode
  - Every object properties must be required
  - Do not allow {@link IChatGptSchema.IObject.additionalProperties}

For reference, if you've composed the \`IChatGptSchema\` type with the
{@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
only the recursived named types would be archived into the
{@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
{@link IChatGptSchema.IReference} type.

Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
fills the {@link IChatGptSchema.__IAttribute.description} property with
the comment text like \`"@format uuid"\`.

- {@link OpenApi.IJsonSchema.INumber.minimum}
- {@link OpenApi.IJsonSchema.INumber.maximum}
- {@link OpenApi.IJsonSchema.INumber.multipleOf}
- {@link OpenApi.IJsonSchema.IString.minLength}
- {@link OpenApi.IJsonSchema.IString.maxLength}
- {@link OpenApi.IJsonSchema.IString.format}
- {@link OpenApi.IJsonSchema.IString.pattern}
- {@link OpenApi.IJsonSchema.IString.contentMediaType}
- {@link OpenApi.IJsonSchema.IString.default}
- {@link OpenApi.IJsonSchema.IArray.minItems}
- {@link OpenApi.IJsonSchema.IArray.maxItems}
- {@link OpenApi.IJsonSchema.IArray.unique}

Additionally, OpenAI cannot define the \`description\` property to the
{@link IChatGptSchema.IReference} type, and even does not understand
the capsulization to the {@link IChatGptSchema.IAnyOf} type.
Therefore, the \`description\` is written to the parent object type,
not the reference type.

\`\`\`json
{
  "type": "object",
  "description": "### Description of {@link something} property.\\n\\n> Hello?",
  "properties": {
    "something": {
      "$ref": "#/$defs/SomeObject"
    }
  }
}
\`\`\``,anyOf:[{$ref:"#/$defs/IChatGptSchema.IObject"},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"boolean"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["boolean"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IBoolean} type:

> Boolean type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"number"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["integer"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IInteger} type:

> Integer type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"number"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["number"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.INumber} type:

> Number (double) type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"string"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["string"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IString} type:

> String type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{$ref:"#/$defs/IChatGptSchema.IArray"},{type:"object",properties:{$ref:{title:"Reference to the named schema",description:"Reference to the named schema.\n\nThe `ref` is a reference to the named schema. Format of the `$ref` is\nfollowing the JSON Pointer specification. In the OpenAPI, the `$ref`\nstarts with `#/$defs/` which means the type is stored in\nthe {@link IChatGptSchema.IParameters.$defs} object.\n\n- `#/$defs/SomeObject`\n- `#/$defs/AnotherObject`",type:"string"},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["$ref"],description:`Description of the current {@link IChatGptSchema.IReference} type:

> Reference type directing named schema.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{$ref:"#/$defs/IChatGptSchema.IAnyOf"},{type:"object",properties:{type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["null"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.INull} type:

> Null type.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:[],description:`Description of the current {@link IChatGptSchema.IUnknown} type:

> Unknown, the \`any\` type.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``}]},"IChatGptSchema.IObject":{description:`Object type info.

### Description of {@link properties} property:

> Properties of the object.
> 
> The \`properties\` means a list of key-value pairs of the object's
> regular properties. The key is the name of the regular property,
> and the value is the type schema info.`,type:"object",properties:{properties:{title:"Properties of the object",$ref:"#/$defs/RecordstringIChatGptSchema"},additionalProperties:{title:"Additional properties' info",description:"Additional properties' info.\n\nThe `additionalProperties` means the type schema info of the additional\nproperties that are not listed in the {@link properties}.\n\nBy the way, if you've configured {@link IChatGptSchema.IConfig.strict} as `true`,\nChatGPT function calling does not support such dynamic key typed properties, so\nthe `additionalProperties` becomes always `false`.",anyOf:[{type:"boolean"},{$ref:"#/$defs/IChatGptSchema.IObject"},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"string"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["string"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IString} type:

> String type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"number"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["number"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.INumber} type:

> Number (double) type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"number"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["integer"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IInteger} type:

> Integer type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"boolean"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["boolean"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IBoolean} type:

> Boolean type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{$ref:"#/$defs/IChatGptSchema.IArray"},{type:"object",properties:{$ref:{title:"Reference to the named schema",description:"Reference to the named schema.\n\nThe `ref` is a reference to the named schema. Format of the `$ref` is\nfollowing the JSON Pointer specification. In the OpenAPI, the `$ref`\nstarts with `#/$defs/` which means the type is stored in\nthe {@link IChatGptSchema.IParameters.$defs} object.\n\n- `#/$defs/SomeObject`\n- `#/$defs/AnotherObject`",type:"string"},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["$ref"],description:`Description of the current {@link IChatGptSchema.IReference} type:

> Reference type directing named schema.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{$ref:"#/$defs/IChatGptSchema.IAnyOf"},{type:"object",properties:{title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:[],description:`Description of the current {@link IChatGptSchema.IUnknown} type:

> Unknown, the \`any\` type.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["null"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.INull} type:

> Null type.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``}]},required:{title:"List of key values of the required properties",description:`List of key values of the required properties.

The \`required\` means a list of the key values of the required
{@link properties}. If some property key is not listed in the \`required\`
list, it means that property is optional. Otherwise some property key
exists in the \`required\` list, it means that the property must be filled.

Below is an example of the {@link properties} and \`required\`.

\`\`\`typescript
interface SomeObject {
  id: string;
  email: string;
  name?: string;
}
\`\`\`

As you can see, \`id\` and \`email\` {@link properties} are {@link required},
so that they are listed in the \`required\` list.

\`\`\`json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "email": { "type": "string" },
    "name": { "type": "string" }
  },
  "required": ["id", "email"]
}
\`\`\``,type:"array",items:{type:"string"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["object"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["properties","required","type"]},"IChatGptSchema.IArray":{description:`Array type info.

### Description of {@link items} property:

> Items type info.
> 
> The \`items\` means the type of the array elements. In other words, it is
> the type schema info of the \`T\` in the TypeScript array type \`Array<T>\`.`,type:"object",properties:{items:{title:"Items type info",$ref:"#/$defs/IChatGptSchema"},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["array"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["items","type"]},"IChatGptSchema.IAnyOf":{description:"Union type.\n\nIOneOf` represents an union type of the TypeScript (`A | B | C`).\n\nFor reference, even though your Swagger (or OpenAPI) document has\ndefined `anyOf` instead of the `oneOf`, {@link IChatGptSchema} forcibly\nconverts it to `oneOf` type.",type:"object",properties:{anyOf:{title:"List of the union types",description:"List of the union types.",type:"array",items:{anyOf:[{$ref:"#/$defs/IChatGptSchema.IObject"},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"string"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["string"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IString} type:

> String type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"number"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["number"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.INumber} type:

> Number (double) type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"number"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["integer"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IInteger} type:

> Integer type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"boolean"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["boolean"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IBoolean} type:

> Boolean type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{$ref:"#/$defs/IChatGptSchema.IArray"},{type:"object",properties:{$ref:{title:"Reference to the named schema",description:"Reference to the named schema.\n\nThe `ref` is a reference to the named schema. Format of the `$ref` is\nfollowing the JSON Pointer specification. In the OpenAPI, the `$ref`\nstarts with `#/$defs/` which means the type is stored in\nthe {@link IChatGptSchema.IParameters.$defs} object.\n\n- `#/$defs/SomeObject`\n- `#/$defs/AnotherObject`",type:"string"},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["$ref"],description:`Description of the current {@link IChatGptSchema.IReference} type:

> Reference type directing named schema.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:[],description:`Description of the current {@link IChatGptSchema.IUnknown} type:

> Unknown, the \`any\` type.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["null"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.INull} type:

> Null type.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``}]}},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["anyOf"]}}},output:{type:"array",items:{description:`Description of the current {@link IHttpLlmFunctionchatgpt} type:

> LLM function calling schema from HTTP (OpenAPI) operation.
> 
> \`IHttpLlmFunction\` is a data structure representing a function converted
> from the {@link OpenApi.IOperation OpenAPI operation}, used for the LLM
> (Large Language Model) function calling. It's a typical RPC (Remote Procedure Call)
> structure containing the function {@link name}, {@link parameters}, and
> {@link output return type}.
> 
> If you provide this \`IHttpLlmFunction\` data to the LLM provider like "OpenAI",
> the "OpenAI" will compose a function arguments by analyzing conversations with
> the user. With the LLM composed arguments, you can execute the function through
> {@link LlmFetcher.execute} and get the result.
> 
> For reference, different between \`IHttpLlmFunction\` and its origin source
> {@link OpenApi.IOperation} is, \`IHttpLlmFunction\` has converted every type schema
> information from {@link OpenApi.IJsonSchema} to {@link ILlmSchemaV3} to escape
> {@link OpenApi.IJsonSchema.IReference reference types}, and downgrade the version
> of the JSON schema to OpenAPI 3.0. It's because LLM function call feature cannot
> understand both reference types and OpenAPI 3.1 specification.
> 
> Additionally, the properties' rule is:
> 
> - \`pathParameters\`: Path parameters of {@link OpenApi.IOperation.parameters}
> - \`query\`: Query parameter of {@link IHttpMigrateRoute.query}
> - \`body\`: Body parameter of {@link IHttpMigrateRoute.body}
> 
> \`\`\`typescript
> {
>   ...pathParameters,
>   query,
>   body,
> }
> \`\`\``,type:"object",properties:{method:{title:"HTTP method of the endpoint",description:"HTTP method of the endpoint.",type:"string",enum:["get","post","patch","put","delete"]},path:{title:"Path of the endpoint",description:"Path of the endpoint.",type:"string"},name:{title:"Representative name of the function",description:"Representative name of the function.\n\nThe `name` is a repsentative name identifying the function in the\n{@link IHttpLlmApplication}. The `name` value is just composed by joining the\n{@link IHttpMigrateRoute.accessor} by underscore `_` character.\n\nHere is the composition rule of the  {@link IHttpMigrateRoute.accessor}:\n\n> The `accessor` is composed with the following rules. At first,\n> namespaces are composed by static directory names in the {@link path}.\n> Parametric symbols represented by `:param` or `{param}` cannot be\n> a part of the namespace.\n>\n> Instead, they would be a part of the function name. The function\n> name is composed with the {@link method HTTP method} and parametric\n> symbols like `getByParam` or `postByParam`. If there are multiple\n> path parameters, they would be concatenated by `And` like\n> `getByParam1AndParam2`.\n>\n> For refefence, if the {@link operation}'s {@link method} is `delete`,\n> the function name would be replaced to `erase` instead of `delete`.\n> It is the reason why the `delete` is a reserved keyword in many\n> programming languages.\n>\n> - Example 1\n>   - path: `POST /shopping/sellers/sales`\n>   - accessor: `shopping.sellers.sales.post`\n> - Example 2\n>   - endpoint: `GET /shoppings/sellers/sales/:saleId/reviews/:reviewId/comments/:id\n>   - accessor: `shoppings.sellers.sales.reviews.getBySaleIdAndReviewIdAndCommentId`\n\n\n@maxLength 64",type:"string"},parameters:{description:`List of parameter types.

If you've configured {@link IHttpLlmApplication.IOptions.keyword} as \`true\`,
number of {@link IHttpLlmFunction.parameters} are always 1 and the first
parameter's type is always {@link ILlmSchemaV3.IObject}. The
properties' rule is:

- \`pathParameters\`: Path parameters of {@link IHttpMigrateRoute.parameters}
- \`query\`: Query parameter of {@link IHttpMigrateRoute.query}
- \`body\`: Body parameter of {@link IHttpMigrateRoute.body}

\`\`\`typescript
{
  ...pathParameters,
  query,
  body,
}
\`\`\`

Otherwise, the parameters would be multiple, and the sequence of the
parameters are following below rules:

\`\`\`typescript
[
  ...pathParameters,
  ...(query ? [query] : []),
  ...(body ? [body] : []),
]
\`\`\`

------------------------------

Description of the current {@link IChatGptSchema.IParameters} type:

> Type of the function parameters.
> 
> \`IChatGptSchema.IParameters\` is a type defining a function's parameters
> as a keyworded object type.
> 
> It also can be utilized for the structured output metadata.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\`

### Description of {@link $defs} property:

> Collection of the named types.

### Description of {@link properties} property:

> Properties of the object.
> 
> The \`properties\` means a list of key-value pairs of the object's
> regular properties. The key is the name of the regular property,
> and the value is the type schema info.`,type:"object",properties:{$defs:{title:"Collection of the named types",$ref:"#/$defs/RecordstringIChatGptSchema"},additionalProperties:{title:"Additional properties' info",description:`Additional properties' info.

The \`additionalProperties\` means the type schema info of the additional
properties that are not listed in the {@link properties}.

By the way, it is not allowed in the parameters level.`,type:"boolean",enum:[!1]},properties:{title:"Properties of the object",$ref:"#/$defs/RecordstringIChatGptSchema"},required:{title:"List of key values of the required properties",description:`List of key values of the required properties.

The \`required\` means a list of the key values of the required
{@link properties}. If some property key is not listed in the \`required\`
list, it means that property is optional. Otherwise some property key
exists in the \`required\` list, it means that the property must be filled.

Below is an example of the {@link properties} and \`required\`.

\`\`\`typescript
interface SomeObject {
  id: string;
  email: string;
  name?: string;
}
\`\`\`

As you can see, \`id\` and \`email\` {@link properties} are {@link required},
so that they are listed in the \`required\` list.

\`\`\`json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "email": { "type": "string" },
    "name": { "type": "string" }
  },
  "required": ["id", "email"]
}
\`\`\``,type:"array",items:{type:"string"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["object"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["$defs","additionalProperties","properties","required","type"]},separated:{description:`Collection of separated parameters.

Filled only when {@link IHttpLlmApplication.IOptions.separate} is configured.

------------------------------

Description of the current {@link IHttpLlmFunction.ISeparatedchatgpt} type:

> Collection of separated parameters.`,type:"object",properties:{llm:{description:`Parameters that would be composed by the LLM.

Even though no property exists in the LLM side, the \`llm\` property
would have at least empty object type.

------------------------------

Description of the current {@link IChatGptSchema.IParameters} type:

> Type of the function parameters.
> 
> \`IChatGptSchema.IParameters\` is a type defining a function's parameters
> as a keyworded object type.
> 
> It also can be utilized for the structured output metadata.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\`

### Description of {@link $defs} property:

> Collection of the named types.

### Description of {@link properties} property:

> Properties of the object.
> 
> The \`properties\` means a list of key-value pairs of the object's
> regular properties. The key is the name of the regular property,
> and the value is the type schema info.`,type:"object",properties:{$defs:{title:"Collection of the named types",$ref:"#/$defs/RecordstringIChatGptSchema"},additionalProperties:{title:"Additional properties' info",description:`Additional properties' info.

The \`additionalProperties\` means the type schema info of the additional
properties that are not listed in the {@link properties}.

By the way, it is not allowed in the parameters level.`,type:"boolean",enum:[!1]},properties:{title:"Properties of the object",$ref:"#/$defs/RecordstringIChatGptSchema"},required:{title:"List of key values of the required properties",description:`List of key values of the required properties.

The \`required\` means a list of the key values of the required
{@link properties}. If some property key is not listed in the \`required\`
list, it means that property is optional. Otherwise some property key
exists in the \`required\` list, it means that the property must be filled.

Below is an example of the {@link properties} and \`required\`.

\`\`\`typescript
interface SomeObject {
  id: string;
  email: string;
  name?: string;
}
\`\`\`

As you can see, \`id\` and \`email\` {@link properties} are {@link required},
so that they are listed in the \`required\` list.

\`\`\`json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "email": { "type": "string" },
    "name": { "type": "string" }
  },
  "required": ["id", "email"]
}
\`\`\``,type:"array",items:{type:"string"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["object"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["$defs","additionalProperties","properties","required","type"]},human:{title:"Parameters that would be composed by the human",description:"Parameters that would be composed by the human.",anyOf:[{type:"null"},{type:"object",properties:{$defs:{title:"Collection of the named types",$ref:"#/$defs/RecordstringIChatGptSchema"},additionalProperties:{title:"Additional properties' info",description:`Additional properties' info.

The \`additionalProperties\` means the type schema info of the additional
properties that are not listed in the {@link properties}.

By the way, it is not allowed in the parameters level.`,type:"boolean",enum:[!1]},properties:{title:"Properties of the object",$ref:"#/$defs/RecordstringIChatGptSchema"},required:{title:"List of key values of the required properties",description:`List of key values of the required properties.

The \`required\` means a list of the key values of the required
{@link properties}. If some property key is not listed in the \`required\`
list, it means that property is optional. Otherwise some property key
exists in the \`required\` list, it means that the property must be filled.

Below is an example of the {@link properties} and \`required\`.

\`\`\`typescript
interface SomeObject {
  id: string;
  email: string;
  name?: string;
}
\`\`\`

As you can see, \`id\` and \`email\` {@link properties} are {@link required},
so that they are listed in the \`required\` list.

\`\`\`json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "email": { "type": "string" },
    "name": { "type": "string" }
  },
  "required": ["id", "email"]
}
\`\`\``,type:"array",items:{type:"string"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["object"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["$defs","additionalProperties","properties","required","type"],description:`Description of the current {@link IChatGptSchema.IParameters} type:

> Type of the function parameters.
> 
> \`IChatGptSchema.IParameters\` is a type defining a function's parameters
> as a keyworded object type.
> 
> It also can be utilized for the structured output metadata.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\`

### Description of {@link $defs} property:

> Collection of the named types.

### Description of {@link properties} property:

> Properties of the object.
> 
> The \`properties\` means a list of key-value pairs of the object's
> regular properties. The key is the name of the regular property,
> and the value is the type schema info.`}]}},required:["llm","human"]},output:{title:"Expected return type",description:"Expected return type.\n\nIf the target operation returns nothing (`void`), the `output`\nwould be `undefined`.",anyOf:[{$ref:"#/$defs/IChatGptSchema.IObject"},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"string"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["string"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IString} type:

> String type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"number"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["number"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.INumber} type:

> Number (double) type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"number"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["integer"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IInteger} type:

> Integer type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{enum:{title:"Enumeration values",description:"Enumeration values.",type:"array",items:{type:"boolean"}},type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["boolean"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.IBoolean} type:

> Boolean type info.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{$ref:"#/$defs/IChatGptSchema.IArray"},{type:"object",properties:{$ref:{title:"Reference to the named schema",description:"Reference to the named schema.\n\nThe `ref` is a reference to the named schema. Format of the `$ref` is\nfollowing the JSON Pointer specification. In the OpenAPI, the `$ref`\nstarts with `#/$defs/` which means the type is stored in\nthe {@link IChatGptSchema.IParameters.$defs} object.\n\n- `#/$defs/SomeObject`\n- `#/$defs/AnotherObject`",type:"string"},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["$ref"],description:`Description of the current {@link IChatGptSchema.IReference} type:

> Reference type directing named schema.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{$ref:"#/$defs/IChatGptSchema.IAnyOf"},{type:"object",properties:{title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:[],description:`Description of the current {@link IChatGptSchema.IUnknown} type:

> Unknown, the \`any\` type.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``},{type:"object",properties:{type:{title:"Discriminator value of the type",description:"Discriminator value of the type.",type:"string",enum:["null"]},title:{title:"Title of the schema",description:"Title of the schema.",type:"string"},description:{title:"Detailed description of the schema",description:"Detailed description of the schema.",type:"string"},deprecated:{title:"Whether the type is deprecated or not",description:"Whether the type is deprecated or not.",type:"boolean"},example:{title:"Example value",description:"Example value."},examples:{description:`List of example values as key-value pairs.

------------------------------

Description of the current {@link Recordstringany} type:

> Construct a type with a set of properties K of type T`,type:"object",properties:{},required:[],additionalProperties:{}}},required:["type"],description:`Description of the current {@link IChatGptSchema.INull} type:

> Null type.

------------------------------

Description of the parent {@link IChatGptSchema} type:

> Type schema info of the ChatGPT.
> 
> \`IChatGptSchema\` is a type schema info of the ChatGPT function calling.
> 
> \`IChatGptSchema\` basically follows the JSON schema definition of the OpenAPI v3.1
> speciifcation; {@link OpenApiV3_1.IJsonSchema}.
> 
> However, the \`IChatGptSchema\` does not follow the entire specification of
> the OpenAPI v3.1. It has own specific restrictions and definitions. Here is the
> list of how \`IChatGptSchema\` is different with the OpenAPI v3.1 JSON schema.
> 
> - Decompose mixed type: {@link OpenApiV3_1.IJsonSchema.IMixed}
> - Resolve nullable property: {@link OpenApiV3_1.IJsonSchema.__ISignificant.nullable}
> - Tuple type is banned: {@link OpenApiV3_1.IJsonSchema.ITuple.prefixItems}
> - Constant type is banned: {@link OpenApiV3_1.IJsonSchema.IConstant}
> - Merge {@link OpenApiV3_1.IJsonSchema.IOneOf} to {@link IChatGptSchema.IAnOf}
> - Merge {@link OpenApiV3_1.IJsonSchema.IAllOf} to {@link IChatGptSchema.IObject}
> - Merge {@link OpenApiV3_1.IJsonSchema.IRecursiveReference} to {@link IChatGptSchema.IReference}
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> If compare with the {@link OpenApi.IJsonSchema}, the emended JSON schema specification,
> 
> - {@link IChatGptSchema.IAnyOf} instead of the {@link OpenApi.IJsonSchema.IOneOf}
> - {@link IChatGptSchema.IParameters.$defs} instead of the {@link OpenApi.IJsonSchema.IComponents.schemas}
> - {@link IChatGptSchema.IString.enum} instead of the {@link OpenApi.IJsonSchema.IConstant}
> - {@link IChatGptSchema.additionalProperties} is fixed to \`false\`
> - No tuple type {@link OpenApi.IJsonSchema.ITuple} support
> - When {@link IChatGptSchema.IConfig.strict} mode
>   - Every object properties must be required
>   - Do not allow {@link IChatGptSchema.IObject.additionalProperties}
> 
> For reference, if you've composed the \`IChatGptSchema\` type with the
> {@link IChatGptSchema.IConfig.reference} \`false\` option (default is \`false\`),
> only the recursived named types would be archived into the
> {@link IChatGptSchema.IParameters.$defs}, and the others would be ecaped from the
> {@link IChatGptSchema.IReference} type.
> 
> Also, OpenAI has banned below constraint properties. Instead, \`IChatGptSchema\`
> fills the {@link IChatGptSchema.__IAttribute.description} property with
> the comment text like \`"@format uuid"\`.
> 
> - {@link OpenApi.IJsonSchema.INumber.minimum}
> - {@link OpenApi.IJsonSchema.INumber.maximum}
> - {@link OpenApi.IJsonSchema.INumber.multipleOf}
> - {@link OpenApi.IJsonSchema.IString.minLength}
> - {@link OpenApi.IJsonSchema.IString.maxLength}
> - {@link OpenApi.IJsonSchema.IString.format}
> - {@link OpenApi.IJsonSchema.IString.pattern}
> - {@link OpenApi.IJsonSchema.IString.contentMediaType}
> - {@link OpenApi.IJsonSchema.IString.default}
> - {@link OpenApi.IJsonSchema.IArray.minItems}
> - {@link OpenApi.IJsonSchema.IArray.maxItems}
> - {@link OpenApi.IJsonSchema.IArray.unique}
> 
> Additionally, OpenAI cannot define the \`description\` property to the
> {@link IChatGptSchema.IReference} type, and even does not understand
> the capsulization to the {@link IChatGptSchema.IAnyOf} type.
> Therefore, the \`description\` is written to the parent object type,
> not the reference type.
> 
> \`\`\`json
> {
>   "type": "object",
>   "description": "### Description of {@link something} property.\\n\\n> Hello?",
>   "properties": {
>     "something": {
>       "$ref": "#/$defs/SomeObject"
>     }
>   }
> }
> \`\`\``}]},description:{title:"Description of the function",description:`Description of the function.

\`IHttpLlmFunction.description\` is composed by below rule:

1. Starts from the {@link OpenApi.IOperation.summary} paragraph.
2. The next paragraphs are filled with the
   {@link OpenApi.IOperation.description}. By the way, if the first
   paragraph of {@link OpenApi.IOperation.description} is same with the
   {@link OpenApi.IOperation.summary}, it would not be duplicated.
3. Parameters' descriptions are added with \`@param\` tag.
4. {@link OpenApi.IOperation.security Security requirements} are added
   with \`@security\` tag.
5. Tag names are added with \`@tag\` tag.
6. If {@link OpenApi.IOperation.deprecated}, \`@deprecated\` tag is added.

For reference, the \`description\` is very important property to teach
the purpose of the function to the LLM (Language Large Model), and
LLM actually determines which function to call by the description.

Also, when the LLM conversates with the user, the \`description\` is
used to explain the function to the user. Therefore, the \`description\`
property has the highest priority, and you have to consider it.`,type:"string"},deprecated:{title:"Whether the function is deprecated or not",description:"Whether the function is deprecated or not.\n\nIf the `deprecated` is `true`, the function is not recommended to use.\n\nLLM (Large Language Model) may not use the deprecated function.",type:"boolean"},tags:{title:"Category tags for the function",description:`Category tags for the function.

Same with {@link OpenApi.IOperation.tags} indicating the category of the function.`,type:"array",items:{type:"string"}}},required:["method","path","name","parameters"]}},description:`Get list of API functions.

If user seems like to request some function calling except this one,
call this \`getApiFunctions()\` to get the list of candidate API functions
provided from this application.

Also, user just wants to list up every remote API functions that can be
called from the backend server, utilize this function too.`,validate:(()=>{const e=a=>!0,t=(a,o,u=!0)=>!0,n=a=>typeof a=="object"&&a!==null&&Array.isArray(a)===!1&&e();let i,r;return a=>{if(n(a)===!1){i=[],r=bn(i),((u,l,c=!0)=>(typeof u=="object"&&u!==null&&Array.isArray(u)===!1||r(!0,{path:l+"",expected:"object",value:u}))&&t(u,l+"",!0)||r(!0,{path:l+"",expected:"object",value:u}))(a,"$input",!0);const o=i.length===0;return o?{success:o,data:a}:{success:o,errors:i,data:a}}return{success:!0,data:a}}})()}][0];async function yp(e){var a,o,u;const t=await e.request("initialize",{messages:[{role:"system",content:jt.write(e.config)},...e.histories.map(Ut).flat(),{role:"user",content:e.prompt.text},{role:"system",content:((u=(o=(a=e.config)==null?void 0:a.systemPrompt)==null?void 0:o.initialize)==null?void 0:u.call(o,e.histories))??_t.INITIALIZE}],tools:[{type:"function",function:{name:vn.name,description:vn.description,parameters:vn.parameters}}],tool_choice:"auto",parallel_tool_calls:!1}),n=[],i=await Qe.reduce(t,async(l,c)=>{const p=await l,d=I=>{var f;for(const A of I){if(A.finish_reason!=null){(f=n[A.index])==null||f.mpsc.close();continue}if(A.delta.content==null)continue;if(n[A.index]!=null){n[A.index].content+=A.delta.content,n[A.index].mpsc.produce(A.delta.content);continue}const _=new Bo;n[A.index]={content:A.delta.content,mpsc:_},_.produce(A.delta.content),e.dispatch(ni({role:"assistant",stream:_.consumer,done:()=>_.done(),get:()=>n[A.index].content,join:async()=>(await _.waitClosed(),n[A.index].content)}))}};return p.object==="chat.completion.chunk"?(d([p,c].flatMap(I=>I.choices)),rt.merge([p,c])):(d(c.choices),rt.accumulate(p,c))});if(i===null)throw new Error("No completion received");const r=[];for(const l of i.choices)l.message.role==="assistant"&&l.message.content!=null&&r.push(Sn({role:"assistant",text:l.message.content}));return i.choices.some(l=>l.message.tool_calls!=null&&l.message.tool_calls.some(c=>c.type==="function"&&c.function.name===vn.name))&&await e.initialize(),r}async function Go(e,t){const n=e.operations.flat.get(t.name);if(n===void 0)return null;const i=Ot({operation:n,reason:t.reason});return e.stack.push(i),e.dispatch(Hc({selection:i})),n}const bp={functions:[{name:"selectFunctions",parameters:{description:` Properties of the function

------------------------------

Current Type: {@link __IChatFunctionReference.IProps}`,type:"object",properties:{functions:{title:"List of target functions",description:"List of target functions.",type:"array",items:{description:"Current Type: {@link ___IChatFunctionReference}",type:"object",properties:{reason:{title:"The reason of the function selection",description:`The reason of the function selection.

Just write the reason why you've determined to select this function.`,type:"string"},name:{title:"Name of the target function to call",description:"Name of the target function to call.",type:"string"}},required:["reason","name"]}}},required:["functions"],additionalProperties:!1,$defs:{}},description:`Select proper API functions to call.

If you A.I. agent has found some proper API functions to call
from the conversation with user, please select the API functions
just by calling this function.

When user wants to call a same function multiply, you A.I. agent must
list up it multiply in the \`functions\` property. Otherwise the user has
requested to call many different functions, you A.I. agent have to assign
them all into the \`functions\` property.

Also, if you A.I. agent can't specify a specific function to call due to lack
of specificity or homogeneity of candidate functions, just assign all of them
by in the\` functions\` property\` too. Instead, when you A.I. agent can specify
a specific function to call, the others would be eliminated.`,validate:(()=>{const e=u=>Array.isArray(u.functions)&&u.functions.every(l=>typeof l=="object"&&l!==null&&t(l)),t=u=>typeof u.reason=="string"&&typeof u.name=="string",n=(u,l,c=!0)=>[(Array.isArray(u.functions)||o(c,{path:l+".functions",expected:"Array<___IChatFunctionReference>",value:u.functions}))&&u.functions.map((p,d)=>(typeof p=="object"&&p!==null||o(c,{path:l+".functions["+d+"]",expected:"___IChatFunctionReference",value:p}))&&i(p,l+".functions["+d+"]",c)||o(c,{path:l+".functions["+d+"]",expected:"___IChatFunctionReference",value:p})).every(p=>p)||o(c,{path:l+".functions",expected:"Array<___IChatFunctionReference>",value:u.functions})].every(p=>p),i=(u,l,c=!0)=>[typeof u.reason=="string"||o(c,{path:l+".reason",expected:"string",value:u.reason}),typeof u.name=="string"||o(c,{path:l+".name",expected:"string",value:u.name})].every(p=>p),r=u=>typeof u=="object"&&u!==null&&e(u);let a,o;return u=>{if(r(u)===!1){a=[],o=bn(a),((c,p,d=!0)=>(typeof c=="object"&&c!==null||o(!0,{path:p+"",expected:"__IChatFunctionReference.IProps",value:c}))&&n(c,p+"",!0)||o(!0,{path:p+"",expected:"__IChatFunctionReference.IProps",value:c}))(u,"$input",!0);const l=a.length===0;return l?{success:l,data:u}:{success:l,errors:a,data:u}}return{success:!0,data:u}}})()}]};async function Sp(e){var a;if(e.operations.divided===void 0)return Fn(e,e.operations.array,0);const t=e.operations.divided.map(()=>[]),n=[],i=await Promise.all(e.operations.divided.map(async(o,u)=>Fn({...e,stack:t[u],dispatch:async l=>{n.push(l)}},o,0)));if(t.every(o=>o.length===0))return i[0];if((((a=e.config)==null?void 0:a.eliticism)??Ct.ELITICISM)===!0)return Fn(e,t.flat().map(o=>e.operations.group.get(o.operation.controller.name).get(o.operation.function.name)),0);const r=ei({id:ir(),selections:[]});for(const o of n)o.type==="select"&&(r.selections.push(o.selection),await Go(e,{name:o.selection.operation.name,reason:o.selection.reason}));return[r]}async function Fn(e,t,n,i){var l,c,p,d;const r=await e.request("select",{messages:[{role:"system",content:jt.write(e.config)},{role:"assistant",tool_calls:[{type:"function",id:"getApiFunctions",function:{name:"getApiFunctions",arguments:JSON.stringify({})}}]},{role:"tool",tool_call_id:"getApiFunctions",content:JSON.stringify(t.map(I=>({name:I.name,description:I.function.description,...I.protocol==="http"?{method:I.function.method,path:I.function.path,tags:I.function.tags}:{}})))},...e.histories.map(Ut).flat(),{role:"user",content:e.prompt.text},{role:"system",content:((p=(c=(l=e.config)==null?void 0:l.systemPrompt)==null?void 0:c.select)==null?void 0:p.call(c,e.histories))??_t.SELECT},...Ap(i??[])],tools:bp.functions.map(I=>({type:"function",function:{name:I.name,description:I.description,parameters:I.parameters}})),tool_choice:"auto",parallel_tool_calls:!1}),a=await Qe.readAll(r),o=rt.merge(a);if(n++<(((d=e.config)==null?void 0:d.retry)??Ct.RETRY)){const I=[];for(const f of o.choices)for(const A of f.message.tool_calls??[]){if(A.function.name!=="selectFunctions")continue;const _=JSON.parse(A.function.arguments),M=(()=>{const x=L=>Array.isArray(L.functions)&&L.functions.every(H=>typeof H=="object"&&H!==null&&V(H)),V=L=>typeof L.reason=="string"&&typeof L.name=="string",R=(L,H,J=!0)=>[(Array.isArray(L.functions)||j(J,{path:H+".functions",expected:"Array<___IChatFunctionReference>",value:L.functions}))&&L.functions.map((T,F)=>(typeof T=="object"&&T!==null||j(J,{path:H+".functions["+F+"]",expected:"___IChatFunctionReference",value:T}))&&K(T,H+".functions["+F+"]",J)||j(J,{path:H+".functions["+F+"]",expected:"___IChatFunctionReference",value:T})).every(T=>T)||j(J,{path:H+".functions",expected:"Array<___IChatFunctionReference>",value:L.functions})].every(T=>T),K=(L,H,J=!0)=>[typeof L.reason=="string"||j(J,{path:H+".reason",expected:"string",value:L.reason}),typeof L.name=="string"||j(J,{path:H+".name",expected:"string",value:L.name})].every(T=>T),X=L=>typeof L=="object"&&L!==null&&x(L);let v,j;return L=>{if(X(L)===!1){v=[],j=bn(v),((J,T,F=!0)=>(typeof J=="object"&&J!==null||j(!0,{path:T+"",expected:"__IChatFunctionReference.IProps",value:J}))&&R(J,T+"",!0)||j(!0,{path:T+"",expected:"__IChatFunctionReference.IProps",value:J}))(L,"$input",!0);const H=v.length===0;return H?{success:H,data:L}:{success:H,errors:v,data:L}}return{success:!0,data:L}}})()(_);M.success===!1&&I.push({id:A.id,name:A.function.name,validation:M})}if(I.length>0)return Fn(e,t,n,I)}const u=[];for(const I of o.choices){if(I.message.tool_calls!=null)for(const f of I.message.tool_calls){if(f.type!=="function"||f.function.name!=="selectFunctions")continue;const A=(()=>{const M=R=>Array.isArray(R.functions)&&R.functions.every(K=>typeof K=="object"&&K!==null&&x(K)),x=R=>typeof R.reason=="string"&&typeof R.name=="string",V=R=>typeof R=="object"&&R!==null&&M(R);return R=>(R=JSON.parse(R),V(R)?R:null)})()(f.function.arguments);if(A===null)continue;const _=ei({id:f.id,selections:[]});for(const M of A.functions){const x=await Go(e,M);x!==null&&_.selections.push(Ot({operation:x,reason:M.reason}))}_.selections.length!==0&&u.push(_)}if(I.message.role==="assistant"&&I.message.content!=null){const f=Sn({role:"assistant",text:I.message.content});u.push(f),await e.dispatch(ni({role:"assistant",stream:Qe.to(f.text),join:async()=>Promise.resolve(f.text),done:()=>!0,get:()=>f.text}))}}return u}function Ap(e){return e.map(t=>[{role:"assistant",tool_calls:[{type:"function",id:t.id,function:{name:t.name,arguments:JSON.stringify(t.validation.data)}}]},{role:"tool",content:JSON.stringify(t.validation.errors),tool_call_id:t.id},{role:"system",content:["You A.I. assistant has composed wrong typed arguments.","","Correct it at the next function calling."].join(`
`)}]).flat()}function Ep(e){return async t=>{const n=[];if(t.ready()===!1){if((e==null?void 0:e.initialize)===null)await t.initialize();else if(n.push(...await((e==null?void 0:e.initialize)??yp)(t)),t.ready()===!1)return n}if(t.stack.length!==0&&n.push(...await((e==null?void 0:e.cancel)??fp)(t)),n.push(...await((e==null?void 0:e.select)??Sp)(t)),t.stack.length===0)return n;for(;;){const i=await((e==null?void 0:e.call)??lp)(t,t.stack.map(a=>a.operation));n.push(...i);const r=i.filter(a=>a.type==="execute");for(const a of r)await ii(t,{reason:"completed",name:a.operation.name});if(n.push(...await((e==null?void 0:e.describe)??gp)(t,r)),r.length===0||t.stack.length===0)break}return n}}function Tp(e){if(e.history.type==="text")return Fo({history:e.history});if(e.history.type==="select")return Ho({operations:e.operations,history:e.history});if(e.history.type==="cancel")return Jo({operations:e.operations,history:e.history});if(e.history.type==="execute")return or({operations:e.operations,history:e.history});if(e.history.type==="describe")return Uo({operations:e.operations,history:e.history});throw new Error("Invalid prompt type.")}function Fo(e){return Sn(e.history)}function Ho(e){return ei({id:e.history.id,selections:e.history.selections.map(t=>Ot({operation:sr({operations:e.operations,input:t.operation}),reason:t.reason}))})}function Jo(e){return ti({id:e.history.id,selections:e.history.selections.map(t=>Ot({operation:sr({operations:e.operations,input:t.operation}),reason:t.reason}))})}function or(e){return At({id:e.history.id,operation:sr({operations:e.operations,input:e.history.operation}),arguments:e.history.arguments,value:e.history.value})}function Uo(e){return xo({text:e.history.text,executes:e.history.executes.map(t=>or({operations:e.operations,history:t}))})}function sr(e){var n;const t=(n=e.operations.get(e.input.controller))==null?void 0:n.get(e.input.function);if(t===void 0)throw new Error(`No operation found: (controller: ${e.input.controller}, function: ${e.input.function})`);return t}const Cp={transform:Tp,transformText:Fo,transformSelect:Ho,transformCancel:Jo,transformExecute:or,transformDescribe:Uo};class jo{constructor(t){var n,i;this.props=t,this.operations_=Pc.compose({controllers:t.controllers,config:t.config}),this.stack_=[],this.listeners_=new Map,this.histories_=(t.histories??[]).map(r=>Cp.transform({operations:this.operations_.group,history:r})),this.token_usage_=an.zero(),this.ready_=!1,this.executor_=typeof((n=t.config)==null?void 0:n.executor)=="function"?t.config.executor:Ep(((i=t.config)==null?void 0:i.executor)??null)}clone(){var t;return new jo({...this.props,histories:(t=this.props.histories)==null?void 0:t.slice()})}async conversate(t){const n=Sn({role:"user",text:t});await this.dispatch(ni({role:"user",stream:Qe.to(t),done:()=>!0,get:()=>t,join:async()=>Promise.resolve(t)}));const i=await this.executor_(this.getContext({prompt:n,usage:this.token_usage_}));return this.histories_.push(n,...i),[n,...i]}getConfig(){return this.props.config}getVendor(){return this.props.vendor}getControllers(){return this.props.controllers}getOperations(){return this.operations_.array}getHistories(){return this.histories_}getTokenUsage(){return this.token_usage_}getContext(t){const n=async i=>this.dispatch(i);return{operations:this.operations_,config:this.props.config,histories:this.histories_,stack:this.stack_,ready:()=>this.ready_,prompt:t.prompt,dispatch:async i=>this.dispatch(i),request:async(i,r)=>{const a=jc({source:i,body:{...r,model:this.props.vendor.model,stream:!0,stream_options:{include_usage:!0}},options:this.props.vendor.options});await n(a);const o=await this.props.vendor.api.chat.completions.create(a.body,a.options),[u,l]=Qe.transform(o.toReadableStream(),f=>rt.transformCompletionChunk(f)).tee(),[c,p]=l.tee();(async()=>{const f=c.getReader();for(;;){const A=await f.read();if(A.done)break;A.value.usage!=null&&Dc.aggregate({kind:i,completionUsage:A.value.usage,usage:t.usage})}})();const[d,I]=u.tee();return await n({type:"response",source:i,stream:d,body:a.body,options:a.options,join:async()=>{const f=await Qe.readAll(I);return rt.merge(f)}}),p},initialize:async()=>{this.ready_=!0,await n(Fc())}}}on(t,n){return _o(this.listeners_,t,()=>new Set).add(n),this}off(t,n){const i=this.listeners_.get(t);return i!==void 0&&(i.delete(n),i.size===0&&this.listeners_.delete(t)),this}async dispatch(t){const n=this.listeners_.get(t.type);n!==void 0&&await Promise.all(Array.from(n).map(async i=>{try{await i(t)}catch{}}))}}const ea=It(E.jsx("path",{d:"M3 4V1h2v3h3v2H5v3H3V6H0V4zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5m-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2"}),"AddAPhoto"),kp=It([E.jsx("path",{d:"M19.5 3.5 18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2zM19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11z"},"0"),E.jsx("path",{d:"M9 7h6v2H9zm7 0h2v2h-2zm-7 3h6v2H9zm7 0h2v2h-2z"},"1")],"ReceiptLong"),Op=It(E.jsx("path",{d:"M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"}),"Send"),$o=It(E.jsx("path",{d:"M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"}),"ExpandMore");function ta(e){const t=[],n=String(e||"");let i=n.indexOf(","),r=0,a=!1;for(;!a;){i===-1&&(i=n.length,a=!0);const o=n.slice(r,i).trim();(o||!a)&&t.push(o),r=i+1,i=n.indexOf(",",r)}return t}function ur(e,t){const n=t||{};return(e[e.length-1]===""?[...e,""]:e).join((n.padRight?" ":"")+","+(n.padLeft===!1?"":" ")).trim()}const _p=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,xp=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,Np={};function na(e,t){return(Np.jsx?xp:_p).test(e)}const vp=/[ \t\n\f\r]/g;function ri(e){return typeof e=="object"?e.type==="text"?ia(e.value):!1:ia(e)}function ia(e){return e.replace(vp,"")===""}let An=class{constructor(t,n,i){this.normal=n,this.property=t,i&&(this.space=i)}};An.prototype.normal={};An.prototype.property={};An.prototype.space=void 0;function qo(e,t){const n={},i={};for(const r of e)Object.assign(n,r.property),Object.assign(i,r.normal);return new An(n,i,t)}function In(e){return e.toLowerCase()}let Ge=class{constructor(t,n){this.attribute=n,this.property=t}};Ge.prototype.attribute="";Ge.prototype.booleanish=!1;Ge.prototype.boolean=!1;Ge.prototype.commaOrSpaceSeparated=!1;Ge.prototype.commaSeparated=!1;Ge.prototype.defined=!1;Ge.prototype.mustUseProperty=!1;Ge.prototype.number=!1;Ge.prototype.overloadedBoolean=!1;Ge.prototype.property="";Ge.prototype.spaceSeparated=!1;Ge.prototype.space=void 0;let Rp=0;const ie=xt(),ye=xt(),Vo=xt(),B=xt(),ce=xt(),Mt=xt(),Je=xt();function xt(){return 2**++Rp}const Mi=Object.freeze(Object.defineProperty({__proto__:null,boolean:ie,booleanish:ye,commaOrSpaceSeparated:Je,commaSeparated:Mt,number:B,overloadedBoolean:Vo,spaceSeparated:ce},Symbol.toStringTag,{value:"Module"})),yi=Object.keys(Mi);let lr=class extends Ge{constructor(t,n,i,r){let a=-1;if(super(t,n),ra(this,"space",r),typeof i=="number")for(;++a<yi.length;){const o=yi[a];ra(this,yi[a],(i&Mi[o])===Mi[o])}}};lr.prototype.defined=!0;function ra(e,t,n){n&&(e[t]=n)}function $t(e){const t={},n={};for(const[i,r]of Object.entries(e.properties)){const a=new lr(i,e.transform(e.attributes||{},i),r,e.space);e.mustUseProperty&&e.mustUseProperty.includes(i)&&(a.mustUseProperty=!0),t[i]=a,n[In(i)]=i,n[In(a.attribute)]=i}return new An(t,n,e.space)}const zo=$t({properties:{ariaActiveDescendant:null,ariaAtomic:ye,ariaAutoComplete:null,ariaBusy:ye,ariaChecked:ye,ariaColCount:B,ariaColIndex:B,ariaColSpan:B,ariaControls:ce,ariaCurrent:null,ariaDescribedBy:ce,ariaDetails:null,ariaDisabled:ye,ariaDropEffect:ce,ariaErrorMessage:null,ariaExpanded:ye,ariaFlowTo:ce,ariaGrabbed:ye,ariaHasPopup:null,ariaHidden:ye,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:ce,ariaLevel:B,ariaLive:null,ariaModal:ye,ariaMultiLine:ye,ariaMultiSelectable:ye,ariaOrientation:null,ariaOwns:ce,ariaPlaceholder:null,ariaPosInSet:B,ariaPressed:ye,ariaReadOnly:ye,ariaRelevant:null,ariaRequired:ye,ariaRoleDescription:ce,ariaRowCount:B,ariaRowIndex:B,ariaRowSpan:B,ariaSelected:ye,ariaSetSize:B,ariaSort:null,ariaValueMax:B,ariaValueMin:B,ariaValueNow:B,ariaValueText:null,role:null},transform(e,t){return t==="role"?t:"aria-"+t.slice(4).toLowerCase()}});function Wo(e,t){return t in e?e[t]:t}function Yo(e,t){return Wo(e,t.toLowerCase())}const Pp=$t({attributes:{acceptcharset:"accept-charset",classname:"class",htmlfor:"for",httpequiv:"http-equiv"},mustUseProperty:["checked","multiple","muted","selected"],properties:{abbr:null,accept:Mt,acceptCharset:ce,accessKey:ce,action:null,allow:null,allowFullScreen:ie,allowPaymentRequest:ie,allowUserMedia:ie,alt:null,as:null,async:ie,autoCapitalize:null,autoComplete:ce,autoFocus:ie,autoPlay:ie,blocking:ce,capture:null,charSet:null,checked:ie,cite:null,className:ce,cols:B,colSpan:null,content:null,contentEditable:ye,controls:ie,controlsList:ce,coords:B|Mt,crossOrigin:null,data:null,dateTime:null,decoding:null,default:ie,defer:ie,dir:null,dirName:null,disabled:ie,download:Vo,draggable:ye,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:ie,formTarget:null,headers:ce,height:B,hidden:ie,high:B,href:null,hrefLang:null,htmlFor:ce,httpEquiv:ce,id:null,imageSizes:null,imageSrcSet:null,inert:ie,inputMode:null,integrity:null,is:null,isMap:ie,itemId:null,itemProp:ce,itemRef:ce,itemScope:ie,itemType:ce,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:ie,low:B,manifest:null,max:null,maxLength:B,media:null,method:null,min:null,minLength:B,multiple:ie,muted:ie,name:null,nonce:null,noModule:ie,noValidate:ie,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:ie,optimum:B,pattern:null,ping:ce,placeholder:null,playsInline:ie,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:ie,referrerPolicy:null,rel:ce,required:ie,reversed:ie,rows:B,rowSpan:B,sandbox:ce,scope:null,scoped:ie,seamless:ie,selected:ie,shadowRootClonable:ie,shadowRootDelegatesFocus:ie,shadowRootMode:null,shape:null,size:B,sizes:null,slot:null,span:B,spellCheck:ye,src:null,srcDoc:null,srcLang:null,srcSet:null,start:B,step:null,style:null,tabIndex:B,target:null,title:null,translate:null,type:null,typeMustMatch:ie,useMap:null,value:ye,width:B,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:ce,axis:null,background:null,bgColor:null,border:B,borderColor:null,bottomMargin:B,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:ie,declare:ie,event:null,face:null,frame:null,frameBorder:null,hSpace:B,leftMargin:B,link:null,longDesc:null,lowSrc:null,marginHeight:B,marginWidth:B,noResize:ie,noHref:ie,noShade:ie,noWrap:ie,object:null,profile:null,prompt:null,rev:null,rightMargin:B,rules:null,scheme:null,scrolling:ye,standby:null,summary:null,text:null,topMargin:B,valueType:null,version:null,vAlign:null,vLink:null,vSpace:B,allowTransparency:null,autoCorrect:null,autoSave:null,disablePictureInPicture:ie,disableRemotePlayback:ie,prefix:null,property:null,results:B,security:null,unselectable:null},space:"html",transform:Yo}),wp=$t({attributes:{accentHeight:"accent-height",alignmentBaseline:"alignment-baseline",arabicForm:"arabic-form",baselineShift:"baseline-shift",capHeight:"cap-height",className:"class",clipPath:"clip-path",clipRule:"clip-rule",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",crossOrigin:"crossorigin",dataType:"datatype",dominantBaseline:"dominant-baseline",enableBackground:"enable-background",fillOpacity:"fill-opacity",fillRule:"fill-rule",floodColor:"flood-color",floodOpacity:"flood-opacity",fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",hrefLang:"hreflang",horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",horizOriginY:"horiz-origin-y",imageRendering:"image-rendering",letterSpacing:"letter-spacing",lightingColor:"lighting-color",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",navDown:"nav-down",navDownLeft:"nav-down-left",navDownRight:"nav-down-right",navLeft:"nav-left",navNext:"nav-next",navPrev:"nav-prev",navRight:"nav-right",navUp:"nav-up",navUpLeft:"nav-up-left",navUpRight:"nav-up-right",onAbort:"onabort",onActivate:"onactivate",onAfterPrint:"onafterprint",onBeforePrint:"onbeforeprint",onBegin:"onbegin",onCancel:"oncancel",onCanPlay:"oncanplay",onCanPlayThrough:"oncanplaythrough",onChange:"onchange",onClick:"onclick",onClose:"onclose",onCopy:"oncopy",onCueChange:"oncuechange",onCut:"oncut",onDblClick:"ondblclick",onDrag:"ondrag",onDragEnd:"ondragend",onDragEnter:"ondragenter",onDragExit:"ondragexit",onDragLeave:"ondragleave",onDragOver:"ondragover",onDragStart:"ondragstart",onDrop:"ondrop",onDurationChange:"ondurationchange",onEmptied:"onemptied",onEnd:"onend",onEnded:"onended",onError:"onerror",onFocus:"onfocus",onFocusIn:"onfocusin",onFocusOut:"onfocusout",onHashChange:"onhashchange",onInput:"oninput",onInvalid:"oninvalid",onKeyDown:"onkeydown",onKeyPress:"onkeypress",onKeyUp:"onkeyup",onLoad:"onload",onLoadedData:"onloadeddata",onLoadedMetadata:"onloadedmetadata",onLoadStart:"onloadstart",onMessage:"onmessage",onMouseDown:"onmousedown",onMouseEnter:"onmouseenter",onMouseLeave:"onmouseleave",onMouseMove:"onmousemove",onMouseOut:"onmouseout",onMouseOver:"onmouseover",onMouseUp:"onmouseup",onMouseWheel:"onmousewheel",onOffline:"onoffline",onOnline:"ononline",onPageHide:"onpagehide",onPageShow:"onpageshow",onPaste:"onpaste",onPause:"onpause",onPlay:"onplay",onPlaying:"onplaying",onPopState:"onpopstate",onProgress:"onprogress",onRateChange:"onratechange",onRepeat:"onrepeat",onReset:"onreset",onResize:"onresize",onScroll:"onscroll",onSeeked:"onseeked",onSeeking:"onseeking",onSelect:"onselect",onShow:"onshow",onStalled:"onstalled",onStorage:"onstorage",onSubmit:"onsubmit",onSuspend:"onsuspend",onTimeUpdate:"ontimeupdate",onToggle:"ontoggle",onUnload:"onunload",onVolumeChange:"onvolumechange",onWaiting:"onwaiting",onZoom:"onzoom",overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pointerEvents:"pointer-events",referrerPolicy:"referrerpolicy",renderingIntent:"rendering-intent",shapeRendering:"shape-rendering",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",strokeDashArray:"stroke-dasharray",strokeDashOffset:"stroke-dashoffset",strokeLineCap:"stroke-linecap",strokeLineJoin:"stroke-linejoin",strokeMiterLimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",tabIndex:"tabindex",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",transformOrigin:"transform-origin",typeOf:"typeof",underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",vectorEffect:"vector-effect",vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",wordSpacing:"word-spacing",writingMode:"writing-mode",xHeight:"x-height",playbackOrder:"playbackorder",timelineBegin:"timelinebegin"},properties:{about:Je,accentHeight:B,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:B,amplitude:B,arabicForm:null,ascent:B,attributeName:null,attributeType:null,azimuth:B,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:B,by:null,calcMode:null,capHeight:B,className:ce,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:B,diffuseConstant:B,direction:null,display:null,dur:null,divisor:B,dominantBaseline:null,download:ie,dx:null,dy:null,edgeMode:null,editable:null,elevation:B,enableBackground:null,end:null,event:null,exponent:B,externalResourcesRequired:null,fill:null,fillOpacity:B,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:Mt,g2:Mt,glyphName:Mt,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:B,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:B,horizOriginX:B,horizOriginY:B,id:null,ideographic:B,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:B,k:B,k1:B,k2:B,k3:B,k4:B,kernelMatrix:Je,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:B,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:B,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:B,overlineThickness:B,paintOrder:null,panose1:null,path:null,pathLength:B,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:ce,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:B,pointsAtY:B,pointsAtZ:B,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:Je,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:Je,rev:Je,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:Je,requiredFeatures:Je,requiredFonts:Je,requiredFormats:Je,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:B,specularExponent:B,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:B,strikethroughThickness:B,string:null,stroke:null,strokeDashArray:Je,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:B,strokeOpacity:B,strokeWidth:null,style:null,surfaceScale:B,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:Je,tabIndex:B,tableValues:null,target:null,targetX:B,targetY:B,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:Je,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:B,underlineThickness:B,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:B,values:null,vAlphabetic:B,vMathematical:B,vectorEffect:null,vHanging:B,vIdeographic:B,version:null,vertAdvY:B,vertOriginX:B,vertOriginY:B,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:B,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:"svg",transform:Wo}),Ko=$t({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:"xlink",transform(e,t){return"xlink:"+t.slice(5).toLowerCase()}}),Qo=$t({attributes:{xmlnsxlink:"xmlns:xlink"},properties:{xmlnsXLink:null,xmlns:null},space:"xmlns",transform:Yo}),Xo=$t({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:"xml",transform(e,t){return"xml:"+t.slice(3).toLowerCase()}}),Dp={classId:"classID",dataType:"datatype",itemId:"itemID",strokeDashArray:"strokeDasharray",strokeDashOffset:"strokeDashoffset",strokeLineCap:"strokeLinecap",strokeLineJoin:"strokeLinejoin",strokeMiterLimit:"strokeMiterlimit",typeOf:"typeof",xLinkActuate:"xlinkActuate",xLinkArcRole:"xlinkArcrole",xLinkHref:"xlinkHref",xLinkRole:"xlinkRole",xLinkShow:"xlinkShow",xLinkTitle:"xlinkTitle",xLinkType:"xlinkType",xmlnsXLink:"xmlnsXlink"},Lp=/[A-Z]/g,aa=/-[a-z]/g,Mp=/^data[-\w.:]+$/i;function ai(e,t){const n=In(t);let i=t,r=Ge;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&n.slice(0,4)==="data"&&Mp.test(t)){if(t.charAt(4)==="-"){const a=t.slice(5).replace(aa,Gp);i="data"+a.charAt(0).toUpperCase()+a.slice(1)}else{const a=t.slice(4);if(!aa.test(a)){let o=a.replace(Lp,Bp);o.charAt(0)!=="-"&&(o="-"+o),t="data"+o}}r=lr}return new r(i,t)}function Bp(e){return"-"+e.toLowerCase()}function Gp(e){return e.charAt(1).toUpperCase()}const En=qo([zo,Pp,Ko,Qo,Xo],"html"),gt=qo([zo,wp,Ko,Qo,Xo],"svg");function oa(e){const t=String(e||"").trim();return t?t.split(/[ \t\n\r\f]+/g):[]}function cr(e){return e.join(" ").trim()}var pr={},sa=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,Fp=/\n/g,Hp=/^\s*/,Jp=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,Up=/^:\s*/,jp=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,$p=/^[;\s]*/,qp=/^\s+|\s+$/g,Vp=`
`,ua="/",la="*",Et="",zp="comment",Wp="declaration",Yp=function(e,t){if(typeof e!="string")throw new TypeError("First argument must be a string");if(!e)return[];t=t||{};var n=1,i=1;function r(A){var _=A.match(Fp);_&&(n+=_.length);var M=A.lastIndexOf(Vp);i=~M?A.length-M:i+A.length}function a(){var A={line:n,column:i};return function(_){return _.position=new o(A),c(),_}}function o(A){this.start=A,this.end={line:n,column:i},this.source=t.source}o.prototype.content=e;function u(A){var _=new Error(t.source+":"+n+":"+i+": "+A);if(_.reason=A,_.filename=t.source,_.line=n,_.column=i,_.source=e,!t.silent)throw _}function l(A){var _=A.exec(e);if(_){var M=_[0];return r(M),e=e.slice(M.length),_}}function c(){l(Hp)}function p(A){var _;for(A=A||[];_=d();)_!==!1&&A.push(_);return A}function d(){var A=a();if(!(ua!=e.charAt(0)||la!=e.charAt(1))){for(var _=2;Et!=e.charAt(_)&&(la!=e.charAt(_)||ua!=e.charAt(_+1));)++_;if(_+=2,Et===e.charAt(_-1))return u("End of comment missing");var M=e.slice(2,_-2);return i+=2,r(M),e=e.slice(_),i+=2,A({type:zp,comment:M})}}function I(){var A=a(),_=l(Jp);if(_){if(d(),!l(Up))return u("property missing ':'");var M=l(jp),x=A({type:Wp,property:ca(_[0].replace(sa,Et)),value:M?ca(M[0].replace(sa,Et)):Et});return l($p),x}}function f(){var A=[];p(A);for(var _;_=I();)_!==!1&&(A.push(_),p(A));return A}return c(),f()};function ca(e){return e?e.replace(qp,Et):Et}var Kp=Vn&&Vn.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(pr,"__esModule",{value:!0});pr.default=Xp;var Qp=Kp(Yp);function Xp(e,t){var n=null;if(!e||typeof e!="string")return n;var i=(0,Qp.default)(e),r=typeof t=="function";return i.forEach(function(a){if(a.type==="declaration"){var o=a.property,u=a.value;r?t(o,u,a):u&&(n=n||{},n[o]=u)}}),n}var oi={};Object.defineProperty(oi,"__esModule",{value:!0});oi.camelCase=void 0;var Zp=/^--[a-zA-Z0-9_-]+$/,eh=/-([a-z])/g,th=/^[^-]+$/,nh=/^-(webkit|moz|ms|o|khtml)-/,ih=/^-(ms)-/,rh=function(e){return!e||th.test(e)||Zp.test(e)},ah=function(e,t){return t.toUpperCase()},pa=function(e,t){return"".concat(t,"-")},oh=function(e,t){return t===void 0&&(t={}),rh(e)?e:(e=e.toLowerCase(),t.reactCompat?e=e.replace(ih,pa):e=e.replace(nh,pa),e.replace(eh,ah))};oi.camelCase=oh;var sh=Vn&&Vn.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},uh=sh(pr),lh=oi;function Bi(e,t){var n={};return!e||typeof e!="string"||(0,uh.default)(e,function(i,r){i&&r&&(n[(0,lh.camelCase)(i,t)]=r)}),n}Bi.default=Bi;var ch=Bi;const ph=Ao(ch),si=Zo("end"),ot=Zo("start");function Zo(e){return t;function t(n){const i=n&&n.position&&n.position[e]||{};if(typeof i.line=="number"&&i.line>0&&typeof i.column=="number"&&i.column>0)return{line:i.line,column:i.column,offset:typeof i.offset=="number"&&i.offset>-1?i.offset:void 0}}}function hh(e){const t=ot(e),n=si(e);if(t&&n)return{start:t,end:n}}function on(e){return!e||typeof e!="object"?"":"position"in e||"type"in e?ha(e.position):"start"in e||"end"in e?ha(e):"line"in e||"column"in e?Gi(e):""}function Gi(e){return da(e&&e.line)+":"+da(e&&e.column)}function ha(e){return Gi(e&&e.start)+"-"+Gi(e&&e.end)}function da(e){return e&&typeof e=="number"?e:1}class Re extends Error{constructor(t,n,i){super(),typeof n=="string"&&(i=n,n=void 0);let r="",a={},o=!1;if(n&&("line"in n&&"column"in n?a={place:n}:"start"in n&&"end"in n?a={place:n}:"type"in n?a={ancestors:[n],place:n.position}:a={...n}),typeof t=="string"?r=t:!a.cause&&t&&(o=!0,r=t.message,a.cause=t),!a.ruleId&&!a.source&&typeof i=="string"){const l=i.indexOf(":");l===-1?a.ruleId=i:(a.source=i.slice(0,l),a.ruleId=i.slice(l+1))}if(!a.place&&a.ancestors&&a.ancestors){const l=a.ancestors[a.ancestors.length-1];l&&(a.place=l.position)}const u=a.place&&"start"in a.place?a.place.start:a.place;this.ancestors=a.ancestors||void 0,this.cause=a.cause||void 0,this.column=u?u.column:void 0,this.fatal=void 0,this.file,this.message=r,this.line=u?u.line:void 0,this.name=on(a.place)||"1:1",this.place=a.place||void 0,this.reason=this.message,this.ruleId=a.ruleId||void 0,this.source=a.source||void 0,this.stack=o&&a.cause&&typeof a.cause.stack=="string"?a.cause.stack:"",this.actual,this.expected,this.note,this.url}}Re.prototype.file="";Re.prototype.name="";Re.prototype.reason="";Re.prototype.message="";Re.prototype.stack="";Re.prototype.column=void 0;Re.prototype.line=void 0;Re.prototype.ancestors=void 0;Re.prototype.cause=void 0;Re.prototype.fatal=void 0;Re.prototype.place=void 0;Re.prototype.ruleId=void 0;Re.prototype.source=void 0;const hr={}.hasOwnProperty,dh=new Map,fh=/[A-Z]/g,mh=new Set(["table","tbody","thead","tfoot","tr"]),Ih=new Set(["td","th"]),es="https://github.com/syntax-tree/hast-util-to-jsx-runtime";function gh(e,t){if(!t||t.Fragment===void 0)throw new TypeError("Expected `Fragment` in options");const n=t.filePath||void 0;let i;if(t.development){if(typeof t.jsxDEV!="function")throw new TypeError("Expected `jsxDEV` in options when `development: true`");i=kh(n,t.jsxDEV)}else{if(typeof t.jsx!="function")throw new TypeError("Expected `jsx` in production options");if(typeof t.jsxs!="function")throw new TypeError("Expected `jsxs` in production options");i=Ch(n,t.jsx,t.jsxs)}const r={Fragment:t.Fragment,ancestors:[],components:t.components||{},create:i,elementAttributeNameCase:t.elementAttributeNameCase||"react",evaluater:t.createEvaluater?t.createEvaluater():void 0,filePath:n,ignoreInvalidStyle:t.ignoreInvalidStyle||!1,passKeys:t.passKeys!==!1,passNode:t.passNode||!1,schema:t.space==="svg"?gt:En,stylePropertyNameCase:t.stylePropertyNameCase||"dom",tableCellAlignToStyle:t.tableCellAlignToStyle!==!1},a=ts(r,e,void 0);return a&&typeof a!="string"?a:r.create(e,r.Fragment,{children:a||void 0},void 0)}function ts(e,t,n){if(t.type==="element")return yh(e,t,n);if(t.type==="mdxFlowExpression"||t.type==="mdxTextExpression")return bh(e,t);if(t.type==="mdxJsxFlowElement"||t.type==="mdxJsxTextElement")return Ah(e,t,n);if(t.type==="mdxjsEsm")return Sh(e,t);if(t.type==="root")return Eh(e,t,n);if(t.type==="text")return Th(e,t)}function yh(e,t,n){const i=e.schema;let r=i;t.tagName.toLowerCase()==="svg"&&i.space==="html"&&(r=gt,e.schema=r),e.ancestors.push(t);const a=is(e,t.tagName,!1),o=Oh(e,t);let u=fr(e,t);return mh.has(t.tagName)&&(u=u.filter(function(l){return typeof l=="string"?!ri(l):!0})),ns(e,o,a,t),dr(o,u),e.ancestors.pop(),e.schema=i,e.create(t,a,o,n)}function bh(e,t){if(t.data&&t.data.estree&&e.evaluater){const i=t.data.estree.body[0];return i.type,e.evaluater.evaluateExpression(i.expression)}gn(e,t.position)}function Sh(e,t){if(t.data&&t.data.estree&&e.evaluater)return e.evaluater.evaluateProgram(t.data.estree);gn(e,t.position)}function Ah(e,t,n){const i=e.schema;let r=i;t.name==="svg"&&i.space==="html"&&(r=gt,e.schema=r),e.ancestors.push(t);const a=t.name===null?e.Fragment:is(e,t.name,!0),o=_h(e,t),u=fr(e,t);return ns(e,o,a,t),dr(o,u),e.ancestors.pop(),e.schema=i,e.create(t,a,o,n)}function Eh(e,t,n){const i={};return dr(i,fr(e,t)),e.create(t,e.Fragment,i,n)}function Th(e,t){return t.value}function ns(e,t,n,i){typeof n!="string"&&n!==e.Fragment&&e.passNode&&(t.node=i)}function dr(e,t){if(t.length>0){const n=t.length>1?t:t[0];n&&(e.children=n)}}function Ch(e,t,n){return i;function i(r,a,o,u){const c=Array.isArray(o.children)?n:t;return u?c(a,o,u):c(a,o)}}function kh(e,t){return n;function n(i,r,a,o){const u=Array.isArray(a.children),l=ot(i);return t(r,a,o,u,{columnNumber:l?l.column-1:void 0,fileName:e,lineNumber:l?l.line:void 0},void 0)}}function Oh(e,t){const n={};let i,r;for(r in t.properties)if(r!=="children"&&hr.call(t.properties,r)){const a=xh(e,r,t.properties[r]);if(a){const[o,u]=a;e.tableCellAlignToStyle&&o==="align"&&typeof u=="string"&&Ih.has(t.tagName)?i=u:n[o]=u}}if(i){const a=n.style||(n.style={});a[e.stylePropertyNameCase==="css"?"text-align":"textAlign"]=i}return n}function _h(e,t){const n={};for(const i of t.attributes)if(i.type==="mdxJsxExpressionAttribute")if(i.data&&i.data.estree&&e.evaluater){const a=i.data.estree.body[0];a.type;const o=a.expression;o.type;const u=o.properties[0];u.type,Object.assign(n,e.evaluater.evaluateExpression(u.argument))}else gn(e,t.position);else{const r=i.name;let a;if(i.value&&typeof i.value=="object")if(i.value.data&&i.value.data.estree&&e.evaluater){const u=i.value.data.estree.body[0];u.type,a=e.evaluater.evaluateExpression(u.expression)}else gn(e,t.position);else a=i.value===null?!0:i.value;n[r]=a}return n}function fr(e,t){const n=[];let i=-1;const r=e.passKeys?new Map:dh;for(;++i<t.children.length;){const a=t.children[i];let o;if(e.passKeys){const l=a.type==="element"?a.tagName:a.type==="mdxJsxFlowElement"||a.type==="mdxJsxTextElement"?a.name:void 0;if(l){const c=r.get(l)||0;o=l+"-"+c,r.set(l,c+1)}}const u=ts(e,a,o);u!==void 0&&n.push(u)}return n}function xh(e,t,n){const i=ai(e.schema,t);if(!(n==null||typeof n=="number"&&Number.isNaN(n))){if(Array.isArray(n)&&(n=i.commaSeparated?ur(n):cr(n)),i.property==="style"){let r=typeof n=="object"?n:Nh(e,String(n));return e.stylePropertyNameCase==="css"&&(r=vh(r)),["style",r]}return[e.elementAttributeNameCase==="react"&&i.space?Dp[i.property]||i.property:i.attribute,n]}}function Nh(e,t){try{return ph(t,{reactCompat:!0})}catch(n){if(e.ignoreInvalidStyle)return{};const i=n,r=new Re("Cannot parse `style` attribute",{ancestors:e.ancestors,cause:i,ruleId:"style",source:"hast-util-to-jsx-runtime"});throw r.file=e.filePath||void 0,r.url=es+"#cannot-parse-style-attribute",r}}function is(e,t,n){let i;if(!n)i={type:"Literal",value:t};else if(t.includes(".")){const r=t.split(".");let a=-1,o;for(;++a<r.length;){const u=na(r[a])?{type:"Identifier",name:r[a]}:{type:"Literal",value:r[a]};o=o?{type:"MemberExpression",object:o,property:u,computed:!!(a&&u.type==="Literal"),optional:!1}:u}i=o}else i=na(t)&&!/^[a-z]/.test(t)?{type:"Identifier",name:t}:{type:"Literal",value:t};if(i.type==="Literal"){const r=i.value;return hr.call(e.components,r)?e.components[r]:r}if(e.evaluater)return e.evaluater.evaluateExpression(i);gn(e)}function gn(e,t){const n=new Re("Cannot handle MDX estrees without `createEvaluater`",{ancestors:e.ancestors,place:t,ruleId:"mdx-estree",source:"hast-util-to-jsx-runtime"});throw n.file=e.filePath||void 0,n.url=es+"#cannot-handle-mdx-estrees-without-createevaluater",n}function vh(e){const t={};let n;for(n in e)hr.call(e,n)&&(t[Rh(n)]=e[n]);return t}function Rh(e){let t=e.replace(fh,Ph);return t.slice(0,3)==="ms-"&&(t="-"+t),t}function Ph(e){return"-"+e.toLowerCase()}const bi={action:["form"],cite:["blockquote","del","ins","q"],data:["object"],formAction:["button","input"],href:["a","area","base","link"],icon:["menuitem"],itemId:null,manifest:["html"],ping:["a","area"],poster:["video"],src:["audio","embed","iframe","img","input","script","source","track","video"]},wh={};function Dh(e,t){const n=wh,i=typeof n.includeImageAlt=="boolean"?n.includeImageAlt:!0,r=typeof n.includeHtml=="boolean"?n.includeHtml:!0;return rs(e,i,r)}function rs(e,t,n){if(Lh(e)){if("value"in e)return e.type==="html"&&!n?"":e.value;if(t&&"alt"in e&&e.alt)return e.alt;if("children"in e)return fa(e.children,t,n)}return Array.isArray(e)?fa(e,t,n):""}function fa(e,t,n){const i=[];let r=-1;for(;++r<e.length;)i[r]=rs(e[r],t,n);return i.join("")}function Lh(e){return!!(e&&typeof e=="object")}const ma=document.createElement("i");function mr(e){const t="&"+e+";";ma.innerHTML=t;const n=ma.textContent;return n.charCodeAt(n.length-1)===59&&e!=="semi"||n===t?!1:n}function at(e,t,n,i){const r=e.length;let a=0,o;if(t<0?t=-t>r?0:r+t:t=t>r?r:t,n=n>0?n:0,i.length<1e4)o=Array.from(i),o.unshift(t,n),e.splice(...o);else for(n&&e.splice(t,n);a<i.length;)o=i.slice(a,a+1e4),o.unshift(t,0),e.splice(...o),a+=1e4,t+=1e4}function Ve(e,t){return e.length>0?(at(e,e.length,0,t),e):t}const Ia={}.hasOwnProperty;function Mh(e){const t={};let n=-1;for(;++n<e.length;)Bh(t,e[n]);return t}function Bh(e,t){let n;for(n in t){const r=(Ia.call(e,n)?e[n]:void 0)||(e[n]={}),a=t[n];let o;if(a)for(o in a){Ia.call(r,o)||(r[o]=[]);const u=a[o];Gh(r[o],Array.isArray(u)?u:u?[u]:[])}}}function Gh(e,t){let n=-1;const i=[];for(;++n<t.length;)(t[n].add==="after"?e:i).push(t[n]);at(e,0,0,i)}function as(e,t){const n=Number.parseInt(e,t);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)===65535||(n&65535)===65534||n>1114111?"�":String.fromCodePoint(n)}function Bt(e){return e.replace(/[\t\n\r ]+/g," ").replace(/^ | $/g,"").toLowerCase().toUpperCase()}const tt=yt(/[A-Za-z]/),je=yt(/[\dA-Za-z]/),Fh=yt(/[#-'*+\--9=?A-Z^-~]/);function Fi(e){return e!==null&&(e<32||e===127)}const Hi=yt(/\d/),Hh=yt(/[\dA-Fa-f]/),Jh=yt(/[!-/:-@[-`{-~]/);function ee(e){return e!==null&&e<-2}function Be(e){return e!==null&&(e<0||e===32)}function ue(e){return e===-2||e===-1||e===32}const Uh=yt(new RegExp("\\p{P}|\\p{S}","u")),jh=yt(/\s/);function yt(e){return t;function t(n){return n!==null&&n>-1&&e.test(String.fromCharCode(n))}}function qt(e){const t=[];let n=-1,i=0,r=0;for(;++n<e.length;){const a=e.charCodeAt(n);let o="";if(a===37&&je(e.charCodeAt(n+1))&&je(e.charCodeAt(n+2)))r=2;else if(a<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a))||(o=String.fromCharCode(a));else if(a>55295&&a<57344){const u=e.charCodeAt(n+1);a<56320&&u>56319&&u<57344?(o=String.fromCharCode(a,u),r=1):o="�"}else o=String.fromCharCode(a);o&&(t.push(e.slice(i,n),encodeURIComponent(o)),i=n+r+1,o=""),r&&(n+=r,r=0)}return t.join("")+e.slice(i)}function he(e,t,n,i){const r=i?i-1:Number.POSITIVE_INFINITY;let a=0;return o;function o(l){return ue(l)?(e.enter(n),u(l)):t(l)}function u(l){return ue(l)&&a++<r?(e.consume(l),u):(e.exit(n),t(l))}}const $h={tokenize:qh};function qh(e){const t=e.attempt(this.parser.constructs.contentInitial,i,r);let n;return t;function i(u){if(u===null){e.consume(u);return}return e.enter("lineEnding"),e.consume(u),e.exit("lineEnding"),he(e,t,"linePrefix")}function r(u){return e.enter("paragraph"),a(u)}function a(u){const l=e.enter("chunkText",{contentType:"text",previous:n});return n&&(n.next=l),n=l,o(u)}function o(u){if(u===null){e.exit("chunkText"),e.exit("paragraph"),e.consume(u);return}return ee(u)?(e.consume(u),e.exit("chunkText"),a):(e.consume(u),o)}}const Vh={tokenize:zh},ga={tokenize:Wh};function zh(e){const t=this,n=[];let i=0,r,a,o;return u;function u(R){if(i<n.length){const K=n[i];return t.containerState=K[1],e.attempt(K[0].continuation,l,c)(R)}return c(R)}function l(R){if(i++,t.containerState._closeFlow){t.containerState._closeFlow=void 0,r&&V();const K=t.events.length;let X=K,v;for(;X--;)if(t.events[X][0]==="exit"&&t.events[X][1].type==="chunkFlow"){v=t.events[X][1].end;break}x(i);let j=K;for(;j<t.events.length;)t.events[j][1].end={...v},j++;return at(t.events,X+1,0,t.events.slice(K)),t.events.length=j,c(R)}return u(R)}function c(R){if(i===n.length){if(!r)return I(R);if(r.currentConstruct&&r.currentConstruct.concrete)return A(R);t.interrupt=!!(r.currentConstruct&&!r._gfmTableDynamicInterruptHack)}return t.containerState={},e.check(ga,p,d)(R)}function p(R){return r&&V(),x(i),I(R)}function d(R){return t.parser.lazy[t.now().line]=i!==n.length,o=t.now().offset,A(R)}function I(R){return t.containerState={},e.attempt(ga,f,A)(R)}function f(R){return i++,n.push([t.currentConstruct,t.containerState]),I(R)}function A(R){if(R===null){r&&V(),x(0),e.consume(R);return}return r=r||t.parser.flow(t.now()),e.enter("chunkFlow",{_tokenizer:r,contentType:"flow",previous:a}),_(R)}function _(R){if(R===null){M(e.exit("chunkFlow"),!0),x(0),e.consume(R);return}return ee(R)?(e.consume(R),M(e.exit("chunkFlow")),i=0,t.interrupt=void 0,u):(e.consume(R),_)}function M(R,K){const X=t.sliceStream(R);if(K&&X.push(null),R.previous=a,a&&(a.next=R),a=R,r.defineSkip(R.start),r.write(X),t.parser.lazy[R.start.line]){let v=r.events.length;for(;v--;)if(r.events[v][1].start.offset<o&&(!r.events[v][1].end||r.events[v][1].end.offset>o))return;const j=t.events.length;let L=j,H,J;for(;L--;)if(t.events[L][0]==="exit"&&t.events[L][1].type==="chunkFlow"){if(H){J=t.events[L][1].end;break}H=!0}for(x(i),v=j;v<t.events.length;)t.events[v][1].end={...J},v++;at(t.events,L+1,0,t.events.slice(j)),t.events.length=v}}function x(R){let K=n.length;for(;K-- >R;){const X=n[K];t.containerState=X[1],X[0].exit.call(t,e)}n.length=R}function V(){r.write([null]),a=void 0,r=void 0,t.containerState._closeFlow=void 0}}function Wh(e,t,n){return he(e,e.attempt(this.parser.constructs.document,t,n),"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}function ya(e){if(e===null||Be(e)||jh(e))return 1;if(Uh(e))return 2}function Ir(e,t,n){const i=[];let r=-1;for(;++r<e.length;){const a=e[r].resolveAll;a&&!i.includes(a)&&(t=a(t,n),i.push(a))}return t}const Ji={name:"attention",resolveAll:Yh,tokenize:Kh};function Yh(e,t){let n=-1,i,r,a,o,u,l,c,p;for(;++n<e.length;)if(e[n][0]==="enter"&&e[n][1].type==="attentionSequence"&&e[n][1]._close){for(i=n;i--;)if(e[i][0]==="exit"&&e[i][1].type==="attentionSequence"&&e[i][1]._open&&t.sliceSerialize(e[i][1]).charCodeAt(0)===t.sliceSerialize(e[n][1]).charCodeAt(0)){if((e[i][1]._close||e[n][1]._open)&&(e[n][1].end.offset-e[n][1].start.offset)%3&&!((e[i][1].end.offset-e[i][1].start.offset+e[n][1].end.offset-e[n][1].start.offset)%3))continue;l=e[i][1].end.offset-e[i][1].start.offset>1&&e[n][1].end.offset-e[n][1].start.offset>1?2:1;const d={...e[i][1].end},I={...e[n][1].start};ba(d,-l),ba(I,l),o={type:l>1?"strongSequence":"emphasisSequence",start:d,end:{...e[i][1].end}},u={type:l>1?"strongSequence":"emphasisSequence",start:{...e[n][1].start},end:I},a={type:l>1?"strongText":"emphasisText",start:{...e[i][1].end},end:{...e[n][1].start}},r={type:l>1?"strong":"emphasis",start:{...o.start},end:{...u.end}},e[i][1].end={...o.start},e[n][1].start={...u.end},c=[],e[i][1].end.offset-e[i][1].start.offset&&(c=Ve(c,[["enter",e[i][1],t],["exit",e[i][1],t]])),c=Ve(c,[["enter",r,t],["enter",o,t],["exit",o,t],["enter",a,t]]),c=Ve(c,Ir(t.parser.constructs.insideSpan.null,e.slice(i+1,n),t)),c=Ve(c,[["exit",a,t],["enter",u,t],["exit",u,t],["exit",r,t]]),e[n][1].end.offset-e[n][1].start.offset?(p=2,c=Ve(c,[["enter",e[n][1],t],["exit",e[n][1],t]])):p=0,at(e,i-1,n-i+3,c),n=i+c.length-p-2;break}}for(n=-1;++n<e.length;)e[n][1].type==="attentionSequence"&&(e[n][1].type="data");return e}function Kh(e,t){const n=this.parser.constructs.attentionMarkers.null,i=this.previous,r=ya(i);let a;return o;function o(l){return a=l,e.enter("attentionSequence"),u(l)}function u(l){if(l===a)return e.consume(l),u;const c=e.exit("attentionSequence"),p=ya(l),d=!p||p===2&&r||n.includes(l),I=!r||r===2&&p||n.includes(i);return c._open=!!(a===42?d:d&&(r||!I)),c._close=!!(a===42?I:I&&(p||!d)),t(l)}}function ba(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}const Qh={name:"autolink",tokenize:Xh};function Xh(e,t,n){let i=0;return r;function r(f){return e.enter("autolink"),e.enter("autolinkMarker"),e.consume(f),e.exit("autolinkMarker"),e.enter("autolinkProtocol"),a}function a(f){return tt(f)?(e.consume(f),o):f===64?n(f):c(f)}function o(f){return f===43||f===45||f===46||je(f)?(i=1,u(f)):c(f)}function u(f){return f===58?(e.consume(f),i=0,l):(f===43||f===45||f===46||je(f))&&i++<32?(e.consume(f),u):(i=0,c(f))}function l(f){return f===62?(e.exit("autolinkProtocol"),e.enter("autolinkMarker"),e.consume(f),e.exit("autolinkMarker"),e.exit("autolink"),t):f===null||f===32||f===60||Fi(f)?n(f):(e.consume(f),l)}function c(f){return f===64?(e.consume(f),p):Fh(f)?(e.consume(f),c):n(f)}function p(f){return je(f)?d(f):n(f)}function d(f){return f===46?(e.consume(f),i=0,p):f===62?(e.exit("autolinkProtocol").type="autolinkEmail",e.enter("autolinkMarker"),e.consume(f),e.exit("autolinkMarker"),e.exit("autolink"),t):I(f)}function I(f){if((f===45||je(f))&&i++<63){const A=f===45?I:d;return e.consume(f),A}return n(f)}}const ui={partial:!0,tokenize:Zh};function Zh(e,t,n){return i;function i(a){return ue(a)?he(e,r,"linePrefix")(a):r(a)}function r(a){return a===null||ee(a)?t(a):n(a)}}const os={continuation:{tokenize:td},exit:nd,name:"blockQuote",tokenize:ed};function ed(e,t,n){const i=this;return r;function r(o){if(o===62){const u=i.containerState;return u.open||(e.enter("blockQuote",{_container:!0}),u.open=!0),e.enter("blockQuotePrefix"),e.enter("blockQuoteMarker"),e.consume(o),e.exit("blockQuoteMarker"),a}return n(o)}function a(o){return ue(o)?(e.enter("blockQuotePrefixWhitespace"),e.consume(o),e.exit("blockQuotePrefixWhitespace"),e.exit("blockQuotePrefix"),t):(e.exit("blockQuotePrefix"),t(o))}}function td(e,t,n){const i=this;return r;function r(o){return ue(o)?he(e,a,"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(o):a(o)}function a(o){return e.attempt(os,t,n)(o)}}function nd(e){e.exit("blockQuote")}const ss={name:"characterEscape",tokenize:id};function id(e,t,n){return i;function i(a){return e.enter("characterEscape"),e.enter("escapeMarker"),e.consume(a),e.exit("escapeMarker"),r}function r(a){return Jh(a)?(e.enter("characterEscapeValue"),e.consume(a),e.exit("characterEscapeValue"),e.exit("characterEscape"),t):n(a)}}const us={name:"characterReference",tokenize:rd};function rd(e,t,n){const i=this;let r=0,a,o;return u;function u(d){return e.enter("characterReference"),e.enter("characterReferenceMarker"),e.consume(d),e.exit("characterReferenceMarker"),l}function l(d){return d===35?(e.enter("characterReferenceMarkerNumeric"),e.consume(d),e.exit("characterReferenceMarkerNumeric"),c):(e.enter("characterReferenceValue"),a=31,o=je,p(d))}function c(d){return d===88||d===120?(e.enter("characterReferenceMarkerHexadecimal"),e.consume(d),e.exit("characterReferenceMarkerHexadecimal"),e.enter("characterReferenceValue"),a=6,o=Hh,p):(e.enter("characterReferenceValue"),a=7,o=Hi,p(d))}function p(d){if(d===59&&r){const I=e.exit("characterReferenceValue");return o===je&&!mr(i.sliceSerialize(I))?n(d):(e.enter("characterReferenceMarker"),e.consume(d),e.exit("characterReferenceMarker"),e.exit("characterReference"),t)}return o(d)&&r++<a?(e.consume(d),p):n(d)}}const Sa={partial:!0,tokenize:od},Aa={concrete:!0,name:"codeFenced",tokenize:ad};function ad(e,t,n){const i=this,r={partial:!0,tokenize:X};let a=0,o=0,u;return l;function l(v){return c(v)}function c(v){const j=i.events[i.events.length-1];return a=j&&j[1].type==="linePrefix"?j[2].sliceSerialize(j[1],!0).length:0,u=v,e.enter("codeFenced"),e.enter("codeFencedFence"),e.enter("codeFencedFenceSequence"),p(v)}function p(v){return v===u?(o++,e.consume(v),p):o<3?n(v):(e.exit("codeFencedFenceSequence"),ue(v)?he(e,d,"whitespace")(v):d(v))}function d(v){return v===null||ee(v)?(e.exit("codeFencedFence"),i.interrupt?t(v):e.check(Sa,_,K)(v)):(e.enter("codeFencedFenceInfo"),e.enter("chunkString",{contentType:"string"}),I(v))}function I(v){return v===null||ee(v)?(e.exit("chunkString"),e.exit("codeFencedFenceInfo"),d(v)):ue(v)?(e.exit("chunkString"),e.exit("codeFencedFenceInfo"),he(e,f,"whitespace")(v)):v===96&&v===u?n(v):(e.consume(v),I)}function f(v){return v===null||ee(v)?d(v):(e.enter("codeFencedFenceMeta"),e.enter("chunkString",{contentType:"string"}),A(v))}function A(v){return v===null||ee(v)?(e.exit("chunkString"),e.exit("codeFencedFenceMeta"),d(v)):v===96&&v===u?n(v):(e.consume(v),A)}function _(v){return e.attempt(r,K,M)(v)}function M(v){return e.enter("lineEnding"),e.consume(v),e.exit("lineEnding"),x}function x(v){return a>0&&ue(v)?he(e,V,"linePrefix",a+1)(v):V(v)}function V(v){return v===null||ee(v)?e.check(Sa,_,K)(v):(e.enter("codeFlowValue"),R(v))}function R(v){return v===null||ee(v)?(e.exit("codeFlowValue"),V(v)):(e.consume(v),R)}function K(v){return e.exit("codeFenced"),t(v)}function X(v,j,L){let H=0;return J;function J(O){return v.enter("lineEnding"),v.consume(O),v.exit("lineEnding"),T}function T(O){return v.enter("codeFencedFence"),ue(O)?he(v,F,"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(O):F(O)}function F(O){return O===u?(v.enter("codeFencedFenceSequence"),h(O)):L(O)}function h(O){return O===u?(H++,v.consume(O),h):H>=o?(v.exit("codeFencedFenceSequence"),ue(O)?he(v,C,"whitespace")(O):C(O)):L(O)}function C(O){return O===null||ee(O)?(v.exit("codeFencedFence"),j(O)):L(O)}}}function od(e,t,n){const i=this;return r;function r(o){return o===null?n(o):(e.enter("lineEnding"),e.consume(o),e.exit("lineEnding"),a)}function a(o){return i.parser.lazy[i.now().line]?n(o):t(o)}}const Si={name:"codeIndented",tokenize:ud},sd={partial:!0,tokenize:ld};function ud(e,t,n){const i=this;return r;function r(c){return e.enter("codeIndented"),he(e,a,"linePrefix",5)(c)}function a(c){const p=i.events[i.events.length-1];return p&&p[1].type==="linePrefix"&&p[2].sliceSerialize(p[1],!0).length>=4?o(c):n(c)}function o(c){return c===null?l(c):ee(c)?e.attempt(sd,o,l)(c):(e.enter("codeFlowValue"),u(c))}function u(c){return c===null||ee(c)?(e.exit("codeFlowValue"),o(c)):(e.consume(c),u)}function l(c){return e.exit("codeIndented"),t(c)}}function ld(e,t,n){const i=this;return r;function r(o){return i.parser.lazy[i.now().line]?n(o):ee(o)?(e.enter("lineEnding"),e.consume(o),e.exit("lineEnding"),r):he(e,a,"linePrefix",5)(o)}function a(o){const u=i.events[i.events.length-1];return u&&u[1].type==="linePrefix"&&u[2].sliceSerialize(u[1],!0).length>=4?t(o):ee(o)?r(o):n(o)}}const cd={name:"codeText",previous:hd,resolve:pd,tokenize:dd};function pd(e){let t=e.length-4,n=3,i,r;if((e[n][1].type==="lineEnding"||e[n][1].type==="space")&&(e[t][1].type==="lineEnding"||e[t][1].type==="space")){for(i=n;++i<t;)if(e[i][1].type==="codeTextData"){e[n][1].type="codeTextPadding",e[t][1].type="codeTextPadding",n+=2,t-=2;break}}for(i=n-1,t++;++i<=t;)r===void 0?i!==t&&e[i][1].type!=="lineEnding"&&(r=i):(i===t||e[i][1].type==="lineEnding")&&(e[r][1].type="codeTextData",i!==r+2&&(e[r][1].end=e[i-1][1].end,e.splice(r+2,i-r-2),t-=i-r-2,i=r+2),r=void 0);return e}function hd(e){return e!==96||this.events[this.events.length-1][1].type==="characterEscape"}function dd(e,t,n){let i=0,r,a;return o;function o(d){return e.enter("codeText"),e.enter("codeTextSequence"),u(d)}function u(d){return d===96?(e.consume(d),i++,u):(e.exit("codeTextSequence"),l(d))}function l(d){return d===null?n(d):d===32?(e.enter("space"),e.consume(d),e.exit("space"),l):d===96?(a=e.enter("codeTextSequence"),r=0,p(d)):ee(d)?(e.enter("lineEnding"),e.consume(d),e.exit("lineEnding"),l):(e.enter("codeTextData"),c(d))}function c(d){return d===null||d===32||d===96||ee(d)?(e.exit("codeTextData"),l(d)):(e.consume(d),c)}function p(d){return d===96?(e.consume(d),r++,p):r===i?(e.exit("codeTextSequence"),e.exit("codeText"),t(d)):(a.type="codeTextData",c(d))}}class fd{constructor(t){this.left=t?[...t]:[],this.right=[]}get(t){if(t<0||t>=this.left.length+this.right.length)throw new RangeError("Cannot access index `"+t+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return t<this.left.length?this.left[t]:this.right[this.right.length-t+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(t,n){const i=n??Number.POSITIVE_INFINITY;return i<this.left.length?this.left.slice(t,i):t>this.left.length?this.right.slice(this.right.length-i+this.left.length,this.right.length-t+this.left.length).reverse():this.left.slice(t).concat(this.right.slice(this.right.length-i+this.left.length).reverse())}splice(t,n,i){const r=n||0;this.setCursor(Math.trunc(t));const a=this.right.splice(this.right.length-r,Number.POSITIVE_INFINITY);return i&&Xt(this.left,i),a.reverse()}pop(){return this.setCursor(Number.POSITIVE_INFINITY),this.left.pop()}push(t){this.setCursor(Number.POSITIVE_INFINITY),this.left.push(t)}pushMany(t){this.setCursor(Number.POSITIVE_INFINITY),Xt(this.left,t)}unshift(t){this.setCursor(0),this.right.push(t)}unshiftMany(t){this.setCursor(0),Xt(this.right,t.reverse())}setCursor(t){if(!(t===this.left.length||t>this.left.length&&this.right.length===0||t<0&&this.left.length===0))if(t<this.left.length){const n=this.left.splice(t,Number.POSITIVE_INFINITY);Xt(this.right,n.reverse())}else{const n=this.right.splice(this.left.length+this.right.length-t,Number.POSITIVE_INFINITY);Xt(this.left,n.reverse())}}}function Xt(e,t){let n=0;if(t.length<1e4)e.push(...t);else for(;n<t.length;)e.push(...t.slice(n,n+1e4)),n+=1e4}function ls(e){const t={};let n=-1,i,r,a,o,u,l,c;const p=new fd(e);for(;++n<p.length;){for(;n in t;)n=t[n];if(i=p.get(n),n&&i[1].type==="chunkFlow"&&p.get(n-1)[1].type==="listItemPrefix"&&(l=i[1]._tokenizer.events,a=0,a<l.length&&l[a][1].type==="lineEndingBlank"&&(a+=2),a<l.length&&l[a][1].type==="content"))for(;++a<l.length&&l[a][1].type!=="content";)l[a][1].type==="chunkText"&&(l[a][1]._isInFirstContentOfListItem=!0,a++);if(i[0]==="enter")i[1].contentType&&(Object.assign(t,md(p,n)),n=t[n],c=!0);else if(i[1]._container){for(a=n,r=void 0;a--;)if(o=p.get(a),o[1].type==="lineEnding"||o[1].type==="lineEndingBlank")o[0]==="enter"&&(r&&(p.get(r)[1].type="lineEndingBlank"),o[1].type="lineEnding",r=a);else if(!(o[1].type==="linePrefix"||o[1].type==="listItemIndent"))break;r&&(i[1].end={...p.get(r)[1].start},u=p.slice(r,n),u.unshift(i),p.splice(r,n-r+1,u))}}return at(e,0,Number.POSITIVE_INFINITY,p.slice(0)),!c}function md(e,t){const n=e.get(t)[1],i=e.get(t)[2];let r=t-1;const a=[];let o=n._tokenizer;o||(o=i.parser[n.contentType](n.start),n._contentTypeTextTrailing&&(o._contentTypeTextTrailing=!0));const u=o.events,l=[],c={};let p,d,I=-1,f=n,A=0,_=0;const M=[_];for(;f;){for(;e.get(++r)[1]!==f;);a.push(r),f._tokenizer||(p=i.sliceStream(f),f.next||p.push(null),d&&o.defineSkip(f.start),f._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=!0),o.write(p),f._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=void 0)),d=f,f=f.next}for(f=n;++I<u.length;)u[I][0]==="exit"&&u[I-1][0]==="enter"&&u[I][1].type===u[I-1][1].type&&u[I][1].start.line!==u[I][1].end.line&&(_=I+1,M.push(_),f._tokenizer=void 0,f.previous=void 0,f=f.next);for(o.events=[],f?(f._tokenizer=void 0,f.previous=void 0):M.pop(),I=M.length;I--;){const x=u.slice(M[I],M[I+1]),V=a.pop();l.push([V,V+x.length-1]),e.splice(V,2,x)}for(l.reverse(),I=-1;++I<l.length;)c[A+l[I][0]]=A+l[I][1],A+=l[I][1]-l[I][0]-1;return c}const Id={resolve:yd,tokenize:bd},gd={partial:!0,tokenize:Sd};function yd(e){return ls(e),e}function bd(e,t){let n;return i;function i(u){return e.enter("content"),n=e.enter("chunkContent",{contentType:"content"}),r(u)}function r(u){return u===null?a(u):ee(u)?e.check(gd,o,a)(u):(e.consume(u),r)}function a(u){return e.exit("chunkContent"),e.exit("content"),t(u)}function o(u){return e.consume(u),e.exit("chunkContent"),n.next=e.enter("chunkContent",{contentType:"content",previous:n}),n=n.next,r}}function Sd(e,t,n){const i=this;return r;function r(o){return e.exit("chunkContent"),e.enter("lineEnding"),e.consume(o),e.exit("lineEnding"),he(e,a,"linePrefix")}function a(o){if(o===null||ee(o))return n(o);const u=i.events[i.events.length-1];return!i.parser.constructs.disable.null.includes("codeIndented")&&u&&u[1].type==="linePrefix"&&u[2].sliceSerialize(u[1],!0).length>=4?t(o):e.interrupt(i.parser.constructs.flow,n,t)(o)}}function cs(e,t,n,i,r,a,o,u,l){const c=l||Number.POSITIVE_INFINITY;let p=0;return d;function d(x){return x===60?(e.enter(i),e.enter(r),e.enter(a),e.consume(x),e.exit(a),I):x===null||x===32||x===41||Fi(x)?n(x):(e.enter(i),e.enter(o),e.enter(u),e.enter("chunkString",{contentType:"string"}),_(x))}function I(x){return x===62?(e.enter(a),e.consume(x),e.exit(a),e.exit(r),e.exit(i),t):(e.enter(u),e.enter("chunkString",{contentType:"string"}),f(x))}function f(x){return x===62?(e.exit("chunkString"),e.exit(u),I(x)):x===null||x===60||ee(x)?n(x):(e.consume(x),x===92?A:f)}function A(x){return x===60||x===62||x===92?(e.consume(x),f):f(x)}function _(x){return!p&&(x===null||x===41||Be(x))?(e.exit("chunkString"),e.exit(u),e.exit(o),e.exit(i),t(x)):p<c&&x===40?(e.consume(x),p++,_):x===41?(e.consume(x),p--,_):x===null||x===32||x===40||Fi(x)?n(x):(e.consume(x),x===92?M:_)}function M(x){return x===40||x===41||x===92?(e.consume(x),_):_(x)}}function ps(e,t,n,i,r,a){const o=this;let u=0,l;return c;function c(f){return e.enter(i),e.enter(r),e.consume(f),e.exit(r),e.enter(a),p}function p(f){return u>999||f===null||f===91||f===93&&!l||f===94&&!u&&"_hiddenFootnoteSupport"in o.parser.constructs?n(f):f===93?(e.exit(a),e.enter(r),e.consume(f),e.exit(r),e.exit(i),t):ee(f)?(e.enter("lineEnding"),e.consume(f),e.exit("lineEnding"),p):(e.enter("chunkString",{contentType:"string"}),d(f))}function d(f){return f===null||f===91||f===93||ee(f)||u++>999?(e.exit("chunkString"),p(f)):(e.consume(f),l||(l=!ue(f)),f===92?I:d)}function I(f){return f===91||f===92||f===93?(e.consume(f),u++,d):d(f)}}function hs(e,t,n,i,r,a){let o;return u;function u(I){return I===34||I===39||I===40?(e.enter(i),e.enter(r),e.consume(I),e.exit(r),o=I===40?41:I,l):n(I)}function l(I){return I===o?(e.enter(r),e.consume(I),e.exit(r),e.exit(i),t):(e.enter(a),c(I))}function c(I){return I===o?(e.exit(a),l(o)):I===null?n(I):ee(I)?(e.enter("lineEnding"),e.consume(I),e.exit("lineEnding"),he(e,c,"linePrefix")):(e.enter("chunkString",{contentType:"string"}),p(I))}function p(I){return I===o||I===null||ee(I)?(e.exit("chunkString"),c(I)):(e.consume(I),I===92?d:p)}function d(I){return I===o||I===92?(e.consume(I),p):p(I)}}function sn(e,t){let n;return i;function i(r){return ee(r)?(e.enter("lineEnding"),e.consume(r),e.exit("lineEnding"),n=!0,i):ue(r)?he(e,i,n?"linePrefix":"lineSuffix")(r):t(r)}}const Ad={name:"definition",tokenize:Td},Ed={partial:!0,tokenize:Cd};function Td(e,t,n){const i=this;let r;return a;function a(f){return e.enter("definition"),o(f)}function o(f){return ps.call(i,e,u,n,"definitionLabel","definitionLabelMarker","definitionLabelString")(f)}function u(f){return r=Bt(i.sliceSerialize(i.events[i.events.length-1][1]).slice(1,-1)),f===58?(e.enter("definitionMarker"),e.consume(f),e.exit("definitionMarker"),l):n(f)}function l(f){return Be(f)?sn(e,c)(f):c(f)}function c(f){return cs(e,p,n,"definitionDestination","definitionDestinationLiteral","definitionDestinationLiteralMarker","definitionDestinationRaw","definitionDestinationString")(f)}function p(f){return e.attempt(Ed,d,d)(f)}function d(f){return ue(f)?he(e,I,"whitespace")(f):I(f)}function I(f){return f===null||ee(f)?(e.exit("definition"),i.parser.defined.push(r),t(f)):n(f)}}function Cd(e,t,n){return i;function i(u){return Be(u)?sn(e,r)(u):n(u)}function r(u){return hs(e,a,n,"definitionTitle","definitionTitleMarker","definitionTitleString")(u)}function a(u){return ue(u)?he(e,o,"whitespace")(u):o(u)}function o(u){return u===null||ee(u)?t(u):n(u)}}const kd={name:"hardBreakEscape",tokenize:Od};function Od(e,t,n){return i;function i(a){return e.enter("hardBreakEscape"),e.consume(a),r}function r(a){return ee(a)?(e.exit("hardBreakEscape"),t(a)):n(a)}}const _d={name:"headingAtx",resolve:xd,tokenize:Nd};function xd(e,t){let n=e.length-2,i=3,r,a;return e[i][1].type==="whitespace"&&(i+=2),n-2>i&&e[n][1].type==="whitespace"&&(n-=2),e[n][1].type==="atxHeadingSequence"&&(i===n-1||n-4>i&&e[n-2][1].type==="whitespace")&&(n-=i+1===n?2:4),n>i&&(r={type:"atxHeadingText",start:e[i][1].start,end:e[n][1].end},a={type:"chunkText",start:e[i][1].start,end:e[n][1].end,contentType:"text"},at(e,i,n-i+1,[["enter",r,t],["enter",a,t],["exit",a,t],["exit",r,t]])),e}function Nd(e,t,n){let i=0;return r;function r(p){return e.enter("atxHeading"),a(p)}function a(p){return e.enter("atxHeadingSequence"),o(p)}function o(p){return p===35&&i++<6?(e.consume(p),o):p===null||Be(p)?(e.exit("atxHeadingSequence"),u(p)):n(p)}function u(p){return p===35?(e.enter("atxHeadingSequence"),l(p)):p===null||ee(p)?(e.exit("atxHeading"),t(p)):ue(p)?he(e,u,"whitespace")(p):(e.enter("atxHeadingText"),c(p))}function l(p){return p===35?(e.consume(p),l):(e.exit("atxHeadingSequence"),u(p))}function c(p){return p===null||p===35||Be(p)?(e.exit("atxHeadingText"),u(p)):(e.consume(p),c)}}const vd=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","iframe","legend","li","link","main","menu","menuitem","nav","noframes","ol","optgroup","option","p","param","search","section","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"],Ea=["pre","script","style","textarea"],Rd={concrete:!0,name:"htmlFlow",resolveTo:Dd,tokenize:Ld},Pd={partial:!0,tokenize:Bd},wd={partial:!0,tokenize:Md};function Dd(e){let t=e.length;for(;t--&&!(e[t][0]==="enter"&&e[t][1].type==="htmlFlow"););return t>1&&e[t-2][1].type==="linePrefix"&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e}function Ld(e,t,n){const i=this;let r,a,o,u,l;return c;function c(S){return p(S)}function p(S){return e.enter("htmlFlow"),e.enter("htmlFlowData"),e.consume(S),d}function d(S){return S===33?(e.consume(S),I):S===47?(e.consume(S),a=!0,_):S===63?(e.consume(S),r=3,i.interrupt?t:b):tt(S)?(e.consume(S),o=String.fromCharCode(S),M):n(S)}function I(S){return S===45?(e.consume(S),r=2,f):S===91?(e.consume(S),r=5,u=0,A):tt(S)?(e.consume(S),r=4,i.interrupt?t:b):n(S)}function f(S){return S===45?(e.consume(S),i.interrupt?t:b):n(S)}function A(S){const Ne="CDATA[";return S===Ne.charCodeAt(u++)?(e.consume(S),u===Ne.length?i.interrupt?t:F:A):n(S)}function _(S){return tt(S)?(e.consume(S),o=String.fromCharCode(S),M):n(S)}function M(S){if(S===null||S===47||S===62||Be(S)){const Ne=S===47,st=o.toLowerCase();return!Ne&&!a&&Ea.includes(st)?(r=1,i.interrupt?t(S):F(S)):vd.includes(o.toLowerCase())?(r=6,Ne?(e.consume(S),x):i.interrupt?t(S):F(S)):(r=7,i.interrupt&&!i.parser.lazy[i.now().line]?n(S):a?V(S):R(S))}return S===45||je(S)?(e.consume(S),o+=String.fromCharCode(S),M):n(S)}function x(S){return S===62?(e.consume(S),i.interrupt?t:F):n(S)}function V(S){return ue(S)?(e.consume(S),V):J(S)}function R(S){return S===47?(e.consume(S),J):S===58||S===95||tt(S)?(e.consume(S),K):ue(S)?(e.consume(S),R):J(S)}function K(S){return S===45||S===46||S===58||S===95||je(S)?(e.consume(S),K):X(S)}function X(S){return S===61?(e.consume(S),v):ue(S)?(e.consume(S),X):R(S)}function v(S){return S===null||S===60||S===61||S===62||S===96?n(S):S===34||S===39?(e.consume(S),l=S,j):ue(S)?(e.consume(S),v):L(S)}function j(S){return S===l?(e.consume(S),l=null,H):S===null||ee(S)?n(S):(e.consume(S),j)}function L(S){return S===null||S===34||S===39||S===47||S===60||S===61||S===62||S===96||Be(S)?X(S):(e.consume(S),L)}function H(S){return S===47||S===62||ue(S)?R(S):n(S)}function J(S){return S===62?(e.consume(S),T):n(S)}function T(S){return S===null||ee(S)?F(S):ue(S)?(e.consume(S),T):n(S)}function F(S){return S===45&&r===2?(e.consume(S),z):S===60&&r===1?(e.consume(S),Y):S===62&&r===4?(e.consume(S),Se):S===63&&r===3?(e.consume(S),b):S===93&&r===5?(e.consume(S),Q):ee(S)&&(r===6||r===7)?(e.exit("htmlFlowData"),e.check(Pd,Fe,h)(S)):S===null||ee(S)?(e.exit("htmlFlowData"),h(S)):(e.consume(S),F)}function h(S){return e.check(wd,C,Fe)(S)}function C(S){return e.enter("lineEnding"),e.consume(S),e.exit("lineEnding"),O}function O(S){return S===null||ee(S)?h(S):(e.enter("htmlFlowData"),F(S))}function z(S){return S===45?(e.consume(S),b):F(S)}function Y(S){return S===47?(e.consume(S),o="",U):F(S)}function U(S){if(S===62){const Ne=o.toLowerCase();return Ea.includes(Ne)?(e.consume(S),Se):F(S)}return tt(S)&&o.length<8?(e.consume(S),o+=String.fromCharCode(S),U):F(S)}function Q(S){return S===93?(e.consume(S),b):F(S)}function b(S){return S===62?(e.consume(S),Se):S===45&&r===2?(e.consume(S),b):F(S)}function Se(S){return S===null||ee(S)?(e.exit("htmlFlowData"),Fe(S)):(e.consume(S),Se)}function Fe(S){return e.exit("htmlFlow"),t(S)}}function Md(e,t,n){const i=this;return r;function r(o){return ee(o)?(e.enter("lineEnding"),e.consume(o),e.exit("lineEnding"),a):n(o)}function a(o){return i.parser.lazy[i.now().line]?n(o):t(o)}}function Bd(e,t,n){return i;function i(r){return e.enter("lineEnding"),e.consume(r),e.exit("lineEnding"),e.attempt(ui,t,n)}}const Gd={name:"htmlText",tokenize:Fd};function Fd(e,t,n){const i=this;let r,a,o;return u;function u(b){return e.enter("htmlText"),e.enter("htmlTextData"),e.consume(b),l}function l(b){return b===33?(e.consume(b),c):b===47?(e.consume(b),X):b===63?(e.consume(b),R):tt(b)?(e.consume(b),L):n(b)}function c(b){return b===45?(e.consume(b),p):b===91?(e.consume(b),a=0,A):tt(b)?(e.consume(b),V):n(b)}function p(b){return b===45?(e.consume(b),f):n(b)}function d(b){return b===null?n(b):b===45?(e.consume(b),I):ee(b)?(o=d,Y(b)):(e.consume(b),d)}function I(b){return b===45?(e.consume(b),f):d(b)}function f(b){return b===62?z(b):b===45?I(b):d(b)}function A(b){const Se="CDATA[";return b===Se.charCodeAt(a++)?(e.consume(b),a===Se.length?_:A):n(b)}function _(b){return b===null?n(b):b===93?(e.consume(b),M):ee(b)?(o=_,Y(b)):(e.consume(b),_)}function M(b){return b===93?(e.consume(b),x):_(b)}function x(b){return b===62?z(b):b===93?(e.consume(b),x):_(b)}function V(b){return b===null||b===62?z(b):ee(b)?(o=V,Y(b)):(e.consume(b),V)}function R(b){return b===null?n(b):b===63?(e.consume(b),K):ee(b)?(o=R,Y(b)):(e.consume(b),R)}function K(b){return b===62?z(b):R(b)}function X(b){return tt(b)?(e.consume(b),v):n(b)}function v(b){return b===45||je(b)?(e.consume(b),v):j(b)}function j(b){return ee(b)?(o=j,Y(b)):ue(b)?(e.consume(b),j):z(b)}function L(b){return b===45||je(b)?(e.consume(b),L):b===47||b===62||Be(b)?H(b):n(b)}function H(b){return b===47?(e.consume(b),z):b===58||b===95||tt(b)?(e.consume(b),J):ee(b)?(o=H,Y(b)):ue(b)?(e.consume(b),H):z(b)}function J(b){return b===45||b===46||b===58||b===95||je(b)?(e.consume(b),J):T(b)}function T(b){return b===61?(e.consume(b),F):ee(b)?(o=T,Y(b)):ue(b)?(e.consume(b),T):H(b)}function F(b){return b===null||b===60||b===61||b===62||b===96?n(b):b===34||b===39?(e.consume(b),r=b,h):ee(b)?(o=F,Y(b)):ue(b)?(e.consume(b),F):(e.consume(b),C)}function h(b){return b===r?(e.consume(b),r=void 0,O):b===null?n(b):ee(b)?(o=h,Y(b)):(e.consume(b),h)}function C(b){return b===null||b===34||b===39||b===60||b===61||b===96?n(b):b===47||b===62||Be(b)?H(b):(e.consume(b),C)}function O(b){return b===47||b===62||Be(b)?H(b):n(b)}function z(b){return b===62?(e.consume(b),e.exit("htmlTextData"),e.exit("htmlText"),t):n(b)}function Y(b){return e.exit("htmlTextData"),e.enter("lineEnding"),e.consume(b),e.exit("lineEnding"),U}function U(b){return ue(b)?he(e,Q,"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(b):Q(b)}function Q(b){return e.enter("htmlTextData"),o(b)}}const gr={name:"labelEnd",resolveAll:jd,resolveTo:$d,tokenize:qd},Hd={tokenize:Vd},Jd={tokenize:zd},Ud={tokenize:Wd};function jd(e){let t=-1;const n=[];for(;++t<e.length;){const i=e[t][1];if(n.push(e[t]),i.type==="labelImage"||i.type==="labelLink"||i.type==="labelEnd"){const r=i.type==="labelImage"?4:2;i.type="data",t+=r}}return e.length!==n.length&&at(e,0,e.length,n),e}function $d(e,t){let n=e.length,i=0,r,a,o,u;for(;n--;)if(r=e[n][1],a){if(r.type==="link"||r.type==="labelLink"&&r._inactive)break;e[n][0]==="enter"&&r.type==="labelLink"&&(r._inactive=!0)}else if(o){if(e[n][0]==="enter"&&(r.type==="labelImage"||r.type==="labelLink")&&!r._balanced&&(a=n,r.type!=="labelLink")){i=2;break}}else r.type==="labelEnd"&&(o=n);const l={type:e[a][1].type==="labelLink"?"link":"image",start:{...e[a][1].start},end:{...e[e.length-1][1].end}},c={type:"label",start:{...e[a][1].start},end:{...e[o][1].end}},p={type:"labelText",start:{...e[a+i+2][1].end},end:{...e[o-2][1].start}};return u=[["enter",l,t],["enter",c,t]],u=Ve(u,e.slice(a+1,a+i+3)),u=Ve(u,[["enter",p,t]]),u=Ve(u,Ir(t.parser.constructs.insideSpan.null,e.slice(a+i+4,o-3),t)),u=Ve(u,[["exit",p,t],e[o-2],e[o-1],["exit",c,t]]),u=Ve(u,e.slice(o+1)),u=Ve(u,[["exit",l,t]]),at(e,a,e.length,u),e}function qd(e,t,n){const i=this;let r=i.events.length,a,o;for(;r--;)if((i.events[r][1].type==="labelImage"||i.events[r][1].type==="labelLink")&&!i.events[r][1]._balanced){a=i.events[r][1];break}return u;function u(I){return a?a._inactive?d(I):(o=i.parser.defined.includes(Bt(i.sliceSerialize({start:a.end,end:i.now()}))),e.enter("labelEnd"),e.enter("labelMarker"),e.consume(I),e.exit("labelMarker"),e.exit("labelEnd"),l):n(I)}function l(I){return I===40?e.attempt(Hd,p,o?p:d)(I):I===91?e.attempt(Jd,p,o?c:d)(I):o?p(I):d(I)}function c(I){return e.attempt(Ud,p,d)(I)}function p(I){return t(I)}function d(I){return a._balanced=!0,n(I)}}function Vd(e,t,n){return i;function i(d){return e.enter("resource"),e.enter("resourceMarker"),e.consume(d),e.exit("resourceMarker"),r}function r(d){return Be(d)?sn(e,a)(d):a(d)}function a(d){return d===41?p(d):cs(e,o,u,"resourceDestination","resourceDestinationLiteral","resourceDestinationLiteralMarker","resourceDestinationRaw","resourceDestinationString",32)(d)}function o(d){return Be(d)?sn(e,l)(d):p(d)}function u(d){return n(d)}function l(d){return d===34||d===39||d===40?hs(e,c,n,"resourceTitle","resourceTitleMarker","resourceTitleString")(d):p(d)}function c(d){return Be(d)?sn(e,p)(d):p(d)}function p(d){return d===41?(e.enter("resourceMarker"),e.consume(d),e.exit("resourceMarker"),e.exit("resource"),t):n(d)}}function zd(e,t,n){const i=this;return r;function r(u){return ps.call(i,e,a,o,"reference","referenceMarker","referenceString")(u)}function a(u){return i.parser.defined.includes(Bt(i.sliceSerialize(i.events[i.events.length-1][1]).slice(1,-1)))?t(u):n(u)}function o(u){return n(u)}}function Wd(e,t,n){return i;function i(a){return e.enter("reference"),e.enter("referenceMarker"),e.consume(a),e.exit("referenceMarker"),r}function r(a){return a===93?(e.enter("referenceMarker"),e.consume(a),e.exit("referenceMarker"),e.exit("reference"),t):n(a)}}const Yd={name:"labelStartImage",resolveAll:gr.resolveAll,tokenize:Kd};function Kd(e,t,n){const i=this;return r;function r(u){return e.enter("labelImage"),e.enter("labelImageMarker"),e.consume(u),e.exit("labelImageMarker"),a}function a(u){return u===91?(e.enter("labelMarker"),e.consume(u),e.exit("labelMarker"),e.exit("labelImage"),o):n(u)}function o(u){return u===94&&"_hiddenFootnoteSupport"in i.parser.constructs?n(u):t(u)}}const Qd={name:"labelStartLink",resolveAll:gr.resolveAll,tokenize:Xd};function Xd(e,t,n){const i=this;return r;function r(o){return e.enter("labelLink"),e.enter("labelMarker"),e.consume(o),e.exit("labelMarker"),e.exit("labelLink"),a}function a(o){return o===94&&"_hiddenFootnoteSupport"in i.parser.constructs?n(o):t(o)}}const Ai={name:"lineEnding",tokenize:Zd};function Zd(e,t){return n;function n(i){return e.enter("lineEnding"),e.consume(i),e.exit("lineEnding"),he(e,t,"linePrefix")}}const Hn={name:"thematicBreak",tokenize:ef};function ef(e,t,n){let i=0,r;return a;function a(c){return e.enter("thematicBreak"),o(c)}function o(c){return r=c,u(c)}function u(c){return c===r?(e.enter("thematicBreakSequence"),l(c)):i>=3&&(c===null||ee(c))?(e.exit("thematicBreak"),t(c)):n(c)}function l(c){return c===r?(e.consume(c),i++,l):(e.exit("thematicBreakSequence"),ue(c)?he(e,u,"whitespace")(c):u(c))}}const Le={continuation:{tokenize:af},exit:sf,name:"list",tokenize:rf},tf={partial:!0,tokenize:uf},nf={partial:!0,tokenize:of};function rf(e,t,n){const i=this,r=i.events[i.events.length-1];let a=r&&r[1].type==="linePrefix"?r[2].sliceSerialize(r[1],!0).length:0,o=0;return u;function u(f){const A=i.containerState.type||(f===42||f===43||f===45?"listUnordered":"listOrdered");if(A==="listUnordered"?!i.containerState.marker||f===i.containerState.marker:Hi(f)){if(i.containerState.type||(i.containerState.type=A,e.enter(A,{_container:!0})),A==="listUnordered")return e.enter("listItemPrefix"),f===42||f===45?e.check(Hn,n,c)(f):c(f);if(!i.interrupt||f===49)return e.enter("listItemPrefix"),e.enter("listItemValue"),l(f)}return n(f)}function l(f){return Hi(f)&&++o<10?(e.consume(f),l):(!i.interrupt||o<2)&&(i.containerState.marker?f===i.containerState.marker:f===41||f===46)?(e.exit("listItemValue"),c(f)):n(f)}function c(f){return e.enter("listItemMarker"),e.consume(f),e.exit("listItemMarker"),i.containerState.marker=i.containerState.marker||f,e.check(ui,i.interrupt?n:p,e.attempt(tf,I,d))}function p(f){return i.containerState.initialBlankLine=!0,a++,I(f)}function d(f){return ue(f)?(e.enter("listItemPrefixWhitespace"),e.consume(f),e.exit("listItemPrefixWhitespace"),I):n(f)}function I(f){return i.containerState.size=a+i.sliceSerialize(e.exit("listItemPrefix"),!0).length,t(f)}}function af(e,t,n){const i=this;return i.containerState._closeFlow=void 0,e.check(ui,r,a);function r(u){return i.containerState.furtherBlankLines=i.containerState.furtherBlankLines||i.containerState.initialBlankLine,he(e,t,"listItemIndent",i.containerState.size+1)(u)}function a(u){return i.containerState.furtherBlankLines||!ue(u)?(i.containerState.furtherBlankLines=void 0,i.containerState.initialBlankLine=void 0,o(u)):(i.containerState.furtherBlankLines=void 0,i.containerState.initialBlankLine=void 0,e.attempt(nf,t,o)(u))}function o(u){return i.containerState._closeFlow=!0,i.interrupt=void 0,he(e,e.attempt(Le,t,n),"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(u)}}function of(e,t,n){const i=this;return he(e,r,"listItemIndent",i.containerState.size+1);function r(a){const o=i.events[i.events.length-1];return o&&o[1].type==="listItemIndent"&&o[2].sliceSerialize(o[1],!0).length===i.containerState.size?t(a):n(a)}}function sf(e){e.exit(this.containerState.type)}function uf(e,t,n){const i=this;return he(e,r,"listItemPrefixWhitespace",i.parser.constructs.disable.null.includes("codeIndented")?void 0:5);function r(a){const o=i.events[i.events.length-1];return!ue(a)&&o&&o[1].type==="listItemPrefixWhitespace"?t(a):n(a)}}const Ta={name:"setextUnderline",resolveTo:lf,tokenize:cf};function lf(e,t){let n=e.length,i,r,a;for(;n--;)if(e[n][0]==="enter"){if(e[n][1].type==="content"){i=n;break}e[n][1].type==="paragraph"&&(r=n)}else e[n][1].type==="content"&&e.splice(n,1),!a&&e[n][1].type==="definition"&&(a=n);const o={type:"setextHeading",start:{...e[i][1].start},end:{...e[e.length-1][1].end}};return e[r][1].type="setextHeadingText",a?(e.splice(r,0,["enter",o,t]),e.splice(a+1,0,["exit",e[i][1],t]),e[i][1].end={...e[a][1].end}):e[i][1]=o,e.push(["exit",o,t]),e}function cf(e,t,n){const i=this;let r;return a;function a(c){let p=i.events.length,d;for(;p--;)if(i.events[p][1].type!=="lineEnding"&&i.events[p][1].type!=="linePrefix"&&i.events[p][1].type!=="content"){d=i.events[p][1].type==="paragraph";break}return!i.parser.lazy[i.now().line]&&(i.interrupt||d)?(e.enter("setextHeadingLine"),r=c,o(c)):n(c)}function o(c){return e.enter("setextHeadingLineSequence"),u(c)}function u(c){return c===r?(e.consume(c),u):(e.exit("setextHeadingLineSequence"),ue(c)?he(e,l,"lineSuffix")(c):l(c))}function l(c){return c===null||ee(c)?(e.exit("setextHeadingLine"),t(c)):n(c)}}const pf={tokenize:hf};function hf(e){const t=this,n=e.attempt(ui,i,e.attempt(this.parser.constructs.flowInitial,r,he(e,e.attempt(this.parser.constructs.flow,r,e.attempt(Id,r)),"linePrefix")));return n;function i(a){if(a===null){e.consume(a);return}return e.enter("lineEndingBlank"),e.consume(a),e.exit("lineEndingBlank"),t.currentConstruct=void 0,n}function r(a){if(a===null){e.consume(a);return}return e.enter("lineEnding"),e.consume(a),e.exit("lineEnding"),t.currentConstruct=void 0,n}}const df={resolveAll:fs()},ff=ds("string"),mf=ds("text");function ds(e){return{resolveAll:fs(e==="text"?If:void 0),tokenize:t};function t(n){const i=this,r=this.parser.constructs[e],a=n.attempt(r,o,u);return o;function o(p){return c(p)?a(p):u(p)}function u(p){if(p===null){n.consume(p);return}return n.enter("data"),n.consume(p),l}function l(p){return c(p)?(n.exit("data"),a(p)):(n.consume(p),l)}function c(p){if(p===null)return!0;const d=r[p];let I=-1;if(d)for(;++I<d.length;){const f=d[I];if(!f.previous||f.previous.call(i,i.previous))return!0}return!1}}}function fs(e){return t;function t(n,i){let r=-1,a;for(;++r<=n.length;)a===void 0?n[r]&&n[r][1].type==="data"&&(a=r,r++):(!n[r]||n[r][1].type!=="data")&&(r!==a+2&&(n[a][1].end=n[r-1][1].end,n.splice(a+2,r-a-2),r=a+2),a=void 0);return e?e(n,i):n}}function If(e,t){let n=0;for(;++n<=e.length;)if((n===e.length||e[n][1].type==="lineEnding")&&e[n-1][1].type==="data"){const i=e[n-1][1],r=t.sliceStream(i);let a=r.length,o=-1,u=0,l;for(;a--;){const c=r[a];if(typeof c=="string"){for(o=c.length;c.charCodeAt(o-1)===32;)u++,o--;if(o)break;o=-1}else if(c===-2)l=!0,u++;else if(c!==-1){a++;break}}if(t._contentTypeTextTrailing&&n===e.length&&(u=0),u){const c={type:n===e.length||l||u<2?"lineSuffix":"hardBreakTrailing",start:{_bufferIndex:a?o:i.start._bufferIndex+o,_index:i.start._index+a,line:i.end.line,column:i.end.column-u,offset:i.end.offset-u},end:{...i.end}};i.end={...c.start},i.start.offset===i.end.offset?Object.assign(i,c):(e.splice(n,0,["enter",c,t],["exit",c,t]),n+=2)}n++}return e}const gf={42:Le,43:Le,45:Le,48:Le,49:Le,50:Le,51:Le,52:Le,53:Le,54:Le,55:Le,56:Le,57:Le,62:os},yf={91:Ad},bf={[-2]:Si,[-1]:Si,32:Si},Sf={35:_d,42:Hn,45:[Ta,Hn],60:Rd,61:Ta,95:Hn,96:Aa,126:Aa},Af={38:us,92:ss},Ef={[-5]:Ai,[-4]:Ai,[-3]:Ai,33:Yd,38:us,42:Ji,60:[Qh,Gd],91:Qd,92:[kd,ss],93:gr,95:Ji,96:cd},Tf={null:[Ji,df]},Cf={null:[42,95]},kf={null:[]},Of=Object.freeze(Object.defineProperty({__proto__:null,attentionMarkers:Cf,contentInitial:yf,disable:kf,document:gf,flow:Sf,flowInitial:bf,insideSpan:Tf,string:Af,text:Ef},Symbol.toStringTag,{value:"Module"}));function _f(e,t,n){let i={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0};const r={},a=[];let o=[],u=[];const l={attempt:j(X),check:j(v),consume:V,enter:R,exit:K,interrupt:j(v,{interrupt:!0})},c={code:null,containerState:{},defineSkip:_,events:[],now:A,parser:e,previous:null,sliceSerialize:I,sliceStream:f,write:d};let p=t.tokenize.call(c,l);return t.resolveAll&&a.push(t),c;function d(T){return o=Ve(o,T),M(),o[o.length-1]!==null?[]:(L(t,0),c.events=Ir(a,c.events,c),c.events)}function I(T,F){return Nf(f(T),F)}function f(T){return xf(o,T)}function A(){const{_bufferIndex:T,_index:F,line:h,column:C,offset:O}=i;return{_bufferIndex:T,_index:F,line:h,column:C,offset:O}}function _(T){r[T.line]=T.column,J()}function M(){let T;for(;i._index<o.length;){const F=o[i._index];if(typeof F=="string")for(T=i._index,i._bufferIndex<0&&(i._bufferIndex=0);i._index===T&&i._bufferIndex<F.length;)x(F.charCodeAt(i._bufferIndex));else x(F)}}function x(T){p=p(T)}function V(T){ee(T)?(i.line++,i.column=1,i.offset+=T===-3?2:1,J()):T!==-1&&(i.column++,i.offset++),i._bufferIndex<0?i._index++:(i._bufferIndex++,i._bufferIndex===o[i._index].length&&(i._bufferIndex=-1,i._index++)),c.previous=T}function R(T,F){const h=F||{};return h.type=T,h.start=A(),c.events.push(["enter",h,c]),u.push(h),h}function K(T){const F=u.pop();return F.end=A(),c.events.push(["exit",F,c]),F}function X(T,F){L(T,F.from)}function v(T,F){F.restore()}function j(T,F){return h;function h(C,O,z){let Y,U,Q,b;return Array.isArray(C)?Fe(C):"tokenize"in C?Fe([C]):Se(C);function Se(Z){return Ce;function Ce(ge){const $e=ge!==null&&Z[ge],Ye=ge!==null&&Z.null,bt=[...Array.isArray($e)?$e:$e?[$e]:[],...Array.isArray(Ye)?Ye:Ye?[Ye]:[]];return Fe(bt)(ge)}}function Fe(Z){return Y=Z,U=0,Z.length===0?z:S(Z[U])}function S(Z){return Ce;function Ce(ge){return b=H(),Q=Z,Z.partial||(c.currentConstruct=Z),Z.name&&c.parser.constructs.disable.null.includes(Z.name)?st():Z.tokenize.call(F?Object.assign(Object.create(c),F):c,l,Ne,st)(ge)}}function Ne(Z){return T(Q,b),O}function st(Z){return b.restore(),++U<Y.length?S(Y[U]):z}}}function L(T,F){T.resolveAll&&!a.includes(T)&&a.push(T),T.resolve&&at(c.events,F,c.events.length-F,T.resolve(c.events.slice(F),c)),T.resolveTo&&(c.events=T.resolveTo(c.events,c))}function H(){const T=A(),F=c.previous,h=c.currentConstruct,C=c.events.length,O=Array.from(u);return{from:C,restore:z};function z(){i=T,c.previous=F,c.currentConstruct=h,c.events.length=C,u=O,J()}}function J(){i.line in r&&i.column<2&&(i.column=r[i.line],i.offset+=r[i.line]-1)}}function xf(e,t){const n=t.start._index,i=t.start._bufferIndex,r=t.end._index,a=t.end._bufferIndex;let o;if(n===r)o=[e[n].slice(i,a)];else{if(o=e.slice(n,r),i>-1){const u=o[0];typeof u=="string"?o[0]=u.slice(i):o.shift()}a>0&&o.push(e[r].slice(0,a))}return o}function Nf(e,t){let n=-1;const i=[];let r;for(;++n<e.length;){const a=e[n];let o;if(typeof a=="string")o=a;else switch(a){case-5:{o="\r";break}case-4:{o=`
`;break}case-3:{o=`\r
`;break}case-2:{o=t?" ":"	";break}case-1:{if(!t&&r)continue;o=" ";break}default:o=String.fromCharCode(a)}r=a===-2,i.push(o)}return i.join("")}function vf(e){const i={constructs:Mh([Of,...(e||{}).extensions||[]]),content:r($h),defined:[],document:r(Vh),flow:r(pf),lazy:{},string:r(ff),text:r(mf)};return i;function r(a){return o;function o(u){return _f(i,a,u)}}}function Rf(e){for(;!ls(e););return e}const Ca=/[\0\t\n\r]/g;function Pf(){let e=1,t="",n=!0,i;return r;function r(a,o,u){const l=[];let c,p,d,I,f;for(a=t+(typeof a=="string"?a.toString():new TextDecoder(o||void 0).decode(a)),d=0,t="",n&&(a.charCodeAt(0)===65279&&d++,n=void 0);d<a.length;){if(Ca.lastIndex=d,c=Ca.exec(a),I=c&&c.index!==void 0?c.index:a.length,f=a.charCodeAt(I),!c){t=a.slice(d);break}if(f===10&&d===I&&i)l.push(-3),i=void 0;else switch(i&&(l.push(-5),i=void 0),d<I&&(l.push(a.slice(d,I)),e+=I-d),f){case 0:{l.push(65533),e++;break}case 9:{for(p=Math.ceil(e/4)*4,l.push(-2);e++<p;)l.push(-1);break}case 10:{l.push(-4),e=1;break}default:i=!0,e=1}d=I+1}return u&&(i&&l.push(-5),t&&l.push(t),l.push(null)),l}}const wf=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function Df(e){return e.replace(wf,Lf)}function Lf(e,t,n){if(t)return t;if(n.charCodeAt(0)===35){const r=n.charCodeAt(1),a=r===120||r===88;return as(n.slice(a?2:1),a?16:10)}return mr(n)||e}const ms={}.hasOwnProperty;function Mf(e,t,n){return typeof t!="string"&&(n=t,t=void 0),Bf(n)(Rf(vf(n).document().write(Pf()(e,t,!0))))}function Bf(e){const t={transforms:[],canContainEols:["emphasis","fragment","heading","paragraph","strong"],enter:{autolink:a(Gr),autolinkProtocol:H,autolinkEmail:H,atxHeading:a(Lr),blockQuote:a(Ye),characterEscape:H,characterReference:H,codeFenced:a(bt),codeFencedFenceInfo:o,codeFencedFenceMeta:o,codeIndented:a(bt,o),codeText:a(ku,o),codeTextData:H,data:H,codeFlowValue:H,definition:a(Ou),definitionDestinationString:o,definitionLabelString:o,definitionTitleString:o,emphasis:a(_u),hardBreakEscape:a(Mr),hardBreakTrailing:a(Mr),htmlFlow:a(Br,o),htmlFlowData:H,htmlText:a(Br,o),htmlTextData:H,image:a(xu),label:o,link:a(Gr),listItem:a(Nu),listItemValue:I,listOrdered:a(Fr,d),listUnordered:a(Fr),paragraph:a(vu),reference:S,referenceString:o,resourceDestinationString:o,resourceTitleString:o,setextHeading:a(Lr),strong:a(Ru),thematicBreak:a(wu)},exit:{atxHeading:l(),atxHeadingSequence:X,autolink:l(),autolinkEmail:$e,autolinkProtocol:ge,blockQuote:l(),characterEscapeValue:J,characterReferenceMarkerHexadecimal:st,characterReferenceMarkerNumeric:st,characterReferenceValue:Z,characterReference:Ce,codeFenced:l(M),codeFencedFence:_,codeFencedFenceInfo:f,codeFencedFenceMeta:A,codeFlowValue:J,codeIndented:l(x),codeText:l(O),codeTextData:J,data:J,definition:l(),definitionDestinationString:K,definitionLabelString:V,definitionTitleString:R,emphasis:l(),hardBreakEscape:l(F),hardBreakTrailing:l(F),htmlFlow:l(h),htmlFlowData:J,htmlText:l(C),htmlTextData:J,image:l(Y),label:Q,labelText:U,lineEnding:T,link:l(z),listItem:l(),listOrdered:l(),listUnordered:l(),paragraph:l(),referenceString:Ne,resourceDestinationString:b,resourceTitleString:Se,resource:Fe,setextHeading:l(L),setextHeadingLineSequence:j,setextHeadingText:v,strong:l(),thematicBreak:l()}};Is(t,(e||{}).mdastExtensions||[]);const n={};return i;function i(P){let $={type:"root",children:[]};const ne={stack:[$],tokenStack:[],config:t,enter:u,exit:c,buffer:o,resume:p,data:n},se=[];let le=-1;for(;++le<P.length;)if(P[le][1].type==="listOrdered"||P[le][1].type==="listUnordered")if(P[le][0]==="enter")se.push(le);else{const Ke=se.pop();le=r(P,Ke,le)}for(le=-1;++le<P.length;){const Ke=t[P[le][0]];ms.call(Ke,P[le][1].type)&&Ke[P[le][1].type].call(Object.assign({sliceSerialize:P[le][2].sliceSerialize},ne),P[le][1])}if(ne.tokenStack.length>0){const Ke=ne.tokenStack[ne.tokenStack.length-1];(Ke[1]||ka).call(ne,void 0,Ke[0])}for($.position={start:pt(P.length>0?P[0][1].start:{line:1,column:1,offset:0}),end:pt(P.length>0?P[P.length-2][1].end:{line:1,column:1,offset:0})},le=-1;++le<t.transforms.length;)$=t.transforms[le]($)||$;return $}function r(P,$,ne){let se=$-1,le=-1,Ke=!1,St,ut,Kt,Qt;for(;++se<=ne;){const He=P[se];switch(He[1].type){case"listUnordered":case"listOrdered":case"blockQuote":{He[0]==="enter"?le++:le--,Qt=void 0;break}case"lineEndingBlank":{He[0]==="enter"&&(St&&!Qt&&!le&&!Kt&&(Kt=se),Qt=void 0);break}case"linePrefix":case"listItemValue":case"listItemMarker":case"listItemPrefix":case"listItemPrefixWhitespace":break;default:Qt=void 0}if(!le&&He[0]==="enter"&&He[1].type==="listItemPrefix"||le===-1&&He[0]==="exit"&&(He[1].type==="listUnordered"||He[1].type==="listOrdered")){if(St){let Rt=se;for(ut=void 0;Rt--;){const lt=P[Rt];if(lt[1].type==="lineEnding"||lt[1].type==="lineEndingBlank"){if(lt[0]==="exit")continue;ut&&(P[ut][1].type="lineEndingBlank",Ke=!0),lt[1].type="lineEnding",ut=Rt}else if(!(lt[1].type==="linePrefix"||lt[1].type==="blockQuotePrefix"||lt[1].type==="blockQuotePrefixWhitespace"||lt[1].type==="blockQuoteMarker"||lt[1].type==="listItemIndent"))break}Kt&&(!ut||Kt<ut)&&(St._spread=!0),St.end=Object.assign({},ut?P[ut][1].start:He[1].end),P.splice(ut||se,0,["exit",St,He[2]]),se++,ne++}if(He[1].type==="listItemPrefix"){const Rt={type:"listItem",_spread:!1,start:Object.assign({},He[1].start),end:void 0};St=Rt,P.splice(se,0,["enter",Rt,He[2]]),se++,ne++,Kt=void 0,Qt=!0}}}return P[$][1]._spread=Ke,ne}function a(P,$){return ne;function ne(se){u.call(this,P(se),se),$&&$.call(this,se)}}function o(){this.stack.push({type:"fragment",children:[]})}function u(P,$,ne){this.stack[this.stack.length-1].children.push(P),this.stack.push(P),this.tokenStack.push([$,ne||void 0]),P.position={start:pt($.start),end:void 0}}function l(P){return $;function $(ne){P&&P.call(this,ne),c.call(this,ne)}}function c(P,$){const ne=this.stack.pop(),se=this.tokenStack.pop();if(se)se[0].type!==P.type&&($?$.call(this,P,se[0]):(se[1]||ka).call(this,P,se[0]));else throw new Error("Cannot close `"+P.type+"` ("+on({start:P.start,end:P.end})+"): it’s not open");ne.position.end=pt(P.end)}function p(){return Dh(this.stack.pop())}function d(){this.data.expectingFirstListItemValue=!0}function I(P){if(this.data.expectingFirstListItemValue){const $=this.stack[this.stack.length-2];$.start=Number.parseInt(this.sliceSerialize(P),10),this.data.expectingFirstListItemValue=void 0}}function f(){const P=this.resume(),$=this.stack[this.stack.length-1];$.lang=P}function A(){const P=this.resume(),$=this.stack[this.stack.length-1];$.meta=P}function _(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function M(){const P=this.resume(),$=this.stack[this.stack.length-1];$.value=P.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,""),this.data.flowCodeInside=void 0}function x(){const P=this.resume(),$=this.stack[this.stack.length-1];$.value=P.replace(/(\r?\n|\r)$/g,"")}function V(P){const $=this.resume(),ne=this.stack[this.stack.length-1];ne.label=$,ne.identifier=Bt(this.sliceSerialize(P)).toLowerCase()}function R(){const P=this.resume(),$=this.stack[this.stack.length-1];$.title=P}function K(){const P=this.resume(),$=this.stack[this.stack.length-1];$.url=P}function X(P){const $=this.stack[this.stack.length-1];if(!$.depth){const ne=this.sliceSerialize(P).length;$.depth=ne}}function v(){this.data.setextHeadingSlurpLineEnding=!0}function j(P){const $=this.stack[this.stack.length-1];$.depth=this.sliceSerialize(P).codePointAt(0)===61?1:2}function L(){this.data.setextHeadingSlurpLineEnding=void 0}function H(P){const ne=this.stack[this.stack.length-1].children;let se=ne[ne.length-1];(!se||se.type!=="text")&&(se=Pu(),se.position={start:pt(P.start),end:void 0},ne.push(se)),this.stack.push(se)}function J(P){const $=this.stack.pop();$.value+=this.sliceSerialize(P),$.position.end=pt(P.end)}function T(P){const $=this.stack[this.stack.length-1];if(this.data.atHardBreak){const ne=$.children[$.children.length-1];ne.position.end=pt(P.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&t.canContainEols.includes($.type)&&(H.call(this,P),J.call(this,P))}function F(){this.data.atHardBreak=!0}function h(){const P=this.resume(),$=this.stack[this.stack.length-1];$.value=P}function C(){const P=this.resume(),$=this.stack[this.stack.length-1];$.value=P}function O(){const P=this.resume(),$=this.stack[this.stack.length-1];$.value=P}function z(){const P=this.stack[this.stack.length-1];if(this.data.inReference){const $=this.data.referenceType||"shortcut";P.type+="Reference",P.referenceType=$,delete P.url,delete P.title}else delete P.identifier,delete P.label;this.data.referenceType=void 0}function Y(){const P=this.stack[this.stack.length-1];if(this.data.inReference){const $=this.data.referenceType||"shortcut";P.type+="Reference",P.referenceType=$,delete P.url,delete P.title}else delete P.identifier,delete P.label;this.data.referenceType=void 0}function U(P){const $=this.sliceSerialize(P),ne=this.stack[this.stack.length-2];ne.label=Df($),ne.identifier=Bt($).toLowerCase()}function Q(){const P=this.stack[this.stack.length-1],$=this.resume(),ne=this.stack[this.stack.length-1];if(this.data.inReference=!0,ne.type==="link"){const se=P.children;ne.children=se}else ne.alt=$}function b(){const P=this.resume(),$=this.stack[this.stack.length-1];$.url=P}function Se(){const P=this.resume(),$=this.stack[this.stack.length-1];$.title=P}function Fe(){this.data.inReference=void 0}function S(){this.data.referenceType="collapsed"}function Ne(P){const $=this.resume(),ne=this.stack[this.stack.length-1];ne.label=$,ne.identifier=Bt(this.sliceSerialize(P)).toLowerCase(),this.data.referenceType="full"}function st(P){this.data.characterReferenceType=P.type}function Z(P){const $=this.sliceSerialize(P),ne=this.data.characterReferenceType;let se;ne?(se=as($,ne==="characterReferenceMarkerNumeric"?10:16),this.data.characterReferenceType=void 0):se=mr($);const le=this.stack[this.stack.length-1];le.value+=se}function Ce(P){const $=this.stack.pop();$.position.end=pt(P.end)}function ge(P){J.call(this,P);const $=this.stack[this.stack.length-1];$.url=this.sliceSerialize(P)}function $e(P){J.call(this,P);const $=this.stack[this.stack.length-1];$.url="mailto:"+this.sliceSerialize(P)}function Ye(){return{type:"blockquote",children:[]}}function bt(){return{type:"code",lang:null,meta:null,value:""}}function ku(){return{type:"inlineCode",value:""}}function Ou(){return{type:"definition",identifier:"",label:null,title:null,url:""}}function _u(){return{type:"emphasis",children:[]}}function Lr(){return{type:"heading",depth:0,children:[]}}function Mr(){return{type:"break"}}function Br(){return{type:"html",value:""}}function xu(){return{type:"image",title:null,url:"",alt:null}}function Gr(){return{type:"link",title:null,url:"",children:[]}}function Fr(P){return{type:"list",ordered:P.type==="listOrdered",start:null,spread:P._spread,children:[]}}function Nu(P){return{type:"listItem",spread:P._spread,checked:null,children:[]}}function vu(){return{type:"paragraph",children:[]}}function Ru(){return{type:"strong",children:[]}}function Pu(){return{type:"text",value:""}}function wu(){return{type:"thematicBreak"}}}function pt(e){return{line:e.line,column:e.column,offset:e.offset}}function Is(e,t){let n=-1;for(;++n<t.length;){const i=t[n];Array.isArray(i)?Is(e,i):Gf(e,i)}}function Gf(e,t){let n;for(n in t)if(ms.call(t,n))switch(n){case"canContainEols":{const i=t[n];i&&e[n].push(...i);break}case"transforms":{const i=t[n];i&&e[n].push(...i);break}case"enter":case"exit":{const i=t[n];i&&Object.assign(e[n],i);break}}}function ka(e,t){throw e?new Error("Cannot close `"+e.type+"` ("+on({start:e.start,end:e.end})+"): a different token (`"+t.type+"`, "+on({start:t.start,end:t.end})+") is open"):new Error("Cannot close document, a token (`"+t.type+"`, "+on({start:t.start,end:t.end})+") is still open")}function Ff(e){const t=this;t.parser=n;function n(i){return Mf(i,{...t.data("settings"),...e,extensions:t.data("micromarkExtensions")||[],mdastExtensions:t.data("fromMarkdownExtensions")||[]})}}function Hf(e,t){const n={type:"element",tagName:"blockquote",properties:{},children:e.wrap(e.all(t),!0)};return e.patch(t,n),e.applyData(t,n)}function Jf(e,t){const n={type:"element",tagName:"br",properties:{},children:[]};return e.patch(t,n),[e.applyData(t,n),{type:"text",value:`
`}]}function Uf(e,t){const n=t.value?t.value+`
`:"",i={};t.lang&&(i.className=["language-"+t.lang]);let r={type:"element",tagName:"code",properties:i,children:[{type:"text",value:n}]};return t.meta&&(r.data={meta:t.meta}),e.patch(t,r),r=e.applyData(t,r),r={type:"element",tagName:"pre",properties:{},children:[r]},e.patch(t,r),r}function jf(e,t){const n={type:"element",tagName:"del",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function $f(e,t){const n={type:"element",tagName:"em",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function qf(e,t){const n=typeof e.options.clobberPrefix=="string"?e.options.clobberPrefix:"user-content-",i=String(t.identifier).toUpperCase(),r=qt(i.toLowerCase()),a=e.footnoteOrder.indexOf(i);let o,u=e.footnoteCounts.get(i);u===void 0?(u=0,e.footnoteOrder.push(i),o=e.footnoteOrder.length):o=a+1,u+=1,e.footnoteCounts.set(i,u);const l={type:"element",tagName:"a",properties:{href:"#"+n+"fn-"+r,id:n+"fnref-"+r+(u>1?"-"+u:""),dataFootnoteRef:!0,ariaDescribedBy:["footnote-label"]},children:[{type:"text",value:String(o)}]};e.patch(t,l);const c={type:"element",tagName:"sup",properties:{},children:[l]};return e.patch(t,c),e.applyData(t,c)}function Vf(e,t){const n={type:"element",tagName:"h"+t.depth,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function zf(e,t){if(e.options.allowDangerousHtml){const n={type:"raw",value:t.value};return e.patch(t,n),e.applyData(t,n)}}function gs(e,t){const n=t.referenceType;let i="]";if(n==="collapsed"?i+="[]":n==="full"&&(i+="["+(t.label||t.identifier)+"]"),t.type==="imageReference")return[{type:"text",value:"!["+t.alt+i}];const r=e.all(t),a=r[0];a&&a.type==="text"?a.value="["+a.value:r.unshift({type:"text",value:"["});const o=r[r.length-1];return o&&o.type==="text"?o.value+=i:r.push({type:"text",value:i}),r}function Wf(e,t){const n=String(t.identifier).toUpperCase(),i=e.definitionById.get(n);if(!i)return gs(e,t);const r={src:qt(i.url||""),alt:t.alt};i.title!==null&&i.title!==void 0&&(r.title=i.title);const a={type:"element",tagName:"img",properties:r,children:[]};return e.patch(t,a),e.applyData(t,a)}function Yf(e,t){const n={src:qt(t.url)};t.alt!==null&&t.alt!==void 0&&(n.alt=t.alt),t.title!==null&&t.title!==void 0&&(n.title=t.title);const i={type:"element",tagName:"img",properties:n,children:[]};return e.patch(t,i),e.applyData(t,i)}function Kf(e,t){const n={type:"text",value:t.value.replace(/\r?\n|\r/g," ")};e.patch(t,n);const i={type:"element",tagName:"code",properties:{},children:[n]};return e.patch(t,i),e.applyData(t,i)}function Qf(e,t){const n=String(t.identifier).toUpperCase(),i=e.definitionById.get(n);if(!i)return gs(e,t);const r={href:qt(i.url||"")};i.title!==null&&i.title!==void 0&&(r.title=i.title);const a={type:"element",tagName:"a",properties:r,children:e.all(t)};return e.patch(t,a),e.applyData(t,a)}function Xf(e,t){const n={href:qt(t.url)};t.title!==null&&t.title!==void 0&&(n.title=t.title);const i={type:"element",tagName:"a",properties:n,children:e.all(t)};return e.patch(t,i),e.applyData(t,i)}function Zf(e,t,n){const i=e.all(t),r=n?em(n):ys(t),a={},o=[];if(typeof t.checked=="boolean"){const p=i[0];let d;p&&p.type==="element"&&p.tagName==="p"?d=p:(d={type:"element",tagName:"p",properties:{},children:[]},i.unshift(d)),d.children.length>0&&d.children.unshift({type:"text",value:" "}),d.children.unshift({type:"element",tagName:"input",properties:{type:"checkbox",checked:t.checked,disabled:!0},children:[]}),a.className=["task-list-item"]}let u=-1;for(;++u<i.length;){const p=i[u];(r||u!==0||p.type!=="element"||p.tagName!=="p")&&o.push({type:"text",value:`
`}),p.type==="element"&&p.tagName==="p"&&!r?o.push(...p.children):o.push(p)}const l=i[i.length-1];l&&(r||l.type!=="element"||l.tagName!=="p")&&o.push({type:"text",value:`
`});const c={type:"element",tagName:"li",properties:a,children:o};return e.patch(t,c),e.applyData(t,c)}function em(e){let t=!1;if(e.type==="list"){t=e.spread||!1;const n=e.children;let i=-1;for(;!t&&++i<n.length;)t=ys(n[i])}return t}function ys(e){const t=e.spread;return t??e.children.length>1}function tm(e,t){const n={},i=e.all(t);let r=-1;for(typeof t.start=="number"&&t.start!==1&&(n.start=t.start);++r<i.length;){const o=i[r];if(o.type==="element"&&o.tagName==="li"&&o.properties&&Array.isArray(o.properties.className)&&o.properties.className.includes("task-list-item")){n.className=["contains-task-list"];break}}const a={type:"element",tagName:t.ordered?"ol":"ul",properties:n,children:e.wrap(i,!0)};return e.patch(t,a),e.applyData(t,a)}function nm(e,t){const n={type:"element",tagName:"p",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function im(e,t){const n={type:"root",children:e.wrap(e.all(t))};return e.patch(t,n),e.applyData(t,n)}function rm(e,t){const n={type:"element",tagName:"strong",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function am(e,t){const n=e.all(t),i=n.shift(),r=[];if(i){const o={type:"element",tagName:"thead",properties:{},children:e.wrap([i],!0)};e.patch(t.children[0],o),r.push(o)}if(n.length>0){const o={type:"element",tagName:"tbody",properties:{},children:e.wrap(n,!0)},u=ot(t.children[1]),l=si(t.children[t.children.length-1]);u&&l&&(o.position={start:u,end:l}),r.push(o)}const a={type:"element",tagName:"table",properties:{},children:e.wrap(r,!0)};return e.patch(t,a),e.applyData(t,a)}function om(e,t,n){const i=n?n.children:void 0,a=(i?i.indexOf(t):1)===0?"th":"td",o=n&&n.type==="table"?n.align:void 0,u=o?o.length:t.children.length;let l=-1;const c=[];for(;++l<u;){const d=t.children[l],I={},f=o?o[l]:void 0;f&&(I.align=f);let A={type:"element",tagName:a,properties:I,children:[]};d&&(A.children=e.all(d),e.patch(d,A),A=e.applyData(d,A)),c.push(A)}const p={type:"element",tagName:"tr",properties:{},children:e.wrap(c,!0)};return e.patch(t,p),e.applyData(t,p)}function sm(e,t){const n={type:"element",tagName:"td",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}const Oa=9,_a=32;function um(e){const t=String(e),n=/\r?\n|\r/g;let i=n.exec(t),r=0;const a=[];for(;i;)a.push(xa(t.slice(r,i.index),r>0,!0),i[0]),r=i.index+i[0].length,i=n.exec(t);return a.push(xa(t.slice(r),r>0,!1)),a.join("")}function xa(e,t,n){let i=0,r=e.length;if(t){let a=e.codePointAt(i);for(;a===Oa||a===_a;)i++,a=e.codePointAt(i)}if(n){let a=e.codePointAt(r-1);for(;a===Oa||a===_a;)r--,a=e.codePointAt(r-1)}return r>i?e.slice(i,r):""}function lm(e,t){const n={type:"text",value:um(String(t.value))};return e.patch(t,n),e.applyData(t,n)}function cm(e,t){const n={type:"element",tagName:"hr",properties:{},children:[]};return e.patch(t,n),e.applyData(t,n)}const pm={blockquote:Hf,break:Jf,code:Uf,delete:jf,emphasis:$f,footnoteReference:qf,heading:Vf,html:zf,imageReference:Wf,image:Yf,inlineCode:Kf,linkReference:Qf,link:Xf,listItem:Zf,list:tm,paragraph:nm,root:im,strong:rm,table:am,tableCell:sm,tableRow:om,text:lm,thematicBreak:cm,toml:Rn,yaml:Rn,definition:Rn,footnoteDefinition:Rn};function Rn(){}const bs=-1,li=0,un=1,zn=2,yr=3,br=4,Sr=5,Ar=6,Ss=7,As=8,Na=typeof self=="object"?self:globalThis,hm=(e,t)=>{const n=(r,a)=>(e.set(a,r),r),i=r=>{if(e.has(r))return e.get(r);const[a,o]=t[r];switch(a){case li:case bs:return n(o,r);case un:{const u=n([],r);for(const l of o)u.push(i(l));return u}case zn:{const u=n({},r);for(const[l,c]of o)u[i(l)]=i(c);return u}case yr:return n(new Date(o),r);case br:{const{source:u,flags:l}=o;return n(new RegExp(u,l),r)}case Sr:{const u=n(new Map,r);for(const[l,c]of o)u.set(i(l),i(c));return u}case Ar:{const u=n(new Set,r);for(const l of o)u.add(i(l));return u}case Ss:{const{name:u,message:l}=o;return n(new Na[u](l),r)}case As:return n(BigInt(o),r);case"BigInt":return n(Object(BigInt(o)),r);case"ArrayBuffer":return n(new Uint8Array(o).buffer,o);case"DataView":{const{buffer:u}=new Uint8Array(o);return n(new DataView(u),o)}}return n(new Na[a](o),r)};return i},va=e=>hm(new Map,e)(0),wt="",{toString:dm}={},{keys:fm}=Object,Zt=e=>{const t=typeof e;if(t!=="object"||!e)return[li,t];const n=dm.call(e).slice(8,-1);switch(n){case"Array":return[un,wt];case"Object":return[zn,wt];case"Date":return[yr,wt];case"RegExp":return[br,wt];case"Map":return[Sr,wt];case"Set":return[Ar,wt];case"DataView":return[un,n]}return n.includes("Array")?[un,n]:n.includes("Error")?[Ss,n]:[zn,n]},Pn=([e,t])=>e===li&&(t==="function"||t==="symbol"),mm=(e,t,n,i)=>{const r=(o,u)=>{const l=i.push(o)-1;return n.set(u,l),l},a=o=>{if(n.has(o))return n.get(o);let[u,l]=Zt(o);switch(u){case li:{let p=o;switch(l){case"bigint":u=As,p=o.toString();break;case"function":case"symbol":if(e)throw new TypeError("unable to serialize "+l);p=null;break;case"undefined":return r([bs],o)}return r([u,p],o)}case un:{if(l){let I=o;return l==="DataView"?I=new Uint8Array(o.buffer):l==="ArrayBuffer"&&(I=new Uint8Array(o)),r([l,[...I]],o)}const p=[],d=r([u,p],o);for(const I of o)p.push(a(I));return d}case zn:{if(l)switch(l){case"BigInt":return r([l,o.toString()],o);case"Boolean":case"Number":case"String":return r([l,o.valueOf()],o)}if(t&&"toJSON"in o)return a(o.toJSON());const p=[],d=r([u,p],o);for(const I of fm(o))(e||!Pn(Zt(o[I])))&&p.push([a(I),a(o[I])]);return d}case yr:return r([u,o.toISOString()],o);case br:{const{source:p,flags:d}=o;return r([u,{source:p,flags:d}],o)}case Sr:{const p=[],d=r([u,p],o);for(const[I,f]of o)(e||!(Pn(Zt(I))||Pn(Zt(f))))&&p.push([a(I),a(f)]);return d}case Ar:{const p=[],d=r([u,p],o);for(const I of o)(e||!Pn(Zt(I)))&&p.push(a(I));return d}}const{message:c}=o;return r([u,{name:l,message:c}],o)};return a},Ra=(e,{json:t,lossy:n}={})=>{const i=[];return mm(!(t||n),!!t,new Map,i)(e),i},Ht=typeof structuredClone=="function"?(e,t)=>t&&("json"in t||"lossy"in t)?va(Ra(e,t)):structuredClone(e):(e,t)=>va(Ra(e,t));function Im(e,t){const n=[{type:"text",value:"↩"}];return t>1&&n.push({type:"element",tagName:"sup",properties:{},children:[{type:"text",value:String(t)}]}),n}function gm(e,t){return"Back to reference "+(e+1)+(t>1?"-"+t:"")}function ym(e){const t=typeof e.options.clobberPrefix=="string"?e.options.clobberPrefix:"user-content-",n=e.options.footnoteBackContent||Im,i=e.options.footnoteBackLabel||gm,r=e.options.footnoteLabel||"Footnotes",a=e.options.footnoteLabelTagName||"h2",o=e.options.footnoteLabelProperties||{className:["sr-only"]},u=[];let l=-1;for(;++l<e.footnoteOrder.length;){const c=e.footnoteById.get(e.footnoteOrder[l]);if(!c)continue;const p=e.all(c),d=String(c.identifier).toUpperCase(),I=qt(d.toLowerCase());let f=0;const A=[],_=e.footnoteCounts.get(d);for(;_!==void 0&&++f<=_;){A.length>0&&A.push({type:"text",value:" "});let V=typeof n=="string"?n:n(l,f);typeof V=="string"&&(V={type:"text",value:V}),A.push({type:"element",tagName:"a",properties:{href:"#"+t+"fnref-"+I+(f>1?"-"+f:""),dataFootnoteBackref:"",ariaLabel:typeof i=="string"?i:i(l,f),className:["data-footnote-backref"]},children:Array.isArray(V)?V:[V]})}const M=p[p.length-1];if(M&&M.type==="element"&&M.tagName==="p"){const V=M.children[M.children.length-1];V&&V.type==="text"?V.value+=" ":M.children.push({type:"text",value:" "}),M.children.push(...A)}else p.push(...A);const x={type:"element",tagName:"li",properties:{id:t+"fn-"+I},children:e.wrap(p,!0)};e.patch(c,x),u.push(x)}if(u.length!==0)return{type:"element",tagName:"section",properties:{dataFootnotes:!0,className:["footnotes"]},children:[{type:"element",tagName:a,properties:{...Ht(o),id:"footnote-label"},children:[{type:"text",value:r}]},{type:"text",value:`
`},{type:"element",tagName:"ol",properties:{},children:e.wrap(u,!0)},{type:"text",value:`
`}]}}const Es=function(e){if(e==null)return Em;if(typeof e=="function")return ci(e);if(typeof e=="object")return Array.isArray(e)?bm(e):Sm(e);if(typeof e=="string")return Am(e);throw new Error("Expected function, string, or object as test")};function bm(e){const t=[];let n=-1;for(;++n<e.length;)t[n]=Es(e[n]);return ci(i);function i(...r){let a=-1;for(;++a<t.length;)if(t[a].apply(this,r))return!0;return!1}}function Sm(e){const t=e;return ci(n);function n(i){const r=i;let a;for(a in e)if(r[a]!==t[a])return!1;return!0}}function Am(e){return ci(t);function t(n){return n&&n.type===e}}function ci(e){return t;function t(n,i,r){return!!(Tm(n)&&e.call(this,n,typeof i=="number"?i:void 0,r||void 0))}}function Em(){return!0}function Tm(e){return e!==null&&typeof e=="object"&&"type"in e}const Ts=[],Cm=!0,Pa=!1,km="skip";function Om(e,t,n,i){let r;typeof t=="function"&&typeof n!="function"?(i=n,n=t):r=t;const a=Es(r),o=i?-1:1;u(e,void 0,[])();function u(l,c,p){const d=l&&typeof l=="object"?l:{};if(typeof d.type=="string"){const f=typeof d.tagName=="string"?d.tagName:typeof d.name=="string"?d.name:void 0;Object.defineProperty(I,"name",{value:"node ("+(l.type+(f?"<"+f+">":""))+")"})}return I;function I(){let f=Ts,A,_,M;if((!t||a(l,c,p[p.length-1]||void 0))&&(f=_m(n(l,p)),f[0]===Pa))return f;if("children"in l&&l.children){const x=l;if(x.children&&f[0]!==km)for(_=(i?x.children.length:-1)+o,M=p.concat(x);_>-1&&_<x.children.length;){const V=x.children[_];if(A=u(V,_,M)(),A[0]===Pa)return A;_=typeof A[1]=="number"?A[1]:_+o}}return f}}}function _m(e){return Array.isArray(e)?e:typeof e=="number"?[Cm,e]:e==null?Ts:[e]}function Er(e,t,n,i){let r,a,o;typeof t=="function"&&typeof n!="function"?(a=void 0,o=t,r=n):(a=t,o=n,r=i),Om(e,a,u,r);function u(l,c){const p=c[c.length-1],d=p?p.children.indexOf(l):void 0;return o(l,d,p)}}const Ui={}.hasOwnProperty,xm={};function Nm(e,t){const n=t||xm,i=new Map,r=new Map,a=new Map,o={...pm,...n.handlers},u={all:c,applyData:Rm,definitionById:i,footnoteById:r,footnoteCounts:a,footnoteOrder:[],handlers:o,one:l,options:n,patch:vm,wrap:wm};return Er(e,function(p){if(p.type==="definition"||p.type==="footnoteDefinition"){const d=p.type==="definition"?i:r,I=String(p.identifier).toUpperCase();d.has(I)||d.set(I,p)}}),u;function l(p,d){const I=p.type,f=u.handlers[I];if(Ui.call(u.handlers,I)&&f)return f(u,p,d);if(u.options.passThrough&&u.options.passThrough.includes(I)){if("children"in p){const{children:_,...M}=p,x=Ht(M);return x.children=u.all(p),x}return Ht(p)}return(u.options.unknownHandler||Pm)(u,p,d)}function c(p){const d=[];if("children"in p){const I=p.children;let f=-1;for(;++f<I.length;){const A=u.one(I[f],p);if(A){if(f&&I[f-1].type==="break"&&(!Array.isArray(A)&&A.type==="text"&&(A.value=wa(A.value)),!Array.isArray(A)&&A.type==="element")){const _=A.children[0];_&&_.type==="text"&&(_.value=wa(_.value))}Array.isArray(A)?d.push(...A):d.push(A)}}}return d}}function vm(e,t){e.position&&(t.position=hh(e))}function Rm(e,t){let n=t;if(e&&e.data){const i=e.data.hName,r=e.data.hChildren,a=e.data.hProperties;if(typeof i=="string")if(n.type==="element")n.tagName=i;else{const o="children"in n?n.children:[n];n={type:"element",tagName:i,properties:{},children:o}}n.type==="element"&&a&&Object.assign(n.properties,Ht(a)),"children"in n&&n.children&&r!==null&&r!==void 0&&(n.children=r)}return n}function Pm(e,t){const n=t.data||{},i="value"in t&&!(Ui.call(n,"hProperties")||Ui.call(n,"hChildren"))?{type:"text",value:t.value}:{type:"element",tagName:"div",properties:{},children:e.all(t)};return e.patch(t,i),e.applyData(t,i)}function wm(e,t){const n=[];let i=-1;for(t&&n.push({type:"text",value:`
`});++i<e.length;)i&&n.push({type:"text",value:`
`}),n.push(e[i]);return t&&e.length>0&&n.push({type:"text",value:`
`}),n}function wa(e){let t=0,n=e.charCodeAt(t);for(;n===9||n===32;)t++,n=e.charCodeAt(t);return e.slice(t)}function Da(e,t){const n=Nm(e,t),i=n.one(e,void 0),r=ym(n),a=Array.isArray(i)?{type:"root",children:i}:i||{type:"root",children:[]};return r&&a.children.push({type:"text",value:`
`},r),a}function Dm(e,t){return e&&"run"in e?async function(n,i){const r=Da(n,{file:i,...t});await e.run(r,i)}:function(n,i){return Da(n,{file:i,...e||t})}}function La(e){if(e)throw e}var Jn=Object.prototype.hasOwnProperty,Cs=Object.prototype.toString,Ma=Object.defineProperty,Ba=Object.getOwnPropertyDescriptor,Ga=function(t){return typeof Array.isArray=="function"?Array.isArray(t):Cs.call(t)==="[object Array]"},Fa=function(t){if(!t||Cs.call(t)!=="[object Object]")return!1;var n=Jn.call(t,"constructor"),i=t.constructor&&t.constructor.prototype&&Jn.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!n&&!i)return!1;var r;for(r in t);return typeof r>"u"||Jn.call(t,r)},Ha=function(t,n){Ma&&n.name==="__proto__"?Ma(t,n.name,{enumerable:!0,configurable:!0,value:n.newValue,writable:!0}):t[n.name]=n.newValue},Ja=function(t,n){if(n==="__proto__")if(Jn.call(t,n)){if(Ba)return Ba(t,n).value}else return;return t[n]},Lm=function e(){var t,n,i,r,a,o,u=arguments[0],l=1,c=arguments.length,p=!1;for(typeof u=="boolean"&&(p=u,u=arguments[1]||{},l=2),(u==null||typeof u!="object"&&typeof u!="function")&&(u={});l<c;++l)if(t=arguments[l],t!=null)for(n in t)i=Ja(u,n),r=Ja(t,n),u!==r&&(p&&r&&(Fa(r)||(a=Ga(r)))?(a?(a=!1,o=i&&Ga(i)?i:[]):o=i&&Fa(i)?i:{},Ha(u,{name:n,newValue:e(p,o,r)})):typeof r<"u"&&Ha(u,{name:n,newValue:r}));return u};const Ei=Ao(Lm);function ji(e){if(typeof e!="object"||e===null)return!1;const t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}function Mm(){const e=[],t={run:n,use:i};return t;function n(...r){let a=-1;const o=r.pop();if(typeof o!="function")throw new TypeError("Expected function as last argument, not "+o);u(null,...r);function u(l,...c){const p=e[++a];let d=-1;if(l){o(l);return}for(;++d<r.length;)(c[d]===null||c[d]===void 0)&&(c[d]=r[d]);r=c,p?Bm(p,u)(...c):o(null,...c)}}function i(r){if(typeof r!="function")throw new TypeError("Expected `middelware` to be a function, not "+r);return e.push(r),t}}function Bm(e,t){let n;return i;function i(...o){const u=e.length>o.length;let l;u&&o.push(r);try{l=e.apply(this,o)}catch(c){const p=c;if(u&&n)throw p;return r(p)}u||(l&&l.then&&typeof l.then=="function"?l.then(a,r):l instanceof Error?r(l):a(l))}function r(o,...u){n||(n=!0,t(o,...u))}function a(o){r(null,o)}}const Ze={basename:Gm,dirname:Fm,extname:Hm,join:Jm,sep:"/"};function Gm(e,t){if(t!==void 0&&typeof t!="string")throw new TypeError('"ext" argument must be a string');Tn(e);let n=0,i=-1,r=e.length,a;if(t===void 0||t.length===0||t.length>e.length){for(;r--;)if(e.codePointAt(r)===47){if(a){n=r+1;break}}else i<0&&(a=!0,i=r+1);return i<0?"":e.slice(n,i)}if(t===e)return"";let o=-1,u=t.length-1;for(;r--;)if(e.codePointAt(r)===47){if(a){n=r+1;break}}else o<0&&(a=!0,o=r+1),u>-1&&(e.codePointAt(r)===t.codePointAt(u--)?u<0&&(i=r):(u=-1,i=o));return n===i?i=o:i<0&&(i=e.length),e.slice(n,i)}function Fm(e){if(Tn(e),e.length===0)return".";let t=-1,n=e.length,i;for(;--n;)if(e.codePointAt(n)===47){if(i){t=n;break}}else i||(i=!0);return t<0?e.codePointAt(0)===47?"/":".":t===1&&e.codePointAt(0)===47?"//":e.slice(0,t)}function Hm(e){Tn(e);let t=e.length,n=-1,i=0,r=-1,a=0,o;for(;t--;){const u=e.codePointAt(t);if(u===47){if(o){i=t+1;break}continue}n<0&&(o=!0,n=t+1),u===46?r<0?r=t:a!==1&&(a=1):r>-1&&(a=-1)}return r<0||n<0||a===0||a===1&&r===n-1&&r===i+1?"":e.slice(r,n)}function Jm(...e){let t=-1,n;for(;++t<e.length;)Tn(e[t]),e[t]&&(n=n===void 0?e[t]:n+"/"+e[t]);return n===void 0?".":Um(n)}function Um(e){Tn(e);const t=e.codePointAt(0)===47;let n=jm(e,!t);return n.length===0&&!t&&(n="."),n.length>0&&e.codePointAt(e.length-1)===47&&(n+="/"),t?"/"+n:n}function jm(e,t){let n="",i=0,r=-1,a=0,o=-1,u,l;for(;++o<=e.length;){if(o<e.length)u=e.codePointAt(o);else{if(u===47)break;u=47}if(u===47){if(!(r===o-1||a===1))if(r!==o-1&&a===2){if(n.length<2||i!==2||n.codePointAt(n.length-1)!==46||n.codePointAt(n.length-2)!==46){if(n.length>2){if(l=n.lastIndexOf("/"),l!==n.length-1){l<0?(n="",i=0):(n=n.slice(0,l),i=n.length-1-n.lastIndexOf("/")),r=o,a=0;continue}}else if(n.length>0){n="",i=0,r=o,a=0;continue}}t&&(n=n.length>0?n+"/..":"..",i=2)}else n.length>0?n+="/"+e.slice(r+1,o):n=e.slice(r+1,o),i=o-r-1;r=o,a=0}else u===46&&a>-1?a++:a=-1}return n}function Tn(e){if(typeof e!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}const $m={cwd:qm};function qm(){return"/"}function $i(e){return!!(e!==null&&typeof e=="object"&&"href"in e&&e.href&&"protocol"in e&&e.protocol&&e.auth===void 0)}function Vm(e){if(typeof e=="string")e=new URL(e);else if(!$i(e)){const t=new TypeError('The "path" argument must be of type string or an instance of URL. Received `'+e+"`");throw t.code="ERR_INVALID_ARG_TYPE",t}if(e.protocol!=="file:"){const t=new TypeError("The URL must be of scheme file");throw t.code="ERR_INVALID_URL_SCHEME",t}return zm(e)}function zm(e){if(e.hostname!==""){const i=new TypeError('File URL host must be "localhost" or empty on darwin');throw i.code="ERR_INVALID_FILE_URL_HOST",i}const t=e.pathname;let n=-1;for(;++n<t.length;)if(t.codePointAt(n)===37&&t.codePointAt(n+1)===50){const i=t.codePointAt(n+2);if(i===70||i===102){const r=new TypeError("File URL path must not include encoded / characters");throw r.code="ERR_INVALID_FILE_URL_PATH",r}}return decodeURIComponent(t)}const Ti=["history","path","basename","stem","extname","dirname"];class ks{constructor(t){let n;t?$i(t)?n={path:t}:typeof t=="string"||Wm(t)?n={value:t}:n=t:n={},this.cwd="cwd"in n?"":$m.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let i=-1;for(;++i<Ti.length;){const a=Ti[i];a in n&&n[a]!==void 0&&n[a]!==null&&(this[a]=a==="history"?[...n[a]]:n[a])}let r;for(r in n)Ti.includes(r)||(this[r]=n[r])}get basename(){return typeof this.path=="string"?Ze.basename(this.path):void 0}set basename(t){ki(t,"basename"),Ci(t,"basename"),this.path=Ze.join(this.dirname||"",t)}get dirname(){return typeof this.path=="string"?Ze.dirname(this.path):void 0}set dirname(t){Ua(this.basename,"dirname"),this.path=Ze.join(t||"",this.basename)}get extname(){return typeof this.path=="string"?Ze.extname(this.path):void 0}set extname(t){if(Ci(t,"extname"),Ua(this.dirname,"extname"),t){if(t.codePointAt(0)!==46)throw new Error("`extname` must start with `.`");if(t.includes(".",1))throw new Error("`extname` cannot contain multiple dots")}this.path=Ze.join(this.dirname,this.stem+(t||""))}get path(){return this.history[this.history.length-1]}set path(t){$i(t)&&(t=Vm(t)),ki(t,"path"),this.path!==t&&this.history.push(t)}get stem(){return typeof this.path=="string"?Ze.basename(this.path,this.extname):void 0}set stem(t){ki(t,"stem"),Ci(t,"stem"),this.path=Ze.join(this.dirname||"",t+(this.extname||""))}fail(t,n,i){const r=this.message(t,n,i);throw r.fatal=!0,r}info(t,n,i){const r=this.message(t,n,i);return r.fatal=void 0,r}message(t,n,i){const r=new Re(t,n,i);return this.path&&(r.name=this.path+":"+r.name,r.file=this.path),r.fatal=!1,this.messages.push(r),r}toString(t){return this.value===void 0?"":typeof this.value=="string"?this.value:new TextDecoder(t||void 0).decode(this.value)}}function Ci(e,t){if(e&&e.includes(Ze.sep))throw new Error("`"+t+"` cannot be a path: did not expect `"+Ze.sep+"`")}function ki(e,t){if(!e)throw new Error("`"+t+"` cannot be empty")}function Ua(e,t){if(!e)throw new Error("Setting `"+t+"` requires `path` to be set too")}function Wm(e){return!!(e&&typeof e=="object"&&"byteLength"in e&&"byteOffset"in e)}const Ym=function(e){const i=this.constructor.prototype,r=i[e],a=function(){return r.apply(a,arguments)};return Object.setPrototypeOf(a,i),a},Km={}.hasOwnProperty;class Tr extends Ym{constructor(){super("copy"),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=Mm()}copy(){const t=new Tr;let n=-1;for(;++n<this.attachers.length;){const i=this.attachers[n];t.use(...i)}return t.data(Ei(!0,{},this.namespace)),t}data(t,n){return typeof t=="string"?arguments.length===2?(xi("data",this.frozen),this.namespace[t]=n,this):Km.call(this.namespace,t)&&this.namespace[t]||void 0:t?(xi("data",this.frozen),this.namespace=t,this):this.namespace}freeze(){if(this.frozen)return this;const t=this;for(;++this.freezeIndex<this.attachers.length;){const[n,...i]=this.attachers[this.freezeIndex];if(i[0]===!1)continue;i[0]===!0&&(i[0]=void 0);const r=n.call(t,...i);typeof r=="function"&&this.transformers.use(r)}return this.frozen=!0,this.freezeIndex=Number.POSITIVE_INFINITY,this}parse(t){this.freeze();const n=wn(t),i=this.parser||this.Parser;return Oi("parse",i),i(String(n),n)}process(t,n){const i=this;return this.freeze(),Oi("process",this.parser||this.Parser),_i("process",this.compiler||this.Compiler),n?r(void 0,n):new Promise(r);function r(a,o){const u=wn(t),l=i.parse(u);i.run(l,u,function(p,d,I){if(p||!d||!I)return c(p);const f=d,A=i.stringify(f,I);Zm(A)?I.value=A:I.result=A,c(p,I)});function c(p,d){p||!d?o(p):a?a(d):n(void 0,d)}}}processSync(t){let n=!1,i;return this.freeze(),Oi("processSync",this.parser||this.Parser),_i("processSync",this.compiler||this.Compiler),this.process(t,r),$a("processSync","process",n),i;function r(a,o){n=!0,La(a),i=o}}run(t,n,i){ja(t),this.freeze();const r=this.transformers;return!i&&typeof n=="function"&&(i=n,n=void 0),i?a(void 0,i):new Promise(a);function a(o,u){const l=wn(n);r.run(t,l,c);function c(p,d,I){const f=d||t;p?u(p):o?o(f):i(void 0,f,I)}}}runSync(t,n){let i=!1,r;return this.run(t,n,a),$a("runSync","run",i),r;function a(o,u){La(o),r=u,i=!0}}stringify(t,n){this.freeze();const i=wn(n),r=this.compiler||this.Compiler;return _i("stringify",r),ja(t),r(t,i)}use(t,...n){const i=this.attachers,r=this.namespace;if(xi("use",this.frozen),t!=null)if(typeof t=="function")l(t,n);else if(typeof t=="object")Array.isArray(t)?u(t):o(t);else throw new TypeError("Expected usable value, not `"+t+"`");return this;function a(c){if(typeof c=="function")l(c,[]);else if(typeof c=="object")if(Array.isArray(c)){const[p,...d]=c;l(p,d)}else o(c);else throw new TypeError("Expected usable value, not `"+c+"`")}function o(c){if(!("plugins"in c)&&!("settings"in c))throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");u(c.plugins),c.settings&&(r.settings=Ei(!0,r.settings,c.settings))}function u(c){let p=-1;if(c!=null)if(Array.isArray(c))for(;++p<c.length;){const d=c[p];a(d)}else throw new TypeError("Expected a list of plugins, not `"+c+"`")}function l(c,p){let d=-1,I=-1;for(;++d<i.length;)if(i[d][0]===c){I=d;break}if(I===-1)i.push([c,...p]);else if(p.length>0){let[f,...A]=p;const _=i[I][1];ji(_)&&ji(f)&&(f=Ei(!0,_,f)),i[I]=[c,f,...A]}}}}const Qm=new Tr().freeze();function Oi(e,t){if(typeof t!="function")throw new TypeError("Cannot `"+e+"` without `parser`")}function _i(e,t){if(typeof t!="function")throw new TypeError("Cannot `"+e+"` without `compiler`")}function xi(e,t){if(t)throw new Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function ja(e){if(!ji(e)||typeof e.type!="string")throw new TypeError("Expected node, got `"+e+"`")}function $a(e,t,n){if(!n)throw new Error("`"+e+"` finished async. Use `"+t+"` instead")}function wn(e){return Xm(e)?e:new ks(e)}function Xm(e){return!!(e&&typeof e=="object"&&"message"in e&&"messages"in e)}function Zm(e){return typeof e=="string"||e0(e)}function e0(e){return!!(e&&typeof e=="object"&&"byteLength"in e&&"byteOffset"in e)}const t0="https://github.com/remarkjs/react-markdown/blob/main/changelog.md",qa=[],Va={allowDangerousHtml:!0},n0=/^(https?|ircs?|mailto|xmpp)$/i,i0=[{from:"astPlugins",id:"remove-buggy-html-in-markdown-parser"},{from:"allowDangerousHtml",id:"remove-buggy-html-in-markdown-parser"},{from:"allowNode",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"allowElement"},{from:"allowedTypes",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"allowedElements"},{from:"disallowedTypes",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"disallowedElements"},{from:"escapeHtml",id:"remove-buggy-html-in-markdown-parser"},{from:"includeElementIndex",id:"#remove-includeelementindex"},{from:"includeNodeIndex",id:"change-includenodeindex-to-includeelementindex"},{from:"linkTarget",id:"remove-linktarget"},{from:"plugins",id:"change-plugins-to-remarkplugins",to:"remarkPlugins"},{from:"rawSourcePos",id:"#remove-rawsourcepos"},{from:"renderers",id:"change-renderers-to-components",to:"components"},{from:"source",id:"change-source-to-children",to:"children"},{from:"sourcePos",id:"#remove-sourcepos"},{from:"transformImageUri",id:"#add-urltransform",to:"urlTransform"},{from:"transformLinkUri",id:"#add-urltransform",to:"urlTransform"}];function r0(e){const t=a0(e),n=o0(e);return s0(t.runSync(t.parse(n),n),e)}function a0(e){const t=e.rehypePlugins||qa,n=e.remarkPlugins||qa,i=e.remarkRehypeOptions?{...e.remarkRehypeOptions,...Va}:Va;return Qm().use(Ff).use(n).use(Dm,i).use(t)}function o0(e){const t=e.children||"",n=new ks;return typeof t=="string"&&(n.value=t),n}function s0(e,t){const n=t.allowedElements,i=t.allowElement,r=t.components,a=t.disallowedElements,o=t.skipHtml,u=t.unwrapDisallowed,l=t.urlTransform||u0;for(const p of i0)Object.hasOwn(t,p.from)&&(""+p.from+(p.to?"use `"+p.to+"` instead":"remove it")+t0+p.id,void 0);return t.className&&(e={type:"element",tagName:"div",properties:{className:t.className},children:e.type==="root"?e.children:[e]}),Er(e,c),gh(e,{Fragment:E.Fragment,components:r,ignoreInvalidStyle:!0,jsx:E.jsx,jsxs:E.jsxs,passKeys:!0,passNode:!0});function c(p,d,I){if(p.type==="raw"&&I&&typeof d=="number")return o?I.children.splice(d,1):I.children[d]={type:"text",value:p.value},d;if(p.type==="element"){let f;for(f in bi)if(Object.hasOwn(bi,f)&&Object.hasOwn(p.properties,f)){const A=p.properties[f],_=bi[f];(_===null||_.includes(p.tagName))&&(p.properties[f]=l(String(A||""),f,p))}}if(p.type==="element"){let f=n?!n.includes(p.tagName):a?a.includes(p.tagName):!1;if(!f&&i&&typeof d=="number"&&(f=!i(p,d,I)),f&&I&&typeof d=="number")return u&&p.children?I.children.splice(d,1,...p.children):I.children.splice(d,1),d}}}function u0(e){const t=e.indexOf(":"),n=e.indexOf("?"),i=e.indexOf("#"),r=e.indexOf("/");return t===-1||r!==-1&&t>r||n!==-1&&t>n||i!==-1&&t>i||n0.test(e.slice(0,t))?e:""}const za=/[#.]/g;function l0(e,t){const n=e||"",i={};let r=0,a,o;for(;r<n.length;){za.lastIndex=r;const u=za.exec(n),l=n.slice(r,u?u.index:n.length);l&&(a?a==="#"?i.id=l:Array.isArray(i.className)?i.className.push(l):i.className=[l]:o=l,r+=l.length),u&&(a=u[0],r++)}return{type:"element",tagName:o||t||"div",properties:i,children:[]}}function Os(e,t,n){const i=n?d0(n):void 0;function r(a,o,...u){let l;if(a==null){l={type:"root",children:[]};const c=o;u.unshift(c)}else{l=l0(a,t);const c=l.tagName.toLowerCase(),p=i?i.get(c):void 0;if(l.tagName=p||c,c0(o))u.unshift(o);else for(const[d,I]of Object.entries(o))p0(e,l.properties,d,I)}for(const c of u)qi(l.children,c);return l.type==="element"&&l.tagName==="template"&&(l.content={type:"root",children:l.children},l.children=[]),l}return r}function c0(e){if(e===null||typeof e!="object"||Array.isArray(e))return!0;if(typeof e.type!="string")return!1;const t=e,n=Object.keys(e);for(const i of n){const r=t[i];if(r&&typeof r=="object"){if(!Array.isArray(r))return!0;const a=r;for(const o of a)if(typeof o!="number"&&typeof o!="string")return!0}}return!!("children"in e&&Array.isArray(e.children))}function p0(e,t,n,i){const r=ai(e,n);let a;if(i!=null){if(typeof i=="number"){if(Number.isNaN(i))return;a=i}else typeof i=="boolean"?a=i:typeof i=="string"?r.spaceSeparated?a=oa(i):r.commaSeparated?a=ta(i):r.commaOrSpaceSeparated?a=oa(ta(i).join(" ")):a=Wa(r,r.property,i):Array.isArray(i)?a=[...i]:a=r.property==="style"?h0(i):String(i);if(Array.isArray(a)){const o=[];for(const u of a)o.push(Wa(r,r.property,u));a=o}r.property==="className"&&Array.isArray(t.className)&&(a=t.className.concat(a)),t[r.property]=a}}function qi(e,t){if(t!=null)if(typeof t=="number"||typeof t=="string")e.push({type:"text",value:String(t)});else if(Array.isArray(t))for(const n of t)qi(e,n);else if(typeof t=="object"&&"type"in t)t.type==="root"?qi(e,t.children):e.push(t);else throw new Error("Expected node, nodes, or string, got `"+t+"`")}function Wa(e,t,n){if(typeof n=="string"){if(e.number&&n&&!Number.isNaN(Number(n)))return Number(n);if((e.boolean||e.overloadedBoolean)&&(n===""||In(n)===In(t)))return!0}return n}function h0(e){const t=[];for(const[n,i]of Object.entries(e))t.push([n,i].join(": "));return t.join("; ")}function d0(e){const t=new Map;for(const n of e)t.set(n.toLowerCase(),n);return t}const f0=["altGlyph","altGlyphDef","altGlyphItem","animateColor","animateMotion","animateTransform","clipPath","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","foreignObject","glyphRef","linearGradient","radialGradient","solidColor","textArea","textPath"],m0=Os(En,"div"),I0=Os(gt,"g",f0);function g0(e){const t=String(e),n=[];return{toOffset:r,toPoint:i};function i(a){if(typeof a=="number"&&a>-1&&a<=t.length){let o=0;for(;;){let u=n[o];if(u===void 0){const l=Ya(t,n[o-1]);u=l===-1?t.length+1:l+1,n[o]=u}if(u>a)return{line:o+1,column:a-(o>0?n[o-1]:0)+1,offset:a};o++}}}function r(a){if(a&&typeof a.line=="number"&&typeof a.column=="number"&&!Number.isNaN(a.line)&&!Number.isNaN(a.column)){for(;n.length<a.line;){const u=n[n.length-1],l=Ya(t,u),c=l===-1?t.length+1:l+1;if(u===c)break;n.push(c)}const o=(a.line>1?n[a.line-2]:0)+a.column-1;if(o<n[a.line-1])return o}}}function Ya(e,t){const n=e.indexOf("\r",t),i=e.indexOf(`
`,t);return i===-1?n:n===-1||n+1===i?i:n<i?n:i}const Tt={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"},_s={}.hasOwnProperty,y0=Object.prototype;function b0(e,t){const n=t||{};return Cr({file:n.file||void 0,location:!1,schema:n.space==="svg"?gt:En,verbose:n.verbose||!1},e)}function Cr(e,t){let n;switch(t.nodeName){case"#comment":{const i=t;return n={type:"comment",value:i.data},Un(e,i,n),n}case"#document":case"#document-fragment":{const i=t,r="mode"in i?i.mode==="quirks"||i.mode==="limited-quirks":!1;if(n={type:"root",children:xs(e,t.childNodes),data:{quirksMode:r}},e.file&&e.location){const a=String(e.file),o=g0(a),u=o.toPoint(0),l=o.toPoint(a.length);n.position={start:u,end:l}}return n}case"#documentType":{const i=t;return n={type:"doctype"},Un(e,i,n),n}case"#text":{const i=t;return n={type:"text",value:i.value},Un(e,i,n),n}default:return n=S0(e,t),n}}function xs(e,t){let n=-1;const i=[];for(;++n<t.length;){const r=Cr(e,t[n]);i.push(r)}return i}function S0(e,t){const n=e.schema;e.schema=t.namespaceURI===Tt.svg?gt:En;let i=-1;const r={};for(;++i<t.attrs.length;){const u=t.attrs[i],l=(u.prefix?u.prefix+":":"")+u.name;_s.call(y0,l)||(r[l]=u.value)}const o=(e.schema.space==="svg"?I0:m0)(t.tagName,r,xs(e,t.childNodes));if(Un(e,t,o),o.tagName==="template"){const u=t,l=u.sourceCodeLocation,c=l&&l.startTag&&Lt(l.startTag),p=l&&l.endTag&&Lt(l.endTag),d=Cr(e,u.content);c&&p&&e.file&&(d.position={start:c.end,end:p.start}),o.content=d}return e.schema=n,o}function Un(e,t,n){if("sourceCodeLocation"in t&&t.sourceCodeLocation&&e.file){const i=A0(e,n,t.sourceCodeLocation);i&&(e.location=!0,n.position=i)}}function A0(e,t,n){const i=Lt(n);if(t.type==="element"){const r=t.children[t.children.length-1];if(i&&!n.endTag&&r&&r.position&&r.position.end&&(i.end=Object.assign({},r.position.end)),e.verbose){const a={};let o;if(n.attrs)for(o in n.attrs)_s.call(n.attrs,o)&&(a[ai(e.schema,o).property]=Lt(n.attrs[o]));n.startTag;const u=Lt(n.startTag),l=n.endTag?Lt(n.endTag):void 0,c={opening:u};l&&(c.closing=l),c.properties=a,t.data={position:c}}}return i}function Lt(e){const t=Ka({line:e.startLine,column:e.startCol,offset:e.startOffset}),n=Ka({line:e.endLine,column:e.endCol,offset:e.endOffset});return t||n?{start:t,end:n}:void 0}function Ka(e){return e.line&&e.column?e:void 0}class Cn{constructor(t,n,i){this.property=t,this.normal=n,i&&(this.space=i)}}Cn.prototype.property={};Cn.prototype.normal={};Cn.prototype.space=null;function Ns(e,t){const n={},i={};let r=-1;for(;++r<e.length;)Object.assign(n,e[r].property),Object.assign(i,e[r].normal);return new Cn(n,i,t)}function Vi(e){return e.toLowerCase()}class We{constructor(t,n){this.property=t,this.attribute=n}}We.prototype.space=null;We.prototype.boolean=!1;We.prototype.booleanish=!1;We.prototype.overloadedBoolean=!1;We.prototype.number=!1;We.prototype.commaSeparated=!1;We.prototype.spaceSeparated=!1;We.prototype.commaOrSpaceSeparated=!1;We.prototype.mustUseProperty=!1;We.prototype.defined=!1;let E0=0;const re=Nt(),be=Nt(),vs=Nt(),G=Nt(),pe=Nt(),Gt=Nt(),Ue=Nt();function Nt(){return 2**++E0}const zi=Object.freeze(Object.defineProperty({__proto__:null,boolean:re,booleanish:be,commaOrSpaceSeparated:Ue,commaSeparated:Gt,number:G,overloadedBoolean:vs,spaceSeparated:pe},Symbol.toStringTag,{value:"Module"})),Ni=Object.keys(zi);class kr extends We{constructor(t,n,i,r){let a=-1;if(super(t,n),Qa(this,"space",r),typeof i=="number")for(;++a<Ni.length;){const o=Ni[a];Qa(this,Ni[a],(i&zi[o])===zi[o])}}}kr.prototype.defined=!0;function Qa(e,t,n){n&&(e[t]=n)}const T0={}.hasOwnProperty;function Vt(e){const t={},n={};let i;for(i in e.properties)if(T0.call(e.properties,i)){const r=e.properties[i],a=new kr(i,e.transform(e.attributes||{},i),r,e.space);e.mustUseProperty&&e.mustUseProperty.includes(i)&&(a.mustUseProperty=!0),t[i]=a,n[Vi(i)]=i,n[Vi(a.attribute)]=i}return new Cn(t,n,e.space)}const Rs=Vt({space:"xlink",transform(e,t){return"xlink:"+t.slice(5).toLowerCase()},properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null}}),Ps=Vt({space:"xml",transform(e,t){return"xml:"+t.slice(3).toLowerCase()},properties:{xmlLang:null,xmlBase:null,xmlSpace:null}});function ws(e,t){return t in e?e[t]:t}function Ds(e,t){return ws(e,t.toLowerCase())}const Ls=Vt({space:"xmlns",attributes:{xmlnsxlink:"xmlns:xlink"},transform:Ds,properties:{xmlns:null,xmlnsXLink:null}}),Ms=Vt({transform(e,t){return t==="role"?t:"aria-"+t.slice(4).toLowerCase()},properties:{ariaActiveDescendant:null,ariaAtomic:be,ariaAutoComplete:null,ariaBusy:be,ariaChecked:be,ariaColCount:G,ariaColIndex:G,ariaColSpan:G,ariaControls:pe,ariaCurrent:null,ariaDescribedBy:pe,ariaDetails:null,ariaDisabled:be,ariaDropEffect:pe,ariaErrorMessage:null,ariaExpanded:be,ariaFlowTo:pe,ariaGrabbed:be,ariaHasPopup:null,ariaHidden:be,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:pe,ariaLevel:G,ariaLive:null,ariaModal:be,ariaMultiLine:be,ariaMultiSelectable:be,ariaOrientation:null,ariaOwns:pe,ariaPlaceholder:null,ariaPosInSet:G,ariaPressed:be,ariaReadOnly:be,ariaRelevant:null,ariaRequired:be,ariaRoleDescription:pe,ariaRowCount:G,ariaRowIndex:G,ariaRowSpan:G,ariaSelected:be,ariaSetSize:G,ariaSort:null,ariaValueMax:G,ariaValueMin:G,ariaValueNow:G,ariaValueText:null,role:null}}),C0=Vt({space:"html",attributes:{acceptcharset:"accept-charset",classname:"class",htmlfor:"for",httpequiv:"http-equiv"},transform:Ds,mustUseProperty:["checked","multiple","muted","selected"],properties:{abbr:null,accept:Gt,acceptCharset:pe,accessKey:pe,action:null,allow:null,allowFullScreen:re,allowPaymentRequest:re,allowUserMedia:re,alt:null,as:null,async:re,autoCapitalize:null,autoComplete:pe,autoFocus:re,autoPlay:re,blocking:pe,capture:null,charSet:null,checked:re,cite:null,className:pe,cols:G,colSpan:null,content:null,contentEditable:be,controls:re,controlsList:pe,coords:G|Gt,crossOrigin:null,data:null,dateTime:null,decoding:null,default:re,defer:re,dir:null,dirName:null,disabled:re,download:vs,draggable:be,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:re,formTarget:null,headers:pe,height:G,hidden:re,high:G,href:null,hrefLang:null,htmlFor:pe,httpEquiv:pe,id:null,imageSizes:null,imageSrcSet:null,inert:re,inputMode:null,integrity:null,is:null,isMap:re,itemId:null,itemProp:pe,itemRef:pe,itemScope:re,itemType:pe,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:re,low:G,manifest:null,max:null,maxLength:G,media:null,method:null,min:null,minLength:G,multiple:re,muted:re,name:null,nonce:null,noModule:re,noValidate:re,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:re,optimum:G,pattern:null,ping:pe,placeholder:null,playsInline:re,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:re,referrerPolicy:null,rel:pe,required:re,reversed:re,rows:G,rowSpan:G,sandbox:pe,scope:null,scoped:re,seamless:re,selected:re,shadowRootClonable:re,shadowRootDelegatesFocus:re,shadowRootMode:null,shape:null,size:G,sizes:null,slot:null,span:G,spellCheck:be,src:null,srcDoc:null,srcLang:null,srcSet:null,start:G,step:null,style:null,tabIndex:G,target:null,title:null,translate:null,type:null,typeMustMatch:re,useMap:null,value:be,width:G,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:pe,axis:null,background:null,bgColor:null,border:G,borderColor:null,bottomMargin:G,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:re,declare:re,event:null,face:null,frame:null,frameBorder:null,hSpace:G,leftMargin:G,link:null,longDesc:null,lowSrc:null,marginHeight:G,marginWidth:G,noResize:re,noHref:re,noShade:re,noWrap:re,object:null,profile:null,prompt:null,rev:null,rightMargin:G,rules:null,scheme:null,scrolling:be,standby:null,summary:null,text:null,topMargin:G,valueType:null,version:null,vAlign:null,vLink:null,vSpace:G,allowTransparency:null,autoCorrect:null,autoSave:null,disablePictureInPicture:re,disableRemotePlayback:re,prefix:null,property:null,results:G,security:null,unselectable:null}}),k0=Vt({space:"svg",attributes:{accentHeight:"accent-height",alignmentBaseline:"alignment-baseline",arabicForm:"arabic-form",baselineShift:"baseline-shift",capHeight:"cap-height",className:"class",clipPath:"clip-path",clipRule:"clip-rule",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",crossOrigin:"crossorigin",dataType:"datatype",dominantBaseline:"dominant-baseline",enableBackground:"enable-background",fillOpacity:"fill-opacity",fillRule:"fill-rule",floodColor:"flood-color",floodOpacity:"flood-opacity",fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",hrefLang:"hreflang",horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",horizOriginY:"horiz-origin-y",imageRendering:"image-rendering",letterSpacing:"letter-spacing",lightingColor:"lighting-color",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",navDown:"nav-down",navDownLeft:"nav-down-left",navDownRight:"nav-down-right",navLeft:"nav-left",navNext:"nav-next",navPrev:"nav-prev",navRight:"nav-right",navUp:"nav-up",navUpLeft:"nav-up-left",navUpRight:"nav-up-right",onAbort:"onabort",onActivate:"onactivate",onAfterPrint:"onafterprint",onBeforePrint:"onbeforeprint",onBegin:"onbegin",onCancel:"oncancel",onCanPlay:"oncanplay",onCanPlayThrough:"oncanplaythrough",onChange:"onchange",onClick:"onclick",onClose:"onclose",onCopy:"oncopy",onCueChange:"oncuechange",onCut:"oncut",onDblClick:"ondblclick",onDrag:"ondrag",onDragEnd:"ondragend",onDragEnter:"ondragenter",onDragExit:"ondragexit",onDragLeave:"ondragleave",onDragOver:"ondragover",onDragStart:"ondragstart",onDrop:"ondrop",onDurationChange:"ondurationchange",onEmptied:"onemptied",onEnd:"onend",onEnded:"onended",onError:"onerror",onFocus:"onfocus",onFocusIn:"onfocusin",onFocusOut:"onfocusout",onHashChange:"onhashchange",onInput:"oninput",onInvalid:"oninvalid",onKeyDown:"onkeydown",onKeyPress:"onkeypress",onKeyUp:"onkeyup",onLoad:"onload",onLoadedData:"onloadeddata",onLoadedMetadata:"onloadedmetadata",onLoadStart:"onloadstart",onMessage:"onmessage",onMouseDown:"onmousedown",onMouseEnter:"onmouseenter",onMouseLeave:"onmouseleave",onMouseMove:"onmousemove",onMouseOut:"onmouseout",onMouseOver:"onmouseover",onMouseUp:"onmouseup",onMouseWheel:"onmousewheel",onOffline:"onoffline",onOnline:"ononline",onPageHide:"onpagehide",onPageShow:"onpageshow",onPaste:"onpaste",onPause:"onpause",onPlay:"onplay",onPlaying:"onplaying",onPopState:"onpopstate",onProgress:"onprogress",onRateChange:"onratechange",onRepeat:"onrepeat",onReset:"onreset",onResize:"onresize",onScroll:"onscroll",onSeeked:"onseeked",onSeeking:"onseeking",onSelect:"onselect",onShow:"onshow",onStalled:"onstalled",onStorage:"onstorage",onSubmit:"onsubmit",onSuspend:"onsuspend",onTimeUpdate:"ontimeupdate",onToggle:"ontoggle",onUnload:"onunload",onVolumeChange:"onvolumechange",onWaiting:"onwaiting",onZoom:"onzoom",overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pointerEvents:"pointer-events",referrerPolicy:"referrerpolicy",renderingIntent:"rendering-intent",shapeRendering:"shape-rendering",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",strokeDashArray:"stroke-dasharray",strokeDashOffset:"stroke-dashoffset",strokeLineCap:"stroke-linecap",strokeLineJoin:"stroke-linejoin",strokeMiterLimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",tabIndex:"tabindex",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",transformOrigin:"transform-origin",typeOf:"typeof",underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",vectorEffect:"vector-effect",vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",wordSpacing:"word-spacing",writingMode:"writing-mode",xHeight:"x-height",playbackOrder:"playbackorder",timelineBegin:"timelinebegin"},transform:ws,properties:{about:Ue,accentHeight:G,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:G,amplitude:G,arabicForm:null,ascent:G,attributeName:null,attributeType:null,azimuth:G,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:G,by:null,calcMode:null,capHeight:G,className:pe,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:G,diffuseConstant:G,direction:null,display:null,dur:null,divisor:G,dominantBaseline:null,download:re,dx:null,dy:null,edgeMode:null,editable:null,elevation:G,enableBackground:null,end:null,event:null,exponent:G,externalResourcesRequired:null,fill:null,fillOpacity:G,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:Gt,g2:Gt,glyphName:Gt,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:G,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:G,horizOriginX:G,horizOriginY:G,id:null,ideographic:G,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:G,k:G,k1:G,k2:G,k3:G,k4:G,kernelMatrix:Ue,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:G,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:G,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:G,overlineThickness:G,paintOrder:null,panose1:null,path:null,pathLength:G,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:pe,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:G,pointsAtY:G,pointsAtZ:G,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:Ue,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:Ue,rev:Ue,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:Ue,requiredFeatures:Ue,requiredFonts:Ue,requiredFormats:Ue,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:G,specularExponent:G,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:G,strikethroughThickness:G,string:null,stroke:null,strokeDashArray:Ue,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:G,strokeOpacity:G,strokeWidth:null,style:null,surfaceScale:G,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:Ue,tabIndex:G,tableValues:null,target:null,targetX:G,targetY:G,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:Ue,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:G,underlineThickness:G,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:G,values:null,vAlphabetic:G,vMathematical:G,vectorEffect:null,vHanging:G,vIdeographic:G,version:null,vertAdvY:G,vertOriginX:G,vertOriginY:G,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:G,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null}}),O0=/^data[-\w.:]+$/i,Xa=/-[a-z]/g,_0=/[A-Z]/g;function x0(e,t){const n=Vi(t);let i=t,r=We;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&n.slice(0,4)==="data"&&O0.test(t)){if(t.charAt(4)==="-"){const a=t.slice(5).replace(Xa,v0);i="data"+a.charAt(0).toUpperCase()+a.slice(1)}else{const a=t.slice(4);if(!Xa.test(a)){let o=a.replace(_0,N0);o.charAt(0)!=="-"&&(o="-"+o),t="data"+o}}r=kr}return new r(i,t)}function N0(e){return"-"+e.toLowerCase()}function v0(e){return e.charAt(1).toUpperCase()}const R0=Ns([Ps,Rs,Ls,Ms,C0],"html"),Bs=Ns([Ps,Rs,Ls,Ms,k0],"svg"),Za={}.hasOwnProperty;function Or(e,t){const n=t||{};function i(r,...a){let o=i.invalid;const u=i.handlers;if(r&&Za.call(r,e)){const l=String(r[e]);o=Za.call(u,l)?u[l]:i.unknown}if(o)return o.call(this,r,...a)}return i.handlers=n.handlers||{},i.invalid=n.invalid,i.unknown=n.unknown,i}const P0={},w0={}.hasOwnProperty,Gs=Or("type",{handlers:{root:L0,element:H0,text:G0,comment:F0,doctype:B0}});function D0(e,t){const i=(t||P0).space;return Gs(e,i==="svg"?Bs:R0)}function L0(e,t){const n={nodeName:"#document",mode:(e.data||{}).quirksMode?"quirks":"no-quirks",childNodes:[]};return n.childNodes=_r(e.children,n,t),zt(e,n),n}function M0(e,t){const n={nodeName:"#document-fragment",childNodes:[]};return n.childNodes=_r(e.children,n,t),zt(e,n),n}function B0(e){const t={nodeName:"#documentType",name:"html",publicId:"",systemId:"",parentNode:null};return zt(e,t),t}function G0(e){const t={nodeName:"#text",value:e.value,parentNode:null};return zt(e,t),t}function F0(e){const t={nodeName:"#comment",data:e.value,parentNode:null};return zt(e,t),t}function H0(e,t){const n=t;let i=n;e.type==="element"&&e.tagName.toLowerCase()==="svg"&&n.space==="html"&&(i=Bs);const r=[];let a;if(e.properties){for(a in e.properties)if(a!=="children"&&w0.call(e.properties,a)){const l=J0(i,a,e.properties[a]);l&&r.push(l)}}const o=i.space,u={nodeName:e.tagName,tagName:e.tagName,attrs:r,namespaceURI:Tt[o],childNodes:[],parentNode:null};return u.childNodes=_r(e.children,u,i),zt(e,u),e.tagName==="template"&&e.content&&(u.content=M0(e.content,i)),u}function J0(e,t,n){const i=x0(e,t);if(n===!1||n===null||n===void 0||typeof n=="number"&&Number.isNaN(n)||!n&&i.boolean)return;Array.isArray(n)&&(n=i.commaSeparated?ur(n):cr(n));const r={name:i.attribute,value:n===!0?"":String(n)};if(i.space&&i.space!=="html"&&i.space!=="svg"){const a=r.name.indexOf(":");a<0?r.prefix="":(r.name=r.name.slice(a+1),r.prefix=i.attribute.slice(0,a)),r.namespace=Tt[i.space]}return r}function _r(e,t,n){let i=-1;const r=[];if(e)for(;++i<e.length;){const a=Gs(e[i],n);a.parentNode=t,r.push(a)}return r}function zt(e,t){const n=e.position;n&&n.start&&n.end&&(n.start.offset,n.end.offset,t.sourceCodeLocation={startLine:n.start.line,startCol:n.start.column,startOffset:n.start.offset,endLine:n.end.line,endCol:n.end.column,endOffset:n.end.offset})}const Fs=["area","base","basefont","bgsound","br","col","command","embed","frame","hr","image","img","input","keygen","link","meta","param","source","track","wbr"],U0=new Set([65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111]),me="�";var m;(function(e){e[e.EOF=-1]="EOF",e[e.NULL=0]="NULL",e[e.TABULATION=9]="TABULATION",e[e.CARRIAGE_RETURN=13]="CARRIAGE_RETURN",e[e.LINE_FEED=10]="LINE_FEED",e[e.FORM_FEED=12]="FORM_FEED",e[e.SPACE=32]="SPACE",e[e.EXCLAMATION_MARK=33]="EXCLAMATION_MARK",e[e.QUOTATION_MARK=34]="QUOTATION_MARK",e[e.AMPERSAND=38]="AMPERSAND",e[e.APOSTROPHE=39]="APOSTROPHE",e[e.HYPHEN_MINUS=45]="HYPHEN_MINUS",e[e.SOLIDUS=47]="SOLIDUS",e[e.DIGIT_0=48]="DIGIT_0",e[e.DIGIT_9=57]="DIGIT_9",e[e.SEMICOLON=59]="SEMICOLON",e[e.LESS_THAN_SIGN=60]="LESS_THAN_SIGN",e[e.EQUALS_SIGN=61]="EQUALS_SIGN",e[e.GREATER_THAN_SIGN=62]="GREATER_THAN_SIGN",e[e.QUESTION_MARK=63]="QUESTION_MARK",e[e.LATIN_CAPITAL_A=65]="LATIN_CAPITAL_A",e[e.LATIN_CAPITAL_Z=90]="LATIN_CAPITAL_Z",e[e.RIGHT_SQUARE_BRACKET=93]="RIGHT_SQUARE_BRACKET",e[e.GRAVE_ACCENT=96]="GRAVE_ACCENT",e[e.LATIN_SMALL_A=97]="LATIN_SMALL_A",e[e.LATIN_SMALL_Z=122]="LATIN_SMALL_Z"})(m||(m={}));const De={DASH_DASH:"--",CDATA_START:"[CDATA[",DOCTYPE:"doctype",SCRIPT:"script",PUBLIC:"public",SYSTEM:"system"};function Hs(e){return e>=55296&&e<=57343}function j0(e){return e>=56320&&e<=57343}function $0(e,t){return(e-55296)*1024+9216+t}function Js(e){return e!==32&&e!==10&&e!==13&&e!==9&&e!==12&&e>=1&&e<=31||e>=127&&e<=159}function Us(e){return e>=64976&&e<=65007||U0.has(e)}var N;(function(e){e.controlCharacterInInputStream="control-character-in-input-stream",e.noncharacterInInputStream="noncharacter-in-input-stream",e.surrogateInInputStream="surrogate-in-input-stream",e.nonVoidHtmlElementStartTagWithTrailingSolidus="non-void-html-element-start-tag-with-trailing-solidus",e.endTagWithAttributes="end-tag-with-attributes",e.endTagWithTrailingSolidus="end-tag-with-trailing-solidus",e.unexpectedSolidusInTag="unexpected-solidus-in-tag",e.unexpectedNullCharacter="unexpected-null-character",e.unexpectedQuestionMarkInsteadOfTagName="unexpected-question-mark-instead-of-tag-name",e.invalidFirstCharacterOfTagName="invalid-first-character-of-tag-name",e.unexpectedEqualsSignBeforeAttributeName="unexpected-equals-sign-before-attribute-name",e.missingEndTagName="missing-end-tag-name",e.unexpectedCharacterInAttributeName="unexpected-character-in-attribute-name",e.unknownNamedCharacterReference="unknown-named-character-reference",e.missingSemicolonAfterCharacterReference="missing-semicolon-after-character-reference",e.unexpectedCharacterAfterDoctypeSystemIdentifier="unexpected-character-after-doctype-system-identifier",e.unexpectedCharacterInUnquotedAttributeValue="unexpected-character-in-unquoted-attribute-value",e.eofBeforeTagName="eof-before-tag-name",e.eofInTag="eof-in-tag",e.missingAttributeValue="missing-attribute-value",e.missingWhitespaceBetweenAttributes="missing-whitespace-between-attributes",e.missingWhitespaceAfterDoctypePublicKeyword="missing-whitespace-after-doctype-public-keyword",e.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers="missing-whitespace-between-doctype-public-and-system-identifiers",e.missingWhitespaceAfterDoctypeSystemKeyword="missing-whitespace-after-doctype-system-keyword",e.missingQuoteBeforeDoctypePublicIdentifier="missing-quote-before-doctype-public-identifier",e.missingQuoteBeforeDoctypeSystemIdentifier="missing-quote-before-doctype-system-identifier",e.missingDoctypePublicIdentifier="missing-doctype-public-identifier",e.missingDoctypeSystemIdentifier="missing-doctype-system-identifier",e.abruptDoctypePublicIdentifier="abrupt-doctype-public-identifier",e.abruptDoctypeSystemIdentifier="abrupt-doctype-system-identifier",e.cdataInHtmlContent="cdata-in-html-content",e.incorrectlyOpenedComment="incorrectly-opened-comment",e.eofInScriptHtmlCommentLikeText="eof-in-script-html-comment-like-text",e.eofInDoctype="eof-in-doctype",e.nestedComment="nested-comment",e.abruptClosingOfEmptyComment="abrupt-closing-of-empty-comment",e.eofInComment="eof-in-comment",e.incorrectlyClosedComment="incorrectly-closed-comment",e.eofInCdata="eof-in-cdata",e.absenceOfDigitsInNumericCharacterReference="absence-of-digits-in-numeric-character-reference",e.nullCharacterReference="null-character-reference",e.surrogateCharacterReference="surrogate-character-reference",e.characterReferenceOutsideUnicodeRange="character-reference-outside-unicode-range",e.controlCharacterReference="control-character-reference",e.noncharacterCharacterReference="noncharacter-character-reference",e.missingWhitespaceBeforeDoctypeName="missing-whitespace-before-doctype-name",e.missingDoctypeName="missing-doctype-name",e.invalidCharacterSequenceAfterDoctypeName="invalid-character-sequence-after-doctype-name",e.duplicateAttribute="duplicate-attribute",e.nonConformingDoctype="non-conforming-doctype",e.missingDoctype="missing-doctype",e.misplacedDoctype="misplaced-doctype",e.endTagWithoutMatchingOpenElement="end-tag-without-matching-open-element",e.closingOfElementWithOpenChildElements="closing-of-element-with-open-child-elements",e.disallowedContentInNoscriptInHead="disallowed-content-in-noscript-in-head",e.openElementsLeftAfterEof="open-elements-left-after-eof",e.abandonedHeadElementChild="abandoned-head-element-child",e.misplacedStartTagForHeadElement="misplaced-start-tag-for-head-element",e.nestedNoscriptInHead="nested-noscript-in-head",e.eofInElementThatCanContainOnlyText="eof-in-element-that-can-contain-only-text"})(N||(N={}));const q0=65536;class V0{constructor(t){this.handler=t,this.html="",this.pos=-1,this.lastGapPos=-2,this.gapStack=[],this.skipNextNewLine=!1,this.lastChunkWritten=!1,this.endOfChunkHit=!1,this.bufferWaterline=q0,this.isEol=!1,this.lineStartPos=0,this.droppedBufferSize=0,this.line=1,this.lastErrOffset=-1}get col(){return this.pos-this.lineStartPos+ +(this.lastGapPos!==this.pos)}get offset(){return this.droppedBufferSize+this.pos}getError(t,n){const{line:i,col:r,offset:a}=this,o=r+n,u=a+n;return{code:t,startLine:i,endLine:i,startCol:o,endCol:o,startOffset:u,endOffset:u}}_err(t){this.handler.onParseError&&this.lastErrOffset!==this.offset&&(this.lastErrOffset=this.offset,this.handler.onParseError(this.getError(t,0)))}_addGap(){this.gapStack.push(this.lastGapPos),this.lastGapPos=this.pos}_processSurrogate(t){if(this.pos!==this.html.length-1){const n=this.html.charCodeAt(this.pos+1);if(j0(n))return this.pos++,this._addGap(),$0(t,n)}else if(!this.lastChunkWritten)return this.endOfChunkHit=!0,m.EOF;return this._err(N.surrogateInInputStream),t}willDropParsedChunk(){return this.pos>this.bufferWaterline}dropParsedChunk(){this.willDropParsedChunk()&&(this.html=this.html.substring(this.pos),this.lineStartPos-=this.pos,this.droppedBufferSize+=this.pos,this.pos=0,this.lastGapPos=-2,this.gapStack.length=0)}write(t,n){this.html.length>0?this.html+=t:this.html=t,this.endOfChunkHit=!1,this.lastChunkWritten=n}insertHtmlAtCurrentPos(t){this.html=this.html.substring(0,this.pos+1)+t+this.html.substring(this.pos+1),this.endOfChunkHit=!1}startsWith(t,n){if(this.pos+t.length>this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,!1;if(n)return this.html.startsWith(t,this.pos);for(let i=0;i<t.length;i++)if((this.html.charCodeAt(this.pos+i)|32)!==t.charCodeAt(i))return!1;return!0}peek(t){const n=this.pos+t;if(n>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,m.EOF;const i=this.html.charCodeAt(n);return i===m.CARRIAGE_RETURN?m.LINE_FEED:i}advance(){if(this.pos++,this.isEol&&(this.isEol=!1,this.line++,this.lineStartPos=this.pos),this.pos>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,m.EOF;let t=this.html.charCodeAt(this.pos);return t===m.CARRIAGE_RETURN?(this.isEol=!0,this.skipNextNewLine=!0,m.LINE_FEED):t===m.LINE_FEED&&(this.isEol=!0,this.skipNextNewLine)?(this.line--,this.skipNextNewLine=!1,this._addGap(),this.advance()):(this.skipNextNewLine=!1,Hs(t)&&(t=this._processSurrogate(t)),this.handler.onParseError===null||t>31&&t<127||t===m.LINE_FEED||t===m.CARRIAGE_RETURN||t>159&&t<64976||this._checkForProblematicCharacters(t),t)}_checkForProblematicCharacters(t){Js(t)?this._err(N.controlCharacterInInputStream):Us(t)&&this._err(N.noncharacterInInputStream)}retreat(t){for(this.pos-=t;this.pos<this.lastGapPos;)this.lastGapPos=this.gapStack.pop(),this.pos--;this.isEol=!1}}var ae;(function(e){e[e.CHARACTER=0]="CHARACTER",e[e.NULL_CHARACTER=1]="NULL_CHARACTER",e[e.WHITESPACE_CHARACTER=2]="WHITESPACE_CHARACTER",e[e.START_TAG=3]="START_TAG",e[e.END_TAG=4]="END_TAG",e[e.COMMENT=5]="COMMENT",e[e.DOCTYPE=6]="DOCTYPE",e[e.EOF=7]="EOF",e[e.HIBERNATION=8]="HIBERNATION"})(ae||(ae={}));function js(e,t){for(let n=e.attrs.length-1;n>=0;n--)if(e.attrs[n].name===t)return e.attrs[n].value;return null}const $s=new Uint16Array('ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map(e=>e.charCodeAt(0))),z0=new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map(e=>e.charCodeAt(0)));var vi;const W0=new Map([[0,65533],[128,8364],[130,8218],[131,402],[132,8222],[133,8230],[134,8224],[135,8225],[136,710],[137,8240],[138,352],[139,8249],[140,338],[142,381],[145,8216],[146,8217],[147,8220],[148,8221],[149,8226],[150,8211],[151,8212],[152,732],[153,8482],[154,353],[155,8250],[156,339],[158,382],[159,376]]),Y0=(vi=String.fromCodePoint)!==null&&vi!==void 0?vi:function(e){let t="";return e>65535&&(e-=65536,t+=String.fromCharCode(e>>>10&1023|55296),e=56320|e&1023),t+=String.fromCharCode(e),t};function K0(e){var t;return e>=55296&&e<=57343||e>1114111?65533:(t=W0.get(e))!==null&&t!==void 0?t:e}var Te;(function(e){e[e.NUM=35]="NUM",e[e.SEMI=59]="SEMI",e[e.EQUALS=61]="EQUALS",e[e.ZERO=48]="ZERO",e[e.NINE=57]="NINE",e[e.LOWER_A=97]="LOWER_A",e[e.LOWER_F=102]="LOWER_F",e[e.LOWER_X=120]="LOWER_X",e[e.LOWER_Z=122]="LOWER_Z",e[e.UPPER_A=65]="UPPER_A",e[e.UPPER_F=70]="UPPER_F",e[e.UPPER_Z=90]="UPPER_Z"})(Te||(Te={}));const Q0=32;var ft;(function(e){e[e.VALUE_LENGTH=49152]="VALUE_LENGTH",e[e.BRANCH_LENGTH=16256]="BRANCH_LENGTH",e[e.JUMP_TABLE=127]="JUMP_TABLE"})(ft||(ft={}));function Wi(e){return e>=Te.ZERO&&e<=Te.NINE}function X0(e){return e>=Te.UPPER_A&&e<=Te.UPPER_F||e>=Te.LOWER_A&&e<=Te.LOWER_F}function Z0(e){return e>=Te.UPPER_A&&e<=Te.UPPER_Z||e>=Te.LOWER_A&&e<=Te.LOWER_Z||Wi(e)}function eI(e){return e===Te.EQUALS||Z0(e)}var Ee;(function(e){e[e.EntityStart=0]="EntityStart",e[e.NumericStart=1]="NumericStart",e[e.NumericDecimal=2]="NumericDecimal",e[e.NumericHex=3]="NumericHex",e[e.NamedEntity=4]="NamedEntity"})(Ee||(Ee={}));var ct;(function(e){e[e.Legacy=0]="Legacy",e[e.Strict=1]="Strict",e[e.Attribute=2]="Attribute"})(ct||(ct={}));class qs{constructor(t,n,i){this.decodeTree=t,this.emitCodePoint=n,this.errors=i,this.state=Ee.EntityStart,this.consumed=1,this.result=0,this.treeIndex=0,this.excess=1,this.decodeMode=ct.Strict}startEntity(t){this.decodeMode=t,this.state=Ee.EntityStart,this.result=0,this.treeIndex=0,this.excess=1,this.consumed=1}write(t,n){switch(this.state){case Ee.EntityStart:return t.charCodeAt(n)===Te.NUM?(this.state=Ee.NumericStart,this.consumed+=1,this.stateNumericStart(t,n+1)):(this.state=Ee.NamedEntity,this.stateNamedEntity(t,n));case Ee.NumericStart:return this.stateNumericStart(t,n);case Ee.NumericDecimal:return this.stateNumericDecimal(t,n);case Ee.NumericHex:return this.stateNumericHex(t,n);case Ee.NamedEntity:return this.stateNamedEntity(t,n)}}stateNumericStart(t,n){return n>=t.length?-1:(t.charCodeAt(n)|Q0)===Te.LOWER_X?(this.state=Ee.NumericHex,this.consumed+=1,this.stateNumericHex(t,n+1)):(this.state=Ee.NumericDecimal,this.stateNumericDecimal(t,n))}addToNumericResult(t,n,i,r){if(n!==i){const a=i-n;this.result=this.result*Math.pow(r,a)+parseInt(t.substr(n,a),r),this.consumed+=a}}stateNumericHex(t,n){const i=n;for(;n<t.length;){const r=t.charCodeAt(n);if(Wi(r)||X0(r))n+=1;else return this.addToNumericResult(t,i,n,16),this.emitNumericEntity(r,3)}return this.addToNumericResult(t,i,n,16),-1}stateNumericDecimal(t,n){const i=n;for(;n<t.length;){const r=t.charCodeAt(n);if(Wi(r))n+=1;else return this.addToNumericResult(t,i,n,10),this.emitNumericEntity(r,2)}return this.addToNumericResult(t,i,n,10),-1}emitNumericEntity(t,n){var i;if(this.consumed<=n)return(i=this.errors)===null||i===void 0||i.absenceOfDigitsInNumericCharacterReference(this.consumed),0;if(t===Te.SEMI)this.consumed+=1;else if(this.decodeMode===ct.Strict)return 0;return this.emitCodePoint(K0(this.result),this.consumed),this.errors&&(t!==Te.SEMI&&this.errors.missingSemicolonAfterCharacterReference(),this.errors.validateNumericCharacterReference(this.result)),this.consumed}stateNamedEntity(t,n){const{decodeTree:i}=this;let r=i[this.treeIndex],a=(r&ft.VALUE_LENGTH)>>14;for(;n<t.length;n++,this.excess++){const o=t.charCodeAt(n);if(this.treeIndex=tI(i,r,this.treeIndex+Math.max(1,a),o),this.treeIndex<0)return this.result===0||this.decodeMode===ct.Attribute&&(a===0||eI(o))?0:this.emitNotTerminatedNamedEntity();if(r=i[this.treeIndex],a=(r&ft.VALUE_LENGTH)>>14,a!==0){if(o===Te.SEMI)return this.emitNamedEntityData(this.treeIndex,a,this.consumed+this.excess);this.decodeMode!==ct.Strict&&(this.result=this.treeIndex,this.consumed+=this.excess,this.excess=0)}}return-1}emitNotTerminatedNamedEntity(){var t;const{result:n,decodeTree:i}=this,r=(i[n]&ft.VALUE_LENGTH)>>14;return this.emitNamedEntityData(n,r,this.consumed),(t=this.errors)===null||t===void 0||t.missingSemicolonAfterCharacterReference(),this.consumed}emitNamedEntityData(t,n,i){const{decodeTree:r}=this;return this.emitCodePoint(n===1?r[t]&~ft.VALUE_LENGTH:r[t+1],i),n===3&&this.emitCodePoint(r[t+2],i),i}end(){var t;switch(this.state){case Ee.NamedEntity:return this.result!==0&&(this.decodeMode!==ct.Attribute||this.result===this.treeIndex)?this.emitNotTerminatedNamedEntity():0;case Ee.NumericDecimal:return this.emitNumericEntity(0,2);case Ee.NumericHex:return this.emitNumericEntity(0,3);case Ee.NumericStart:return(t=this.errors)===null||t===void 0||t.absenceOfDigitsInNumericCharacterReference(this.consumed),0;case Ee.EntityStart:return 0}}}function Vs(e){let t="";const n=new qs(e,i=>t+=Y0(i));return function(r,a){let o=0,u=0;for(;(u=r.indexOf("&",u))>=0;){t+=r.slice(o,u),n.startEntity(a);const c=n.write(r,u+1);if(c<0){o=u+n.end();break}o=u+c,u=c===0?o+1:o}const l=t+r.slice(o);return t="",l}}function tI(e,t,n,i){const r=(t&ft.BRANCH_LENGTH)>>7,a=t&ft.JUMP_TABLE;if(r===0)return a!==0&&i===a?n:-1;if(a){const l=i-a;return l<0||l>=r?-1:e[n+l]-1}let o=n,u=o+r-1;for(;o<=u;){const l=o+u>>>1,c=e[l];if(c<i)o=l+1;else if(c>i)u=l-1;else return e[l+r]}return-1}Vs($s);Vs(z0);var w;(function(e){e.HTML="http://www.w3.org/1999/xhtml",e.MATHML="http://www.w3.org/1998/Math/MathML",e.SVG="http://www.w3.org/2000/svg",e.XLINK="http://www.w3.org/1999/xlink",e.XML="http://www.w3.org/XML/1998/namespace",e.XMLNS="http://www.w3.org/2000/xmlns/"})(w||(w={}));var kt;(function(e){e.TYPE="type",e.ACTION="action",e.ENCODING="encoding",e.PROMPT="prompt",e.NAME="name",e.COLOR="color",e.FACE="face",e.SIZE="size"})(kt||(kt={}));var ze;(function(e){e.NO_QUIRKS="no-quirks",e.QUIRKS="quirks",e.LIMITED_QUIRKS="limited-quirks"})(ze||(ze={}));var k;(function(e){e.A="a",e.ADDRESS="address",e.ANNOTATION_XML="annotation-xml",e.APPLET="applet",e.AREA="area",e.ARTICLE="article",e.ASIDE="aside",e.B="b",e.BASE="base",e.BASEFONT="basefont",e.BGSOUND="bgsound",e.BIG="big",e.BLOCKQUOTE="blockquote",e.BODY="body",e.BR="br",e.BUTTON="button",e.CAPTION="caption",e.CENTER="center",e.CODE="code",e.COL="col",e.COLGROUP="colgroup",e.DD="dd",e.DESC="desc",e.DETAILS="details",e.DIALOG="dialog",e.DIR="dir",e.DIV="div",e.DL="dl",e.DT="dt",e.EM="em",e.EMBED="embed",e.FIELDSET="fieldset",e.FIGCAPTION="figcaption",e.FIGURE="figure",e.FONT="font",e.FOOTER="footer",e.FOREIGN_OBJECT="foreignObject",e.FORM="form",e.FRAME="frame",e.FRAMESET="frameset",e.H1="h1",e.H2="h2",e.H3="h3",e.H4="h4",e.H5="h5",e.H6="h6",e.HEAD="head",e.HEADER="header",e.HGROUP="hgroup",e.HR="hr",e.HTML="html",e.I="i",e.IMG="img",e.IMAGE="image",e.INPUT="input",e.IFRAME="iframe",e.KEYGEN="keygen",e.LABEL="label",e.LI="li",e.LINK="link",e.LISTING="listing",e.MAIN="main",e.MALIGNMARK="malignmark",e.MARQUEE="marquee",e.MATH="math",e.MENU="menu",e.META="meta",e.MGLYPH="mglyph",e.MI="mi",e.MO="mo",e.MN="mn",e.MS="ms",e.MTEXT="mtext",e.NAV="nav",e.NOBR="nobr",e.NOFRAMES="noframes",e.NOEMBED="noembed",e.NOSCRIPT="noscript",e.OBJECT="object",e.OL="ol",e.OPTGROUP="optgroup",e.OPTION="option",e.P="p",e.PARAM="param",e.PLAINTEXT="plaintext",e.PRE="pre",e.RB="rb",e.RP="rp",e.RT="rt",e.RTC="rtc",e.RUBY="ruby",e.S="s",e.SCRIPT="script",e.SEARCH="search",e.SECTION="section",e.SELECT="select",e.SOURCE="source",e.SMALL="small",e.SPAN="span",e.STRIKE="strike",e.STRONG="strong",e.STYLE="style",e.SUB="sub",e.SUMMARY="summary",e.SUP="sup",e.TABLE="table",e.TBODY="tbody",e.TEMPLATE="template",e.TEXTAREA="textarea",e.TFOOT="tfoot",e.TD="td",e.TH="th",e.THEAD="thead",e.TITLE="title",e.TR="tr",e.TRACK="track",e.TT="tt",e.U="u",e.UL="ul",e.SVG="svg",e.VAR="var",e.WBR="wbr",e.XMP="xmp"})(k||(k={}));var s;(function(e){e[e.UNKNOWN=0]="UNKNOWN",e[e.A=1]="A",e[e.ADDRESS=2]="ADDRESS",e[e.ANNOTATION_XML=3]="ANNOTATION_XML",e[e.APPLET=4]="APPLET",e[e.AREA=5]="AREA",e[e.ARTICLE=6]="ARTICLE",e[e.ASIDE=7]="ASIDE",e[e.B=8]="B",e[e.BASE=9]="BASE",e[e.BASEFONT=10]="BASEFONT",e[e.BGSOUND=11]="BGSOUND",e[e.BIG=12]="BIG",e[e.BLOCKQUOTE=13]="BLOCKQUOTE",e[e.BODY=14]="BODY",e[e.BR=15]="BR",e[e.BUTTON=16]="BUTTON",e[e.CAPTION=17]="CAPTION",e[e.CENTER=18]="CENTER",e[e.CODE=19]="CODE",e[e.COL=20]="COL",e[e.COLGROUP=21]="COLGROUP",e[e.DD=22]="DD",e[e.DESC=23]="DESC",e[e.DETAILS=24]="DETAILS",e[e.DIALOG=25]="DIALOG",e[e.DIR=26]="DIR",e[e.DIV=27]="DIV",e[e.DL=28]="DL",e[e.DT=29]="DT",e[e.EM=30]="EM",e[e.EMBED=31]="EMBED",e[e.FIELDSET=32]="FIELDSET",e[e.FIGCAPTION=33]="FIGCAPTION",e[e.FIGURE=34]="FIGURE",e[e.FONT=35]="FONT",e[e.FOOTER=36]="FOOTER",e[e.FOREIGN_OBJECT=37]="FOREIGN_OBJECT",e[e.FORM=38]="FORM",e[e.FRAME=39]="FRAME",e[e.FRAMESET=40]="FRAMESET",e[e.H1=41]="H1",e[e.H2=42]="H2",e[e.H3=43]="H3",e[e.H4=44]="H4",e[e.H5=45]="H5",e[e.H6=46]="H6",e[e.HEAD=47]="HEAD",e[e.HEADER=48]="HEADER",e[e.HGROUP=49]="HGROUP",e[e.HR=50]="HR",e[e.HTML=51]="HTML",e[e.I=52]="I",e[e.IMG=53]="IMG",e[e.IMAGE=54]="IMAGE",e[e.INPUT=55]="INPUT",e[e.IFRAME=56]="IFRAME",e[e.KEYGEN=57]="KEYGEN",e[e.LABEL=58]="LABEL",e[e.LI=59]="LI",e[e.LINK=60]="LINK",e[e.LISTING=61]="LISTING",e[e.MAIN=62]="MAIN",e[e.MALIGNMARK=63]="MALIGNMARK",e[e.MARQUEE=64]="MARQUEE",e[e.MATH=65]="MATH",e[e.MENU=66]="MENU",e[e.META=67]="META",e[e.MGLYPH=68]="MGLYPH",e[e.MI=69]="MI",e[e.MO=70]="MO",e[e.MN=71]="MN",e[e.MS=72]="MS",e[e.MTEXT=73]="MTEXT",e[e.NAV=74]="NAV",e[e.NOBR=75]="NOBR",e[e.NOFRAMES=76]="NOFRAMES",e[e.NOEMBED=77]="NOEMBED",e[e.NOSCRIPT=78]="NOSCRIPT",e[e.OBJECT=79]="OBJECT",e[e.OL=80]="OL",e[e.OPTGROUP=81]="OPTGROUP",e[e.OPTION=82]="OPTION",e[e.P=83]="P",e[e.PARAM=84]="PARAM",e[e.PLAINTEXT=85]="PLAINTEXT",e[e.PRE=86]="PRE",e[e.RB=87]="RB",e[e.RP=88]="RP",e[e.RT=89]="RT",e[e.RTC=90]="RTC",e[e.RUBY=91]="RUBY",e[e.S=92]="S",e[e.SCRIPT=93]="SCRIPT",e[e.SEARCH=94]="SEARCH",e[e.SECTION=95]="SECTION",e[e.SELECT=96]="SELECT",e[e.SOURCE=97]="SOURCE",e[e.SMALL=98]="SMALL",e[e.SPAN=99]="SPAN",e[e.STRIKE=100]="STRIKE",e[e.STRONG=101]="STRONG",e[e.STYLE=102]="STYLE",e[e.SUB=103]="SUB",e[e.SUMMARY=104]="SUMMARY",e[e.SUP=105]="SUP",e[e.TABLE=106]="TABLE",e[e.TBODY=107]="TBODY",e[e.TEMPLATE=108]="TEMPLATE",e[e.TEXTAREA=109]="TEXTAREA",e[e.TFOOT=110]="TFOOT",e[e.TD=111]="TD",e[e.TH=112]="TH",e[e.THEAD=113]="THEAD",e[e.TITLE=114]="TITLE",e[e.TR=115]="TR",e[e.TRACK=116]="TRACK",e[e.TT=117]="TT",e[e.U=118]="U",e[e.UL=119]="UL",e[e.SVG=120]="SVG",e[e.VAR=121]="VAR",e[e.WBR=122]="WBR",e[e.XMP=123]="XMP"})(s||(s={}));const nI=new Map([[k.A,s.A],[k.ADDRESS,s.ADDRESS],[k.ANNOTATION_XML,s.ANNOTATION_XML],[k.APPLET,s.APPLET],[k.AREA,s.AREA],[k.ARTICLE,s.ARTICLE],[k.ASIDE,s.ASIDE],[k.B,s.B],[k.BASE,s.BASE],[k.BASEFONT,s.BASEFONT],[k.BGSOUND,s.BGSOUND],[k.BIG,s.BIG],[k.BLOCKQUOTE,s.BLOCKQUOTE],[k.BODY,s.BODY],[k.BR,s.BR],[k.BUTTON,s.BUTTON],[k.CAPTION,s.CAPTION],[k.CENTER,s.CENTER],[k.CODE,s.CODE],[k.COL,s.COL],[k.COLGROUP,s.COLGROUP],[k.DD,s.DD],[k.DESC,s.DESC],[k.DETAILS,s.DETAILS],[k.DIALOG,s.DIALOG],[k.DIR,s.DIR],[k.DIV,s.DIV],[k.DL,s.DL],[k.DT,s.DT],[k.EM,s.EM],[k.EMBED,s.EMBED],[k.FIELDSET,s.FIELDSET],[k.FIGCAPTION,s.FIGCAPTION],[k.FIGURE,s.FIGURE],[k.FONT,s.FONT],[k.FOOTER,s.FOOTER],[k.FOREIGN_OBJECT,s.FOREIGN_OBJECT],[k.FORM,s.FORM],[k.FRAME,s.FRAME],[k.FRAMESET,s.FRAMESET],[k.H1,s.H1],[k.H2,s.H2],[k.H3,s.H3],[k.H4,s.H4],[k.H5,s.H5],[k.H6,s.H6],[k.HEAD,s.HEAD],[k.HEADER,s.HEADER],[k.HGROUP,s.HGROUP],[k.HR,s.HR],[k.HTML,s.HTML],[k.I,s.I],[k.IMG,s.IMG],[k.IMAGE,s.IMAGE],[k.INPUT,s.INPUT],[k.IFRAME,s.IFRAME],[k.KEYGEN,s.KEYGEN],[k.LABEL,s.LABEL],[k.LI,s.LI],[k.LINK,s.LINK],[k.LISTING,s.LISTING],[k.MAIN,s.MAIN],[k.MALIGNMARK,s.MALIGNMARK],[k.MARQUEE,s.MARQUEE],[k.MATH,s.MATH],[k.MENU,s.MENU],[k.META,s.META],[k.MGLYPH,s.MGLYPH],[k.MI,s.MI],[k.MO,s.MO],[k.MN,s.MN],[k.MS,s.MS],[k.MTEXT,s.MTEXT],[k.NAV,s.NAV],[k.NOBR,s.NOBR],[k.NOFRAMES,s.NOFRAMES],[k.NOEMBED,s.NOEMBED],[k.NOSCRIPT,s.NOSCRIPT],[k.OBJECT,s.OBJECT],[k.OL,s.OL],[k.OPTGROUP,s.OPTGROUP],[k.OPTION,s.OPTION],[k.P,s.P],[k.PARAM,s.PARAM],[k.PLAINTEXT,s.PLAINTEXT],[k.PRE,s.PRE],[k.RB,s.RB],[k.RP,s.RP],[k.RT,s.RT],[k.RTC,s.RTC],[k.RUBY,s.RUBY],[k.S,s.S],[k.SCRIPT,s.SCRIPT],[k.SEARCH,s.SEARCH],[k.SECTION,s.SECTION],[k.SELECT,s.SELECT],[k.SOURCE,s.SOURCE],[k.SMALL,s.SMALL],[k.SPAN,s.SPAN],[k.STRIKE,s.STRIKE],[k.STRONG,s.STRONG],[k.STYLE,s.STYLE],[k.SUB,s.SUB],[k.SUMMARY,s.SUMMARY],[k.SUP,s.SUP],[k.TABLE,s.TABLE],[k.TBODY,s.TBODY],[k.TEMPLATE,s.TEMPLATE],[k.TEXTAREA,s.TEXTAREA],[k.TFOOT,s.TFOOT],[k.TD,s.TD],[k.TH,s.TH],[k.THEAD,s.THEAD],[k.TITLE,s.TITLE],[k.TR,s.TR],[k.TRACK,s.TRACK],[k.TT,s.TT],[k.U,s.U],[k.UL,s.UL],[k.SVG,s.SVG],[k.VAR,s.VAR],[k.WBR,s.WBR],[k.XMP,s.XMP]]);function Wt(e){var t;return(t=nI.get(e))!==null&&t!==void 0?t:s.UNKNOWN}const D=s,iI={[w.HTML]:new Set([D.ADDRESS,D.APPLET,D.AREA,D.ARTICLE,D.ASIDE,D.BASE,D.BASEFONT,D.BGSOUND,D.BLOCKQUOTE,D.BODY,D.BR,D.BUTTON,D.CAPTION,D.CENTER,D.COL,D.COLGROUP,D.DD,D.DETAILS,D.DIR,D.DIV,D.DL,D.DT,D.EMBED,D.FIELDSET,D.FIGCAPTION,D.FIGURE,D.FOOTER,D.FORM,D.FRAME,D.FRAMESET,D.H1,D.H2,D.H3,D.H4,D.H5,D.H6,D.HEAD,D.HEADER,D.HGROUP,D.HR,D.HTML,D.IFRAME,D.IMG,D.INPUT,D.LI,D.LINK,D.LISTING,D.MAIN,D.MARQUEE,D.MENU,D.META,D.NAV,D.NOEMBED,D.NOFRAMES,D.NOSCRIPT,D.OBJECT,D.OL,D.P,D.PARAM,D.PLAINTEXT,D.PRE,D.SCRIPT,D.SECTION,D.SELECT,D.SOURCE,D.STYLE,D.SUMMARY,D.TABLE,D.TBODY,D.TD,D.TEMPLATE,D.TEXTAREA,D.TFOOT,D.TH,D.THEAD,D.TITLE,D.TR,D.TRACK,D.UL,D.WBR,D.XMP]),[w.MATHML]:new Set([D.MI,D.MO,D.MN,D.MS,D.MTEXT,D.ANNOTATION_XML]),[w.SVG]:new Set([D.TITLE,D.FOREIGN_OBJECT,D.DESC]),[w.XLINK]:new Set,[w.XML]:new Set,[w.XMLNS]:new Set},Yi=new Set([D.H1,D.H2,D.H3,D.H4,D.H5,D.H6]);k.STYLE,k.SCRIPT,k.XMP,k.IFRAME,k.NOEMBED,k.NOFRAMES,k.PLAINTEXT;var g;(function(e){e[e.DATA=0]="DATA",e[e.RCDATA=1]="RCDATA",e[e.RAWTEXT=2]="RAWTEXT",e[e.SCRIPT_DATA=3]="SCRIPT_DATA",e[e.PLAINTEXT=4]="PLAINTEXT",e[e.TAG_OPEN=5]="TAG_OPEN",e[e.END_TAG_OPEN=6]="END_TAG_OPEN",e[e.TAG_NAME=7]="TAG_NAME",e[e.RCDATA_LESS_THAN_SIGN=8]="RCDATA_LESS_THAN_SIGN",e[e.RCDATA_END_TAG_OPEN=9]="RCDATA_END_TAG_OPEN",e[e.RCDATA_END_TAG_NAME=10]="RCDATA_END_TAG_NAME",e[e.RAWTEXT_LESS_THAN_SIGN=11]="RAWTEXT_LESS_THAN_SIGN",e[e.RAWTEXT_END_TAG_OPEN=12]="RAWTEXT_END_TAG_OPEN",e[e.RAWTEXT_END_TAG_NAME=13]="RAWTEXT_END_TAG_NAME",e[e.SCRIPT_DATA_LESS_THAN_SIGN=14]="SCRIPT_DATA_LESS_THAN_SIGN",e[e.SCRIPT_DATA_END_TAG_OPEN=15]="SCRIPT_DATA_END_TAG_OPEN",e[e.SCRIPT_DATA_END_TAG_NAME=16]="SCRIPT_DATA_END_TAG_NAME",e[e.SCRIPT_DATA_ESCAPE_START=17]="SCRIPT_DATA_ESCAPE_START",e[e.SCRIPT_DATA_ESCAPE_START_DASH=18]="SCRIPT_DATA_ESCAPE_START_DASH",e[e.SCRIPT_DATA_ESCAPED=19]="SCRIPT_DATA_ESCAPED",e[e.SCRIPT_DATA_ESCAPED_DASH=20]="SCRIPT_DATA_ESCAPED_DASH",e[e.SCRIPT_DATA_ESCAPED_DASH_DASH=21]="SCRIPT_DATA_ESCAPED_DASH_DASH",e[e.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN=22]="SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN",e[e.SCRIPT_DATA_ESCAPED_END_TAG_OPEN=23]="SCRIPT_DATA_ESCAPED_END_TAG_OPEN",e[e.SCRIPT_DATA_ESCAPED_END_TAG_NAME=24]="SCRIPT_DATA_ESCAPED_END_TAG_NAME",e[e.SCRIPT_DATA_DOUBLE_ESCAPE_START=25]="SCRIPT_DATA_DOUBLE_ESCAPE_START",e[e.SCRIPT_DATA_DOUBLE_ESCAPED=26]="SCRIPT_DATA_DOUBLE_ESCAPED",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH=27]="SCRIPT_DATA_DOUBLE_ESCAPED_DASH",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH=28]="SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH",e[e.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN=29]="SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN",e[e.SCRIPT_DATA_DOUBLE_ESCAPE_END=30]="SCRIPT_DATA_DOUBLE_ESCAPE_END",e[e.BEFORE_ATTRIBUTE_NAME=31]="BEFORE_ATTRIBUTE_NAME",e[e.ATTRIBUTE_NAME=32]="ATTRIBUTE_NAME",e[e.AFTER_ATTRIBUTE_NAME=33]="AFTER_ATTRIBUTE_NAME",e[e.BEFORE_ATTRIBUTE_VALUE=34]="BEFORE_ATTRIBUTE_VALUE",e[e.ATTRIBUTE_VALUE_DOUBLE_QUOTED=35]="ATTRIBUTE_VALUE_DOUBLE_QUOTED",e[e.ATTRIBUTE_VALUE_SINGLE_QUOTED=36]="ATTRIBUTE_VALUE_SINGLE_QUOTED",e[e.ATTRIBUTE_VALUE_UNQUOTED=37]="ATTRIBUTE_VALUE_UNQUOTED",e[e.AFTER_ATTRIBUTE_VALUE_QUOTED=38]="AFTER_ATTRIBUTE_VALUE_QUOTED",e[e.SELF_CLOSING_START_TAG=39]="SELF_CLOSING_START_TAG",e[e.BOGUS_COMMENT=40]="BOGUS_COMMENT",e[e.MARKUP_DECLARATION_OPEN=41]="MARKUP_DECLARATION_OPEN",e[e.COMMENT_START=42]="COMMENT_START",e[e.COMMENT_START_DASH=43]="COMMENT_START_DASH",e[e.COMMENT=44]="COMMENT",e[e.COMMENT_LESS_THAN_SIGN=45]="COMMENT_LESS_THAN_SIGN",e[e.COMMENT_LESS_THAN_SIGN_BANG=46]="COMMENT_LESS_THAN_SIGN_BANG",e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH=47]="COMMENT_LESS_THAN_SIGN_BANG_DASH",e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH=48]="COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH",e[e.COMMENT_END_DASH=49]="COMMENT_END_DASH",e[e.COMMENT_END=50]="COMMENT_END",e[e.COMMENT_END_BANG=51]="COMMENT_END_BANG",e[e.DOCTYPE=52]="DOCTYPE",e[e.BEFORE_DOCTYPE_NAME=53]="BEFORE_DOCTYPE_NAME",e[e.DOCTYPE_NAME=54]="DOCTYPE_NAME",e[e.AFTER_DOCTYPE_NAME=55]="AFTER_DOCTYPE_NAME",e[e.AFTER_DOCTYPE_PUBLIC_KEYWORD=56]="AFTER_DOCTYPE_PUBLIC_KEYWORD",e[e.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER=57]="BEFORE_DOCTYPE_PUBLIC_IDENTIFIER",e[e.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED=58]="DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED",e[e.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED=59]="DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED",e[e.AFTER_DOCTYPE_PUBLIC_IDENTIFIER=60]="AFTER_DOCTYPE_PUBLIC_IDENTIFIER",e[e.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS=61]="BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS",e[e.AFTER_DOCTYPE_SYSTEM_KEYWORD=62]="AFTER_DOCTYPE_SYSTEM_KEYWORD",e[e.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER=63]="BEFORE_DOCTYPE_SYSTEM_IDENTIFIER",e[e.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED=64]="DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED",e[e.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED=65]="DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED",e[e.AFTER_DOCTYPE_SYSTEM_IDENTIFIER=66]="AFTER_DOCTYPE_SYSTEM_IDENTIFIER",e[e.BOGUS_DOCTYPE=67]="BOGUS_DOCTYPE",e[e.CDATA_SECTION=68]="CDATA_SECTION",e[e.CDATA_SECTION_BRACKET=69]="CDATA_SECTION_BRACKET",e[e.CDATA_SECTION_END=70]="CDATA_SECTION_END",e[e.CHARACTER_REFERENCE=71]="CHARACTER_REFERENCE",e[e.AMBIGUOUS_AMPERSAND=72]="AMBIGUOUS_AMPERSAND"})(g||(g={}));const Ie={DATA:g.DATA,RCDATA:g.RCDATA,RAWTEXT:g.RAWTEXT,SCRIPT_DATA:g.SCRIPT_DATA,PLAINTEXT:g.PLAINTEXT,CDATA_SECTION:g.CDATA_SECTION};function rI(e){return e>=m.DIGIT_0&&e<=m.DIGIT_9}function rn(e){return e>=m.LATIN_CAPITAL_A&&e<=m.LATIN_CAPITAL_Z}function aI(e){return e>=m.LATIN_SMALL_A&&e<=m.LATIN_SMALL_Z}function ht(e){return aI(e)||rn(e)}function eo(e){return ht(e)||rI(e)}function Dn(e){return e+32}function zs(e){return e===m.SPACE||e===m.LINE_FEED||e===m.TABULATION||e===m.FORM_FEED}function to(e){return zs(e)||e===m.SOLIDUS||e===m.GREATER_THAN_SIGN}function oI(e){return e===m.NULL?N.nullCharacterReference:e>1114111?N.characterReferenceOutsideUnicodeRange:Hs(e)?N.surrogateCharacterReference:Us(e)?N.noncharacterCharacterReference:Js(e)||e===m.CARRIAGE_RETURN?N.controlCharacterReference:null}class sI{constructor(t,n){this.options=t,this.handler=n,this.paused=!1,this.inLoop=!1,this.inForeignNode=!1,this.lastStartTagName="",this.active=!1,this.state=g.DATA,this.returnState=g.DATA,this.entityStartPos=0,this.consumedAfterSnapshot=-1,this.currentCharacterToken=null,this.currentToken=null,this.currentAttr={name:"",value:""},this.preprocessor=new V0(n),this.currentLocation=this.getCurrentLocation(-1),this.entityDecoder=new qs($s,(i,r)=>{this.preprocessor.pos=this.entityStartPos+r-1,this._flushCodePointConsumedAsCharacterReference(i)},n.onParseError?{missingSemicolonAfterCharacterReference:()=>{this._err(N.missingSemicolonAfterCharacterReference,1)},absenceOfDigitsInNumericCharacterReference:i=>{this._err(N.absenceOfDigitsInNumericCharacterReference,this.entityStartPos-this.preprocessor.pos+i)},validateNumericCharacterReference:i=>{const r=oI(i);r&&this._err(r,1)}}:void 0)}_err(t,n=0){var i,r;(r=(i=this.handler).onParseError)===null||r===void 0||r.call(i,this.preprocessor.getError(t,n))}getCurrentLocation(t){return this.options.sourceCodeLocationInfo?{startLine:this.preprocessor.line,startCol:this.preprocessor.col-t,startOffset:this.preprocessor.offset-t,endLine:-1,endCol:-1,endOffset:-1}:null}_runParsingLoop(){if(!this.inLoop){for(this.inLoop=!0;this.active&&!this.paused;){this.consumedAfterSnapshot=0;const t=this._consume();this._ensureHibernation()||this._callState(t)}this.inLoop=!1}}pause(){this.paused=!0}resume(t){if(!this.paused)throw new Error("Parser was already resumed");this.paused=!1,!this.inLoop&&(this._runParsingLoop(),this.paused||t==null||t())}write(t,n,i){this.active=!0,this.preprocessor.write(t,n),this._runParsingLoop(),this.paused||i==null||i()}insertHtmlAtCurrentPos(t){this.active=!0,this.preprocessor.insertHtmlAtCurrentPos(t),this._runParsingLoop()}_ensureHibernation(){return this.preprocessor.endOfChunkHit?(this.preprocessor.retreat(this.consumedAfterSnapshot),this.consumedAfterSnapshot=0,this.active=!1,!0):!1}_consume(){return this.consumedAfterSnapshot++,this.preprocessor.advance()}_advanceBy(t){this.consumedAfterSnapshot+=t;for(let n=0;n<t;n++)this.preprocessor.advance()}_consumeSequenceIfMatch(t,n){return this.preprocessor.startsWith(t,n)?(this._advanceBy(t.length-1),!0):!1}_createStartTagToken(){this.currentToken={type:ae.START_TAG,tagName:"",tagID:s.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(1)}}_createEndTagToken(){this.currentToken={type:ae.END_TAG,tagName:"",tagID:s.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(2)}}_createCommentToken(t){this.currentToken={type:ae.COMMENT,data:"",location:this.getCurrentLocation(t)}}_createDoctypeToken(t){this.currentToken={type:ae.DOCTYPE,name:t,forceQuirks:!1,publicId:null,systemId:null,location:this.currentLocation}}_createCharacterToken(t,n){this.currentCharacterToken={type:t,chars:n,location:this.currentLocation}}_createAttr(t){this.currentAttr={name:t,value:""},this.currentLocation=this.getCurrentLocation(0)}_leaveAttrName(){var t,n;const i=this.currentToken;if(js(i,this.currentAttr.name)===null){if(i.attrs.push(this.currentAttr),i.location&&this.currentLocation){const r=(t=(n=i.location).attrs)!==null&&t!==void 0?t:n.attrs=Object.create(null);r[this.currentAttr.name]=this.currentLocation,this._leaveAttrValue()}}else this._err(N.duplicateAttribute)}_leaveAttrValue(){this.currentLocation&&(this.currentLocation.endLine=this.preprocessor.line,this.currentLocation.endCol=this.preprocessor.col,this.currentLocation.endOffset=this.preprocessor.offset)}prepareToken(t){this._emitCurrentCharacterToken(t.location),this.currentToken=null,t.location&&(t.location.endLine=this.preprocessor.line,t.location.endCol=this.preprocessor.col+1,t.location.endOffset=this.preprocessor.offset+1),this.currentLocation=this.getCurrentLocation(-1)}emitCurrentTagToken(){const t=this.currentToken;this.prepareToken(t),t.tagID=Wt(t.tagName),t.type===ae.START_TAG?(this.lastStartTagName=t.tagName,this.handler.onStartTag(t)):(t.attrs.length>0&&this._err(N.endTagWithAttributes),t.selfClosing&&this._err(N.endTagWithTrailingSolidus),this.handler.onEndTag(t)),this.preprocessor.dropParsedChunk()}emitCurrentComment(t){this.prepareToken(t),this.handler.onComment(t),this.preprocessor.dropParsedChunk()}emitCurrentDoctype(t){this.prepareToken(t),this.handler.onDoctype(t),this.preprocessor.dropParsedChunk()}_emitCurrentCharacterToken(t){if(this.currentCharacterToken){switch(t&&this.currentCharacterToken.location&&(this.currentCharacterToken.location.endLine=t.startLine,this.currentCharacterToken.location.endCol=t.startCol,this.currentCharacterToken.location.endOffset=t.startOffset),this.currentCharacterToken.type){case ae.CHARACTER:{this.handler.onCharacter(this.currentCharacterToken);break}case ae.NULL_CHARACTER:{this.handler.onNullCharacter(this.currentCharacterToken);break}case ae.WHITESPACE_CHARACTER:{this.handler.onWhitespaceCharacter(this.currentCharacterToken);break}}this.currentCharacterToken=null}}_emitEOFToken(){const t=this.getCurrentLocation(0);t&&(t.endLine=t.startLine,t.endCol=t.startCol,t.endOffset=t.startOffset),this._emitCurrentCharacterToken(t),this.handler.onEof({type:ae.EOF,location:t}),this.active=!1}_appendCharToCurrentCharacterToken(t,n){if(this.currentCharacterToken)if(this.currentCharacterToken.type===t){this.currentCharacterToken.chars+=n;return}else this.currentLocation=this.getCurrentLocation(0),this._emitCurrentCharacterToken(this.currentLocation),this.preprocessor.dropParsedChunk();this._createCharacterToken(t,n)}_emitCodePoint(t){const n=zs(t)?ae.WHITESPACE_CHARACTER:t===m.NULL?ae.NULL_CHARACTER:ae.CHARACTER;this._appendCharToCurrentCharacterToken(n,String.fromCodePoint(t))}_emitChars(t){this._appendCharToCurrentCharacterToken(ae.CHARACTER,t)}_startCharacterReference(){this.returnState=this.state,this.state=g.CHARACTER_REFERENCE,this.entityStartPos=this.preprocessor.pos,this.entityDecoder.startEntity(this._isCharacterReferenceInAttribute()?ct.Attribute:ct.Legacy)}_isCharacterReferenceInAttribute(){return this.returnState===g.ATTRIBUTE_VALUE_DOUBLE_QUOTED||this.returnState===g.ATTRIBUTE_VALUE_SINGLE_QUOTED||this.returnState===g.ATTRIBUTE_VALUE_UNQUOTED}_flushCodePointConsumedAsCharacterReference(t){this._isCharacterReferenceInAttribute()?this.currentAttr.value+=String.fromCodePoint(t):this._emitCodePoint(t)}_callState(t){switch(this.state){case g.DATA:{this._stateData(t);break}case g.RCDATA:{this._stateRcdata(t);break}case g.RAWTEXT:{this._stateRawtext(t);break}case g.SCRIPT_DATA:{this._stateScriptData(t);break}case g.PLAINTEXT:{this._statePlaintext(t);break}case g.TAG_OPEN:{this._stateTagOpen(t);break}case g.END_TAG_OPEN:{this._stateEndTagOpen(t);break}case g.TAG_NAME:{this._stateTagName(t);break}case g.RCDATA_LESS_THAN_SIGN:{this._stateRcdataLessThanSign(t);break}case g.RCDATA_END_TAG_OPEN:{this._stateRcdataEndTagOpen(t);break}case g.RCDATA_END_TAG_NAME:{this._stateRcdataEndTagName(t);break}case g.RAWTEXT_LESS_THAN_SIGN:{this._stateRawtextLessThanSign(t);break}case g.RAWTEXT_END_TAG_OPEN:{this._stateRawtextEndTagOpen(t);break}case g.RAWTEXT_END_TAG_NAME:{this._stateRawtextEndTagName(t);break}case g.SCRIPT_DATA_LESS_THAN_SIGN:{this._stateScriptDataLessThanSign(t);break}case g.SCRIPT_DATA_END_TAG_OPEN:{this._stateScriptDataEndTagOpen(t);break}case g.SCRIPT_DATA_END_TAG_NAME:{this._stateScriptDataEndTagName(t);break}case g.SCRIPT_DATA_ESCAPE_START:{this._stateScriptDataEscapeStart(t);break}case g.SCRIPT_DATA_ESCAPE_START_DASH:{this._stateScriptDataEscapeStartDash(t);break}case g.SCRIPT_DATA_ESCAPED:{this._stateScriptDataEscaped(t);break}case g.SCRIPT_DATA_ESCAPED_DASH:{this._stateScriptDataEscapedDash(t);break}case g.SCRIPT_DATA_ESCAPED_DASH_DASH:{this._stateScriptDataEscapedDashDash(t);break}case g.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:{this._stateScriptDataEscapedLessThanSign(t);break}case g.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:{this._stateScriptDataEscapedEndTagOpen(t);break}case g.SCRIPT_DATA_ESCAPED_END_TAG_NAME:{this._stateScriptDataEscapedEndTagName(t);break}case g.SCRIPT_DATA_DOUBLE_ESCAPE_START:{this._stateScriptDataDoubleEscapeStart(t);break}case g.SCRIPT_DATA_DOUBLE_ESCAPED:{this._stateScriptDataDoubleEscaped(t);break}case g.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:{this._stateScriptDataDoubleEscapedDash(t);break}case g.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:{this._stateScriptDataDoubleEscapedDashDash(t);break}case g.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:{this._stateScriptDataDoubleEscapedLessThanSign(t);break}case g.SCRIPT_DATA_DOUBLE_ESCAPE_END:{this._stateScriptDataDoubleEscapeEnd(t);break}case g.BEFORE_ATTRIBUTE_NAME:{this._stateBeforeAttributeName(t);break}case g.ATTRIBUTE_NAME:{this._stateAttributeName(t);break}case g.AFTER_ATTRIBUTE_NAME:{this._stateAfterAttributeName(t);break}case g.BEFORE_ATTRIBUTE_VALUE:{this._stateBeforeAttributeValue(t);break}case g.ATTRIBUTE_VALUE_DOUBLE_QUOTED:{this._stateAttributeValueDoubleQuoted(t);break}case g.ATTRIBUTE_VALUE_SINGLE_QUOTED:{this._stateAttributeValueSingleQuoted(t);break}case g.ATTRIBUTE_VALUE_UNQUOTED:{this._stateAttributeValueUnquoted(t);break}case g.AFTER_ATTRIBUTE_VALUE_QUOTED:{this._stateAfterAttributeValueQuoted(t);break}case g.SELF_CLOSING_START_TAG:{this._stateSelfClosingStartTag(t);break}case g.BOGUS_COMMENT:{this._stateBogusComment(t);break}case g.MARKUP_DECLARATION_OPEN:{this._stateMarkupDeclarationOpen(t);break}case g.COMMENT_START:{this._stateCommentStart(t);break}case g.COMMENT_START_DASH:{this._stateCommentStartDash(t);break}case g.COMMENT:{this._stateComment(t);break}case g.COMMENT_LESS_THAN_SIGN:{this._stateCommentLessThanSign(t);break}case g.COMMENT_LESS_THAN_SIGN_BANG:{this._stateCommentLessThanSignBang(t);break}case g.COMMENT_LESS_THAN_SIGN_BANG_DASH:{this._stateCommentLessThanSignBangDash(t);break}case g.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:{this._stateCommentLessThanSignBangDashDash(t);break}case g.COMMENT_END_DASH:{this._stateCommentEndDash(t);break}case g.COMMENT_END:{this._stateCommentEnd(t);break}case g.COMMENT_END_BANG:{this._stateCommentEndBang(t);break}case g.DOCTYPE:{this._stateDoctype(t);break}case g.BEFORE_DOCTYPE_NAME:{this._stateBeforeDoctypeName(t);break}case g.DOCTYPE_NAME:{this._stateDoctypeName(t);break}case g.AFTER_DOCTYPE_NAME:{this._stateAfterDoctypeName(t);break}case g.AFTER_DOCTYPE_PUBLIC_KEYWORD:{this._stateAfterDoctypePublicKeyword(t);break}case g.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:{this._stateBeforeDoctypePublicIdentifier(t);break}case g.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:{this._stateDoctypePublicIdentifierDoubleQuoted(t);break}case g.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:{this._stateDoctypePublicIdentifierSingleQuoted(t);break}case g.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:{this._stateAfterDoctypePublicIdentifier(t);break}case g.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:{this._stateBetweenDoctypePublicAndSystemIdentifiers(t);break}case g.AFTER_DOCTYPE_SYSTEM_KEYWORD:{this._stateAfterDoctypeSystemKeyword(t);break}case g.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:{this._stateBeforeDoctypeSystemIdentifier(t);break}case g.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:{this._stateDoctypeSystemIdentifierDoubleQuoted(t);break}case g.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:{this._stateDoctypeSystemIdentifierSingleQuoted(t);break}case g.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:{this._stateAfterDoctypeSystemIdentifier(t);break}case g.BOGUS_DOCTYPE:{this._stateBogusDoctype(t);break}case g.CDATA_SECTION:{this._stateCdataSection(t);break}case g.CDATA_SECTION_BRACKET:{this._stateCdataSectionBracket(t);break}case g.CDATA_SECTION_END:{this._stateCdataSectionEnd(t);break}case g.CHARACTER_REFERENCE:{this._stateCharacterReference();break}case g.AMBIGUOUS_AMPERSAND:{this._stateAmbiguousAmpersand(t);break}default:throw new Error("Unknown state")}}_stateData(t){switch(t){case m.LESS_THAN_SIGN:{this.state=g.TAG_OPEN;break}case m.AMPERSAND:{this._startCharacterReference();break}case m.NULL:{this._err(N.unexpectedNullCharacter),this._emitCodePoint(t);break}case m.EOF:{this._emitEOFToken();break}default:this._emitCodePoint(t)}}_stateRcdata(t){switch(t){case m.AMPERSAND:{this._startCharacterReference();break}case m.LESS_THAN_SIGN:{this.state=g.RCDATA_LESS_THAN_SIGN;break}case m.NULL:{this._err(N.unexpectedNullCharacter),this._emitChars(me);break}case m.EOF:{this._emitEOFToken();break}default:this._emitCodePoint(t)}}_stateRawtext(t){switch(t){case m.LESS_THAN_SIGN:{this.state=g.RAWTEXT_LESS_THAN_SIGN;break}case m.NULL:{this._err(N.unexpectedNullCharacter),this._emitChars(me);break}case m.EOF:{this._emitEOFToken();break}default:this._emitCodePoint(t)}}_stateScriptData(t){switch(t){case m.LESS_THAN_SIGN:{this.state=g.SCRIPT_DATA_LESS_THAN_SIGN;break}case m.NULL:{this._err(N.unexpectedNullCharacter),this._emitChars(me);break}case m.EOF:{this._emitEOFToken();break}default:this._emitCodePoint(t)}}_statePlaintext(t){switch(t){case m.NULL:{this._err(N.unexpectedNullCharacter),this._emitChars(me);break}case m.EOF:{this._emitEOFToken();break}default:this._emitCodePoint(t)}}_stateTagOpen(t){if(ht(t))this._createStartTagToken(),this.state=g.TAG_NAME,this._stateTagName(t);else switch(t){case m.EXCLAMATION_MARK:{this.state=g.MARKUP_DECLARATION_OPEN;break}case m.SOLIDUS:{this.state=g.END_TAG_OPEN;break}case m.QUESTION_MARK:{this._err(N.unexpectedQuestionMarkInsteadOfTagName),this._createCommentToken(1),this.state=g.BOGUS_COMMENT,this._stateBogusComment(t);break}case m.EOF:{this._err(N.eofBeforeTagName),this._emitChars("<"),this._emitEOFToken();break}default:this._err(N.invalidFirstCharacterOfTagName),this._emitChars("<"),this.state=g.DATA,this._stateData(t)}}_stateEndTagOpen(t){if(ht(t))this._createEndTagToken(),this.state=g.TAG_NAME,this._stateTagName(t);else switch(t){case m.GREATER_THAN_SIGN:{this._err(N.missingEndTagName),this.state=g.DATA;break}case m.EOF:{this._err(N.eofBeforeTagName),this._emitChars("</"),this._emitEOFToken();break}default:this._err(N.invalidFirstCharacterOfTagName),this._createCommentToken(2),this.state=g.BOGUS_COMMENT,this._stateBogusComment(t)}}_stateTagName(t){const n=this.currentToken;switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:{this.state=g.BEFORE_ATTRIBUTE_NAME;break}case m.SOLIDUS:{this.state=g.SELF_CLOSING_START_TAG;break}case m.GREATER_THAN_SIGN:{this.state=g.DATA,this.emitCurrentTagToken();break}case m.NULL:{this._err(N.unexpectedNullCharacter),n.tagName+=me;break}case m.EOF:{this._err(N.eofInTag),this._emitEOFToken();break}default:n.tagName+=String.fromCodePoint(rn(t)?Dn(t):t)}}_stateRcdataLessThanSign(t){t===m.SOLIDUS?this.state=g.RCDATA_END_TAG_OPEN:(this._emitChars("<"),this.state=g.RCDATA,this._stateRcdata(t))}_stateRcdataEndTagOpen(t){ht(t)?(this.state=g.RCDATA_END_TAG_NAME,this._stateRcdataEndTagName(t)):(this._emitChars("</"),this.state=g.RCDATA,this._stateRcdata(t))}handleSpecialEndTag(t){if(!this.preprocessor.startsWith(this.lastStartTagName,!1))return!this._ensureHibernation();this._createEndTagToken();const n=this.currentToken;switch(n.tagName=this.lastStartTagName,this.preprocessor.peek(this.lastStartTagName.length)){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:return this._advanceBy(this.lastStartTagName.length),this.state=g.BEFORE_ATTRIBUTE_NAME,!1;case m.SOLIDUS:return this._advanceBy(this.lastStartTagName.length),this.state=g.SELF_CLOSING_START_TAG,!1;case m.GREATER_THAN_SIGN:return this._advanceBy(this.lastStartTagName.length),this.emitCurrentTagToken(),this.state=g.DATA,!1;default:return!this._ensureHibernation()}}_stateRcdataEndTagName(t){this.handleSpecialEndTag(t)&&(this._emitChars("</"),this.state=g.RCDATA,this._stateRcdata(t))}_stateRawtextLessThanSign(t){t===m.SOLIDUS?this.state=g.RAWTEXT_END_TAG_OPEN:(this._emitChars("<"),this.state=g.RAWTEXT,this._stateRawtext(t))}_stateRawtextEndTagOpen(t){ht(t)?(this.state=g.RAWTEXT_END_TAG_NAME,this._stateRawtextEndTagName(t)):(this._emitChars("</"),this.state=g.RAWTEXT,this._stateRawtext(t))}_stateRawtextEndTagName(t){this.handleSpecialEndTag(t)&&(this._emitChars("</"),this.state=g.RAWTEXT,this._stateRawtext(t))}_stateScriptDataLessThanSign(t){switch(t){case m.SOLIDUS:{this.state=g.SCRIPT_DATA_END_TAG_OPEN;break}case m.EXCLAMATION_MARK:{this.state=g.SCRIPT_DATA_ESCAPE_START,this._emitChars("<!");break}default:this._emitChars("<"),this.state=g.SCRIPT_DATA,this._stateScriptData(t)}}_stateScriptDataEndTagOpen(t){ht(t)?(this.state=g.SCRIPT_DATA_END_TAG_NAME,this._stateScriptDataEndTagName(t)):(this._emitChars("</"),this.state=g.SCRIPT_DATA,this._stateScriptData(t))}_stateScriptDataEndTagName(t){this.handleSpecialEndTag(t)&&(this._emitChars("</"),this.state=g.SCRIPT_DATA,this._stateScriptData(t))}_stateScriptDataEscapeStart(t){t===m.HYPHEN_MINUS?(this.state=g.SCRIPT_DATA_ESCAPE_START_DASH,this._emitChars("-")):(this.state=g.SCRIPT_DATA,this._stateScriptData(t))}_stateScriptDataEscapeStartDash(t){t===m.HYPHEN_MINUS?(this.state=g.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars("-")):(this.state=g.SCRIPT_DATA,this._stateScriptData(t))}_stateScriptDataEscaped(t){switch(t){case m.HYPHEN_MINUS:{this.state=g.SCRIPT_DATA_ESCAPED_DASH,this._emitChars("-");break}case m.LESS_THAN_SIGN:{this.state=g.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break}case m.NULL:{this._err(N.unexpectedNullCharacter),this._emitChars(me);break}case m.EOF:{this._err(N.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break}default:this._emitCodePoint(t)}}_stateScriptDataEscapedDash(t){switch(t){case m.HYPHEN_MINUS:{this.state=g.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars("-");break}case m.LESS_THAN_SIGN:{this.state=g.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break}case m.NULL:{this._err(N.unexpectedNullCharacter),this.state=g.SCRIPT_DATA_ESCAPED,this._emitChars(me);break}case m.EOF:{this._err(N.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break}default:this.state=g.SCRIPT_DATA_ESCAPED,this._emitCodePoint(t)}}_stateScriptDataEscapedDashDash(t){switch(t){case m.HYPHEN_MINUS:{this._emitChars("-");break}case m.LESS_THAN_SIGN:{this.state=g.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break}case m.GREATER_THAN_SIGN:{this.state=g.SCRIPT_DATA,this._emitChars(">");break}case m.NULL:{this._err(N.unexpectedNullCharacter),this.state=g.SCRIPT_DATA_ESCAPED,this._emitChars(me);break}case m.EOF:{this._err(N.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break}default:this.state=g.SCRIPT_DATA_ESCAPED,this._emitCodePoint(t)}}_stateScriptDataEscapedLessThanSign(t){t===m.SOLIDUS?this.state=g.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:ht(t)?(this._emitChars("<"),this.state=g.SCRIPT_DATA_DOUBLE_ESCAPE_START,this._stateScriptDataDoubleEscapeStart(t)):(this._emitChars("<"),this.state=g.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(t))}_stateScriptDataEscapedEndTagOpen(t){ht(t)?(this.state=g.SCRIPT_DATA_ESCAPED_END_TAG_NAME,this._stateScriptDataEscapedEndTagName(t)):(this._emitChars("</"),this.state=g.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(t))}_stateScriptDataEscapedEndTagName(t){this.handleSpecialEndTag(t)&&(this._emitChars("</"),this.state=g.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(t))}_stateScriptDataDoubleEscapeStart(t){if(this.preprocessor.startsWith(De.SCRIPT,!1)&&to(this.preprocessor.peek(De.SCRIPT.length))){this._emitCodePoint(t);for(let n=0;n<De.SCRIPT.length;n++)this._emitCodePoint(this._consume());this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED}else this._ensureHibernation()||(this.state=g.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(t))}_stateScriptDataDoubleEscaped(t){switch(t){case m.HYPHEN_MINUS:{this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED_DASH,this._emitChars("-");break}case m.LESS_THAN_SIGN:{this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break}case m.NULL:{this._err(N.unexpectedNullCharacter),this._emitChars(me);break}case m.EOF:{this._err(N.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break}default:this._emitCodePoint(t)}}_stateScriptDataDoubleEscapedDash(t){switch(t){case m.HYPHEN_MINUS:{this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH,this._emitChars("-");break}case m.LESS_THAN_SIGN:{this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break}case m.NULL:{this._err(N.unexpectedNullCharacter),this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(me);break}case m.EOF:{this._err(N.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break}default:this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(t)}}_stateScriptDataDoubleEscapedDashDash(t){switch(t){case m.HYPHEN_MINUS:{this._emitChars("-");break}case m.LESS_THAN_SIGN:{this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars("<");break}case m.GREATER_THAN_SIGN:{this.state=g.SCRIPT_DATA,this._emitChars(">");break}case m.NULL:{this._err(N.unexpectedNullCharacter),this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(me);break}case m.EOF:{this._err(N.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break}default:this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(t)}}_stateScriptDataDoubleEscapedLessThanSign(t){t===m.SOLIDUS?(this.state=g.SCRIPT_DATA_DOUBLE_ESCAPE_END,this._emitChars("/")):(this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(t))}_stateScriptDataDoubleEscapeEnd(t){if(this.preprocessor.startsWith(De.SCRIPT,!1)&&to(this.preprocessor.peek(De.SCRIPT.length))){this._emitCodePoint(t);for(let n=0;n<De.SCRIPT.length;n++)this._emitCodePoint(this._consume());this.state=g.SCRIPT_DATA_ESCAPED}else this._ensureHibernation()||(this.state=g.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(t))}_stateBeforeAttributeName(t){switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:break;case m.SOLIDUS:case m.GREATER_THAN_SIGN:case m.EOF:{this.state=g.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(t);break}case m.EQUALS_SIGN:{this._err(N.unexpectedEqualsSignBeforeAttributeName),this._createAttr("="),this.state=g.ATTRIBUTE_NAME;break}default:this._createAttr(""),this.state=g.ATTRIBUTE_NAME,this._stateAttributeName(t)}}_stateAttributeName(t){switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:case m.SOLIDUS:case m.GREATER_THAN_SIGN:case m.EOF:{this._leaveAttrName(),this.state=g.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(t);break}case m.EQUALS_SIGN:{this._leaveAttrName(),this.state=g.BEFORE_ATTRIBUTE_VALUE;break}case m.QUOTATION_MARK:case m.APOSTROPHE:case m.LESS_THAN_SIGN:{this._err(N.unexpectedCharacterInAttributeName),this.currentAttr.name+=String.fromCodePoint(t);break}case m.NULL:{this._err(N.unexpectedNullCharacter),this.currentAttr.name+=me;break}default:this.currentAttr.name+=String.fromCodePoint(rn(t)?Dn(t):t)}}_stateAfterAttributeName(t){switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:break;case m.SOLIDUS:{this.state=g.SELF_CLOSING_START_TAG;break}case m.EQUALS_SIGN:{this.state=g.BEFORE_ATTRIBUTE_VALUE;break}case m.GREATER_THAN_SIGN:{this.state=g.DATA,this.emitCurrentTagToken();break}case m.EOF:{this._err(N.eofInTag),this._emitEOFToken();break}default:this._createAttr(""),this.state=g.ATTRIBUTE_NAME,this._stateAttributeName(t)}}_stateBeforeAttributeValue(t){switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:break;case m.QUOTATION_MARK:{this.state=g.ATTRIBUTE_VALUE_DOUBLE_QUOTED;break}case m.APOSTROPHE:{this.state=g.ATTRIBUTE_VALUE_SINGLE_QUOTED;break}case m.GREATER_THAN_SIGN:{this._err(N.missingAttributeValue),this.state=g.DATA,this.emitCurrentTagToken();break}default:this.state=g.ATTRIBUTE_VALUE_UNQUOTED,this._stateAttributeValueUnquoted(t)}}_stateAttributeValueDoubleQuoted(t){switch(t){case m.QUOTATION_MARK:{this.state=g.AFTER_ATTRIBUTE_VALUE_QUOTED;break}case m.AMPERSAND:{this._startCharacterReference();break}case m.NULL:{this._err(N.unexpectedNullCharacter),this.currentAttr.value+=me;break}case m.EOF:{this._err(N.eofInTag),this._emitEOFToken();break}default:this.currentAttr.value+=String.fromCodePoint(t)}}_stateAttributeValueSingleQuoted(t){switch(t){case m.APOSTROPHE:{this.state=g.AFTER_ATTRIBUTE_VALUE_QUOTED;break}case m.AMPERSAND:{this._startCharacterReference();break}case m.NULL:{this._err(N.unexpectedNullCharacter),this.currentAttr.value+=me;break}case m.EOF:{this._err(N.eofInTag),this._emitEOFToken();break}default:this.currentAttr.value+=String.fromCodePoint(t)}}_stateAttributeValueUnquoted(t){switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:{this._leaveAttrValue(),this.state=g.BEFORE_ATTRIBUTE_NAME;break}case m.AMPERSAND:{this._startCharacterReference();break}case m.GREATER_THAN_SIGN:{this._leaveAttrValue(),this.state=g.DATA,this.emitCurrentTagToken();break}case m.NULL:{this._err(N.unexpectedNullCharacter),this.currentAttr.value+=me;break}case m.QUOTATION_MARK:case m.APOSTROPHE:case m.LESS_THAN_SIGN:case m.EQUALS_SIGN:case m.GRAVE_ACCENT:{this._err(N.unexpectedCharacterInUnquotedAttributeValue),this.currentAttr.value+=String.fromCodePoint(t);break}case m.EOF:{this._err(N.eofInTag),this._emitEOFToken();break}default:this.currentAttr.value+=String.fromCodePoint(t)}}_stateAfterAttributeValueQuoted(t){switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:{this._leaveAttrValue(),this.state=g.BEFORE_ATTRIBUTE_NAME;break}case m.SOLIDUS:{this._leaveAttrValue(),this.state=g.SELF_CLOSING_START_TAG;break}case m.GREATER_THAN_SIGN:{this._leaveAttrValue(),this.state=g.DATA,this.emitCurrentTagToken();break}case m.EOF:{this._err(N.eofInTag),this._emitEOFToken();break}default:this._err(N.missingWhitespaceBetweenAttributes),this.state=g.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(t)}}_stateSelfClosingStartTag(t){switch(t){case m.GREATER_THAN_SIGN:{const n=this.currentToken;n.selfClosing=!0,this.state=g.DATA,this.emitCurrentTagToken();break}case m.EOF:{this._err(N.eofInTag),this._emitEOFToken();break}default:this._err(N.unexpectedSolidusInTag),this.state=g.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(t)}}_stateBogusComment(t){const n=this.currentToken;switch(t){case m.GREATER_THAN_SIGN:{this.state=g.DATA,this.emitCurrentComment(n);break}case m.EOF:{this.emitCurrentComment(n),this._emitEOFToken();break}case m.NULL:{this._err(N.unexpectedNullCharacter),n.data+=me;break}default:n.data+=String.fromCodePoint(t)}}_stateMarkupDeclarationOpen(t){this._consumeSequenceIfMatch(De.DASH_DASH,!0)?(this._createCommentToken(De.DASH_DASH.length+1),this.state=g.COMMENT_START):this._consumeSequenceIfMatch(De.DOCTYPE,!1)?(this.currentLocation=this.getCurrentLocation(De.DOCTYPE.length+1),this.state=g.DOCTYPE):this._consumeSequenceIfMatch(De.CDATA_START,!0)?this.inForeignNode?this.state=g.CDATA_SECTION:(this._err(N.cdataInHtmlContent),this._createCommentToken(De.CDATA_START.length+1),this.currentToken.data="[CDATA[",this.state=g.BOGUS_COMMENT):this._ensureHibernation()||(this._err(N.incorrectlyOpenedComment),this._createCommentToken(2),this.state=g.BOGUS_COMMENT,this._stateBogusComment(t))}_stateCommentStart(t){switch(t){case m.HYPHEN_MINUS:{this.state=g.COMMENT_START_DASH;break}case m.GREATER_THAN_SIGN:{this._err(N.abruptClosingOfEmptyComment),this.state=g.DATA;const n=this.currentToken;this.emitCurrentComment(n);break}default:this.state=g.COMMENT,this._stateComment(t)}}_stateCommentStartDash(t){const n=this.currentToken;switch(t){case m.HYPHEN_MINUS:{this.state=g.COMMENT_END;break}case m.GREATER_THAN_SIGN:{this._err(N.abruptClosingOfEmptyComment),this.state=g.DATA,this.emitCurrentComment(n);break}case m.EOF:{this._err(N.eofInComment),this.emitCurrentComment(n),this._emitEOFToken();break}default:n.data+="-",this.state=g.COMMENT,this._stateComment(t)}}_stateComment(t){const n=this.currentToken;switch(t){case m.HYPHEN_MINUS:{this.state=g.COMMENT_END_DASH;break}case m.LESS_THAN_SIGN:{n.data+="<",this.state=g.COMMENT_LESS_THAN_SIGN;break}case m.NULL:{this._err(N.unexpectedNullCharacter),n.data+=me;break}case m.EOF:{this._err(N.eofInComment),this.emitCurrentComment(n),this._emitEOFToken();break}default:n.data+=String.fromCodePoint(t)}}_stateCommentLessThanSign(t){const n=this.currentToken;switch(t){case m.EXCLAMATION_MARK:{n.data+="!",this.state=g.COMMENT_LESS_THAN_SIGN_BANG;break}case m.LESS_THAN_SIGN:{n.data+="<";break}default:this.state=g.COMMENT,this._stateComment(t)}}_stateCommentLessThanSignBang(t){t===m.HYPHEN_MINUS?this.state=g.COMMENT_LESS_THAN_SIGN_BANG_DASH:(this.state=g.COMMENT,this._stateComment(t))}_stateCommentLessThanSignBangDash(t){t===m.HYPHEN_MINUS?this.state=g.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:(this.state=g.COMMENT_END_DASH,this._stateCommentEndDash(t))}_stateCommentLessThanSignBangDashDash(t){t!==m.GREATER_THAN_SIGN&&t!==m.EOF&&this._err(N.nestedComment),this.state=g.COMMENT_END,this._stateCommentEnd(t)}_stateCommentEndDash(t){const n=this.currentToken;switch(t){case m.HYPHEN_MINUS:{this.state=g.COMMENT_END;break}case m.EOF:{this._err(N.eofInComment),this.emitCurrentComment(n),this._emitEOFToken();break}default:n.data+="-",this.state=g.COMMENT,this._stateComment(t)}}_stateCommentEnd(t){const n=this.currentToken;switch(t){case m.GREATER_THAN_SIGN:{this.state=g.DATA,this.emitCurrentComment(n);break}case m.EXCLAMATION_MARK:{this.state=g.COMMENT_END_BANG;break}case m.HYPHEN_MINUS:{n.data+="-";break}case m.EOF:{this._err(N.eofInComment),this.emitCurrentComment(n),this._emitEOFToken();break}default:n.data+="--",this.state=g.COMMENT,this._stateComment(t)}}_stateCommentEndBang(t){const n=this.currentToken;switch(t){case m.HYPHEN_MINUS:{n.data+="--!",this.state=g.COMMENT_END_DASH;break}case m.GREATER_THAN_SIGN:{this._err(N.incorrectlyClosedComment),this.state=g.DATA,this.emitCurrentComment(n);break}case m.EOF:{this._err(N.eofInComment),this.emitCurrentComment(n),this._emitEOFToken();break}default:n.data+="--!",this.state=g.COMMENT,this._stateComment(t)}}_stateDoctype(t){switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:{this.state=g.BEFORE_DOCTYPE_NAME;break}case m.GREATER_THAN_SIGN:{this.state=g.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(t);break}case m.EOF:{this._err(N.eofInDoctype),this._createDoctypeToken(null);const n=this.currentToken;n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:this._err(N.missingWhitespaceBeforeDoctypeName),this.state=g.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(t)}}_stateBeforeDoctypeName(t){if(rn(t))this._createDoctypeToken(String.fromCharCode(Dn(t))),this.state=g.DOCTYPE_NAME;else switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:break;case m.NULL:{this._err(N.unexpectedNullCharacter),this._createDoctypeToken(me),this.state=g.DOCTYPE_NAME;break}case m.GREATER_THAN_SIGN:{this._err(N.missingDoctypeName),this._createDoctypeToken(null);const n=this.currentToken;n.forceQuirks=!0,this.emitCurrentDoctype(n),this.state=g.DATA;break}case m.EOF:{this._err(N.eofInDoctype),this._createDoctypeToken(null);const n=this.currentToken;n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:this._createDoctypeToken(String.fromCodePoint(t)),this.state=g.DOCTYPE_NAME}}_stateDoctypeName(t){const n=this.currentToken;switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:{this.state=g.AFTER_DOCTYPE_NAME;break}case m.GREATER_THAN_SIGN:{this.state=g.DATA,this.emitCurrentDoctype(n);break}case m.NULL:{this._err(N.unexpectedNullCharacter),n.name+=me;break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:n.name+=String.fromCodePoint(rn(t)?Dn(t):t)}}_stateAfterDoctypeName(t){const n=this.currentToken;switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:break;case m.GREATER_THAN_SIGN:{this.state=g.DATA,this.emitCurrentDoctype(n);break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:this._consumeSequenceIfMatch(De.PUBLIC,!1)?this.state=g.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._consumeSequenceIfMatch(De.SYSTEM,!1)?this.state=g.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._ensureHibernation()||(this._err(N.invalidCharacterSequenceAfterDoctypeName),n.forceQuirks=!0,this.state=g.BOGUS_DOCTYPE,this._stateBogusDoctype(t))}}_stateAfterDoctypePublicKeyword(t){const n=this.currentToken;switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:{this.state=g.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;break}case m.QUOTATION_MARK:{this._err(N.missingWhitespaceAfterDoctypePublicKeyword),n.publicId="",this.state=g.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break}case m.APOSTROPHE:{this._err(N.missingWhitespaceAfterDoctypePublicKeyword),n.publicId="",this.state=g.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break}case m.GREATER_THAN_SIGN:{this._err(N.missingDoctypePublicIdentifier),n.forceQuirks=!0,this.state=g.DATA,this.emitCurrentDoctype(n);break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:this._err(N.missingQuoteBeforeDoctypePublicIdentifier),n.forceQuirks=!0,this.state=g.BOGUS_DOCTYPE,this._stateBogusDoctype(t)}}_stateBeforeDoctypePublicIdentifier(t){const n=this.currentToken;switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:break;case m.QUOTATION_MARK:{n.publicId="",this.state=g.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break}case m.APOSTROPHE:{n.publicId="",this.state=g.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break}case m.GREATER_THAN_SIGN:{this._err(N.missingDoctypePublicIdentifier),n.forceQuirks=!0,this.state=g.DATA,this.emitCurrentDoctype(n);break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:this._err(N.missingQuoteBeforeDoctypePublicIdentifier),n.forceQuirks=!0,this.state=g.BOGUS_DOCTYPE,this._stateBogusDoctype(t)}}_stateDoctypePublicIdentifierDoubleQuoted(t){const n=this.currentToken;switch(t){case m.QUOTATION_MARK:{this.state=g.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break}case m.NULL:{this._err(N.unexpectedNullCharacter),n.publicId+=me;break}case m.GREATER_THAN_SIGN:{this._err(N.abruptDoctypePublicIdentifier),n.forceQuirks=!0,this.emitCurrentDoctype(n),this.state=g.DATA;break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:n.publicId+=String.fromCodePoint(t)}}_stateDoctypePublicIdentifierSingleQuoted(t){const n=this.currentToken;switch(t){case m.APOSTROPHE:{this.state=g.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break}case m.NULL:{this._err(N.unexpectedNullCharacter),n.publicId+=me;break}case m.GREATER_THAN_SIGN:{this._err(N.abruptDoctypePublicIdentifier),n.forceQuirks=!0,this.emitCurrentDoctype(n),this.state=g.DATA;break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:n.publicId+=String.fromCodePoint(t)}}_stateAfterDoctypePublicIdentifier(t){const n=this.currentToken;switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:{this.state=g.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;break}case m.GREATER_THAN_SIGN:{this.state=g.DATA,this.emitCurrentDoctype(n);break}case m.QUOTATION_MARK:{this._err(N.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),n.systemId="",this.state=g.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break}case m.APOSTROPHE:{this._err(N.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),n.systemId="",this.state=g.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:this._err(N.missingQuoteBeforeDoctypeSystemIdentifier),n.forceQuirks=!0,this.state=g.BOGUS_DOCTYPE,this._stateBogusDoctype(t)}}_stateBetweenDoctypePublicAndSystemIdentifiers(t){const n=this.currentToken;switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:break;case m.GREATER_THAN_SIGN:{this.emitCurrentDoctype(n),this.state=g.DATA;break}case m.QUOTATION_MARK:{n.systemId="",this.state=g.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break}case m.APOSTROPHE:{n.systemId="",this.state=g.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:this._err(N.missingQuoteBeforeDoctypeSystemIdentifier),n.forceQuirks=!0,this.state=g.BOGUS_DOCTYPE,this._stateBogusDoctype(t)}}_stateAfterDoctypeSystemKeyword(t){const n=this.currentToken;switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:{this.state=g.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;break}case m.QUOTATION_MARK:{this._err(N.missingWhitespaceAfterDoctypeSystemKeyword),n.systemId="",this.state=g.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break}case m.APOSTROPHE:{this._err(N.missingWhitespaceAfterDoctypeSystemKeyword),n.systemId="",this.state=g.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break}case m.GREATER_THAN_SIGN:{this._err(N.missingDoctypeSystemIdentifier),n.forceQuirks=!0,this.state=g.DATA,this.emitCurrentDoctype(n);break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:this._err(N.missingQuoteBeforeDoctypeSystemIdentifier),n.forceQuirks=!0,this.state=g.BOGUS_DOCTYPE,this._stateBogusDoctype(t)}}_stateBeforeDoctypeSystemIdentifier(t){const n=this.currentToken;switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:break;case m.QUOTATION_MARK:{n.systemId="",this.state=g.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break}case m.APOSTROPHE:{n.systemId="",this.state=g.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break}case m.GREATER_THAN_SIGN:{this._err(N.missingDoctypeSystemIdentifier),n.forceQuirks=!0,this.state=g.DATA,this.emitCurrentDoctype(n);break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:this._err(N.missingQuoteBeforeDoctypeSystemIdentifier),n.forceQuirks=!0,this.state=g.BOGUS_DOCTYPE,this._stateBogusDoctype(t)}}_stateDoctypeSystemIdentifierDoubleQuoted(t){const n=this.currentToken;switch(t){case m.QUOTATION_MARK:{this.state=g.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break}case m.NULL:{this._err(N.unexpectedNullCharacter),n.systemId+=me;break}case m.GREATER_THAN_SIGN:{this._err(N.abruptDoctypeSystemIdentifier),n.forceQuirks=!0,this.emitCurrentDoctype(n),this.state=g.DATA;break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:n.systemId+=String.fromCodePoint(t)}}_stateDoctypeSystemIdentifierSingleQuoted(t){const n=this.currentToken;switch(t){case m.APOSTROPHE:{this.state=g.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break}case m.NULL:{this._err(N.unexpectedNullCharacter),n.systemId+=me;break}case m.GREATER_THAN_SIGN:{this._err(N.abruptDoctypeSystemIdentifier),n.forceQuirks=!0,this.emitCurrentDoctype(n),this.state=g.DATA;break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:n.systemId+=String.fromCodePoint(t)}}_stateAfterDoctypeSystemIdentifier(t){const n=this.currentToken;switch(t){case m.SPACE:case m.LINE_FEED:case m.TABULATION:case m.FORM_FEED:break;case m.GREATER_THAN_SIGN:{this.emitCurrentDoctype(n),this.state=g.DATA;break}case m.EOF:{this._err(N.eofInDoctype),n.forceQuirks=!0,this.emitCurrentDoctype(n),this._emitEOFToken();break}default:this._err(N.unexpectedCharacterAfterDoctypeSystemIdentifier),this.state=g.BOGUS_DOCTYPE,this._stateBogusDoctype(t)}}_stateBogusDoctype(t){const n=this.currentToken;switch(t){case m.GREATER_THAN_SIGN:{this.emitCurrentDoctype(n),this.state=g.DATA;break}case m.NULL:{this._err(N.unexpectedNullCharacter);break}case m.EOF:{this.emitCurrentDoctype(n),this._emitEOFToken();break}}}_stateCdataSection(t){switch(t){case m.RIGHT_SQUARE_BRACKET:{this.state=g.CDATA_SECTION_BRACKET;break}case m.EOF:{this._err(N.eofInCdata),this._emitEOFToken();break}default:this._emitCodePoint(t)}}_stateCdataSectionBracket(t){t===m.RIGHT_SQUARE_BRACKET?this.state=g.CDATA_SECTION_END:(this._emitChars("]"),this.state=g.CDATA_SECTION,this._stateCdataSection(t))}_stateCdataSectionEnd(t){switch(t){case m.GREATER_THAN_SIGN:{this.state=g.DATA;break}case m.RIGHT_SQUARE_BRACKET:{this._emitChars("]");break}default:this._emitChars("]]"),this.state=g.CDATA_SECTION,this._stateCdataSection(t)}}_stateCharacterReference(){let t=this.entityDecoder.write(this.preprocessor.html,this.preprocessor.pos);if(t<0)if(this.preprocessor.lastChunkWritten)t=this.entityDecoder.end();else{this.active=!1,this.preprocessor.pos=this.preprocessor.html.length-1,this.consumedAfterSnapshot=0,this.preprocessor.endOfChunkHit=!0;return}t===0?(this.preprocessor.pos=this.entityStartPos,this._flushCodePointConsumedAsCharacterReference(m.AMPERSAND),this.state=!this._isCharacterReferenceInAttribute()&&eo(this.preprocessor.peek(1))?g.AMBIGUOUS_AMPERSAND:this.returnState):this.state=this.returnState}_stateAmbiguousAmpersand(t){eo(t)?this._flushCodePointConsumedAsCharacterReference(t):(t===m.SEMICOLON&&this._err(N.unknownNamedCharacterReference),this.state=this.returnState,this._callState(t))}}const Ws=new Set([s.DD,s.DT,s.LI,s.OPTGROUP,s.OPTION,s.P,s.RB,s.RP,s.RT,s.RTC]),no=new Set([...Ws,s.CAPTION,s.COLGROUP,s.TBODY,s.TD,s.TFOOT,s.TH,s.THEAD,s.TR]),Wn=new Set([s.APPLET,s.CAPTION,s.HTML,s.MARQUEE,s.OBJECT,s.TABLE,s.TD,s.TEMPLATE,s.TH]),uI=new Set([...Wn,s.OL,s.UL]),lI=new Set([...Wn,s.BUTTON]),io=new Set([s.ANNOTATION_XML,s.MI,s.MN,s.MO,s.MS,s.MTEXT]),ro=new Set([s.DESC,s.FOREIGN_OBJECT,s.TITLE]),cI=new Set([s.TR,s.TEMPLATE,s.HTML]),pI=new Set([s.TBODY,s.TFOOT,s.THEAD,s.TEMPLATE,s.HTML]),hI=new Set([s.TABLE,s.TEMPLATE,s.HTML]),dI=new Set([s.TD,s.TH]);class fI{get currentTmplContentOrNode(){return this._isInTemplate()?this.treeAdapter.getTemplateContent(this.current):this.current}constructor(t,n,i){this.treeAdapter=n,this.handler=i,this.items=[],this.tagIDs=[],this.stackTop=-1,this.tmplCount=0,this.currentTagId=s.UNKNOWN,this.current=t}_indexOf(t){return this.items.lastIndexOf(t,this.stackTop)}_isInTemplate(){return this.currentTagId===s.TEMPLATE&&this.treeAdapter.getNamespaceURI(this.current)===w.HTML}_updateCurrentElement(){this.current=this.items[this.stackTop],this.currentTagId=this.tagIDs[this.stackTop]}push(t,n){this.stackTop++,this.items[this.stackTop]=t,this.current=t,this.tagIDs[this.stackTop]=n,this.currentTagId=n,this._isInTemplate()&&this.tmplCount++,this.handler.onItemPush(t,n,!0)}pop(){const t=this.current;this.tmplCount>0&&this._isInTemplate()&&this.tmplCount--,this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(t,!0)}replace(t,n){const i=this._indexOf(t);this.items[i]=n,i===this.stackTop&&(this.current=n)}insertAfter(t,n,i){const r=this._indexOf(t)+1;this.items.splice(r,0,n),this.tagIDs.splice(r,0,i),this.stackTop++,r===this.stackTop&&this._updateCurrentElement(),this.handler.onItemPush(this.current,this.currentTagId,r===this.stackTop)}popUntilTagNamePopped(t){let n=this.stackTop+1;do n=this.tagIDs.lastIndexOf(t,n-1);while(n>0&&this.treeAdapter.getNamespaceURI(this.items[n])!==w.HTML);this.shortenToLength(n<0?0:n)}shortenToLength(t){for(;this.stackTop>=t;){const n=this.current;this.tmplCount>0&&this._isInTemplate()&&(this.tmplCount-=1),this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(n,this.stackTop<t)}}popUntilElementPopped(t){const n=this._indexOf(t);this.shortenToLength(n<0?0:n)}popUntilPopped(t,n){const i=this._indexOfTagNames(t,n);this.shortenToLength(i<0?0:i)}popUntilNumberedHeaderPopped(){this.popUntilPopped(Yi,w.HTML)}popUntilTableCellPopped(){this.popUntilPopped(dI,w.HTML)}popAllUpToHtmlElement(){this.tmplCount=0,this.shortenToLength(1)}_indexOfTagNames(t,n){for(let i=this.stackTop;i>=0;i--)if(t.has(this.tagIDs[i])&&this.treeAdapter.getNamespaceURI(this.items[i])===n)return i;return-1}clearBackTo(t,n){const i=this._indexOfTagNames(t,n);this.shortenToLength(i+1)}clearBackToTableContext(){this.clearBackTo(hI,w.HTML)}clearBackToTableBodyContext(){this.clearBackTo(pI,w.HTML)}clearBackToTableRowContext(){this.clearBackTo(cI,w.HTML)}remove(t){const n=this._indexOf(t);n>=0&&(n===this.stackTop?this.pop():(this.items.splice(n,1),this.tagIDs.splice(n,1),this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(t,!1)))}tryPeekProperlyNestedBodyElement(){return this.stackTop>=1&&this.tagIDs[1]===s.BODY?this.items[1]:null}contains(t){return this._indexOf(t)>-1}getCommonAncestor(t){const n=this._indexOf(t)-1;return n>=0?this.items[n]:null}isRootHtmlElementCurrent(){return this.stackTop===0&&this.tagIDs[0]===s.HTML}hasInDynamicScope(t,n){for(let i=this.stackTop;i>=0;i--){const r=this.tagIDs[i];switch(this.treeAdapter.getNamespaceURI(this.items[i])){case w.HTML:{if(r===t)return!0;if(n.has(r))return!1;break}case w.SVG:{if(ro.has(r))return!1;break}case w.MATHML:{if(io.has(r))return!1;break}}}return!0}hasInScope(t){return this.hasInDynamicScope(t,Wn)}hasInListItemScope(t){return this.hasInDynamicScope(t,uI)}hasInButtonScope(t){return this.hasInDynamicScope(t,lI)}hasNumberedHeaderInScope(){for(let t=this.stackTop;t>=0;t--){const n=this.tagIDs[t];switch(this.treeAdapter.getNamespaceURI(this.items[t])){case w.HTML:{if(Yi.has(n))return!0;if(Wn.has(n))return!1;break}case w.SVG:{if(ro.has(n))return!1;break}case w.MATHML:{if(io.has(n))return!1;break}}}return!0}hasInTableScope(t){for(let n=this.stackTop;n>=0;n--)if(this.treeAdapter.getNamespaceURI(this.items[n])===w.HTML)switch(this.tagIDs[n]){case t:return!0;case s.TABLE:case s.HTML:return!1}return!0}hasTableBodyContextInTableScope(){for(let t=this.stackTop;t>=0;t--)if(this.treeAdapter.getNamespaceURI(this.items[t])===w.HTML)switch(this.tagIDs[t]){case s.TBODY:case s.THEAD:case s.TFOOT:return!0;case s.TABLE:case s.HTML:return!1}return!0}hasInSelectScope(t){for(let n=this.stackTop;n>=0;n--)if(this.treeAdapter.getNamespaceURI(this.items[n])===w.HTML)switch(this.tagIDs[n]){case t:return!0;case s.OPTION:case s.OPTGROUP:break;default:return!1}return!0}generateImpliedEndTags(){for(;Ws.has(this.currentTagId);)this.pop()}generateImpliedEndTagsThoroughly(){for(;no.has(this.currentTagId);)this.pop()}generateImpliedEndTagsWithExclusion(t){for(;this.currentTagId!==t&&no.has(this.currentTagId);)this.pop()}}const Ri=3;var et;(function(e){e[e.Marker=0]="Marker",e[e.Element=1]="Element"})(et||(et={}));const ao={type:et.Marker};class mI{constructor(t){this.treeAdapter=t,this.entries=[],this.bookmark=null}_getNoahArkConditionCandidates(t,n){const i=[],r=n.length,a=this.treeAdapter.getTagName(t),o=this.treeAdapter.getNamespaceURI(t);for(let u=0;u<this.entries.length;u++){const l=this.entries[u];if(l.type===et.Marker)break;const{element:c}=l;if(this.treeAdapter.getTagName(c)===a&&this.treeAdapter.getNamespaceURI(c)===o){const p=this.treeAdapter.getAttrList(c);p.length===r&&i.push({idx:u,attrs:p})}}return i}_ensureNoahArkCondition(t){if(this.entries.length<Ri)return;const n=this.treeAdapter.getAttrList(t),i=this._getNoahArkConditionCandidates(t,n);if(i.length<Ri)return;const r=new Map(n.map(o=>[o.name,o.value]));let a=0;for(let o=0;o<i.length;o++){const u=i[o];u.attrs.every(l=>r.get(l.name)===l.value)&&(a+=1,a>=Ri&&this.entries.splice(u.idx,1))}}insertMarker(){this.entries.unshift(ao)}pushElement(t,n){this._ensureNoahArkCondition(t),this.entries.unshift({type:et.Element,element:t,token:n})}insertElementAfterBookmark(t,n){const i=this.entries.indexOf(this.bookmark);this.entries.splice(i,0,{type:et.Element,element:t,token:n})}removeEntry(t){const n=this.entries.indexOf(t);n>=0&&this.entries.splice(n,1)}clearToLastMarker(){const t=this.entries.indexOf(ao);t>=0?this.entries.splice(0,t+1):this.entries.length=0}getElementEntryInScopeWithTagName(t){const n=this.entries.find(i=>i.type===et.Marker||this.treeAdapter.getTagName(i.element)===t);return n&&n.type===et.Element?n:null}getElementEntry(t){return this.entries.find(n=>n.type===et.Element&&n.element===t)}}const dt={createDocument(){return{nodeName:"#document",mode:ze.NO_QUIRKS,childNodes:[]}},createDocumentFragment(){return{nodeName:"#document-fragment",childNodes:[]}},createElement(e,t,n){return{nodeName:e,tagName:e,attrs:n,namespaceURI:t,childNodes:[],parentNode:null}},createCommentNode(e){return{nodeName:"#comment",data:e,parentNode:null}},createTextNode(e){return{nodeName:"#text",value:e,parentNode:null}},appendChild(e,t){e.childNodes.push(t),t.parentNode=e},insertBefore(e,t,n){const i=e.childNodes.indexOf(n);e.childNodes.splice(i,0,t),t.parentNode=e},setTemplateContent(e,t){e.content=t},getTemplateContent(e){return e.content},setDocumentType(e,t,n,i){const r=e.childNodes.find(a=>a.nodeName==="#documentType");if(r)r.name=t,r.publicId=n,r.systemId=i;else{const a={nodeName:"#documentType",name:t,publicId:n,systemId:i,parentNode:null};dt.appendChild(e,a)}},setDocumentMode(e,t){e.mode=t},getDocumentMode(e){return e.mode},detachNode(e){if(e.parentNode){const t=e.parentNode.childNodes.indexOf(e);e.parentNode.childNodes.splice(t,1),e.parentNode=null}},insertText(e,t){if(e.childNodes.length>0){const n=e.childNodes[e.childNodes.length-1];if(dt.isTextNode(n)){n.value+=t;return}}dt.appendChild(e,dt.createTextNode(t))},insertTextBefore(e,t,n){const i=e.childNodes[e.childNodes.indexOf(n)-1];i&&dt.isTextNode(i)?i.value+=t:dt.insertBefore(e,dt.createTextNode(t),n)},adoptAttributes(e,t){const n=new Set(e.attrs.map(i=>i.name));for(let i=0;i<t.length;i++)n.has(t[i].name)||e.attrs.push(t[i])},getFirstChild(e){return e.childNodes[0]},getChildNodes(e){return e.childNodes},getParentNode(e){return e.parentNode},getAttrList(e){return e.attrs},getTagName(e){return e.tagName},getNamespaceURI(e){return e.namespaceURI},getTextNodeContent(e){return e.value},getCommentNodeContent(e){return e.data},getDocumentTypeNodeName(e){return e.name},getDocumentTypeNodePublicId(e){return e.publicId},getDocumentTypeNodeSystemId(e){return e.systemId},isTextNode(e){return e.nodeName==="#text"},isCommentNode(e){return e.nodeName==="#comment"},isDocumentTypeNode(e){return e.nodeName==="#documentType"},isElementNode(e){return Object.prototype.hasOwnProperty.call(e,"tagName")},setNodeSourceCodeLocation(e,t){e.sourceCodeLocation=t},getNodeSourceCodeLocation(e){return e.sourceCodeLocation},updateNodeSourceCodeLocation(e,t){e.sourceCodeLocation={...e.sourceCodeLocation,...t}}},Ys="html",II="about:legacy-compat",gI="http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd",Ks=["+//silmaril//dtd html pro v0r11 19970101//","-//as//dtd html 3.0 aswedit + extensions//","-//advasoft ltd//dtd html 3.0 aswedit + extensions//","-//ietf//dtd html 2.0 level 1//","-//ietf//dtd html 2.0 level 2//","-//ietf//dtd html 2.0 strict level 1//","-//ietf//dtd html 2.0 strict level 2//","-//ietf//dtd html 2.0 strict//","-//ietf//dtd html 2.0//","-//ietf//dtd html 2.1e//","-//ietf//dtd html 3.0//","-//ietf//dtd html 3.2 final//","-//ietf//dtd html 3.2//","-//ietf//dtd html 3//","-//ietf//dtd html level 0//","-//ietf//dtd html level 1//","-//ietf//dtd html level 2//","-//ietf//dtd html level 3//","-//ietf//dtd html strict level 0//","-//ietf//dtd html strict level 1//","-//ietf//dtd html strict level 2//","-//ietf//dtd html strict level 3//","-//ietf//dtd html strict//","-//ietf//dtd html//","-//metrius//dtd metrius presentational//","-//microsoft//dtd internet explorer 2.0 html strict//","-//microsoft//dtd internet explorer 2.0 html//","-//microsoft//dtd internet explorer 2.0 tables//","-//microsoft//dtd internet explorer 3.0 html strict//","-//microsoft//dtd internet explorer 3.0 html//","-//microsoft//dtd internet explorer 3.0 tables//","-//netscape comm. corp.//dtd html//","-//netscape comm. corp.//dtd strict html//","-//o'reilly and associates//dtd html 2.0//","-//o'reilly and associates//dtd html extended 1.0//","-//o'reilly and associates//dtd html extended relaxed 1.0//","-//sq//dtd html 2.0 hotmetal + extensions//","-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//","-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//","-//spyglass//dtd html 2.0 extended//","-//sun microsystems corp.//dtd hotjava html//","-//sun microsystems corp.//dtd hotjava strict html//","-//w3c//dtd html 3 1995-03-24//","-//w3c//dtd html 3.2 draft//","-//w3c//dtd html 3.2 final//","-//w3c//dtd html 3.2//","-//w3c//dtd html 3.2s draft//","-//w3c//dtd html 4.0 frameset//","-//w3c//dtd html 4.0 transitional//","-//w3c//dtd html experimental 19960712//","-//w3c//dtd html experimental 970421//","-//w3c//dtd w3 html//","-//w3o//dtd w3 html 3.0//","-//webtechs//dtd mozilla html 2.0//","-//webtechs//dtd mozilla html//"],yI=[...Ks,"-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"],bI=new Set(["-//w3o//dtd w3 html strict 3.0//en//","-/w3c/dtd html 4.0 transitional/en","html"]),Qs=["-//w3c//dtd xhtml 1.0 frameset//","-//w3c//dtd xhtml 1.0 transitional//"],SI=[...Qs,"-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"];function oo(e,t){return t.some(n=>e.startsWith(n))}function AI(e){return e.name===Ys&&e.publicId===null&&(e.systemId===null||e.systemId===II)}function EI(e){if(e.name!==Ys)return ze.QUIRKS;const{systemId:t}=e;if(t&&t.toLowerCase()===gI)return ze.QUIRKS;let{publicId:n}=e;if(n!==null){if(n=n.toLowerCase(),bI.has(n))return ze.QUIRKS;let i=t===null?yI:Ks;if(oo(n,i))return ze.QUIRKS;if(i=t===null?Qs:SI,oo(n,i))return ze.LIMITED_QUIRKS}return ze.NO_QUIRKS}const so={TEXT_HTML:"text/html",APPLICATION_XML:"application/xhtml+xml"},TI="definitionurl",CI="definitionURL",kI=new Map(["attributeName","attributeType","baseFrequency","baseProfile","calcMode","clipPathUnits","diffuseConstant","edgeMode","filterUnits","glyphRef","gradientTransform","gradientUnits","kernelMatrix","kernelUnitLength","keyPoints","keySplines","keyTimes","lengthAdjust","limitingConeAngle","markerHeight","markerUnits","markerWidth","maskContentUnits","maskUnits","numOctaves","pathLength","patternContentUnits","patternTransform","patternUnits","pointsAtX","pointsAtY","pointsAtZ","preserveAlpha","preserveAspectRatio","primitiveUnits","refX","refY","repeatCount","repeatDur","requiredExtensions","requiredFeatures","specularConstant","specularExponent","spreadMethod","startOffset","stdDeviation","stitchTiles","surfaceScale","systemLanguage","tableValues","targetX","targetY","textLength","viewBox","viewTarget","xChannelSelector","yChannelSelector","zoomAndPan"].map(e=>[e.toLowerCase(),e])),OI=new Map([["xlink:actuate",{prefix:"xlink",name:"actuate",namespace:w.XLINK}],["xlink:arcrole",{prefix:"xlink",name:"arcrole",namespace:w.XLINK}],["xlink:href",{prefix:"xlink",name:"href",namespace:w.XLINK}],["xlink:role",{prefix:"xlink",name:"role",namespace:w.XLINK}],["xlink:show",{prefix:"xlink",name:"show",namespace:w.XLINK}],["xlink:title",{prefix:"xlink",name:"title",namespace:w.XLINK}],["xlink:type",{prefix:"xlink",name:"type",namespace:w.XLINK}],["xml:lang",{prefix:"xml",name:"lang",namespace:w.XML}],["xml:space",{prefix:"xml",name:"space",namespace:w.XML}],["xmlns",{prefix:"",name:"xmlns",namespace:w.XMLNS}],["xmlns:xlink",{prefix:"xmlns",name:"xlink",namespace:w.XMLNS}]]),_I=new Map(["altGlyph","altGlyphDef","altGlyphItem","animateColor","animateMotion","animateTransform","clipPath","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","foreignObject","glyphRef","linearGradient","radialGradient","textPath"].map(e=>[e.toLowerCase(),e])),xI=new Set([s.B,s.BIG,s.BLOCKQUOTE,s.BODY,s.BR,s.CENTER,s.CODE,s.DD,s.DIV,s.DL,s.DT,s.EM,s.EMBED,s.H1,s.H2,s.H3,s.H4,s.H5,s.H6,s.HEAD,s.HR,s.I,s.IMG,s.LI,s.LISTING,s.MENU,s.META,s.NOBR,s.OL,s.P,s.PRE,s.RUBY,s.S,s.SMALL,s.SPAN,s.STRONG,s.STRIKE,s.SUB,s.SUP,s.TABLE,s.TT,s.U,s.UL,s.VAR]);function NI(e){const t=e.tagID;return t===s.FONT&&e.attrs.some(({name:i})=>i===kt.COLOR||i===kt.SIZE||i===kt.FACE)||xI.has(t)}function Xs(e){for(let t=0;t<e.attrs.length;t++)if(e.attrs[t].name===TI){e.attrs[t].name=CI;break}}function Zs(e){for(let t=0;t<e.attrs.length;t++){const n=kI.get(e.attrs[t].name);n!=null&&(e.attrs[t].name=n)}}function xr(e){for(let t=0;t<e.attrs.length;t++){const n=OI.get(e.attrs[t].name);n&&(e.attrs[t].prefix=n.prefix,e.attrs[t].name=n.name,e.attrs[t].namespace=n.namespace)}}function vI(e){const t=_I.get(e.tagName);t!=null&&(e.tagName=t,e.tagID=Wt(e.tagName))}function RI(e,t){return t===w.MATHML&&(e===s.MI||e===s.MO||e===s.MN||e===s.MS||e===s.MTEXT)}function PI(e,t,n){if(t===w.MATHML&&e===s.ANNOTATION_XML){for(let i=0;i<n.length;i++)if(n[i].name===kt.ENCODING){const r=n[i].value.toLowerCase();return r===so.TEXT_HTML||r===so.APPLICATION_XML}}return t===w.SVG&&(e===s.FOREIGN_OBJECT||e===s.DESC||e===s.TITLE)}function wI(e,t,n,i){return(!i||i===w.HTML)&&PI(e,t,n)||(!i||i===w.MATHML)&&RI(e,t)}const DI="hidden",LI=8,MI=3;var y;(function(e){e[e.INITIAL=0]="INITIAL",e[e.BEFORE_HTML=1]="BEFORE_HTML",e[e.BEFORE_HEAD=2]="BEFORE_HEAD",e[e.IN_HEAD=3]="IN_HEAD",e[e.IN_HEAD_NO_SCRIPT=4]="IN_HEAD_NO_SCRIPT",e[e.AFTER_HEAD=5]="AFTER_HEAD",e[e.IN_BODY=6]="IN_BODY",e[e.TEXT=7]="TEXT",e[e.IN_TABLE=8]="IN_TABLE",e[e.IN_TABLE_TEXT=9]="IN_TABLE_TEXT",e[e.IN_CAPTION=10]="IN_CAPTION",e[e.IN_COLUMN_GROUP=11]="IN_COLUMN_GROUP",e[e.IN_TABLE_BODY=12]="IN_TABLE_BODY",e[e.IN_ROW=13]="IN_ROW",e[e.IN_CELL=14]="IN_CELL",e[e.IN_SELECT=15]="IN_SELECT",e[e.IN_SELECT_IN_TABLE=16]="IN_SELECT_IN_TABLE",e[e.IN_TEMPLATE=17]="IN_TEMPLATE",e[e.AFTER_BODY=18]="AFTER_BODY",e[e.IN_FRAMESET=19]="IN_FRAMESET",e[e.AFTER_FRAMESET=20]="AFTER_FRAMESET",e[e.AFTER_AFTER_BODY=21]="AFTER_AFTER_BODY",e[e.AFTER_AFTER_FRAMESET=22]="AFTER_AFTER_FRAMESET"})(y||(y={}));const BI={startLine:-1,startCol:-1,startOffset:-1,endLine:-1,endCol:-1,endOffset:-1},eu=new Set([s.TABLE,s.TBODY,s.TFOOT,s.THEAD,s.TR]),uo={scriptingEnabled:!0,sourceCodeLocationInfo:!1,treeAdapter:dt,onParseError:null};class lo{constructor(t,n,i=null,r=null){this.fragmentContext=i,this.scriptHandler=r,this.currentToken=null,this.stopped=!1,this.insertionMode=y.INITIAL,this.originalInsertionMode=y.INITIAL,this.headElement=null,this.formElement=null,this.currentNotInHTML=!1,this.tmplInsertionModeStack=[],this.pendingCharacterTokens=[],this.hasNonWhitespacePendingCharacterToken=!1,this.framesetOk=!0,this.skipNextNewLine=!1,this.fosterParentingEnabled=!1,this.options={...uo,...t},this.treeAdapter=this.options.treeAdapter,this.onParseError=this.options.onParseError,this.onParseError&&(this.options.sourceCodeLocationInfo=!0),this.document=n??this.treeAdapter.createDocument(),this.tokenizer=new sI(this.options,this),this.activeFormattingElements=new mI(this.treeAdapter),this.fragmentContextID=i?Wt(this.treeAdapter.getTagName(i)):s.UNKNOWN,this._setContextModes(i??this.document,this.fragmentContextID),this.openElements=new fI(this.document,this.treeAdapter,this)}static parse(t,n){const i=new this(n);return i.tokenizer.write(t,!0),i.document}static getFragmentParser(t,n){const i={...uo,...n};t??(t=i.treeAdapter.createElement(k.TEMPLATE,w.HTML,[]));const r=i.treeAdapter.createElement("documentmock",w.HTML,[]),a=new this(i,r,t);return a.fragmentContextID===s.TEMPLATE&&a.tmplInsertionModeStack.unshift(y.IN_TEMPLATE),a._initTokenizerForFragmentParsing(),a._insertFakeRootElement(),a._resetInsertionMode(),a._findFormInFragmentContext(),a}getFragment(){const t=this.treeAdapter.getFirstChild(this.document),n=this.treeAdapter.createDocumentFragment();return this._adoptNodes(t,n),n}_err(t,n,i){var r;if(!this.onParseError)return;const a=(r=t.location)!==null&&r!==void 0?r:BI,o={code:n,startLine:a.startLine,startCol:a.startCol,startOffset:a.startOffset,endLine:i?a.startLine:a.endLine,endCol:i?a.startCol:a.endCol,endOffset:i?a.startOffset:a.endOffset};this.onParseError(o)}onItemPush(t,n,i){var r,a;(a=(r=this.treeAdapter).onItemPush)===null||a===void 0||a.call(r,t),i&&this.openElements.stackTop>0&&this._setContextModes(t,n)}onItemPop(t,n){var i,r;if(this.options.sourceCodeLocationInfo&&this._setEndLocation(t,this.currentToken),(r=(i=this.treeAdapter).onItemPop)===null||r===void 0||r.call(i,t,this.openElements.current),n){let a,o;this.openElements.stackTop===0&&this.fragmentContext?(a=this.fragmentContext,o=this.fragmentContextID):{current:a,currentTagId:o}=this.openElements,this._setContextModes(a,o)}}_setContextModes(t,n){const i=t===this.document||this.treeAdapter.getNamespaceURI(t)===w.HTML;this.currentNotInHTML=!i,this.tokenizer.inForeignNode=!i&&!this._isIntegrationPoint(n,t)}_switchToTextParsing(t,n){this._insertElement(t,w.HTML),this.tokenizer.state=n,this.originalInsertionMode=this.insertionMode,this.insertionMode=y.TEXT}switchToPlaintextParsing(){this.insertionMode=y.TEXT,this.originalInsertionMode=y.IN_BODY,this.tokenizer.state=Ie.PLAINTEXT}_getAdjustedCurrentElement(){return this.openElements.stackTop===0&&this.fragmentContext?this.fragmentContext:this.openElements.current}_findFormInFragmentContext(){let t=this.fragmentContext;for(;t;){if(this.treeAdapter.getTagName(t)===k.FORM){this.formElement=t;break}t=this.treeAdapter.getParentNode(t)}}_initTokenizerForFragmentParsing(){if(!(!this.fragmentContext||this.treeAdapter.getNamespaceURI(this.fragmentContext)!==w.HTML))switch(this.fragmentContextID){case s.TITLE:case s.TEXTAREA:{this.tokenizer.state=Ie.RCDATA;break}case s.STYLE:case s.XMP:case s.IFRAME:case s.NOEMBED:case s.NOFRAMES:case s.NOSCRIPT:{this.tokenizer.state=Ie.RAWTEXT;break}case s.SCRIPT:{this.tokenizer.state=Ie.SCRIPT_DATA;break}case s.PLAINTEXT:{this.tokenizer.state=Ie.PLAINTEXT;break}}}_setDocumentType(t){const n=t.name||"",i=t.publicId||"",r=t.systemId||"";if(this.treeAdapter.setDocumentType(this.document,n,i,r),t.location){const o=this.treeAdapter.getChildNodes(this.document).find(u=>this.treeAdapter.isDocumentTypeNode(u));o&&this.treeAdapter.setNodeSourceCodeLocation(o,t.location)}}_attachElementToTree(t,n){if(this.options.sourceCodeLocationInfo){const i=n&&{...n,startTag:n};this.treeAdapter.setNodeSourceCodeLocation(t,i)}if(this._shouldFosterParentOnInsertion())this._fosterParentElement(t);else{const i=this.openElements.currentTmplContentOrNode;this.treeAdapter.appendChild(i,t)}}_appendElement(t,n){const i=this.treeAdapter.createElement(t.tagName,n,t.attrs);this._attachElementToTree(i,t.location)}_insertElement(t,n){const i=this.treeAdapter.createElement(t.tagName,n,t.attrs);this._attachElementToTree(i,t.location),this.openElements.push(i,t.tagID)}_insertFakeElement(t,n){const i=this.treeAdapter.createElement(t,w.HTML,[]);this._attachElementToTree(i,null),this.openElements.push(i,n)}_insertTemplate(t){const n=this.treeAdapter.createElement(t.tagName,w.HTML,t.attrs),i=this.treeAdapter.createDocumentFragment();this.treeAdapter.setTemplateContent(n,i),this._attachElementToTree(n,t.location),this.openElements.push(n,t.tagID),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(i,null)}_insertFakeRootElement(){const t=this.treeAdapter.createElement(k.HTML,w.HTML,[]);this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(t,null),this.treeAdapter.appendChild(this.openElements.current,t),this.openElements.push(t,s.HTML)}_appendCommentNode(t,n){const i=this.treeAdapter.createCommentNode(t.data);this.treeAdapter.appendChild(n,i),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(i,t.location)}_insertCharacters(t){let n,i;if(this._shouldFosterParentOnInsertion()?({parent:n,beforeElement:i}=this._findFosterParentingLocation(),i?this.treeAdapter.insertTextBefore(n,t.chars,i):this.treeAdapter.insertText(n,t.chars)):(n=this.openElements.currentTmplContentOrNode,this.treeAdapter.insertText(n,t.chars)),!t.location)return;const r=this.treeAdapter.getChildNodes(n),a=i?r.lastIndexOf(i):r.length,o=r[a-1];if(this.treeAdapter.getNodeSourceCodeLocation(o)){const{endLine:l,endCol:c,endOffset:p}=t.location;this.treeAdapter.updateNodeSourceCodeLocation(o,{endLine:l,endCol:c,endOffset:p})}else this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(o,t.location)}_adoptNodes(t,n){for(let i=this.treeAdapter.getFirstChild(t);i;i=this.treeAdapter.getFirstChild(t))this.treeAdapter.detachNode(i),this.treeAdapter.appendChild(n,i)}_setEndLocation(t,n){if(this.treeAdapter.getNodeSourceCodeLocation(t)&&n.location){const i=n.location,r=this.treeAdapter.getTagName(t),a=n.type===ae.END_TAG&&r===n.tagName?{endTag:{...i},endLine:i.endLine,endCol:i.endCol,endOffset:i.endOffset}:{endLine:i.startLine,endCol:i.startCol,endOffset:i.startOffset};this.treeAdapter.updateNodeSourceCodeLocation(t,a)}}shouldProcessStartTagTokenInForeignContent(t){if(!this.currentNotInHTML)return!1;let n,i;return this.openElements.stackTop===0&&this.fragmentContext?(n=this.fragmentContext,i=this.fragmentContextID):{current:n,currentTagId:i}=this.openElements,t.tagID===s.SVG&&this.treeAdapter.getTagName(n)===k.ANNOTATION_XML&&this.treeAdapter.getNamespaceURI(n)===w.MATHML?!1:this.tokenizer.inForeignNode||(t.tagID===s.MGLYPH||t.tagID===s.MALIGNMARK)&&!this._isIntegrationPoint(i,n,w.HTML)}_processToken(t){switch(t.type){case ae.CHARACTER:{this.onCharacter(t);break}case ae.NULL_CHARACTER:{this.onNullCharacter(t);break}case ae.COMMENT:{this.onComment(t);break}case ae.DOCTYPE:{this.onDoctype(t);break}case ae.START_TAG:{this._processStartTag(t);break}case ae.END_TAG:{this.onEndTag(t);break}case ae.EOF:{this.onEof(t);break}case ae.WHITESPACE_CHARACTER:{this.onWhitespaceCharacter(t);break}}}_isIntegrationPoint(t,n,i){const r=this.treeAdapter.getNamespaceURI(n),a=this.treeAdapter.getAttrList(n);return wI(t,r,a,i)}_reconstructActiveFormattingElements(){const t=this.activeFormattingElements.entries.length;if(t){const n=this.activeFormattingElements.entries.findIndex(r=>r.type===et.Marker||this.openElements.contains(r.element)),i=n<0?t-1:n-1;for(let r=i;r>=0;r--){const a=this.activeFormattingElements.entries[r];this._insertElement(a.token,this.treeAdapter.getNamespaceURI(a.element)),a.element=this.openElements.current}}}_closeTableCell(){this.openElements.generateImpliedEndTags(),this.openElements.popUntilTableCellPopped(),this.activeFormattingElements.clearToLastMarker(),this.insertionMode=y.IN_ROW}_closePElement(){this.openElements.generateImpliedEndTagsWithExclusion(s.P),this.openElements.popUntilTagNamePopped(s.P)}_resetInsertionMode(){for(let t=this.openElements.stackTop;t>=0;t--)switch(t===0&&this.fragmentContext?this.fragmentContextID:this.openElements.tagIDs[t]){case s.TR:{this.insertionMode=y.IN_ROW;return}case s.TBODY:case s.THEAD:case s.TFOOT:{this.insertionMode=y.IN_TABLE_BODY;return}case s.CAPTION:{this.insertionMode=y.IN_CAPTION;return}case s.COLGROUP:{this.insertionMode=y.IN_COLUMN_GROUP;return}case s.TABLE:{this.insertionMode=y.IN_TABLE;return}case s.BODY:{this.insertionMode=y.IN_BODY;return}case s.FRAMESET:{this.insertionMode=y.IN_FRAMESET;return}case s.SELECT:{this._resetInsertionModeForSelect(t);return}case s.TEMPLATE:{this.insertionMode=this.tmplInsertionModeStack[0];return}case s.HTML:{this.insertionMode=this.headElement?y.AFTER_HEAD:y.BEFORE_HEAD;return}case s.TD:case s.TH:{if(t>0){this.insertionMode=y.IN_CELL;return}break}case s.HEAD:{if(t>0){this.insertionMode=y.IN_HEAD;return}break}}this.insertionMode=y.IN_BODY}_resetInsertionModeForSelect(t){if(t>0)for(let n=t-1;n>0;n--){const i=this.openElements.tagIDs[n];if(i===s.TEMPLATE)break;if(i===s.TABLE){this.insertionMode=y.IN_SELECT_IN_TABLE;return}}this.insertionMode=y.IN_SELECT}_isElementCausesFosterParenting(t){return eu.has(t)}_shouldFosterParentOnInsertion(){return this.fosterParentingEnabled&&this._isElementCausesFosterParenting(this.openElements.currentTagId)}_findFosterParentingLocation(){for(let t=this.openElements.stackTop;t>=0;t--){const n=this.openElements.items[t];switch(this.openElements.tagIDs[t]){case s.TEMPLATE:{if(this.treeAdapter.getNamespaceURI(n)===w.HTML)return{parent:this.treeAdapter.getTemplateContent(n),beforeElement:null};break}case s.TABLE:{const i=this.treeAdapter.getParentNode(n);return i?{parent:i,beforeElement:n}:{parent:this.openElements.items[t-1],beforeElement:null}}}}return{parent:this.openElements.items[0],beforeElement:null}}_fosterParentElement(t){const n=this._findFosterParentingLocation();n.beforeElement?this.treeAdapter.insertBefore(n.parent,t,n.beforeElement):this.treeAdapter.appendChild(n.parent,t)}_isSpecialElement(t,n){const i=this.treeAdapter.getNamespaceURI(t);return iI[i].has(n)}onCharacter(t){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode){dy(this,t);return}switch(this.insertionMode){case y.INITIAL:{en(this,t);break}case y.BEFORE_HTML:{ln(this,t);break}case y.BEFORE_HEAD:{cn(this,t);break}case y.IN_HEAD:{pn(this,t);break}case y.IN_HEAD_NO_SCRIPT:{hn(this,t);break}case y.AFTER_HEAD:{dn(this,t);break}case y.IN_BODY:case y.IN_CAPTION:case y.IN_CELL:case y.IN_TEMPLATE:{nu(this,t);break}case y.TEXT:case y.IN_SELECT:case y.IN_SELECT_IN_TABLE:{this._insertCharacters(t);break}case y.IN_TABLE:case y.IN_TABLE_BODY:case y.IN_ROW:{Pi(this,t);break}case y.IN_TABLE_TEXT:{uu(this,t);break}case y.IN_COLUMN_GROUP:{Yn(this,t);break}case y.AFTER_BODY:{Kn(this,t);break}case y.AFTER_AFTER_BODY:{jn(this,t);break}}}onNullCharacter(t){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode){hy(this,t);return}switch(this.insertionMode){case y.INITIAL:{en(this,t);break}case y.BEFORE_HTML:{ln(this,t);break}case y.BEFORE_HEAD:{cn(this,t);break}case y.IN_HEAD:{pn(this,t);break}case y.IN_HEAD_NO_SCRIPT:{hn(this,t);break}case y.AFTER_HEAD:{dn(this,t);break}case y.TEXT:{this._insertCharacters(t);break}case y.IN_TABLE:case y.IN_TABLE_BODY:case y.IN_ROW:{Pi(this,t);break}case y.IN_COLUMN_GROUP:{Yn(this,t);break}case y.AFTER_BODY:{Kn(this,t);break}case y.AFTER_AFTER_BODY:{jn(this,t);break}}}onComment(t){if(this.skipNextNewLine=!1,this.currentNotInHTML){Ki(this,t);return}switch(this.insertionMode){case y.INITIAL:case y.BEFORE_HTML:case y.BEFORE_HEAD:case y.IN_HEAD:case y.IN_HEAD_NO_SCRIPT:case y.AFTER_HEAD:case y.IN_BODY:case y.IN_TABLE:case y.IN_CAPTION:case y.IN_COLUMN_GROUP:case y.IN_TABLE_BODY:case y.IN_ROW:case y.IN_CELL:case y.IN_SELECT:case y.IN_SELECT_IN_TABLE:case y.IN_TEMPLATE:case y.IN_FRAMESET:case y.AFTER_FRAMESET:{Ki(this,t);break}case y.IN_TABLE_TEXT:{tn(this,t);break}case y.AFTER_BODY:{$I(this,t);break}case y.AFTER_AFTER_BODY:case y.AFTER_AFTER_FRAMESET:{qI(this,t);break}}}onDoctype(t){switch(this.skipNextNewLine=!1,this.insertionMode){case y.INITIAL:{VI(this,t);break}case y.BEFORE_HEAD:case y.IN_HEAD:case y.IN_HEAD_NO_SCRIPT:case y.AFTER_HEAD:{this._err(t,N.misplacedDoctype);break}case y.IN_TABLE_TEXT:{tn(this,t);break}}}onStartTag(t){this.skipNextNewLine=!1,this.currentToken=t,this._processStartTag(t),t.selfClosing&&!t.ackSelfClosing&&this._err(t,N.nonVoidHtmlElementStartTagWithTrailingSolidus)}_processStartTag(t){this.shouldProcessStartTagTokenInForeignContent(t)?fy(this,t):this._startTagOutsideForeignContent(t)}_startTagOutsideForeignContent(t){switch(this.insertionMode){case y.INITIAL:{en(this,t);break}case y.BEFORE_HTML:{zI(this,t);break}case y.BEFORE_HEAD:{YI(this,t);break}case y.IN_HEAD:{Xe(this,t);break}case y.IN_HEAD_NO_SCRIPT:{XI(this,t);break}case y.AFTER_HEAD:{eg(this,t);break}case y.IN_BODY:{Pe(this,t);break}case y.IN_TABLE:{Jt(this,t);break}case y.IN_TABLE_TEXT:{tn(this,t);break}case y.IN_CAPTION:{Kg(this,t);break}case y.IN_COLUMN_GROUP:{Rr(this,t);break}case y.IN_TABLE_BODY:{di(this,t);break}case y.IN_ROW:{fi(this,t);break}case y.IN_CELL:{Zg(this,t);break}case y.IN_SELECT:{pu(this,t);break}case y.IN_SELECT_IN_TABLE:{ty(this,t);break}case y.IN_TEMPLATE:{iy(this,t);break}case y.AFTER_BODY:{ay(this,t);break}case y.IN_FRAMESET:{oy(this,t);break}case y.AFTER_FRAMESET:{uy(this,t);break}case y.AFTER_AFTER_BODY:{cy(this,t);break}case y.AFTER_AFTER_FRAMESET:{py(this,t);break}}}onEndTag(t){this.skipNextNewLine=!1,this.currentToken=t,this.currentNotInHTML?my(this,t):this._endTagOutsideForeignContent(t)}_endTagOutsideForeignContent(t){switch(this.insertionMode){case y.INITIAL:{en(this,t);break}case y.BEFORE_HTML:{WI(this,t);break}case y.BEFORE_HEAD:{KI(this,t);break}case y.IN_HEAD:{QI(this,t);break}case y.IN_HEAD_NO_SCRIPT:{ZI(this,t);break}case y.AFTER_HEAD:{tg(this,t);break}case y.IN_BODY:{hi(this,t);break}case y.TEXT:{Hg(this,t);break}case y.IN_TABLE:{yn(this,t);break}case y.IN_TABLE_TEXT:{tn(this,t);break}case y.IN_CAPTION:{Qg(this,t);break}case y.IN_COLUMN_GROUP:{Xg(this,t);break}case y.IN_TABLE_BODY:{Qi(this,t);break}case y.IN_ROW:{cu(this,t);break}case y.IN_CELL:{ey(this,t);break}case y.IN_SELECT:{hu(this,t);break}case y.IN_SELECT_IN_TABLE:{ny(this,t);break}case y.IN_TEMPLATE:{ry(this,t);break}case y.AFTER_BODY:{fu(this,t);break}case y.IN_FRAMESET:{sy(this,t);break}case y.AFTER_FRAMESET:{ly(this,t);break}case y.AFTER_AFTER_BODY:{jn(this,t);break}}}onEof(t){switch(this.insertionMode){case y.INITIAL:{en(this,t);break}case y.BEFORE_HTML:{ln(this,t);break}case y.BEFORE_HEAD:{cn(this,t);break}case y.IN_HEAD:{pn(this,t);break}case y.IN_HEAD_NO_SCRIPT:{hn(this,t);break}case y.AFTER_HEAD:{dn(this,t);break}case y.IN_BODY:case y.IN_TABLE:case y.IN_CAPTION:case y.IN_COLUMN_GROUP:case y.IN_TABLE_BODY:case y.IN_ROW:case y.IN_CELL:case y.IN_SELECT:case y.IN_SELECT_IN_TABLE:{ou(this,t);break}case y.TEXT:{Jg(this,t);break}case y.IN_TABLE_TEXT:{tn(this,t);break}case y.IN_TEMPLATE:{du(this,t);break}case y.AFTER_BODY:case y.IN_FRAMESET:case y.AFTER_FRAMESET:case y.AFTER_AFTER_BODY:case y.AFTER_AFTER_FRAMESET:{vr(this,t);break}}}onWhitespaceCharacter(t){if(this.skipNextNewLine&&(this.skipNextNewLine=!1,t.chars.charCodeAt(0)===m.LINE_FEED)){if(t.chars.length===1)return;t.chars=t.chars.substr(1)}if(this.tokenizer.inForeignNode){this._insertCharacters(t);return}switch(this.insertionMode){case y.IN_HEAD:case y.IN_HEAD_NO_SCRIPT:case y.AFTER_HEAD:case y.TEXT:case y.IN_COLUMN_GROUP:case y.IN_SELECT:case y.IN_SELECT_IN_TABLE:case y.IN_FRAMESET:case y.AFTER_FRAMESET:{this._insertCharacters(t);break}case y.IN_BODY:case y.IN_CAPTION:case y.IN_CELL:case y.IN_TEMPLATE:case y.AFTER_BODY:case y.AFTER_AFTER_BODY:case y.AFTER_AFTER_FRAMESET:{tu(this,t);break}case y.IN_TABLE:case y.IN_TABLE_BODY:case y.IN_ROW:{Pi(this,t);break}case y.IN_TABLE_TEXT:{su(this,t);break}}}}function GI(e,t){let n=e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);return n?e.openElements.contains(n.element)?e.openElements.hasInScope(t.tagID)||(n=null):(e.activeFormattingElements.removeEntry(n),n=null):au(e,t),n}function FI(e,t){let n=null,i=e.openElements.stackTop;for(;i>=0;i--){const r=e.openElements.items[i];if(r===t.element)break;e._isSpecialElement(r,e.openElements.tagIDs[i])&&(n=r)}return n||(e.openElements.shortenToLength(i<0?0:i),e.activeFormattingElements.removeEntry(t)),n}function HI(e,t,n){let i=t,r=e.openElements.getCommonAncestor(t);for(let a=0,o=r;o!==n;a++,o=r){r=e.openElements.getCommonAncestor(o);const u=e.activeFormattingElements.getElementEntry(o),l=u&&a>=MI;!u||l?(l&&e.activeFormattingElements.removeEntry(u),e.openElements.remove(o)):(o=JI(e,u),i===t&&(e.activeFormattingElements.bookmark=u),e.treeAdapter.detachNode(i),e.treeAdapter.appendChild(o,i),i=o)}return i}function JI(e,t){const n=e.treeAdapter.getNamespaceURI(t.element),i=e.treeAdapter.createElement(t.token.tagName,n,t.token.attrs);return e.openElements.replace(t.element,i),t.element=i,i}function UI(e,t,n){const i=e.treeAdapter.getTagName(t),r=Wt(i);if(e._isElementCausesFosterParenting(r))e._fosterParentElement(n);else{const a=e.treeAdapter.getNamespaceURI(t);r===s.TEMPLATE&&a===w.HTML&&(t=e.treeAdapter.getTemplateContent(t)),e.treeAdapter.appendChild(t,n)}}function jI(e,t,n){const i=e.treeAdapter.getNamespaceURI(n.element),{token:r}=n,a=e.treeAdapter.createElement(r.tagName,i,r.attrs);e._adoptNodes(t,a),e.treeAdapter.appendChild(t,a),e.activeFormattingElements.insertElementAfterBookmark(a,r),e.activeFormattingElements.removeEntry(n),e.openElements.remove(n.element),e.openElements.insertAfter(t,a,r.tagID)}function Nr(e,t){for(let n=0;n<LI;n++){const i=GI(e,t);if(!i)break;const r=FI(e,i);if(!r)break;e.activeFormattingElements.bookmark=i;const a=HI(e,r,i.element),o=e.openElements.getCommonAncestor(i.element);e.treeAdapter.detachNode(a),o&&UI(e,o,a),jI(e,r,i)}}function Ki(e,t){e._appendCommentNode(t,e.openElements.currentTmplContentOrNode)}function $I(e,t){e._appendCommentNode(t,e.openElements.items[0])}function qI(e,t){e._appendCommentNode(t,e.document)}function vr(e,t){if(e.stopped=!0,t.location){const n=e.fragmentContext?0:2;for(let i=e.openElements.stackTop;i>=n;i--)e._setEndLocation(e.openElements.items[i],t);if(!e.fragmentContext&&e.openElements.stackTop>=0){const i=e.openElements.items[0],r=e.treeAdapter.getNodeSourceCodeLocation(i);if(r&&!r.endTag&&(e._setEndLocation(i,t),e.openElements.stackTop>=1)){const a=e.openElements.items[1],o=e.treeAdapter.getNodeSourceCodeLocation(a);o&&!o.endTag&&e._setEndLocation(a,t)}}}}function VI(e,t){e._setDocumentType(t);const n=t.forceQuirks?ze.QUIRKS:EI(t);AI(t)||e._err(t,N.nonConformingDoctype),e.treeAdapter.setDocumentMode(e.document,n),e.insertionMode=y.BEFORE_HTML}function en(e,t){e._err(t,N.missingDoctype,!0),e.treeAdapter.setDocumentMode(e.document,ze.QUIRKS),e.insertionMode=y.BEFORE_HTML,e._processToken(t)}function zI(e,t){t.tagID===s.HTML?(e._insertElement(t,w.HTML),e.insertionMode=y.BEFORE_HEAD):ln(e,t)}function WI(e,t){const n=t.tagID;(n===s.HTML||n===s.HEAD||n===s.BODY||n===s.BR)&&ln(e,t)}function ln(e,t){e._insertFakeRootElement(),e.insertionMode=y.BEFORE_HEAD,e._processToken(t)}function YI(e,t){switch(t.tagID){case s.HTML:{Pe(e,t);break}case s.HEAD:{e._insertElement(t,w.HTML),e.headElement=e.openElements.current,e.insertionMode=y.IN_HEAD;break}default:cn(e,t)}}function KI(e,t){const n=t.tagID;n===s.HEAD||n===s.BODY||n===s.HTML||n===s.BR?cn(e,t):e._err(t,N.endTagWithoutMatchingOpenElement)}function cn(e,t){e._insertFakeElement(k.HEAD,s.HEAD),e.headElement=e.openElements.current,e.insertionMode=y.IN_HEAD,e._processToken(t)}function Xe(e,t){switch(t.tagID){case s.HTML:{Pe(e,t);break}case s.BASE:case s.BASEFONT:case s.BGSOUND:case s.LINK:case s.META:{e._appendElement(t,w.HTML),t.ackSelfClosing=!0;break}case s.TITLE:{e._switchToTextParsing(t,Ie.RCDATA);break}case s.NOSCRIPT:{e.options.scriptingEnabled?e._switchToTextParsing(t,Ie.RAWTEXT):(e._insertElement(t,w.HTML),e.insertionMode=y.IN_HEAD_NO_SCRIPT);break}case s.NOFRAMES:case s.STYLE:{e._switchToTextParsing(t,Ie.RAWTEXT);break}case s.SCRIPT:{e._switchToTextParsing(t,Ie.SCRIPT_DATA);break}case s.TEMPLATE:{e._insertTemplate(t),e.activeFormattingElements.insertMarker(),e.framesetOk=!1,e.insertionMode=y.IN_TEMPLATE,e.tmplInsertionModeStack.unshift(y.IN_TEMPLATE);break}case s.HEAD:{e._err(t,N.misplacedStartTagForHeadElement);break}default:pn(e,t)}}function QI(e,t){switch(t.tagID){case s.HEAD:{e.openElements.pop(),e.insertionMode=y.AFTER_HEAD;break}case s.BODY:case s.BR:case s.HTML:{pn(e,t);break}case s.TEMPLATE:{vt(e,t);break}default:e._err(t,N.endTagWithoutMatchingOpenElement)}}function vt(e,t){e.openElements.tmplCount>0?(e.openElements.generateImpliedEndTagsThoroughly(),e.openElements.currentTagId!==s.TEMPLATE&&e._err(t,N.closingOfElementWithOpenChildElements),e.openElements.popUntilTagNamePopped(s.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode()):e._err(t,N.endTagWithoutMatchingOpenElement)}function pn(e,t){e.openElements.pop(),e.insertionMode=y.AFTER_HEAD,e._processToken(t)}function XI(e,t){switch(t.tagID){case s.HTML:{Pe(e,t);break}case s.BASEFONT:case s.BGSOUND:case s.HEAD:case s.LINK:case s.META:case s.NOFRAMES:case s.STYLE:{Xe(e,t);break}case s.NOSCRIPT:{e._err(t,N.nestedNoscriptInHead);break}default:hn(e,t)}}function ZI(e,t){switch(t.tagID){case s.NOSCRIPT:{e.openElements.pop(),e.insertionMode=y.IN_HEAD;break}case s.BR:{hn(e,t);break}default:e._err(t,N.endTagWithoutMatchingOpenElement)}}function hn(e,t){const n=t.type===ae.EOF?N.openElementsLeftAfterEof:N.disallowedContentInNoscriptInHead;e._err(t,n),e.openElements.pop(),e.insertionMode=y.IN_HEAD,e._processToken(t)}function eg(e,t){switch(t.tagID){case s.HTML:{Pe(e,t);break}case s.BODY:{e._insertElement(t,w.HTML),e.framesetOk=!1,e.insertionMode=y.IN_BODY;break}case s.FRAMESET:{e._insertElement(t,w.HTML),e.insertionMode=y.IN_FRAMESET;break}case s.BASE:case s.BASEFONT:case s.BGSOUND:case s.LINK:case s.META:case s.NOFRAMES:case s.SCRIPT:case s.STYLE:case s.TEMPLATE:case s.TITLE:{e._err(t,N.abandonedHeadElementChild),e.openElements.push(e.headElement,s.HEAD),Xe(e,t),e.openElements.remove(e.headElement);break}case s.HEAD:{e._err(t,N.misplacedStartTagForHeadElement);break}default:dn(e,t)}}function tg(e,t){switch(t.tagID){case s.BODY:case s.HTML:case s.BR:{dn(e,t);break}case s.TEMPLATE:{vt(e,t);break}default:e._err(t,N.endTagWithoutMatchingOpenElement)}}function dn(e,t){e._insertFakeElement(k.BODY,s.BODY),e.insertionMode=y.IN_BODY,pi(e,t)}function pi(e,t){switch(t.type){case ae.CHARACTER:{nu(e,t);break}case ae.WHITESPACE_CHARACTER:{tu(e,t);break}case ae.COMMENT:{Ki(e,t);break}case ae.START_TAG:{Pe(e,t);break}case ae.END_TAG:{hi(e,t);break}case ae.EOF:{ou(e,t);break}}}function tu(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t)}function nu(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t),e.framesetOk=!1}function ng(e,t){e.openElements.tmplCount===0&&e.treeAdapter.adoptAttributes(e.openElements.items[0],t.attrs)}function ig(e,t){const n=e.openElements.tryPeekProperlyNestedBodyElement();n&&e.openElements.tmplCount===0&&(e.framesetOk=!1,e.treeAdapter.adoptAttributes(n,t.attrs))}function rg(e,t){const n=e.openElements.tryPeekProperlyNestedBodyElement();e.framesetOk&&n&&(e.treeAdapter.detachNode(n),e.openElements.popAllUpToHtmlElement(),e._insertElement(t,w.HTML),e.insertionMode=y.IN_FRAMESET)}function ag(e,t){e.openElements.hasInButtonScope(s.P)&&e._closePElement(),e._insertElement(t,w.HTML)}function og(e,t){e.openElements.hasInButtonScope(s.P)&&e._closePElement(),Yi.has(e.openElements.currentTagId)&&e.openElements.pop(),e._insertElement(t,w.HTML)}function sg(e,t){e.openElements.hasInButtonScope(s.P)&&e._closePElement(),e._insertElement(t,w.HTML),e.skipNextNewLine=!0,e.framesetOk=!1}function ug(e,t){const n=e.openElements.tmplCount>0;(!e.formElement||n)&&(e.openElements.hasInButtonScope(s.P)&&e._closePElement(),e._insertElement(t,w.HTML),n||(e.formElement=e.openElements.current))}function lg(e,t){e.framesetOk=!1;const n=t.tagID;for(let i=e.openElements.stackTop;i>=0;i--){const r=e.openElements.tagIDs[i];if(n===s.LI&&r===s.LI||(n===s.DD||n===s.DT)&&(r===s.DD||r===s.DT)){e.openElements.generateImpliedEndTagsWithExclusion(r),e.openElements.popUntilTagNamePopped(r);break}if(r!==s.ADDRESS&&r!==s.DIV&&r!==s.P&&e._isSpecialElement(e.openElements.items[i],r))break}e.openElements.hasInButtonScope(s.P)&&e._closePElement(),e._insertElement(t,w.HTML)}function cg(e,t){e.openElements.hasInButtonScope(s.P)&&e._closePElement(),e._insertElement(t,w.HTML),e.tokenizer.state=Ie.PLAINTEXT}function pg(e,t){e.openElements.hasInScope(s.BUTTON)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s.BUTTON)),e._reconstructActiveFormattingElements(),e._insertElement(t,w.HTML),e.framesetOk=!1}function hg(e,t){const n=e.activeFormattingElements.getElementEntryInScopeWithTagName(k.A);n&&(Nr(e,t),e.openElements.remove(n.element),e.activeFormattingElements.removeEntry(n)),e._reconstructActiveFormattingElements(),e._insertElement(t,w.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function dg(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,w.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function fg(e,t){e._reconstructActiveFormattingElements(),e.openElements.hasInScope(s.NOBR)&&(Nr(e,t),e._reconstructActiveFormattingElements()),e._insertElement(t,w.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function mg(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,w.HTML),e.activeFormattingElements.insertMarker(),e.framesetOk=!1}function Ig(e,t){e.treeAdapter.getDocumentMode(e.document)!==ze.QUIRKS&&e.openElements.hasInButtonScope(s.P)&&e._closePElement(),e._insertElement(t,w.HTML),e.framesetOk=!1,e.insertionMode=y.IN_TABLE}function iu(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,w.HTML),e.framesetOk=!1,t.ackSelfClosing=!0}function ru(e){const t=js(e,kt.TYPE);return t!=null&&t.toLowerCase()===DI}function gg(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,w.HTML),ru(t)||(e.framesetOk=!1),t.ackSelfClosing=!0}function yg(e,t){e._appendElement(t,w.HTML),t.ackSelfClosing=!0}function bg(e,t){e.openElements.hasInButtonScope(s.P)&&e._closePElement(),e._appendElement(t,w.HTML),e.framesetOk=!1,t.ackSelfClosing=!0}function Sg(e,t){t.tagName=k.IMG,t.tagID=s.IMG,iu(e,t)}function Ag(e,t){e._insertElement(t,w.HTML),e.skipNextNewLine=!0,e.tokenizer.state=Ie.RCDATA,e.originalInsertionMode=e.insertionMode,e.framesetOk=!1,e.insertionMode=y.TEXT}function Eg(e,t){e.openElements.hasInButtonScope(s.P)&&e._closePElement(),e._reconstructActiveFormattingElements(),e.framesetOk=!1,e._switchToTextParsing(t,Ie.RAWTEXT)}function Tg(e,t){e.framesetOk=!1,e._switchToTextParsing(t,Ie.RAWTEXT)}function co(e,t){e._switchToTextParsing(t,Ie.RAWTEXT)}function Cg(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,w.HTML),e.framesetOk=!1,e.insertionMode=e.insertionMode===y.IN_TABLE||e.insertionMode===y.IN_CAPTION||e.insertionMode===y.IN_TABLE_BODY||e.insertionMode===y.IN_ROW||e.insertionMode===y.IN_CELL?y.IN_SELECT_IN_TABLE:y.IN_SELECT}function kg(e,t){e.openElements.currentTagId===s.OPTION&&e.openElements.pop(),e._reconstructActiveFormattingElements(),e._insertElement(t,w.HTML)}function Og(e,t){e.openElements.hasInScope(s.RUBY)&&e.openElements.generateImpliedEndTags(),e._insertElement(t,w.HTML)}function _g(e,t){e.openElements.hasInScope(s.RUBY)&&e.openElements.generateImpliedEndTagsWithExclusion(s.RTC),e._insertElement(t,w.HTML)}function xg(e,t){e._reconstructActiveFormattingElements(),Xs(t),xr(t),t.selfClosing?e._appendElement(t,w.MATHML):e._insertElement(t,w.MATHML),t.ackSelfClosing=!0}function Ng(e,t){e._reconstructActiveFormattingElements(),Zs(t),xr(t),t.selfClosing?e._appendElement(t,w.SVG):e._insertElement(t,w.SVG),t.ackSelfClosing=!0}function po(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,w.HTML)}function Pe(e,t){switch(t.tagID){case s.I:case s.S:case s.B:case s.U:case s.EM:case s.TT:case s.BIG:case s.CODE:case s.FONT:case s.SMALL:case s.STRIKE:case s.STRONG:{dg(e,t);break}case s.A:{hg(e,t);break}case s.H1:case s.H2:case s.H3:case s.H4:case s.H5:case s.H6:{og(e,t);break}case s.P:case s.DL:case s.OL:case s.UL:case s.DIV:case s.DIR:case s.NAV:case s.MAIN:case s.MENU:case s.ASIDE:case s.CENTER:case s.FIGURE:case s.FOOTER:case s.HEADER:case s.HGROUP:case s.DIALOG:case s.DETAILS:case s.ADDRESS:case s.ARTICLE:case s.SEARCH:case s.SECTION:case s.SUMMARY:case s.FIELDSET:case s.BLOCKQUOTE:case s.FIGCAPTION:{ag(e,t);break}case s.LI:case s.DD:case s.DT:{lg(e,t);break}case s.BR:case s.IMG:case s.WBR:case s.AREA:case s.EMBED:case s.KEYGEN:{iu(e,t);break}case s.HR:{bg(e,t);break}case s.RB:case s.RTC:{Og(e,t);break}case s.RT:case s.RP:{_g(e,t);break}case s.PRE:case s.LISTING:{sg(e,t);break}case s.XMP:{Eg(e,t);break}case s.SVG:{Ng(e,t);break}case s.HTML:{ng(e,t);break}case s.BASE:case s.LINK:case s.META:case s.STYLE:case s.TITLE:case s.SCRIPT:case s.BGSOUND:case s.BASEFONT:case s.TEMPLATE:{Xe(e,t);break}case s.BODY:{ig(e,t);break}case s.FORM:{ug(e,t);break}case s.NOBR:{fg(e,t);break}case s.MATH:{xg(e,t);break}case s.TABLE:{Ig(e,t);break}case s.INPUT:{gg(e,t);break}case s.PARAM:case s.TRACK:case s.SOURCE:{yg(e,t);break}case s.IMAGE:{Sg(e,t);break}case s.BUTTON:{pg(e,t);break}case s.APPLET:case s.OBJECT:case s.MARQUEE:{mg(e,t);break}case s.IFRAME:{Tg(e,t);break}case s.SELECT:{Cg(e,t);break}case s.OPTION:case s.OPTGROUP:{kg(e,t);break}case s.NOEMBED:case s.NOFRAMES:{co(e,t);break}case s.FRAMESET:{rg(e,t);break}case s.TEXTAREA:{Ag(e,t);break}case s.NOSCRIPT:{e.options.scriptingEnabled?co(e,t):po(e,t);break}case s.PLAINTEXT:{cg(e,t);break}case s.COL:case s.TH:case s.TD:case s.TR:case s.HEAD:case s.FRAME:case s.TBODY:case s.TFOOT:case s.THEAD:case s.CAPTION:case s.COLGROUP:break;default:po(e,t)}}function vg(e,t){if(e.openElements.hasInScope(s.BODY)&&(e.insertionMode=y.AFTER_BODY,e.options.sourceCodeLocationInfo)){const n=e.openElements.tryPeekProperlyNestedBodyElement();n&&e._setEndLocation(n,t)}}function Rg(e,t){e.openElements.hasInScope(s.BODY)&&(e.insertionMode=y.AFTER_BODY,fu(e,t))}function Pg(e,t){const n=t.tagID;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n))}function wg(e){const t=e.openElements.tmplCount>0,{formElement:n}=e;t||(e.formElement=null),(n||t)&&e.openElements.hasInScope(s.FORM)&&(e.openElements.generateImpliedEndTags(),t?e.openElements.popUntilTagNamePopped(s.FORM):n&&e.openElements.remove(n))}function Dg(e){e.openElements.hasInButtonScope(s.P)||e._insertFakeElement(k.P,s.P),e._closePElement()}function Lg(e){e.openElements.hasInListItemScope(s.LI)&&(e.openElements.generateImpliedEndTagsWithExclusion(s.LI),e.openElements.popUntilTagNamePopped(s.LI))}function Mg(e,t){const n=t.tagID;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTagsWithExclusion(n),e.openElements.popUntilTagNamePopped(n))}function Bg(e){e.openElements.hasNumberedHeaderInScope()&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilNumberedHeaderPopped())}function Gg(e,t){const n=t.tagID;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n),e.activeFormattingElements.clearToLastMarker())}function Fg(e){e._reconstructActiveFormattingElements(),e._insertFakeElement(k.BR,s.BR),e.openElements.pop(),e.framesetOk=!1}function au(e,t){const n=t.tagName,i=t.tagID;for(let r=e.openElements.stackTop;r>0;r--){const a=e.openElements.items[r],o=e.openElements.tagIDs[r];if(i===o&&(i!==s.UNKNOWN||e.treeAdapter.getTagName(a)===n)){e.openElements.generateImpliedEndTagsWithExclusion(i),e.openElements.stackTop>=r&&e.openElements.shortenToLength(r);break}if(e._isSpecialElement(a,o))break}}function hi(e,t){switch(t.tagID){case s.A:case s.B:case s.I:case s.S:case s.U:case s.EM:case s.TT:case s.BIG:case s.CODE:case s.FONT:case s.NOBR:case s.SMALL:case s.STRIKE:case s.STRONG:{Nr(e,t);break}case s.P:{Dg(e);break}case s.DL:case s.UL:case s.OL:case s.DIR:case s.DIV:case s.NAV:case s.PRE:case s.MAIN:case s.MENU:case s.ASIDE:case s.BUTTON:case s.CENTER:case s.FIGURE:case s.FOOTER:case s.HEADER:case s.HGROUP:case s.DIALOG:case s.ADDRESS:case s.ARTICLE:case s.DETAILS:case s.SEARCH:case s.SECTION:case s.SUMMARY:case s.LISTING:case s.FIELDSET:case s.BLOCKQUOTE:case s.FIGCAPTION:{Pg(e,t);break}case s.LI:{Lg(e);break}case s.DD:case s.DT:{Mg(e,t);break}case s.H1:case s.H2:case s.H3:case s.H4:case s.H5:case s.H6:{Bg(e);break}case s.BR:{Fg(e);break}case s.BODY:{vg(e,t);break}case s.HTML:{Rg(e,t);break}case s.FORM:{wg(e);break}case s.APPLET:case s.OBJECT:case s.MARQUEE:{Gg(e,t);break}case s.TEMPLATE:{vt(e,t);break}default:au(e,t)}}function ou(e,t){e.tmplInsertionModeStack.length>0?du(e,t):vr(e,t)}function Hg(e,t){var n;t.tagID===s.SCRIPT&&((n=e.scriptHandler)===null||n===void 0||n.call(e,e.openElements.current)),e.openElements.pop(),e.insertionMode=e.originalInsertionMode}function Jg(e,t){e._err(t,N.eofInElementThatCanContainOnlyText),e.openElements.pop(),e.insertionMode=e.originalInsertionMode,e.onEof(t)}function Pi(e,t){if(eu.has(e.openElements.currentTagId))switch(e.pendingCharacterTokens.length=0,e.hasNonWhitespacePendingCharacterToken=!1,e.originalInsertionMode=e.insertionMode,e.insertionMode=y.IN_TABLE_TEXT,t.type){case ae.CHARACTER:{uu(e,t);break}case ae.WHITESPACE_CHARACTER:{su(e,t);break}}else kn(e,t)}function Ug(e,t){e.openElements.clearBackToTableContext(),e.activeFormattingElements.insertMarker(),e._insertElement(t,w.HTML),e.insertionMode=y.IN_CAPTION}function jg(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,w.HTML),e.insertionMode=y.IN_COLUMN_GROUP}function $g(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(k.COLGROUP,s.COLGROUP),e.insertionMode=y.IN_COLUMN_GROUP,Rr(e,t)}function qg(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,w.HTML),e.insertionMode=y.IN_TABLE_BODY}function Vg(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(k.TBODY,s.TBODY),e.insertionMode=y.IN_TABLE_BODY,di(e,t)}function zg(e,t){e.openElements.hasInTableScope(s.TABLE)&&(e.openElements.popUntilTagNamePopped(s.TABLE),e._resetInsertionMode(),e._processStartTag(t))}function Wg(e,t){ru(t)?e._appendElement(t,w.HTML):kn(e,t),t.ackSelfClosing=!0}function Yg(e,t){!e.formElement&&e.openElements.tmplCount===0&&(e._insertElement(t,w.HTML),e.formElement=e.openElements.current,e.openElements.pop())}function Jt(e,t){switch(t.tagID){case s.TD:case s.TH:case s.TR:{Vg(e,t);break}case s.STYLE:case s.SCRIPT:case s.TEMPLATE:{Xe(e,t);break}case s.COL:{$g(e,t);break}case s.FORM:{Yg(e,t);break}case s.TABLE:{zg(e,t);break}case s.TBODY:case s.TFOOT:case s.THEAD:{qg(e,t);break}case s.INPUT:{Wg(e,t);break}case s.CAPTION:{Ug(e,t);break}case s.COLGROUP:{jg(e,t);break}default:kn(e,t)}}function yn(e,t){switch(t.tagID){case s.TABLE:{e.openElements.hasInTableScope(s.TABLE)&&(e.openElements.popUntilTagNamePopped(s.TABLE),e._resetInsertionMode());break}case s.TEMPLATE:{vt(e,t);break}case s.BODY:case s.CAPTION:case s.COL:case s.COLGROUP:case s.HTML:case s.TBODY:case s.TD:case s.TFOOT:case s.TH:case s.THEAD:case s.TR:break;default:kn(e,t)}}function kn(e,t){const n=e.fosterParentingEnabled;e.fosterParentingEnabled=!0,pi(e,t),e.fosterParentingEnabled=n}function su(e,t){e.pendingCharacterTokens.push(t)}function uu(e,t){e.pendingCharacterTokens.push(t),e.hasNonWhitespacePendingCharacterToken=!0}function tn(e,t){let n=0;if(e.hasNonWhitespacePendingCharacterToken)for(;n<e.pendingCharacterTokens.length;n++)kn(e,e.pendingCharacterTokens[n]);else for(;n<e.pendingCharacterTokens.length;n++)e._insertCharacters(e.pendingCharacterTokens[n]);e.insertionMode=e.originalInsertionMode,e._processToken(t)}const lu=new Set([s.CAPTION,s.COL,s.COLGROUP,s.TBODY,s.TD,s.TFOOT,s.TH,s.THEAD,s.TR]);function Kg(e,t){const n=t.tagID;lu.has(n)?e.openElements.hasInTableScope(s.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=y.IN_TABLE,Jt(e,t)):Pe(e,t)}function Qg(e,t){const n=t.tagID;switch(n){case s.CAPTION:case s.TABLE:{e.openElements.hasInTableScope(s.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(s.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=y.IN_TABLE,n===s.TABLE&&yn(e,t));break}case s.BODY:case s.COL:case s.COLGROUP:case s.HTML:case s.TBODY:case s.TD:case s.TFOOT:case s.TH:case s.THEAD:case s.TR:break;default:hi(e,t)}}function Rr(e,t){switch(t.tagID){case s.HTML:{Pe(e,t);break}case s.COL:{e._appendElement(t,w.HTML),t.ackSelfClosing=!0;break}case s.TEMPLATE:{Xe(e,t);break}default:Yn(e,t)}}function Xg(e,t){switch(t.tagID){case s.COLGROUP:{e.openElements.currentTagId===s.COLGROUP&&(e.openElements.pop(),e.insertionMode=y.IN_TABLE);break}case s.TEMPLATE:{vt(e,t);break}case s.COL:break;default:Yn(e,t)}}function Yn(e,t){e.openElements.currentTagId===s.COLGROUP&&(e.openElements.pop(),e.insertionMode=y.IN_TABLE,e._processToken(t))}function di(e,t){switch(t.tagID){case s.TR:{e.openElements.clearBackToTableBodyContext(),e._insertElement(t,w.HTML),e.insertionMode=y.IN_ROW;break}case s.TH:case s.TD:{e.openElements.clearBackToTableBodyContext(),e._insertFakeElement(k.TR,s.TR),e.insertionMode=y.IN_ROW,fi(e,t);break}case s.CAPTION:case s.COL:case s.COLGROUP:case s.TBODY:case s.TFOOT:case s.THEAD:{e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=y.IN_TABLE,Jt(e,t));break}default:Jt(e,t)}}function Qi(e,t){const n=t.tagID;switch(t.tagID){case s.TBODY:case s.TFOOT:case s.THEAD:{e.openElements.hasInTableScope(n)&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=y.IN_TABLE);break}case s.TABLE:{e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=y.IN_TABLE,yn(e,t));break}case s.BODY:case s.CAPTION:case s.COL:case s.COLGROUP:case s.HTML:case s.TD:case s.TH:case s.TR:break;default:yn(e,t)}}function fi(e,t){switch(t.tagID){case s.TH:case s.TD:{e.openElements.clearBackToTableRowContext(),e._insertElement(t,w.HTML),e.insertionMode=y.IN_CELL,e.activeFormattingElements.insertMarker();break}case s.CAPTION:case s.COL:case s.COLGROUP:case s.TBODY:case s.TFOOT:case s.THEAD:case s.TR:{e.openElements.hasInTableScope(s.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=y.IN_TABLE_BODY,di(e,t));break}default:Jt(e,t)}}function cu(e,t){switch(t.tagID){case s.TR:{e.openElements.hasInTableScope(s.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=y.IN_TABLE_BODY);break}case s.TABLE:{e.openElements.hasInTableScope(s.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=y.IN_TABLE_BODY,Qi(e,t));break}case s.TBODY:case s.TFOOT:case s.THEAD:{(e.openElements.hasInTableScope(t.tagID)||e.openElements.hasInTableScope(s.TR))&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=y.IN_TABLE_BODY,Qi(e,t));break}case s.BODY:case s.CAPTION:case s.COL:case s.COLGROUP:case s.HTML:case s.TD:case s.TH:break;default:yn(e,t)}}function Zg(e,t){const n=t.tagID;lu.has(n)?(e.openElements.hasInTableScope(s.TD)||e.openElements.hasInTableScope(s.TH))&&(e._closeTableCell(),fi(e,t)):Pe(e,t)}function ey(e,t){const n=t.tagID;switch(n){case s.TD:case s.TH:{e.openElements.hasInTableScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=y.IN_ROW);break}case s.TABLE:case s.TBODY:case s.TFOOT:case s.THEAD:case s.TR:{e.openElements.hasInTableScope(n)&&(e._closeTableCell(),cu(e,t));break}case s.BODY:case s.CAPTION:case s.COL:case s.COLGROUP:case s.HTML:break;default:hi(e,t)}}function pu(e,t){switch(t.tagID){case s.HTML:{Pe(e,t);break}case s.OPTION:{e.openElements.currentTagId===s.OPTION&&e.openElements.pop(),e._insertElement(t,w.HTML);break}case s.OPTGROUP:{e.openElements.currentTagId===s.OPTION&&e.openElements.pop(),e.openElements.currentTagId===s.OPTGROUP&&e.openElements.pop(),e._insertElement(t,w.HTML);break}case s.HR:{e.openElements.currentTagId===s.OPTION&&e.openElements.pop(),e.openElements.currentTagId===s.OPTGROUP&&e.openElements.pop(),e._appendElement(t,w.HTML),t.ackSelfClosing=!0;break}case s.INPUT:case s.KEYGEN:case s.TEXTAREA:case s.SELECT:{e.openElements.hasInSelectScope(s.SELECT)&&(e.openElements.popUntilTagNamePopped(s.SELECT),e._resetInsertionMode(),t.tagID!==s.SELECT&&e._processStartTag(t));break}case s.SCRIPT:case s.TEMPLATE:{Xe(e,t);break}}}function hu(e,t){switch(t.tagID){case s.OPTGROUP:{e.openElements.stackTop>0&&e.openElements.currentTagId===s.OPTION&&e.openElements.tagIDs[e.openElements.stackTop-1]===s.OPTGROUP&&e.openElements.pop(),e.openElements.currentTagId===s.OPTGROUP&&e.openElements.pop();break}case s.OPTION:{e.openElements.currentTagId===s.OPTION&&e.openElements.pop();break}case s.SELECT:{e.openElements.hasInSelectScope(s.SELECT)&&(e.openElements.popUntilTagNamePopped(s.SELECT),e._resetInsertionMode());break}case s.TEMPLATE:{vt(e,t);break}}}function ty(e,t){const n=t.tagID;n===s.CAPTION||n===s.TABLE||n===s.TBODY||n===s.TFOOT||n===s.THEAD||n===s.TR||n===s.TD||n===s.TH?(e.openElements.popUntilTagNamePopped(s.SELECT),e._resetInsertionMode(),e._processStartTag(t)):pu(e,t)}function ny(e,t){const n=t.tagID;n===s.CAPTION||n===s.TABLE||n===s.TBODY||n===s.TFOOT||n===s.THEAD||n===s.TR||n===s.TD||n===s.TH?e.openElements.hasInTableScope(n)&&(e.openElements.popUntilTagNamePopped(s.SELECT),e._resetInsertionMode(),e.onEndTag(t)):hu(e,t)}function iy(e,t){switch(t.tagID){case s.BASE:case s.BASEFONT:case s.BGSOUND:case s.LINK:case s.META:case s.NOFRAMES:case s.SCRIPT:case s.STYLE:case s.TEMPLATE:case s.TITLE:{Xe(e,t);break}case s.CAPTION:case s.COLGROUP:case s.TBODY:case s.TFOOT:case s.THEAD:{e.tmplInsertionModeStack[0]=y.IN_TABLE,e.insertionMode=y.IN_TABLE,Jt(e,t);break}case s.COL:{e.tmplInsertionModeStack[0]=y.IN_COLUMN_GROUP,e.insertionMode=y.IN_COLUMN_GROUP,Rr(e,t);break}case s.TR:{e.tmplInsertionModeStack[0]=y.IN_TABLE_BODY,e.insertionMode=y.IN_TABLE_BODY,di(e,t);break}case s.TD:case s.TH:{e.tmplInsertionModeStack[0]=y.IN_ROW,e.insertionMode=y.IN_ROW,fi(e,t);break}default:e.tmplInsertionModeStack[0]=y.IN_BODY,e.insertionMode=y.IN_BODY,Pe(e,t)}}function ry(e,t){t.tagID===s.TEMPLATE&&vt(e,t)}function du(e,t){e.openElements.tmplCount>0?(e.openElements.popUntilTagNamePopped(s.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode(),e.onEof(t)):vr(e,t)}function ay(e,t){t.tagID===s.HTML?Pe(e,t):Kn(e,t)}function fu(e,t){var n;if(t.tagID===s.HTML){if(e.fragmentContext||(e.insertionMode=y.AFTER_AFTER_BODY),e.options.sourceCodeLocationInfo&&e.openElements.tagIDs[0]===s.HTML){e._setEndLocation(e.openElements.items[0],t);const i=e.openElements.items[1];i&&!(!((n=e.treeAdapter.getNodeSourceCodeLocation(i))===null||n===void 0)&&n.endTag)&&e._setEndLocation(i,t)}}else Kn(e,t)}function Kn(e,t){e.insertionMode=y.IN_BODY,pi(e,t)}function oy(e,t){switch(t.tagID){case s.HTML:{Pe(e,t);break}case s.FRAMESET:{e._insertElement(t,w.HTML);break}case s.FRAME:{e._appendElement(t,w.HTML),t.ackSelfClosing=!0;break}case s.NOFRAMES:{Xe(e,t);break}}}function sy(e,t){t.tagID===s.FRAMESET&&!e.openElements.isRootHtmlElementCurrent()&&(e.openElements.pop(),!e.fragmentContext&&e.openElements.currentTagId!==s.FRAMESET&&(e.insertionMode=y.AFTER_FRAMESET))}function uy(e,t){switch(t.tagID){case s.HTML:{Pe(e,t);break}case s.NOFRAMES:{Xe(e,t);break}}}function ly(e,t){t.tagID===s.HTML&&(e.insertionMode=y.AFTER_AFTER_FRAMESET)}function cy(e,t){t.tagID===s.HTML?Pe(e,t):jn(e,t)}function jn(e,t){e.insertionMode=y.IN_BODY,pi(e,t)}function py(e,t){switch(t.tagID){case s.HTML:{Pe(e,t);break}case s.NOFRAMES:{Xe(e,t);break}}}function hy(e,t){t.chars=me,e._insertCharacters(t)}function dy(e,t){e._insertCharacters(t),e.framesetOk=!1}function mu(e){for(;e.treeAdapter.getNamespaceURI(e.openElements.current)!==w.HTML&&!e._isIntegrationPoint(e.openElements.currentTagId,e.openElements.current);)e.openElements.pop()}function fy(e,t){if(NI(t))mu(e),e._startTagOutsideForeignContent(t);else{const n=e._getAdjustedCurrentElement(),i=e.treeAdapter.getNamespaceURI(n);i===w.MATHML?Xs(t):i===w.SVG&&(vI(t),Zs(t)),xr(t),t.selfClosing?e._appendElement(t,i):e._insertElement(t,i),t.ackSelfClosing=!0}}function my(e,t){if(t.tagID===s.P||t.tagID===s.BR){mu(e),e._endTagOutsideForeignContent(t);return}for(let n=e.openElements.stackTop;n>0;n--){const i=e.openElements.items[n];if(e.treeAdapter.getNamespaceURI(i)===w.HTML){e._endTagOutsideForeignContent(t);break}const r=e.treeAdapter.getTagName(i);if(r.toLowerCase()===t.tagName){t.tagName=r,e.openElements.shortenToLength(n);break}}}k.AREA,k.BASE,k.BASEFONT,k.BGSOUND,k.BR,k.COL,k.EMBED,k.FRAME,k.HR,k.IMG,k.INPUT,k.KEYGEN,k.LINK,k.META,k.PARAM,k.SOURCE,k.TRACK,k.WBR;const Iy=/<(\/?)(iframe|noembed|noframes|plaintext|script|style|textarea|title|xmp)(?=[\t\n\f\r />])/gi,gy=new Set(["mdxFlowExpression","mdxJsxFlowElement","mdxJsxTextElement","mdxTextExpression","mdxjsEsm"]),ho={sourceCodeLocationInfo:!0,scriptingEnabled:!1};function Iu(e,t){const n=_y(e),i=Or("type",{handlers:{root:yy,element:by,text:Sy,comment:yu,doctype:Ay,raw:Ty},unknown:Cy}),r={parser:n?new lo(ho):lo.getFragmentParser(void 0,ho),handle(u){i(u,r)},stitches:!1,options:t||{}};i(e,r),Yt(r,ot());const a=n?r.parser.document:r.parser.getFragment(),o=b0(a,{file:r.options.file});return r.stitches&&Er(o,"comment",function(u,l,c){const p=u;if(p.value.stitch&&c&&l!==void 0){const d=c.children;return d[l]=p.value.stitch,l}}),o.type==="root"&&o.children.length===1&&o.children[0].type===e.type?o.children[0]:o}function gu(e,t){let n=-1;if(e)for(;++n<e.length;)t.handle(e[n])}function yy(e,t){gu(e.children,t)}function by(e,t){ky(e,t),gu(e.children,t),Oy(e,t)}function Sy(e,t){t.parser.tokenizer.state>4&&(t.parser.tokenizer.state=0);const n={type:ae.CHARACTER,chars:e.value,location:On(e)};Yt(t,ot(e)),t.parser.currentToken=n,t.parser._processToken(t.parser.currentToken)}function Ay(e,t){const n={type:ae.DOCTYPE,name:"html",forceQuirks:!1,publicId:"",systemId:"",location:On(e)};Yt(t,ot(e)),t.parser.currentToken=n,t.parser._processToken(t.parser.currentToken)}function Ey(e,t){t.stitches=!0;const n=xy(e);if("children"in e&&"children"in n){const i=Iu({type:"root",children:e.children},t.options);n.children=i.children}yu({type:"comment",value:{stitch:n}},t)}function yu(e,t){const n=e.value,i={type:ae.COMMENT,data:n,location:On(e)};Yt(t,ot(e)),t.parser.currentToken=i,t.parser._processToken(t.parser.currentToken)}function Ty(e,t){if(t.parser.tokenizer.preprocessor.html="",t.parser.tokenizer.preprocessor.pos=-1,t.parser.tokenizer.preprocessor.lastGapPos=-2,t.parser.tokenizer.preprocessor.gapStack=[],t.parser.tokenizer.preprocessor.skipNextNewLine=!1,t.parser.tokenizer.preprocessor.lastChunkWritten=!1,t.parser.tokenizer.preprocessor.endOfChunkHit=!1,t.parser.tokenizer.preprocessor.isEol=!1,bu(t,ot(e)),t.parser.tokenizer.write(t.options.tagfilter?e.value.replace(Iy,"&lt;$1$2"):e.value,!1),t.parser.tokenizer._runParsingLoop(),t.parser.tokenizer.state===72||t.parser.tokenizer.state===78){t.parser.tokenizer.preprocessor.lastChunkWritten=!0;const n=t.parser.tokenizer._consume();t.parser.tokenizer._callState(n)}}function Cy(e,t){const n=e;if(t.options.passThrough&&t.options.passThrough.includes(n.type))Ey(n,t);else{let i="";throw gy.has(n.type)&&(i=". It looks like you are using MDX nodes with `hast-util-raw` (or `rehype-raw`). If you use this because you are using remark or rehype plugins that inject `'html'` nodes, then please raise an issue with that plugin, as its a bad and slow idea. If you use this because you are using markdown syntax, then you have to configure this utility (or plugin) to pass through these nodes (see `passThrough` in docs), but you can also migrate to use the MDX syntax"),new Error("Cannot compile `"+n.type+"` node"+i)}}function Yt(e,t){bu(e,t);const n=e.parser.tokenizer.currentCharacterToken;n&&n.location&&(n.location.endLine=e.parser.tokenizer.preprocessor.line,n.location.endCol=e.parser.tokenizer.preprocessor.col+1,n.location.endOffset=e.parser.tokenizer.preprocessor.offset+1,e.parser.currentToken=n,e.parser._processToken(e.parser.currentToken)),e.parser.tokenizer.paused=!1,e.parser.tokenizer.inLoop=!1,e.parser.tokenizer.active=!1,e.parser.tokenizer.returnState=Ie.DATA,e.parser.tokenizer.charRefCode=-1,e.parser.tokenizer.consumedAfterSnapshot=-1,e.parser.tokenizer.currentLocation=null,e.parser.tokenizer.currentCharacterToken=null,e.parser.tokenizer.currentToken=null,e.parser.tokenizer.currentAttr={name:"",value:""}}function bu(e,t){if(t&&t.offset!==void 0){const n={startLine:t.line,startCol:t.column,startOffset:t.offset,endLine:-1,endCol:-1,endOffset:-1};e.parser.tokenizer.preprocessor.lineStartPos=-t.column+1,e.parser.tokenizer.preprocessor.droppedBufferSize=t.offset,e.parser.tokenizer.preprocessor.line=t.line,e.parser.tokenizer.currentLocation=n}}function ky(e,t){const n=e.tagName.toLowerCase();if(t.parser.tokenizer.state===Ie.PLAINTEXT)return;Yt(t,ot(e));const i=t.parser.openElements.current;let r="namespaceURI"in i?i.namespaceURI:Tt.html;r===Tt.html&&n==="svg"&&(r=Tt.svg);const a=D0({...e,children:[]},{space:r===Tt.svg?"svg":"html"}),o={type:ae.START_TAG,tagName:n,tagID:Wt(n),selfClosing:!1,ackSelfClosing:!1,attrs:"attrs"in a?a.attrs:[],location:On(e)};t.parser.currentToken=o,t.parser._processToken(t.parser.currentToken),t.parser.tokenizer.lastStartTagName=n}function Oy(e,t){const n=e.tagName.toLowerCase();if(!t.parser.tokenizer.inForeignNode&&Fs.includes(n)||t.parser.tokenizer.state===Ie.PLAINTEXT)return;Yt(t,si(e));const i={type:ae.END_TAG,tagName:n,tagID:Wt(n),selfClosing:!1,ackSelfClosing:!1,attrs:[],location:On(e)};t.parser.currentToken=i,t.parser._processToken(t.parser.currentToken),n===t.parser.tokenizer.lastStartTagName&&(t.parser.tokenizer.state===Ie.RCDATA||t.parser.tokenizer.state===Ie.RAWTEXT||t.parser.tokenizer.state===Ie.SCRIPT_DATA)&&(t.parser.tokenizer.state=Ie.DATA)}function _y(e){const t=e.type==="root"?e.children[0]:e;return!!(t&&(t.type==="doctype"||t.type==="element"&&t.tagName.toLowerCase()==="html"))}function On(e){const t=ot(e)||{line:void 0,column:void 0,offset:void 0},n=si(e)||{line:void 0,column:void 0,offset:void 0};return{startLine:t.line,startCol:t.column,startOffset:t.offset,endLine:n.line,endCol:n.column,endOffset:n.offset}}function xy(e){return"children"in e?Ht({...e,children:[]}):Ht(e)}function Ny(e){return function(t,n){return Iu(t,{...e,file:n})}}const vy=/["&'<>`]/g,Ry=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,Py=/[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g,wy=/[|\\{}()[\]^$+*?.]/g,fo=new WeakMap;function Dy(e,t){if(e=e.replace(t.subset?Ly(t.subset):vy,i),t.subset||t.escapeOnly)return e;return e.replace(Ry,n).replace(Py,i);function n(r,a,o){return t.format((r.charCodeAt(0)-55296)*1024+r.charCodeAt(1)-56320+65536,o.charCodeAt(a+2),t)}function i(r,a,o){return t.format(r.charCodeAt(0),o.charCodeAt(a+1),t)}}function Ly(e){let t=fo.get(e);return t||(t=My(e),fo.set(e,t)),t}function My(e){const t=[];let n=-1;for(;++n<e.length;)t.push(e[n].replace(wy,"\\$&"));return new RegExp("(?:"+t.join("|")+")","g")}const By=/[\dA-Fa-f]/;function Gy(e,t,n){const i="&#x"+e.toString(16).toUpperCase();return n&&t&&!By.test(String.fromCharCode(t))?i:i+";"}const Fy=/\d/;function Hy(e,t,n){const i="&#"+String(e);return n&&t&&!Fy.test(String.fromCharCode(t))?i:i+";"}const Jy=["AElig","AMP","Aacute","Acirc","Agrave","Aring","Atilde","Auml","COPY","Ccedil","ETH","Eacute","Ecirc","Egrave","Euml","GT","Iacute","Icirc","Igrave","Iuml","LT","Ntilde","Oacute","Ocirc","Ograve","Oslash","Otilde","Ouml","QUOT","REG","THORN","Uacute","Ucirc","Ugrave","Uuml","Yacute","aacute","acirc","acute","aelig","agrave","amp","aring","atilde","auml","brvbar","ccedil","cedil","cent","copy","curren","deg","divide","eacute","ecirc","egrave","eth","euml","frac12","frac14","frac34","gt","iacute","icirc","iexcl","igrave","iquest","iuml","laquo","lt","macr","micro","middot","nbsp","not","ntilde","oacute","ocirc","ograve","ordf","ordm","oslash","otilde","ouml","para","plusmn","pound","quot","raquo","reg","sect","shy","sup1","sup2","sup3","szlig","thorn","times","uacute","ucirc","ugrave","uml","uuml","yacute","yen","yuml"],wi={nbsp:" ",iexcl:"¡",cent:"¢",pound:"£",curren:"¤",yen:"¥",brvbar:"¦",sect:"§",uml:"¨",copy:"©",ordf:"ª",laquo:"«",not:"¬",shy:"­",reg:"®",macr:"¯",deg:"°",plusmn:"±",sup2:"²",sup3:"³",acute:"´",micro:"µ",para:"¶",middot:"·",cedil:"¸",sup1:"¹",ordm:"º",raquo:"»",frac14:"¼",frac12:"½",frac34:"¾",iquest:"¿",Agrave:"À",Aacute:"Á",Acirc:"Â",Atilde:"Ã",Auml:"Ä",Aring:"Å",AElig:"Æ",Ccedil:"Ç",Egrave:"È",Eacute:"É",Ecirc:"Ê",Euml:"Ë",Igrave:"Ì",Iacute:"Í",Icirc:"Î",Iuml:"Ï",ETH:"Ð",Ntilde:"Ñ",Ograve:"Ò",Oacute:"Ó",Ocirc:"Ô",Otilde:"Õ",Ouml:"Ö",times:"×",Oslash:"Ø",Ugrave:"Ù",Uacute:"Ú",Ucirc:"Û",Uuml:"Ü",Yacute:"Ý",THORN:"Þ",szlig:"ß",agrave:"à",aacute:"á",acirc:"â",atilde:"ã",auml:"ä",aring:"å",aelig:"æ",ccedil:"ç",egrave:"è",eacute:"é",ecirc:"ê",euml:"ë",igrave:"ì",iacute:"í",icirc:"î",iuml:"ï",eth:"ð",ntilde:"ñ",ograve:"ò",oacute:"ó",ocirc:"ô",otilde:"õ",ouml:"ö",divide:"÷",oslash:"ø",ugrave:"ù",uacute:"ú",ucirc:"û",uuml:"ü",yacute:"ý",thorn:"þ",yuml:"ÿ",fnof:"ƒ",Alpha:"Α",Beta:"Β",Gamma:"Γ",Delta:"Δ",Epsilon:"Ε",Zeta:"Ζ",Eta:"Η",Theta:"Θ",Iota:"Ι",Kappa:"Κ",Lambda:"Λ",Mu:"Μ",Nu:"Ν",Xi:"Ξ",Omicron:"Ο",Pi:"Π",Rho:"Ρ",Sigma:"Σ",Tau:"Τ",Upsilon:"Υ",Phi:"Φ",Chi:"Χ",Psi:"Ψ",Omega:"Ω",alpha:"α",beta:"β",gamma:"γ",delta:"δ",epsilon:"ε",zeta:"ζ",eta:"η",theta:"θ",iota:"ι",kappa:"κ",lambda:"λ",mu:"μ",nu:"ν",xi:"ξ",omicron:"ο",pi:"π",rho:"ρ",sigmaf:"ς",sigma:"σ",tau:"τ",upsilon:"υ",phi:"φ",chi:"χ",psi:"ψ",omega:"ω",thetasym:"ϑ",upsih:"ϒ",piv:"ϖ",bull:"•",hellip:"…",prime:"′",Prime:"″",oline:"‾",frasl:"⁄",weierp:"℘",image:"ℑ",real:"ℜ",trade:"™",alefsym:"ℵ",larr:"←",uarr:"↑",rarr:"→",darr:"↓",harr:"↔",crarr:"↵",lArr:"⇐",uArr:"⇑",rArr:"⇒",dArr:"⇓",hArr:"⇔",forall:"∀",part:"∂",exist:"∃",empty:"∅",nabla:"∇",isin:"∈",notin:"∉",ni:"∋",prod:"∏",sum:"∑",minus:"−",lowast:"∗",radic:"√",prop:"∝",infin:"∞",ang:"∠",and:"∧",or:"∨",cap:"∩",cup:"∪",int:"∫",there4:"∴",sim:"∼",cong:"≅",asymp:"≈",ne:"≠",equiv:"≡",le:"≤",ge:"≥",sub:"⊂",sup:"⊃",nsub:"⊄",sube:"⊆",supe:"⊇",oplus:"⊕",otimes:"⊗",perp:"⊥",sdot:"⋅",lceil:"⌈",rceil:"⌉",lfloor:"⌊",rfloor:"⌋",lang:"〈",rang:"〉",loz:"◊",spades:"♠",clubs:"♣",hearts:"♥",diams:"♦",quot:'"',amp:"&",lt:"<",gt:">",OElig:"Œ",oelig:"œ",Scaron:"Š",scaron:"š",Yuml:"Ÿ",circ:"ˆ",tilde:"˜",ensp:" ",emsp:" ",thinsp:" ",zwnj:"‌",zwj:"‍",lrm:"‎",rlm:"‏",ndash:"–",mdash:"—",lsquo:"‘",rsquo:"’",sbquo:"‚",ldquo:"“",rdquo:"”",bdquo:"„",dagger:"†",Dagger:"‡",permil:"‰",lsaquo:"‹",rsaquo:"›",euro:"€"},Uy=["cent","copy","divide","gt","lt","not","para","times"],Su={}.hasOwnProperty,Xi={};let Ln;for(Ln in wi)Su.call(wi,Ln)&&(Xi[wi[Ln]]=Ln);const jy=/[^\dA-Za-z]/;function $y(e,t,n,i){const r=String.fromCharCode(e);if(Su.call(Xi,r)){const a=Xi[r],o="&"+a;return n&&Jy.includes(a)&&!Uy.includes(a)&&(!i||t&&t!==61&&jy.test(String.fromCharCode(t)))?o:o+";"}return""}function qy(e,t,n){let i=Gy(e,t,n.omitOptionalSemicolons),r;if((n.useNamedReferences||n.useShortestReferences)&&(r=$y(e,t,n.omitOptionalSemicolons,n.attribute)),(n.useShortestReferences||!r)&&n.useShortestReferences){const a=Hy(e,t,n.omitOptionalSemicolons);a.length<i.length&&(i=a)}return r&&(!n.useShortestReferences||r.length<i.length)?r:i}function Ft(e,t){return Dy(e,Object.assign({format:qy},t))}const Vy=/^>|^->|<!--|-->|--!>|<!-$/g,zy=[">"],Wy=["<",">"];function Yy(e,t,n,i){return i.settings.bogusComments?"<?"+Ft(e.value,Object.assign({},i.settings.characterReferences,{subset:zy}))+">":"<!--"+e.value.replace(Vy,r)+"-->";function r(a){return Ft(a,Object.assign({},i.settings.characterReferences,{subset:Wy}))}}function Ky(e,t,n,i){return"<!"+(i.settings.upperDoctype?"DOCTYPE":"doctype")+(i.settings.tightDoctype?"":" ")+"html>"}function mo(e,t){const n=String(e);if(typeof t!="string")throw new TypeError("Expected character");let i=0,r=n.indexOf(t);for(;r!==-1;)i++,r=n.indexOf(t,r+t.length);return i}const Ae=Eu(1),Au=Eu(-1),Qy=[];function Eu(e){return t;function t(n,i,r){const a=n?n.children:Qy;let o=(i||0)+e,u=a[o];if(!r)for(;u&&ri(u);)o+=e,u=a[o];return u}}const Xy={}.hasOwnProperty;function Tu(e){return t;function t(n,i,r){return Xy.call(e,n.tagName)&&e[n.tagName](n,i,r)}}const Pr=Tu({body:e1,caption:Di,colgroup:Di,dd:r1,dt:i1,head:Di,html:Zy,li:n1,optgroup:a1,option:o1,p:t1,rp:Io,rt:Io,tbody:u1,td:go,tfoot:l1,th:go,thead:s1,tr:c1});function Di(e,t,n){const i=Ae(n,t,!0);return!i||i.type!=="comment"&&!(i.type==="text"&&ri(i.value.charAt(0)))}function Zy(e,t,n){const i=Ae(n,t);return!i||i.type!=="comment"}function e1(e,t,n){const i=Ae(n,t);return!i||i.type!=="comment"}function t1(e,t,n){const i=Ae(n,t);return i?i.type==="element"&&(i.tagName==="address"||i.tagName==="article"||i.tagName==="aside"||i.tagName==="blockquote"||i.tagName==="details"||i.tagName==="div"||i.tagName==="dl"||i.tagName==="fieldset"||i.tagName==="figcaption"||i.tagName==="figure"||i.tagName==="footer"||i.tagName==="form"||i.tagName==="h1"||i.tagName==="h2"||i.tagName==="h3"||i.tagName==="h4"||i.tagName==="h5"||i.tagName==="h6"||i.tagName==="header"||i.tagName==="hgroup"||i.tagName==="hr"||i.tagName==="main"||i.tagName==="menu"||i.tagName==="nav"||i.tagName==="ol"||i.tagName==="p"||i.tagName==="pre"||i.tagName==="section"||i.tagName==="table"||i.tagName==="ul"):!n||!(n.type==="element"&&(n.tagName==="a"||n.tagName==="audio"||n.tagName==="del"||n.tagName==="ins"||n.tagName==="map"||n.tagName==="noscript"||n.tagName==="video"))}function n1(e,t,n){const i=Ae(n,t);return!i||i.type==="element"&&i.tagName==="li"}function i1(e,t,n){const i=Ae(n,t);return!!(i&&i.type==="element"&&(i.tagName==="dt"||i.tagName==="dd"))}function r1(e,t,n){const i=Ae(n,t);return!i||i.type==="element"&&(i.tagName==="dt"||i.tagName==="dd")}function Io(e,t,n){const i=Ae(n,t);return!i||i.type==="element"&&(i.tagName==="rp"||i.tagName==="rt")}function a1(e,t,n){const i=Ae(n,t);return!i||i.type==="element"&&i.tagName==="optgroup"}function o1(e,t,n){const i=Ae(n,t);return!i||i.type==="element"&&(i.tagName==="option"||i.tagName==="optgroup")}function s1(e,t,n){const i=Ae(n,t);return!!(i&&i.type==="element"&&(i.tagName==="tbody"||i.tagName==="tfoot"))}function u1(e,t,n){const i=Ae(n,t);return!i||i.type==="element"&&(i.tagName==="tbody"||i.tagName==="tfoot")}function l1(e,t,n){return!Ae(n,t)}function c1(e,t,n){const i=Ae(n,t);return!i||i.type==="element"&&i.tagName==="tr"}function go(e,t,n){const i=Ae(n,t);return!i||i.type==="element"&&(i.tagName==="td"||i.tagName==="th")}const p1=Tu({body:f1,colgroup:m1,head:d1,html:h1,tbody:I1});function h1(e){const t=Ae(e,-1);return!t||t.type!=="comment"}function d1(e){const t=new Set;for(const i of e.children)if(i.type==="element"&&(i.tagName==="base"||i.tagName==="title")){if(t.has(i.tagName))return!1;t.add(i.tagName)}const n=e.children[0];return!n||n.type==="element"}function f1(e){const t=Ae(e,-1,!0);return!t||t.type!=="comment"&&!(t.type==="text"&&ri(t.value.charAt(0)))&&!(t.type==="element"&&(t.tagName==="meta"||t.tagName==="link"||t.tagName==="script"||t.tagName==="style"||t.tagName==="template"))}function m1(e,t,n){const i=Au(n,t),r=Ae(e,-1,!0);return n&&i&&i.type==="element"&&i.tagName==="colgroup"&&Pr(i,n.children.indexOf(i),n)?!1:!!(r&&r.type==="element"&&r.tagName==="col")}function I1(e,t,n){const i=Au(n,t),r=Ae(e,-1);return n&&i&&i.type==="element"&&(i.tagName==="thead"||i.tagName==="tbody")&&Pr(i,n.children.indexOf(i),n)?!1:!!(r&&r.type==="element"&&r.tagName==="tr")}const Mn={name:[[`	
\f\r &/=>`.split(""),`	
\f\r "&'/=>\``.split("")],[`\0	
\f\r "&'/<=>`.split(""),`\0	
\f\r "&'/<=>\``.split("")]],unquoted:[[`	
\f\r &>`.split(""),`\0	
\f\r "&'<=>\``.split("")],[`\0	
\f\r "&'<=>\``.split(""),`\0	
\f\r "&'<=>\``.split("")]],single:[["&'".split(""),"\"&'`".split("")],["\0&'".split(""),"\0\"&'`".split("")]],double:[['"&'.split(""),"\"&'`".split("")],['\0"&'.split(""),"\0\"&'`".split("")]]};function g1(e,t,n,i){const r=i.schema,a=r.space==="svg"?!1:i.settings.omitOptionalTags;let o=r.space==="svg"?i.settings.closeEmptyElements:i.settings.voids.includes(e.tagName.toLowerCase());const u=[];let l;r.space==="html"&&e.tagName==="svg"&&(i.schema=gt);const c=y1(i,e.properties),p=i.all(r.space==="html"&&e.tagName==="template"?e.content:e);return i.schema=r,p&&(o=!1),(c||!a||!p1(e,t,n))&&(u.push("<",e.tagName,c?" "+c:""),o&&(r.space==="svg"||i.settings.closeSelfClosing)&&(l=c.charAt(c.length-1),(!i.settings.tightSelfClosing||l==="/"||l&&l!=='"'&&l!=="'")&&u.push(" "),u.push("/")),u.push(">")),u.push(p),!o&&(!a||!Pr(e,t,n))&&u.push("</"+e.tagName+">"),u.join("")}function y1(e,t){const n=[];let i=-1,r;if(t){for(r in t)if(t[r]!==null&&t[r]!==void 0){const a=b1(e,r,t[r]);a&&n.push(a)}}for(;++i<n.length;){const a=e.settings.tightAttributes?n[i].charAt(n[i].length-1):void 0;i!==n.length-1&&a!=='"'&&a!=="'"&&(n[i]+=" ")}return n.join("")}function b1(e,t,n){const i=ai(e.schema,t),r=e.settings.allowParseErrors&&e.schema.space==="html"?0:1,a=e.settings.allowDangerousCharacters?0:1;let o=e.quote,u;if(i.overloadedBoolean&&(n===i.attribute||n==="")?n=!0:(i.boolean||i.overloadedBoolean)&&(typeof n!="string"||n===i.attribute||n==="")&&(n=!!n),n==null||n===!1||typeof n=="number"&&Number.isNaN(n))return"";const l=Ft(i.attribute,Object.assign({},e.settings.characterReferences,{subset:Mn.name[r][a]}));return n===!0||(n=Array.isArray(n)?(i.commaSeparated?ur:cr)(n,{padLeft:!e.settings.tightCommaSeparatedLists}):String(n),e.settings.collapseEmptyAttributes&&!n)?l:(e.settings.preferUnquoted&&(u=Ft(n,Object.assign({},e.settings.characterReferences,{attribute:!0,subset:Mn.unquoted[r][a]}))),u!==n&&(e.settings.quoteSmart&&mo(n,o)>mo(n,e.alternative)&&(o=e.alternative),u=o+Ft(n,Object.assign({},e.settings.characterReferences,{subset:(o==="'"?Mn.single:Mn.double)[r][a],attribute:!0}))+o),l+(u&&"="+u))}const S1=["<","&"];function Cu(e,t,n,i){return n&&n.type==="element"&&(n.tagName==="script"||n.tagName==="style")?e.value:Ft(e.value,Object.assign({},i.settings.characterReferences,{subset:S1}))}function A1(e,t,n,i){return i.settings.allowDangerousHtml?e.value:Cu(e,t,n,i)}function E1(e,t,n,i){return i.all(e)}const T1=Or("type",{invalid:C1,unknown:k1,handlers:{comment:Yy,doctype:Ky,element:g1,raw:A1,root:E1,text:Cu}});function C1(e){throw new Error("Expected node, not `"+e+"`")}function k1(e){const t=e;throw new Error("Cannot compile unknown node `"+t.type+"`")}const O1={},_1={},x1=[];function N1(e,t){const n=t||O1,i=n.quote||'"',r=i==='"'?"'":'"';if(i!=='"'&&i!=="'")throw new Error("Invalid quote `"+i+"`, expected `'` or `\"`");return{one:v1,all:R1,settings:{omitOptionalTags:n.omitOptionalTags||!1,allowParseErrors:n.allowParseErrors||!1,allowDangerousCharacters:n.allowDangerousCharacters||!1,quoteSmart:n.quoteSmart||!1,preferUnquoted:n.preferUnquoted||!1,tightAttributes:n.tightAttributes||!1,upperDoctype:n.upperDoctype||!1,tightDoctype:n.tightDoctype||!1,bogusComments:n.bogusComments||!1,tightCommaSeparatedLists:n.tightCommaSeparatedLists||!1,tightSelfClosing:n.tightSelfClosing||!1,collapseEmptyAttributes:n.collapseEmptyAttributes||!1,allowDangerousHtml:n.allowDangerousHtml||!1,voids:n.voids||Fs,characterReferences:n.characterReferences||_1,closeSelfClosing:n.closeSelfClosing||!1,closeEmptyElements:n.closeEmptyElements||!1},schema:n.space==="svg"?gt:En,quote:i,alternative:r}.one(Array.isArray(e)?{type:"root",children:e}:e,void 0,void 0)}function v1(e,t,n){return T1(e,t,n,this)}function R1(e){const t=[],n=e&&e.children||x1;let i=-1;for(;++i<n.length;)t[i]=this.one(n[i],i,e);return t.join("")}function P1(e){const t=this,n={...t.data("settings"),...e};t.compiler=i;function i(r){return N1(r,n)}}function mt(e){return E.jsx(r0,{remarkPlugins:[zu],rehypePlugins:[Ny,P1],components:{img:({...t})=>E.jsx("img",{...t,style:{display:"block",maxWidth:"100%",height:"auto"}})},children:e.children})}function w1({execute:e}){return E.jsxs(er.Fragment,{children:[E.jsxs(it,{variant:"h5",children:[" ",D1(e)," "]}),E.jsx("hr",{}),E.jsx(it,{variant:"h6",children:" Description "}),E.jsx(mt,{children:e.operation.function.description}),E.jsx("br",{}),E.jsx(it,{variant:"h6",children:" Arguments "}),E.jsx(mt,{children:["```json",JSON.stringify(e.arguments,null,2),"```"].join(`
`)}),E.jsx("br",{}),E.jsx(it,{variant:"h6",children:" Return Value "}),E.jsx(mt,{children:["```json",JSON.stringify(e.value,null,2),"```"].join(`
`)})]})}function D1(e){return e.operation.protocol==="http"?`${e.operation.function.method.toUpperCase()} ${e.operation.function.path}`:e.operation.function.name}function L1({history:e}){const[t,n]=W.useState(!1);return E.jsxs(nr,{elevation:3,style:{marginTop:15,marginBottom:15,marginRight:"15%"},children:[E.jsxs(mn,{children:[E.jsx(tr,{label:"Function Describer",variant:"outlined",color:"secondary"}),E.jsx(mt,{children:e.text})]}),E.jsx(To,{style:{textAlign:"right"},children:E.jsx(qn,{startIcon:E.jsx($o,{style:{transform:`rotate(${t?180:0}deg)`}}),onClick:()=>n(!t),children:t?"Hide Function Calls":"Show Function Calls"})}),E.jsx(fn,{in:t,timeout:"auto",unmountOnExit:!0,children:E.jsx(mn,{children:e.executes.map(i=>E.jsx(w1,{execute:i}))})})]})}const M1=It(E.jsx("path",{d:"M4 7h16v2H4zm0 6h16v-2H4zm0 4h7v-2H4zm0 4h7v-2H4zm11.41-2.83L14 16.75l-1.41 1.41L15.41 21 20 16.42 18.58 15zM4 3v2h16V3z"}),"Grading");function B1({selection:e}){const[t,n]=W.useState(!1);return E.jsxs(nr,{elevation:3,style:{marginTop:15,marginBottom:15,marginRight:"15%"},children:[E.jsxs(mn,{children:[E.jsx(tr,{icon:E.jsx(M1,{}),label:"Function Selector",variant:"outlined",color:"warning"}),E.jsx("br",{}),E.jsx("br",{}),"Operation:",e.operation.protocol==="http"?E.jsxs("ul",{children:[E.jsx("li",{children:e.operation.function.method.toUpperCase()}),E.jsx("li",{children:e.operation.function.path})]}):E.jsx("ul",{children:E.jsx("li",{children:e.operation.function.name})}),E.jsx(mt,{children:e.reason})]}),E.jsx(To,{style:{textAlign:"right"},children:E.jsx(qn,{onClick:()=>n(!t),children:t?"Hide Function Description":"Show Function Description"})}),E.jsx(fn,{in:t,timeout:"auto",unmountOnExit:!0,children:E.jsx(mn,{children:E.jsx(mt,{children:e.operation.function.description})})})]})}const G1=It(E.jsx("path",{d:"M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25m6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8"}),"Face"),F1=It(E.jsx("path",{d:"M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3M7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5M16 17H8v-2h8zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13"}),"SmartToy");function H1({prompt:e}){return E.jsx("div",{style:{display:"flex",justifyContent:e.role==="user"?"flex-end":"flex-start"},children:E.jsx(nr,{elevation:3,style:{marginTop:15,marginBottom:15,marginLeft:e.role==="user"?"15%":void 0,marginRight:e.role==="assistant"?"15%":void 0,textAlign:e.role==="user"?"right":"left",backgroundColor:e.role==="user"?"lightyellow":void 0},children:E.jsxs(mn,{children:[E.jsx(tr,{icon:e.role==="user"?E.jsx(G1,{}):E.jsx(F1,{}),label:e.role==="user"?"User":"Assistant",variant:"outlined",color:e.role==="user"?"primary":"success"}),E.jsx(mt,{children:e.text})]})})})}function J1({prompt:e}){return e.type==="text"?E.jsx(H1,{prompt:e}):e.type==="select"?e.selections.map(t=>E.jsx(B1,{selection:t})):e.type==="describe"?E.jsx(L1,{history:e}):null}function U1(e){return E.jsxs(er.Fragment,{children:[E.jsx(it,{variant:"h5",children:" Function Stack "}),E.jsx("hr",{}),e.selections.map(t=>E.jsxs(Al,{children:[E.jsx(Rl,{expandIcon:E.jsx($o,{}),children:E.jsx(it,{component:"h6",children:t.operation.protocol==="http"?`${t.operation.function.method.toUpperCase()} ${t.operation.function.path}`:t.operation.function.name})}),E.jsxs(kl,{children:[E.jsx("hr",{}),t.reason,E.jsx("br",{}),E.jsx("br",{}),E.jsx(mt,{children:t.operation.function.description})]})]}))]})}function j1(e){const t=$1(e.usage);return E.jsxs(er.Fragment,{children:[E.jsx(it,{variant:"h5",children:" Token Usage "}),E.jsx("hr",{}),E.jsxs(lc,{children:[E.jsx(Tc,{children:E.jsxs(Nn,{children:[E.jsx(qe,{children:"Type"}),E.jsx(qe,{children:"Token Usage"}),E.jsx(qe,{children:"Price"})]})}),E.jsxs(fc,{children:[E.jsxs(Nn,{children:[E.jsx(qe,{children:"Total"}),E.jsx(qe,{children:e.usage.aggregate.total.toLocaleString()}),E.jsxs(qe,{children:["$",t.total.toLocaleString()]})]}),E.jsxs(Nn,{children:[E.jsx(qe,{children:"Input"}),E.jsx(qe,{children:e.usage.aggregate.input.total.toLocaleString()}),E.jsxs(qe,{children:["$",t.prompt.toLocaleString()]})]}),E.jsxs(Nn,{children:[E.jsx(qe,{children:"Output"}),E.jsx(qe,{children:e.usage.aggregate.output.total.toLocaleString()}),E.jsxs(qe,{children:["$",t.completion.toLocaleString()]})]})]})]})]})}function $1(e){const t=(e.aggregate.input.total-e.aggregate.input.cached)*25e-7+e.aggregate.input.cached*125e-8,n=e.aggregate.output.total*(10/1e6);return{total:t+n,prompt:t,completion:n}}function q1(e){var t,n;return E.jsxs("div",{style:{padding:25},children:[e.error!==null?E.jsxs(E.Fragment,{children:[E.jsx(it,{variant:"h5",color:"error",children:"OpenAI Error"}),E.jsx("hr",{}),e.error.message,E.jsx("br",{}),E.jsx("br",{}),"Your OpenAI API key may not valid.",E.jsx("br",{}),E.jsx("br",{}),E.jsx("br",{})]}):null,E.jsx(it,{variant:"h5",children:"Agent Information"}),E.jsx("hr",{}),E.jsxs("ul",{children:[E.jsxs("li",{children:[" ","Model:",e.vendor.model]}),E.jsxs("li",{children:[" ","Locale:",((t=e.config)==null?void 0:t.locale)??navigator.language]}),E.jsxs("li",{children:["Timezone:"," ",((n=e.config)==null?void 0:n.timezone)??Intl.DateTimeFormat().resolvedOptions().timeZone]})]}),E.jsx("br",{}),E.jsx("br",{}),E.jsx(j1,{usage:e.usage}),E.jsx("br",{}),E.jsx("br",{}),E.jsx(U1,{selections:e.selections})]})}const yo=450;function V1({agent:e,title:t}){const n=W.useRef(null),i=W.useRef(null),r=W.useRef(null),a=W.useRef(null),o=W.useRef(null),[u,l]=W.useState(null),[c,p]=W.useState(""),[d,I]=W.useState(e.getHistories().slice()),[f,A]=W.useState(JSON.parse(JSON.stringify(e.getTokenUsage()))),[_,M]=W.useState(122),[x,V]=W.useState(!0),[R,K]=W.useState([]),[X,v]=W.useState(!1),j=async U=>{await U.join(),d.push(U.toHistory()),I(d)},L=async U=>{await U.join(),d.push(U.toHistory()),I(d)},H=U=>{d.push(U.toHistory()),I(d),R.push(U.selection),K(R)},J=U=>{console.error(U)};W.useEffect(()=>(o.current!==null&&o.current.select(),e.on("text",j),e.on("describe",L),e.on("select",H),e.on("validate",J),A(e.getTokenUsage()),()=>{e.off("text",j),e.off("describe",L),e.off("select",H),e.off("validate",J)}),[]);const T=()=>{setTimeout(()=>{if(n.current===null||i.current===null||r.current===null)return;const U=n.current.clientHeight+r.current.clientHeight;U!==_&&M(U)})},F=async()=>{p(""),V(!1),T();try{await e.conversate(c)}catch(Q){Q instanceof Error?(alert(Q.message),l(Q)):l(new Error("Unknown error"));return}d.splice(0,d.length),d.push(...e.getHistories()),I(d),A(e.getTokenUsage()),V(!0);const U=e.getHistories().filter(Q=>Q.type==="select").map(Q=>Q.selections).flat();for(const Q of e.getHistories().filter(b=>b.type==="cancel").map(b=>b.selections).flat()){const b=U.findIndex(Se=>Se.operation.protocol===Q.operation.protocol&&Se.operation.controller.name===Q.operation.controller.name&&Se.operation.function.name===Q.operation.function.name);b!==-1&&U.splice(b,1)}K(U)},h=async U=>{U.key==="Enter"&&U.shiftKey===!1&&(x===!1?U.preventDefault():await F())},C=Qn(),O=Wu(C.breakpoints.down("lg")),z=()=>E.jsx("div",{style:{overflowY:"auto",height:"100%",width:O?"100%":`calc(100% - ${yo}px)`,margin:0,backgroundColor:"lightblue"},children:E.jsx($r,{style:{paddingBottom:50,width:"100%",minHeight:"100%",backgroundColor:"lightblue",margin:0},ref:a,children:d.map(U=>E.jsx(J1,{prompt:U})).filter(U=>U!==null)})}),Y=()=>E.jsx("div",{style:{width:O?void 0:yo,height:"100%",overflowY:"auto",backgroundColor:"#eeeeee"},children:E.jsx($r,{maxWidth:!1,onClick:O?()=>v(!1):void 0,children:E.jsx(q1,{vendor:e.getVendor(),config:e.getConfig(),usage:f,selections:R,error:u})})});return E.jsxs("div",{style:{width:"100%",height:"100%"},children:[E.jsx(Ur,{ref:n,position:"relative",component:"div",children:E.jsxs(Wr,{children:[E.jsx(it,{variant:"h6",component:"div",sx:{flexGrow:1},children:t??"Agentica Chatbot"}),O?E.jsxs(E.Fragment,{children:[E.jsx(Hr,{onClick:void 0,children:E.jsx(ea,{})}),E.jsx(Hr,{onClick:()=>v(!0),children:E.jsx(kp,{})})]}):E.jsx(qn,{color:"inherit",startIcon:E.jsx(ea,{}),onClick:void 0,children:"Screenshot Capture"})]})}),E.jsx("div",{ref:i,style:{width:"100%",height:`calc(100% - ${_}px)`,display:"flex",flexDirection:"row"},children:O?E.jsxs(E.Fragment,{children:[z(),E.jsx(ac,{anchor:"right",open:X,onClose:()=>v(!1),children:Y()})]}):E.jsxs(E.Fragment,{children:[z(),Y()]})}),E.jsx(Ur,{ref:r,position:"static",component:"div",color:"inherit",children:E.jsxs(Wr,{children:[E.jsx(Yu,{inputRef:o,fullWidth:!0,placeholder:"Conversate with AI Chatbot",value:c,multiline:!0,onKeyUp:U=>void h(U),onChange:U=>{p(U.target.value),T()}}),E.jsx(qn,{variant:"contained",style:{marginLeft:10},startIcon:E.jsx(Op,{}),disabled:!x,onClick:void 0,children:"Send"})]})})]})}function ob(e){return E.jsx(V1,{...e})}var wr={};Object.defineProperty(wr,"__esModule",{value:!0});var z1=wr._isFormatUuid=void 0;const W1=e=>Y1.test(e);z1=wr._isFormatUuid=W1;const Y1=/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;var Dr={};Object.defineProperty(Dr,"__esModule",{value:!0});var K1=Dr._isFormatUri=void 0;const Q1=e=>X1.test(e)&&Z1.test(e);K1=Dr._isFormatUri=Q1;const X1=/\/|:/,Z1=/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;export{jo as A,z1 as _,q as a,K1 as b,ob as c,ir as v};
