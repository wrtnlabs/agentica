"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5239],{19030:(e,t,n)=>{n.r(t),n.d(t,{default:()=>a});let a={src:"/agentica/_next/static/media/agent-workflow-example.fd725045.png",height:698,width:1600,blurDataURL:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAADCAMAAACZFr56AAAACVBMVEX//v73+Pns8/Mk7PF7AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGUlEQVR4nGNgYGBgZGJkBFGMjExMIAZUBAABAwATFnOAqQAAAABJRU5ErkJggg==",blurWidth:8,blurHeight:3}},33304:(e,t,n)=>{n.d(t,{ChatExample:()=>v});var a=n(1171);let r=[{author:"user",message:"What can you do?"},{author:"agent",type:"assistant",message:"I can assist you with various shopping-related functionalities. Here are some of the actions I can perform:\n\n1. **Join membership** - Sign up for a shopping membership.\n2. **Login** - Log in with your membership account.\n3. **Get coupons** - List all available coupons and their details.\n4. **Create orders** - Manage order applications, including creating new orders and retrieving order information.\n5. **Get sales information** - View detailed and summarized sales for shopping items.\n6. **Inquiry and review handling** - Write questions related to sales, create reviews, and manage inquiries.\n\nIf you have a specific request or action you'd like to take, please let me know!"},{author:"user",message:"Would you show me sales in the market?"},{author:"agent",type:"func_selector",message:"Operation:\n\n- PATCH\n- Shopping/Customer/sales\n\nUser requested to see sales in the market."},{author:"agent",type:"func_describer",message:"The function call was successfully executed, retrieving a list of summarized sales from the shopping platform. Here is a detailed description of the sales:\n\n### Sales Summary\n\n#### Sale 1: Apple Watch\n\n- **Sale Details:**\n  - Sale ID: 06395e6e-2764-4fb8-a6b2-16b68e97a31b\n  - Snapshot ID: d23848a6-d15b-42e9-850b-e06806c42741\n  - Created At: 2025-02-21T04:37:40.152Z\n  - Price Range:\n    - Lowest: 599,000 KRW\n    - Highest: 639,000 KRW\n\n- **Content:**\n  - Title: Apple Watch\n  - Thumbnails:\n![apple watch](/agentica/watch.png)\n\n---\n\n#### Sale 2: Apple MacBook Pro\n- **Sale Details:**\n  - Sale ID: 7212bc44-31f8-4571-b3e9-5362040aee50\n  - Snapshot ID: 3fb4895a-6ac1-4abf-b94d-28945bab2c0c\n  - Created At: 2025-02-21T04:37:40.724Z\n  - Price Range:\n    - Lowest: 1,800,000 KRW\n    - Highest: 3,993,000 KRW\n\n- **Content:**\n  - Title: Apple MacBook Pro\n  - Thumbnails:\n![macbook](/agentica/macbook.png)\n"},{author:"user",message:"I wanna buy MacBook. Select the (Silver, 16GB, 1TB, English) stock and put it to the shopping cart"},{author:"agent",type:"func_selector",message:"Operation:\n\n- POST\n- /shoppings/customers/carts/commodities\n  \nUser wants to add a selected stock to the shopping cart."},{author:"agent",type:"func_describer",message:"The function call was executed successfully and resulted in the creation of a new commodity in the shopping cart. Below are the details regarding the created commodity:\n\n### Commodity Details\n- Commodity ID: 4d60821b-2546-4230-b727-48cc9ced6977\n\n#### Sale Information\n- Sale ID: 72126644-31f8-4571-b3e9-5362040aee50\n- Snapshot ID: 3fb4895-6a01-4abf-b94d-28945bab2c0c\n- Latest Snapshot: Yes\n\n#### Content Information\n- Title: Apple MacBook Pro\n- Thumbnail:\n![macbook](/agentica/macbook.png)\n\n#### Unit Details\n- Unit ID: 2217919-45f4-45f3-9712-d535b7efa763\n- Unit Name: MacBook M3 Pro 14inch Entity\n- Stocks:\n  - Stock ID: 3746725f-e367-46f7-ac7b-118f8ff57180\n  - Name: MacBook Pro (Silver, 16GB, 1TB, English)\n  - Price:\n    - Nominal: 2,300,000\n    - Real: 2,070,000\n  - Quantity: 1\n  - Inventory:\n    - Available Stock: 1,000,000 (Income)\n    - Sold Stock: 0 (Outcome)\n  - Choices:\n    - Color: Silver\n    - RAM: 16GB\n    - SSD: 1TB\n    - Keyboard Language: English\n\n### Additional Information\n- Orderable: Yes\n- Pseudo: No\n- Volume: 1\n- Creation Date: 2025-03-05T13:22:18.907Z\n\nThis comprehensive overview gives you insight into the specifics of the newly created commodity in your shopping cart. If you need more details or have further questions, feel free to ask!"},{author:"user",message:"I'll pay it with cash, and my address is:\n\ncountry: South Korea\ncity/province: Seoul\ndepartment: Wrtn Apartment\npossession: 101-1411"},{author:"agent",type:"func_selector",message:"Operation:\n\n- POST\n- /shoppings/customers/orders\n\nTo create a new order application from the shopping cart."},{author:"agent",type:"func_selector",message:"Operation:\n\n- POST\n- /shoppings/customers/orders/{orderId}/publish\n\nProceeding with the order completion using the provided address and cash payment method."},{author:"agent",type:"func_describer",message:"The function call was made to create and publish an order from a shopping cart. This action included the customer's address details and payment vendor information. Here's a detailed description of the return value from this function call:\n\n### Function Call Summary\n\n#### Order Application:\n- Method: POST\n- Path: /shoppings/customers/orders\n- Status: 201 Created\n\n#### Order Publication:\n- Method: POST\n- Path: /shoppings/customers/orders/{orderId}/publish\n- Status: 201 Created\n\n### Return Value Overview\nThe return value provides information about the completed order and the associated delivery details. Here's a breakdown of the important sections:\n\n\n#### Order Details\n\n- State:\n  - The current state of the order is listed as none. This indicates that no deliveries have taken place yet and that the order is not currently being processed.\n\n- Order ID:\n  - The ID of the published order is b5cebb2-3a52-480b-9f74-b188ac78f201. This serves as a reference for tracking the order in the future.\n\n- Created At:\n  - The order was created at 2025-03-05 13:24:40.077Z. This timestamp indicates when the order was officially published in the system.\n\n- Paid At:\n  - The payment for this order is marked as completed at 2025-03-05T 13:24:40.077Z. This confirms that the payment has been successfully processed along with the order.\n  \n- Cancelled At:\n  - This field is null, indicating that there has been no cancellation for the order.\n\n#### Address Details\n\nThe address for delivery has been confirmed and includes:\n\n- Mobile: 01012345678\n- Name: John Doe\n- Country: South Korea\n- Province: Seoul\n- City: Seoul\n- Department: Wrtn Apartment\n- Possession: 101-1411\n- Zip Code: 04100\n- Special Note: This field is null, meaning there are no additional instructions provided for the delivery.\n\n#### Conclusion\n\nThe order was successfully published with payment completed and is waiting to be processed for delivery. Since the state is currently none, no deliveries have yet taken place; however, the details provided will assist in tracking and managing the order moving forward.\n\nIf you have any more questions or need further assistance regarding the order, feel free to ask!"},{author:"user",message:"Thank you!"}];var s=n(36723),i=n(32628),o=n(66244),l=n(79846),c=n(83818),d=n(60565),u=n(24305),h=n(12550),m=n(70939);function p(e){let{children:t}=e,n=/^ {2,}-\s/;if(n.test(t)){var r;let e=t.replace(n,""),s=Math.floor(((null===(r=t.match(/^ */))||void 0===r?void 0:r[0].length)||2)/2)+2;return(0,a.jsx)("ul",{className:"whitespace-normal list-inside list-disc text-sm",style:{paddingLeft:"".concat(s,"rem")},children:(0,a.jsx)("li",{className:"marker:absolute marker:-left-[4px] marker:mr-[4px]",children:e})})}return""===t?(0,a.jsx)("br",{}):(0,a.jsx)(m.oz,{components:{p:e=>{let{...t}=e;return(0,a.jsx)("p",{...t,className:"text-sm"})},h3:e=>{let{...t}=e;return(0,a.jsx)("h4",{...t,className:"font-bold text-base"})},h4:e=>{let{...t}=e;return(0,a.jsx)("h4",{...t,className:"font-bold text-sm"})},ul:e=>{let{...t}=e;return(0,a.jsx)("ul",{...t,className:"whitespace-normal list-inside list-disc pl-2 text-sm"})},ol:e=>{let{...t}=e;return(0,a.jsx)("ol",{...t,className:"whitespace-normal list-inside list-decimal pl-2 text-sm"})},li:e=>{let{...t}=e;return(0,a.jsx)("li",{className:"marker:absolute marker:-left-[2px] marker:mr-[2px]",...t})},img:e=>{let{...t}=e;return(0,a.jsx)("img",{...t,alt:"image",className:"block w-max-full h-auto"})},hr:e=>{let{...t}=e;return(0,a.jsx)("hr",{...t,className:"border-zinc-700"})}},children:t})}let f={assistant:{icon:(0,a.jsx)(c.A,{size:16}),label:"Assistant"},func_selector:{icon:(0,a.jsx)(d.A,{size:16}),label:"Function Selector"},func_describer:{icon:(0,a.jsx)(u.A,{size:16}),label:"Function Describer"}},g=(0,o.F)("py-4 px-5 rounded-2xl flex flex-col gap-4",{variants:{author:{user:"bg-zinc-600 max-w-[272px] ml-auto text-zinc-100",agent:"bg-white w-[340px] text-zinc-700"}}});function b(e){let{author:t,message:n,type:r}=e,[i,o]=(0,s.useState)([]),c=n.split(/\n/);return(0,s.useEffect)(()=>{let e=[];return c.forEach((t,n)=>{let a=setTimeout(()=>{o(e=>[...e,t])},50*n);e.push(a)}),()=>{e.forEach(clearTimeout)}},[]),(0,a.jsxs)("div",{className:"flex gap-2 w-full",children:["agent"===t&&(0,a.jsx)(l.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},className:"w-8 h-8 flex justify-center items-center rounded-full bg-[#D2FBF9]",children:(0,a.jsx)(h.default,{src:"/agentica/agent.svg",alt:"agent",width:20,height:20})}),(0,a.jsxs)("div",{className:g({author:t}),children:[r&&(0,a.jsxs)(l.P.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.3},className:"w-fit font-bold text-xs rounded-full border-[#06474C] text-[#06474C] border px-2 py-1 flex gap-1",children:[f[r].icon,f[r].label]}),(0,a.jsx)("div",{className:"flex flex-col",children:i.map((e,t)=>(0,a.jsx)(l.P.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},style:{transition:"opacity 0.4s ease-in-out"},children:(0,a.jsx)(p,{children:e})},t))})]})]})}function v(){let e=(0,s.useRef)(null),t=(0,s.useRef)(null),[n,o]=(0,s.useState)(0),[l,c]=(0,s.useState)(!1),d=function(e,t){let{threshold:n=0,root:a=null,rootMargin:r="0%",freezeOnceVisible:i=!1}=t,[o,l]=(0,s.useState)(),c=(null==o?void 0:o.isIntersecting)&&i,d=e=>{let[t]=e;l(t)};return(0,s.useEffect)(()=>{let t=null==e?void 0:e.current;if(!window.IntersectionObserver||c||!t)return;let s=new IntersectionObserver(d,{threshold:n,root:a,rootMargin:r});return s.observe(t),()=>s.disconnect()},[null==e?void 0:e.current,JSON.stringify(n),a,r,c]),o}(t,{rootMargin:"0px"});return(0,s.useEffect)(()=>{c(!!(null==d?void 0:d.isIntersecting))},[null==d?void 0:d.isIntersecting]),(0,s.useEffect)(()=>{if(n<r.length){let e=setTimeout(()=>{o(e=>e+1)},50*r[n].message.split(/\n/).length+1e3);return()=>clearTimeout(e)}},[n]),(0,a.jsxs)("div",{className:"hidden shrink-0 relative z-10 py-6 px-3 w-[480px] h-[800px] bg-[#27272A]/70 backdrop-blur-[10px] md:block rounded-[20px] ",children:[(0,a.jsx)("div",{ref:e,className:"h-full px-3 flex flex-col gap-6 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-400",children:r.slice(0,n).map((e,n)=>{let s=n===r.length-1;return(0,a.jsx)("div",{ref:s?t:void 0,children:(0,a.jsx)(b,{...e})},n)})}),n>=4&&(0,a.jsx)("button",{onClick:l?()=>{if(e.current){var t;null===(t=e.current)||void 0===t||t.scrollTo({top:0,behavior:"smooth"})}}:()=>{e.current&&e.current.scrollTo({top:e.current.scrollHeight,behavior:"smooth"})},className:"cursor-pointer absolute bottom-4 left-[50%] transform-[translate(-50%,-50%)] bg-zinc-700/70 text-zinc-100 p-2 rounded-full w-fit",style:{transform:l?"rotate(180deg)":"rotate(0)",transition:"transform 0.3s"},children:(0,a.jsx)(i.A,{size:20})})]})}},50140:(e,t,n)=>{n.d(t,{CardShowcase:()=>p});var a=n(1171),r=n(37970),s=n(30642);function i(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,s.QP)((0,r.$)(t))}var o=n(66244),l=n(12550);n(36723);var c=n(93283);let d=(0,o.F)("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});function u(e){let{className:t,variant:n,asChild:r=!1,...s}=e,o=r?c.DX:"span";return(0,a.jsx)(o,{"data-slot":"badge",className:i(d({variant:n}),t),...s})}var h=n(99502);function m(e){let{children:t}=e,[n]=(0,h.A)(t);return n}function p(e){let{title:t,description:n,imageSrc:r,status:s="active",isNew:o=!1}=e,c="active"===s;return(0,a.jsx)(m,{children:e=>(0,a.jsxs)("div",{className:i(f({status:s})),children:[(0,a.jsx)("div",{className:i("relative flex justify-center items-center aspect-[16/9] max-h-[200px] overflow-hidden rounded-md bg-zinc-400 md:max-h-[400px]",!c&&"opacity-50"),children:(0,a.jsx)(l.default,{src:r,alt:t,objectFit:"cover",layout:"fill",className:i("h-full w-full object-cover transition-all duration-300",e&&c&&"scale-110")})}),(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)("div",{className:i("h-[18px] w-[18px] rounded-full md:h-6 md:w-6",c?"bg-[#86FFD9]":"bg-zinc-600")}),(0,a.jsx)("h3",{className:i("text-lg font-medium",c?"text-zinc-50":"text-zinc-700"),children:t}),o&&(0,a.jsx)(u,{variant:"secondary",className:"bg-zinc-800 text-zinc-400",children:"New"})]}),(0,a.jsx)("p",{className:i("text-[14px] leading-6 font-medium md:text-[16px]",c?"text-zinc-400":"text-zinc-700"),children:n})]})})}let f=(0,o.F)(i("relative rounded-[32px] transition-all duration-300 p-2 md:p-4 shadow-sm flex flex-col gap-4"),{variants:{status:{active:"bg-[#030303] hover:bg-zinc-900 active:bg-zinc-800 cursor-pointer",inactive:"bg-transparent cursor-not-allowed"}},defaultVariants:{status:"active"}})},55312:(e,t,n)=>{n.r(t),n.d(t,{default:()=>a});let a={src:"/agentica/_next/static/media/logo.aa416b87.png",height:655,width:1310,blurDataURL:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAMAAACEE47CAAAAFVBMVEUFFxcFCwsIICAFERETLSwrS0lYgX13pxcTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAI0lEQVR4nBXIwREAMAjDMCeG7j8yVz0FtJCANSqkb535s0M5A/IAQn1nCZUAAAAASUVORK5CYII=",blurWidth:8,blurHeight:4}}}]);