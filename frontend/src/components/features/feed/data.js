// Display-only fields the design needs for the swipe queue rail —
// online, distance, repos, years, shared stack. The real /feed endpoint
// only returns user core fields, so these are filled in from a mock map
// keyed by _id, falling back to safe defaults when missing.

export const FEED_EXTRAS = {
  "u-yuki":  { shared: ["TypeScript", "Go", "Postgres"],   distance: 6800,  online: true,  repos: 312, years: 7 },
  "u-mira":  { shared: ["Rust", "Linux", "Python"],        distance: 12000, online: false, repos: 184, years: 6 },
  "u-sasha": { shared: ["Go", "Kubernetes", "Python"],     distance: 6200,  online: true,  repos: 401, years: 8 },
  "u-rohan": { shared: ["Kubernetes", "Python", "Linux", "Go"], distance: 7200,  online: true,  repos: 156, years: 9 },
  "u-diego": { shared: ["TypeScript", "Go"],               distance: 7800,  online: false, repos: 89,  years: 6 },
};

export const getFeedExtras = (user) => {
  if (!user) return { shared: [], distance: 0, online: false, repos: 0, years: 0 };
  const extras = FEED_EXTRAS[user._id] || {};
  return {
    shared: extras.shared || (user.skills || []).slice(0, 2),
    distance: extras.distance ?? 0,
    online: extras.online ?? false,
    repos: extras.repos ?? 0,
    years: extras.years ?? 0,
  };
};

export const QUOTA_TOTAL = 20;
