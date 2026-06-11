import "dotenv/config";
import express, { Request, Response } from "express";
import { userAuth } from "../middleware/auth";
import User from "../models/user";
import razorpayInstance from "../lib/razorpay";
import Payment from "../models/payment";
import MermbershipPrice from "../utils/constants";
// @ts-ignore - razorpay subpath utils ship no .d.ts
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { logger } from "../lib/logger";

const paymentRouter = express.Router();

const SAFE_USER_FIELDS = "first_name last_name email isPremium membershipType avatarUrl";

paymentRouter.post("/payment/create", userAuth, async (req: Request, res: Response) => {
  try {
    const { membershipType } = req.body;
    const { first_name, last_name, email } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: MermbershipPrice[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: { first_name, last_name, email, membershipType },
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

    // key_id is the Razorpay publishable key — safe to send to client.
    res.json({
      orderId: savedPayment.orderId,
      amount: savedPayment.amount,
      currency: savedPayment.currency,
      notes: savedPayment.notes,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Payment creation failed" });
  }
});

paymentRouter.post("/payment/webhook", async (req: Request, res: Response): Promise<any> => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      req.rawBody!.toString(),
      webhookSignature as string,
      process.env.RAZORPAY_WEBHOOK_SECRET as string
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment: any = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user: any = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    logger.info({ orderId: paymentDetails.order_id }, "Payment webhook processed");
    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err: any) {
    logger.error({ err }, "Payment webhook error");
    return res.status(500).json({ msg: "Webhook processing failed" });
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req: Request, res: Response) => {
  const user = req.user.toJSON();
  return res.json({ isPremium: !!user.isPremium, membershipType: user.membershipType ?? null });
});

export default paymentRouter;
