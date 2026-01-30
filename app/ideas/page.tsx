"use client";

import { useEffect, useState } from "react";
import { Idea } from "@/lib/types";
import { getIdeas, createIdea, deleteIdea, saveIdea, saveIdeas } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, X, GripVertical } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableIdeaCardProps {
  idea: Idea;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  ideas: Idea[];
  setIdeas: (ideas: Idea[]) => void;
  handleUpdate: (idea: Idea) => void;
  handleDelete: (id: string) => void;
  handleCancelEdit: () => void;
}

function SortableIdeaCard({
  idea,
  editingId,
  setEditingId,
  ideas,
  setIdeas,
  handleUpdate,
  handleDelete,
  handleCancelEdit,
}: SortableIdeaCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: idea.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 space-y-2 hover:border-primary/40 transition-colors flex flex-col"
    >
      {editingId === idea.id ? (
        <div className="space-y-3">
          <Input
            value={idea.title}
            onChange={(e) =>
              setIdeas(ideas.map((i) => (i.id === idea.id ? { ...i, title: e.target.value } : i)))
            }
          />
          <Textarea
            value={idea.content}
            onChange={(e) =>
              setIdeas(ideas.map((i) => (i.id === idea.id ? { ...i, content: e.target.value } : i)))
            }
            rows={4}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleUpdate(idea)}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <button
                className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="w-4 h-4" />
              </button>
              <h3
                className="font-semibold cursor-pointer hover:text-primary truncate"
                onClick={() => setEditingId(idea.id)}
              >
                {idea.title}
              </h3>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => handleDelete(idea.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          {idea.content && (
            <p
              className="text-sm text-muted-foreground whitespace-pre-wrap cursor-pointer"
              onClick={() => setEditingId(idea.id)}
            >
              {idea.content}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{new Date(idea.updatedAt).toLocaleDateString()}</p>
        </>
      )}
    </div>
  );
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    getIdeas().then(setIdeas);
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await createIdea(newTitle.trim(), newContent.trim());
    setNewTitle("");
    setNewContent("");
    setShowNew(false);
    setIdeas(await getIdeas());
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteIdea(deleteId);
    setIdeas(await getIdeas());
    setDeleteId(null);
    toast.success("Idea deleted");
  };

  const handleUpdate = async (idea: Idea) => {
    await saveIdea(idea);
    setEditingId(null);
    setIdeas(await getIdeas());
  };

  const handleCancelEdit = async () => {
    setEditingId(null);
    setIdeas(await getIdeas());
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ideas.findIndex((i) => i.id === active.id);
    const newIndex = ideas.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(ideas, oldIndex, newIndex);
    setIdeas(reordered);
    await saveIdeas(reordered);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ideas.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ideas.map((idea) => (
                <SortableIdeaCard
                  key={idea.id}
                  idea={idea}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  ideas={ideas}
                  setIdeas={setIdeas}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleCancelEdit={handleCancelEdit}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
