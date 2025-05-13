import * as admin from "firebase-admin";
import { CreatorRequestsTypes } from "./creator-requests.types";
import { CommonTypes } from "../common/common.types";
import { AccountService } from "../account/account-service";
import { AccountTypes } from "../account/account.types";
import { SubscriptionsIntegrationService } from "../integrations/subscriptions.integration.service";

export namespace CreatorRequestsService {
  export const createRequest = async (
    userId: string,
    request: CreatorRequestsTypes.CreatorRequest
  ) => {
    await admin.firestore().collection("creatorRequests").add(request);

    const allusersRequests = await admin
      .firestore()
      .collection("creatorRequests")
      .where("userId", "==", userId)
      .where("status", "==", "pending")
      .get();
    const result: CreatorRequestsTypes.CreatorRequest[] = [];
    allusersRequests.docs.forEach((doc) => {
      result.push({
        ...doc.data(),
        id: doc.id,
      } as CreatorRequestsTypes.CreatorRequest);
    });
    return result;
  };

  export const getAllRequests = async () => {
    const requests = await admin
      .firestore()
      .collection("creatorRequests")
      .get();
    return requests.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as CreatorRequestsTypes.CreatorRequest[];
  };
  export const getPendingCreatorRequests = async (
    pageSize: number = 10,
    startAfterDoc?: string
  ): Promise<
    CommonTypes.PaginatedResult<CreatorRequestsTypes.CreatorRequest>
  > => {
    const requestsRef = admin.firestore().collection("creatorRequests");
    let query = requestsRef
      .where("status", "==", "pending")
      .orderBy("createdAt", "desc")
      .limit(pageSize + 1);
    if (startAfterDoc) {
      const lastDoc = await requestsRef.doc(startAfterDoc).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }
    const snapshot = await query.get();
    const requests = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as CreatorRequestsTypes.CreatorRequest[];
    // Remove the extra document we fetched to determine if there are more results
    const hasMore = requests.length > pageSize;
    const paginatedRequests = hasMore ? requests.slice(0, -1) : requests;
    return {
      pageToken: hasMore
        ? paginatedRequests[paginatedRequests.length - 1].id
        : undefined,
      results: paginatedRequests,
    };
  };
  export const getCreatorRequestById = async (requestId: string) => {
    const requestRef = admin
      .firestore()
      .collection("creatorRequests")
      .doc(requestId);
    const requestDoc = await requestRef.get();
    if (!requestDoc.exists) {
      throw new Error("Request not found");
    }
    return {
      ...requestDoc.data(),
      id: requestDoc.id,
    } as CreatorRequestsTypes.CreatorRequest;
  };

  export const getCreatorRequestForUser = async (
    userId: string,
    pageSize: number = 10,
    startAfterDoc?: string
  ): Promise<CreatorRequestsTypes.CreatorRequest[]> => {
    const requestsRef = admin.firestore().collection("creatorRequests");
    let query = await requestsRef
      .orderBy("createdAt", "desc")
      //.where("status", "==", "pending")
      .where("userId", "==", userId)
      .limit(pageSize + 1)
      .get();
    const result: CreatorRequestsTypes.CreatorRequest[] = [];
    query.docs.forEach((doc) => {
      result.push({
        ...doc.data(),
        id: doc.id,
      } as CreatorRequestsTypes.CreatorRequest);
    });
    return result;
  };

  export const approveRequest = async (userId: string, requestId: string) => {
    const defaultPlanAmount = 15.99;
    // const defaultPlanAppleSKU = "com.social.subscription";
    const requestRef = admin
      .firestore()
      .collection("creatorRequests")
      .doc(requestId);

    await requestRef.update({
      status: "approved",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const user = (await AccountService.getAccount(
      userId
    )) as AccountTypes.UserAccount;

    const username = user.username || user.email;

    //create subcription plan on payment gateway/ platform IAP stores
    const { androidSKU, appleSKU, paystackSKU } =
      await SubscriptionsIntegrationService.createSubscriptionProducts(
        username,
        defaultPlanAmount
      );

    // Add user to creators collection
    await admin.firestore().collection("creators").doc(userId).set({
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      subscriptionAmount: defaultPlanAmount,
      subscriptionCurrency: "ZAR",
      appleSKU,
      androidSKU,
      paystackSKU,
    });
  };

  export const rejectRequest = async (userId: string, requestId: string) => {
    const requestRef = admin
      .firestore()
      .collection("creatorRequests")
      .doc(requestId);

    await requestRef.update({
      status: "rejected",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  };
}
