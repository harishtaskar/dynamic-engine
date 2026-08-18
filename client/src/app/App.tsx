import { useEffect } from "react";
import { MotionConfig } from "framer-motion";

import { DashboardWorkspace } from "../features/generation/DashboardWorkspace";
import { ToastViewport } from "../components/toast/ToastViewport";
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
      <DashboardWorkspace />
      <ToastViewport />
    </MotionConfig>
  );
}
