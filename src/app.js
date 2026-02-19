// console.log("hello World");

const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signUp", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  const emailId = req.body.emailId;
  try {
    // const existingUser = await User.findOne({ emailId });

    // if (existingUser) {
    //   return res.status(400).send("Email already registered");
    // }

    await user.save();
    // console.log("User created succesfully");

    res.send("User created succesfully");
  } catch (error) {
    res.status(400).send("Some error occured!!" + error.message);
  }
});

app.get("/feed", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found!!");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong!!");
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted succesfully!!");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
      runValidators: true,
    });
    res.send(user + "User updated succesfully!!");
  } catch (error) {
    res.status(400).send("Update failed" + error.message);
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
