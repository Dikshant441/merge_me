import { HELP_STATUS } from "../data";

// Status panel — header pill flips to amber when any service is degraded.
// Each row: dot + service name + right-aligned mono note.

const StatusCard = ({ copy }) => {
  const allOk = HELP_STATUS.every((s) => s.state === "ok");

  return (
    <div className="bg-mm-surface border border-mm-border rounded-[16px] p-[22px] shadow-[var(--mm-shadow-soft)]">
      <div className="flex items-baseline justify-between mb-1.5">
        <h2 className="m-0 font-semibold text-[17px] tracking-[-0.02em]">
          {copy.app.help.statusH}
        </h2>
        <span
          className={[
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono font-medium text-[11.5px]",
            allOk ? "mm-pill-success" : "mm-pill-warn",
          ].join(" ")}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
          {allOk ? copy.app.help.statusAll : copy.app.help.statusDeg}
        </span>
      </div>

      {HELP_STATUS.map((s) => (
        <div
          key={s.service}
          className="grid grid-cols-[1fr_auto] items-center py-2.5 border-t border-mm-border font-medium text-[13px]"
        >
          <div>
            <span
              className={[
                "w-[7px] h-[7px] rounded-full inline-block align-middle mr-2",
                s.state === "degraded" ? "bg-mm-amber" : "bg-mm-success",
              ].join(" ")}
            />
            <span className="text-mm-ink">{s.service}</span>
          </div>
          <span className="font-mono font-medium text-[11.5px] text-mm-ink-3">
            {s.note}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatusCard;
