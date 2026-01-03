const express = require("express");
const paymentRoute = express.Router();
const { userAuth } = require("../middleware/auth");
const razorpayInstance = require("../utils/razorpay");

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

    res.json({ order });
  } catch (err) {
    res.status(401).send("Error" + err.message);
  }
});

module.exports = paymentRoute;
