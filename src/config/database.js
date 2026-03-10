const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_URL);
};

module.exports = connectDb;
