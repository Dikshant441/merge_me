import express, { Request, Response } from "express";
import { userAuth } from "../middleware/auth";
import { validatedEditProfiledata } from "../validators/validation";

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err: any) {
    res.status(401).send("Error" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req: Request, res: Response) => {
  try {
    if (!validatedEditProfiledata(req)) {
      throw new Error("Oops profile updtae not allowed!, invaid requests");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.first_name}, your profile is updtaed!!`,
      data: loggedInUser,
    });
  } catch (error: any) {
    res.status(401).send("Error: " + error.message);
  }
});

export default profileRouter;
