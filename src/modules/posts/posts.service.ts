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

  export const getUserFeed = async (userId: string) => {
    try {
      const querySnapshot = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("feed")
        .get();
      console.log(querySnapshot.docs);
      const userPostIds: string[] = [];
      querySnapshot.forEach((doc) => {
        const { postId, score } = doc.data() as {
          postId: string;
          score: number;
        };

        userPostIds.push(postId);
      });

      return await getPostsWithIds(userPostIds);
    } catch (e) {
      console.error(e);
      return [];
    }
  };

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

  const getPostsWithIds = async (postIds: string[]) => {
    try {
      const posts: PostsTypes.Post[] = [];

      // Use a for...of loop to iterate over the IDs
      for (const postId of postIds) {
        const docRef = admin.firestore().collection("posts").doc(postId);
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {
          const postData = docSnapshot.data();
          posts.push({ ...postData, id: postId } as PostsTypes.Post); // Include the ID in the data
        } else {
          console.log(`Post with ID ${postId} not found.`);
          // Optionally, you might want to handle this case differently (e.g., return null)
        }
      }
      console.log(posts);
      return posts;
    } catch (error) {
      console.error("Error getting posts:", error);
      return []; // Or throw the error if you prefer
    }
  };
}
