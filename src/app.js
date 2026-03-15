require("dotenv").config();
const express = require("express");

const cookieParser = require("cookie-parser");

const connectDb = require("./config/database");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://devzoo.in"],

    credentials: true,
  }),
);

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

connectDb()
  .then(() => {
    console.log("Database connection established!!!!!!!!!");
    app.listen(process.env.PORT, () => {
      console.log("Your server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database not connected");
  });
