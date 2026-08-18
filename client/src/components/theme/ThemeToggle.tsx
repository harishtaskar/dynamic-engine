import {
  Contrast,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { motion } from "framer-motion";

import {
  useThemeStore,
  type Theme,
} from "../../stores/theme.store";

const icons: Record<Theme, LucideIcon> = {
  dark: Sun,
  light: Moon,
  "high-contrast": Contrast,
};

const labels: Record<Theme, string> = {
  dark: "Dark",
  light: "Light",
  "high-contrast": "High contrast",
};

export function ThemeToggle() {
  const theme = useThemeStore(
    (state) => state.theme,
  );

  const cycleTheme = useThemeStore(
    (state) => state.cycleTheme,
  );

  // The glyph names the theme you'd switch *to*, which is why dark shows a sun.
  const Icon = icons[theme];

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={cycleTheme}
      aria-label={`Theme: ${labels[theme]}. Click to switch.`}
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-elevated text-fg transition hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="size-3.5" />
    </motion.button>
  );
}
