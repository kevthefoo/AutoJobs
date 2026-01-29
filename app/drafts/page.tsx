"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Draft } from "@/lib/types";
import { getDrafts, createDraft, deleteDraft } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileEdit } from "lucide-react";
import Link from "next/link";

const STEP_LABELS = ["Basics", "Features", "Tech", "Design", "Review"];

export default function DraftsPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  const handleNew = () => {
    const draft = createDraft();
    router.push(`/drafts/${draft.id}`);
  };

  const handleDelete = (id: string) => {
    deleteDraft(id);
    setDrafts(getDrafts());
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Drafts</h1>
          <p className="text-muted-foreground mt-1">In-progress wizard sessions saved for later</p>
        </div>
        <Button onClick={handleNew}><Plus className="w-4 h-4 mr-2" /> New Draft</Button>
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-20 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-4">No drafts yet. Start one to save your progress!</p>
          <Button onClick={handleNew}><Plus className="w-4 h-4 mr-2" /> New Draft</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drafts.map((d) => (
            <div key={d.id} className="border rounded-lg p-4 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{d.wizardData.basics.name || "Untitled Draft"}</h3>
                  <p className="text-sm text-muted-foreground">{d.wizardData.basics.description || "No description"}</p>
                </div>
                <Badge variant="secondary">{STEP_LABELS[d.currentStep]}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Updated {new Date(d.updatedAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Link href={`/drafts/${d.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full"><FileEdit className="w-3 h-3 mr-1" /> Continue</Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
