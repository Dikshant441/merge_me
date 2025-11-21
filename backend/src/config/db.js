const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://mergeme:mergeme123@mergeme.vfcbi5v.mongodb.net/merge_me");
    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // => optional: exit so nodemon can restart on changes
  }
};

module.exports = connectDB;
