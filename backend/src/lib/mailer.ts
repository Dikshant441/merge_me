// Email transport. Provider is Resend (https://resend.com/docs/send-with-nodejs).
// The exported function signature is identical regardless of provider — if we
// ever swap (SES, SendGrid, etc.) only this file changes.

import { Resend } from "resend";
import { logger } from "./logger";

const FROM = process.env.EMAIL_FROM ?? "no-reply@mergeme.xyz";
const APP_URL = process.env.APP_URL ?? "http://localhost:5173";
const isProd = process.env.NODE_ENV === "production";

// Lazy-init so dev mode never requires the key.
let _resend: Resend | null = null;
const getResend = (): Resend => {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  _resend = new Resend(key);
  return _resend;
};

type VerifyArgs = { to: string; token: string };

export const sendVerificationEmail = async ({ to, token }: VerifyArgs): Promise<void> => {
  const link = `${APP_URL}/verify-email?token=${encodeURIComponent(token)}`;

  // Dev: log the link instead of sending — saves quota + works with no key.
  if (!isProd) {
    logger.info({ to, link }, "[mailer:dev] verification link (not sent)");
    return;
  }

  // Resend SDK pattern: { data, error } return. Business errors come back
  // in `error`, network errors are thrown.
  const { data, error } = await getResend().emails.send({
    from: FROM,
    to: [to],
    subject: "Verify your MergeMe email",
    html: `
      <p>Welcome to MergeMe!</p>
      <p>Confirm your email by clicking below:</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link expires in 24 hours. If you didn't sign up, ignore this email.</p>
    `,
    text: `Welcome to MergeMe!\n\nConfirm your email: ${link}\n\nThis link expires in 24 hours.`,
  });

  if (error) {
    logger.error({ to, err: error }, "Resend rejected the email");
    throw new Error(`Resend: ${error.message}`);
  }

  logger.info({ to, emailId: data?.id }, "Verification email sent via Resend");
};