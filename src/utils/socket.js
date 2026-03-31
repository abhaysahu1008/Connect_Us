const socket = require("socket.io");
const crypto = require("crypto");
const { Chats } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");

const getCryptoRoomId = (userId, targetUser) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUser].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUser }) => {
      const roomId = getCryptoRoomId(userId, targetUser);
      socket.join(roomId);

      console.log(firstName + " has joined the room :" + roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUser, text }) => {
        const roomId = getCryptoRoomId(userId, targetUser);

        try {
          const AlreadyFriends = await ConnectionRequestModel.findOne({
            $OR: [
              {
                fromUserId: userId,
                toUserId: targetUser,
                status: "accepted",
              },
              { fromUserId: targetUser, toUserId: userId },
            ],
          });

          let chat = await Chats.findOne({
            participants: { $all: [userId, targetUser] },
          });

          if (!chat) {
            chat = new Chats({
              participants: [userId, targetUser],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
          });

          chat.save();

          console.log(firstName + " " + text);
          io.to(roomId).emit("messageRecieved", { firstName, text });
        } catch (error) {
          console.log(error);
        }
      },
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
