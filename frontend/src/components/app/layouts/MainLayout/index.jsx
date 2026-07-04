import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../../shared/Navbar";
import Footer from "../../../shared/Footer";
import { profileApi } from "../../../../api/profile/profile.api";
import { addUser } from "../../../../store/user/slice";
import { useLocale } from "../../../../helpers/useLocale";

// Index routes that may render the public Landing. While Landing is being
// shown we don't want the generic Navbar/Footer chrome on top of it, and a
// 401 from /profile/view shouldn't bounce a logged-out visitor to /login —
// they should just see Landing.
const PUBLIC_PATHS = new Set([
  "/",
  "/en-in",
  "/hi-in",
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
]);

const isPublicPath = (pathname) => {
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  return PUBLIC_PATHS.has(trimmed);
};

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.ui.theme);
  const locale = useLocale();

  const onPublicPath = isPublicPath(location.pathname);
  // Hide chrome only when Landing is actually about to render — i.e. on a
  // landing route and the user isn't logged in. Logged-in users on "/" see
  // the feed, which keeps the chrome.
  const trimmedPath = location.pathname.replace(/\/+$/, "") || "/";
  const isLandingRoute = ["/", "/en-in", "/hi-in"].includes(trimmedPath);
  // Auth-style public pages render their own slim nav — don't stack the
  // global chrome on top.
  const isAuthRoute = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ].includes(trimmedPath);
  const showChrome = !(isLandingRoute && !user) && !isAuthRoute;

  // Keep the html element in sync with redux theme + URL locale. This is the
  // single global write — every page reads the same vars from theme.css.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-lang", locale);
    document.documentElement.lang = locale === "hi" ? "hi" : "en";
  }, [theme, locale]);

  useEffect(() => {
    if (user) return;
    const fetchUser = async () => {
      try {
        const res = await profileApi.viewProfile();
        dispatch(addUser(res.data));
      } catch (err) {
        // On public paths a 401 just means "anonymous visitor" — leave
        // user null in redux and let the page decide what to render.
        if (err.response?.status === 401 && !onPublicPath) {
          navigate("/login");
          return;
        }
        if (err.response?.status !== 401) console.error(err);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-base-200">
      {showChrome && <Navbar />}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          {showChrome && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default Body;
