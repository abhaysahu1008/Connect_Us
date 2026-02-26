const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "ignore", "interested"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({
  fromUserId: 1,
  toUserId: 1,
});

connectionRequestSchema.pre("save", function (next) {
  const ConnectionRequest = this;
  if (ConnectionRequest.fromUserId.equals(ConnectionRequest.userId)) {
    res.status(400).send({
      message: "Cannot send requset to yourself!",
    });
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
