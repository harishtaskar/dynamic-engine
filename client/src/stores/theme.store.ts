import { create } from "zustand";

export type Theme =
  | "dark"
  | "light"
  | "high-contrast";

const themes: Theme[] = [
  "dark",
  "light",
  "high-contrast",
];

const storageKey =
  "dynamic-engine-theme";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
  initTheme: () => void;
}

function readInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored =
    window.localStorage.getItem(
      storageKey,
    ) as Theme | null;

  return stored &&
    themes.includes(stored)
    ? stored
    : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute(
    "data-theme",
    theme,
  );
}

export const useThemeStore =
  create<ThemeState>((set, get) => ({
    theme: readInitialTheme(),

    setTheme: (theme) => {
      applyTheme(theme);

      window.localStorage.setItem(
        storageKey,
        theme,
      );

      set({ theme });
    },

    cycleTheme: () => {
      const current = get().theme;

      const next =
        themes[
          (themes.indexOf(current) +
            1) %
            themes.length
        ];

      get().setTheme(next);
    },

    initTheme: () => {
      applyTheme(get().theme);
    },
  }));
