import { useNavigate, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { useLocale } from "../../../helpers/useLocale";
import { PATH_BY_LOCALE, LOCALE_BY_PATH } from "../../../constants/copy";
import { setLocale } from "../../../store/ui/slice";

const LangToggle = () => {
  const locale = useLocale();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const switchTo = (next) => {
    if (next === locale) return;
    const first = pathname.split("/").filter(Boolean)[0];
    const isLocalePrefixed = !!LOCALE_BY_PATH[first];
    if (isLocalePrefixed) {
      navigate("/" + PATH_BY_LOCALE[next]);
    } else {
      dispatch(setLocale(next));
    }
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
