// Cross-tab auth sync. When one tab logs in or out, the others follow without a
// manual refresh — e.g. clicking the email verify link (which opens a new tab)
// also logs in the original "Check your inbox" tab. Uses BroadcastChannel,
// supported in all modern browsers; degrades to a no-op where it isn't.
const channel =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("mm-auth") : null;

export const broadcastLogin = (user) => channel?.postMessage({ type: "login", user });
export const broadcastLogout = () => channel?.postMessage({ type: "logout" });

// Subscribe to auth events from other tabs. Returns an unsubscribe fn.
export const onAuthMessage = (handler) => {
  if (!channel) return () => {};
  const listener = (e) => handler(e.data);
  channel.addEventListener("message", listener);
  return () => channel.removeEventListener("message", listener);
};
