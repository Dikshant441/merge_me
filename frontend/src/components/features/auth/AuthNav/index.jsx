import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "../../../shared/ThemeToggle";
import LangToggle from "../../../shared/LangToggle";

// Slim nav for /login + /signup. The landing Nav has section links and a
// signup CTA which would just be noise on the auth page — here we want the
// brand mark, a way back to "/", and the theme + language toggles.
const AuthNav = ({ copy }) => {
  return (
    <nav className="relative z-20 px-8 max-[520px]:px-5 pt-[22px]">
      <div className="max-w-[1280px] mx-auto flex items-center gap-4">
        <Link to="/" className="inline-flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="w-7 h-7 rounded-lg bg-mm-ink text-mm-bg inline-flex items-center justify-center font-mono font-semibold text-[15px]">
            M
          </span>
          <span>Merge Me</span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-mm-ink-2 text-[13px] font-medium px-2.5 py-1.5 rounded-lg hover:text-mm-ink hover:bg-mm-surface transition"
        >
          <ArrowLeft size={14} strokeWidth={1.7} />
          {copy.auth.backToMerge}
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <LangToggle />
          <ThemeToggle />
          <span className="hidden sm:inline font-mono font-medium text-xs text-mm-ink-3">
            {copy.auth.navStatus}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default AuthNav;
