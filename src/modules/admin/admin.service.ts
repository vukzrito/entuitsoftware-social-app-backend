import { AuthTypes } from "../auth/auth.types";
import { CommonTypes } from "../common/common.types";
import { CreatorRequestsTypes } from "../creator-requests/creator-requests.types";
import admin from "firebase-admin";

export namespace AdminService {
  export const getUsers = async (
    pageSize: number,
    pageToken: string
  ): Promise<CommonTypes.PaginatedResult<AuthTypes.User>> => {
    const listUsersResult = await admin.auth().listUsers(pageSize, pageToken);

    return {
      pageToken: listUsersResult.pageToken,
      results: listUsersResult.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        disabled: user.disabled,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
        customClaims: user.customClaims,
        providerData: user.providerData,
      })),
    };
  };

  export const getPendingCreatorRequests = async (
    pageSize: number = 10,
    startAfterDoc?: string
  ): Promise<
    CommonTypes.PaginatedResult<CreatorRequestsTypes.CreatorRequest>
  > => {
    const requestsRef = admin.firestore().collection("creator-requests");
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
      id: doc.id,
      ...doc.data(),
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

  export const makeUserAdmin = async (uid: string): Promise<void> => {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
  };

  export const removeUserAdmin = async (uid: string): Promise<void> => {
    await admin.auth().setCustomUserClaims(uid, { admin: false });
  };
}
