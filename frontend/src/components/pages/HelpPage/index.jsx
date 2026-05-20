import { useOutletContext } from "react-router";
import { Search } from "lucide-react";
import PageHeader from "../../shared/PageHeader";
import CategoryCard from "../../features/help/CategoryCard";
import StatusCard from "../../features/help/StatusCard";
import ContactCard from "../../features/help/ContactCard";
import PopularList from "../../features/help/PopularList";
import ChangelogList from "../../features/help/ChangelogList";
import ShortcutTable from "../../features/help/ShortcutTable";
import { HELP_CATEGORIES } from "../../features/help/data";

const Help = () => {
  const { copy } = useOutletContext();

  return (
    <>
      <PageHeader
        eyebrow={copy.app.help.eyebrow}
        titleA={copy.app.help.titleA}
        titleEm={copy.app.help.titleEm}
        titleB={copy.app.help.titleB}
        sub={copy.app.help.sub}
      />

      {/* command-bar-style search (visual only for now) */}
      <div className="relative bg-mm-surface border border-mm-border-2 rounded-[14px] flex items-center gap-3 px-4 h-14 shadow-[var(--mm-shadow-soft)] mb-8">
        <Search size={18} strokeWidth={1.7} className="text-mm-ink-3 flex-shrink-0" />
        <span className="flex-1 font-medium text-[14.5px] text-mm-ink-3 truncate">
          {copy.app.help.searchPh}
        </span>
        <span className="inline-flex gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </div>

      {/* categories + (contact + status) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-[22px] mb-8">
        <Section>
          <Head title={copy.app.help.catH} sub={copy.app.help.catSub} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {HELP_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} category={cat} copy={copy} />
            ))}
          </div>
        </Section>

        <div className="flex flex-col gap-[18px]">
          <ContactCard copy={copy} />
          <StatusCard copy={copy} />
        </div>
      </div>

      {/* popular */}
      <Section className="mb-[22px]">
        <Head title={copy.app.help.popH} sub={copy.app.help.popSub} />
        <PopularList />
      </Section>

      {/* changelog + shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[22px]">
        <Section>
          <Head title={copy.app.help.changelogH} sub={copy.app.help.changelogSub} />
          <ChangelogList copy={copy} />
        </Section>
        <Section>
          <Head title={copy.app.help.kbsH} sub={copy.app.help.kbsSub} />
          <ShortcutTable copy={copy} />
        </Section>
      </div>
    </>
  );
};

const Section = ({ children, className = "" }) => (
  <div
    className={[
      "bg-mm-surface border border-mm-border rounded-[16px] p-[22px] shadow-[var(--mm-shadow-soft)]",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

const Head = ({ title, sub }) => (
  <div className="flex items-baseline justify-between mb-1.5">
    <h2 className="m-0 font-semibold text-[17px] tracking-[-0.02em]">{title}</h2>
    <span className="font-mono font-medium text-[12px] text-mm-ink-3">{sub}</span>
  </div>
);

const Kbd = ({ children }) => (
  <span className="font-mono font-medium text-[11px] border border-mm-border border-b-2 rounded-[5px] px-[7px] py-[3px] bg-mm-paper text-mm-ink-3">
    {children}
  </span>
);

export default Help;
