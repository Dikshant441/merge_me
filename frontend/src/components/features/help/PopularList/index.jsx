import { HELP_POPULAR } from "../data";

// Popular articles list — 6 rows. Each row is a 3-col grid:
// category pill / title / time-ago. Whole row gets paper bg on hover.

const PopularList = () => {
  return (
    <div className="flex flex-col">
      {HELP_POPULAR.map((p) => (
        <button
          key={p.id}
          type="button"
          className="grid grid-cols-[80px_1fr_auto] gap-3.5 items-center px-1 py-3.5 border-b border-mm-border last:border-b-0 hover:bg-mm-paper hover:rounded-[8px] transition text-left"
        >
          <span className="font-mono font-medium text-[10.5px] text-mm-ink-3 bg-mm-paper border border-mm-border px-2 py-1 rounded-full text-center">
            {p.cat}
          </span>
          <span className="font-medium text-[13.5px] text-mm-ink">{p.title}</span>
          <span className="font-mono font-medium text-[11px] text-mm-ink-3">{p.ago}</span>
        </button>
      ))}
    </div>
  );
};

export default PopularList;
