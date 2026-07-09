import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router";
import { X, Check, Bookmark } from "lucide-react";
import { feedApi } from "../../../api/feed/feed.api";
import { addFeed, removeFeed } from "../../../store/feed/slice";
import PageHeader from "../../shared/PageHeader";
import SwipeCard from "../../features/feed/SwipeCard";
import FeedRail from "../../features/feed/FeedRail";
import { getFeedExtras } from "../../features/feed/data";

// Fisher-Yates shuffle — returns a new array so the source deck stays intact
// for the next refill.
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((s) => s.feed);
  const { copy } = useOutletContext();

  // Bumped by the action bar / keyboard to fire a synthetic swipe.
  const [fireKey, setFireKey] = useState(null);
  const [used, setUsed] = useState(0);
  // Full set of candidates we ever loaded — used to refill the queue with a
  // fresh shuffle once every card has been swiped, so the deck never runs dry.
  const deckRef = useRef([]);

  const getFeed = async () => {
    if (feed) {
      if (deckRef.current.length === 0) deckRef.current = feed;
      return;
    }
    try {
      const res = await feedApi.getFeed();
      deckRef.current = res.data;
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Keyboard: ← / → trigger swipe programmatically. Cleaned up on unmount.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setFireKey({ dir: "right", n: Date.now() });
      else if (e.key === "ArrowLeft") setFireKey({ dir: "left", n: Date.now() });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSwipe = async (dir) => {
    if (!feed || feed.length === 0) return;
    const current = feed[0];
    const status = dir === "right" ? "interested" : "ignored";

    setUsed((u) => u + 1);

    try {
      await feedApi.sendRequest(status, current._id);
    } catch (err) {
      console.error(err);
    }

    if (feed.length <= 1) {
      // Last card swiped — reshuffle the full deck back in for another pass.
      dispatch(addFeed(shuffle(deckRef.current)));
    } else {
      dispatch(removeFeed(current._id));
    }
    setFireKey(null);
  };

  const ranOut = !feed || feed.length === 0;
  const visible = ranOut ? [] : feed.slice(0, 3).map((u, d) => ({ user: u, depth: d }));
  const cur = ranOut ? null : feed[0];
  const extras = getFeedExtras(cur);
  // Quota total is the real candidate pool we loaded — not a fixed number.
  // Counts down to zero once every profile has been swiped.
  const total = deckRef.current.length || feed?.length || 0;

  return (
    <>
      <PageHeader
        titleEm={copy.app.feed.titleEm}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-7 items-start">
        <div className="relative border border-mm-border rounded-[20px] p-6 shadow-[var(--mm-shadow-soft)]">
          {/* head bar */}
          <div className="flex items-center justify-between mb-4 font-mono font-medium text-[12px] text-mm-ink-3">
            <span>
              {copy.app.feed.profileCount} {" "}
              {feed?.length || 0}
            </span>
          </div>

          {ranOut ? (
            <div className="text-center py-20">
              <h3 className="m-0 mb-2 font-semibold text-[22px] tracking-[-0.02em]">
                {copy.app.feed.emptyTitle}
              </h3>
              <p className="text-mm-ink-3 m-0">{copy.app.feed.emptySub}</p>
            </div>
          ) : (
            <>
              <div className="relative aspect-[4/5] max-w-[480px] mx-auto">
                {visible
                  .slice()
                  .reverse()
                  .map(({ user, depth }) => (
                    <SwipeCard
                      key={`${user._id}-${depth}`}
                      user={user}
                      isTop={depth === 0}
                      depth={depth}
                      onSwipe={handleSwipe}
                      fireKey={depth === 0 ? fireKey : null}
                      shared={getFeedExtras(user).shared}
                      online={getFeedExtras(user).online}
                    />
                  ))}
              </div>

              <div className="mt-[18px] flex items-center justify-center gap-3">
                <ActionBtn onClick={() => setFireKey({ dir: "left", n: Date.now() })} kind="pass" label={copy.app.feed.pass}>
                  <X size={18} strokeWidth={1.7} />
                </ActionBtn>
                <Kbd>{copy.app.feed.passKb}</Kbd>
                {/* bookmark — design has it; no backend yet, so no-op. */}
                <ActionBtn label={copy.app.feed.bookmark}>
                  <Bookmark size={18} strokeWidth={1.7} />
                </ActionBtn>
                <Kbd>{copy.app.feed.mergeKb}</Kbd>
                <ActionBtn onClick={() => setFireKey({ dir: "right", n: Date.now() })} kind="merge" label={copy.app.feed.merge}>
                  <Check size={18} strokeWidth={1.7} />
                </ActionBtn>
              </div>
            </>
          )}
        </div>

        <FeedRail user={cur} extras={extras} used={used} total={total} copy={copy} />
      </div>
    </>
  );
};

const ActionBtn = ({ children, onClick, kind, label }) => {
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
      aria-label={label}
      className={[
        "w-11 h-11",
        "rounded-full border border-mm-border-2 bg-mm-surface text-mm-ink-2",
        "inline-flex items-center justify-center shadow-[var(--mm-shadow-soft)]",
        "transition hover:-translate-y-px",
        hoverClass,
      ].join(" ")}
    >
      {children}
    </button>
  );
};

const Kbd = ({ children }) => (
  <span className="font-mono font-medium text-[11px] text-mm-ink-4 min-w-[18px] h-[18px] px-[5px] border border-mm-border border-b-2 rounded-[5px] bg-mm-paper inline-flex items-center justify-center">
    {children}
  </span>
);

export default Feed;
