const mongoose = require("mongoose");
const { Chats } = require("../models/chat");

async function getAllChats(req, res) {
  const userId = req.user._id;
  const { targetUser } = req.params;
  try {
    let allChats = await Chats.findOne({
      participants: { $all: [userId, targetUser] },
    }).populate({ path: "messages.senderId", select: "firstName lastName" });

    if (!allChats) {
      allChats = new Chats({
        participants: [userId, targetUser],
        messages: [],
      });

      await allChats.save();
    }

    res.json(allChats);
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getAllChats,
};
