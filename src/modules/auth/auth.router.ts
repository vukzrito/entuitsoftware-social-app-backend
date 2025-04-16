import { Router, Request, Response } from "express";

export const authRouter = Router()
  .get("/login", (req: Request, res: Response) => {
    res.send("login");
  })
  .post("/login", (req: Request, res: Response) => {});
