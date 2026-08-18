import { useEffect } from "react";
import { MotionConfig } from "framer-motion";

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
      <div className="app-ambient flex h-screen items-center justify-center bg-canvas text-muted" />
    </MotionConfig>
  );
}
