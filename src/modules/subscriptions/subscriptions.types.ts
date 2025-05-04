import { Timestamp } from "firebase-admin/firestore";

export namespace SubscriptionsTypes {
  export type Subscription = {
    id: string;
    name?: string;
    description?: string;
    price: number;
    interval: string;
    currency: string;
    subscriberId: string;
    creatorId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    status: SubscriptionStatus;
    platform: SubscriptionPlatform;
    metadata?: {
      [key: string]: any;
    };
  };

  export type SubscriptionPlan = {
    id: string;
    name: string;
    description: string;
    price: number;
    interval: string;
    currency: string;
  };

  export type SubscriptionStatus =
    | "active"
    | "inactive"
    | "pending"
    | "canceled";
  export type SubscriptionPlatform = "ios" | "android" | "web";
}
