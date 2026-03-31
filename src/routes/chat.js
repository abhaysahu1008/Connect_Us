const express = require("express");
const { getAllChats } = require("../controllers/chatController");
const { userAuth } = require("../middlewares/auth");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUser", userAuth, getAllChats);

module.exports = chatRouter;
