const express = require("express");

const cookieParser = require("cookie-parser");

const connectDb = require("./config/database");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// app.get("/profile", userAuth, async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user) {
//       throw new Error("User not found!");
//     }
//     res.send(user);
//   } catch (error) {
//     res.status(400).send("Error : " + error.message);
//   }
// });

// app.get("/feed", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const users = await User.find({ emailId: userEmail });
//     if (users.length === 0) {
//       res.status(404).send("User not found!!");
//     } else {
//       res.send(users);
//     }
//   } catch (error) {
//     res.status(400).send("Something went wrong!!");
//   }
// });

// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.findOne({ emailId: userEmail });
//     if (!user) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.delete("/user", async (req, res) => {
//   const userId = req.body._id;
//   try {
//     await User.findByIdAndDelete({ _id: userId });
//     res.send("User deleted succesfully!!");
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;
//   try {
//     const AllowedUpdates = ["skills", "photoUrl", "gender", "age", "password"];

//     const isAllowedUpdates = Object.keys(data).every((k) =>
//       AllowedUpdates.includes(k),
//     );

//     if (!isAllowedUpdates) {
//       throw new Error("Update not allowed");
//     }

//     if (data?.skills.length > 10) {
//       throw new Error("Cannot add more than 10 skills");
//     }

//     const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//       new: true,
//       runValidators: true,
//     });
//     res.send(user + "User updated succesfully!!");
//   } catch (error) {
//     res.status(400).send("Update failed : " + error.message);
//   }
// });

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
