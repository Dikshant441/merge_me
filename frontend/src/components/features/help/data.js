// Static content for the Help page — popular articles + FAQ. Swap the hrefs
// for real doc links once they exist.

export const HELP_ARTICLES = [
  { id: 1, title: "Why is my queue empty?",          tag: "Feed",    href: "#" },
  { id: 2, title: "Getting verified with GitHub",    tag: "Account", href: "#" },
  { id: 3, title: "How matching & merging works",    tag: "Basics",  href: "#" },
  { id: 4, title: "Editing your profile & skills",   tag: "Profile", href: "#" },
  { id: 5, title: "Free vs Pro — what's included",   tag: "Billing", href: "#" },
  { id: 6, title: "Staying safe & reporting a user", tag: "Safety",  href: "#" },
];

export const HELP_FAQS = [
  {
    id: 1,
    q: "How do I get matched?",
    a: "We surface developers whose stack, goals, and location overlap with yours. Swipe right to merge — if they merge back, it's a match and you can start a chat.",
  },
  {
    id: 2,
    q: "Is Merge Me free?",
    a: "Yes — the core experience is free. Pro adds rewind, more daily merges, and priority placement in other people's queues.",
  },
  {
    id: 3,
    q: "How do I verify my GitHub?",
    a: "Sign in with GitHub from the login screen. We only read your public profile and verified email — we never post anything on your behalf.",
  },
  {
    id: 4,
    q: "Can I change my profile details?",
    a: "Open Profile → Edit to update your name, avatar, about, skills, age, and gender. Changes save instantly.",
  },
  {
    id: 5,
    q: "How do I delete my account?",
    a: "Email us from the card below and we'll remove your account and data within 48 hours.",
  },
];
