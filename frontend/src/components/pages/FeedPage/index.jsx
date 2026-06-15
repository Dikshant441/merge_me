import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router";
import { X, Check, Bookmark } from "lucide-react";
import { feedApi } from "../../../api/feed/feed.api";
import { addFeed, removeFeed } from "../../../store/feed/slice";
import PageHeader from "../../shared/PageHeader";
import SwipeCard from "../../features/feed/SwipeCard";
import FeedRail from "../../features/feed/FeedRail";
import { getFeedExtras, QUOTA_TOTAL } from "../../features/feed/data";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((s) => s.feed);
  const { copy } = useOutletContext();

  // Bumped by the action bar / keyboard to fire a synthetic swipe.
  const [fireKey, setFireKey] = useState(null);
  // Most recent swipe — used to render the commit-log strip at the bottom.
  const [lastAction, setLastAction] = useState(null);
  const [used, setUsed] = useState(2);

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await feedApi.getFeed();
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

    setLastAction({ dir, user: current });
    setUsed((u) => u + 1);

    try {
      await feedApi.sendRequest(status, current._id);
    } catch (err) {
      console.error(err);
    }

    dispatch(removeFeed(current._id));
    setFireKey(null);
  };

  const ranOut = !feed || feed.length === 0;
  const visible = ranOut ? [] : feed.slice(0, 3).map((u, d) => ({ user: u, depth: d }));
  const cur = ranOut ? null : feed[0];
  const extras = getFeedExtras(cur);

  return (
    <>
      <PageHeader
        eyebrow={copy.app.feed.eyebrow}
        titleA={copy.app.feed.titleA}
        titleEm={copy.app.feed.titleEm}
        titleB={copy.app.feed.titleB}
        sub={copy.app.feed.sub}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-7 items-start">
        <div className="relative bg-mm-surface border border-mm-border rounded-[20px] p-6 shadow-[var(--mm-shadow-soft)]">
          {/* head bar */}
          <div className="flex items-center justify-between mb-4 font-mono font-medium text-[12px] text-mm-ink-3">
            <span>
              {copy.app.feed.profileCount} <b className="text-mm-ink font-semibold">1</b> /{" "}
              {feed?.length || 0}
            </span>
            <div className="inline-flex items-center gap-2.5">
              <span className="inline-flex items-center gap-2 h-[26px] px-2.5 border border-mm-border bg-mm-paper rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-mm-coral shadow-[0_0_0_3px_oklch(from_var(--mm-coral)_l_c_h_/_.18)]" />
                {copy.app.feed.rankedBy}
              </span>
              <span className="text-mm-ink-4">·</span>
              <span>{copy.app.feed.refresh}</span>
            </div>
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
                      copy={copy}
                      shared={getFeedExtras(user).shared}
                      online={getFeedExtras(user).online}
                    />
                  ))}
              </div>

              <div className="mt-[18px] flex items-center justify-center gap-3">
                <ActionBtn onClick={() => setFireKey({ dir: "left", n: Date.now() })} kind="pass" label={copy.app.feed.pass}>
                  <X size={22} strokeWidth={1.7} />
                </ActionBtn>
                <Kbd>{copy.app.feed.passKb}</Kbd>
                {/* bookmark — design has it; no backend yet, so no-op. */}
                <ActionBtn label={copy.app.feed.bookmark}>
                  <Bookmark size={22} strokeWidth={1.7} />
                </ActionBtn>
                <Kbd>{copy.app.feed.mergeKb}</Kbd>
                <ActionBtn onClick={() => setFireKey({ dir: "right", n: Date.now() })} kind="merge" label={copy.app.feed.merge}>
                  <Check size={26} strokeWidth={1.7} />
                </ActionBtn>
              </div>

              <CommitLog action={lastAction} copy={copy} />
            </>
          )}
        </div>

        <FeedRail user={cur} extras={extras} used={used} total={QUOTA_TOTAL} copy={copy} />
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
  const size = kind === "merge" ? "w-16 h-16" : "w-[52px] h-[52px]";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        size,
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

const CommitLog = ({ action, copy }) => (
  <div className="mt-4 px-4 py-3 bg-mm-paper border border-mm-border rounded-[10px] font-mono font-medium text-[12.5px] text-mm-ink-3 flex items-center gap-2.5 overflow-hidden">
    {action ? (
      <>
        <span className="text-mm-ink-2">$ git commit -m</span>
        <span className="truncate">
          "{action.dir === "right" ? copy.app.feed.commitOk : copy.app.feed.commitPass} · {(action.user.first_name || "").toLowerCase()}-{(action.user.last_name || "").toLowerCase()}"
        </span>
        <span className="ml-auto whitespace-nowrap">
          {action.dir === "right" ? (
            <span className="text-mm-success">{copy.app.feed.plus}</span>
          ) : (
            <span className="text-mm-danger">{copy.app.feed.minus}</span>
          )}
        </span>
      </>
    ) : (
      <span>{copy.app.feed.awaiting}</span>
    )}
  </div>
);

export default Feed;
