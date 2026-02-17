const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://modiabhaysahuji_db_user:vdT9tZNKR45yybpK@cluster0.nn85uop.mongodb.net/connectUs?appName=Cluster0",
  );
};

module.exports = connectDb;
