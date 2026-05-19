import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Search, Globe, Moon, Sun, Bell, Menu } from "lucide-react";
import { toggleTheme } from "../../../store/ui/slice";
import { PATH_BY_LOCALE } from "../../../constants/copy";
import { useLocale } from "../../../helpers/useLocale";

// Sticky header inside the main canvas — breadcrumb on the left, search in
// the middle, icon-buttons (lang / theme / notifications) on the right.
// The lang button cycles EN/HI via URL, theme dispatches Redux toggle.

const PAGE_KEY_BY_PATH = {
  "/feed":        "feed",
  "/connections": "connections",
  "/requests":    "requests",
  "/profile":     "profile",
  "/premium":     "premium",
  "/help":        "help",
};

const Topbar = ({ copy, onOpenSidebar }) => {
  const theme = useSelector((s) => s.ui.theme);
  const dispatch = useDispatch();
  const locale = useLocale();
  const navigate = useNavigate();
  const location = useLocation();

  const isDark = theme === "dark";

  // breadcrumb label — falls back to the last path segment for unknown routes.
  const trimmed = location.pathname.replace(/\/+$/, "") || "/";
  let key = PAGE_KEY_BY_PATH[trimmed];
  if (!key && trimmed.startsWith("/chat/")) key = "connections";
  const pageLabel = key ? copy.app.nav[key] : trimmed.replace("/", "");

  const switchLang = () => {
    const next = locale === "en" ? "hi" : "en";
    navigate("/" + PATH_BY_LOCALE[next]);
  };

  return (
    <header
      className={[
        "sticky top-0 z-10",
        "flex items-center gap-3 px-7 py-3.5 h-16",
        "border-b border-mm-border bg-mm-bg/60 backdrop-blur-md",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Menu"
        className="lg:hidden w-9 h-9 rounded-[10px] border border-mm-border bg-mm-surface text-mm-ink-2 inline-flex items-center justify-center hover:text-mm-ink"
      >
        <Menu size={16} strokeWidth={1.7} />
      </button>

      <div className="inline-flex items-center gap-2 font-medium text-sm">
        <span className="text-mm-ink-3 font-mono font-medium text-[13px]">
          {copy.app.topbar.pathPrefix}
        </span>
        <span className="text-mm-ink-4">/</span>
        <span className="text-mm-ink font-semibold tracking-[-0.01em]">{pageLabel}</span>
      </div>

      <div className="ml-6 hidden md:flex items-center gap-2 h-9 px-3 bg-mm-surface border border-mm-border-2 rounded-[10px] text-mm-ink-3 text-[13px] min-w-[280px] cursor-default select-none">
        <Search size={14} strokeWidth={1.7} />
        <span className="flex-1 truncate">{copy.app.topbar.searchPh}</span>
        <span className="inline-flex gap-1">
          <span className="font-mono font-medium text-[10.5px] border border-mm-border rounded-[4px] px-1.5 py-0.5 bg-mm-paper">⌘</span>
          <span className="font-mono font-medium text-[10.5px] border border-mm-border rounded-[4px] px-1.5 py-0.5 bg-mm-paper">K</span>
        </span>
      </div>

      <div className="ml-auto inline-flex items-center gap-2">
        <IconBtn onClick={switchLang} ariaLabel="Language">
          <Globe size={16} strokeWidth={1.7} />
        </IconBtn>
        <IconBtn onClick={() => dispatch(toggleTheme())} ariaLabel="Theme">
          {isDark ? <Sun size={16} strokeWidth={1.7} /> : <Moon size={16} strokeWidth={1.7} />}
        </IconBtn>
        <IconBtn ariaLabel="Notifications" indicator>
          <Bell size={16} strokeWidth={1.7} />
        </IconBtn>
      </div>
    </header>
  );
};

const IconBtn = ({ children, onClick, ariaLabel, indicator }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className="relative w-9 h-9 rounded-[10px] border border-mm-border bg-mm-surface text-mm-ink-2 inline-flex items-center justify-center hover:text-mm-ink hover:border-mm-border-2 transition"
  >
    {children}
    {indicator && (
      <span className="absolute top-2 right-2 w-[7px] h-[7px] rounded-full bg-mm-coral ring-2 ring-mm-surface" />
    )}
  </button>
);

export default Topbar;
