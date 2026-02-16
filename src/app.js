// console.log("hello World");

const express = require("express");

const app = express();

// app.use("/", (req, res) => {
//   try {
//     throw new Error("bdhjej");
//   } catch (error) {
//     res.status(500).send("Something went wrong");
//   }
// });

app.get("/userData", (req, res) => {
  throw new Error("kjnww");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(7777, () => {
  console.log("Your server is listening on port 7777");
});
