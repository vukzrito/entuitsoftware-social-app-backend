import admin from "firebase-admin";
import { AccountTypes } from "./account.types";

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

}
