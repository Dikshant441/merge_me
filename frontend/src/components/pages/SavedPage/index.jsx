import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router";
import { savedApi } from "../../../api/saved/saved.api";
import { feedApi } from "../../../api/feed/feed.api";
import { setSaved, removeSaved } from "../../../store/saved/slice";
import { removeFeed, requeueFeed } from "../../../store/feed/slice";
import PageHeader from "../../shared/PageHeader";
import SavedCard from "../../features/saved/SavedCard";

// Saved Collection — private bookmark shortlist, newest first.
// Unsave is the ONLY action that removes an entry. Interested / Ignore reuse
// the feed's send endpoint (and keep the in-memory deck in sync) but the
// entry stays saved until explicitly unsaved.

const Saved = () => {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.saved.items);
  const feed = useSelector((s) => s.feed);
  const { copy } = useOutletContext();

  const fetchSaved = async () => {
    try {
      const res = await savedApi.getSaved();
      dispatch(setSaved(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleUnsave = async (userId) => {
    dispatch(removeSaved(userId)); // optimistic
    try {
      await savedApi.unsave(userId);
    } catch (err) {
      console.error(err);
      fetchSaved(); // roll back by resync
    }
  };

  // Same endpoint as feed swipes; SavedCard handles the error UX.
  const handleAction = async (status, userId) => {
    await feedApi.sendRequest(status, userId);
    // Mirror the swipe in the in-memory deck so /feed doesn't show a stale card.
    if (feed) {
      if (status === "interested") dispatch(removeFeed(userId));
      else dispatch(requeueFeed(userId));
    }
  };

  return (
    <>
      <PageHeader
        titleA={copy.app.saved.titleA}
        titleEm={copy.app.saved.titleEm}
        titleB={copy.app.saved.titleB}
        sub={copy.app.saved.sub}
      />

      <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(270px,1fr))] max-w-[1180px]">
        {(!items || items.length === 0) ? (
          <div className="col-span-full py-20 text-center text-mm-ink-3">
            <h3 className="m-0 font-semibold text-[22px] tracking-[-0.02em] text-mm-ink">
              {copy.app.saved.emptyTitle}
            </h3>
            <p className="mt-2 m-0">{copy.app.saved.emptySub}</p>
          </div>
        ) : (
          items.map((u) => (
            <SavedCard
              key={u._id}
              user={u}
              copy={copy}
              onAction={handleAction}
              onUnsave={handleUnsave}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Saved;
