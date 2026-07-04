import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { AlertCircle, LoaderCircle, MailCheck } from "lucide-react";
import { authApi } from "../../../api/auth/auth.api";
import { addUser } from "../../../store/user/slice";
import { broadcastLogin } from "../../../helpers/authChannel";
import { useLocale } from "../../../helpers/useLocale";
import { getCopy } from "../../../constants/copy";
import LinkPageShell from "../../features/auth/LinkPageShell";

// Landing page for the verification email link. POSTs the token; on success
// the backend sets auth cookies + returns the user, so we go straight to /feed.
const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locale = useLocale();
  const copy = getCopy(locale);
  const t = copy.auth;
  const token = params.get("token");
  // Derive the initial state from the token instead of setting it inside the
  // effect — a synchronous setState in an effect triggers a cascading render.
  const [status, setStatus] = useState(token ? "verifying" : "error"); // verifying | error
  const [message, setMessage] = useState(token ? "" : t.veMissing);
  const ran = useRef(false); // guard React StrictMode's double-invoke (token is single-use)

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;

    authApi
      .verifyEmail(token)
      .then((res) => {
        dispatch(addUser(res.data.user));
        broadcastLogin(res.data.user); // wake up the original "Check your inbox" tab
        navigate("/feed", { replace: true });
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || t.veInvalid);
      });
  }, [token, navigate, dispatch, t.veInvalid]);

  return (
    <LinkPageShell copy={copy} contentClassName="text-center">
      <div className="max-w-sm mx-auto">
        {status === "verifying" ? (
          <>
            <span className="inline-flex items-center gap-2 h-[30px] px-3 rounded-full bg-mm-paper border border-mm-border text-mm-ink-2 font-mono font-medium text-[11px] tracking-[0.08em] uppercase mb-5">
              <span className="w-2 h-2 rounded-full bg-mm-success" />
              email-verify
            </span>
            <div className="mx-auto mb-5 w-[52px] h-[52px] rounded-full bg-mm-paper border border-mm-border grid place-items-center text-mm-coral-2 shadow-[var(--mm-shadow-soft)]">
              <LoaderCircle size={22} strokeWidth={1.8} className="animate-spin" />
            </div>
            <h1 className="font-sans font-semibold tracking-[-0.025em] leading-[1.08] text-[clamp(26px,2.6vw,34px)] mb-2.5">
              {t.veTitle}
            </h1>
            <p className="text-mm-ink-2 text-[15px] max-w-[320px] mx-auto">{t.veSub}</p>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 h-[30px] px-3 rounded-full bg-mm-paper border border-mm-border text-mm-ink-2 font-mono font-medium text-[11px] tracking-[0.08em] uppercase mb-5">
              <span className="w-2 h-2 rounded-full bg-mm-danger" />
              email-verify
            </span>
            <div className="mx-auto mb-5 w-[52px] h-[52px] rounded-full bg-mm-paper border border-mm-border grid place-items-center text-mm-coral-2 shadow-[var(--mm-shadow-soft)]">
              {token ? <AlertCircle size={22} strokeWidth={1.8} /> : <MailCheck size={22} strokeWidth={1.8} />}
            </div>
            <h1 className="font-sans font-semibold tracking-[-0.025em] leading-[1.08] text-[clamp(26px,2.6vw,34px)] mb-2.5">
              {t.veErrorTitle}
            </h1>
            <p className="text-mm-ink-2 text-[15px] mb-5">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="h-12 px-5 rounded-[12px] bg-mm-ink text-mm-bg text-sm font-medium inline-flex items-center justify-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.16)_inset,0_1px_2px_rgba(0,0,0,.18),0_8px_16px_-8px_rgba(40,24,8,.4)]"
            >
              {t.fpBack}
            </button>
          </>
        )}
      </div>
    </LinkPageShell>
  );
};

export default VerifyEmail;
