import { useEffect } from "react";
import { MotionConfig } from "framer-motion";

import { AppShell } from "../components/layout/AppShell";
import { Sidebar } from "../components/layout/Sidebar";
import { HistoryPanel } from "../components/layout/HistoryPanel";

import { useThemeStore } from "../stores/theme.store";

export function App() {
  const initTheme =
    useThemeStore(
      (state) => state.initTheme,
    );

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <MotionConfig reducedMotion="user">
      <AppShell
        sidebar={<Sidebar />}
        history={<HistoryPanel />}
      >
        {/*
          The workspace plate is empty until the dashboard feature lands; the
          bottom padding is already the composer's footprint.
        */}
        <div className="w-full px-8 pt-4 pb-40" />
      </AppShell>
    </MotionConfig>
  );
}
