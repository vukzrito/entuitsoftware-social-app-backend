import { Router } from "express";
import { PostsService } from "./posts.service";
import { PostsTypes } from "./posts.types";
import { authenticate } from "../middleware/auth";

export const postsRouter = Router()
  .get("/feed", authenticate, async (req, res) => {
    const userId = req.user?.uid;
    const feed = await PostsService.getUserFeed(userId!);
    res.status(200).json(feed);
  })
  .post("/create", authenticate, async (req, res) => {
    const userId = req.user?.uid;
    const {
      caption,
      mediaUri,
      mediaType,
      authorName,
      authorUsername,
      thumbnailUri,
      visiblity,
    }: PostsTypes.Post = req.body;

    const { postId } = await PostsService.createPost({
      authorId: userId!,
      caption,
      mediaUri,
      thumbnailUri,
      mediaType,
      authorName,
      authorUsername,
      id: "",
      visiblity,
      likes: [],
    });

    res.status(200).json({ postId });
  });
