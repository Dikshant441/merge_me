import { useLocation } from "react-router";
import { DEFAULT_LOCALE, LOCALE_BY_PATH } from "../constants/copy";

// Read the locale from the URL — "/en-in/..." → "en", "/hi-in/..." → "hi".
// Any unknown or missing segment falls back to DEFAULT_LOCALE.
export const useLocale = () => {
  const { pathname } = useLocation();
  const first = pathname.split("/").filter(Boolean)[0];
  return LOCALE_BY_PATH[first] || DEFAULT_LOCALE;
};
