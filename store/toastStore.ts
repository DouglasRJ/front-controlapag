import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: number) => void;
}

const DEFAULT_DURATION = 3000;
let toastId = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (message, type, duration = DEFAULT_DURATION) => {
    const id = toastId++;
    const newToast: Toast = { id, message, type, duration };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export const showToast = useToastStore.getState().addToast;
