const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const cookie = req.cookies;
  const { token } = cookie;

  if (!token) {
    return res.status(401).send("Please Login");
  }

  const decodeMsg = await jwt.verify(token, "Abhay@ConnectUs123");
  const { _id } = decodeMsg;

  const user = await User.findById({ _id });
  if (!user) {
    throw new Error("User not found!");
  }
  req.user = user;
  next();
};

module.exports = { userAuth };
