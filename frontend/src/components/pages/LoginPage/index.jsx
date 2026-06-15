import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import AuthNav from "../../features/auth/AuthNav";
import Showcase from "../../features/auth/Showcase";
import AuthForm from "../../features/auth/AuthForm";
import { useLocale } from "../../../helpers/useLocale";
import { getCopy } from "../../../constants/copy";

// /login and /signup both render this page — the route segment picks the
// tab, and clicking a tab inside <AuthForm /> navigates between the two.
const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user);
  const locale = useLocale();
  const copy = getCopy(locale);

  const mode = location.pathname === "/signup" ? "signup" : "signin";

  // Already signed in → go back to where they came from, or /feed.
  useEffect(() => {
    if (user) navigate(location.state?.from ?? "/feed", { replace: true });
  }, [user, navigate, location.state]);

  const [showIdx, setShowIdx] = useState(0);

  return (
    <div className="relative min-h-full bg-mm-bg text-mm-ink font-sans antialiased overflow-x-hidden">
      <div className="landing-bg" />
      <div className="relative z-[1] flex flex-col min-h-screen">
        <AuthNav copy={copy} />
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 px-8 pt-6 sm:pt-8 pb-12 max-w-[1280px] w-full mx-auto items-stretch max-[520px]:px-5">
          <div className="hidden lg:block">
            <Showcase copy={copy} idx={showIdx} setIdx={setShowIdx} />
          </div>
          <AuthForm copy={copy} mode={mode} />
        </main>
      </div>
    </div>
  );
};

export default Login;
