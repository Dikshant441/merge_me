// Stack tab — left card lists each skill with a gradient years-of-experience
// bar; right card has a static insight paragraph. Years/percent are derived
// per-index for now (no real data on the backend yet).

const YEARS_BY_INDEX = [7, 5, 4, 3, 2, 1, 4];
const PCT_BY_INDEX = [92, 84, 78, 64, 58, 44, 70];

const Stack = ({ user, copy }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5 items-start">
      <Section title={copy.app.profile.stackDetailed}>
        <div className="flex flex-col gap-3.5">
          {(user.skills || []).map((s, i) => (
            <div
              key={s}
              className="grid grid-cols-[120px_1fr_60px] items-center gap-3"
            >
              <span className="font-mono font-medium text-[13px]">{s}</span>
              <div className="h-1.5 bg-mm-paper border border-mm-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: (PCT_BY_INDEX[i] ?? 60) + "%",
                    background:
                      "linear-gradient(90deg, var(--mm-coral-2), var(--mm-coral), var(--mm-amber))",
                  }}
                />
              </div>
              <span className="font-mono font-medium text-[12px] text-mm-ink-3 text-right">
                {YEARS_BY_INDEX[i] ?? 2}y
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title={copy.app.profile.howOthersSee}>
        <p className="m-0 text-mm-ink-2 text-[13.5px] leading-[1.55]">
          Your stack overlaps with <b className="text-mm-ink font-semibold">78%</b> of profiles in
          your radius. Strongest matches share{" "}
          <b className="text-mm-ink font-semibold">Go</b>,{" "}
          <b className="text-mm-ink font-semibold">Kubernetes</b>, and{" "}
          <b className="text-mm-ink font-semibold">Postgres</b>. Consider adding 2 more skills to
          broaden reach without diluting quality.
        </p>
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-mm-surface border border-mm-border rounded-[16px] p-[22px] shadow-[var(--mm-shadow-soft)]">
    <h3 className="m-0 mb-3 font-semibold text-[15px] tracking-[-0.01em]">{title}</h3>
    {children}
  </div>
);

export default Stack;
