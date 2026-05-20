// 2-col grid of keyboard shortcuts. Each row: label on the left + kbd pills
// on the right. Pill style matches the topbar search ⌘K.

const ShortcutTable = ({ copy }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2.5">
      {copy.app.help.kbs.map(([keys, label], i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-2.5 py-2.5 border-b border-mm-border"
        >
          <span className="font-medium text-[13px] text-mm-ink-2">{label}</span>
          <span className="inline-flex gap-1">
            {keys.map((k, ki) => (
              <span
                key={ki}
                className="font-mono font-medium text-[11px] border border-mm-border border-b-2 rounded-[5px] px-[7px] py-[3px] bg-mm-paper text-mm-ink min-w-[22px] text-center"
              >
                {k}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ShortcutTable;
