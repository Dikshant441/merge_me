import express, { Request, Response, NextFunction } from "express";
import { userAuth } from "../middleware/auth";
import {
  SEND_STATUSES,
  REVIEW_STATUSES,
  type SendStatus,
  type ReviewStatus,
  sendRequest,
  reviewRequest,
  getUserBasic,
  isUuid,
} from "../models/connectionRequest";

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:touserId",
  userAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      // Migrated route: identities are Postgres ids (set by userAuth).
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }
      const fromUserId = req.pgUser.id;
      const toUserId = req.params.touserId as string;
      const status = req.params.status as string;

      if (!SEND_STATUSES.includes(status as SendStatus)) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }

      const toUser = await getUserBasic(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "To sending Person not exist in database.!!",
        });
      }

      // Duplicate/self checks are enforced by DB constraints inside
      // sendRequest — race-safe, no fetch-then-save.
      const data = await sendRequest(fromUserId, toUserId, status as SendStatus);

      res.send({
        message:
          req.pgUser.first_name + " is " + status + " in " + toUser.first_name,
        data,
      });
    } catch (error: any) {
      // Expected, constraint-signalled outcomes keep their contract responses;
      // anything else goes to errorHandler (logged, generic 500 — no internals).
      if (error.code === "ALREADY_EXISTS") {
        return res
          .status(400)
          .send({ message: "Connection request alredy exists!!" });
      }
      if (error.code === "SELF_REQUEST") {
        return res.status(400).send("Error: " + error.message);
      }
      next(error);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }
      const status = req.params.status as string;
      const requestId = req.params.requestId as string;

      const allowedStatus = REVIEW_STATUSES;
      if (!allowedStatus.includes(status as ReviewStatus)) {
        return res.status(400).json({ message: "Status not allowed!!" });
      }

      // One atomic UPDATE covers: not found, not addressed to this user,
      // or not pending anymore. Non-uuid ids (old Mongo ObjectIds) can't
      // match anything, so they're "not found" too.
      const data = isUuid(requestId)
        ? await reviewRequest(req.pgUser.id, requestId, status as ReviewStatus)
        : null;

      if (!data) {
        return res
          .status(400)
          .json({ message: "Connection request not found!!" });
      }

      res.json({ message: "Connection request " + status, data });
    } catch (err: any) {
      next(err);
    }
  }
);

export default requestRouter;
