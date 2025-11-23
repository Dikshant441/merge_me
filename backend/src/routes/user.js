const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const ConnectionRequestmodel = require("../models/connectionRequest");

const USER_SAFE_DATA = "first_name last_name photoURL age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestmodel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "first_name last_name");

    res.json({
      message: "Data fetch sucessfully",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
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
    // }).populate("fromUserId", ["first_name", "last_name", "age", "gender"]);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Data fetch sucessfully",
      data,
    });
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

module.exports = userRouter;
