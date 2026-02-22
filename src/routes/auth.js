const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signUp", async (req, res) => {
  console.log(req.body);
  try {
    // const emailId = req.body.emailId;

    //validating signup
    validateSignUpData(req);

    //password encryption
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    console.log(user);

    res.send("User created succesfully");
  } catch (error) {
    res.status(400).send("Some error occured!!" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  const user = await User.findOne({ emailId: emailId });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await user.validatePassword(password);

  if (isValidPassword) {
    const token = await user.getJWT();
    res.cookie("token", token, { maxAge: 3600000 });
    res.send("Login successfull");
  }
});

module.exports = authRouter;
