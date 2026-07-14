import express, { Request, Response } from "express";
import { userAuth } from "../middleware/auth";
import { validatedEditProfiledata } from "../validators/authSchemas";
import { updateProfile, type PublicUser } from "../services/auth.service";

// Postgres-backed profile routes (the Mongoose version is gone — Phase 9).
// Responses keep the legacy Mongo field names (_id, photoURL,
// membershipType) because MainLayout still boots off /profile/view.

const toLegacyProfile = (u: PublicUser) => ({
  _id: u.id,
  first_name: u.first_name,
  last_name: u.last_name,
  email: u.email,
  photoURL: u.avatarUrl,
  about: u.about,
  skills: u.skills,
  age: u.age,
  gender: u.gender,
  isPremium: u.isPremium,
  membershipType: u.membership,
});

const profileRouter = express.Router();

profileRouter.get(
  "/profile/view",
  userAuth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }
      res.json(toLegacyProfile(req.pgUser));
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
);

profileRouter.patch(
  "/profile/edit",
  userAuth,
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.pgUser) {
        return res.status(401).send("User not authorized");
      }
      if (!validatedEditProfiledata(req)) {
        throw new Error("Oops profile updtae not allowed!, invaid requests");
      }

      const updated = await updateProfile(req.pgUser.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: `${updated.first_name}, your profile is updtaed!!`,
        data: toLegacyProfile(updated),
      });
    } catch (error: any) {
      res.status(401).send("Error: " + error.message);
    }
  }
);

export default profileRouter;
