import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { CreatorRequestsService } from "./creator-requests.service";
import { CreatorRequestsTypes } from "./creator-requests.types";
import { Timestamp } from "firebase-admin/firestore";

export const postsRouter = Router()
  .get("/feed", authenticate, async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    const feed = await CreatorRequestsService.getRequests(userId!);
    res.status(200).json(feed);
  })
  .post("/create", authenticate, async (req: Request, res: Response) => {
    const userId = req.user?.uid || "";
    const creatorRequest: CreatorRequestsTypes.CreatorRequest = {
      userId: userId!,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      id: "",
    };

    const allRequests = await CreatorRequestsService.createRequest(
      userId,
      creatorRequest
    );

    res.status(201).json({ allRequests });
  });
