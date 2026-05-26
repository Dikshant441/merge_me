import express, { Request, Response } from "express";
import { userAuth } from "../middleware/auth";
import ConnectionRequestmodel from "../models/connectionRequest";
import User from "../models/user";

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:touserId",
  userAuth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.touserId as string;
      const status = req.params.status as string;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "To sending Person not exist in database.!!",
        });
      }

      const existingConnectionRequest = await ConnectionRequestmodel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request alredy exists!!" });
      }

      const connectionrequest = new ConnectionRequestmodel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionrequest.save();

      res.send({
        message:
          req.user.first_name + " is " + status + " in " + (toUser as any).first_name,
        data,
      });
    } catch (error: any) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status as string;
      const requestId = req.params.requestId as string;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!!" });
      }

      const connectionRequest: any = await ConnectionRequestmodel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request not found!!" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err: any) {
      res.status(404).send("Error" + err.message);
    }
  }
);

export default requestRouter;
