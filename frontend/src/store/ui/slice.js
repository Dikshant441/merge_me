import { createSlice } from "@reduxjs/toolkit";

const THEME_KEY = "mm.theme";
const LOCALE_KEY = "mm.locale";

const readInitialLocale = () => {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(LOCALE_KEY);
  return saved === "hi" ? "hi" : "en";
};

const readInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: readInitialTheme(),
    locale: readInitialLocale(),
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      window.localStorage.setItem(THEME_KEY, action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, state.theme);
    },
    setLocale: (state, action) => {
      state.locale = action.payload;
      window.localStorage.setItem(LOCALE_KEY, action.payload);
    },
  },
});

export const { setTheme, toggleTheme, setLocale } = uiSlice.actions;
export default uiSlice.reducer;
