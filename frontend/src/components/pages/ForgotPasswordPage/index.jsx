import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, ArrowRight, MailCheck } from "lucide-react";
import { authApi } from "../../../api/auth/auth.api";
import { useLocale } from "../../../helpers/useLocale";
import { getCopy } from "../../../constants/copy";
import LinkPageShell from "../../features/auth/LinkPageShell";

// Public page behind the "Forgot?" link on /login. Submitting ALWAYS lands on
// the neutral "sent" state — the backend never says whether the email exists,
// and neither do we.
const ForgotPassword = () => {
  const navigate = useNavigate();
  const locale = useLocale();
  const copy = getCopy(locale);
  const t = copy.auth;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("form");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      await authApi.requestPasswordReset(email);
      setStatus("sent");
    } catch (err) {
      // Only malformed email (400) or rate limit (429) land here — neither
      // reveals whether the account exists.
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinkPageShell copy={copy}>
      <div className="w-full">
        {status === "sent" ? (
          <div className="text-center">
            <span className="inline-flex items-center gap-2 h-[30px] px-3 rounded-full bg-mm-paper border border-mm-border text-mm-ink-2 font-mono font-medium text-[11px] tracking-[0.08em] uppercase mb-5">
              <span className="w-2 h-2 rounded-full bg-mm-success" />
              password-reset
            </span>
            <div className="mx-auto mb-5 w-[52px] h-[52px] rounded-full bg-mm-paper border border-mm-border grid place-items-center text-mm-coral-2 shadow-[var(--mm-shadow-soft)]">
              <MailCheck size={22} strokeWidth={1.7} />
            </div>
            <h1 className="font-sans font-semibold tracking-[-0.025em] leading-[1.08] text-[clamp(26px,2.6vw,34px)] mb-2.5">
              {t.fpSentTitle}
            </h1>
            <p className="text-mm-ink-2 text-[15px] mb-6">{t.fpSentBody}</p>
            <button
              onClick={() => navigate("/login")}
              className="h-12 px-5 rounded-[12px] bg-mm-ink text-mm-bg text-sm font-medium inline-flex items-center justify-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.16)_inset,0_1px_2px_rgba(0,0,0,.18),0_8px_16px_-8px_rgba(40,24,8,.4)]"
            >
              {t.fpBack}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-[52px] h-[52px] rounded-full bg-mm-paper border border-mm-border grid place-items-center text-mm-coral-2 shadow-[var(--mm-shadow-soft)] mb-5">
                <MailCheck size={22} strokeWidth={1.7} />
              </div>
              <h1 className="font-sans font-semibold tracking-[-0.025em] leading-[1.08] text-[clamp(26px,2.6vw,34px)] mb-2.5 text-balance">
                {t.fpTitle}
              </h1>
              <p className="text-mm-ink-2 text-[15px] max-w-[360px]">{t.fpSub}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[oklch(0.95_0.04_25)] border border-[oklch(0.85_0.10_25)] text-[oklch(0.42_0.18_25)] rounded-[10px] text-[13px] font-medium flex items-start gap-2 dark:bg-[oklch(0.30_0.10_25/0.4)] dark:border-[oklch(0.50_0.15_25/0.6)] dark:text-[oklch(0.85_0.10_25)]">
                <AlertCircle size={16} strokeWidth={1.7} className="shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Field label={t.fpEmail} htmlFor="fp-email">
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.fldEmailPh}
                  autoComplete="email"
                  autoFocus
                  className="flex-1 min-w-0 h-full px-3.5 bg-transparent border-0 outline-0 text-mm-ink text-sm font-medium placeholder:text-mm-ink-4"
                />
              </Field>

              <button
                type="submit"
                disabled={submitting || !email.trim()}
                className="w-full h-12 rounded-[12px] bg-mm-ink text-mm-bg text-sm font-medium inline-flex items-center justify-center gap-2 hover:-translate-y-px disabled:opacity-60 disabled:translate-y-0 transition shadow-[0_1px_0_rgba(255,255,255,.16)_inset,0_1px_2px_rgba(0,0,0,.18),0_8px_16px_-8px_rgba(40,24,8,.4)]"
              >
                {t.fpSubmit}
                <ArrowRight size={16} strokeWidth={1.7} />
              </button>
            </form>

            <div className="mt-5 text-center text-[13px] text-mm-ink-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="text-mm-ink font-medium hover:underline"
              >
                {t.fpBack}
              </a>
            </div>
          </>
        )}
      </div>
    </LinkPageShell>
  );
};

const Field = ({ label, htmlFor, children }) => (
  <div className="mb-4">
    <label htmlFor={htmlFor} className="block text-xs font-medium text-mm-ink-2 mb-1.5">
      {label}
    </label>
    <div className="mm-auth-input flex items-center h-11 bg-mm-paper border border-mm-border-2 rounded-[10px] transition">
      {children}
    </div>
  </div>
);

export default ForgotPassword;
