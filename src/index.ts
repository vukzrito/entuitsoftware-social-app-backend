import express, { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import * as swaggerUi from "swagger-ui-express";
import { authRouter } from "./modules/auth/auth.router";
import { postsRouter } from "./modules/posts/posts.router";
import { authenticate } from "./modules/middleware/auth";
import cors from "cors";
import { adminRoutes } from "./modules/admin/admin.router";
import { creatorRequestsRouter } from "./modules/creator-requests/creator-requests.router";
import { accountRouter } from "./modules/account/account.router";
import { subscriptionsRouter } from "./modules/subscriptions/subscriptions.router";
import { paymentsRouter } from "./modules/payments/payments.router";

const swaggerDocument = require("../swagger.json"); // Import Swagger definition

require('dotenv').config();

declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

// Initialize Firebase Admin SDK

const serviceAccount =
  process.env.NODE_ENV === "development"
    ? require("../serviceAccountKey.json")
    : JSON.parse(process.env.GOOGLE_CREDS || "");

// ...
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = process.env.PORT || 8088;
app.use(
  cors({
    origin: ["http://localhost:5173", "https://socialapp-884c3.web.app"],
  })
);

// Example API endpoint (protected with Firebase Authentication)
app.get("/api/protected", authenticate, (req: Request, res: Response) => {
  res.json({
    message: "Protected API endpoint accessed successfully!",
    user: req.user, // Access user data from the decoded token
  });
});

app.use("/api/account", accountRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/creator-requests", creatorRequestsRouter);
app.use("/api/subscriptions", subscriptionsRouter)
app.use("/api/payments", paymentsRouter)
// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Default route
app.get("/", (req: Request, res) => {
  res.send("Welcome to the API!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
