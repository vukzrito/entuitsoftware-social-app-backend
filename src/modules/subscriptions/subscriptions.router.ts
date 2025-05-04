import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsTypes } from "./subscriptions.types";
import { Timestamp } from "firebase-admin/firestore";

export const subscriptionsRouter = Router()
  .get("/", authenticate, async (req: Request, res: Response) => {
    // TODO: Implement the logic to get all subscriptions with pagination
    const subcriptions = [];
    res.status(200).json(subcriptions);
  })
  .get("/user/:id", authenticate, async (req: Request, res: Response) => {
    const userId = req.user?.uid || "";
    const subscriptions = await SubscriptionsService.getUserSubscriptions(
      userId
    );
    res.status(200).json(subscriptions);
  })
  
  .get(
    "/creator/:creatorId",
    authenticate,
    async (req: Request, res: Response) => {
      if (!req.params.creatorId) {
        res.status(400).json({ error: "Creator ID is required" });
        return;
      }
      const subscriptions =
        await SubscriptionsService.getSubscriptionsByCreatorId(
          req.params.creatorId
        );
      res.status(200).json(subscriptions);
    }
  )
  .post(
    "/:creatorId/subscribe",
    authenticate,
    async (req: Request<any, any, { bar: number }, any>, res: Response) => {
      const userId = req.user?.uid || "";
      const creatorId = req.params.creatorId;
        if (!creatorId) {
            res.status(400).json({ error: "Creator ID is required" });
            return;
        }
      const subscription: SubscriptionsTypes.Subscription = {
        creatorId,
        subscriberId: userId,
        status: "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        id: "",
        price: 0,
        currency: "ZAR",
        interval: "monthly",
        name: "Subscription",
        platform: "ios",
      };
      await SubscriptionsService.createSubscription(subscription);
      res.status(200).json();
    }
  )
  .post("/:id/cancel", authenticate, async (req: Request, res: Response) => {
    const subscriptionId = req.params.id;
    await SubscriptionsService.cancelSubscription(subscriptionId);
    res.status(204).json();
  });
