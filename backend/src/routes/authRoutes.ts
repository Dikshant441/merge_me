import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import Usermodel from "../models/user";
import { isignUpValidtion } from "../validators/validation";

const authRouter = express.Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    isignUpValidtion(req);

    const hashpassword = await bcrypt.hash(password, 10);

    const user = new Usermodel({
      first_name,
      last_name,
      email,
      password: hashpassword,
    });

    const savedUser = await user.save();
    const token = await (savedUser as any).getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await Usermodel.findOne({ email });
    if (!user) {
      throw new Error(" Invalid credentials " + email);
    }

    const isPasswordMatch = await (user as any).validationPassword(password);

    if (isPasswordMatch) {
      const token = await (user as any).getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      });

      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", async (_req: Request, res: Response) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .send("Logout successful");
  } catch (error: any) {

    console.error(error);
    res.status(400).send(error.message);
  }
});

export default authRouter;
