# order
## Summary
  - Aggregation:
    - Trial: 10
    - Success: 10
    - Failure: 0
    - Average Time: 4,014.8 ms
  - Token Usage
    - Total: 287,056
    - Prompt
      - Total: 285,700
      - Audio: 0
      - Cached: 284,160
    - Completion:
      - Total: 287,056
      - Accepted Prediction: 0
      - Audio: 0
      - Reasoning: 0
      - Rejected Prediction: 0

## Events
 No | Type | Time
---:|:-----|----:
[1.](./1.success.md) | success | 3682 ms
[2.](./2.success.md) | success | 3840 ms
[3.](./3.success.md) | success | 3981 ms
[4.](./4.success.md) | success | 4564 ms
[5.](./5.success.md) | success | 3222 ms
[6.](./6.success.md) | success | 3784 ms
[7.](./7.success.md) | success | 4177 ms
[8.](./8.success.md) | success | 4127 ms
[9.](./9.success.md) | success | 3532 ms
[10.](./10.success.md) | success | 5239 ms

## Scenario
### User Prompt
I wanna see every sales in the shopping mall

And then show me the detailed information about the Macbook.

After that, select the most expensive stock
from the Macbook, and put it into my shopping cart.

At last, take the shopping cart to the order.

### shoppings_customers_sales_index
  - Controller: shopping
  - Function: shoppings_customers_sales_index

List up every summarized sales.

List up every {@link IShoppingSale.ISummary summarized sales}.

As you can see, returned sales are summarized, not detailed. It does not
contain the SKU (Stock Keeping Unit) information represented by the
{@link IShoppingSaleUnitOption} and {@link IShoppingSaleUnitStock} types.
If you want to get such detailed information of a sale, use
`GET /shoppings/customers/sales/{id}` operation for each sale.

> If you're an A.I. chatbot, and the user wants to buy or compose
> {@link IShoppingCartCommodity shopping cart} from a sale, please
> call the `GET /shoppings/customers/sales/{id}` operation at least once
> to the target sale to get detailed SKU information about the sale.
> It needs to be run at least once for the next steps.

### shoppings_customers_sales_at
  - Controller: shopping
  - Function: shoppings_customers_sales_at

Get a sale with detailed information.

Get a {@link IShoppingSale sale} with detailed information including
the SKU (Stock Keeping Unit) information represented by the
{@link IShoppingSaleUnitOption} and {@link IShoppingSaleUnitStock} types.

> If you're an A.I. chatbot, and the user wants to buy or compose a
> {@link IShoppingCartCommodity shopping cart} from a sale, please call
> this operation at least once to the target sale to get detailed SKU
> information about the sale.
>
> It needs to be run at least once for the next steps. In other words,
> if you A.I. agent has called this operation to a specific sale, you
> don't need to call this operation again for the same sale.
>
> Additionally, please do not summarize the SKU information. Just show
> the every options and stocks in the sale with detailed informations.

### shoppings_customers_orders_create
  - Controller: shopping
  - Function: shoppings_customers_orders_create

Create a new order application.

Create a new {@link IShoppingOrder order application} from a
{@link IShoppingCartCommodity shopping cart} that has been composed by the
{@link IShoppingCustomer}. Of course, do not need to put every commodities
to the order, but possible to select some of them by the customer.

By the way, this function does not mean completion the order, but means
just customer is appling the order. The order be completed only when customer
{@link IShoppingOrderPublish.paid_at pays} the order.

> If you are an A.I. chatbot, don't take a mistake that writing
> the `commodity_id` with the user selected stock ID. The
> `commodity_id` is the ID of the shopping cart commodity, not the
> stock ID. The stock ID is already included in the shopping cart
> commodity.
