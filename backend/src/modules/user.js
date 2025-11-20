const jwt = require("jsonwebtoken");
const User = require("../modules/user");

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

const adminAuth = (req, res, next) => {
  const token = "123";
  const isAdminAuthorized = token == "123";
  if (!isAdminAuthorized) {
    res.status(401).send("Admin not authorized");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
