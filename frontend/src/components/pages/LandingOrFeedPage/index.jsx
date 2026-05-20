import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Landing from "../LandingPage";

// Index gate: logged-out visitors see the marketing landing page; logged-in
// users get redirected to /feed where the AppShell takes over.
const LandingOrFeed = () => {
  const user = useSelector((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/feed", { replace: true });
  }, [user, navigate]);

  if (user) return null;
  return <Landing />;
};

export default LandingOrFeed;
