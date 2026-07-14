import { useEffect, useRef, useState } from "react";
import { Bookmark, MapPin } from "lucide-react";
import { initialsOf, hueOf } from "../../../../helpers/avatar";

// Photo card the user can drag left/right to merge/pass.
//
// Gesture math (same as the landing demo):
//   - drag past ±110px → snap out to ±620px + ±18° rotation, fade to 0 over 380ms
//   - while dragging, rotate by dragX * 0.04°
//
// Behind the top card we render 2 dummies, translated +14px·depth, scaled
// (1 − 0.04·depth), faded (1 − 0.12·depth). `fireKey` lets the action bar
// trigger a swipe programmatically.

const FLY_OUT_MS = 380;
const THRESHOLD = 110;

const SwipeCard = ({ user, isTop, depth, onSwipe, fireKey, shared, online, saved, savedLabel }) => {
  const ref = useRef(null);
  const start = useRef({ x: 0, y: 0 });
  const [drag, setDrag] = useState({ x: 0, dragging: false });
  const [outDir, setOutDir] = useState(null);
  // Dead avatar URLs (e.g. legacy defaults) fall back to initials too.
  const [imgFailed, setImgFailed] = useState(false);
  const hasPhoto = Boolean(user.photoURL) && !imgFailed;

  const onPointerDown = (e) => {
    if (!isTop || outDir) return;
    ref.current?.setPointerCapture?.(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, dragging: true });
  };
  const onPointerMove = (e) => {
    if (!drag.dragging) return;
    setDrag({ x: e.clientX - start.current.x, dragging: true });
  };
  const endDrag = () => {
    if (!drag.dragging) return;
    if (drag.x > THRESHOLD) {
      setOutDir("right");
      setTimeout(() => onSwipe("right"), FLY_OUT_MS);
    } else if (drag.x < -THRESHOLD) {
      setOutDir("left");
      setTimeout(() => onSwipe("left"), FLY_OUT_MS);
    } else {
      setDrag({ x: 0, dragging: false });
    }
  };

  useEffect(() => {
    if (!fireKey || !isTop || outDir) return;
    setOutDir(fireKey.dir);
    const t = setTimeout(() => onSwipe(fireKey.dir), FLY_OUT_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fireKey]);

  let tx = 0, ty = 0, rot = 0, scale = 1, opacity = 1;
  if (isTop && outDir === "right") { tx = 620; rot = 18; opacity = 0; }
  else if (isTop && outDir === "left") { tx = -620; rot = -18; opacity = 0; }
  else if (isTop) { tx = drag.x; rot = drag.x * 0.04; }
  else { ty = depth * 14; scale = 1 - depth * 0.04; opacity = 1 - depth * 0.12; }

  const transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${scale})`;
  const isDragging = drag.dragging && !outDir;

  const sharedSet = new Set(shared || []);

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={[
        "absolute inset-0 flex flex-col overflow-hidden rounded-[20px]",
        "bg-mm-surface border border-mm-border select-none touch-none",
        "shadow-[var(--mm-shadow-card)] cursor-grab",
        isDragging
          ? "cursor-grabbing transition-none"
          : "transition-[transform,opacity] duration-[250ms] ease-[cubic-bezier(.2,.7,.2,1)]",
        outDir
          ? "!transition-[transform,opacity] !duration-[450ms] !ease-[cubic-bezier(.4,0,.2,1)]"
          : "",
      ].join(" ")}
      style={{ transform, opacity, zIndex: isTop ? 5 : 5 - depth }}
    >
      <div className="relative flex-1 min-h-0 overflow-hidden mm-app-photo-fade">
        {hasPhoto ? (
          <img
            src={user.photoURL}
            alt={user.first_name}
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
              className="font-mono font-semibold text-[96px] leading-none tracking-[-0.05em] select-none"
              style={{ color: `oklch(0.42 0.11 ${hueOf(user)})` }}
            >
              {initialsOf(user)}
            </span>
          </div>
        )}

        {online && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[.18] border border-white/[.32] text-white font-mono font-medium text-[11px] backdrop-blur-[8px] z-[2]">
            <span className="w-1.5 h-1.5 rounded-full bg-mm-success shadow-[0_0_8px_var(--mm-success)]" />
            online
          </span>
        )}

        {saved && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[.18] border border-white/[.32] text-white font-mono font-medium text-[11px] backdrop-blur-[8px] z-[2]">
            <Bookmark size={11} strokeWidth={2} fill="currentColor" className="text-mm-coral" />
            {savedLabel}
          </span>
        )}

        <div className="absolute left-5 right-5 bottom-[18px] text-white z-[2]">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="m-0 font-sans font-semibold text-[28px] leading-[1.1] tracking-[-0.02em] [text-shadow:0_2px_12px_rgba(0,0,0,.45)]">
              {user.first_name} {user.last_name}
            </h2>
            <span className="font-mono font-medium text-[18px] opacity-90">{user.age}</span>
          </div>
          {user.role && (
            <div className="mt-1 mb-1.5 font-mono font-medium text-[13px] opacity-90 [text-shadow:0_1px_6px_rgba(0,0,0,.5)]">
              {user.role}
            </div>
          )}
          {user.location && (
            <div className="font-mono font-medium text-[12px] opacity-85 inline-flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.7} /> {user.location}
            </div>
          )}
          {user.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {user.skills.map((s) => {
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
            </div>
          )}
        </div>
      </div>

      {user.about && (
        <div className="px-5 py-4 text-mm-ink-2 text-[13.5px] leading-[1.55] border-t border-mm-border bg-mm-surface">
          {user.about}
        </div>
      )}
    </div>
  );
};

export default SwipeCard;
