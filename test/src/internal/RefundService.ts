import { IRefundCs } from "./IRefundCs";

export class Refund {
  /**
   * Get all payment histories of the user.
   *
   * Get all payment histories of the user, and this function is only
   * used for the refunding purpose. When user requests a refunding,
   * the user must list up every payment histories, and check whether a
   * specific payment is refundable or not.
   *
   * Therefore, if you're an AI agent, when user requests a refunding,
   * call this function at first.
   *
   * If the response is empty, inform the user that there has been no payment history within the last 7 days.
   * If a refund is deemed impossible, the user must be notified of the reason why the refund is impossible.
   */
  public async getPaymentHistoriesWithRefundable(
    input: IRefundCs.IGetPaymentHistoryRequest,
  ): Promise<IRefundCs.IGetPaymentHistoryResponse[]> {
    
  }

  /**
   * Execute the payment refunding.
   *
   * Refund a payment, so that take back the money from to user.
   *
   * CRITICAL PREREQUISITE: You MUST call the `PATCH: /private-connector/character-cs/payments` operation at least once before executing this function to retrieve payment histories. Skipping this step will result in an error or undefined behavior. If you are an AI agent, treat this as a strict rule and never attempt to call this function without confirming payment history first.
   * If this function is successfully executed without any error
   * (status code is 200 or 201), you AI agent should describe that
   * user's refunding request is successfully executed.

   * Also, when describing, please follow the guidelines below:
   * - Provide only the refund outcome (success or failure).
   * - Do not include details about the data used or any sensitive information.
   * - Do not request the user's email or phone number.
   * Please check your payment details first before proceeding with a refund.   
   */
  public async executeRefund(
    input: IRefundCs.IExecuteRefundRequest,
  ): Promise<IRefundCs.IExecuteRefundResponse> {
    
  }
}