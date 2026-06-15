import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "../../../shared/ThemeToggle";
import LangToggle from "../../../shared/LangToggle";

// Slim nav for /login + /signup. The landing Nav has section links and a
// signup CTA which would just be noise on the auth page — here we want the
// brand mark, a way back to "/", and the theme + language toggles.
const AuthNav = ({ copy }) => {
  return (
    <nav className="relative z-20">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 h-[72px] flex items-center gap-3 sm:gap-4">
        <Link to="/" className="inline-flex items-center font-semibold tracking-tight">
          <span className="w-7 h-7 rounded-lg bg-mm-ink text-mm-bg inline-flex items-center justify-center font-mono font-semibold text-[15px]">
            M
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="inline-flex items-center h-9 px-3 sm:h-11 sm:px-[18px] rounded-[12px] border border-mm-border-2 text-xs sm:text-sm font-medium text-mm-ink hover:bg-mm-surface transition"
          >
            <ArrowLeft size={14} strokeWidth={1.7} />
            <span>Home</span>
          </Link>
          <LangToggle />
          <ThemeToggle />
          <span className="hidden md:inline font-mono font-medium text-xs text-mm-ink-3">
            {copy.auth.navStatus}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default AuthNav;
