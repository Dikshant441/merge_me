const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", userAuth, profileRouter);
app.use("/", userAuth, requestRouter);
app.use("/", userAuth, userRouter);


connectDB()
  .then(() => {
    console.log("Database connection seccesful ...");
    app.listen(3000, () => {
      console.log("server runnig on 3000....");
    });
  })
  .catch((err) => {
    console.error(
      "database can't be connected:",
      err && err.message ? err.message : err
    );
    process.exit(1); // optional: exit so nodemon can restart on changes
  });
