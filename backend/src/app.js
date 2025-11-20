const express = require("express");
const app = express();
const connectDB = require("./config/db");

app.use("/", (req, res) => {
  res.send("Hello from Express server");
});


connectDB()
  .then(() => {
    console.log("Database connection seccesful ...");
    app.listen(6666, () => {
      console.log("server runnig on 6666....");
    });
  })
  .catch((err) => {
    console.error(
      "database can't be connected:",
      err && err.message ? err.message : err
    );
    process.exit(1); // => optional: exit so nodemon can restart on changes
  });
