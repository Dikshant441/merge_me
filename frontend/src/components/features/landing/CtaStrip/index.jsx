import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";

const CtaStrip = ({ copy }) => {
  const navigate = useNavigate();

  return (
    <section className="pb-20 relative">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 relative z-[1]">
        <div className="relative overflow-hidden rounded-3xl isolate min-h-[360px] flex items-center mt-10">
          <div className="absolute inset-0 -z-[1] mm-cta-overlay">
            <img
              src="/landing/hero-crew.png"
              alt=""
              loading="lazy"
              className="w-full h-full object-cover object-[center_35%]"
            />
          </div>
          <div className="relative px-5 py-12 sm:px-14 max-w-[720px] text-white">
            <span className="inline-flex items-center gap-2 h-[30px] pl-2.5 pr-3 border border-white/20 bg-white/10 rounded-full font-mono font-medium text-xs text-white/85 whitespace-nowrap">
              <span className="mm-pulse-dot w-[7px] h-[7px] rounded-full" />
              {copy.ctaStripPill}
            </span>
            <h2 className="font-sans font-semibold tracking-[-0.025em] leading-[1.05] my-4 text-balance text-[clamp(28px,3.6vw,48px)] text-white">
              {copy.ctaStripTitle[0]}
              <em className="not-italic">
                <span className="font-serif italic font-normal text-[oklch(0.86_0.14_60)]">
                  {copy.ctaStripTitle[1]}
                </span>
              </em>
              {copy.ctaStripTitle[2]}
            </h2>
            <p className="text-base text-white/80 m-0 mb-6 max-w-[460px] text-pretty">
              {copy.ctaStripSub}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="h-11 px-[18px] rounded-[12px] bg-white text-[#1C160E] inline-flex items-center gap-2 text-sm font-medium shadow-[0_1px_0_rgba(255,255,255,.6)_inset,0_6px_18px_rgba(0,0,0,.3)] hover:-translate-y-px transition"
              >
                <code className="font-mono font-medium text-[13px]">{copy.cta}</code>
                <ArrowRight size={16} strokeWidth={1.7} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaStrip;
