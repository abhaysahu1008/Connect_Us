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

app.get("/get/:user/:pass", (req, res) => {
  console.log(req.params);

  res.send({ name: "Abhay Sahu", city: "Jhansi" });
});

app.listen(7777, () => {
  console.log("Your server is listening on port 7777");
});
