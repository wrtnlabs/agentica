---
title: I made MCP (Model Context Protocol) alternative solution, for OpenAI and all other LLMs, that is cheaper than Anthropic Claude
---

## Preface

I made MCP (Model Context Protocol) alternative.

My alternative solution is utilizing LLM Function Calling feature, provided by Swagger/OpenAPI and TypeScript class functions, enhanced by compiler and validation feedback strategy. With these strategies, you can fully replace the MCP of Anthropic Claude to much smaller models like `gpt-4o-mini` (Possible to replace to Local LLMs).

Below is a demonstration of my alternative solution, searching and purchasing product in a shopping mall. Its bacakend server is composed with 289 number of API functions, and I could call all of these API functions just by conversation texts in the `gpt-4o-mini` model of `8b` parameters.

- Related Repositories
  - [`@samchon/openapi`](https://gitub.com/samchon/openapi): Swagger/OpenAPI to function calling schema
  - [`typia`](https://github.com/samchon/typia): `typia.llm.application<Class, Model>()` function
  - [`@nestia`](https://github.com/samchon/nestia): Type safe OpenAPI/MCP builder in NestJS
  - **[`@agentica`](https://github.com/wrtnlabs/agentica): Agentic AI framework utilizing above (coming soon)**
- Shopping AI Chatbot Demonstration
  - [`@samchon/shopping-backend`](https://github.com/samchon/shopping-backend): Backend server built by [`@nestia`](https://github.com/samchon/nestia)
  - [`ShoppingChatApplication.tsx`](https://github.com/wrtnlabs/agentica/tree/main/packages/chat/src/examples/shopping): Agent application code built by React.

```typescript
import { Agentica } from "@agentica/core";
import { HttpLlm, OpenApi } from "@samchon/openapi";
import typia from "typia";

const agent = new Agentica({
  service: {
    api: new OpenAI({ apiKey: "*****" }),
    model: "gpt-4o-mini",
  },
  controllers: [
    HttpLlm.application({
      model: "chatgpt",
      document: OpenApi.convert(
        await fetch(
          "https://shopping-be.wrtn.ai/editor/swagger.json",
        ).then(r => r.json())
      )
    }),
    typia.llm.application<ShoppingCounselor, "chatgpt">(),
    typia.llm.application<ShoppingPolicy, "chatgpt">(),
    typia.llm.application<ShoppingSearchRag, "chatgpt">(),
  ],
});
await agent.conversate("I wanna buy MacBook Pro");
```

{% youtube m47p4iJ90Ms %}

> Scripts:
>
> - What you can do?
> - Would be show me sales in the market?
> - I wanna see detailed information of MacBook
>   Select the (silver, 16gb, 1tb, English) stock and put it into the shopping cart
>   Take the shopping cart to the order
>   I'll pay it with cash, and my address is ~

## Function Calling

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mhhowbwbnw2dkecjtg4l.png)

LLM selects proper function to call, and fill its arguments.

- https://platform.openai.com/docs/guides/function-calling
- https://platform.openai.com/docs/guides/structured-outputs

LLM (Large Language Model) function calling means that, the LLM selects proper function, and fills arguments by analyzing conversation contexts with user. There is a similar concept called structured output, which means that LLM automatically transforms the output conversation into a structured data format as JSON.

I've concentrated on such LLM function calling feature, and hope users to do everything with it. If do so, you can completely replace the MCP (Model Context Protocol) of Anthropic Claude, to the much smaller models like `gpt-4o-mini`. Here is my blueprint that I want to accomplish by my solution:

- Users list up candidate functions
- Users don't need to design compliate agent graph or workflow
- I already accomplished it on my shopping mall solution

## OpenAPI Strategy

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1d61aesi706i9vsxoypa.png)

Conversion of OpenAPI Specification to LLM Function Calling Scema.

LLM function calling needs JSON schema based function schema. However, service vendors of LLM (Large Language Model) are not using the same specified JSON schema. "OpenAI GPT" and "Anthropic Claude" are using different JSON schema speicification of LLM function calling, and Google Gemini is also different with them either.

What's even more horrible is that Swagger/OpenAPI documents also use a different kind of JSON schema specification than the LLM function calling schema, and the specifications vary greatly between versions of Swagger/OpenAPI.

To resolve this problem, I've made [`@samchon/openapi`](https://github.com/samchon/openapi). When Swagger/OpenAPI document comes, it converts to an OpenAPI v3.1 emended specification. And then convert it to the specific LLM function calling schema of the service vendor bypassing the migration schema. For reference, migration schema is another middleware schema that converting OpenAPI operation schema to function like schema.

Also, when converting Swagger/OpenAPI document to LLM function calling schemas, [`@samchon/openapi`](https://github.com/samchon/openapi) embeds runtime validator of parameters for the [#Validation Feedback](#validation-feedback) strategy.

## Validation Feedback

```typescript
import { FunctionCall } from "pseudo";
import { ILlmFunction, IValidation } from "typia";

export const correctFunctionCall = (p: {
  call: FunctionCall;
  functions: Array<ILlmFunction<"chatgpt">>;
  retry: (reason: string, errors?: IValidation.IError[]) => Promise<unknown>;
}): Promise<unknown> => {
  // FIND FUNCTION
  const func: ILlmFunction<"chatgpt"> | undefined =
    p.functions.find((f) => f.name === p.call.name);
  if (func === undefined) {
    // never happened in my experience
    return p.retry(
      "Unable to find the matched function name. Try it again.",
    );
  }

  // VALIDATE
  const result: IValidation<unknown> = func.validate(p.call.arguments);
  if (result.success === false) {
    // 1st trial: 30% (gpt-4o-mini in shopping mall chatbot)
    // 2nd trial with validation feedback: 99%
    // 3nd trial with validation feedback again: never have failed
    return p.retry(
      "Type errors are detected. Correct it through validation errors",
      {
        errors: result.errors,
      },
    );
  }
  return result.data;
}
```

Is LLM Function Calling perfect? No, absolutely not.

LLM (Large Language Model) service vendor like OpenAI takes a lot of type level mistakes when composing the arguments of function calling or structured output. Even though target schema is super simple like `Array<string>` type, LLM often fills it just by a `string` typed value.

In my experience, OpenAI `gpt-4o-mini` (of `8b` parameters) is taking about 70% of type level mistakes when filling the arguments of function calling to Shopping Mall service. To overcome the imperfection of LLM function calling, many LLM users are using big sized models like `llama-3.2-405b` and trying to use simple structured schema. However, I've tried another way, validation feedback strategy, instead of using big sized model or simplifying schema. And it was very successful.

The key concept of validation feedback strategy is, let LLM function calling to construct invalid typed arguments first, and informing detailed type errors to the LLM, so that induce LLM to emend the wrong typed arguments at the next turn.

And I has adopted [`typia.validate<T>()`](https://typia.io/docs/validators/validate) and [`typia.llm.application<Class, Model>()`](https://typia.io/docs/llm/application/#application) functions to replace the MCP. They construct validation logic by analyzing TypeScript source codes and types in the compilation level, so that detailed and accurate than any other validators like below.

Such validation feedback strategy and combination with `typia` runtime validator, I could accomplish most ideal LLM function calling which can fully replace the MCP (Model Context Protocol) to the much smaller model like `gpt-4o-mini`. By this strategy, 30% success rate of the 1st function calling trial has been increased to 99% success rate of the 2nd function calling trial. And have never failed from the 3rd trial.

| Components                                                                                                                  | `typia` | `TypeBox` | `ajv` | `io-ts` | `zod` | `C.V.` |
| --------------------------------------------------------------------------------------------------------------------------- | ------- | --------- | ----- | ------- | ----- | ------ | --- |
| **Easy to use**                                                                                                             | ✅      | ❌        | ❌    | ❌      | ❌    | ❌     |
| [Object (simple)](https://github.com/samchon/typia/blob/master/test/src/structures/ObjectSimple.ts)                         | ✔      | ✔        | ✔    | ✔      | ✔    | ✔     |
| [Object (hierarchical)](https://github.com/samchon/typia/blob/master/test/src/structures/ObjectHierarchical.ts)             | ✔      | ✔        | ✔    | ✔      | ✔    | ✔     |
| [Object (recursive)](https://github.com/samchon/typia/blob/master/test/src/structures/ObjectRecursive.ts)                   | ✔      | ❌        | ✔    | ✔      | ✔    | ✔     | ✔  |
| [Object (union, implicit)](https://github.com/samchon/typia/blob/master/test/src/structures/ObjectUnionImplicit.ts)         | ✅      | ❌        | ❌    | ❌      | ❌    | ❌     |
| [Object (union, explicit)](https://github.com/samchon/typia/blob/master/test/src/structures/ObjectUnionExplicit.ts)         | ✔      | ✔        | ✔    | ✔      | ✔    | ❌     |
| [Object (additional tags)](https://github.com/samchon/typia/#comment-tags)                                                  | ✔      | ✔        | ✔    | ✔      | ✔    | ✔     |
| [Object (template literal types)](https://github.com/samchon/typia/blob/master/test/src/structures/TemplateUnion.ts)        | ✔      | ✔        | ✔    | ❌      | ❌    | ❌     |
| [Object (dynamic properties)](https://github.com/samchon/typia/blob/master/test/src/structures/DynamicTemplate.ts)          | ✔      | ✔        | ✔    | ❌      | ❌    | ❌     |
| [Array (rest tuple)](https://github.com/samchon/typia/blob/master/test/src/structures/TupleRestAtomic.ts)                   | ✅      | ❌        | ❌    | ❌      | ❌    | ❌     |
| [Array (hierarchical)](https://github.com/samchon/typia/blob/master/test/src/structures/ArrayHierarchical.ts)               | ✔      | ✔        | ✔    | ✔      | ✔    | ✔     |
| [Array (recursive)](https://github.com/samchon/typia/blob/master/test/src/structures/ArrayRecursive.ts)                     | ✔      | ✔        | ✔    | ✔      | ✔    | ❌     |
| [Array (recursive, union)](https://github.com/samchon/typia/blob/master/test/src/structures/ArrayRecursiveUnionExplicit.ts) | ✔      | ✔        | ❌    | ✔      | ✔    | ❌     |
| [Array (R+U, implicit)](https://github.com/samchon/typia/blob/master/test/src/structures/ArrayRecursiveUnionImplicit.ts)    | ✅      | ❌        | ❌    | ❌      | ❌    | ❌     |
| [Array (repeated)](https://github.com/samchon/typia/blob/master/test/src/structures/ArrayRepeatedNullable.ts)               | ✅      | ❌        | ❌    | ❌      | ❌    | ❌     |
| [Array (repeated, union)](https://github.com/samchon/typia/blob/master/test/src/structures/ArrayRepeatedUnionWithTuple.ts)  | ✅      | ❌        | ❌    | ❌      | ❌    | ❌     |
| [**Ultimate Union Type**](https://github.com/samchon/typia/blob/master/test/src/structures/UltimateUnion.ts)                | ✅      | ❌        | ❌    | ❌      | ❌    | ❌     |

- `C.V.` means `class-validator`
- Tested structure: [`IShoppingSale`](https://github.com/samchon/shopping-backend/tree/master/src/api/structures/shoppings/sales)
- Related ERD: [ERD.md#sales](https://github.com/samchon/shopping-backend/blob/master/docs/ERD.md#sales)

## Compiler Skills

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j6sop962k075lxrcm9z8.png)

Perfect schema generation by compiler skills.

I think the most important thing, whether it's Anthropic Claude's MCP (Model Context Protocol) or the LLM (LLM Function Calling) Function Calling strategy that I advocate to replace MCP, is to create JSON schema safely.

By the way, looking at many other AI developers, they are writing JSON schema hand manually. Even though get helped by some utility builders, it is a typical duplicated schema definition, so that seems dangerous. In the traditional development ecosystem, even though human takes a mistake on schema writing, another human detoured it by his/her instituation. However, **AI never forgives**.

To ensure the safety on schema composition, I've developed TypeScript compiler based JSON schema generator [`typia`](https://github.com/samchon/typia) and [`@nestia`](https://github.com/samchon/nestia) for a long time. If you write a `typia.llm.application<MyClass, "chatgpt">()` statement, it would converted to a collection of OpenAI's function calling schema. Such schema conversion is processed by analyzing the TypeScript source code in the compilation level with `typia`.

Also, when developing backend server for OpenAPI document generation, `@nestia` will do the same thing with `typia`. It will analyze the backend server's TypeScript source codes, so that compose OpenAPI document safely without any errors.

Such perfect schema generation by compiler skills, I think that my alternative solution is better than MCP (Model Context Protocol) of Anthropic Claude.

- [`ShoppingSaleController.ts`](https://github.com/samchon/shopping-backend/blob/master/src/controllers/shoppings/base/sales/ShoppingSaleController.ts)
- [`IShoppingSale`](https://github.com/samchon/shopping-backend/blob/master/src/api/structures/shoppings/sales/IShoppingSale.ts)

```typescript
@Controller("shoppings/customers/sales")
export class ShoppingCustomerSaleController {
  /**
   * Get a sale with detailed information.
   *
   * Get a {@link IShoppingSale sale} with detailed information including
   * the SKU (Stock Keeping Unit) information represented by the
   * {@link IShoppingSaleUnitOption} and {@link IShoppingSaleUnitStock}
   * types.
   *
   * > If you're an A.I. chatbot, and the user wants to buy or compose a
   * > {@link IShoppingCartCommodity shopping cart} from a sale, please
   * > call this operation at least once to the target sale to get
   * > detailed SKU information about the sale.
   * >
   * > It needs to be run at least once for the next steps. In other
   * > words, if you A.I. agent has called this operation to a specific
   * > sale, you don't need to call this operation again for the same
   * > sale.
   * >
   * > Additionally, please do not summarize the SKU information.
   * > Just show the every options and stocks in the sale with detailed
   * > information.
   *
   * @param id Target sale's {@link IShoppingSale.id}
   * @returns Detailed sale information
   * @tag Sale
   */
  @TypedRoute.Get(":id")
  public async at(
    @TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingSale>;
}
```

> The traditional OpenAPI composition way.
>
> Written by Toss Corporation, one of the Korean major IT company.
>
> ```kotlin
> @ExtendWith(RestDocumentationExtension::class, SpringExtension::class)
> @SpringBootTest
> class SampleControllerTest {
>   private lateinit var mockMvc: MockMvc
>
>   @BeforeEach
>   internal fun setUp(context: WebApplicationContext, restDocumentation: RestDocumentationContextProvider) {
>     mockMvc = MockMvcBuilders.webAppContextSetup(context)
>       .apply<DefaultMockMvcBuilder>(MockMvcRestDocumentation.documentationConfiguration(restDocumentation))
>       .build()
>   }
>
>   @Test
>   fun getSampleByIdTest() {
>     val sampleId = "aaa"
>     mockMvc.perform(
>       get("/api/v1/samples/{sampleId}", sampleId)
>     )
>       .andExpect(status().isOk)
>       .andExpect(jsonPath("sampleId", `is`(sampleId)))
>       .andExpect(jsonPath("name", `is`("sample-$sampleId")))
>       .andDo(
>         MockMvcRestDocumentationWrapper.document(
>           identifier = "sample",
>           resourceDetails = ResourceSnippetParametersBuilder()
>             .tag("Sample")
>             .description("Get a sample by id")
>             .pathParameters(
>               parameterWithName("sampleId")
>                 .description("the sample id"),
>             )
>             .responseFields(
>               fieldWithPath("sampleId")
>                 .type(JsonFieldType.STRING)
>                 .description("The sample identifier."),
>               fieldWithPath("name")
>                 .type(JsonFieldType.STRING)
>                 .description("The name of sample."),
>             ),
>         ),
>       )
>   }
> }
> ```

## Agentica, Multi Agent Orchestration

> `@nestia/agent` had been migrated to `@agentica/*` for enhancements and separation to multiple packages extending the functionalities. As it would be developed by organizagtion level, you may meet it much faster.

Utilizing above OpenAPI, validation feedback and compiler strategies, I and my mates are making an Agentic AI framework. It can fully replace the MCP (Model Context Protocol) with much cheaper model than Anthropic Claude. In our case, we are trying to use Local LLMs.

The new framework's name is `@agentica`, and may be published at 1 or 2 weeks later. Features are almost done, and only CLI package and documentations are left.

And the `@agentica` is utilizing below multi agent orchestration strategy. With below agent orchestration strategy, users don't need compose complicate agent graph or workflow, but just need to deliver Swagger/OpenAPI documents or TypeScript class types linearly to the `@agentica`. `@agentica` will do everything with the function calling.

---

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fa3b0wruraw5ir3o92tx.png)

When user says, `@agentica` delivers the conversation text to the `selector` agent, and let the `selector` agent to find (or cancel) candidate functions from the context. If the `selector` agent could not find any candidate function to call and there is not any candidate function previously selected either, the `selector` agent will work just like a plain ChatGPT.

And `@agentica` enters to a loop statement until the candidate functions to be empty. In the loop statement, `caller` agent tries to LLM function calling by analyzing the user's conversation text. If context is enough to compose arguments of candidate functions, the `caller` agent actually calls the target functions, and let `decriber` agent to explain the function calling results. Otherwise the context is not enough to compose arguments, `caller` agent requests more information to user.

Such LLM (Large Language Model) function calling strategy separating `selector`, `caller`, and `describer` is the key logic of `@agentica`.
