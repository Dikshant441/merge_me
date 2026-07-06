import { useOutletContext } from "react-router";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import ContactCard from "../../features/help/ContactCard";
import { HELP_ARTICLES, HELP_FAQS } from "../../features/help/data";

// Help page — popular articles + FAQ (side by side), then a full-width
// "Still stuck?" contact card. No search, docs header, shortcuts, or status.
const Help = () => {
  const { copy } = useOutletContext();
  const c = copy.app.help;

  return (
    <>
      <h1 className="m-0 mb-5 font-semibold text-[22px] tracking-[-0.02em] text-mm-ink">
        {copy.app.nav.help}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[22px] mb-[22px]">
        {/* Popular articles */}
        <Section title={c.articlesH}>
          <ul className="flex flex-col">
            {HELP_ARTICLES.map((a) => (
              <li key={a.id}>
                <a
                  href={a.href}
                  className="group flex items-center gap-3 py-2.5 border-t border-mm-border first:border-t-0"
                >
                  <span className="flex-1 text-[14px] text-mm-ink group-hover:text-mm-coral transition truncate">
                    {a.title}
                  </span>
                  <span className="font-mono font-medium text-[11px] text-mm-ink-3 px-2 py-0.5 rounded-full border border-mm-border bg-mm-paper flex-shrink-0">
                    {a.tag}
                  </span>
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.8}
                    className="text-mm-ink-4 group-hover:text-mm-coral transition flex-shrink-0"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Section>

        {/* Frequently asked */}
        <Section title={c.faqH}>
          <div className="flex flex-col">
            {HELP_FAQS.map((f) => (
              <details
                key={f.id}
                className="group border-t border-mm-border first:border-t-0"
              >
                <summary className="flex items-center gap-3 cursor-pointer list-none py-2.5 text-[14px] font-medium text-mm-ink [&::-webkit-details-marker]:hidden">
                  <span className="flex-1">{f.q}</span>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                    className="text-mm-ink-3 transition-transform group-open:rotate-180 flex-shrink-0"
                  />
                </summary>
                <p className="m-0 pb-3 pr-7 text-[13.5px] leading-[1.55] text-mm-ink-2">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </Section>
      </div>

      {/* Still stuck — full width */}
      <ContactCard copy={copy} />
    </>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-mm-surface border border-mm-border rounded-[16px] p-[22px] shadow-[var(--mm-shadow-soft)]">
    <h2 className="m-0 mb-2 font-semibold text-[16px] tracking-[-0.02em]">{title}</h2>
    {children}
  </div>
);

export default Help;
