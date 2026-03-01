const express = require("express");
const { userAuth } = require("../middlewares/auth");
const mongoose = require("mongoose");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName ";

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).send("Invalid userId");
      }

      const allowedStatus = ["ignore", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send(`${status} is invalid`);
      }

      if (fromUserId.equals(toUserId)) {
        return res.status(400).send("You cannot send request to yourself");
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(400).send({
          message: "Cannot send request to this user!",
        });
      }

      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
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

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send({ message: "Invalid status!" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        status: "interested",
        toUserId: loggedInUser._id,
      }).populate("fromUserId toUserId", USER_SAFE_DATA);

      if (!connectionRequest) {
        return res
          .status(400)
          .send({ message: "No connection request found!" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.send({
        messaage: "Connection request: " + status,
        data,
      });
    } catch (error) {
      res.status(404).send({ message: "ERROR: " + error.message });
    }
  },
);

module.exports = requestRouter;
