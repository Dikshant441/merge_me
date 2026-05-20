import { useNavigate } from "react-router";
import { useLocale } from "../../../helpers/useLocale";
import { PATH_BY_LOCALE } from "../../../constants/copy";

// Two-state toggle between the supported locales. Switches the URL segment
// (/en-in ↔ /hi-in) so useLocale() picks up the change everywhere.
const LangToggle = () => {
  const locale = useLocale();
  const navigate = useNavigate();

  const switchTo = (next) => {
    if (next === locale) return;
    navigate("/" + PATH_BY_LOCALE[next]);
  };

  const optionClass = (isActive) =>
    [
      "px-2.5 h-8 inline-flex items-center justify-center rounded-[8px]",
      "font-mono font-medium text-xs transition",
      isActive
        ? "bg-mm-ink text-mm-bg"
        : "text-mm-ink-2 hover:text-mm-ink",
    ].join(" ");

  return (
    <div
      role="group"
      aria-label="Language"
      className="h-10 px-1 inline-flex items-center gap-1 border border-mm-border-2 rounded-[12px] bg-mm-surface"
    >
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        className={optionClass(locale === "en")}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchTo("hi")}
        aria-pressed={locale === "hi"}
        className={optionClass(locale === "hi")}
      >
        हिं
      </button>
    </div>
  );
};

export default LangToggle;
