// Adapter so admin pages can keep the shadcn-style `useToast()` call shape
// while rendering through react-hot-toast (whose <Toaster/> is in the root layout).
import hotToast from "react-hot-toast";

type ToastArgs = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

const toastFn = ({ title, description, variant }: ToastArgs) => {
  const msg = description || title || "";
  if (variant === "destructive") hotToast.error(msg);
  else hotToast.success(msg);
};

export function useToast() {
  return { toast: toastFn };
}

export const toast = hotToast;
