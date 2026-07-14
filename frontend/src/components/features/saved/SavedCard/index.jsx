import { useState } from "react";
import { Bookmark, Check, MapPin, X } from "lucide-react";
import { initialsOf, hueOf } from "../../../../helpers/avatar";

// One bookmarked profile in the Saved Collection. Layout mirrors the feed's
// SwipeCard — full-bleed portrait with the fade overlay, name/skills on the
// photo, and the feed's round action buttons underneath instead of gestures.
// Interested / Ignore fire the SAME send endpoint as feed swipes and follow
// the same rules — but the entry intentionally STAYS in the collection.
// Unsave is the only action that removes it (parent unmounts via onUnsave).

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

const SavedCard = ({ user, copy, onAction, onUnsave }) => {
  const [removing, setRemoving] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  // After a successful "interested" the swipe actions lock (re-sending would
  // only 400 with "already exists"); ignore stays repeatable by design.
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);

  const { first_name, last_name, photoURL, age, about, skills = [] } = user;
  const hasPhoto = Boolean(photoURL) && !imgFailed;
  const savedOn = timeAgo(user.savedAt);
  const chips = skills.slice(0, MAX_CHIPS);
  const overflow = skills.length - chips.length;
  const t = copy.app.saved;

  const act = async (status) => {
    if (busy || sent) return;
    setBusy(true);
    try {
      await onAction(status, user._id);
      if (status === "interested") {
        setSent(true);
        setNote(t.interestSent);
      } else {
        setNote(t.ignoredNote);
      }
    } catch (err) {
      const code = err?.response?.status;
      if (code === 400 || code === 409) {
        setSent(true);
        setNote(t.alreadyRequested);
      } else {
        console.error(err);
      }
    } finally {
      setBusy(false);
    }
  };

  const unsave = () => {
    setRemoving(true);
    setTimeout(() => onUnsave(user._id), 280);
  };

  return (
    <div
      className={[
        "flex flex-col overflow-hidden rounded-[20px]",
        "bg-mm-surface border border-mm-border shadow-[var(--mm-shadow-card)]",
        "transition-[transform,opacity,box-shadow] duration-300",
        "hover:-translate-y-0.5",
        removing ? "opacity-0 -translate-y-1.5" : "opacity-100 translate-y-0",
      ].join(" ")}
    >
      {/* ── Portrait (same fade + overlay as SwipeCard) ───────── */}
      <div className="relative aspect-[4/5] overflow-hidden mm-app-photo-fade">
        {hasPhoto ? (
          <img
            src={photoURL}
            alt={first_name}
            draggable="false"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full grid place-items-center"
            style={{
              background: `radial-gradient(120% 90% at 50% 20%,
                oklch(0.90 0.05 ${hueOf(user)}) 0%,
                oklch(0.80 0.08 ${hueOf(user)}) 100%)`,
            }}
          >
            <span
              className="font-mono font-semibold text-[72px] leading-none tracking-[-0.05em] select-none"
              style={{ color: `oklch(0.42 0.11 ${hueOf(user)})` }}
            >
              {initialsOf(user)}
            </span>
          </div>
        )}

        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[.18] border border-white/[.32] text-white font-mono font-medium text-[11px] backdrop-blur-[8px] z-[2]">
          <Bookmark size={11} strokeWidth={2} fill="currentColor" className="text-mm-coral" />
          {t.savedIndicator}
          {savedOn && <span className="opacity-80">· {savedOn}</span>}
        </span>

        <div className="absolute left-5 right-5 bottom-[18px] text-white z-[2]">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="m-0 font-sans font-semibold text-[22px] leading-[1.1] tracking-[-0.02em] [text-shadow:0_2px_12px_rgba(0,0,0,.45)]">
              {first_name} {last_name}
            </h2>
            {age && (
              <span className="font-mono font-medium text-[16px] opacity-90">{age}</span>
            )}
          </div>
          {user.role && (
            <div className="mt-1 mb-1.5 font-mono font-medium text-[12.5px] opacity-90 [text-shadow:0_1px_6px_rgba(0,0,0,.5)]">
              {user.role}
            </div>
          )}
          {user.location && (
            <div className="font-mono font-medium text-[12px] opacity-85 inline-flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.7} /> {user.location}
            </div>
          )}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {chips.map((s) => (
                <span
                  key={s}
                  className="font-mono font-medium text-[11px] leading-none text-white px-2 py-[5px] rounded-md backdrop-blur-[8px] bg-white/[.16] border border-white/[.30]"
                >
                  {s}
                </span>
              ))}
              {overflow > 0 && (
                <span className="font-mono font-medium text-[11px] leading-none text-white/85 px-2 py-[5px] rounded-md backdrop-blur-[8px] bg-white/[.10] border border-dashed border-white/[.30]">
                  +{overflow}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── About strip (same as SwipeCard) ──────────────────── */}
      {about && (
        <div className="px-5 py-3.5 text-mm-ink-2 text-[13.5px] leading-[1.55] border-t border-mm-border line-clamp-2">
          {about}
        </div>
      )}

      {/* ── Actions (same round buttons as the feed's bar) ───── */}
      <div className="mt-auto px-5 py-3.5 border-t border-mm-border flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3">
          <ActionBtn
            onClick={() => act("ignored")}
            disabled={busy || sent}
            label={t.ignore}
            kind="pass"
          >
            <X size={18} strokeWidth={1.7} />
          </ActionBtn>
          <ActionBtn onClick={unsave} label={t.unsave} active>
            <Bookmark size={18} strokeWidth={1.7} fill="currentColor" />
          </ActionBtn>
          <ActionBtn
            onClick={() => act("interested")}
            disabled={busy || sent}
            label={t.interested}
            kind="merge"
          >
            <Check size={18} strokeWidth={1.7} />
          </ActionBtn>
        </div>
        {note && (
          <div className="font-mono font-medium text-[11.5px] text-mm-ink-3 text-center">
            {note}
          </div>
        )}
      </div>
    </div>
  );
};

const ActionBtn = ({ children, onClick, kind, label, active, disabled }) => {
  const hoverClass =
    kind === "pass"
      ? "hover:text-mm-danger hover:border-mm-danger/50"
      : kind === "merge"
      ? "hover:text-mm-success hover:border-mm-success/50"
      : "hover:text-mm-ink";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={[
        "w-11 h-11",
        "rounded-full border border-mm-border-2 bg-mm-surface",
        active ? "text-mm-coral border-mm-coral/50" : "text-mm-ink-2",
        "inline-flex items-center justify-center shadow-[var(--mm-shadow-soft)]",
        "transition hover:-translate-y-px",
        "disabled:opacity-45 disabled:pointer-events-none",
        hoverClass,
      ].join(" ")}
    >
      {children}
    </button>
  );
};

export default SavedCard;
