# order
## Summary
  - Scenarios: #4
  - Success: 1
  - Failure: 3
  - Average Time: 84,121.75 ms

## Events
 Name | Type | Time
:-----|:-----|----:
[1.](./1.failure.md) | failure | 144498 ms
[2.](./2.failure.md) | failure | 67444 ms
[3.](./3.failure.md) | failure | 56531 ms
[4.](./4.success.md) | success | 68014 ms

## Scenario
### User Prompt
I wanna see every sales in the shopping mall

And then show me the detailed information about the Macbook.

After that, select the most expensive stock
from the Macbook, and put it into my shopping cart.
And take the shopping cart to the order.

At last, I'll publish it by cash payment, and my address is

  - country: South Korea
  - city/province: Seoul
  - department: Wrtn Apartment
  - Possession: 101-1411

### Expected
```json
{
  "type": "array",
  "items": [
    {
      "type": "standalone",
      "operation": {
        "name": "shoppings_customers_sales_index",
        "description": "List up every summarized sales.\n\nList up every {@link IShoppingSale.ISummary summarized sales}.\n\nAs you can see, returned sales are summarized, not detailed. It does not\ncontain the SKU (Stock Keeping Unit) information represented by the\n{@link IShoppingSaleUnitOption} and {@link IShoppingSaleUnitStock} types.\nIf you want to get such detailed information of a sale, use\n`GET /shoppings/customers/sales/{id}` operation for each sale.\n\n> If you're an A.I. chatbot, and the user wants to buy or compose\n> {@link IShoppingCartCommodity shopping cart} from a sale, please\n> call the `GET /shoppings/customers/sales/{id}` operation at least once\n> to the target sale to get detailed SKU information about the sale.\n> It needs to be run at least once for the next steps."
      }
    },
    {
      "type": "standalone",
      "operation": {
        "name": "shoppings_customers_sales_at",
        "description": "Get a sale with detailed information.\n\nGet a {@link IShoppingSale sale} with detailed information including\nthe SKU (Stock Keeping Unit) information represented by the\n{@link IShoppingSaleUnitOption} and {@link IShoppingSaleUnitStock} types.\n\n> If you're an A.I. chatbot, and the user wants to buy or compose a\n> {@link IShoppingCartCommodity shopping cart} from a sale, please call\n> this operation at least once to the target sale to get detailed SKU\n> information about the sale.\n>\n> It needs to be run at least once for the next steps. In other words,\n> if you A.I. agent has called this operation to a specific sale, you\n> don't need to call this operation again for the same sale.\n>\n> Additionally, please do not summarize the SKU information. Just show\n> the every options and stocks in the sale with detailed information."
      }
    },
    {
      "type": "anyOf",
      "anyOf": [
        {
          "type": "array",
          "items": [
            {
              "type": "standalone",
              "operation": {
                "name": "shoppings_customers_carts_commodities_create",
                "description": "Create a new commodity.\n\nCreate a new {@link IShoppingCartCommodity commodity} into a specific\nshopping cart.\n\nIf {@link IShoppingCartCommodity.ICreate.accumulate} has `true` value\nand there's some same commodity that composed with same\n{@link IShoppingSaleUnitStock.IInvert stocks and quantities},\nthen new commodity would not be created but the volume would be accumulated.\n\nBy the way, if the target {@link IShoppingSale sale} has been suspended or\n{@link IShoppingSaleUnitStockInventory out of stock}, then 410 gone error\nwould be thrown. Therefore, it would better to check the target sale and\n{@link IShoppingSaleUnitStock stock}'s status before."
              }
            },
            {
              "type": "standalone",
              "operation": {
                "name": "shoppings_customers_orders_create",
                "description": "Create a new order application.\n\nCreate a new {@link IShoppingOrder order application} from a\n{@link IShoppingCartCommodity shopping cart} that has been composed by the\n{@link IShoppingCustomer}. Of course, do not need to put every commodities\nto the order, but possible to select some of them by the customer.\n\nBy the way, this function does not mean completion the order, but means\njust customer is applying the order. The order be completed only when customer\n{@link IShoppingOrderPublish.paid_at pays} the order.\n\n> If you are an A.I. chatbot, don't take a mistake that writing\n> the `commodity_id` with the user selected stock ID. The\n> `commodity_id` is the ID of the shopping cart commodity, not the\n> stock ID. The stock ID is already included in the shopping cart\n> commodity."
              }
            }
          ]
        },
        {
          "type": "standalone",
          "operation": {
            "name": "shoppings_customers_orders_direct",
            "description": "Create a new order application without a shopping cart.\n\nCarete a new {@link IShoppingOrder order application} without a\n{@link IShoppingCartCommodity shopping cart commodity} composition.\nIf you're an A.I. chatbot and user wants to directly purchase a product,\nthen select and call this function.\n\nBy the way, this function does not mean completion the order, but means\njust customer is applying the order. The order be completed only when customer\n{@link IShoppingOrderPublish.paid_at pays} the order."
          }
        }
      ]
    },
    {
      "type": "standalone",
      "operation": {
        "name": "shoppings_customers_orders_publish_create",
        "description": "Publish an order.\n\n{@link IShoppingOrderPublish Publish} an {@link IShoppingOrder order} that\nhas been applied by the {@link IShoppingCustomer} with\n{@link IShoppingAddress address} to delivery and payment information gotten\nfrom the payment vendor system.\n\nIf the order has been discounted for entire order price, then no need\nto send payment vendor info. Instead, only address info is required.\n\nAlso, the payment time can be different with the publish time. For example,\nif the payment method is manual bank account transfer, then the payment\nwould be delayed until the customer actually transfer the money. In that\ncase, {@link IShoppingOrderPublish.paid_at} would be `null` value, so\nthat you have to check it after calling this publish function."
      }
    }
  ]
}
```