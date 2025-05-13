import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { CreatorRequestsService } from "../creator-requests/creator-requests.service";
import { AccountService } from "./account-service";

export const accountRouter = Router()
  .get(
    "/creator-requests",
    authenticate,
    async (req: Request, res: Response) => {
      const userId = req.user?.uid;
      const requests = await CreatorRequestsService.getCreatorRequestForUser(
        userId!
      );
      res.status(200).json(requests);
    }
  )
  .get("/search", authenticate, async (req: Request, res: Response) => {
    const keyword = (req.query.keyword as string) || "";
    console.log("keyword", keyword);
    console.log("req.params", req.params);
    const results = await AccountService.searchUsers(keyword);
    res.status(200).json(results);
  })
  .get("/profile/:id", authenticate, async (req: Request, res: Response) => {
    const userId = req.user?.uid || "";
    const profileId = req.params.id;
    const result = await AccountService.getUserProfileWithPosts(
      profileId,
      userId
    );

    res.status(200).json(result);
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
  });

//   .get("/:id/requests", authenticate, async (req: Request, res: Response) => {
//     const userId = req.user?.uid || "";
//     const creatorRequest = req.body;

//     const allRequests = await CreatorRequestsService.getRequestsById(
//       userId,
//       creatorRequest
//     );

//     res.status(201).json({ allRequests });
//   });
