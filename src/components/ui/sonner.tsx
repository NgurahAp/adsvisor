"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const toastClassNames = {
  toast:
    "group toast group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:bg-white group-[.toaster]:text-[#1a1c31] group-[.toaster]:shadow-lg",
  description: "group-[.toast]:text-slate-500",
  actionButton:
    "group-[.toast]:bg-[#E63946] group-[.toast]:text-white group-[.toast]:font-semibold",
  cancelButton:
    "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 group-[.toast]:font-semibold",
};

function Toaster({
  theme = "light",
  position = "top-center",
  closeButton = true,
  richColors = true,
  toastOptions,
  ...props
}: ToasterProps) {
  return (
    <Sonner
      theme={theme}
      position={position}
      closeButton={closeButton}
      richColors={richColors}
      className="toaster group"
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastClassNames,
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
