"use client";

import { useTheme } from "@client/hooks/useTheme";
import { Toaster } from "sonner";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={theme as "light" | "dark" | "system"}
      richColors
      closeButton
      expand={false}
      visibleToasts={3}
      toastOptions={{
        classNames: {
          toast: "border border-gray-200 dark:border-gray-800",
          title: "font-semibold",
          description: "text-sm opacity-90",
          actionButton: "bg-blue-600 text-white",
          cancelButton: "bg-gray-200 dark:bg-gray-800",
        },
      }}
    />
  );
}
