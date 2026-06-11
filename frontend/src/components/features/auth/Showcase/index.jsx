import { useEffect } from "react";

// Left panel on /login + /signup — testimonial photo, quote, paginator dots.
// Pre-loads the next photo so flipping the dots is instant.
const Showcase = ({ copy, idx, setIdx }) => {
  const stories = copy.auth.showcase;
  const item = stories[idx % stories.length];

  useEffect(() => {
    const next = stories[(idx + 1) % stories.length];
    const im = new Image();
    im.src = next.photo;
  }, [idx, stories]);

  return (
    <aside className="mm-showcase-overlay relative rounded-3xl overflow-hidden min-h-[560px] bg-mm-paper shadow-[var(--mm-shadow-photo)]">
      <img
        src={item.photo}
        alt={item.who}
        className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        style={{ zIndex: 0 }}
      />

      <div className="absolute top-9 right-9 flex flex-col gap-2 items-end z-[2] max-[980px]:hidden">
        {item.tags.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1.5 rounded-full text-white font-mono font-medium text-[11.5px] leading-none bg-white/15 border border-white/30 backdrop-blur"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="relative z-[2] h-full p-9 flex flex-col justify-between text-white min-h-[560px]">
        <div>
          <span className="inline-flex items-center gap-2 h-[30px] pl-2.5 pr-3 rounded-full bg-white/15 border border-white/25 backdrop-blur font-mono font-medium text-xs text-white">
            <span className="w-[7px] h-[7px] rounded-full mm-pulse-dot" />
            {copy.auth.livePill}
          </span>
        </div>

        <div>
          <p className="font-sans font-medium tracking-[-0.02em] leading-[1.22] text-[clamp(22px,2.2vw,30px)] max-w-[440px] text-balance [text-shadow:0_2px_16px_rgba(0,0,0,0.35)]">
            “{item.quote[0]}
            <em className="not-italic font-serif italic font-normal text-[1.08em] text-[oklch(0.92_0.10_60)]">
              {item.quote[1]}
            </em>
            {item.quote[2]}”
          </p>

          <div className="mt-5 flex items-center gap-3 font-mono font-medium text-[13px] text-white/85">
            <span
              aria-hidden
              className="w-8 h-8 rounded-full border-2 border-white/80 bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url(${item.avatar})` }}
            />
            <span>
              <span className="text-white font-medium">{item.who}</span>
              <span className="mx-2">·</span>
              <span className="text-white/70">{item.meta}</span>
            </span>
          </div>

          <div role="tablist" className="mt-4 flex gap-1.5">
            {stories.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={`Story ${i + 1}`}
                onClick={() => setIdx(i)}
                className={[
                  "h-1 rounded-full transition-all",
                  i === idx ? "w-[30px] bg-white" : "w-[22px] bg-white/30 hover:bg-white/60",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Showcase;
