import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, X, Check } from "lucide-react";
import SwipeCard from "../SwipeCard";
import { FLOATING_POLAROIDS, PROFILES, TRUST_AVATARS } from "../data";

const Hero = ({ copy, locale }) => {
  const navigate = useNavigate();

  // Index into PROFILES — bumped on each swipe so the next card comes up.
  const [idx, setIdx] = useState(0);
  // Bumped by the action buttons to fire a synthetic drag on the top card.
  const [fireKey, setFireKey] = useState(null);
  // Right-swipe records the commit message — shown in the action bar.
  const [lastCommit, setLastCommit] = useState(null);

  const handleSwipe = (dir) => {
    const current = PROFILES[idx % PROFILES.length];
    if (dir === "right") {
      setLastCommit({ msg: current.commit, name: current.name[locale] });
    }
    setIdx((n) => n + 1);
    // Clear the synthetic-swipe trigger — otherwise the next top card
    // remounts with fireKey still set and immediately swipes again,
    // cascading through the stack.
    setFireKey(null);
  };

  const visibleCards = [0, 1, 2].map((d) => ({
    data: PROFILES[(idx + d) % PROFILES.length],
    depth: d,
    keyIdx: (idx + d) % PROFILES.length,
  }));

  return (
    <section className="relative pt-8 pb-20 min-h-[720px]">
      <div className="max-w-[1280px] mx-auto px-7 relative z-[1]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-14 items-center pt-6">
          {/* Left column — type + CTAs */}
          <div>
            <h1 className="font-sans font-semibold tracking-[-0.035em] leading-[0.98] mt-2 mb-[22px] text-balance text-[clamp(44px,5.6vw,84px)]">
              {copy.h1a}
              <em className="not-italic">
                <span className="font-serif italic font-normal mm-grad-text text-[1.08em] tracking-[-0.01em] px-[0.04em]">
                  {copy.h1em}
                </span>
              </em>
              {copy.h1b}
            </h1>

            <p className="text-[19px] leading-[1.55] text-mm-ink-2 max-w-[460px] mb-[30px] text-pretty">
              {copy.lede}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="h-11 px-[18px] rounded-[12px] bg-mm-ink text-mm-bg inline-flex items-center gap-2 text-sm font-medium shadow-[0_1px_0_rgba(255,255,255,.16)_inset,0_1px_2px_rgba(0,0,0,.18)] hover:-translate-y-px transition"
              >
                <code className="font-mono font-medium text-[13px]">{copy.cta}</code>
                <ArrowRight size={16} strokeWidth={1.7} />
              </button>
            </div>

            <div className="mt-12 pt-[22px] border-t border-mm-border flex items-center gap-[18px]">
              <div className="inline-flex">
                {TRUST_AVATARS.map((src, i) => (
                  <span
                    key={src}
                    aria-hidden
                    className="w-8 h-8 rounded-full border-2 border-mm-bg bg-cover bg-center shadow-[0_2px_4px_rgba(0,0,0,.12)]"
                    style={{
                      backgroundImage: `url(${src})`,
                      marginLeft: i === 0 ? 0 : -10,
                    }}
                  />
                ))}
              </div>
              <div className="text-sm text-mm-ink-2 leading-[1.4]">
                <b className="text-mm-ink font-semibold">{copy.trustStrong}</b>
                <br />
                {copy.trustRest}
              </div>
            </div>
          </div>

          {/* Right column — photo stack stage */}
          <div className="relative w-full aspect-[1/1.08] max-w-[600px] ml-auto">
            {FLOATING_POLAROIDS.map((p, i) => (
              <div
                key={i}
                className={[
                  "absolute bg-mm-paper p-2 pb-[30px] rounded-[4px]",
                  "shadow-[var(--mm-shadow-photo)] transition-transform duration-300",
                  "max-[1100px]:hidden",
                  p.className,
                ].join(" ")}
              >
                <img
                  src={p.photo}
                  alt=""
                  className="w-full h-full object-cover object-[center_25%] rounded-[2px] block"
                />
                <div className="absolute bottom-2 left-3 right-3 flex justify-between font-mono font-medium text-[10px] leading-[1.2] text-mm-ink-3 lowercase">
                  <span>{p.caption[0]}</span>
                  <span>{p.caption[1]}</span>
                </div>
              </div>
            ))}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] aspect-[3/4] z-[5]">
              {visibleCards
                .slice()
                .reverse()
                .map((c) => (
                  <SwipeCard
                    key={`${c.keyIdx}-${idx}-${c.depth}`}
                    data={c.data}
                    isTop={c.depth === 0}
                    depth={c.depth}
                    onSwipe={handleSwipe}
                    fireKey={c.depth === 0 ? fireKey : null}
                    locale={locale}
                    copy={copy}
                  />
                ))}
            </div>

            <div className="absolute left-1/2 bottom-2 -translate-x-1/2 flex items-center gap-3.5 bg-mm-surface border border-mm-border-2 rounded-full px-3 py-2 shadow-[var(--mm-shadow-soft)] z-[6]">
              <button
                type="button"
                onClick={() => setFireKey({ dir: "left", n: Date.now() })}
                aria-label={copy.swipePass}
                className="w-11 h-11 rounded-full border border-mm-border bg-mm-paper text-mm-ink-2 inline-flex items-center justify-center hover:-translate-y-px hover:text-mm-danger hover:border-mm-danger transition"
              >
                <X size={18} strokeWidth={1.7} />
              </button>
              <span className="font-mono font-medium text-[11.5px] leading-none text-mm-ink-3 px-1.5 max-w-[240px] truncate">
                {lastCommit ? `$ git commit -m "${lastCommit.msg}"` : copy.awaiting}
              </span>
              <button
                type="button"
                onClick={() => setFireKey({ dir: "right", n: Date.now() })}
                aria-label={copy.swipeMerge}
                className="w-11 h-11 rounded-full border border-mm-border bg-mm-paper text-mm-ink-2 inline-flex items-center justify-center hover:-translate-y-px hover:text-mm-success hover:border-mm-success transition"
              >
                <Check size={18} strokeWidth={1.7} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
