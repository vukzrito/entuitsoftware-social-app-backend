import admin from "firebase-admin";
import { AccountTypes } from "./account.types";
import { CommonTypes } from "../common/common.types";
import { AuthTypes } from "../auth/auth.types";

export namespace AccountService {
  export const getAccount = async (userId: string) => {
    const account = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    return account.data();
  };

  export const updateAccount = async (userId: string, data: any) => {
    await admin.firestore().collection("users").doc(userId).update(data);
  };

  export const followUser = async (userId: string, followId: string) => {
    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("following")
      .doc(followId)
      .set({});

    await admin
      .firestore()
      .collection("users")
      .doc(followId)
      .collection("followers")
      .doc(userId)
      .set({});
  };

  export const unfollowUser = async (userId: string, followId: string) => {
    await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("following")
      .doc(followId)
      .delete();

    await admin
      .firestore()
      .collection("users")
      .doc(followId)
      .collection("followers")
      .doc(userId)
      .delete();
  };

  export const getFollowers = async (userId: string) => {
    const followers = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("followers")
      .get();

    return followers.docs.map((doc) => doc.data());
  };

  export const getFollowing = async (userId: string) => {
    const following = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("following")
      .get();

    return following.docs.map((doc) => doc.data());
  };

  export const searchUsers = async (
    searchTerm: string,
    pageSize: number = 10,
    startAfterDoc?: string
  ): Promise<CommonTypes.PaginatedResult<AuthTypes.User>> => {
    const usersRef = admin.firestore().collection("users");
    let query = usersRef.limit(pageSize + 1);

    // Only apply search filters if a search term is provided
    // if (searchTerm) {
    //   query = query
    //     .where("username", ">=", searchTerm)
    //     .where("username", "<=", searchTerm + "\uf8ff");
    // }

    // if (startAfterDoc) {
    //   const lastDoc = await usersRef.doc(startAfterDoc).get();
    //   if (lastDoc.exists) {
    //     query = query.startAfter(lastDoc);
    //   }
    // }

    const snapshot = await query.get();
    console.log(snapshot.docs)
    const users = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as AuthTypes.User[];

    // Remove the extra document we fetched to determine if there are more results
    const hasMore = users.length > pageSize;
    const paginatedUsers = hasMore ? users.slice(0, -1) : users;

    return {
      pageToken: hasMore
        ? paginatedUsers[paginatedUsers.length - 1].uid
        : undefined,
      results: paginatedUsers,
    };
  };
}
