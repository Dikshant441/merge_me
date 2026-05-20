import { useState } from "react";
import { Check, X, MapPin, GitMerge } from "lucide-react";

// One incoming request card. Action click fades opacity + slides up, then
// the parent unmounts via `onResolve`.

const RequestCard = ({ request, copy, onResolve }) => {
  const [removing, setRemoving] = useState(false);
  const fromUser = request.fromUserId || {};
  const { first_name, last_name, photoURL, age, about, skills = [] } = fromUser;

  // Real backend doesn't return "shared" — best-effort match against the
  // current user's skills would need that data on the page; for now show
  // all skills as unmatched.
  const sharedSet = new Set();

  const resolve = (status) => {
    setRemoving(true);
    setTimeout(() => onResolve(status, request._id), 280);
  };

  return (
    <div
      className={[
        "grid grid-cols-[200px_minmax(0,1fr)_auto] gap-[22px] p-[18px]",
        "bg-mm-surface border border-mm-border rounded-[16px] shadow-[var(--mm-shadow-soft)]",
        "transition-[transform,opacity] duration-300",
        removing ? "opacity-0 -translate-y-1.5" : "opacity-100 translate-y-0",
        "max-[820px]:grid-cols-1",
      ].join(" ")}
    >
      <div className="relative w-[200px] h-[220px] rounded-[12px] overflow-hidden bg-mm-paper border border-mm-border max-[820px]:w-full max-[820px]:h-[180px]">
        {photoURL && (
          <img src={photoURL} alt={first_name} className="w-full h-full object-cover" />
        )}
        <span className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-full bg-black/45 border border-white/[.18] text-white font-mono font-medium text-[10.5px] backdrop-blur-[6px]">
          {copy.app.requests.sent} 2h ago
        </span>
      </div>

      <div className="min-w-0 flex flex-col gap-2.5">
        <h3 className="m-0 font-semibold text-[20px] tracking-[-0.02em]">
          {first_name} {last_name}
          {age && (
            <span className="text-mm-ink-3 font-mono font-medium text-[16px] ml-1.5">
              {age}
            </span>
          )}
        </h3>
        <div className="font-mono font-medium text-[13px] text-mm-ink-2 inline-flex items-center gap-2 flex-wrap">
          {fromUser.role && (
            <>
              <span>{fromUser.role}</span>
              <span className="text-mm-ink-4">·</span>
            </>
          )}
          <span className="text-mm-ink-3">
            <MapPin size={12} strokeWidth={1.7} className="inline -mt-0.5" />
          </span>
          <span>{fromUser.location || "—"}</span>
        </div>
        {about && (
          <p className="m-0 mt-1 text-mm-ink-2 text-[14px] leading-[1.55] text-pretty">
            {about}
          </p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-col gap-2 pt-1">
            <div className="font-mono font-medium text-[10.5px] text-mm-ink-3 uppercase tracking-[.08em] inline-flex items-center gap-1.5">
              <GitMerge size={12} strokeWidth={1.7} /> {copy.app.requests.shared}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className={[
                    "font-mono font-medium text-[11px] px-2 py-[5px] rounded-md border",
                    sharedSet.has(s)
                      ? "mm-chip-shared"
                      : "bg-mm-paper border-mm-border text-mm-ink-3",
                  ].join(" ")}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 justify-center min-w-[130px] max-[820px]:flex-row">
        <button
          type="button"
          onClick={() => resolve("accepted")}
          className="h-11 px-3 rounded-[12px] bg-mm-ink text-mm-bg font-medium text-[13px] inline-flex items-center justify-center gap-2 shadow-[0_1px_0_rgba(255,255,255,.14)_inset]"
        >
          <Check size={16} strokeWidth={1.7} /> {copy.app.requests.accept}
        </button>
        <button
          type="button"
          onClick={() => resolve("rejected")}
          className="h-11 px-3 rounded-[12px] bg-transparent text-mm-ink-2 border border-mm-border-2 font-medium text-[13px] inline-flex items-center justify-center gap-2 hover:text-mm-ink"
        >
          <X size={16} strokeWidth={1.7} /> {copy.app.requests.reject}
        </button>
        <button
          type="button"
          className="bg-transparent border-0 text-mm-ink-3 font-medium text-[12.5px] py-1.5 hover:text-mm-ink"
        >
          {copy.app.requests.seeMore} →
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
