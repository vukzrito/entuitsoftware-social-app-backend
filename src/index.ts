import express, { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import * as swaggerUi from "swagger-ui-express";
import { authRouter } from "./modules/auth/auth.router";
import { postsRouter } from "./modules/posts/posts.router";
import { authenticate } from "./modules/middleware/auth";
const swaggerDocument = require("../swagger.json"); // Import Swagger definition

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

// Example API endpoint (protected with Firebase Authentication)
app.get("/api/protected", authenticate, (req: Request, res: Response) => {
  res.json({
    message: "Protected API endpoint accessed successfully!",
    user: req.user, // Access user data from the decoded token
  });
});

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Default route
app.get("/", (req: Request, res) => {
  res.send("Welcome to the API!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
