"use client";

import { ReactNode } from "react";
import { UnsavedProvider } from "@/lib/unsaved-context";
import UnsavedWarning from "@/components/UnsavedWarning";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <UnsavedProvider>
      {children}
      <UnsavedWarning />
    </UnsavedProvider>
  );
}
