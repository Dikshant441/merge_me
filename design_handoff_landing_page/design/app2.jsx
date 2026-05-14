// app2.jsx — Merge Me landing v2: photo-driven, editorial, less boxy

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "lang": "en"
}/*EDITMODE-END*/;

// ─────────────────── content ───────────────────
const PROFILES = [
  { photo: "photos/g8-3.png", name: { en: "Aanya Iyer", hi: "आन्या अय्यर" },
    age: 27, role: { en: "Backend · Go, Kubernetes", hi: "बैकएंड · Go, Kubernetes" },
    tags: ["Go", "Kubernetes", "Postgres", "Bangalore"], shared: [0,1,3],
    commit: "first commit: hello :)" },
  { photo: "photos/g8-2.png", name: { en: "Yuki Tanaka", hi: "युकी तानाका" },
    age: 29, role: { en: "Design Eng · TypeScript", hi: "डिज़ाइन इंजी. · TypeScript" },
    tags: ["TypeScript", "React", "Figma", "Tokyo"], shared: [0,1,3],
    commit: "feat: weekend in Lisbon" },
  { photo: "photos/g8-1.png", name: { en: "Mira Chen", hi: "मीरा चेन" },
    age: 28, role: { en: "Systems · Rust", hi: "सिस्टम्स · Rust" },
    tags: ["Rust", "Linux", "Networking", "Toronto"], shared: [0,1],
    commit: "chore: coffee on saturday" },
  { photo: "photos/g8-7.png", name: { en: "Sasha Lindqvist", hi: "साशा लिंडक्विस्ट" },
    age: 26, role: { en: "Platform · GitLab, Terraform", hi: "प्लेटफ़ॉर्म · GitLab, Terraform" },
    tags: ["GitLab", "Terraform", "AWS", "Stockholm"], shared: [0,2,3],
    commit: "init: dinner @ Mineral" },
  { photo: "photos/g8-8.png", name: { en: "Rohan Kapoor", hi: "रोहन कपूर" },
    age: 30, role: { en: "SRE · Kubernetes", hi: "SRE · Kubernetes" },
    tags: ["Kubernetes", "Python", "Linux", "Berlin"], shared: [0,2,3],
    commit: "fix: typo in our story" },
];

const COUPLES = [
  { photo: "photos/g4a-1.png", who: { en: "Sasha × Rohan", hi: "साशा × रोहन" },
    meta: "go + gitlab · merged 03/26 · amsterdam", stamp: "long-running",
    span: "pc-a" },
  { photo: "photos/p-night-market-couple.png", who: { en: "Mei × Arjun", hi: "मई × अर्जुन" },
    meta: "rust + react · merged 11/25 · tokyo", stamp: "shipping ☕",
    span: "pc-b" },
  { photo: "photos/g6-4.png", who: { en: "Liv × Kenji", hi: "लिव × केन्जी" },
    meta: "ts + go · merged 09/25 · oslo", stamp: "v2.0",
    span: "pc-c" },
  { photo: "photos/g4a-4.png", who: { en: "Diego × Sam", hi: "दिएगो × सैम" },
    meta: "next.js + go · merged 07/25 · seoul", stamp: "still pushing",
    span: "pc-d" },
  { photo: "photos/g3-big.png", who: { en: "Marco × Zoé", hi: "मार्को × ज़ोए" },
    meta: "golang + python · merged 02/26 · istanbul", stamp: "+1 to main",
    span: "pc-e" },
  { photo: "photos/p-rust-girl-couple.png", who: { en: "Ada × Theo", hi: "एडा × थिओ" },
    meta: "rust + embedded · merged 05/25 · oakland", stamp: "stable",
    span: "pc-f" },
];

