import { Router, Request, Response } from "express";
import * as admin from "firebase-admin";
import { authenticateAdmin } from "../middleware/auth";

export const adminRoutes = Router()
  .get("/users", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const pageSize = Number(req.query.pageSize) || 100;
      const pageToken = req.query.pageToken as string;

      const listUsersResult = await admin.auth().listUsers(pageSize, pageToken);
      // Remove sensitive fields from user objects
      const sanitizedUsers = listUsersResult.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        disabled: user.disabled,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime
        }
      }));

      res.status(200).json({
        users: sanitizedUsers,
        pageToken: listUsersResult.pageToken,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  })
  .put(
    "/user/:uid",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const uid = req.params.uid;
        const { email, password, displayName } = req.body;

        const userRecord = await admin.auth().updateUser(uid, {
          email,
          password,
          displayName,
        });

        res.status(200).json(userRecord);
      } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
      }
    }
  )
  .post(
    "/user/make-admin/:uid",
    authenticateAdmin,
    async (req: Request, res: Response) => {
      try {
        const uid = req.params.uid;
        const { email, password, displayName } = req.body;

        const userRecord = await admin
          .auth()
          .setCustomUserClaims(uid, { admin: true });

        res.status(200).json(userRecord);
      } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
      }
    }
  )
