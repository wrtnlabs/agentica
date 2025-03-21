import { FeedbackIcon } from "../_components/icons/Feedback";
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
  messages: string[];
};

export const CHAT_EXAMPLE_MESSAGE_LIST: ChatMessageType[] = [
  { author: "user", messages: ["What can you do?"] },
  {
    author: "agent",
    type: "assistant",
    messages: [
      "I can assist you with various shopping-related functionalities. Here are some of the actions I can perform:\n",
      "1. **Join membership** - Sign up for a shopping membership.\n2. **Login** - Log in with your membership account.\n3. **Get coupons** -  List all available coupons and their details.\n" +
        "4. **Create orders** - Manage order applications, including creating new orders and retrieving order information.\n" +
        "5. **Get sales information** - View detailed and summarized sales for shopping items.\n" +
        "6. **Inquiry and review handling** - Write questions related to sales, create reviews, and manage inquiries.\n\n",
      "If you have a specific request or action you'd like to take, please let me know!",
    ],
  },
  { author: "user", messages: ["Would you show me sales in the market?"] },
  {
    author: "agent",
    type: "func_selector",
    messages: [
      "Operation:\n\n" +
        "- PATCH\n" +
        "- Shopping/Customer/sales\n\n" +
        "User requested to see sales in the market.",
    ],
  },
  {
    author: "agent",
    type: "func_describer",
    messages: [
      "The function call retrieved a list of summarized sales from the shopping platform, presenting a total of four records. Below is a detailed description of each sale:",
      "### Sales Summary\n" +
        "#### Sale 1: Apple Watch\n" +
        "- **Sale Details:**\n" +
        "  - Sale ID: 06395e6e-2764-4fb8-a6b2-16b68e97a31b\n" +
        "  - Snapshot ID: d23848a6-d15b-42e9-850b-e06806c42741\n" +
        "  - Created At: 2025-02-21T04:37:40.152Z\n" +
        "  - Price Range:\n" +
        "    - Lowest: 599,000 KRW\n" +
        "    - Highest: 639,000 KRW\n\n" +
        "- **Content:**\n" +
        "  - Title: Apple Watch\n" +
        "  - Thumbnails:\n" +
        "![apple watch](/agentica/watch.png)\n",
      "---\n" +
        "#### Sale 2: Apple MacBook Pro\n" +
        "- **Sale Details:**\n" +
        "  - Sale ID: 7212bc44-31f8-4571-b3e9-5362040aee50\n" +
        "  - Snapshot ID: 3fb4895a-6ac1-4abf-b94d-28945bab2c0c\n" +
        "  - Created At: 2025-02-21T04:37:40.724Z\n" +
        "  - Price Range:\n" +
        "    - Lowest: 1,800,000 KRW\n" +
        "    - Highest: 3,993,000 KRW\n\n" +
        "- **Content:**\n" +
        "  - Title: Apple MacBook Pro\n" +
        "  - Thumbnails:\n" +
        "![macbook](/agentica/macbook.png)\n",
    ],
  },
  {
    author: "user",
    messages: [
      "I wanna buy MacBook. Select the (Silver, 16GB, 1TB, English) stock and put it to the shopping cart",
    ],
  },
  {
    author: "agent",
    type: "func_selector",
    messages: [
      "Operation:\n\n- POST\n- /shoppings/customers/carts/commodities\n\nUser wants to add a selected stock to the shopping cart.",
    ],
  },
  {
    author: "agent",
    type: "func_describer",
    messages: [
      "The function call was executed successfully and resulted in the creation of a new commodity in the shopping cart. Below are the details regarding the created commodity:",
      "### Commodity Details\n" +
        "- Commodity ID: 4d60821b-2546-4230-b727-48cc9ced6977\n" +
        "#### Sale Information\n" +
        "- Sale ID: 72126644-31f8-4571-b3e9-5362040aee50\n" +
        "- Snapshot ID: 3fb4895-6a01-4abf-b94d-28945bab2c0c\n" +
        "- Latest Snapshot: Yes\n" +
        "#### Content Information\n" +
        "- Title: Apple MacBook Pro\n" +
        "- Thumbnail: " +
        "![macbook](/agentica/macbook.png)\n",
      "#### Unit Details\n" +
        "- Unit ID: 2217919-45f4-45f3-9712-d535b7efa763\n" +
        "- Unit Name: MacBook M3 Pro 14inch Entity\n" +
        "- Stocks:\n" +
        "  - Stock ID: 3746725f-e367-46f7-ac7b-118f8ff57180\n" +
        "  - Name: MacBook Pro (Silver, 16GB, 1TB, English)\n" +
        "  - Price:\n" +
        "    - Nominal: 2,300,000\n" +
        "    - Real: 2,070,000\n" +
        "  - Quantity: 1\n" +
        "  - Inventory:\n" +
        "    - Available Stock: 1,000,000 (Income)\n" +
        "    - Sold Stock: 0 (Outcome)\n" +
        "  - Choices:\n" +
        "    - Color: Silver\n" +
        "    - RAM: 16GB\n" +
        "    - SSD: 1TB\n" +
        "    - Keyboard Language: English\n",
      "### Additional Information\n" +
        "- Orderable: Yes\n" +
        "- Pseudo: No\n" +
        "- Volume: 1\n" +
        "- Creation Date: 2025-03-05T13:22:18.907Z\n\n",
      "This comprehensive overview gives you insight into the specifics of the newly created commodity in your shopping cart. If you need more details or have further questions, feel free to ask!",
    ],
  },
  {
    author: "user",
    messages: [
      "I'll pay it with cash, and my address is:\n\ncountry: South Korea\ncity/province: Seoul\n\ndepartment: Wrtn Apartment\npossession: 101-1411",
    ],
  },
  {
    author: "agent",
    type: "func_selector",
    messages: [
      "Operation:\n\n - POST\n - /shoppings/customers/orders\n\nTo create a new order application from the shopping cart.",
    ],
  },
  {
    author: "agent",
    type: "func_selector",
    messages: [
      "Operation:\n\n- POST\n- /shoppings/customers/orders/{orderld}/publish\n\nProceeding with the order completion using the provided address and cash payment method.",
    ],
  },
  {
    author: "agent",
    type: "func_describer",
    messages: [
      "The function call was made to create and publish an order from a shopping cart. This action included the customer's address details and payment vendor information. Here's a detailed description of the return value from this function call:\n",
      "### Function Call Summary\n" +
        "#### Order Application:\n" +
        "  - Method: POST\n" +
        "  - Path: /shoppings/customers/orders\n" +
        "  - Status: 201 Created\n",
      "#### Order Publication:\n" +
        "  - Method: POST\n" +
        "  - Path: /shoppings/customers/orders/{orderId}/publish\n" +
        "  - Status: 201 Created\n",
      "### Return Value Overview\n" +
        "The return value provides information about the completed order and the associated delivery details. Here's a breakdown of the important sections:\n",
      "#### Order Details\n" +
        "- State:\n" +
        "  - The current state of the order is listed as none. This indicates that no deliveries have taken place yet and that the order is not currently being processed.\n" +
        "- Order ID:\n" +
        "  - The ID of the published order is b5cebb2-3a52-480b-9f74-b188ac78f201. This serves as a reference for tracking the order in the future.\n" +
        "- Created At:\n" +
        "  - The order was created at 2025-03-05 13:24:40.077Z. This timestamp indicates when the order was officially published in the system.\n" +
        "- Paid At:\n" +
        "  - The payment for this order is marked as completed at 2025-03-05T 13:24:40.077Z. This confirms that the payment has been successfully processed along with the order.\n" +
        "- Cancelled At:" +
        "  - This field is null, indicating that there has been no cancellation for the order.",
      "#### Address Details\n" +
        "The address for delivery has been confirmed and includes:\n" +
        "- Mobile: 01012345678\n" +
        "- Name: John Doe\n" +
        "- Country: South Korea\n" +
        "- Province: Seoul\n" +
        "- City: Seoul\n" +
        "- Department: Wrtn Apartment\n" +
        "- Possession: 101-1411\n" +
        "- Zip Code: 04100\n" +
        "- Special Note: This field is null, meaning there are no additional instructions provided for the delivery.\n",
      "#### Conclusion\n" +
        "The order was successfully published with payment completed and is waiting to be processed for delivery. Since the state is currently none, no deliveries have yet taken place; however, the details provided will assist in tracking and managing the order moving forward.\n\n" +
        "If you have any more questions or need further assistance regarding the order, feel free to ask!",
    ],
  },
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
    title: "Swagger/OpenAPI Document",
    description:
      "Just upload a Swagger document, and AI will handle API calls. It understands your backend and interacts with it automatically. No extra setup—just seamless AI-powered API execution.",
  },
  {
    icon: TypescriptClassIcon,
    title: "TypeScript Class",
    description:
      "Turn your TypeScript classes into AI-powered tools. AI reads your class types and calls the right methods on its own. No extra coding—just connect and start using AI.",
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
