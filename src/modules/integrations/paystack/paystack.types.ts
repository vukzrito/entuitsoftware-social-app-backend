export namespace PayStackTypes {
  export type PayStackWebhook = {
    event: string;
    data: {
      id: string;
      domain: string;
      status: string;
      reference: string;
      amount: number;
      currency: string;
      customer: {
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        metadata: {
          userId: string;
          planId: string;
        };
      };
      plan?: SubscriptionPlan;
    };
  };
  export type PayStackAccessCodeRequest = {
    userId: string;
    email: string;
    amount: number;
    currency?: string;
    subscriptionId?: string;
  };
  export type PayStackAccessCodeResponse = {
    status: boolean;
    message: string;
    data: {
      accessCode: string;
      authorizationUrl: string;
      reference: string;
      planId: string;
      planName: string;
      planDescription: string;
      planAmount: number;
      planCurrency: string;
      planInterval: string;
      planIntervalCount: number;
      planActive: boolean;
      planCreatedAt: string;
      planUpdatedAt: string;
      planMetadata: {
        userId: string;
        subscriptionId: string;
      };
    };
  };
  export type CreatePlanResponse = {
    status: boolean;
    message: string;
    data: SubscriptionPlan;
  };
  export type PayStackVerifyRequest = {
    reference: string;
    amount: number;
    currency: string;
    subscriptionId: string;
    userId: string;
    email: string;
    planId: string;
  };
  export type PayStackVerifyResponse = {
    status: boolean;
    message: string;
    data: {
      id: string;
      domain: string;
      status: string;
      reference: string;
      amount: number;
      currency: string;
      customer: {
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        metadata: {
          userId: string;
          planId: string;
        };
      };
      plan?: SubscriptionPlan;
    };
  };
  export type SubscriptionPlan = {
    name: string;
    amount: number;
    interval: string;
    integration: number;
    domain: string;
    plan_code: string;
    send_invoices: boolean;
    send_sms: boolean;
    hosted_page: boolean;
    currency: string;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}
