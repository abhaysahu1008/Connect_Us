const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signUp", async (req, res) => {
  try {
    // const emailId = req.body.emailId;

    //validating signup
    validateSignUpData(req);

    //password encryption
    const {
      firstName,
      lastName,
      emailId,
      password,
      skills,
      gender,
      about,
      photoUrl,
      age,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ emailId: emailId });

    if (existingUser) {
      return res.status(400).send({ message: "User already exists!" });
    }
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      photoUrl,
      skills,
      about,
    });

    await user.save();
    // console.log(user);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Something went wrong",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  const user = await User.findOne({ emailId: emailId });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValidPassword = await user.validatePassword(password);

  if (isValidPassword) {
    const token = await user.getJWT();
    res.cookie("token", token, { maxAge: 3600000 });
    res.json({ message: "Login Successfull", data: user });
  } else {
    return res.status(400).send({ message: "Invalid password!" });
  }
});

authRouter.post("/logout", async (req, res) => {
  const cookie = req.cookies;
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("User logged out succesfully");
});

module.exports = authRouter;
