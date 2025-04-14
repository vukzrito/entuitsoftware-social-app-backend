export namespace PostsTypes {
  export interface Post {
    id: string;
    createdAt?: FirebaseFirestore.Timestamp;
    caption: string;
    mediaUri: string;
    thumbnailUri?: string;
    mediaType: MediaType;
    authorId: string;
    authorName?: string;
    authorUsername?: string;
    visiblity: PostVisibility;
    likes: string[];
  }

  export type MediaType = "image" | "video";
  export type PostVisibility = "public" | "subscribers";
}
