import { useState } from "react";
import { GitMerge, MapPin, MessageSquare } from "lucide-react";
import { initialsOf, hueOf } from "../../../../helpers/avatar";
import { getConnectionExtras } from "../data";

// One merged connection. Layout mirrors the feed's SwipeCard — full-bleed
// portrait with the fade overlay, name/skills on the photo — with a single
// round action underneath that opens the /chat/:userId thread. Shared-stack
// skills get the same coral match chips as the feed.

const MAX_CHIPS = 6;

const ConnectionCard = ({ user, copy, onMessage }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const { first_name, last_name, photoURL, age, about, skills = [] } = user;
  const hasPhoto = Boolean(photoURL) && !imgFailed;
  const extras = getConnectionExtras(user._id);
  const sharedSet = new Set(extras.sharedStack || []);
  const chips = skills.slice(0, MAX_CHIPS);
  const overflow = skills.length - chips.length;

  return (
    <div
      className={[
        "flex flex-col overflow-hidden rounded-[20px]",
        "bg-mm-surface border border-mm-border shadow-[var(--mm-shadow-card)]",
        "transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5",
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

        {extras.online && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[.18] border border-white/[.32] text-white font-mono font-medium text-[11px] backdrop-blur-[8px] z-[2]">
            <span className="w-1.5 h-1.5 rounded-full bg-mm-success shadow-[0_0_8px_var(--mm-success)]" />
            online
          </span>
        )}

        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[.18] border border-white/[.32] text-white font-mono font-medium text-[11px] backdrop-blur-[8px] z-[2]">
          <GitMerge size={11} strokeWidth={2} className="text-mm-coral" />
          merged {extras.mergedAt}
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
              {chips.map((s) => {
                const match = sharedSet.has(s);
                return (
                  <span
                    key={s}
                    className={[
                      "font-mono font-medium text-[11px] leading-none text-white px-2 py-[5px] rounded-md backdrop-blur-[8px]",
                      match ? "mm-tag-match-app" : "bg-white/[.16] border border-white/[.30]",
                    ].join(" ")}
                  >
                    {s}
                  </span>
                );
              })}
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

      {/* ── Action (same round button as the feed's bar) ─────── */}
      <div className="mt-auto px-5 py-3.5 border-t border-mm-border flex items-center justify-center">
        <button
          type="button"
          onClick={() => onMessage(user._id)}
          aria-label={copy.app.connections.message}
          title={copy.app.connections.message}
          className={[
            "w-11 h-11",
            "rounded-full border border-mm-border-2 bg-mm-surface text-mm-ink-2",
            "inline-flex items-center justify-center shadow-[var(--mm-shadow-soft)]",
            "transition hover:-translate-y-px hover:text-mm-ink",
          ].join(" ")}
        >
          <MessageSquare size={18} strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );
};

export default ConnectionCard;
