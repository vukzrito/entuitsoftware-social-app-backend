import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { CreatorRequestsService } from "../creator-requests/creator-requests.service";

export const accountRouter = Router()
  .get("/feed", authenticate, async (req: Request, res: Response) => {
    const userId = req.user?.uid;
    const feed = await CreatorRequestsService.getRequests(userId!);
    res.status(200).json(feed);
  })
  .post("/create", authenticate, async (req: Request, res: Response) => {
    const userId = req.user?.uid || "";
    const creatorRequest = req.body;

    const allRequests = await CreatorRequestsService.createRequest(
      userId,
      creatorRequest
    );

    res.status(201).json({ allRequests });
  })

  .delete("/:id", authenticate, async (req: Request, res: Response) => {
    const userId = req.user?.uid || "";
    const requestId = req.params.id;

    const allRequests = await CreatorRequestsService.rejectRequest(
      userId,
      requestId
    );

    res.status(201).json({ allRequests });
  })

//   .get("/:id/requests", authenticate, async (req: Request, res: Response) => {
//     const userId = req.user?.uid || "";
//     const creatorRequest = req.body;

//     const allRequests = await CreatorRequestsService.getRequestsById(
//       userId,
//       creatorRequest
//     );

//     res.status(201).json({ allRequests });
//   });
