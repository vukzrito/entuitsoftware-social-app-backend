import { PayStackService } from "./paystack/paystack.service";
import { SubscriptionsIntegrationTypes } from "./subscriptions.integration.types";

export const SubscriptionsIntegrationService = {
  createSubscriptionProducts: async (
    username: string,
    amount: number
  ): Promise<SubscriptionsIntegrationTypes.CreateSubscripionSKUsResponse> => {
    const amountInCents = amount * 100;
    const paystackData = await PayStackService.createSusbcriptionPlan(
      username,
      amountInCents
    );
    const paystackSKU = paystackData.data.plan_code;
    //todo get other IAP SKU
    const appleSKU = "";
    const androidSKU = "";

    const result: SubscriptionsIntegrationTypes.CreateSubscripionSKUsResponse =
      { paystackSKU, appleSKU, androidSKU };
    return result;
  },
};
