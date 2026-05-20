// 4-row changelog: version / time-ago / description.

const ChangelogList = ({ copy }) => {
  return (
    <>
      {copy.app.help.changelog.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-[64px_60px_1fr] gap-3.5 px-1 py-3.5 border-b border-mm-border last:border-b-0"
        >
          <span className="font-mono font-medium text-[12px] text-mm-ink">{row[0]}</span>
          <span className="font-mono font-medium text-[11.5px] text-mm-ink-3">{row[1]}</span>
          <span className="text-[13.5px] leading-[1.5] text-mm-ink-2">{row[2]}</span>
        </div>
      ))}
      <div className="mt-3 text-right">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="font-medium text-[12.5px] text-mm-coral-2 dark:text-mm-coral hover:underline"
        >
          {copy.app.help.changelogAll}
        </a>
      </div>
    </>
  );
};

export default ChangelogList;
