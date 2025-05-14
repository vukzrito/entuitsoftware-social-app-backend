import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { PayStackService } from "../integrations/paystack/paystack.service";
import admin from "firebase-admin";

interface PaystackAccessCodeRequest extends Request {
  user?: admin.auth.DecodedIdToken;
  query: {
    amount: string;
    currency?: string;
    subscriptionId?: string;
    plan?: string;
  };
}

export const paymentsRouter = Router()
  .get(
    "/paystack/accessCode",
    authenticate,
    async (req: PaystackAccessCodeRequest, res: Response): Promise<void> => {
      const userId = req.user?.uid;
      const email = req.user?.email;
      const amount = parseInt(req.query.amount);
      const currency = req.query.currency || "ZAR";
      const plan = req.query.plan;
      if (!plan) {
        console.error("No subscription plan code provided");
        res.status(400).json({ error: "No subscription plan code provided" });
        return;
      }
      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      const response = await PayStackService.getAccessCodeForOnceOffPayment(
        email,
        amount,
        currency
      );
      res.status(200).json(response.data);
    }
  )
  .get(
    "/paystack/initiate-subscription",
    authenticate,
    async (req: PaystackAccessCodeRequest, res: Response): Promise<void> => {
      // const userId = req.user?.uid;
      const email = req.user?.email;
      const plan = req.query.plan;
      if (!plan) {
        console.error("No subscription plan code provided");
        res.status(400).json({ error: "No subscription plan code provided" });
        return;
      }
      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      const response = await PayStackService.getAccessCodeForSubscription(
        email,
        plan!
      );
      res.status(200).json(response.data);
    }
  )
  .post(
    "/paystack/verify",
    authenticate,
    async (req: Request, res: Response) => {
      res.status(500).json({ error: "Method not implemented" });
    }
  )
  .post(
    "/paystack/success",
    authenticate,
    async (req: Request, res: Response) => {
      console.log("req.body", req.body);
      const { event, data } = req.body;
      res.status(200).json({});
    }
  );
