import { useDispatch, useSelector } from "react-redux";
import { Sun, Moon } from "lucide-react";
import { toggleTheme } from "../../../store/ui/slice";

const ThemeToggle = () => {
  const theme = useSelector((s) => s.ui.theme);
  const dispatch = useDispatch();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-10 h-10 rounded-[12px] border border-mm-border-2 text-mm-ink-2 inline-flex items-center justify-center hover:bg-mm-surface hover:text-mm-ink transition"
    >
      {isDark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
    </button>
  );
};

export default ThemeToggle;
