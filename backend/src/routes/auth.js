const express = require("express");
const User = require("../modules/user");
const bcrypt = require("bcrypt");
const { isignUpValidtion } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    // 1. => validation of data
    isignUpValidtion(req);

    // 2. => Encrypt data
    const hashpassword = await bcrypt.hash(password, 10);
    console.log("hashpassword:", hashpassword);

    // 3. => create a new instance of user model
    const user = new User({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashpassword,
    });

    await user.save();

    res.send("User added successfully");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {

    // 1. => check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error(" Invalid credentials " + email);
    }

    // 2. => compare password
    const isPasswordMatch = await user.validationPassword(password);
    console.log("isPasswordMatch:", isPasswordMatch);

    if (isPasswordMatch) {
      // 2.1 => create query token (JWT or session)
      const token = await user.getJWT();

      // 2.2 => add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000) // cookie will be removed after 1 h,
      });
      
      res.send("Login successful");
    }
    else{
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

module.exports = authRouter;
