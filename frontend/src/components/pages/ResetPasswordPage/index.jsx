import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { AlertCircle, ArrowRight, MailCheck, ShieldCheck } from "lucide-react";
import { authApi } from "../../../api/auth/auth.api";
import { addUser } from "../../../store/user/slice";
import { broadcastLogin } from "../../../helpers/authChannel";
import { useLocale } from "../../../helpers/useLocale";
import { getCopy } from "../../../constants/copy";
import LinkPageShell from "../../features/auth/LinkPageShell";

// Same 0-4 scorer as AuthForm — keeps the meter labels (pwd0..pwd4) honest.
const pwScore = (pwd) => {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/\d/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd) || pwd.length >= 12) s++;
  return s;
};

// Landing page for the reset email link (/reset-password?token=RAW). On
// success the backend kills every other session, signs this device in
// (cookies set) and returns the user — so we go straight to /feed, exactly
// like VerifyEmailPage.
const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locale = useLocale();
  const copy = getCopy(locale);
  const t = copy.auth;

  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(token ? "form" : "dead");
  const [error, setError] = useState(token ? "" : t.rpMissing);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const score = useMemo(() => pwScore(password), [password]);
  const scoreLabel = [t.pwd0, t.pwd1, t.pwd2, t.pwd3, t.pwd4][score];
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (password !== confirmPassword) {
      setError(t.rpMismatch);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await authApi.confirmPasswordReset({ token, newPassword: password });
      dispatch(addUser(res.data.user));
      broadcastLogin(res.data.user);
      navigate("/feed", { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.error === "INVALID_TOKEN") {
        setStatus("dead");
        setError(data.message);
      } else {
        setError(data?.details?.newPassword?.[0] || data?.message || err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!token || resending) {
      navigate("/forgot-password");
      return;
    }

    setError("");
    setResending(true);
    try {
      await authApi.resendPasswordReset(token);
      setStatus("resent");
    } catch (err) {
      const data = err.response?.data;
      if (data?.error === "INVALID_TOKEN") {
        setError(t.rpResendInvalid);
      } else {
        setError(data?.message || err.message);
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <LinkPageShell copy={copy}>
      <div className="w-full">
        {status === "resent" ? (
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
            <p className="text-mm-ink-2 text-[15px] mb-6">{t.rpResentBody}</p>
            <button
              onClick={() => navigate("/login")}
              className="h-12 px-5 rounded-[12px] bg-mm-ink text-mm-bg text-sm font-medium inline-flex items-center justify-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.16)_inset,0_1px_2px_rgba(0,0,0,.18),0_8px_16px_-8px_rgba(40,24,8,.4)]"
            >
              {t.fpBack}
            </button>
          </div>
        ) : status === "dead" ? (
          <div className="text-center">
        
            <div className="mx-auto mb-5 w-[52px] h-[52px] rounded-full bg-mm-paper border border-mm-border grid place-items-center text-mm-coral-2 shadow-[var(--mm-shadow-soft)]">
              <AlertCircle size={22} strokeWidth={1.8} />
            </div>
            <h1 className="font-sans font-semibold tracking-[-0.025em] leading-[1.08] text-[clamp(26px,2.6vw,34px)] mb-2.5">
              {t.rpDeadTitle}
            </h1>
            <p className="text-mm-ink-2 text-[15px] mb-6">{error || t.rpDeadBody}</p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="h-12 px-5 rounded-[12px] bg-mm-ink text-mm-bg text-sm font-medium inline-flex items-center justify-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.16)_inset,0_1px_2px_rgba(0,0,0,.18),0_8px_16px_-8px_rgba(40,24,8,.4)] disabled:opacity-60"
            >
              {resending ? t.rpResending : t.rpRequestNew}
            </button>
            <div className="mt-5 text-center text-[13px] text-mm-ink-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password");
                }}
                className="text-mm-ink font-medium hover:underline"
              >
                {t.fpTitle}
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-[52px] h-[52px] rounded-full bg-mm-paper border border-mm-border grid place-items-center text-mm-coral-2 shadow-[var(--mm-shadow-soft)] mb-5">
                <ShieldCheck size={22} strokeWidth={1.8} />
              </div>
              <h1 className="font-sans font-semibold tracking-[-0.025em] leading-[1.08] text-[clamp(26px,2.6vw,34px)] mb-2.5 text-balance">
                {t.rpTitle}
              </h1>
              <p className="text-mm-ink-2 text-[15px] max-w-[360px]">{t.rpSub}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[oklch(0.95_0.04_25)] border border-[oklch(0.85_0.10_25)] text-[oklch(0.42_0.18_25)] rounded-[10px] text-[13px] font-medium flex items-start gap-2 dark:bg-[oklch(0.30_0.10_25/0.4)] dark:border-[oklch(0.50_0.15_25/0.6)] dark:text-[oklch(0.85_0.10_25)]">
                <AlertCircle size={16} strokeWidth={1.7} className="shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Field label={t.rpPwd} htmlFor="rp-pwd">
                <input
                  id="rp-pwd"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.fldPwdPhSignUp}
                  autoComplete="new-password"
                  autoFocus
                  className="flex-1 min-w-0 h-full px-3.5 bg-transparent border-0 outline-0 text-mm-ink text-sm font-medium placeholder:text-mm-ink-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="h-full px-3 text-mm-ink-3 hover:text-mm-ink font-mono font-medium text-[11px] tracking-wider uppercase"
                >
                  {showPassword ? t.hide : t.show}
                </button>
              </Field>

              <div className="mt-2 mb-4">
                <div className="flex gap-1" aria-hidden>
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={[
                        "mm-pw-bar flex-1 h-[3px] rounded-full transition",
                        score >= i ? "on-" + score : "",
                      ].join(" ")}
                    />
                  ))}
                </div>
                <div className="mt-1.5 font-mono font-medium text-[11px] text-mm-ink-3">
                  {scoreLabel}
                </div>
              </div>

              <Field label={t.rpConfirm} htmlFor="rp-confirm">
                <input
                  id="rp-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onPaste={(e) => e.preventDefault()}
                  placeholder={t.rpConfirmPh}
                  autoComplete="new-password"
                  className="flex-1 min-w-0 h-full px-3.5 bg-transparent border-0 outline-0 text-mm-ink text-sm font-medium placeholder:text-mm-ink-4"
                />
              </Field>

              {mismatch && (
                <p className="-mt-2 mb-4 text-[13px] font-medium text-mm-danger">{t.rpMismatch}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !password || !confirmPassword || mismatch}
                className="w-full h-12 rounded-[12px] bg-mm-ink text-mm-bg text-sm font-medium inline-flex items-center justify-center gap-2 hover:-translate-y-px disabled:opacity-60 disabled:translate-y-0 transition shadow-[0_1px_0_rgba(255,255,255,.16)_inset,0_1px_2px_rgba(0,0,0,.18),0_8px_16px_-8px_rgba(40,24,8,.4)]"
              >
                {t.rpSubmit}
                <ArrowRight size={16} strokeWidth={1.7} />
              </button>
            </form>
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

export default ResetPassword;
