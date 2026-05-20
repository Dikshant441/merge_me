import { useState } from "react";
import { PREMIUM_FAQ } from "../data";

// 5-question FAQ accordion. First item open by default. Chevron rotates 90°
// and goes coral on open. Answer slides max-height from 0 → 200px.

const FaqAccordion = () => {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div>
      {PREMIUM_FAQ.map((f, i) => {
        const open = openIdx === i;
        return (
          <div
            key={i}
            className={[
              "py-3.5 border-b border-mm-border last:border-b-0 last:pb-1",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(open ? -1 : i)}
              className="w-full bg-transparent border-0 text-left flex items-center justify-between gap-3 font-semibold text-[14px] text-mm-ink p-0"
            >
              <span>{f.q}</span>
              <span
                className={[
                  "font-mono text-[12px] transition-transform duration-200",
                  open ? "rotate-90 text-mm-coral" : "text-mm-ink-3",
                ].join(" ")}
              >
                →
              </span>
            </button>
            <p
              className={[
                "m-0 mt-2.5 text-mm-ink-2 text-[13.5px] leading-[1.55] overflow-hidden transition-[max-height] duration-300",
                open ? "max-h-[200px]" : "max-h-0",
              ].join(" ")}
            >
              {f.a}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
