import { Edit, X as XIcon, Plus, Github, Linkedin, Check } from "lucide-react";
import CompletenessRing from "../CompletenessRing";

// Overview tab — 2-col grid. Left: About / Stack / Languages. Right:
// Verified accounts / Profile completeness.

const Overview = ({ user, editing, draft, setDraft, copy }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5 items-start">
      <div className="flex flex-col gap-5">
        <Section title={copy.app.profile.sectionAbout}>
          {editing ? (
            <textarea
              value={draft.about || ""}
              onChange={(e) => setDraft({ ...draft, about: e.target.value })}
              className="w-full border border-mm-border-2 rounded-[10px] bg-mm-paper p-3 text-[14px] leading-[1.55] text-mm-ink outline-none resize-y min-h-[100px] focus:border-mm-coral focus:shadow-[0_0_0_4px_oklch(from_var(--mm-coral)_l_c_h_/_.14)]"
            />
          ) : (
            <p className="m-0 text-mm-ink-2 text-[14.5px] leading-[1.6] text-pretty">
              {user.about || "—"}
            </p>
          )}
        </Section>

        <Section title={copy.app.profile.sectionStack}>
          <div className="flex flex-wrap gap-2">
            {(draft.skills || []).map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mm-paper border border-mm-border font-mono font-medium text-[12.5px] text-mm-ink"
              >
                <span>{s}</span>
                {editing && (
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({ ...draft, skills: draft.skills.filter((x) => x !== s) })
                    }
                    className="w-3.5 h-3.5 rounded-full text-mm-ink-3 hover:text-mm-danger inline-flex items-center justify-center"
                    aria-label="remove"
                  >
                    <XIcon size={10} strokeWidth={1.7} />
                  </button>
                )}
              </span>
            ))}
            {editing && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-dashed border-mm-border-2 font-mono font-medium text-[12.5px] text-mm-ink-3 hover:text-mm-ink hover:border-mm-ink-3"
              >
                <Plus size={12} strokeWidth={1.7} /> {copy.app.profile.addSkill}
              </button>
            )}
          </div>
        </Section>

        <Section title={copy.app.profile.sectionLangs}>
          <div className="flex flex-wrap gap-2">
            {(user.langs || []).map((l) => (
              <span
                key={l}
                className="px-3 py-1.5 rounded-full bg-mm-paper border border-mm-border font-medium text-[12.5px] text-mm-ink-2"
              >
                {l}
              </span>
            ))}
          </div>
        </Section>
      </div>

      <div className="flex flex-col gap-5">
        <Section title={copy.app.profile.sectionVerified}>
          <div className="flex flex-col gap-2">
            <VerifyItem
              icon={<Github size={20} strokeWidth={1.7} />}
              source="GitHub"
              meta={`${user.github?.handle || "@—"} · ${user.github?.years || 0}y · ${user.github?.repos || 0} repos`}
              copy={copy}
            />
            <VerifyItem
              icon={<Linkedin size={20} strokeWidth={1.7} className="text-[#0A66C2]" />}
              source="LinkedIn"
              meta={user.linkedin?.title || "—"}
              copy={copy}
            />
            <VerifyItem
              icon={<span className="font-mono font-semibold text-[14px] text-[#F58025]">SO</span>}
              source="Stack Overflow"
              meta={`${(user.stackoverflow?.rep || 0).toLocaleString()} rep · ${user.stackoverflow?.top || "—"}`}
              copy={copy}
            />
            <button
              type="button"
              className="px-3.5 py-3.5 rounded-[10px] border border-dashed border-mm-border-2 bg-transparent text-mm-ink-3 font-medium text-[13px] text-center hover:text-mm-ink"
            >
              + {copy.app.profile.verifyAdd}
            </button>
          </div>
        </Section>

        <Section title={copy.app.profile.completeness}>
          <div className="flex items-center gap-4">
            <CompletenessRing
              pct={user.completeness}
              label={user.completeness + "%"}
              sub={copy.app.profile.ofN}
            />
            <p className="m-0 text-mm-ink-2 text-[13px] leading-[1.5]">
              {copy.app.profile.completenessSub}
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-mm-surface border border-mm-border rounded-[16px] p-[22px] shadow-[var(--mm-shadow-soft)]">
    <h3 className="m-0 mb-3 font-semibold text-[15px] tracking-[-0.01em] flex items-center justify-between">
      {title}
    </h3>
    {children}
  </div>
);

const VerifyItem = ({ icon, source, meta, copy }) => (
  <div className="grid grid-cols-[28px_minmax(0,1fr)_auto] gap-3 items-center p-3 bg-mm-paper border border-mm-border rounded-[10px]">
    <span className="w-7 h-7 inline-flex items-center justify-center text-mm-ink">{icon}</span>
    <div className="leading-[1.3] min-w-0">
      <div className="font-semibold text-[13px]">{source}</div>
      <div className="font-mono font-medium text-[12px] text-mm-ink-3 truncate">{meta}</div>
    </div>
    <span className="text-mm-success font-mono font-medium text-[12px] inline-flex items-center gap-1">
      <Check size={14} strokeWidth={1.7} /> {copy.app.profile.verified}
    </span>
  </div>
);

export default Overview;
