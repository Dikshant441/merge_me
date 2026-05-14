import { COUPLES } from "../data";

const Gallery = ({ copy, locale }) => {
  return (
    <section id="gallery" className="py-20 relative">
      <div className="max-w-[1280px] mx-auto px-7 relative z-[1]">
        <div className="flex items-end justify-between gap-6 mb-11 max-[720px]:flex-col max-[720px]:items-start">
          <div>
            <span className="mm-eyebrow inline-flex items-center gap-2 font-mono font-medium text-xs uppercase tracking-[0.10em] text-mm-coral-2">
              {copy.eyebrow1}
            </span>
            <h2 className="font-sans font-semibold tracking-[-0.025em] leading-[1.05] mt-3 max-w-[640px] text-balance text-[clamp(28px,3.4vw,44px)]">
              {copy.section1Title[0]}
              <em className="not-italic">
                <span className="font-serif italic font-normal mm-grad-text text-[1.08em]">
                  {copy.section1Title[1]}
                </span>
              </em>
              {copy.section1Title[2]}
              <em className="not-italic">
                <span className="font-serif italic font-normal mm-grad-text text-[1.08em]">
                  {copy.section1Title[3]}
                </span>
              </em>
              {copy.section1Title[4]}
            </h2>
          </div>
          <p className="text-mm-ink-2 text-base max-w-[360px] m-0 text-right max-[720px]:text-left text-pretty">
            {copy.section1Sub}
          </p>
        </div>

        <div className="mm-gallery">
          {COUPLES.map((p, i) => (
            <div
              key={p.photo}
              className={[
                "relative overflow-hidden rounded-[14px] bg-mm-paper border border-mm-border",
                "shadow-[var(--mm-shadow-photo)] mm-photo-fade",
                p.span,
              ].join(" ")}
            >
              <img
                src={p.photo}
                alt={p.who[locale]}
                loading="lazy"
                className="w-full h-full object-cover object-[center_25%]"
              />
              <span className="absolute top-2.5 left-2.5 font-mono font-medium text-[10px] leading-none text-white px-[7px] py-[5px] rounded-[5px] bg-white/[.16] border border-white/[.30] backdrop-blur-[8px] z-[2]">
                commit #{String(i + 1).padStart(4, "0")}
              </span>
              <div className="absolute left-3.5 right-3.5 bottom-3 text-white z-[1] flex items-end justify-between gap-2.5">
                <div>
                  <div className="font-sans font-semibold text-sm leading-[1.2] tracking-[-0.01em]">
                    {p.who[locale]}
                  </div>
                  <div className="font-mono font-medium text-[10.5px] leading-[1.4] opacity-85 lowercase">
                    {p.meta}
                  </div>
                </div>
                <div className="font-mono font-medium text-[10px] leading-none text-white px-[7px] py-[5px] rounded-[5px] bg-white/[.18] border border-white/[.3] backdrop-blur-[6px] whitespace-nowrap">
                  {p.stamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between font-mono font-medium text-xs text-mm-ink-3">
          <span>
            {copy.galleryFoot}
            <b className="text-mm-ink-2 font-medium">
              <a href="#">{copy.galleryFootLink}</a>
            </b>
          </span>
          <span>{copy.galleryFootMeta}</span>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
