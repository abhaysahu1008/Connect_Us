const express = require("express");
const { userAuth } = require("../middlewares/auth");
const mongoose = require("mongoose");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send(`${status} is invalid`);
      }

      if (fromUserId.equals(toUserId)) {
        return res.status(400).send("You cannot send request to yourself");
      }

      const userId = await User.findById({ _id: toUserId });

      if (!userId) {
        res.status(400).send({ message: "Cannot send request to this user!" });
      }

      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingRequest) {
        return res.status(400).send("Request already exists");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Request sent!",
        data,
      });
    } catch (err) {
      res.status(500).send("Error: " + err.message);
    }
  },
);

module.exports = requestRouter;
