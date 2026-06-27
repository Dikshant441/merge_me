import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { authApi } from "../../../api/auth/auth.api";
import { addUser } from "../../../store/user/slice";
import { broadcastLogin } from "../../../helpers/authChannel";

// Landing page for the verification email link. POSTs the token; on success
// the backend sets auth cookies + returns the user, so we go straight to /feed.
const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = params.get("token");
  // Derive the initial state from the token instead of setting it inside the
  // effect — a synchronous setState in an effect triggers a cascading render.
  const [status, setStatus] = useState(token ? "verifying" : "error"); // verifying | error
  const [message, setMessage] = useState(token ? "" : "Missing verification token.");
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
        setMessage(err.response?.data?.message || "Verification link is invalid or expired.");
      });
  }, [token, navigate, dispatch]);

  return (
    <div className="min-h-screen grid place-items-center bg-mm-bg text-mm-ink px-6">
      <div className="max-w-sm text-center">
        {status === "verifying" ? (
          <>
            <h1 className="text-xl font-semibold mb-2">Verifying your email…</h1>
            <p className="text-mm-ink-2 text-sm">One moment.</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-2">Verification failed</h1>
            <p className="text-mm-ink-2 text-sm mb-5">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="h-11 px-5 rounded-[12px] bg-mm-ink text-mm-bg text-sm font-medium"
            >
              Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
