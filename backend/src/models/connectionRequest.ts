import mongoose, { Schema } from "mongoose";

const connectionrequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect type of status`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionrequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionrequestSchema.pre("save", function () {
  const connectionRequest = this as any;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cant connection youself !! ");
  }
});

const ConnectionRequestmodel = mongoose.model(
  "ConectionRequest",
  connectionrequestSchema
);

export default ConnectionRequestmodel;
