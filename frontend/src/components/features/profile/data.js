// Mock activity timeline + display-only profile fields (verified accounts,
// completeness%, prefs) that don't yet exist on the backend user document.
// Once the user model grows these fields, swap to real data.

export const ACTIVITY = [
  { id: 1, type: "merge",  target: "Sasha Lindqvist", meta: "+ go × k8s · stockholm",      ago: "2d" },
  { id: 2, type: "merge",  target: "Rohan Kapoor",    meta: "+ k8s × py · berlin",         ago: "5d" },
  { id: 3, type: "edit",   target: "stack",           meta: "+ Rust",                       ago: "1w" },
  { id: 4, type: "merge",  target: "Yuki Tanaka",     meta: "+ ts × go · tokyo",           ago: "1w" },
  { id: 5, type: "verify", target: "GitHub",          meta: "@aanya-i · 218 repos",        ago: "1w" },
  { id: 6, type: "edit",   target: "about",           meta: "updated bio (2nd time this month)", ago: "2w" },
];

export const VERIFIED_DEFAULT = {
  github:        { handle: "@aanya-i", repos: 218, years: 4 },
  linkedin:      { title: "Backend Engineer at Razorpay" },
  stackoverflow: { rep: 12400, top: "top 5% Go" },
};

export const PREFS_DEFAULT = {
  distance: 200,
  ageRange: [25, 34],
  looking: "long-running",
};

export const LANGS_DEFAULT = ["English", "Hindi", "Kannada"];
export const PRONOUNS_DEFAULT = "she/her";
export const HANDLE_DEFAULT = "@aanya-i";
export const COVER_DEFAULT = "/landing/p-bookstore-girl.png";
export const COMPLETENESS_DEFAULT = 84;
