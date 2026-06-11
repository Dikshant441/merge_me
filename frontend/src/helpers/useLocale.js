import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { DEFAULT_LOCALE, LOCALE_BY_PATH } from "../constants/copy";

// URL prefix takes priority (/en-in, /hi-in); falls back to the stored Redux
// preference (set by LangToggle on non-landing pages) or DEFAULT_LOCALE.
export const useLocale = () => {
  const { pathname } = useLocation();
  const first = pathname.split("/").filter(Boolean)[0];
  const fromUrl = LOCALE_BY_PATH[first];
  const stored = useSelector((s) => s.ui.locale);
  return fromUrl || stored || DEFAULT_LOCALE;
};
