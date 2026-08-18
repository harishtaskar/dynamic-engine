import { create } from "zustand";

export type ToastVariant =
  | "success"
  | "error"
  | "info";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];

  addToast: (toast: {
    message: string;
    variant: ToastVariant;
  }) => void;

  removeToast: (id: string) => void;
}

const dismissAfter = 4000;

export const useToastStore =
  create<ToastState>((set, get) => ({
    toasts: [],

    addToast: (toast) => {
      const id =
        crypto.randomUUID();

      set((state) => ({
        toasts: [
          ...state.toasts,
          { id, ...toast },
        ],
      }));

      window.setTimeout(() => {
        get().removeToast(id);
      }, dismissAfter);
    },

    removeToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter(
          (toast) => toast.id !== id,
        ),
      })),
  }));
