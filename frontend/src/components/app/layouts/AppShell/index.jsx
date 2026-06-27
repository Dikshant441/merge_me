import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { authApi } from "../../../../api/auth/auth.api";
import Sidebar from "../../../shared/Sidebar";
import Topbar from "../../../shared/Topbar";
import { addUser } from "../../../../store/user/slice";
import { useLocale } from "../../../../helpers/useLocale";
import { getCopy } from "../../../../constants/copy";

// Layout for all logged-in routes — sticky 248px sidebar + main canvas with
// its own sticky topbar. Also handles: fetching /profile/view on first mount
// (the auth gate), syncing data-theme + data-lang on <html>, and bouncing to
// /login if the visitor isn't authenticated.

const AppShell = () => {
  const user = useSelector((s) => s.user);
  const theme = useSelector((s) => s.ui.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();
  const copy = getCopy(locale);

  // Open by default on desktop (persistent rail); closed on mobile (drawer).
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === "undefined" || window.matchMedia("(min-width: 1024px)").matches
  );
  // Until we've confirmed who the visitor is we render nothing but a loader —
  // otherwise the protected page flashes before the redirect kicks in. If we
  // already have a user in the store there's nothing to check.
  const [checking, setChecking] = useState(!user);

  // sync html attrs for theme + locale
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-lang", locale);
    document.documentElement.lang = locale === "hi" ? "hi" : "en";
  }, [theme, locale]);

  // auth gate — pull current user if we don't have one, bounce to /login if we
  // can't confirm a session (401 or any other failure).
  useEffect(() => {
    if (user) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    const fetchUser = async () => {
      try {
        const res = await authApi.me();
        if (!cancelled) {
          dispatch(addUser(res.data.user));
          setChecking(false);
        }
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status !== 401) console.error(err);
        navigate("/login", { state: { from: location.pathname }, replace: true });
      }
    };
    fetchUser();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On mobile the sidebar is a drawer — dismiss it whenever the route changes.
  // On desktop it's a persistent rail, so leave it open.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) setSidebarOpen(false);
  }, [location.pathname]);

  // Don't render the protected shell until auth is settled. While checking we
  // show a minimal loader; if there's still no user we're mid-redirect to
  // /login, so render nothing.
  if (checking) {
    return (
      <div className="relative bg-mm-bg text-mm-ink font-sans antialiased h-screen w-screen grid place-items-center">
        <div className="app-bg" />
        <span className="relative z-[1] font-mono text-sm text-mm-ink-3">authenticating…</span>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="bg-mm-bg text-mm-ink font-sans antialiased h-screen overflow-hidden">
      <div className="app-bg" />
      <div className={[
        "relative z-[1] grid grid-cols-1 h-screen",
        sidebarOpen ? "lg:grid-cols-[248px_minmax(0,1fr)]" : "",
      ].join(" ")}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} copy={copy} />
        <main className="flex flex-col min-w-0 h-screen overflow-hidden">
          <Topbar copy={copy} onOpenSidebar={() => setSidebarOpen((o) => !o)} />
          <div className="flex-1 overflow-y-auto p-7 max-[720px]:p-5">
            <Outlet context={{ copy, locale }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
