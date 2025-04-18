import { Timestamp } from "firebase-admin/firestore";

export namespace CreatorRequestsTypes {
  export interface CreatorRequest {
    id: string;
    userId: string;
    status: "pending" | "approved" | "rejected";
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }

  export interface CreatorRequestResponse {
    requestId: string;
  }
}