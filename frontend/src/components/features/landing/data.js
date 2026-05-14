// Demo data for the landing page. Read by Hero (swipe stack) and Gallery (couples grid).
// All photo paths are public/ — referenced as absolute URLs.

export const PROFILES = [
  {
    photo: "/landing/g8-3.png",
    name: { en: "Aanya Iyer", hi: "आन्या अय्यर" },
    age: 27,
    role: { en: "Backend · Go, Kubernetes", hi: "बैकएंड · Go, Kubernetes" },
    tags: ["Go", "Kubernetes", "Postgres", "Bangalore"],
    shared: [0, 1, 3],
    commit: "first commit: hello :)",
  },
  {
    photo: "/landing/g8-2.png",
    name: { en: "Yuki Tanaka", hi: "युकी तानाका" },
    age: 29,
    role: { en: "Design Eng · TypeScript", hi: "डिज़ाइन इंजी. · TypeScript" },
    tags: ["TypeScript", "React", "Figma", "Tokyo"],
    shared: [0, 1, 3],
    commit: "feat: weekend in Lisbon",
  },
  {
    photo: "/landing/g8-1.png",
    name: { en: "Mira Chen", hi: "मीरा चेन" },
    age: 28,
    role: { en: "Systems · Rust", hi: "सिस्टम्स · Rust" },
    tags: ["Rust", "Linux", "Networking", "Toronto"],
    shared: [0, 1],
    commit: "chore: coffee on saturday",
  },
  {
    photo: "/landing/g8-7.png",
    name: { en: "Sasha Lindqvist", hi: "साशा लिंडक्विस्ट" },
    age: 26,
    role: { en: "Platform · GitLab, Terraform", hi: "प्लेटफ़ॉर्म · GitLab, Terraform" },
    tags: ["GitLab", "Terraform", "AWS", "Stockholm"],
    shared: [0, 2, 3],
    commit: "init: dinner @ Mineral",
  },
  {
    photo: "/landing/g8-8.png",
    name: { en: "Rohan Kapoor", hi: "रोहन कपूर" },
    age: 30,
    role: { en: "SRE · Kubernetes", hi: "SRE · Kubernetes" },
    tags: ["Kubernetes", "Python", "Linux", "Berlin"],
    shared: [0, 2, 3],
    commit: "fix: typo in our story",
  },
];

export const COUPLES = [
  {
    photo: "/landing/g4a-1.png",
    who: { en: "Sasha × Rohan", hi: "साशा × रोहन" },
    meta: "go + gitlab · merged 03/26 · amsterdam",
    stamp: "long-running",
    span: "mm-pc-a",
  },
  {
    photo: "/landing/p-night-market-couple.png",
    who: { en: "Mei × Arjun", hi: "मई × अर्जुन" },
    meta: "rust + react · merged 11/25 · tokyo",
    stamp: "shipping ☕",
    span: "mm-pc-b",
  },
  {
    photo: "/landing/g6-4.png",
    who: { en: "Liv × Kenji", hi: "लिव × केन्जी" },
    meta: "ts + go · merged 09/25 · oslo",
    stamp: "v2.0",
    span: "mm-pc-c",
  },
  {
    photo: "/landing/g4a-4.png",
    who: { en: "Diego × Sam", hi: "दिएगो × सैम" },
    meta: "next.js + go · merged 07/25 · seoul",
    stamp: "still pushing",
    span: "mm-pc-d",
  },
  {
    photo: "/landing/g3-big.png",
    who: { en: "Marco × Zoé", hi: "मार्को × ज़ोए" },
    meta: "golang + python · merged 02/26 · istanbul",
    stamp: "+1 to main",
    span: "mm-pc-e",
  },
  {
    photo: "/landing/p-rust-girl-couple.png",
    who: { en: "Ada × Theo", hi: "एडा × थिओ" },
    meta: "rust + embedded · merged 05/25 · oakland",
    stamp: "stable",
    span: "mm-pc-f",
  },
];

export const TRUST_AVATARS = [
  "/landing/g8-1.png",
  "/landing/g8-2.png",
  "/landing/g8-3.png",
  "/landing/g8-7.png",
  "/landing/g8-8.png",
];

// Decorative floating "polaroids" behind the swipe stack.
// Hidden below 1100px (see Hero — they only render at md+).
export const FLOATING_POLAROIDS = [
  {
    photo: "/landing/p-rust-girl-couple.png",
    caption: ["@ada × @theo", "rust+ec"],
    className: "top-[-16px] left-[-28px] w-[160px] h-[180px] -rotate-[7deg] z-[1]",
  },
  {
    photo: "/landing/g6-1.png",
    caption: ["@mei × @arjun", "03/26"],
    className: "bottom-[-8px] left-[-56px] w-[150px] h-[170px] rotate-[6deg] z-[2]",
  },
  {
    photo: "/landing/g4a-1.png",
    caption: ["@sasha × @rohan", "amsterdam"],
    className: "top-[-28px] right-[-8px] w-[140px] h-[160px] rotate-[8deg] z-[1]",
  },
  {
    photo: "/landing/p-night-market-couple.png",
    caption: ["@kenji × @liv", "oslo"],
    className: "bottom-[24px] right-[-48px] w-[130px] h-[150px] -rotate-[5deg] z-[2]",
  },
];
