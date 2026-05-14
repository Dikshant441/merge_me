import { createSlice } from "@reduxjs/toolkit";

const THEME_KEY = "mm.theme";

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
  },
});

export const { setTheme, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
