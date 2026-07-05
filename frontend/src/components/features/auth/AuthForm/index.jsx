import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { ArrowRight, AlertCircle, Check } from "lucide-react";
import OAuthRow from "../OAuthRow";
import { authApi } from "../../../../api/auth/auth.api";
import { addUser } from "../../../../store/user/slice";
import { broadcastLogin } from "../../../../helpers/authChannel";

// Cheap 0-4 password score. Each rule is one point so we get a stable label
// progression for the UI bars — see copy.auth.pwd0..pwd4.
const pwScore = (pwd) => {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
  if (/\d/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd) || pwd.length >= 12) s++;
  return s;
};


const OAUTH_ERRORS = {
  email_exists_password:
    "This email already has a password account. Sign in with your password first.",
  no_account: "No account found for that email. Switch to Sign up to create one.",
  no_verified_email: "Your provider account has no verified email.",
  oauth_state: "Sign-in expired or was tampered with. Please try again.",
  oauth_failed: "Social sign-in failed. Please try again.",
};

const AuthForm = ({ copy, mode }) => {
  const isSignUp = mode === "signup";
  const t = copy.auth;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const oauthError = OAUTH_ERRORS[searchParams.get("error")];

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState(oauthError ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [signupDone, setSignupDone] = useState(null); // email, set after signup

  const score = useMemo(() => pwScore(password), [password]);
  const scoreLabel = [t.pwd0, t.pwd1, t.pwd2, t.pwd3, t.pwd4][score];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      if (isSignUp) {
        await authApi.signup({ first_name, last_name, email, password });
        setSignupDone(email); // no session yet — wait for email verification
      } else {
        const res = await authApi.login({ email, password });
        dispatch(addUser(res.data.user));
        broadcastLogin(res.data.user); // sync any other open tabs
        navigate(location.state?.from ?? "/feed", { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      setError((isSignUp ? "Signup failed: " : "Login failed: ") + msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (signupDone) {
    return (
      <div className="bg-transparent border-0 shadow-none rounded-none p-0 lg:bg-mm-surface lg:border lg:border-mm-border lg:rounded-3xl lg:shadow-[var(--mm-shadow-card)] lg:p-10 min-h-[560px] flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-[380px]">
          <div className="mx-auto mb-5 w-12 h-12 rounded-full bg-mm-paper border border-mm-border grid place-items-center text-mm-coral-2">
            <Check size={22} strokeWidth={2} />
          </div>
          <h1 className="font-sans font-semibold text-[clamp(22px,2.4vw,28px)] mb-2.5">
            Check your inbox
          </h1>
          <p className="text-mm-ink-2 text-[15px] mb-6">
            We sent a verification link to <b className="text-mm-ink">{signupDone}</b>. Click it to
            activate your account and sign in.
          </p>
          <button
            type="button"
            onClick={() => {
              setSignupDone(null); // drop the success screen — this instance is reused for /login
              navigate("/login");
            }}
            className="w-full h-12 rounded-[12px] bg-mm-ink text-mm-bg text-sm font-medium inline-flex items-center justify-center gap-2"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent border-0 shadow-none rounded-none p-0 lg:bg-mm-surface lg:border lg:border-mm-border lg:rounded-3xl lg:shadow-[var(--mm-shadow-card)] lg:p-10 min-h-[560px] flex flex-col items-center">
      <div className="w-full max-w-[380px]">
        {/* Mode tabs — clicking navigates the route so a deep link to /login
            or /signup picks the right tab. */}
        <div
          role="tablist"
          className="grid grid-cols-2 w-full p-1.5 mb-8 rounded-[18px] border border-mm-border bg-mm-paper/85 backdrop-blur-sm shadow-[0_10px_30px_-24px_rgba(40,24,8,0.5)]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isSignUp}
            onClick={() => navigate("/signup")}
            className={[
              "h-11 rounded-[14px] px-4 inline-flex items-center justify-center text-[13px] sm:text-[14px] font-semibold tracking-[-0.01em] transition",
              isSignUp
                ? "bg-mm-ink text-mm-bg shadow-[0_1px_0_rgba(255,255,255,.18)_inset,0_10px_24px_-14px_rgba(20,14,4,0.6)]"
                : "text-mm-ink-3",
            ].join(" ")}
          >
            {t.tabSignUp}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isSignUp}
            onClick={() => navigate("/login")}
            className={[
              "h-11 rounded-[14px] px-4 inline-flex items-center justify-center text-[13px] sm:text-[14px] font-semibold tracking-[-0.01em] transition",
              !isSignUp
                ? "bg-mm-ink text-mm-bg shadow-[0_1px_0_rgba(255,255,255,.18)_inset,0_10px_24px_-14px_rgba(20,14,4,0.6)]"
                : "text-mm-ink-3",
            ].join(" ")}
          >
            {t.tabSignIn}
          </button>
        </div>

        <h1 className="font-sans font-semibold tracking-[-0.025em] leading-[1.1] text-[clamp(26px,2.6vw,34px)] mb-2.5 text-balance">
          {isSignUp ? (
            <>
              {t.signUpTitleA}
              <em className="not-italic font-serif italic font-normal text-[1.08em] mm-grad-text">
                {t.signUpTitleEm}
              </em>
              {t.signUpTitleB}
            </>
          ) : (
            <>
              {t.signInTitleA}
              <em className="not-italic font-serif italic font-normal text-[1.08em] mm-grad-text">
                {t.signInTitleEm}
              </em>
              {t.signInTitleB}
            </>
          )}
        </h1>
        <p className="text-mm-ink-2 text-[15px] max-w-[360px] mb-7">
          {isSignUp ? t.signUpSub : t.signInSub}
        </p>

        <OAuthRow copy={copy} mode={mode} />

        <div className="flex items-center gap-3 my-[18px] text-mm-ink-3 font-mono font-medium text-[11px] tracking-[0.08em] uppercase">
          <span className="flex-1 h-px bg-mm-border" />
          {t.divider}
          <span className="flex-1 h-px bg-mm-border" />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[oklch(0.95_0.04_25)] border border-[oklch(0.85_0.10_25)] text-[oklch(0.42_0.18_25)] rounded-[10px] text-[13px] font-medium flex items-start gap-2 dark:bg-[oklch(0.30_0.10_25/0.4)] dark:border-[oklch(0.50_0.15_25/0.6)] dark:text-[oklch(0.85_0.10_25)]">
            <AlertCircle size={16} strokeWidth={1.7} className="shrink-0 mt-px" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {isSignUp && (
            <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
              <Field label={t.fldFirst} htmlFor="first">
                <input
                  id="first"
                  name="first_name"
                  type="text"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t.fldFirstPh}
                  autoComplete="given-name"
                  className="flex-1 min-w-0 h-full px-3.5 bg-transparent border-0 outline-0 text-mm-ink text-sm font-medium placeholder:text-mm-ink-4"
                />
              </Field>
              <Field label={t.fldLast} htmlFor="last">
                <input
                  id="last"
                  name="last_name"
                  type="text"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t.fldLastPh}
                  autoComplete="family-name"
                  className="flex-1 min-w-0 h-full px-3.5 bg-transparent border-0 outline-0 text-mm-ink text-sm font-medium placeholder:text-mm-ink-4"
                />
              </Field>
            </div>
          )}

          <Field label={isSignUp ? t.fldEmailSignUp : t.fldEmail} htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.fldEmailPh}
              autoComplete={isSignUp ? "email" : "username"}
              className="flex-1 min-w-0 h-full px-3.5 bg-transparent border-0 outline-0 text-mm-ink text-sm font-medium placeholder:text-mm-ink-4"
            />
          </Field>

          <Field
            label={t.fldPwd}
            htmlFor="pwd"
            trailing={
              !isSignUp && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                  className="text-mm-coral-2 dark:text-mm-coral font-medium hover:underline"
                >
                  {t.forgot}
                </a>
              )
            }
          >
            <input
              id="pwd"
              name="password"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? t.fldPwdPhSignUp : t.fldPwdPhSignIn}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="flex-1 min-w-0 h-full px-3.5 bg-transparent border-0 outline-0 text-mm-ink text-sm font-medium placeholder:text-mm-ink-4"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="h-full px-3 text-mm-ink-3 hover:text-mm-ink font-mono font-medium text-[11px] tracking-wider uppercase"
            >
              {showPwd ? t.hide : t.show}
            </button>
          </Field>

          {isSignUp && (
            <div className="-mt-2 mb-3.5">
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
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-[12px] bg-mm-ink text-mm-bg text-sm font-medium inline-flex items-center justify-center gap-2 hover:-translate-y-px disabled:opacity-60 disabled:translate-y-0 transition shadow-[0_1px_0_rgba(255,255,255,.16)_inset,0_1px_2px_rgba(0,0,0,.18),0_8px_16px_-8px_rgba(40,24,8,.4)]"
          >
            {isSignUp ? (
              <code className="font-mono font-medium text-[13px]">{t.submitSignUp}</code>
            ) : (
              <span>{t.submitSignIn}</span>
            )}
            <ArrowRight size={16} strokeWidth={1.7} />
          </button>
        </form>

        <div className="mt-[22px] text-center text-mm-ink-3 text-[13px]">
          {isSignUp ? (
            <>
              {t.footSignUp}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="text-mm-ink font-medium hover:underline"
              >
                {t.footSignUpLink}
              </a>
            </>
          ) : (
            <>
              {t.footSignIn}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/signup");
                }}
                className="text-mm-ink font-medium hover:underline"
              >
                {t.footSignInLink}
              </a>
            </>
          )}
        </div>

        <p className="mt-7 text-center text-mm-ink-3 text-xs leading-[1.5]">
          {t.legalA}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-mm-ink-2 underline decoration-mm-ink-4">
            {t.legalTerms}
          </a>
          {t.legalAnd}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-mm-ink-2 underline decoration-mm-ink-4">
            {t.legalPrivacy}
          </a>
          {t.legalEnd}
        </p>
      </div>
    </div>
  );
};

// Tiny field wrapper — keeps the input pill consistent between email, name,
// and password rows. The focus ring lives on .mm-auth-input so it wraps the
// trailing show/hide button too.
const Field = ({ label, htmlFor, trailing, children }) => (
  <div className="flex flex-col gap-1.5 mb-3.5">
    <label htmlFor={htmlFor} className="text-xs font-medium text-mm-ink-2 flex items-baseline justify-between">
      <span>{label}</span>
      {trailing}
    </label>
    <div className="mm-auth-input flex items-center h-11 bg-mm-paper border border-mm-border-2 rounded-[10px] transition">
      {children}
    </div>
  </div>
);

export default AuthForm;
