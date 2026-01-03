const express = require("express");
const paymentRoute = express.Router();
const { userAuth } = require("../middleware/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const MermbershipPrice = require("../utils/constant");

paymentRoute.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { first_name, last_name } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: MermbershipPrice[membershipType],
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        first_name: first_name,
        last_name: last_name,
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

    const savedPayment = await payment.save();

    // res.json({ ...savedPayment });  check tis this not work
    res.json({ ...savedPayment.toJSON(), key_id: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(401).send("Error" + err.message);
  }
});

module.exports = paymentRoute;
