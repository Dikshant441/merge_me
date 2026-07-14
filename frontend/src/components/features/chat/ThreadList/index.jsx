import { getConnectionExtras } from "../../connections/data";

// Left pane on Connections: filter row + a scrollable list of conversation
// rows. Selected row is highlighted with paper-2 background.

const ThreadList = ({ connections, selectedId, onSelect, copy }) => {
  const list = connections || [];

  return (
    <div className="bg-mm-surface border border-mm-border rounded-[16px] shadow-[var(--mm-shadow-soft)] overflow-hidden flex flex-col min-h-0">
      <div className="p-3 border-b border-mm-border">
        <FilterRow copy={copy} />
      </div>
      <div className="overflow-y-auto flex-1 p-1">
        {list.length === 0 && (
          <div className="text-center text-mm-ink-3 text-[13px] py-12 px-4">
            No conversations yet.
          </div>
        )}
        {list.map((u) => {
          const extras = getConnectionExtras(u._id);
          const active = u._id === selectedId;
          return (
            <button
              key={u._id}
              onClick={() => onSelect(u._id)}
              className={[
                "w-full grid grid-cols-[44px_1fr_auto] gap-3 items-center p-3 rounded-[12px] text-left border transition",
                active
                  ? "bg-mm-paper-2 border-mm-border"
                  : "border-transparent hover:bg-mm-paper",
              ].join(" ")}
            >
              <div className="relative w-11 h-11">
                <img
                  src={u.photoURL}
                  alt={u.first_name}
                  className="w-11 h-11 rounded-full object-cover border border-mm-border"
                />
                {extras.online && (
                  <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-mm-success border-2 border-mm-surface" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex justify-between gap-2">
                  <span
                    className={[
                      "font-semibold text-[13.5px] truncate",
                      extras.unread ? "text-mm-ink" : "text-mm-ink",
                    ].join(" ")}
                  >
                    {u.first_name} {u.last_name}
                  </span>
                  <span className="font-mono font-medium text-[11px] text-mm-ink-3 whitespace-nowrap">
                    {extras.mergedAt}
                  </span>
                </div>
                <div
                  className={[
                    "mt-0.5 text-[13px] truncate",
                    extras.unread ? "text-mm-ink font-medium" : "text-mm-ink-2",
                  ].join(" ")}
                >
                  {extras.lastMessage || "—"}
                </div>
              </div>
              {extras.unread ? (
                <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-mm-coral text-white font-mono font-semibold text-[11px] inline-flex items-center justify-center">
                  {extras.unread}
                </span>
              ) : (
                <span />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Filter chips — visual only for now (filter state lives in the page so we
// can pass it back to ThreadList later if we want to actually filter).
const FilterRow = ({ copy }) => {
  const items = [
    ["all",    copy.app.connections.filterAll,    true],
    ["unread", copy.app.connections.filterUnread, false],
    ["online", copy.app.connections.filterOnline, false],
    ["recent", copy.app.connections.filterRecent, false],
  ];
  return (
    <div className="inline-flex gap-1 p-1 bg-mm-paper border border-mm-border rounded-full">
      {items.map(([id, label, active]) => (
        <button
          key={id}
          className={[
            "px-3 py-1.5 text-[12px] font-medium rounded-full transition",
            active
              ? "bg-mm-ink text-mm-bg shadow-[0_1px_0_rgba(255,255,255,.14)_inset]"
              : "text-mm-ink-2 hover:text-mm-ink",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ThreadList;
