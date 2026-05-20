// 36×36 SVG ring with a coral→amber gradient stroke. The center shows the
// number; the pill that wraps it carries a small two-line label.

const R = 14;
const C = 2 * Math.PI * R;

const CompletenessRing = ({ pct, label, sub }) => {
  return (
    <div className="inline-flex items-center gap-2.5 pl-2 pr-3 py-2 bg-mm-surface border border-mm-border rounded-full shadow-[var(--mm-shadow-soft)]">
      <div className="relative w-9 h-9">
        <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
          <defs>
            <linearGradient id="mm-ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--mm-coral-2)" />
              <stop offset="50%" stopColor="var(--mm-coral)" />
              <stop offset="100%" stopColor="var(--mm-amber)" />
            </linearGradient>
          </defs>
          <circle cx="18" cy="18" r={R} fill="none" stroke="var(--mm-paper-2)" strokeWidth="4" />
          <circle
            cx="18"
            cy="18"
            r={R}
            fill="none"
            stroke="url(#mm-ring-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * C} ${C}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-[10.5px] text-mm-ink">
          {pct}
        </div>
      </div>
      <div className="text-[12px] text-mm-ink-2 leading-[1.2]">
        <b className="text-mm-ink font-semibold">{label}</b>
        <br />
        <span className="text-mm-ink-3 text-[11px]">{sub}</span>
      </div>
    </div>
  );
};

export default CompletenessRing;
