import { create } from "zustand";

interface UiState {
  historyCollapsed: boolean;
  toggleHistory: () => void;

  /*
    Which sidebar investigation is currently on screen. Several investigations
    resolve to the same generated board, so this cannot be derived from the
    dashboard itself — the selection is its own piece of state. Null means the
    board came from the composer rather than the menu, and no row is lit.
  */
  activeInvestigation: string | null;

  setActiveInvestigation: (
    label: string | null,
  ) => void;
}

export const useUiStore =
  create<UiState>((set) => ({
    historyCollapsed: false,

    toggleHistory: () =>
      set((state) => ({
        historyCollapsed:
          !state.historyCollapsed,
      })),

    activeInvestigation:
      "High Risk Accounts Review",

    setActiveInvestigation: (label) =>
      set({
        activeInvestigation: label,
      }),
  }));
