"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3193],{24881:(e,n,t)=>{t.d(n,{CardShowcase:()=>d});var a=t(66718),s=t(28558),r=t(97398);t(11214);var i=t(31070);let o=(0,r.F)("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});function l(e){let{className:n,variant:t,asChild:r=!1,...l}=e,c=r?i.DX:"span";return(0,a.jsx)(c,{"data-slot":"badge",className:(0,s.cn)(o({variant:t}),n),...l})}var c=t(64796);function d(e){let{title:n,description:t,imageSrc:r,status:i="active",isNew:o=!1}=e,d="active"===i;return(0,a.jsx)(c.h,{children:e=>(0,a.jsxs)("div",{className:(0,s.cn)(h({status:i})),children:[(0,a.jsx)("div",{className:(0,s.cn)("aspect-[16/9] max-h-[200px] overflow-hidden rounded-md bg-zinc-400 md:max-h-[400px]",!d&&"opacity-50"),children:(0,a.jsx)("img",{src:r,alt:n,className:(0,s.cn)("h-full w-full object-cover transition-all duration-300",e&&d&&"scale-110")})}),(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)("div",{className:(0,s.cn)("h-[18px] w-[18px] rounded-full md:h-6 md:w-6",d?"bg-[#86FFD9]":"bg-zinc-600")}),(0,a.jsx)("h3",{className:(0,s.cn)("text-lg font-medium",d?"text-zinc-50":"text-zinc-700"),children:n}),o&&(0,a.jsx)(l,{variant:"secondary",className:"bg-zinc-800 text-zinc-400",children:"New"})]}),(0,a.jsx)("p",{className:(0,s.cn)("text-[14px] leading-6 font-medium md:text-[16px]",d?"text-zinc-400":"text-zinc-700"),children:t})]})})}let h=(0,r.F)((0,s.cn)("relative rounded-[32px] transition-all duration-300 p-2 md:p-4 shadow-sm flex flex-col gap-4"),{variants:{status:{active:"bg-[#030303] hover:bg-zinc-900 active:bg-zinc-800 cursor-pointer",inactive:"bg-transparent cursor-not-allowed"}},defaultVariants:{status:"active"}})},28558:(e,n,t)=>{t.d(n,{cn:()=>r});var a=t(2900),s=t(27376);function r(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];return(0,s.QP)((0,a.$)(n))}},43719:(e,n,t)=>{t.d(n,{PreviewCard:()=>d});var a=t(66718),s=t(28558),r=t(21739),i=t.n(r),o=t(92192),l=t(64796);function c(e){return(0,a.jsx)("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,a.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 3.64235L19.6788 11.3212V12.6788L12 20.3576L10.6424 19L16.6824 12.96H4.04001V11.04H16.6824L10.6424 4.99999L12 3.64235Z",fill:"currentColor"})})}function d(e){let{title:n,image:t,href:r}=e,[d,h]=(0,o.A)((0,a.jsx)("div",{children:(0,a.jsx)(l.h,{children:e=>(0,a.jsxs)("div",{className:"flex w-full cursor-pointer flex-col gap-3 p-5 pr-10 transition-colors duration-300 hover:bg-zinc-900 md:p-5 md:pr-0 md:hover:bg-transparent",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsxs)("div",{className:"flex flex-1 flex-col gap-1",children:[(0,a.jsx)("p",{className:"text-lg font-[450] text-zinc-400",children:"Next"}),(0,a.jsx)("p",{className:"text-2xl font-medium text-zinc-50",children:n})]}),(0,a.jsx)(i(),{href:r,children:(0,a.jsx)(c,{width:48,height:48,className:(0,s.cn)("text-zinc-600")})})]}),(0,a.jsx)("div",{className:"hidden overflow-hidden rounded-[8px] md:block",children:(0,a.jsx)("img",{src:t,alt:"".concat(n,"_thumbnail"),className:(0,s.cn)("aspect-video w-full bg-[#27272A] object-cover transition-all duration-300",{"scale-110":e})})})]})})}));return(0,a.jsxs)("div",{className:(0,s.cn)("relative z-10 w-full bg-transparent md:w-[420px] md:pr-20"),children:[d,(0,a.jsx)("div",{className:(0,s.cn)("absolute top-0 right-0 -z-10 hidden h-full w-full bg-[linear-gradient(270deg,_#27272A_0%,_transparent_32%)] opacity-0 transition-opacity duration-300 md:block",{"opacity-100":h})})]})}},64796:(e,n,t)=>{t.d(n,{h:()=>s}),t(11214);var a=t(92192);function s(e){let{children:n}=e,[t]=(0,a.A)(n);return t}},71713:(e,n,t)=>{t.d(n,{ChatExample:()=>m});var a=t(66718);let s=[{author:"agent",type:"assistant",messages:["I can assist you with various shopping-related functionalities. Here are some of the actions I can perform:\n","1. **Join membership** - Sign up for a shopping membership.\n2. **Login** - Log in with your membership account.\n3. **Get coupons** -  List all available coupons and their details.\n4. **Create orders** - Manage order applications, including creating new orders and retrieving order information.\n5. **Get sales information** - View detailed and summarized sales for shopping items.\n6. **Inquiry and review handling** - Write questions related to sales, create reviews, and manage inquiries.\n\n","If you have a specific request or action you'd like to take, please let me know!"]},{author:"user",messages:["Would you show me sales in the market?"]},{author:"agent",type:"func_selector",messages:["Operation:\n\n- PATCH\n- Shopping/Customer/sales\n\nUser requested to see sales in the market."]},{author:"agent",type:"func_describer",messages:["The function call retrieved a list of summarized sales from the shopping platform, presenting a total of four records. Below is a detailed description of each sale:","### Sales Summary\n#### Sale 1: Apple Watch\n- **Sale Details:**\n  - Sale ID: 06395e6e-2764-4fb8-a6b2-16b68e97a31b\n  - Snapshot ID: d23848a6-d15b-42e9-850b-e06806c42741\n  - Created At: 2025-02-21T04:37:40.152Z\n  - Price Range:\n    - Lowest: 599,000 KRW\n    - Highest: 639,000 KRW\n\n- **Content:**\n  - Title: Apple Watch\n  - Thumbnails:\n![apple watch](/agentica/watch.png)\n","---\n#### Sale 2: Apple MacBook Pro\n- **Sale Details:**\n  - Sale ID: 7212bc44-31f8-4571-b3e9-5362040aee50\n  - Snapshot ID: 3fb4895a-6ac1-4abf-b94d-28945bab2c0c\n  - Created At: 2025-02-21T04:37:40.724Z\n  - Price Range:\n    - Lowest: 1,800,000 KRW\n    - Highest: 3,993,000 KRW\n\n- **Content:**\n  - Title: Apple MacBook Pro\n  - Thumbnails:\n![macbook](/agentica/macbook.png)\n"]},{author:"user",messages:["I wanna buy MacBook. Select the (Silver, 16GB, 1TB, English) stock and put it to the shopping cart"]},{author:"agent",type:"func_selector",messages:["Operation:\n\n- POST\n- /shoppings/customers/carts/commodities\n\nUser wants to add a selected stock to the shopping cart."]},{author:"agent",type:"func_describer",messages:["The function call was executed successfully and resulted in the creation of a new commodity in the shopping cart. Below are the details regarding the created commodity:","### Commodity Details\n- Commodity ID: 4d60821b-2546-4230-b727-48cc9ced6977\n#### Sale Information\n- Sale ID: 72126644-31f8-4571-b3e9-5362040aee50- Snapshot ID: 3fb4895-6a01-4abf-b94d-28945bab2c0c- Latest Snapshot: Yes#### Content Information\n- Title: Apple MacBook Pro- Thumbnail: ![macbook](/agentica/macbook.png)\n","#### Unit Details\n- Unit ID: 2217919-45f4-45f3-9712-d535b7efa763\n- Unit Name: MacBook M3 Pro 14inch Entity\n- Stocks:\n  - Stock ID: 3746725f-e367-46f7-ac7b-118f8ff57180\n  - Name: MacBook Pro (Silver, 16GB, 1TB, English)\n  - Price:\n    - Nominal: 2,300,000\n    - Real: 2,070,000\n  - Quantity: 1\n  - Inventory:\n    - Available Stock: 1,000,000 (Income)\n    - Sold Stock: 0 (Outcome)\n  - Choices:\n    - Color: Silver\n    - RAM: 16GB\n    - SSD: 1TB\n    - Keyboard Language: English\n","### Additional Information\n- Orderable: Yes\n- Pseudo: No\n- Volume: 1\n- Creation Date: 2025-03-05T13:22:18.907Z\n\n","This comprehensive overview gives you insight into the specifics of the newly created commodity in your shopping cart. If you need more details or have further questions, feel free to ask!"]},{author:"user",messages:["I'll pay it with cash, and my address is:\n\ncountry: South Korea city/province: Seoul\n\ndepartment: Wrtn Apartment\npossession: 101-1411"]},{author:"agent",type:"func_selector",messages:["Operation:\n\n - POST\n - /shoppings/customers/orders\n\nTo create a new order application from the shopping cart."]},{author:"agent",type:"func_selector",messages:["Operation:\n\n- POST\n- /shoppings/customers/orders/{orderld}/publish\n\nProceeding with the order completion using the provided address and cash payment method."]},{author:"agent",type:"func_describer",messages:["The function call was made to create and publish an order from a shopping cart. This action included the customer's address details and payment vendor information. Here's a detailed description of the return value from this function call:\n","### Function Call Summary\n#### Order Application:\n  - Method: POST\n  - Path: /shoppings/customers/orders\n  - Status: 201 Created\n","#### Order Publication:\n  - Method: POST\n  - Path: /shoppings/customers/orders/{orderId}/publish\n  - Status: 201 Created\n","### Return Value Overview\nThe return value provides information about the completed order and the associated delivery details. Here's a breakdown of the important sections:\n","#### Order Details\n- State:\n  - The current state of the order is listed as none. This indicates that no deliveries have taken place yet and that the order is not currently being processed.\n- Order ID:\n  - The ID of the published order is b5cebb2-3a52-480b-9f74-b188ac78f201. This serves as a reference for tracking the order in the future.\n- Created At:\n  - The order was created at 2025-03-05 13:24:40.077Z. This timestamp indicates when the order was officially published in the system.\n- Paid At:\n  - The payment for this order is marked as completed at 2025-03-05T 13:24:40.077Z. This confirms that the payment has been successfully processed along with the order.\n- Cancelled At:  - This field is null, indicating that there has been no cancellation for the order.","#### Address Details\nThe address for delivery has been confirmed and includes:\n- Mobile: 01012345678\n- Name: John Doe\n- Country: South Korea\n- Province: Seoul\n- City: Seoul\n- Department: Wrtn Apartment\n- Possession: 101-1411\n- Zip Code: 04100\n- Special Note: This field is null, meaning there are no additional instructions provided for the delivery.\n","#### Conclusion\nThe order was successfully published with payment completed and is waiting to be processed for delivery. Since the state is currently none, no deliveries have yet taken place; however, the details provided will assist in tracking and managing the order moving forward.\n\nIf you have any more questions or need further assistance regarding the order, feel free to ask!"]}];var r=t(97398),i=t(27964),o=t(38212),l=t(74455);t(11214);var c=t(81507);function d(e){let{children:n}=e;return(0,a.jsx)(c.oz,{components:{p:e=>{let{...n}=e;return(0,a.jsx)("p",{...n,className:"text-sm"})},h3:e=>{let{...n}=e;return(0,a.jsx)("h4",{...n,className:"font-bold text-base"})},h4:e=>{let{...n}=e;return(0,a.jsx)("h4",{...n,className:"font-bold text-sm"})},ul:e=>{let{...n}=e;return(0,a.jsx)("ul",{...n,className:"whitespace-normal list-inside list-disc pl-2 text-sm"})},ol:e=>{let{...n}=e;return(0,a.jsx)("ol",{...n,className:"whitespace-normal list-inside list-decimal pl-2 text-sm"})},li:e=>{let{...n}=e;return(0,a.jsx)("li",{className:"marker:absolute marker:-left-[2px] marker:mr-[2px]",...n})},img:e=>{let{...n}=e;return(0,a.jsx)("img",{...n,className:"block w-max-full h-auto"})}},children:n})}let h={assistant:{icon:(0,a.jsx)(i.A,{size:16}),label:"Assistant"},func_selector:{icon:(0,a.jsx)(o.A,{size:16}),label:"Function Selector"},func_describer:{icon:(0,a.jsx)(l.A,{size:16}),label:"Function Describer"}},u=(0,r.F)("py-4 px-5 rounded-2xl flex flex-col gap-4 ",{variants:{author:{user:"bg-zinc-600 max-w-[272px] ml-auto text-zinc-100",agent:"bg-white max-w-[340px] text-zinc-700"}}});function p(e){let{author:n,messages:t,type:s}=e;return(0,a.jsxs)("div",{className:u({author:n}),children:[s&&(0,a.jsxs)("div",{className:"w-fit font-bold text-xs rounded-full border-[#06474C] text-[#06474C] border px-2 py-1 flex gap-1",children:[h[s].icon,h[s].label]}),t.map((e,n)=>(0,a.jsx)(d,{children:e},n))]})}function m(){return(0,a.jsxs)("div",{className:"hidden overflow-y-scroll h-full w-[480px] rounded-[20px] bg-[#27272A] md:flex flex-col gap-6 px-7 py-6 z-10",children:[(0,a.jsx)(p,{author:"user",messages:["What can you do?"]}),s.map((e,n)=>(0,a.jsx)(p,{...e},n))]})}},97451:(e,n,t)=>{t.r(n),t.d(n,{default:()=>a});let a={src:"/agentica/_next/static/media/logo.aa416b87.png",height:655,width:1310,blurDataURL:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAMAAACEE47CAAAAFVBMVEUFFxcFCwsIICAFERETLSwrS0lYgX13pxcTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAI0lEQVR4nBXIwREAMAjDMCeG7j8yVz0FtJCANSqkb535s0M5A/IAQn1nCZUAAAAASUVORK5CYII=",blurWidth:8,blurHeight:4}}}]);