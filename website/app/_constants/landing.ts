import { FeedbackIcon } from "../_components/icons/Feedback";
import { MCPIcon } from "../_components/icons/MCP";
import { SwaggerIcon } from "../_components/icons/Swagger";
import { TypescriptClassIcon } from "../_components/icons/TypescriptClass";
import { DeclarativeIcon } from "../_components/icons/grapic/Declarative";
import { RobustIcon } from "../_components/icons/grapic/RobustIcon";
import { StructuredIcon } from "../_components/icons/grapic/StructuredIcon";

export const CHAT_BUBBLE_DELAY = 500;

export const CHAT_EXAMPLE_INITIAL_MESSAGE = "What can you do?";

export type ChatMessageType = {
  author: "user" | "agent";
  type?: "assistant" | "func_selector" | "func_describer";
  message: string;
};

export const CHAT_EXAMPLE_MESSAGE_LIST: ChatMessageType[] = [
  {
    author: "user",
    message: "What can you do?",
  },
  {
    author: "agent",
    type: "assistant",
    message: `I can assist you with various shopping-related functionalities. Here are some of the actions I can perform:

1. **Join membership** - Sign up for a shopping membership.
2. **Login** - Log in with your membership account.
3. **Get coupons** - List all available coupons and their details.
4. **Create orders** - Manage order applications, including creating new orders and retrieving order information.
5. **Get sales information** - View detailed and summarized sales for shopping items.
6. **Inquiry and review handling** - Write questions related to sales, create reviews, and manage inquiries.

If you have a specific request or action you'd like to take, please let me know!`,
  },
  { author: "user", message: "Would you show me sales in the market?" },
  {
    author: "agent",
    type: "func_selector",
    message: `Operation:

- PATCH
- Shopping/Customer/sales

User requested to see sales in the market.`,
  },
  {
    author: "agent",
    type: "func_describer",
    message: `The function call was successfully executed, retrieving a list of summarized sales from the shopping platform. Here is a detailed description of the sales:

### Sales Summary

#### Sale 1: Apple Watch

- **Sale Details:**
  - Sale ID: 06395e6e-2764-4fb8-a6b2-16b68e97a31b
  - Snapshot ID: d23848a6-d15b-42e9-850b-e06806c42741
  - Created At: 2025-02-21T04:37:40.152Z
  - Price Range:
    - Lowest: 599,000 KRW
    - Highest: 639,000 KRW

- **Content:**
  - Title: Apple Watch
  - Thumbnails:
![apple watch](/agentica/watch.png)

---

#### Sale 2: Apple MacBook Pro
- **Sale Details:**
  - Sale ID: 7212bc44-31f8-4571-b3e9-5362040aee50
  - Snapshot ID: 3fb4895a-6ac1-4abf-b94d-28945bab2c0c
  - Created At: 2025-02-21T04:37:40.724Z
  - Price Range:
    - Lowest: 1,800,000 KRW
    - Highest: 3,993,000 KRW

- **Content:**
  - Title: Apple MacBook Pro
  - Thumbnails:
![macbook](/agentica/macbook.png)
`,
  },
  {
    author: "user",
    message:
      "I wanna buy MacBook. Select the (Silver, 16GB, 1TB, English) stock and put it to the shopping cart",
  },
  {
    author: "agent",
    type: "func_selector",
    message: `Operation:

- POST
- /shoppings/customers/carts/commodities
  
User wants to add a selected stock to the shopping cart.`,
  },
  {
    author: "agent",
    type: "func_describer",
    message: `The function call was executed successfully and resulted in the creation of a new commodity in the shopping cart. Below are the details regarding the created commodity:

### Commodity Details
- Commodity ID: 4d60821b-2546-4230-b727-48cc9ced6977

#### Sale Information
- Sale ID: 72126644-31f8-4571-b3e9-5362040aee50
- Snapshot ID: 3fb4895-6a01-4abf-b94d-28945bab2c0c
- Latest Snapshot: Yes

#### Content Information
- Title: Apple MacBook Pro
- Thumbnail:
![macbook](/agentica/macbook.png)

#### Unit Details
- Unit ID: 2217919-45f4-45f3-9712-d535b7efa763
- Unit Name: MacBook M3 Pro 14inch Entity
- Stocks:
  - Stock ID: 3746725f-e367-46f7-ac7b-118f8ff57180
  - Name: MacBook Pro (Silver, 16GB, 1TB, English)
  - Price:
    - Nominal: 2,300,000
    - Real: 2,070,000
  - Quantity: 1
  - Inventory:
    - Available Stock: 1,000,000 (Income)
    - Sold Stock: 0 (Outcome)
  - Choices:
    - Color: Silver
    - RAM: 16GB
    - SSD: 1TB
    - Keyboard Language: English

### Additional Information
- Orderable: Yes
- Pseudo: No
- Volume: 1
- Creation Date: 2025-03-05T13:22:18.907Z

This comprehensive overview gives you insight into the specifics of the newly created commodity in your shopping cart. If you need more details or have further questions, feel free to ask!`,
  },
  {
    author: "user",
    message: `I'll pay it with cash, and my address is:

country: South Korea
city/province: Seoul
department: Wrtn Apartment
possession: 101-1411`,
  },
  {
    author: "agent",
    type: "func_selector",
    message: `Operation:

- POST
- /shoppings/customers/orders

To create a new order application from the shopping cart.`,
  },
  {
    author: "agent",
    type: "func_selector",
    message: `Operation:

- POST
- /shoppings/customers/orders/{orderId}/publish

Proceeding with the order completion using the provided address and cash payment method.`,
  },
  {
    author: "agent",
    type: "func_describer",
    message: `The function call was made to create and publish an order from a shopping cart. This action included the customer's address details and payment vendor information. Here's a detailed description of the return value from this function call:

### Function Call Summary

#### Order Application:
- Method: POST
- Path: /shoppings/customers/orders
- Status: 201 Created

#### Order Publication:
- Method: POST
- Path: /shoppings/customers/orders/{orderId}/publish
- Status: 201 Created

### Return Value Overview
The return value provides information about the completed order and the associated delivery details. Here's a breakdown of the important sections:\n

#### Order Details

- State:
  - The current state of the order is listed as none. This indicates that no deliveries have taken place yet and that the order is not currently being processed.

- Order ID:
  - The ID of the published order is b5cebb2-3a52-480b-9f74-b188ac78f201. This serves as a reference for tracking the order in the future.

- Created At:
  - The order was created at 2025-03-05 13:24:40.077Z. This timestamp indicates when the order was officially published in the system.

- Paid At:
  - The payment for this order is marked as completed at 2025-03-05T 13:24:40.077Z. This confirms that the payment has been successfully processed along with the order.
  
- Cancelled At:
  - This field is null, indicating that there has been no cancellation for the order.

#### Address Details

The address for delivery has been confirmed and includes:

- Mobile: 01012345678
- Name: John Doe
- Country: South Korea
- Province: Seoul
- City: Seoul
- Department: Wrtn Apartment
- Possession: 101-1411
- Zip Code: 04100
- Special Note: This field is null, meaning there are no additional instructions provided for the delivery.

#### Conclusion

The order was successfully published with payment completed and is waiting to be processed for delivery. Since the state is currently none, no deliveries have yet taken place; however, the details provided will assist in tracking and managing the order moving forward.

If you have any more questions or need further assistance regarding the order, feel free to ask!`,
  },
  { author: "user", message: "Thank you!" },
];

