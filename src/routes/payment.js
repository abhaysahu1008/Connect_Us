const express = require("express");
const { userAuth } = require("../middlewares/auth");

const paymentRoute = express.Router();
const paymentInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const membershipAmount = require("../utils/constant");

paymentRoute.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    const order = await paymentInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    await new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    }).save();

    res.json({
      KeyId: process.env.RAZORPAY_KEY_ID,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      notes: order.notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

paymentRoute.post("/payment/webhook", async (req, res) => {
  try {
    console.log("Webhook Called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

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

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRoute.get("/payment/verify", userAuth, async (req, res) => {});

module.exports = paymentRoute;