const COPY = {
  en: {
    navFeatures: "Features", navHow: "How it works", navPricing: "Pricing", navDocs: "Docs",
    signIn: "Sign in", cta: "git init love", pill: "v1.0 · public beta",
    h1a: "Find your perfect", h1em: "merge conflict", h1b: ".",
    lede: "Merge Me is the dating app for developers. Match by stack, chat in code blocks, and ship something real together.",
    ctaHint: "no credit card", kbdHint: "or press",
    trustStrong: "24,182 developers", trustRest: "from 1,400 companies — and counting.",
    eyebrow1: "Recently merged into main",
    section1Title: ["Real ", "stories", ", real ", "stacks", "."],
    section1Sub: "Couples who actually met by matching on languages, frameworks, and the time zones they keep awake.",
    galleryFoot: "showing 6 of 1,247 — ",
    galleryFootLink: "see the rest →",
    eyebrow2: "Why it works",
    section2Title: ["Built like a ", "developer tool", ", not a slot machine."],
    section2Sub: "Three things we got right.",
    features: [
      { num: "01", titleA: "Match by ", titleEm: "stack", titleB: ", not by selfie.",
        body: "Your real overlap — languages, frameworks, time zones — drives the queue. Profiles surface why you're a fit.",
        viz: "stack" },
      { num: "02", titleA: "Chat in ", titleEm: "code blocks", titleB: ".",
        body: "Triple-backtick a snippet and it just works. Syntax highlight, copy button, no \"can you paste it again\".",
        viz: "chat" },
      { num: "03", titleA: "Real devs, ", titleEm: "verified", titleB: ".",
        body: "Link GitHub, GitLab, or Bitbucket. We check it's actually yours, then never post on your behalf.",
        viz: "verify" },
    ],
    ctaStripPill: "git push origin you@love",
    ctaStripTitle: ["Your team is ", "shipping ", "without you."],
    ctaStripSub: "24,000+ developers already merging. Your queue is one signup away.",
    chatThem: "got a sec? my reducer is firing twice",
    chatThemCode: "useEffect(() => fetch('/me'), [user]);",
    chatYou: "dep array. drop `user` 😉",
    chatYouCode: "// just []",
    verify: [
      ["GitHub", "@aanya-i · 4y · 218 repos"],
      ["LinkedIn", "Backend Engineer · Razorpay"],
      ["Stack Overflow", "12,400 rep · top 5% Go"],
    ],
    stackHeads: ["you", "Aanya"],
    stackList: [
      ["Go", "Kubernetes", "Postgres", "Python"],
      ["Go", "Kubernetes", "Bangalore", "Rust"],
    ],
    footerCopy: "© 2026 Merge Me Labs",
    footerStatus: "all systems operational",
    footerLinks: ["Privacy", "Terms", "Status", "Changelog"],
    swipeMerge: "Merge", swipePass: "Pass",
    awaiting: "$ awaiting merge…",
  },
  hi: {
    navFeatures: "फ़ीचर्स", navHow: "कैसे काम करता है", navPricing: "प्राइसिंग", navDocs: "डॉक्स",
    signIn: "साइन इन", cta: "git init love", pill: "v1.0 · पब्लिक बीटा",
    h1a: "अपना परफेक्ट", h1em: "merge conflict", h1b: " ढूंढो।",
    lede: "मर्ज मी डेवलपर्स के लिए डेटिंग ऐप है। स्टैक पर मैच करो, कोड ब्लॉक में चैट करो, और साथ मिलकर कुछ असली शिप करो।",
    ctaHint: "क्रेडिट कार्ड नहीं", kbdHint: "या दबाएँ",
    trustStrong: "24,182 डेवलपर्स", trustRest: "1,400 कंपनियों से — और बढ़ रहे हैं।",
    eyebrow1: "हाल ही में main में मर्ज हुए",
    section1Title: ["असली ", "कहानियाँ", ", असली ", "स्टैक", "।"],
    section1Sub: "जो जोड़े सच में मिले — लैंग्वेज, फ्रेमवर्क, और जिन टाइमज़ोन्स में जागते हैं उन पर मैच करके।",
    galleryFoot: "1,247 में से 6 दिख रहे — ",
    galleryFootLink: "बाकी देखें →",
    eyebrow2: "क्यों चलता है",
    section2Title: ["स्लॉट मशीन नहीं — ", "डेवलपर टूल", " की तरह बना है।"],
    section2Sub: "तीन चीज़ें जो हमने सही कीं।",
    features: [
      { num: "01", titleA: "सेल्फी नहीं, ", titleEm: "स्टैक", titleB: " से मैच।",
        body: "लैंग्वेज, फ्रेमवर्क, टाइमज़ोन — आपका असली ओवरलैप ही क्यू तय करता है। प्रोफ़ाइल बताती है कि क्यों फिट हो।",
        viz: "stack" },
      { num: "02", titleA: "", titleEm: "कोड ब्लॉक", titleB: " में चैट करो।",
        body: "ट्रिपल-बैकटिक से स्निपेट डालो, बस हो गया। सिंटैक्स हाइलाइट, कॉपी बटन, बिना \"फिर से भेजो\"।",
        viz: "chat" },
      { num: "03", titleA: "असली डेवलपर्स, ", titleEm: "वेरिफ़ाइड", titleB: "।",
        body: "GitHub, GitLab या Bitbucket जोड़ो। हम देखते हैं कि असली में आपका है, और कभी आपकी तरफ़ से पोस्ट नहीं करते।",
        viz: "verify" },
    ],
    ctaStripPill: "git push origin you@love",
    ctaStripTitle: ["आपकी टीम आपके बिना ", "शिप", " कर रही है।"],
    ctaStripSub: "24,000+ डेवलपर्स पहले से मर्ज कर रहे हैं। एक साइन-अप दूर।",
    chatThem: "एक सेकंड? मेरा reducer दो बार चल रहा है",
    chatThemCode: "useEffect(() => fetch('/me'), [user]);",
    chatYou: "dep array. `user` हटा दो 😉",
    chatYouCode: "// बस []",
    verify: [
      ["GitHub", "@aanya-i · 4 साल · 218 repos"],
      ["LinkedIn", "बैकएंड इंजी. · Razorpay"],
      ["Stack Overflow", "12,400 rep · top 5% Go"],
    ],
    stackHeads: ["आप", "आन्या"],
    stackList: [
      ["Go", "Kubernetes", "Postgres", "Python"],
      ["Go", "Kubernetes", "बेंगलुरु", "Rust"],
    ],
    footerCopy: "© 2026 मर्ज मी लैब्स",
    footerStatus: "सब सिस्टम चालू",
    footerLinks: ["प्राइवेसी", "टर्म्स", "स्टेटस", "चेंजलॉग"],
    swipeMerge: "मर्ज", swipePass: "पास",
    awaiting: "$ awaiting merge…",
  },
};

