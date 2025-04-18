import * as admin from "firebase-admin";
import { CreatorRequestsTypes } from "./creator-requests.types";

export namespace CreatorRequestsService {
  export const createRequest = async (userId: string, request: CreatorRequestsTypes.CreatorRequest) => {
    await admin.firestore().collection("creatorRequests").add(request);

    const allusersRequests = await admin
      .firestore()
      .collection("creatorRequests")
      .where("userId", "==", userId)
      .where("status", "==", 'pending')
      .get();
    const result: CreatorRequestsTypes.CreatorRequest[] = [];
    allusersRequests.docs.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() } as CreatorRequestsTypes.CreatorRequest);
    });
    return result;
  };
  export const getRequests = async (userId: string) => {
    const requests = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("creatorRequests")
      .get();

    return requests.docs.map((doc) => doc.data());
  };

  export const approveRequest = async (userId: string, requestId: string) => {
    const requestRef = admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("creatorRequests")
      .doc(requestId);

    await requestRef.update({ status: "approved" });

    // Add user to creators collection
    await admin.firestore().collection("creators").doc(userId).set({
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  };

  export const rejectRequest = async (userId: string, requestId: string) => {
    const requestRef = admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("creatorRequests")
      .doc(requestId);

    await requestRef.update({ status: "rejected" });
  };
}
