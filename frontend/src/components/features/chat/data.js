// Mock chat thread used when the real socket history hasn't loaded.
// Once /chat/:userId returns messages, the thread component swaps to those.
// Connection-level extras (online, mergedAt, …) live in ../connections/data.

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
