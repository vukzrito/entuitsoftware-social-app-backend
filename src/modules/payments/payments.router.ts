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

      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      const accessCode = await PayStackService.getAccessCode(
        email,
        amount,
        currency
      );
      res.status(200).json({ accessCode });
    }
  )
  .post(
    "/paystack/verify",
    authenticate,
    async (req: Request, res: Response) => {}
  );
