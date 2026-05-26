import mongoose, { Schema } from "mongoose";

const paymrentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      first_name: { type: String },
      last_name: { type: String },
      membershipType: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymrentSchema);
