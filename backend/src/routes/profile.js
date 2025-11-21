const express = require("express");
const { userAuth } = require("../middleware/auth");
const {validatedEditProfiledata} = require("../utils/validation");


const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try { 
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(401).send("Error" + err.message);
  }

});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if(!validatedEditProfiledata(req)){
      throw new Error("Oops profile updtae not allowed!, invaid requests")
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.first_name}, your profile is updtaed!!`,
      data: loggedInUser

    });
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
});


module.exports = profileRouter;