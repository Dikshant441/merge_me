const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConectionRequestmodel = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:touserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.touserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "intrested"];

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

      const existingConnectionRequest = await ConectionRequestmodel.findOne({
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

      const connectionrequest = new ConectionRequestmodel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionrequest.save();

      res.send({
        message:
          req.user.first_name + " is " + status + " in " + toUser.first_name,
        data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

module.exports = requestRouter;
