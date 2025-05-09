import { tags } from "typia";

export namespace IRefundCs {
  export type PrimaryKey = `${string}-${string}-${string}-${number}-${string}`;

  export type ParseIdResult =
    | { success: true; data: ParsedIdData }
    | { success: false; error: string };

  interface ParsedIdData {
    payerId: string;
    paymentHistoryTid: string;
    productName: string;
    price: string;
    paymentMethod: string;
  }

  export interface IGetPaymentHistoryRequest {
    /**
     * user email.
     *
     * @title user email.
     */
    email: string & tags.Format<"email">;

    /**
     * user's phone number.
     * the phone number should be in the format of 01012345678.
     *
     * @title phone number.
     */
    phoneNumber: string;
  }

  export interface IGetPaymentHistoryResponse {
    /**
     * primary key for the payment history.
     *
     * > If you're an AI chatbot, please don't describe about this property.
     *
     * @title primary key
     */
    id: PrimaryKey;

    /**
     * user id who made the payment.
     *
     * > If you're an AI chatbot, please don't describe about this property.
     *
     * @title userId
     */
    payerId: string;

    /**
     * payment history transaction id.
     *
     * > If you're an AI chatbot, please don't describe about this property.
     *
     * @title transaction id
     */
    paymentHistoryTid: string;

    /**
     * product name that the user purchased.
     *
     * @title productName
     */
    productName: string;

    /**
     * price of the product.
     *
     * @title price
     */
    price: number & tags.Type<"int32">;

    /**
     * method of payment.
     * Google is for Google Play, Apple is for Apple Store, and Web is for web payment.
     *
     * @title payment method
     */
    paymentMethod: "Google" | "Apple" | "Web";

    /**
     * refundable or not.
     *
     * @title refundable
     */
    refundable: boolean;

    /**
     * reason why the refund is not possible.
     *
     * @title reason
     */
    reason?: string;
  }

  export interface IJudgeRefundableResult {
    /**
     * whether the payment history is refundable or not.
     *
     * @title refundable
     */
    success: boolean;

    /**
     * reason why the refund is not possible.
     *
     * @title reason
     */
    reason?: string;
  }

  export interface IExecuteRefundRequest {
    /**
     * list of the primary key for the payment history which the user wants to refund.
     *
     * @title list of the payment history id
     */
    ids: PrimaryKey[];
  }

  export interface IRefundResult {
    /**
     * primary key for the payment history.
     */
    id: IRefundCs.PrimaryKey;

    /**
     * whether the refund request is successful or not.
     */
    success: boolean;
  }

  /**
   * response of the refund request.
   */
  export interface IExecuteRefundResponse {
    /**
     * list of the refund result.
     *
     * @title list of the refund result
     */
    results: IRefundResult[];

    /**
     * whether all the refund requests are successful or not.
     *
     * @title all success
     */
    allSuccess: boolean;
  }
}