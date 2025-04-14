import { PostsTypes } from "./posts.types";
import * as admin from "firebase-admin";

export namespace PostsService {
  export const createPost = async (post: PostsTypes.Post) => {
    const postRef = await admin
      .firestore()
      .collection("posts")
      .add({
        ...post,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    const postId = postRef.id;
    await addPostToUserFeeds(postId, post.authorId);
    return { postId };
  };

  export const getUserFeed = async (userId: string) => {};

  const addPostToUserFeeds = async (postId: string, userId: string) => {
    const followingRefs = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("following")
      .get();

    const batch = admin.firestore().batch();
    // Add post to author's own feed
    const authorFeedRef = admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("feed")
      .doc(postId);

    batch.set(authorFeedRef, { postId, score: 1.0 }); // Give highest score to own posts

    followingRefs.forEach((followingRef) => {
      const followerId = followingRef.id;
      const userFeedRef = admin
        .firestore()
        .collection("users")
        .doc(followerId)
        .collection("feed")
        .doc(postId);

      batch.set(userFeedRef, { postId });
    });

    await batch.commit();
  };
}
