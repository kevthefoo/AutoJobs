"use client";

import { useRouter } from "next/navigation";
import { useUnsaved } from "@/lib/unsaved-context";
import { Button } from "@/components/ui/button";

export default function UnsavedWarning() {
  const router = useRouter();
  const { pendingHref, setPendingHref, setDirty } = useUnsaved();

  if (!pendingHref) return null;

  const handleLeave = () => {
    const href = pendingHref;
    setDirty(false);
    setPendingHref(null);
    router.push(href);
  };

  const handleStay = () => {
    setPendingHref(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleStay} />
      <div className="relative bg-card border rounded-lg p-6 w-full max-w-sm shadow-lg space-y-4">
        <h3 className="text-lg font-semibold">Unsaved changes</h3>
        <p className="text-sm text-muted-foreground">
          You have unsaved changes. If you leave now, your progress will be lost. Save as a draft to keep your work.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleStay}>Stay</Button>
          <Button variant="destructive" size="sm" onClick={handleLeave}>Leave without saving</Button>
        </div>
      </div>
    </div>
  );
}
