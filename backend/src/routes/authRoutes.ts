import express, { type Request, type Response, type NextFunction } from "express";
import { signupSchema, loginSchema } from "../validators/authSchemas";
import * as AuthService from "../services/auth.service";
import { setAuthCookies, clearAuthCookies } from "../lib/tokens";
import { requireUser } from "../middleware/requireUser";
import { rateLimitFor } from "../middleware/rateLimit";
import { badRequest } from "../lib/errors";

const router = express.Router();

const ctx = (req: Request) => ({
  ip: req.ip ?? null,
  userAgent: req.get("user-agent") ?? null,
});

// ── POST /auth/signup ───────────────────────────────────────────
// 202 (Accepted), not 201 — the user exists but isn't usable yet. We do NOT
// set auth cookies here; the verification link does that.
router.post(
  "/signup",
  rateLimitFor("signup"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = signupSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(
          badRequest("VALIDATION", "Invalid input", parsed.error.flatten().fieldErrors)
        );
      }
      const result = await AuthService.signup(parsed.data, ctx(req));
      res.status(202).json({
        user: result.user,
        message: "Check your inbox for a verification link.",
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /auth/login ────────────────────────────────────────────
router.post(
  "/login",
  rateLimitFor("login"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(
          badRequest("VALIDATION", "Invalid input", parsed.error.flatten().fieldErrors)
        );
      }
      const result = await AuthService.login(parsed.data, ctx(req));
      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.status(200).json({ user: result.user });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /auth/verify-email ─────────────────────────────────────
// The email link points at the SPA (/verify-email?token=...); the page POSTs
// the token here. On success we set auth cookies and return the user.
router.post(
  "/verify-email",
  rateLimitFor("verify"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = typeof req.body?.token === "string" ? req.body.token : "";
      if (!token) return next(badRequest("MISSING_TOKEN", "Missing verification token"));
      const result = await AuthService.confirmEmailVerification(token, ctx(req));
      setAuthCookies(res, result.accessToken, result.refreshToken);
      res.status(200).json({ user: result.user });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /auth/refresh ──────────────────────────────────────────
router.post(
  "/refresh",
  rateLimitFor("refresh"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const raw = req.cookies?.refresh_token;
      if (!raw) {
        clearAuthCookies(res);
        return next(badRequest("NO_REFRESH", "No refresh token"));
      }

      const { accessToken, refreshToken } = await AuthService.refresh(raw, ctx(req));
      setAuthCookies(res, accessToken, refreshToken);
      res.status(204).end();
    } catch (err) {
      clearAuthCookies(res); // wipe browser state on any refresh failure
      next(err);
    }
  }
);

// ── GET /auth/me ────────────────────────────────────────────────
router.get(
  "/me",
  requireUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await AuthService.getUserById(req.user!.id);
      if (!user) return next(badRequest("NOT_FOUND", "User not found"));
      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /auth/logout (current device) ──────────────────────────
router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.logout(req.cookies?.refresh_token);
    clearAuthCookies(res);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ── POST /auth/logout-all (every device for this user) ──────────
router.post(
  "/logout-all",
  requireUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AuthService.logoutAll(req.user!.id);
      clearAuthCookies(res);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;