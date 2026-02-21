// console.log("hello World");
const cookieParser = require("cookie-parser");

const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  const user = await User.findOne({ emailId: emailId });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await user.validatePassword(password);

  if (isValidPassword) {
    // res.cookie("token", "nedcuncuierhcuiheuicrh");
    const token = await user.getJWT();
    res.cookie("token", token, { maxAge: 3600000 });
    console.log(token);
    res.send("Login successfull");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found!");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
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

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const AllowedUpdates = ["skills", "photoUrl", "gender", "age", "password"];

    const isAllowedUpdates = Object.keys(data).every((k) =>
      AllowedUpdates.includes(k),
    );

    if (!isAllowedUpdates) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Cannot add more than 10 skills");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      new: true,
      runValidators: true,
    });
    res.send(user + "User updated succesfully!!");
  } catch (error) {
    res.status(400).send("Update failed : " + error.message);
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
