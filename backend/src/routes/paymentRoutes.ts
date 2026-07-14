import "dotenv/config";
import express, { Request, Response } from "express";
import { userAuth } from "../middleware/auth";
import razorpayInstance from "../lib/razorpay";
import {
  createPayment,
  markPaymentStatus,
  grantPremium,
} from "../models/payment";
import MermbershipPrice from "../utils/constants";
// @ts-ignore - razorpay subpath utils ship no .d.ts
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { logger } from "../lib/logger";

const paymentRouter = express.Router();

paymentRouter.post(
  "/payment/create",
  userAuth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }
      const { membershipType } = req.body;
      const { first_name, last_name, email } = req.pgUser;

      const order = await razorpayInstance.orders.create({
        amount: MermbershipPrice[membershipType] * 100,
        currency: "INR",
        receipt: "receipt#1",
        notes: { first_name, last_name, email, membershipType },
      });

      const savedPayment = await createPayment({
        userId: req.pgUser.id,
        orderId: order.id,
        status: order.status,
        amount: Number(order.amount),
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes as any,
      });

      // key_id is the Razorpay publishable key — safe to send to client.
      res.json({
        orderId: savedPayment.orderId,
        amount: savedPayment.amount,
        currency: savedPayment.currency,
        notes: savedPayment.notes,
        key_id: process.env.RAZORPAY_KEY_ID,
      });
    } catch (err: any) {
      logger.error({ err }, "Payment creation failed");
      res.status(500).json({ error: "Payment creation failed" });
    }
  }
);

paymentRouter.post(
  "/payment/webhook",
  async (req: Request, res: Response): Promise<any> => {
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

      const payment = await markPaymentStatus(
        paymentDetails.order_id,
        paymentDetails.status,
        paymentDetails.id
      );
      if (!payment) {
        // Unknown order — acknowledge so Razorpay doesn't retry forever.
        logger.warn(
          { orderId: paymentDetails.order_id },
          "Webhook for unknown order"
        );
        return res.status(200).json({ msg: "Order not found" });
      }

      // Only a captured payment grants premium; authorized/failed just
      // update the payment row's status above.
      if (paymentDetails.status === "captured") {
        await grantPremium(payment.userId, payment.notes?.membershipType);
      }

      logger.info(
        { orderId: paymentDetails.order_id },
        "Payment webhook processed"
      );
      return res.status(200).json({ msg: "Webhook received successfully" });
    } catch (err: any) {
      logger.error({ err }, "Payment webhook error");
      return res.status(500).json({ msg: "Webhook processing failed" });
    }
  }
);

paymentRouter.get(
  "/premium/verify",
  userAuth,
  async (req: Request, res: Response): Promise<any> => {
    if (!req.pgUser) {
      return res.status(401).send("User not authorized");
    }
    return res.json({
      isPremium: !!req.pgUser.isPremium,
      membershipType: req.pgUser.membership ?? null,
    });
  }
);

export default paymentRouter;
