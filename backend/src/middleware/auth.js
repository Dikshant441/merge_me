const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // find token from cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not found in cookies!!");
    }

    // validate the token
    const decodeMessage = await jwt.verify(token, "learn_nodejs");
    if (!decodeMessage) {
      res.status(401).send("User not authorized");
    }

    const { id } = decodeMessage;

    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
