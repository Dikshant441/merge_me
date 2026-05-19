import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../../../shared/Sidebar";
import Topbar from "../../../shared/Topbar";
import { BASEURL } from "../../../../constants";
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // sync html attrs for theme + locale
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-lang", locale);
    document.documentElement.lang = locale === "hi" ? "hi" : "en";
  }, [theme, locale]);

  // auth gate — pull current user if we don't have one, bounce on 401
  useEffect(() => {
    if (user) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASEURL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }
        console.error(err);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close the mobile sidebar drawer whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-mm-bg text-mm-ink font-sans antialiased h-screen overflow-hidden">
      <div className="app-bg" />
      <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-[248px_minmax(0,1fr)] h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} copy={copy} />
        <main className="flex flex-col min-w-0 h-screen overflow-hidden">
          <Topbar copy={copy} onOpenSidebar={() => setSidebarOpen(true)} />
          <div className="flex-1 overflow-y-auto p-7 max-[720px]:p-5">
            <Outlet context={{ copy, locale }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
