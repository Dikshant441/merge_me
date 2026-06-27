import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { addUser, removeUser } from "../../../store/user/slice";
import { onAuthMessage } from "../../../helpers/authChannel";
import { setNavigate } from "../../../helpers/navigation";

// Public routes a freshly-authed tab should bounce away from to /feed once
// another tab signs in (e.g. the "Check your inbox" tab after email verify).
const PUBLIC_PATHS = new Set([
  "/",
  "/en-in",
  "/hi-in",
  "/login",
  "/signup",
  "/verify-email",
]);

// Renders nothing. Listens for cross-tab auth events (see helpers/authChannel)
// and keeps this tab in sync — instant login/logout across every open tab.
const AuthSync = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Expose navigate to non-React code (the axios 401 interceptor).
  useEffect(() => setNavigate(navigate), [navigate]);

  useEffect(() => {
    return onAuthMessage((msg) => {
      if (msg?.type === "login" && msg.user) {
        dispatch(addUser(msg.user));
        // Only pull a waiting auth/landing tab into the app; leave tabs already
        // deep in the app where they are.
        if (PUBLIC_PATHS.has(location.pathname)) navigate("/feed", { replace: true });
      } else if (msg?.type === "logout") {
        dispatch(removeUser());
        navigate("/login", { replace: true });
      }
    });
  }, [dispatch, navigate, location.pathname]);

  return null;
};

export default AuthSync;
