// Email transport. Provider is Resend (https://resend.com/docs/send-with-nodejs).
// The exported function signature is identical regardless of provider — if we
// ever swap (SES, SendGrid, etc.) only this file changes.

import { Resend } from "resend";
import { logger } from "./logger";

const FROM = process.env.EMAIL_FROM ?? "no-reply@mergeme.xyz";
const APP_URL = process.env.APP_URL ?? "http://localhost:5173";
const isProd = process.env.NODE_ENV === "production";
// Dev logs the link instead of sending unless MAILER_SEND_IN_DEV=true.
const shouldSend = isProd || process.env.MAILER_SEND_IN_DEV === "true";

// Lazy-init so dev mode never requires the key.
let _resend: Resend | null = null;
const getResend = (): Resend => {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  _resend = new Resend(key);
  return _resend;
};

type ResetArgs = { to: string; token: string };

export const sendPasswordResetEmail = async ({ to, token }: ResetArgs): Promise<void> => {
  const link = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;

  // Dev: log the link instead of sending — saves quota + works with no key.
  if (!shouldSend) {
    logger.info({ to, link }, "[mailer:dev] password-reset link (not sent)");
    return;
  }

  // Resend SDK pattern: { data, error } return. Business errors come back
  // in `error`, network errors are thrown.
  const { data, error } = await getResend().emails.send({
    from: FROM,
    to: [to],
    subject: "Reset your MergeMe password",
    html: `
      <p>We received a request to reset your MergeMe password.</p>
      <p><a href="${link}">Set a new password</a></p>
      <p>Or paste this link into your browser:<br/>${link}</p>
      <p>This link expires in 15 minutes and can be used once. If you didn't
      request this, ignore this email — your password is unchanged.</p>
    `,
    text: `Reset your MergeMe password: ${link}\n\nThis link expires in 15 minutes and can be used once. If you didn't request it, ignore this email.`,
  });

  if (error) {
    logger.error({ to, err: error }, "Resend rejected the email");
    throw new Error(`Resend: ${error.message}`);
  }

  logger.info({ to, emailId: data?.id }, "Password-reset email sent via Resend");
};
