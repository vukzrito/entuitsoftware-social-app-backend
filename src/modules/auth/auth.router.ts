import { Router } from "express";

export const authRouter = Router()
  .get("/login", (req, res) => {
    res.send("login");
  })
  .post("/login", (req, res) => {});
