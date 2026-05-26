import "dotenv/config";
import express, { Request, Response } from "express";
import { userAuth } from "../middleware/auth";
import User from "../models/user";
import razorpayInstance from "../lib/razorpay";
import Payment from "../models/payment";
import MermbershipPrice from "../utils/constants";
// @ts-ignore - razorpay subpath utils ship no .d.ts
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req: Request, res: Response) => {
  try {
    const { membershipType } = req.body;
    const { first_name, last_name, emailId } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: MermbershipPrice[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        first_name,
        last_name,
        emailId,
        membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJSON(), key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err: any) {
    res.status(401).send("Error" + err.message);
  }
});

paymentRouter.post("/payment/webhook", async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Webhook Called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      req.rawBody!.toString(),
      webhookSignature as string,
      process.env.RAZORPAY_WEBHOOK_SECRET as string
    );

    console.log("Is Webhook Valid", isWebhookValid);

    if (!isWebhookValid) {
      console.log("INvalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");

    const paymentDetails = req.body.payload.payment.entity;

    const payment: any = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    const user: any = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    console.log("User saved");

    await user.save();

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req: Request, res: Response) => {
  console.log("Api Called");
  const user = req.user.toJSON();
  console.log(user);

  if (user.isPremium) {
    return res.json({ ...user });
  }
  return res.json({ ...user });
});

export default paymentRouter;
