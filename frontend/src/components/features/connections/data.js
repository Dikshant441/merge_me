// Display-only fields for the connections list — online state, merged-at
// label, last-message preview, unread count. The /user/connections endpoint
// only returns user core fields, so the design's rich list rows pull these
// from a mock keyed by _id (until a connection-meta endpoint exists).

export const CONNECTION_EXTRAS = {
  "u-yuki":  { online: true,  mergedAt: "5d",  lastMessage: "lmao no — that's literally what `Awaited<T>` is for", unread: 2, sharedStack: ["TypeScript", "Go", "Postgres"] },
  "u-mira":  { online: false, mergedAt: "2w",  lastMessage: "ok but did you actually run cargo bench though",        unread: 0, sharedStack: ["Rust", "Linux", "Python"] },
  "u-sasha": { online: true,  mergedAt: "1mo", lastMessage: "see you saturday — bringing the laptop, not opening it", unread: 0, sharedStack: ["Go", "Kubernetes", "Python"] },
  "u-rohan": { online: true,  mergedAt: "3w",  lastMessage: "got paged at 3am, want to commiserate over breakfast?",  unread: 1, sharedStack: ["Kubernetes", "Python", "Linux", "Go"] },
  "u-priya": { online: false, mergedAt: "6w",  lastMessage: "the embeddings drift was so obvious in hindsight 😭",     unread: 0, sharedStack: ["Python"] },
  "u-liv":   { online: true,  mergedAt: "2d",  lastMessage: "your reducer fix worked. now buying you coffee",          unread: 0, sharedStack: ["TypeScript", "React"] },
};

export const getConnectionExtras = (id) => CONNECTION_EXTRAS[id] || {
  online: false, mergedAt: "recent", lastMessage: "", unread: 0, sharedStack: [],
};
