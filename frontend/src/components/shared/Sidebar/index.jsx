import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import {
  LayoutGrid,
  MessageSquare,
  Inbox,
  User,
  Crown,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { authApi } from "../../../api/auth/auth.api";
import { removeUser } from "../../../store/user/slice";
import { removeFeed } from "../../../store/feed/slice";
import { removeConnections } from "../../../store/connections/slice";
import { broadcastLogout } from "../../../helpers/authChannel";

// Left-rail nav for the logged-in app. Sticky to the viewport at 248px wide.
// Active route lights the icon coral; unread connections + pending requests
// show coral count badges on their items.

const Sidebar = ({ open, onClose, copy }) => {
  const user = useSelector((s) => s.user);
  const connections = useSelector((s) => s.connections);
  const requests = useSelector((s) => s.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const unreadCount = Array.isArray(connections)
    ? connections.filter((c) => c.unread).length
    : 0;
  const requestCount = Array.isArray(requests) ? requests.length : 0;

  const logout = async () => {
    try {
      await authApi.logout();
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      broadcastLogout(); // sign out every other open tab too
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const product = [
    { to: "/feed",        icon: LayoutGrid,    label: copy.app.nav.feed },
    { to: "/connections", icon: MessageSquare, label: copy.app.nav.connections, badge: unreadCount },
    { to: "/requests",    icon: Inbox,         label: copy.app.nav.requests,    badge: requestCount },
    { to: "/profile",     icon: User,          label: copy.app.nav.profile },
  ];

  return (
    <>
      {/* mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={[
          "border-r border-mm-border bg-mm-bg/60 backdrop-blur-md",
          "px-4 py-6 flex flex-col gap-7",
          "fixed left-0 top-0 z-30 w-[248px] h-screen transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
          open ? "lg:sticky lg:translate-x-0 lg:z-auto" : "lg:hidden",
        ].join(" ")}
      >
        <div>
          <div className="inline-flex items-center gap-2.5 font-semibold tracking-[-0.01em] text-[17px] px-2.5">
            <span className="w-7 h-7 rounded-[8px] bg-mm-ink text-mm-bg inline-flex items-center justify-center font-mono font-semibold text-[15px] shadow-[0_1px_0_rgba(255,255,255,.14)_inset]">
              M
            </span>
            <span>Merge Me</span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {product.map((it) => (
            <NavRow key={it.to} {...it} onClick={onClose} />
          ))}
          <NavRow to="/premium" icon={Crown}      label={copy.app.nav.premium} onClick={onClose} />
          <NavRow to="/help"    icon={HelpCircle} label={copy.app.nav.help}    onClick={onClose} />
        </div>

        <div className="flex-1" />

        <div className="flex flex-col gap-2 pt-4 border-t border-mm-border">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium border border-transparent text-mm-ink-2 hover:text-red-500 hover:bg-red-500/8 hover:border-red-500/20 transition w-full"
          >
            <LogOut size={18} strokeWidth={1.7} className="flex-shrink-0" />
            <span>{copy.app.nav.logout}</span>
          </button>

          {user && (
            <button
              type="button"
              onClick={() => {
                navigate("/profile");
                onClose?.();
              }}
              className="flex items-center gap-2.5 p-2.5 w-full text-left bg-mm-surface border border-mm-border-2 rounded-[12px] shadow-[var(--mm-shadow-soft)] hover:border-mm-border transition"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.first_name}
                  className="w-9 h-9 rounded-full object-cover border border-mm-border flex-shrink-0"
                />
              ) : (
                <span className="w-9 h-9 rounded-full bg-mm-coral text-white inline-flex items-center justify-center font-semibold text-[15px] border border-mm-border flex-shrink-0 select-none">
                  {(user.first_name || "?")[0].toUpperCase()}
                </span>
              )}
              <div className="leading-[1.25] min-w-0 flex-1">
                <div className="font-semibold text-[13px] text-mm-ink truncate">
                  {user.first_name} {user.last_name}
                </div>
                <div className="font-mono font-medium text-[11.5px] text-mm-ink-3 truncate">
                  @{(user.first_name || "you").toLowerCase()}
                </div>
              </div>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

// NavRow either renders a NavLink (when given `to`) or a plain button. The
// NavLink branch styles the row based on the route — coral icon when active.
const NavRow = ({ to, as, icon: Icon, label, badge, onClick }) => {
  const itemClass = (active) =>
    [
      "inline-flex items-center gap-3 px-3 py-2.5 rounded-[10px]",
      "text-[14px] font-medium border transition select-none",
      active
        ? "text-mm-ink bg-mm-surface border-mm-border-2 shadow-[var(--mm-shadow-soft)]"
        : "text-mm-ink-2 bg-transparent border-transparent hover:text-mm-ink hover:bg-mm-paper",
    ].join(" ");

  const inner = (active) => (
    <>
      <span
        className={[
          "w-[18px] h-[18px] inline-flex items-center justify-center flex-shrink-0",
          active ? "text-mm-coral" : "text-mm-ink-3",
        ].join(" ")}
      >
        <Icon size={18} strokeWidth={1.7} />
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge ? (
        <span className="ml-auto min-w-[18px] h-[18px] px-1.5 rounded-full bg-mm-coral text-white font-mono font-semibold text-[11px] inline-flex items-center justify-center">
          {badge}
        </span>
      ) : null}
    </>
  );

  if (as === "button") {
    return (
      <button type="button" onClick={onClick} className={itemClass(false)}>
        {inner(false)}
      </button>
    );
  }
  return (
    <NavLink to={to} onClick={onClick} className={({ isActive }) => itemClass(isActive)}>
      {({ isActive }) => inner(isActive)}
    </NavLink>
  );
};

export default Sidebar;
