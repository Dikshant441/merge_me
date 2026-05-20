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

  // Already signed in → straight to the index (which itself gates on user).
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const [showIdx, setShowIdx] = useState(0);

  return (
    <div className="relative min-h-full bg-mm-bg text-mm-ink font-sans antialiased overflow-x-hidden">
      <div className="landing-bg" />
      <div className="relative z-[1] flex flex-col min-h-screen">
        <AuthNav copy={copy} />
        <main className="flex-1 grid grid-cols-[1.05fr_1fr] max-[980px]:grid-cols-1 gap-8 px-8 pt-2 pb-12 max-w-[1280px] w-full mx-auto items-stretch max-[520px]:px-5">
          <Showcase copy={copy} idx={showIdx} setIdx={setShowIdx} />
          <AuthForm copy={copy} mode={mode} />
        </main>
      </div>
    </div>
  );
};

export default Login;