// ─────────────────── icons ───────────────────
function Icon({ name, ...p }) {
  const common = { width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", ...p };
  switch (name) {
    case "x": return (<svg viewBox="0 0 24 24" {...common}><path d="M6 6l12 12M18 6L6 18"/></svg>);
    case "check": return (<svg viewBox="0 0 24 24" {...common}><path d="M4 12l5 5L20 6"/></svg>);
    case "arrow": return (<svg viewBox="0 0 24 24" {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>);
    case "star": return (<svg viewBox="0 0 24 24" {...common}><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 16.8 6.7 19.7l1.1-6.1L3.4 9.4l6-.8L12 3z"/></svg>);
    default: return null;
  }
}

// ─────────────────── Nav ───────────────────
function Nav({ c }) {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a className="brand" href="#">
          <span className="brand-mark">M</span>
          <span>Merge Me</span>
        </a>
        <div className="nav-links">
          <a href="#gallery">{c.navFeatures}</a>
          <a href="#how">{c.navHow}</a>
          <a href="#pricing">{c.navPricing}</a>
          <a href="#docs">{c.navDocs}</a>
        </div>
        <div className="nav-right">
          <span className="nav-status">main · last push 2m ago</span>
          <button className="btn btn-ghost">{c.signIn}</button>
          <button className="btn btn-primary"><code>{c.cta}</code></button>
        </div>
      </div>
    </nav>
  );
}

// ─────────────────── Swipe card ───────────────────
function SwipeCard({ data, isTop, depth, onSwipe, fireKey, lang, c }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState({ x: 0, dragging: false });
  const [outDir, setOutDir] = useState(null);
  const start = useRef({ x: 0, y: 0 });

  const onPointerDown = (e) => {
    if (!isTop || outDir) return;
    ref.current?.setPointerCapture?.(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, dragging: true });
  };
  const onPointerMove = (e) => {
    if (!drag.dragging) return;
    setDrag({ x: e.clientX - start.current.x, dragging: true });
  };
  const endDrag = () => {
    if (!drag.dragging) return;
    const threshold = 110;
    if (drag.x > threshold) { setOutDir("right"); setTimeout(() => onSwipe("right"), 380); }
    else if (drag.x < -threshold) { setOutDir("left"); setTimeout(() => onSwipe("left"), 380); }
    else { setDrag({ x: 0, dragging: false }); }
  };

  useEffect(() => {
    if (!fireKey || !isTop || outDir) return;
    if (fireKey.dir) {
      setOutDir(fireKey.dir);
      setTimeout(() => onSwipe(fireKey.dir), 380);
    }
  }, [fireKey]);

  let tx = 0, ty = 0, rot = 0, scale = 1, opacity = 1;
  if (isTop && outDir === "right") { tx = 600; rot = 18; opacity = 0; }
  else if (isTop && outDir === "left") { tx = -600; rot = -18; opacity = 0; }
  else if (isTop) { tx = drag.x; rot = drag.x * 0.04; }
  else {
    ty = depth * 14;
    scale = 1 - depth * 0.04;
    opacity = 1 - depth * 0.12;
  }
  const transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${scale})`;
  const stampMerge = isTop ? Math.max(0, drag.x / 120) : 0;
  const stampPass  = isTop ? Math.max(0, -drag.x / 120) : 0;

  return (
    <div
      ref={ref}
      className={"swipe-card" + (drag.dragging && !outDir ? " dragging" : "") + (outDir ? " swiping-out" : "")}
      style={{ transform, opacity, zIndex: isTop ? 5 : 5 - depth }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="swipe-photo">
        <img src={data.photo} alt={data.name[lang]} draggable="false" />
      </div>
      <div className="swipe-overlay">
        <div className="name-row">
          <h3>{data.name[lang]}</h3>
          <span className="age">{data.age}</span>
        </div>
        <div className="role">{data.role[lang]}</div>
        <div className="tags">
          {data.tags.map((t, i) => (
            <span key={i} className={"tag" + (data.shared.includes(i) ? " match" : "")}>{t}</span>
          ))}
        </div>
      </div>
      <span className="swipe-stamp stamp-merge" style={{ opacity: stampMerge }}>{c.swipeMerge}</span>
      <span className="swipe-stamp stamp-pass"  style={{ opacity: stampPass  }}>{c.swipePass}</span>
    </div>
  );
}

// ─────────────────── Hero ───────────────────
function Hero({ c, lang }) {
  const [idx, setIdx] = useState(0);
  const [fireKey, setFireKey] = useState(null);
  const [lastCommit, setLastCommit] = useState(null);

  const onSwipe = (dir) => {
    const cur = PROFILES[idx % PROFILES.length];
    if (dir === "right") setLastCommit({ msg: cur.commit, name: cur.name[lang] });
    setIdx((i) => i + 1);
  };
  const swipe = (dir) => setFireKey({ dir, n: Date.now() });

  const visible = [0, 1, 2].map((d) => {
    const i = (idx + d) % PROFILES.length;
    return { data: PROFILES[i], d, i };
  });

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="pill"><span className="dot"></span> {c.pill}</span>
          <h1>{c.h1a} <em>{c.h1em}</em>{c.h1b}</h1>
          <p className="lede">{c.lede}</p>
          <div className="hero-cta">
            <button className="btn btn-primary"><code>{c.cta}</code> <Icon name="arrow" /></button>
            <button className="btn btn-ghost">{c.navDocs}</button>
            <span className="hint">{c.kbdHint} <span className="kbd">⌘</span><span className="kbd">K</span></span>
          </div>
          <div className="hero-trust">
            <div className="trust-avatars" aria-hidden>
              <span style={{ backgroundImage: "url('photos/g8-1.png')" }}></span>
              <span style={{ backgroundImage: "url('photos/g8-2.png')" }}></span>
              <span style={{ backgroundImage: "url('photos/g8-3.png')" }}></span>
              <span style={{ backgroundImage: "url('photos/g8-7.png')" }}></span>
              <span style={{ backgroundImage: "url('photos/g8-8.png')" }}></span>
            </div>
            <div className="trust-meta">
              <b>{c.trustStrong}</b><br />{c.trustRest}
            </div>
          </div>
        </div>

        {/* Right: photo stack stage */}
        <div className="stack-stage">
          {/* decorative floating polaroids */}
          <div className="float-photo fp-1">
            <img src="photos/p-rust-girl-couple.png" alt="" />
            <div className="cap"><span>@ada × @theo</span><span>rust+ec</span></div>
          </div>
          <div className="float-photo fp-2">
            <img src="photos/g6-1.png" alt="" />
            <div className="cap"><span>@mei × @arjun</span><span>03/26</span></div>
          </div>
          <div className="float-photo fp-3">
            <img src="photos/g4a-1.png" alt="" />
            <div className="cap"><span>@sasha × @rohan</span><span>amsterdam</span></div>
          </div>
          <div className="float-photo fp-4">
            <img src="photos/p-night-market-couple.png" alt="" />
            <div className="cap"><span>@kenji × @liv</span><span>oslo</span></div>
          </div>

          {/* the swipe stack */}
          <div className="swipe-stack">
            {visible.slice().reverse().map((s) => (
              <SwipeCard
                key={`${s.i}-${idx}-${s.d}`}
                data={s.data}
                isTop={s.d === 0}
                depth={s.d}
                onSwipe={onSwipe}
                fireKey={s.d === 0 ? fireKey : null}
                lang={lang}
                c={c}
              />
            ))}
          </div>

          <div className="swipe-actions">
            <button className="action-btn pass" onClick={() => swipe("left")} aria-label={c.swipePass}>
              <Icon name="x" />
            </button>
            <span className="commit-tag">
              {lastCommit ? `$ git commit -m "${lastCommit.msg}"` : c.awaiting}
            </span>
            <button className="action-btn merge" onClick={() => swipe("right")} aria-label={c.swipeMerge}>
              <Icon name="check" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────── Couples gallery ───────────────────
function Gallery({ c, lang }) {
  return (
    <section className="section" id="gallery">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">{c.eyebrow1}</span>
            <h2 className="section-title">
              {c.section1Title[0]}<em>{c.section1Title[1]}</em>{c.section1Title[2]}<em>{c.section1Title[3]}</em>{c.section1Title[4]}
            </h2>
          </div>
          <p className="section-sub">{c.section1Sub}</p>
        </div>

        <div className="gallery">
          {COUPLES.map((p, i) => (
            <div className={"photo-card " + p.span} key={i}>
              <img src={p.photo} alt={p.who[lang]} />
              <span className="corner-tape">commit #{String(i + 1).padStart(4, "0")}</span>
              <div className="photo-caption">
                <div>
                  <div className="who">{p.who[lang]}</div>
                  <div className="meta">{p.meta}</div>
                </div>
                <div className="stamp">{p.stamp}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="gallery-foot">
          <span>{c.galleryFoot}<b><a href="#">{c.galleryFootLink}</a></b></span>
          <span>~/merge-me/main · 1,247 records</span>
        </div>
      </div>
    </section>
  );
}

// ─────────────────── Features ───────────────────
function FeatureViz({ kind, c }) {
  if (kind === "stack") {
    return (
      <div className="stack-viz">
        <div className="stack-col">
          <div className="h">{c.stackHeads[0]}</div>
          <ul>{c.stackList[0].map((t, i) => (
            <li key={i} className={c.stackList[1].includes(t) ? "shared" : ""}>{t}</li>
          ))}</ul>
        </div>
        <div className="stack-col">
          <div className="h">{c.stackHeads[1]}</div>
          <ul>{c.stackList[1].map((t, i) => (
            <li key={i} className={c.stackList[0].includes(t) ? "shared" : ""}>{t}</li>
          ))}</ul>
        </div>
      </div>
    );
  }
  if (kind === "chat") {
    return (
      <div className="chat-viz">
        <div className="msg them">{c.chatThem}<code className="codeblock">{c.chatThemCode}</code></div>
        <div className="msg you">{c.chatYou}<code className="codeblock">{c.chatYouCode}</code></div>
      </div>
    );
  }
  if (kind === "verify") {
    return (
      <div className="verify-viz">
        {c.verify.map(([k, v], i) => (
          <div className="verify-row" key={i}>
            <span className="ok">✓</span><b>{k}</b><span className="meta">{v}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function Features({ c }) {
  return (
    <section className="section" id="how" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">{c.eyebrow2}</span>
            <h2 className="section-title">
              {c.section2Title[0]}<em>{c.section2Title[1]}</em>{c.section2Title[2]}
            </h2>
          </div>
          <p className="section-sub">{c.section2Sub}</p>
        </div>
        <div className="features">
          {c.features.map((f, i) => (
            <div className="feature" key={i}>
              <span className="num">{f.num}</span>
              <h4>{f.titleA}<em>{f.titleEm}</em>{f.titleB}</h4>
              <p>{f.body}</p>
              <div className="feature-viz"><FeatureViz kind={f.viz} c={c} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────── Big CTA strip ───────────────────
function CtaStrip({ c }) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="cta-strip">
          <div className="cta-bg">
            <img src="photos/hero-crew.png" alt="" />
          </div>
          <div className="cta-strip-inner">
            <span className="pill"><span className="dot"></span> {c.ctaStripPill}</span>
            <h2>
              {c.ctaStripTitle[0]}<em>{c.ctaStripTitle[1]}</em>{c.ctaStripTitle[2]}
            </h2>
            <p>{c.ctaStripSub}</p>
            <div className="hero-cta">
              <button className="btn btn-primary"><code>{c.cta}</code> <Icon name="arrow" /></button>
              <button className="btn btn-ghost">{c.navDocs}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────── Footer ───────────────────
function Footer({ c }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-meta">
          <span className="brand-mark" style={{ width: 22, height: 22, borderRadius: 6, fontSize: 12 }}>M</span>
          <span>{c.footerCopy}</span>
          <span className="ok">● {c.footerStatus}</span>
        </div>
        <div className="footer-links">
          {c.footerLinks.map((l, i) => (<a key={i} href="#">{l}</a>))}
        </div>
      </div>
    </footer>
  );
}

// ─────────────────── App ───────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.dark ? "dark" : "light");
    document.documentElement.setAttribute("data-lang", t.lang);
    document.documentElement.lang = t.lang === "hi" ? "hi" : "en";
  }, [t.dark, t.lang]);

  const c = COPY[t.lang] || COPY.en;

  return (
    <>
      <Nav c={c} />
      <Hero c={c} lang={t.lang} />
      <Gallery c={c} lang={t.lang} />
      <Features c={c} />
      <CtaStrip c={c} />
      <Footer c={c} />

      <TweaksPanel>
        <TweakSection label="Display" />
        <TweakRadio
          label="Language"
          value={t.lang}
          options={[{ value: "en", label: "English" }, { value: "hi", label: "हिंदी" }]}
          onChange={(v) => setTweak("lang", v)}
        />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
