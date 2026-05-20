import { GitMerge, Edit, ShieldCheck } from "lucide-react";
import { ACTIVITY } from "../data";

const ICONS = {
  merge: GitMerge,
  edit: Edit,
  verify: ShieldCheck,
};

// Single-column timeline. Each row: tinted dot icon + text + time on right.

const Activity = ({ copy }) => {
  return (
    <div className="bg-mm-surface border border-mm-border rounded-[16px] p-[22px] shadow-[var(--mm-shadow-soft)] max-w-[720px]">
      <h3 className="m-0 mb-3 font-semibold text-[15px] tracking-[-0.01em]">
        {copy.app.profile.activityH}
      </h3>
      <div className="flex flex-col gap-0.5">
        {ACTIVITY.map((a) => {
          const Icon = ICONS[a.type] || Edit;
          const dotClass =
            a.type === "merge"
              ? "mm-chip-shared text-mm-coral"
              : a.type === "verify"
              ? "mm-dot-verify"
              : "bg-mm-paper border-mm-border text-mm-ink-2";
          const label =
            a.type === "merge"
              ? copy.app.profile.activityMerge
              : a.type === "verify"
              ? copy.app.profile.activityVerify
              : copy.app.profile.activityEdit;
          return (
            <div
              key={a.id}
              className="grid grid-cols-[24px_minmax(0,1fr)_auto] gap-3 items-center py-2.5 px-1 border-t border-mm-border first:border-t-0"
            >
              <span
                className={[
                  "w-6 h-6 rounded-[7px] inline-flex items-center justify-center border",
                  dotClass,
                ].join(" ")}
              >
                <Icon size={12} strokeWidth={1.7} />
              </span>
              <div className="text-[13.5px] font-medium">
                <span>
                  {label} <b className="text-mm-ink font-semibold">{a.target}</b>
                </span>
                <span className="block font-mono font-medium text-[11.5px] text-mm-ink-3 mt-0.5">
                  {a.meta}
                </span>
              </div>
              <span className="font-mono font-medium text-[11.5px] text-mm-ink-3">
                {a.ago}
                {copy.app.profile.activityAgo}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Activity;
