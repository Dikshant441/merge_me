import { useState } from "react";
import { X, GitMerge, GitPullRequestArrow } from "lucide-react";
import { initialsOf, hueOf } from "../../../../helpers/avatar";

// One incoming request, styled like what it actually is: an open merge
// request. Real data only — the timestamp comes from the request row, the
// portrait falls back to initials, nothing is placeholder.
// Action click fades opacity + slides up, then the parent unmounts via
// `onResolve`.

const MAX_CHIPS = 6;

const timeAgo = (iso) => {
  if (!iso) return null;
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
};

const RequestCard = ({ request, copy, onResolve }) => {
  const [removing, setRemoving] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const fromUser = request.fromUserId || {};
  const { first_name, last_name, photoURL, age, about, skills = [] } = fromUser;
  const hasPhoto = Boolean(photoURL) && !imgFailed;
  const opened = timeAgo(request.createdAt);
  const chips = skills.slice(0, MAX_CHIPS);
  const overflow = skills.length - chips.length;

  const resolve = (status) => {
    setRemoving(true);
    setTimeout(() => onResolve(status, request._id), 280);
  };

  return (
    <div
      className={[
        "group grid grid-cols-[168px_minmax(0,1fr)_auto] gap-[22px] p-[18px]",
        "bg-mm-surface border border-mm-border rounded-[16px] shadow-[var(--mm-shadow-soft)]",
        "transition-[transform,opacity,box-shadow] duration-300",
        "hover:-translate-y-0.5 hover:shadow-[var(--mm-shadow-card)]",
        removing ? "opacity-0 -translate-y-1.5" : "opacity-100 translate-y-0",
        "max-[820px]:grid-cols-1",
      ].join(" ")}
    >
      {/* ── Portrait ─────────────────────────────────────────── */}
      <div className="relative w-[168px] h-[188px] rounded-[12px] overflow-hidden border border-mm-border max-[820px]:w-full max-[820px]:h-[180px]">
        {hasPhoto ? (
          <img
            src={photoURL}
            alt={first_name}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full grid place-items-center"
            style={{
              background: `radial-gradient(120% 90% at 50% 20%,
                oklch(0.90 0.05 ${hueOf(fromUser)}) 0%,
                oklch(0.80 0.08 ${hueOf(fromUser)}) 100%)`,
            }}
          >
            <span
              className="font-mono font-semibold text-[52px] leading-none tracking-[-0.05em] select-none"
              style={{ color: `oklch(0.42 0.11 ${hueOf(fromUser)})` }}
            >
              {initialsOf(fromUser)}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="min-w-0 flex flex-col gap-2">
        <div className="font-mono font-medium text-[10.5px] uppercase tracking-[.09em] text-mm-ink-3 inline-flex items-center gap-1.5">
          <GitPullRequestArrow size={12} strokeWidth={1.9} className="text-mm-coral" />
          <span>merge request</span>
          {opened && (
            <>
              <span className="text-mm-ink-4">·</span>
              <span>opened {opened}</span>
            </>
          )}
        </div>

        <h3 className="m-0 font-semibold text-[20px] tracking-[-0.02em]">
          {first_name} {last_name}
          {age && (
            <span className="text-mm-ink-3 font-mono font-medium text-[16px] ml-1.5">
              {age}
            </span>
          )}
        </h3>

        {about && (
          <p className="m-0 text-mm-ink-2 text-[14px] leading-[1.55] text-pretty">
            {about}
          </p>
        )}

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1.5 mt-auto">
            {chips.map((s) => (
              <span
                key={s}
                className="font-mono font-medium text-[11px] px-2 py-[5px] rounded-md border bg-mm-paper border-mm-border text-mm-ink-3"
              >
                {s}
              </span>
            ))}
            {overflow > 0 && (
              <span className="font-mono font-medium text-[11px] px-2 py-[5px] rounded-md border border-dashed border-mm-border-2 text-mm-ink-4">
                +{overflow}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Actions ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5 justify-center min-w-[136px] max-[820px]:flex-row">
        <button
          type="button"
          onClick={() => resolve("accepted")}
          className={[
            "h-11 px-4 rounded-[12px] bg-mm-coral text-white font-medium text-[13px]",
            "inline-flex items-center justify-center gap-2",
            "shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_8px_20px_-10px_var(--mm-coral)]",
            "transition hover:brightness-[1.06] active:translate-y-px",
          ].join(" ")}
        >
          <GitMerge size={16} strokeWidth={1.9} /> {copy.app.requests.accept}
        </button>
        <button
          type="button"
          onClick={() => resolve("rejected")}
          className={[
            "h-11 px-4 rounded-[12px] bg-transparent text-mm-ink-2 border border-mm-border-2",
            "font-medium text-[13px] inline-flex items-center justify-center gap-2",
            "transition hover:text-mm-danger hover:border-mm-danger/50",
          ].join(" ")}
        >
          <X size={16} strokeWidth={1.7} /> {copy.app.requests.reject}
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
