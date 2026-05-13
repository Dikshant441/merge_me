require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");
const cors = require("cors");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://3.107.231.184"],
    credentials: true,
  })
); 

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");
const initChatServer = require("./utils/socket");

app.use("/", authRouter);
app.use("/", paymentRouter);
app.use("/", userAuth, profileRouter);
app.use("/", userAuth, requestRouter);
app.use("/", userAuth, userRouter);
app.use("/", chatRouter);

const server  = http.createServer(app);
initChatServer(server);

connectDB()
  .then(() => {
    console.log("Database connection seccesful ...");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error(
      "database can't be connected:",
      err && err.message ? err.message : err
    );
    process.exit(1); // optional: exit so nodemon can restart on changes
  });
