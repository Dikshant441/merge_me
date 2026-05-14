import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "../../../shared/ThemeToggle";
import LangToggle from "../../../shared/LangToggle";

const Nav = ({ copy }) => {
  const navigate = useNavigate();

  return (
    <nav className="relative z-20">
      <div className="max-w-[1280px] mx-auto px-7 h-[72px] flex items-center gap-8 relative z-[1]">
        <Link to="/" className="inline-flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="w-7 h-7 rounded-lg bg-mm-ink text-mm-bg inline-flex items-center justify-center font-mono font-semibold text-[15px]">
            M
          </span>
          <span>Merge Me</span>
        </Link>

        <div className="hidden md:flex gap-[26px] ml-2 max-[720px]:hidden">
          <a href="#gallery" className="text-mm-ink-2 text-sm font-medium hover:text-mm-ink">
            {copy.navFeatures}
          </a>
          <a href="#how" className="text-mm-ink-2 text-sm font-medium hover:text-mm-ink">
            {copy.navHow}
          </a>
          <a href="#pricing" className="text-mm-ink-2 text-sm font-medium hover:text-mm-ink">
            {copy.navPricing}
          </a>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <LangToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="h-11 px-[18px] rounded-[12px] border border-mm-border-2 text-sm font-medium text-mm-ink hover:bg-mm-surface transition"
          >
            {copy.signIn}
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="h-11 px-[18px] rounded-[12px] bg-mm-ink text-mm-bg inline-flex items-center gap-2 text-sm font-medium shadow-[0_1px_0_rgba(255,255,255,.16)_inset,0_1px_2px_rgba(0,0,0,.18)] hover:-translate-y-px transition"
          >
            <code className="font-mono font-medium text-[13px]">{copy.cta}</code>
            <ArrowRight size={16} strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
