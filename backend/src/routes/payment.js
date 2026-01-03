const express = require("express");
const paymentRoute = express.Router();
const { userAuth } = require("../middleware/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");

paymentRoute.post("/payment/create", userAuth, async (req, res) => {
    
  try {
    console.log("11111");
    const order = await razorpayInstance.orders.create({
      amount: 50000,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        first_name: "value 3",
        last_name: "value 2",
        membershipType: "silver",
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
    })

    const savedPayment = await payment.save();

    // res.json({ ...savedPayment });  check tis this not work
    res.json({ ...savedPayment.toJSON() });

  } catch (err) {
    res.status(401).send("Error" + err.message);
  }
});

module.exports = paymentRoute;
