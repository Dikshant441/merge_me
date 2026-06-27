// Bridge so non-React code (e.g. the axios 401 interceptor) can drive React
// Router navigation. AuthSync registers the live `navigate` on mount; until
// then we fall back to a hard location change.
let navigateFn = null;

export const setNavigate = (fn) => {
  navigateFn = fn;
};

export const goToLogin = () => {
  if (navigateFn) navigateFn("/login", { replace: true });
  else window.location.assign("/login");
};
