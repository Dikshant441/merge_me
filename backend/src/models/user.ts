import mongoose, { Schema } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 30,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email format" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value: string) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 30,
    },
    gender: {
      type: String,
      validate(value: string) {
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error("Gender must be Male, Female, or Other");
        }
      },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    photoURL: {
      type: String,
      default: "https://www.example.com/default-photo.jpg",
    },
    about: {
      type: String,
      default: "This is about me section.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.methods.getJWT = async function (): Promise<string> {
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validationPassword = async function (
  inputPassword: string
): Promise<boolean> {
  const user = this as any;
  const passwordHash = user.password;
  const isPasswordvalid = await bcrypt.compare(inputPassword, passwordHash);
  return isPasswordvalid;
};

const Usermodel = mongoose.model("User", userSchema);

export default Usermodel;
