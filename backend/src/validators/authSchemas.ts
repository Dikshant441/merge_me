import validator from "validator";
import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Invalid email").max(254, "Email too long"));

const passwordField = z
  .string()
  .min(8, "Must be at least 8 characters")
  .max(72, "Must be at most 72 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/\d/, "Must contain a digit")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

const nameField = z
  .string()
  .trim()
  .min(2, "At least 2 characters")
  .max(100, "Too long");

const optionalNameField = z
  .string()
  .trim()
  .max(100, "Too long")
  .refine((value) => value.length === 0 || value.length >= 2, "At least 2 characters")
  .default("");

export const signupSchema = z
  .object({
    email: emailField,
    password: passwordField,
    first_name: nameField,
    last_name: optionalNameField,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailField,
    password: z.string().min(1).max(72),
  })
  .strict();

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const resetConfirmSchema = z
  .object({
    token: z.string().min(1, "Missing token").max(512),
    // Same strength rules as signup — passwordField keeps them in one place.
    newPassword: passwordField,
  })
  .strict();

export const resetResendSchema = z
  .object({
    token: z.string().min(1, "Missing token").max(512),
  })
  .strict();

export type ResetRequestInput = z.infer<typeof resetRequestSchema>;
export type ResetConfirmInput = z.infer<typeof resetConfirmSchema>;
export type ResetResendInput = z.infer<typeof resetResendSchema>;

export const resetRequestSchema = z.object({ email: emailField }).strict();

// ── Profile update (PATCH /auth/me) ─────────────────────────────
// Partial update against the Postgres `users` columns: every field is
// optional, and only the keys actually sent are written (see updateProfile
// in auth.service). We deliberately DON'T reuse optionalNameField here — its
// `.default("")` would silently blank last_name on any patch that omits it.
export const updateProfileSchema = z
  .object({
    first_name: z.string().trim().min(2, "At least 2 characters").max(100, "Too long"),
    last_name: z
      .string()
      .trim()
      .max(100, "Too long")
      .refine((v) => v.length === 0 || v.length >= 2, "At least 2 characters"),
    // Either an http(s) URL (e.g. an OAuth avatar) or an inline base64 image
    // uploaded from the user's device (stored directly in the DB). The client
    // downscales before sending, so the cap is generous but bounded.
    avatarUrl: z
      .string()
      .trim()
      .max(900_000, "Image is too large")
      .refine(
        (v) =>
          v === "" ||
          /^https?:\/\//i.test(v) ||
          /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=\s]+$/i.test(v),
        "Must be an image URL or an uploaded image"
      ),
    about: z.string().trim().max(500, "Keep it under 500 characters"),
    skills: z.array(z.string().trim().min(1).max(40)).max(5, "At most 5 skills"),
    age: z.number().int().min(16, "Must be 16 or older").max(120, "Invalid age").nullable(),
    gender: z.enum(["Male", "Female", "Other"]).nullable(),
    // Social / profile links. Platform picks the icon on the client; url must
    // be an absolute http(s) link (the client prepends https:// if missing).
    socials: z
      .array(
        z.object({
          platform: z.enum(["github", "linkedin", "twitter", "instagram", "website"]),
          url: z
            .string()
            .trim()
            .min(1, "URL required")
            .max(300, "URL too long")
            .refine((v) => /^https?:\/\//i.test(v), "Must be a full http(s) URL"),
        })
      )
      .max(6, "At most 6 links"),
  })
  .partial()
  .strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

const isignUpValidtion = (req: any) => {
  const { first_name, last_name, email, password, age, gender, skills } =
    req.body;

  const allowedGenders = ["male", "female", "other"];

  if (!first_name || !email || !password) {
    throw new Error("First name, email, and password are required.");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email format post.");
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error("Password is not strong enough.");
  } else if (age && !validator.isInt(age.toString(), { min: 0 })) {
    throw new Error("Age must be a positive integer.");
  } else if (gender && !allowedGenders.includes(gender.toLowerCase())) {
    throw new Error(
      "Invalid gender. Allowed values are male, female, or other.",
    );
  } else if (skills) {
    if (!Array.isArray(skills)) {
      throw new Error("Skills must be an array of strings.");
    }

    if (skills.length > 5) {
      throw new Error("You can provide at most 5 skills.");
    }

    if (
      !skills.every(
        (s: unknown) => typeof s === "string" && s.trim().length > 0,
      )
    ) {
      throw new Error("Each skill must be a non-empty string.");
    }
  }
};

const validatedEditProfiledata = (req: any) => {
  const allowedValidateFields = [
    "first_name",
    "last_name",
    "about",
    "skills",
    "age",
    "gender",
    "avatarUrl",
  ];

  const isEditAllowed = Object.keys(req.body).every((filed) =>
    allowedValidateFields.includes(filed),
  );

  return isEditAllowed;
};

export { isignUpValidtion, validatedEditProfiledata };
