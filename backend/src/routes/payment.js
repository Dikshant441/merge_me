require("dotenv").config();
const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const MermbershipPrice = require("../utils/constant");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { first_name, last_name, emailId } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: MermbershipPrice[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        first_name: first_name,
        last_name: last_name,
        emailId: emailId,
        membershipType: membershipType,
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

    // saev it to database
    const savedPayment = await payment.save();

    // res.json({ ...savedPayment });  check tis this not work
    res.json({ ...savedPayment.toJSON(), key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(401).send("Error" + err.message);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    console.log("Webhook Called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      req.rawBody.toString(),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    console.log("Is Webhook Valid", isWebhookValid);

    if (!isWebhookValid) {
      console.log("INvalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();
    console.log("Payment saved");

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    console.log("User saved");

    await user.save();

    // Update the user as premium

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // return success response to razorpay

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});


paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  console.log("Api Called");
  const user  = req.user.toJSON();
  console.log(user);

  if(user.isPremium){
    return res.json({ ...user});
  }
  return res.json({ ...user});

});


module.exports = paymentRouter;
