// console.log("hello World");

const express = require("express");

const app = express();

// app.get("/", (req, res) => {
//   res.send("My Dashboard");
// });
// app.get("/get", (req, res) => {
//   res.send("Hello World!!!!!!!!!");
// });
// app.get("/hey", (req, res) => {
//   res.send("Hellooooo");
// });

// middleware
const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  console.log("get all data");
  res.send("Get All Data");
});

//we can also write like this
app.get("/user/data", userAuth, (req, res) => {
  console.log("get user data");
  res.send("Get user Data");
});

app.listen(7777, () => {
  console.log("Your server is listening on port 7777");
});
