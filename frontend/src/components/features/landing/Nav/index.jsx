import { Link, useNavigate } from "react-router";
import ThemeToggle from "../../../shared/ThemeToggle";
import LangToggle from "../../../shared/LangToggle";

const Nav = ({ copy }) => {
  const navigate = useNavigate();

  return (
    <nav className="relative z-20">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 h-[72px] flex items-center gap-8 relative z-[1]">
        <Link to="/" className="inline-flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="w-7 h-7 rounded-lg bg-mm-ink text-mm-bg inline-flex items-center justify-center font-mono font-semibold text-[15px]">
            M
          </span>
          <span className="hidden md:inline">Merge Me</span>
        </Link>

        <div className="hidden md:flex gap-7 ml-2 max-[720px]:hidden">
          <a href="#gallery" className="text-mm-ink-2 text-sm font-medium hover:text-mm-ink">
            {copy.navFeatures}
          </a>
          <a href="#how" className="text-mm-ink-2 text-sm font-medium hover:text-mm-ink">
            {copy.navHow}
          </a>
          <a href="#pricing" className="text-mm-ink-2 text-sm font-medium hover:text-mm-ink">
            {copy.navPricing}
          </a>
          <a href="#docs" className="text-mm-ink-2 text-sm font-medium hover:text-mm-ink">
            {copy.navDocs}
          </a>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LangToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="inline-flex items-center h-9 px-3 sm:h-11 sm:px-[18px] rounded-[12px] border border-mm-border-2 text-xs sm:text-sm font-medium text-mm-ink hover:bg-mm-surface transition"
          >
            {copy.signUp}
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-flex items-center h-9 px-3 sm:h-11 sm:px-[18px] rounded-[12px] border border-mm-border-2 text-xs sm:text-sm font-medium text-mm-ink hover:bg-mm-surface transition"
          >
            {copy.login}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
