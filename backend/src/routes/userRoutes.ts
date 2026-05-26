import express, { Request, Response } from "express";
import { userAuth } from "../middleware/auth";
import ConnectionRequestmodel from "../models/connectionRequest";
import Usermodel from "../models/user";

const userRouter = express.Router();

const USER_SAFE_DATA = "first_name last_name photoURL age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestmodel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetch sucessfully",
      data: connectionRequest,
    });
  } catch (error: any) {
    res.status(400).send("Error" + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestmodel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row: any) => {
      if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Data fetch sucessfully",
      data,
    });
  } catch (error: any) {
    res.status(400).send("Error" + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;

    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequestmodel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set<string>();
    connectionRequest.forEach((r: any) => {
      hideUserFromFeed.add(r.fromUserId.toString());
      hideUserFromFeed.add(r.toUserId.toString());
    });

    const users = await Usermodel.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error: any) {
    res.status(404).send("Error" + error.message);
  }
});

export default userRouter;
