import { GitMerge, MapPin, Clock, Github, ShieldCheck } from "lucide-react";

// Right-rail on Feed — "why we surfaced this profile" + daily Quota.
// `extras` carries display-only fields (shared, distance, repos, years, online).

const FeedRail = ({ user, extras, used, total, copy }) => {
  if (!user) return null;
  const sharedSet = new Set(extras.shared || []);
  const sharedCount = (user.skills || []).filter((s) => sharedSet.has(s)).length;
  const pct = Math.min(100, Math.round((used / total) * 100));

  return (
    <div className="flex flex-col gap-4">
      <RailCard>
        <h3 className="m-0 mb-3 font-semibold text-[14px] tracking-[-0.01em]">
          {copy.app.feed.whyTitle}
        </h3>

        <Row icon={GitMerge} label={copy.app.feed.whyShared}>
          <span className="font-mono font-medium text-[13px] text-mm-ink">
            <b className="font-semibold">{sharedCount}</b> / {user.skills?.length || 0}
          </span>
        </Row>

        {user.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {user.skills.map((s) => {
              const match = sharedSet.has(s);
              return (
                <span
                  key={s}
                  className={[
                    "font-mono font-medium text-[11px] px-2 py-[5px] rounded-md border",
                    match ? "mm-chip-shared" : "bg-mm-paper border-mm-border text-mm-ink-3",
                  ].join(" ")}
                >
                  {s}
                </span>
              );
            })}
          </div>
        )}

        <Row icon={MapPin} label={copy.app.feed.whyDistance} className="mt-1">
          <span className="font-mono font-medium text-[13px] text-mm-ink">
            {(extras.distance || 0).toLocaleString()} km
          </span>
        </Row>
        <Row icon={Clock} label={copy.app.feed.whyTimezone}>
          <span className="font-mono font-medium text-[13px] text-mm-ink">±3h</span>
        </Row>
        <Row icon={Github} label={copy.app.feed.whyRepos}>
          <span className="font-mono font-medium text-[13px] text-mm-ink">
            {extras.repos || 0} · {extras.years || 0}y
          </span>
        </Row>
        <Row icon={ShieldCheck} label={copy.app.feed.whyVerified}>
          <span className="font-mono font-medium text-[13px] text-mm-success">✓ GitHub</span>
        </Row>
      </RailCard>

      <RailCard>
        <h3 className="m-0 mb-3 font-semibold text-[14px] tracking-[-0.01em]">
          {copy.app.feed.quota}
        </h3>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono font-medium text-[11.5px] text-mm-ink-3">
            <span>{copy.app.feed.todayUsed}</span>
            <span>
              {used} / {total}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-mm-paper border border-mm-border overflow-hidden">
            <span
              className="block h-full rounded-full"
              style={{
                width: pct + "%",
                background:
                  "linear-gradient(90deg, var(--mm-coral-2), var(--mm-coral), var(--mm-amber))",
              }}
            />
          </div>
          <div className="flex justify-between font-mono font-medium text-[11.5px] text-mm-ink-2">
            <span>
              {Math.max(0, total - used)}
              {copy.app.feed.todayLeft}
            </span>
          </div>
        </div>
      </RailCard>
    </div>
  );
};

const RailCard = ({ children }) => (
  <div className="bg-mm-surface border border-mm-border rounded-[16px] p-[18px] shadow-[var(--mm-shadow-soft)]">
    {children}
  </div>
);

const Row = ({ icon: Icon, label, children, className = "" }) => (
  <div
    className={[
      "flex items-center justify-between py-2 text-[13px] text-mm-ink-2",
      "border-t border-mm-border first:border-t-0",
      className,
    ].join(" ")}
  >
    <span className="inline-flex items-center gap-2 text-mm-ink-3 font-medium">
      <Icon size={14} strokeWidth={1.7} />
      {label}
    </span>
    {children}
  </div>
);

export default FeedRail;
