import express, { Request, Response } from "express";
import { userAuth } from "../middleware/auth";
import { validatedEditProfiledata } from "../validators/authSchemas";

const profileRouter = express.Router();

profileRouter.get(
  "/profile/view",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      const u = req.user;
      res.json({
        _id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        photoURL: u.photoURL,
        about: u.about,
        skills: u.skills,
        age: u.age,
        gender: u.gender,
        isPremium: u.isPremium,
        membershipType: u.membershipType,
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  },
);

profileRouter.patch(
  "/profile/edit",
  userAuth,
  async (req: Request, res: Response) => {
    try {
      if (!validatedEditProfiledata(req)) {
        throw new Error("Oops profile updtae not allowed!, invaid requests");
      }

      const loggedInUser = req.user;
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key]),
      );

      await loggedInUser.save();

      res.json({
        message: `${loggedInUser.first_name}, your profile is updtaed!!`,
        data: loggedInUser,
      });
    } catch (error: any) {
      res.status(401).send("Error: " + error.message);
    }
  },
);

export default profileRouter;
