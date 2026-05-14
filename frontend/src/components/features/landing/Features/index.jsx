const TINTS = ["mm-tint-coral", "mm-tint-amber", "mm-tint-violet"];

const StackViz = ({ copy }) => (
  <div className="grid grid-cols-2 gap-1.5 font-mono font-medium text-[11px] leading-none">
    {[0, 1].map((col) => (
      <div key={col} className="bg-mm-paper border border-mm-border rounded-[10px] p-3">
        <div className="text-mm-ink-3 text-[10px] tracking-[0.08em] uppercase mb-2">
          {copy.stackHeads[col]}
        </div>
        <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
          {copy.stackList[col].map((t) => {
            const isShared = copy.stackList[col === 0 ? 1 : 0].includes(t);
            return (
              <li
                key={t}
                className={[
                  "flex items-center gap-1.5 leading-[1.2] before:text-[9px]",
                  isShared
                    ? "text-mm-coral-2 before:content-['●'] before:text-mm-coral"
                    : "text-mm-ink-2 before:content-['○'] before:text-mm-ink-4",
                ].join(" ")}
              >
                {t}
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </div>
);

const ChatViz = ({ copy }) => (
  <div className="flex flex-col gap-2 font-mono text-xs">
    <div className="self-start max-w-[88%] px-3 py-2.5 rounded-[10px] leading-[1.5] bg-mm-paper border border-mm-border text-mm-ink">
      {copy.chatThem}
      <code className="block mt-1.5 px-2 py-1.5 rounded-md text-[11px] leading-[1.5] bg-mm-bg border border-mm-border text-mm-coral-2">
        {copy.chatThemCode}
      </code>
    </div>
    <div className="self-end max-w-[88%] px-3 py-2.5 rounded-[10px] leading-[1.5] bg-mm-ink text-mm-bg">
      {copy.chatYou}
      <code className="block mt-1.5 px-2 py-1.5 rounded-md text-[11px] leading-[1.5] bg-white/10 text-[oklch(0.86_0.10_75)]">
        {copy.chatYouCode}
      </code>
    </div>
  </div>
);

const VerifyViz = ({ copy }) => (
  <div className="flex flex-col gap-2 font-mono text-xs">
    {copy.verify.map(([k, v]) => (
      <div
        key={k}
        className="flex items-center gap-2 px-3 py-2.5 bg-mm-paper border border-mm-border rounded-[10px] text-mm-ink-2"
      >
        <span className="text-mm-success font-semibold">✓</span>
        <b className="text-mm-ink font-medium min-w-[80px]">{k}</b>
        <span className="text-mm-ink-3 ml-auto">{v}</span>
      </div>
    ))}
  </div>
);

const Viz = ({ kind, copy }) => {
  if (kind === "stack") return <StackViz copy={copy} />;
  if (kind === "chat") return <ChatViz copy={copy} />;
  if (kind === "verify") return <VerifyViz copy={copy} />;
  return null;
};

const Features = ({ copy }) => {
  return (
    <section id="how" className="pb-20 relative">
      <div className="max-w-[1280px] mx-auto px-7 relative z-[1]">
        <div className="flex items-end justify-between gap-6 mb-11 max-[720px]:flex-col max-[720px]:items-start">
          <div>
            <span className="mm-eyebrow inline-flex items-center gap-2 font-mono font-medium text-xs uppercase tracking-[0.10em] text-mm-coral-2">
              {copy.eyebrow2}
            </span>
            <h2 className="font-sans font-semibold tracking-[-0.025em] leading-[1.05] mt-3 max-w-[640px] text-balance text-[clamp(28px,3.4vw,44px)]">
              {copy.section2Title[0]}
              <em className="not-italic">
                <span className="font-serif italic font-normal mm-grad-text text-[1.08em]">
                  {copy.section2Title[1]}
                </span>
              </em>
              {copy.section2Title[2]}
            </h2>
          </div>
          <p className="text-mm-ink-2 text-base max-w-[360px] m-0 text-right max-[720px]:text-left text-pretty">
            {copy.section2Sub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr] gap-6 mt-2">
          {copy.features.map((f, i) => (
            <div
              key={f.num}
              className={[
                "mm-feature flex flex-col gap-5 min-h-[380px] p-7",
                "bg-mm-surface border border-mm-border rounded-[20px]",
                "shadow-[var(--mm-shadow-soft)]",
                TINTS[i],
              ].join(" ")}
            >
              <span className="font-mono font-medium text-xs leading-none text-mm-coral tracking-[.08em]">
                {f.num}
              </span>
              <h4 className="m-0 font-sans font-semibold text-[22px] leading-[1.18] tracking-[-0.02em]">
                {f.titleA}
                <em className="not-italic">
                  <span className="font-serif italic font-normal mm-grad-text">
                    {f.titleEm}
                  </span>
                </em>
                {f.titleB}
              </h4>
              <p className="m-0 text-mm-ink-2 text-sm leading-[1.55]">{f.body}</p>
              <div className="mt-auto">
                <Viz kind={f.viz} copy={copy} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
