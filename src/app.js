// console.log("hello World");

const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signUp", async (req, res) => {
  const user = new User({
    firstName: "Abhay",
    lastName: "Sahu",
    emailId: "abhaysahugit@gmail.com",
    password: "123321",
  });
  try {
    await user.save();
    res.send("User created succesfully");
  } catch (error) {
    res.status(400).send("Some error occured!!" + error.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database connection established!!!!!!!!!");
    app.listen(7777, () => {
      console.log("Your server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database not connected");
  });