export const FUNC_CALL_CODE = `import { Agentica } from "@agentica/core";
import typia from "typia";

const agent = new Agentica({
  controllers: [ 
   await fetch(
     "https://shopping-be.wrtn.ai/editor/swagger.json", 
   ).then(r => r.json()),
   typia.llm.application<ShoppingCounselor>(),
   typia.llm.application<ShoppingPolicy>(),
   typia.llm.application<ShoppingSearchRag>(),
  ],
});
await agent.conversate("I wanna buy MacBook Pro");`;

export const FUNC_CALLS = [
  {
    icon: FeedbackIcon,
    title: "Validation Feedback",
    description:
      "LLM doesn’t always get function parameters right. With validation feedback, it learns from mistakes and improves accuracy. This ensures more reliable and successful function calls.",
  },
  {
    icon: SwaggerIcon,
    title: "Swagger",
    description:
      "Just upload a Swagger document, and AI will handle API calls. It understands your backend and interacts with it automatically. No extra setup—just seamless AI-powered API execution.",
  },
  {
    icon: TypescriptClassIcon,
    title: "TypeScript Class",
    description:
      "Turn your TypeScript classes into AI-powered tools. AI reads your class types and calls the right methods on its own. No extra coding—just connect and start using AI.",
  },
  {
    icon: MCPIcon,
    title: "MCP Support",
    description:
      "Connect AI to external tools with MCP, a widely adopted protocol. Agentica will support MCP combining stability with industry-standard compatibility.",
  },
];

export const CORE_VALUES = [
  {
    icon: StructuredIcon,
    title: "STRUCTURED",
    description:
      "Provides a clear, organized approach to AI-driven function calls. Reduces complexity and keeps your codebase tidy.",
  },
  {
    icon: RobustIcon,
    title: "ROBUST",
    description:
      "Engineered to handle real-world edge cases with reliable validation. Ensures seamless error feedback for worry-free development.",
  },
  {
    icon: DeclarativeIcon,
    title: "DECLARATIVE",
    description:
      "Focus on your agent’s purpose, not the plumbing. No more repetitive code—just define your agent’s capabilities, and let AI handle everything else.",
  },
];
