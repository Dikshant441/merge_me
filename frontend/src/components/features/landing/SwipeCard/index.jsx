import { useEffect, useRef, useState } from "react";

// Photo card the user can drag left/right.
//
// Gesture math (ported from the design prototype):
//   - drag past ±110px → snap-out to ±600px + ±18° rotation, fade to 0 over 380ms
//   - while dragging, rotate by dragX * 0.04°
//   - the "Merge"/"Pass" stamps fade in with opacity = |dragX| / 120
//
// Stack behavior:
//   - the top card is interactive; the two behind it are translated down
//     14 * depth px, scaled (1 - 0.04 * depth), and faded (1 - 0.12 * depth)
//   - `fireKey` lets the parent trigger a swipe from the action buttons

const FLY_OUT_MS = 380;
const THRESHOLD = 110;

const SwipeCard = ({ data, isTop, depth, onSwipe, fireKey, locale, copy }) => {
  const ref = useRef(null);
  const start = useRef({ x: 0, y: 0 });
  const [drag, setDrag] = useState({ x: 0, dragging: false });
  const [outDir, setOutDir] = useState(null);

  const handlePointerDown = (e) => {
    if (!isTop || outDir) return;
    ref.current?.setPointerCapture?.(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, dragging: true });
  };

  const handlePointerMove = (e) => {
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

  // The parent action bar fires a synthetic swipe by bumping fireKey.
  useEffect(() => {
    if (!fireKey || !isTop || outDir) return;
    setOutDir(fireKey.dir);
    const t = setTimeout(() => onSwipe(fireKey.dir), FLY_OUT_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fireKey]);

  let tx = 0;
  let ty = 0;
  let rot = 0;
  let scale = 1;
  let opacity = 1;

  if (isTop && outDir === "right") {
    tx = 600;
    rot = 18;
    opacity = 0;
  } else if (isTop && outDir === "left") {
    tx = -600;
    rot = -18;
    opacity = 0;
  } else if (isTop) {
    tx = drag.x;
    rot = drag.x * 0.04;
  } else {
    ty = depth * 14;
    scale = 1 - depth * 0.04;
    opacity = 1 - depth * 0.12;
  }

  const transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${scale})`;
  const stampMerge = isTop ? Math.max(0, drag.x / 120) : 0;
  const stampPass = isTop ? Math.max(0, -drag.x / 120) : 0;
  const isDragging = drag.dragging && !outDir;

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={[
        "absolute inset-0 flex flex-col overflow-hidden rounded-[18px]",
        "bg-mm-surface border border-mm-border select-none touch-none",
        "shadow-[var(--mm-shadow-card)] cursor-grab",
        isDragging ? "cursor-grabbing transition-none" : "transition-[transform,opacity] duration-[250ms] ease-[cubic-bezier(.2,.7,.2,1)]",
        outDir ? "!transition-[transform,opacity] !duration-[450ms] !ease-[cubic-bezier(.4,0,.2,1)]" : "",
      ].join(" ")}
      style={{ transform, opacity, zIndex: isTop ? 5 : 5 - depth }}
    >
      <div className="relative flex-1 min-h-0 overflow-hidden mm-photo-fade">
        <img
          src={data.photo}
          alt={data.name[locale]}
          draggable="false"
          className="w-full h-full object-cover object-[center_20%]"
        />
      </div>

      <div className="absolute left-[18px] right-[18px] bottom-4 text-white z-[2]">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="m-0 font-sans font-semibold text-[26px] leading-[1.1] tracking-[-0.02em] [text-shadow:0_2px_12px_rgba(0,0,0,.4)]">
            {data.name[locale]}
          </h3>
          <span className="font-mono font-medium text-[18px] opacity-90">{data.age}</span>
        </div>
        <div className="mt-0.5 mb-2.5 font-mono font-medium text-[13px] opacity-90 [text-shadow:0_1px_6px_rgba(0,0,0,.5)]">
          {data.role[locale]}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.tags.map((t, i) => {
            const isMatch = data.shared.includes(i);
            return (
              <span
                key={t}
                className={[
                  "font-mono font-medium text-[11px] leading-none text-white",
                  "px-2 py-[5px] rounded-md backdrop-blur-[8px]",
                  isMatch
                    ? "mm-tag-match"
                    : "bg-white/[.16] border border-white/[.3]",
                ].join(" ")}
              >
                {t}
              </span>
            );
          })}
        </div>
      </div>

      <span
        className="mm-stamp-merge absolute top-[22px] left-[18px] -rotate-[8deg] px-[14px] py-2 rounded-lg font-mono font-semibold text-[18px] uppercase tracking-[0.06em] pointer-events-none bg-white/90 backdrop-blur-[6px] z-[3]"
        style={{ opacity: stampMerge }}
      >
        {copy.swipeMerge}
      </span>
      <span
        className="mm-stamp-pass absolute top-[22px] right-[18px] rotate-[8deg] px-[14px] py-2 rounded-lg font-mono font-semibold text-[18px] uppercase tracking-[0.06em] pointer-events-none bg-white/90 backdrop-blur-[6px] z-[3]"
        style={{ opacity: stampPass }}
      >
        {copy.swipePass}
      </span>
    </div>
  );
};

export default SwipeCard;
