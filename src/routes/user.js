const mongoose = require("mongoose");
const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skills photoUrl about";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.send(connectionRequests);
  } catch (error) {
    res.status(404).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "All connections",
      data: data,
    });
  } catch (error) {
    res.status(404).send("ERROR: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;

  const AllConnections = await ConnectionRequestModel.find({
    $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
  }).select("fromUserId toUserId");

  const hideUsersFromFeed = new Set();

  AllConnections.forEach((req) => {
    hideUsersFromFeed.add(req.fromUserId.toString());
    hideUsersFromFeed.add(req.toUserId.toString());
  });

  // console.log(hideUsersFromFeed);
  const users = await User.find({
    $and: [
      {
        _id: { $nin: Array.from(hideUsersFromFeed) },
      },
      {
        _id: { $ne: loggedInUser._id },
      },
    ],
  })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

  res.send(users);
});

module.exports = userRouter;

//not to be shown on user feed
// -there own Profile
// -ignored Profile
// -accepted Profile
// -interested Profile
