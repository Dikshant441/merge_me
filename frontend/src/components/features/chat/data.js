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

// Mock chat thread used when the real socket history hasn't loaded.
// Once /chat/:userId returns messages, the thread component swaps to those.
export const MOCK_MESSAGES = [
  { id: 1, from: "them", time: "10:42", text: "ok so I finally read your blog post about gRPC streaming" },
  { id: 2, from: "them", time: "10:42", text: "and I'm convinced you're wrong about backpressure" },
  { id: 3, from: "me",   time: "10:44", text: "LOL ok say more" },
  { id: 4, from: "them", time: "10:46",
    text: "you said the server can rely on `WindowUpdate` to throttle clients, but in our setup we saw the buffer fill up before the update landed.",
    code: { lang: "go", body: "// what we actually do\nstream.Send(msg)\nselect {\ncase <-ctx.Done():\n  return\ndefault:\n}" } },
  { id: 5, from: "me",   time: "10:51",
    text: "hmm fair — that's load-dependent though. did you have flow-control off?",
    code: { lang: "diff", body: "- conn.SetReadLimit(1 << 20)\n+ conn.SetReadLimit(0)  // no flow ctrl" } },
  { id: 6, from: "them", time: "10:53", text: "🤦 yes. ok you win this round" },
  { id: 7, from: "me",   time: "10:54", text: "I'll add a footnote to the post" },
  { id: 8, from: "them", time: "10:55", text: "lmao no — that's literally what `Awaited<T>` is for" },
];
