import { useState } from "react";
import { GitMerge, MapPin, User as UserIcon } from "lucide-react";

// Settings tab — Preferences (segmented + read-only values) on the left,
// Danger zone (3 rows: pause / export / delete) on the right.

const Settings = ({ user, copy }) => {
  const prefs = user.prefs || {};
  const [looking, setLooking] = useState(prefs.looking || "long-running");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      <Section title={copy.app.profile.sectionPrefs}>
        <PrefRow icon={GitMerge} label={copy.app.profile.lookingFor}>
          <div className="inline-flex p-[3px] gap-0.5 bg-mm-paper border border-mm-border rounded-full">
            {copy.app.profile.lookingOptions.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setLooking(o)}
                className={[
                  "px-2.5 py-1 font-mono font-medium text-[11.5px] rounded-full transition",
                  looking === o
                    ? "bg-mm-ink text-mm-bg"
                    : "bg-transparent text-mm-ink-3 hover:text-mm-ink",
                ].join(" ")}
              >
                {o}
              </button>
            ))}
          </div>
        </PrefRow>
        <PrefRow icon={MapPin} label={copy.app.profile.distance}>
          <span className="font-mono font-medium text-[13px] text-mm-ink">
            {prefs.distance || 200} km
          </span>
        </PrefRow>
        <PrefRow icon={UserIcon} label={copy.app.profile.ageRange}>
          <span className="font-mono font-medium text-[13px] text-mm-ink">
            {prefs.ageRange?.[0] || 25}–{prefs.ageRange?.[1] || 34}
          </span>
        </PrefRow>
      </Section>

      <Section title={copy.app.profile.sectionDanger}>
        <DangerRow
          title={copy.app.profile.dangerPause}
          sub={copy.app.profile.dangerPauseSub}
          btnLabel={copy.app.profile.dangerPause}
        />
        <DangerRow
          title={copy.app.profile.dangerExport}
          sub={copy.app.profile.dangerExportSub}
          btnLabel={copy.app.profile.dangerExport}
        />
        <DangerRow
          title={copy.app.profile.dangerDelete}
          sub={copy.app.profile.dangerDeleteSub}
          btnLabel={copy.app.profile.dangerDelete}
          danger
        />
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

const PrefRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-center justify-between py-3 text-[13.5px] text-mm-ink-2 border-t border-mm-border first:border-t-0">
    <span className="inline-flex items-center gap-2 text-mm-ink-3">
      <Icon size={14} strokeWidth={1.7} />
      {label}
    </span>
    {children}
  </div>
);

const DangerRow = ({ title, sub, btnLabel, danger }) => (
  <div className="flex items-center gap-4 py-3.5 border-t border-mm-border first:border-t-0">
    <div className="flex-1 min-w-0">
      <div
        className={[
          "font-semibold text-[14px]",
          danger ? "text-mm-danger" : "text-mm-ink",
        ].join(" ")}
      >
        {title}
      </div>
      <div className="text-[12.5px] text-mm-ink-3 mt-0.5">{sub}</div>
    </div>
    <button
      type="button"
      className={[
        "h-[38px] px-3.5 rounded-[10px] border font-medium text-[13px] inline-flex items-center justify-center transition hover:-translate-y-px",
        danger
          ? "bg-transparent text-mm-danger border-mm-danger/35 hover:bg-mm-danger/5"
          : "bg-transparent text-mm-ink border-mm-border-2 hover:bg-mm-surface",
      ].join(" ")}
    >
      {btnLabel}
    </button>
  </div>
);

export default Settings;
