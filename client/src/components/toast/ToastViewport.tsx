import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  CheckCircle2,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import {
  useToastStore,
  type ToastVariant,
} from "../../stores/toast.store";

const icons: Record<
  ToastVariant,
  LucideIcon
> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const accents: Record<
  ToastVariant,
  string
> = {
  success: "text-success",
  error: "text-danger",
  info: "text-accent",
};

export function ToastViewport() {
  const toasts = useToastStore(
    (state) => state.toasts,
  );

  const removeToast = useToastStore(
    (state) => state.removeToast,
  );

  return (
    <div
      className="pointer-events-none fixed bottom-8 right-4 z-50 flex w-80 flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon =
            icons[toast.variant];

          return (
            <motion.button
              key={toast.id}
              type="button"
              layout
              initial={{
                opacity: 0,
                y: 12,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: 24,
              }}
              transition={{
                duration: 0.18,
              }}
              onClick={() =>
                removeToast(toast.id)
              }
              className="pointer-events-auto flex w-full items-start gap-3 rounded-xl bg-elevated p-3 text-left text-[13px] text-fg shadow-2xl ring-1 ring-border"
            >
              <Icon
                className={`mt-0.5 size-4 shrink-0 ${accents[toast.variant]}`}
              />

              <span className="flex-1">
                {toast.message}
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
