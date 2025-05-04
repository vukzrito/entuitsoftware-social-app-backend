import admin from "firebase-admin";
import { SubscriptionsTypes } from "./subscriptions.types";

export namespace SubscriptionsService{
    export const createSubscription = async (
        subscription: SubscriptionsTypes.Subscription,
    ) => {
        const subscriptionRef = await admin
        .firestore()
        .collection("subscriptions")
        .add(subscription);
    
        return subscriptionRef.id;
    };
    
    export const getSubscription = async (subscriptionId: string) => {
        const subscription = await admin
        .firestore()
        .collection("subscriptions")
        .doc(subscriptionId)
        .get();
    
        return subscription.data();
    };
    
    export const updateSubscription = async (
        subscriptionId: string,
        data: Partial<SubscriptionsTypes.Subscription>,
    ) => {
        await admin
        .firestore()
        .collection("subscriptions")
        .doc(subscriptionId)
        .update(data);
    };

    export const cancelSubscription = async (subscriptionId: string) => {
        const subscription = await getSubscription(subscriptionId);
        if (!subscription) {
            throw new Error("Subscription not found");
        }
        if (subscription.status === "cancelled") {
            throw new Error("Subscription already cancelled");
        }
        // Update the subscription status to cancelled
        await
       updateSubscription(subscriptionId, { ...subscription,  status: "canceled" });
    }

    export const getUserSubscriptions = async (userId: string) => {
        const subscriptions = await admin
        .firestore()
        .collection("subscriptions")
        .where("userId", "==", userId)
        .get();
    
        return subscriptions.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as SubscriptionsTypes.Subscription[];
    }
    export const getAllSubscriptions = async () => {
        const subscriptions = await admin
        .firestore()
        .collection("subscriptions")
        .get();
    
        return subscriptions.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as SubscriptionsTypes.Subscription[];
    }

    export const getSubscriptionById = async (subscriptionId: string) => {
        const subscription = await admin
        .firestore()
        .collection("subscriptions")
        .doc(subscriptionId)
        .get();
    
        return subscription.data() as SubscriptionsTypes.Subscription;
    }
   export const getSubscriptionsByCreatorId = async (creatorId: string) => {
        const subscriptions = await admin
        .firestore()
        .collection("subscriptions")
        .where("creatorId", "==", creatorId)
        .get();
    
        return subscriptions.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as SubscriptionsTypes.Subscription[];
    }
}