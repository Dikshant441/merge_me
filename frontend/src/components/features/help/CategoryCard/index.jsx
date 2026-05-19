import { Rocket, User, GitMerge, Code, Shield, CreditCard } from "lucide-react";

// One help category. Hover lifts 1px and swaps paper→surface bg.
// `color` ("coral" | "amber" | "violet") drives the corner radial tint
// + the icon stroke color.

const ICONS = {
  rocket: Rocket,
  user: User,
  merge: GitMerge,
  code: Code,
  shield: Shield,
  card: CreditCard,
};

const COLOR_TINT = {
  coral:  "mm-cat-tint-coral",
  amber:  "mm-cat-tint-amber",
  violet: "mm-cat-tint-violet",
};

const COLOR_TEXT = {
  coral:  "text-mm-coral",
  amber:  "text-mm-amber",
  violet: "text-mm-violet",
};

const CategoryCard = ({ category, copy }) => {
  const Icon = ICONS[category.icon] || Code;
  return (
    <button
      type="button"
      className={[
        "mm-cat-card text-left bg-mm-paper border border-mm-border rounded-[12px] p-4 flex flex-col gap-3",
        "transition hover:-translate-y-px hover:border-mm-border-2 hover:bg-mm-surface",
        COLOR_TINT[category.color] || "",
      ].join(" ")}
    >
      <span
        className={[
          "w-[34px] h-[34px] rounded-[10px] bg-mm-surface border border-mm-border inline-flex items-center justify-center",
          COLOR_TEXT[category.color] || "text-mm-ink",
        ].join(" ")}
      >
        <Icon size={16} strokeWidth={1.7} />
      </span>
      <div>
        <div className="font-semibold text-[15px] tracking-[-0.01em]">{category.title}</div>
        <p className="m-0 mt-0.5 text-mm-ink-2 text-[13px] leading-[1.5]">{category.sub}</p>
      </div>
      <div className="mt-auto pt-2 font-mono font-medium text-[11.5px] text-mm-ink-3 flex items-center justify-between">
        <span>
          {category.articles}
          {copy.app.help.catCount}
        </span>
        <span className="text-mm-ink-4">→</span>
      </div>
    </button>
  );
};

export default CategoryCard;
