const mongoose = require("mongoose");

const connectionrequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect type of status`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionrequestSchema.index({fromUserId : 1, toUserId: 1});

connectionrequestSchema.pre("save", function () {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cant connection youself !! ");
  }
});

const ConectionRequestmodel = new mongoose.model(
  "ConectionRequest",
  connectionrequestSchema
);

module.exports = ConectionRequestmodel;
