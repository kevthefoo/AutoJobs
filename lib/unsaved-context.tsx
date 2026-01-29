"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface UnsavedContextValue {
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  pendingHref: string | null;
  setPendingHref: (href: string | null) => void;
}

const UnsavedContext = createContext<UnsavedContextValue>({
  isDirty: false,
  setDirty: () => {},
  pendingHref: null,
  setPendingHref: () => {},
});

export function UnsavedProvider({ children }: { children: ReactNode }) {
  const [isDirty, setDirty] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  return (
    <UnsavedContext.Provider value={{ isDirty, setDirty, pendingHref, setPendingHref }}>
      {children}
    </UnsavedContext.Provider>
  );
}

export function useUnsaved() {
  return useContext(UnsavedContext);
}
