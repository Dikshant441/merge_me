import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Landing from "../LandingPage";

// Index gate: logged-out visitors see the marketing landing page; logged-in
// users get redirected to /feed where the AppShell takes over.
const LandingOrFeed = () => {
  const user = useSelector((s) => s.user);
  const navigate = useNavigate();
  // Gate on a real identity (id from auth routes, _id from legacy
  // /profile/view), not object truthiness — a foreign persisted object
  // must not count as logged in.
  const authed = Boolean(user?.id || user?._id);

  useEffect(() => {
    if (authed) navigate("/feed", { replace: true });
  }, [authed, navigate]);

  if (authed) return null;
  return <Landing />;
};

export default LandingOrFeed;
