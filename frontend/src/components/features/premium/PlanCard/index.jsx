import { Check, X as XIcon, Clock, GitMerge, Star } from "lucide-react";

// One pricing tier card. The popular variant gets a coral border + glow
// ring, gradient price text, and the dark-ink CTA; others render ghost.

const FeatIcon = ({ kind }) => {
  if (kind === "yes") return <Check size={14} strokeWidth={1.7} />;
  if (kind === "no") return <XIcon size={14} strokeWidth={1.7} />;
  return <Clock size={14} strokeWidth={1.7} />;
};

const PlanCard = ({ plan, annual, copy, onBuy }) => {
  const isFree = plan.id === "free";
  const isPro = plan.id === "pro";
  const isTeam = plan.id === "team";
  const popular = plan.popular;
  const price = annual ? plan.priceYr : plan.priceMo;

  const cta = isFree ? copy.app.premium.ctaFree : isPro ? copy.app.premium.ctaPro : copy.app.premium.ctaTeam;

  return (
    <div
      className={[
        "relative flex flex-col gap-[18px] p-6 rounded-[20px] bg-mm-surface border shadow-[var(--mm-shadow-soft)]",
        popular
          ? "border-mm-coral shadow-[var(--mm-shadow-card),0_0_0_4px_oklch(from_var(--mm-coral)_l_c_h_/_.14)] bg-[linear-gradient(180deg,var(--mm-surface)_0%,oklch(from_var(--mm-coral)_0.97_0.04_h)_100%)] dark:bg-[linear-gradient(180deg,var(--mm-surface)_0%,oklch(from_var(--mm-coral)_0.30_0.10_h_/_.25)_100%)]"
          : "border-mm-border",
      ].join(" ")}
    >
      {popular && (
        <span className="absolute -top-2.5 right-[18px] inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-mm-ink text-mm-bg font-mono font-medium text-[11px] shadow-[0_1px_0_rgba(255,255,255,.14)_inset,0_4px_10px_rgba(0,0,0,.16)]">
          <Star size={11} strokeWidth={2} fill="currentColor" /> {copy.app.premium.mostPopular}
        </span>
      )}

      <div>
        <div className="font-semibold text-[18px] tracking-[-0.01em]">{plan.name}</div>
        <p className="m-0 mt-1 text-mm-ink-3 text-[13px] leading-[1.45] min-h-[36px]">
          {plan.blurb}
        </p>
      </div>

      <div>
        <div className="flex items-baseline gap-1.5">
          <span
            className={[
              "font-semibold text-[38px] leading-none tracking-[-0.03em]",
              popular ? "mm-grad-text" : "",
            ].join(" ")}
          >
            {isFree ? "$0" : "$" + price}
          </span>
          <span className="font-mono font-medium text-[13px] text-mm-ink-3">
            {copy.app.premium.perMonth}
          </span>
        </div>
        <div className="font-mono font-medium text-[11.5px] text-mm-ink-4 mt-0.5">
          {isFree
            ? "—"
            : annual
            ? copy.app.premium.perMonthAnnual
            : copy.app.premium.perMonthBilled}
        </div>
      </div>

      <button
        type="button"
        disabled={isFree}
        onClick={() => !isFree && onBuy?.(plan.sku)}
        className={[
          "h-11 w-full rounded-[12px] font-medium text-[13px] inline-flex items-center justify-center gap-2 transition",
          popular
            ? "bg-mm-ink text-mm-bg border border-transparent shadow-[0_1px_0_rgba(255,255,255,.14)_inset,0_8px_18px_-8px_rgba(0,0,0,.32)] hover:-translate-y-px"
            : "bg-mm-paper text-mm-ink border border-mm-border-2 hover:-translate-y-px",
          isFree ? "opacity-60 cursor-not-allowed hover:translate-y-0" : "",
        ].join(" ")}
      >
        {isFree && <Check size={14} strokeWidth={1.7} />}
        {isPro && <code className="font-mono font-medium text-[12.5px]">{cta}</code>}
        {isTeam && (
          <>
            <GitMerge size={14} strokeWidth={1.7} /> {cta}
          </>
        )}
        {isFree && cta}
      </button>

      <div className="flex flex-col gap-2.5 pt-1 mt-1 border-t border-mm-border">
        {plan.features.map(([state, label], i) => {
          const iconColor =
            state === "yes"
              ? "text-mm-success"
              : state === "limited"
              ? "text-mm-amber"
              : "text-mm-ink-4";
          return (
            <div
              key={i}
              className={[
                "grid grid-cols-[18px_1fr_auto] gap-2.5 items-center pt-2.5 text-[13px] font-medium",
                state === "no" ? "text-mm-ink-4" : "text-mm-ink-2",
              ].join(" ")}
            >
              <span className={iconColor}>
                <FeatIcon kind={state} />
              </span>
              <span>{label}</span>
              {state === "limited" && (
                <span className="font-mono font-medium text-[10px] px-1.5 py-0.5 rounded-[5px] bg-mm-paper border border-mm-border text-mm-ink-3 uppercase tracking-[.04em]">
                  limited
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanCard;
