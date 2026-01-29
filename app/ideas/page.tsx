"use client";

import { useEffect, useState } from "react";
import { Idea } from "@/lib/types";
import { getIdeas, createIdea, deleteIdea, saveIdea } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, X } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setIdeas(getIdeas());
  }, []);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createIdea(newTitle.trim(), newContent.trim());
    setNewTitle("");
    setNewContent("");
    setShowNew(false);
    setIdeas(getIdeas());
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteIdea(deleteId);
    setIdeas(getIdeas());
    setDeleteId(null);
    toast.success("Idea deleted");
  };

  const handleUpdate = (idea: Idea) => {
    saveIdea(idea);
    setEditingId(null);
    setIdeas(getIdeas());
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Ideas</h1>
          <p className="text-muted-foreground mt-1">Quick notes and app ideas for later</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="w-4 h-4 mr-2" /> New Idea</Button>
      </div>

      {/* New Idea Form */}
      {showNew && (
        <div className="border rounded-lg p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">New Idea</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowNew(false)}><X className="w-4 h-4" /></Button>
          </div>
          <Input placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <Textarea placeholder="Describe your idea..." value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} />
          <Button onClick={handleCreate} disabled={!newTitle.trim()}>Save Idea</Button>
        </div>
      )}

      {ideas.length === 0 && !showNew ? (
        <div className="text-center py-20 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-4">No ideas yet. Jot one down!</p>
          <Button onClick={() => setShowNew(true)}><Plus className="w-4 h-4 mr-2" /> New Idea</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="border rounded-lg p-4 space-y-2 hover:border-primary/40 transition-colors">
              {editingId === idea.id ? (
                <div className="space-y-3">
                  <Input
                    value={idea.title}
                    onChange={(e) => setIdeas(ideas.map((i) => i.id === idea.id ? { ...i, title: e.target.value } : i))}
                  />
                  <Textarea
                    value={idea.content}
                    onChange={(e) => setIdeas(ideas.map((i) => i.id === idea.id ? { ...i, content: e.target.value } : i))}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(idea)}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setIdeas(getIdeas()); }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold cursor-pointer hover:text-primary" onClick={() => setEditingId(idea.id)}>{idea.title}</h3>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(idea.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  {idea.content && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap cursor-pointer" onClick={() => setEditingId(idea.id)}>{idea.content}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{new Date(idea.updatedAt).toLocaleDateString()}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete idea?"
        description="This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
