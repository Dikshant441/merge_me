import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import User from "../models/user";

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("User not authorized, Please login first");
    }

    const decodeMessage = jwt.verify(token, process.env.JWT_SECRET as string) as any;
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
  } catch (error: any) {
    res.status(401).send("Error: " + error.message);
  }
};

export { userAuth };
