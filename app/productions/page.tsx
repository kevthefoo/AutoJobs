"use client";

import { useEffect, useState } from "react";
import { Production, PLATFORM_OPTIONS, PRODUCTION_STATUS_OPTIONS } from "@/lib/types";
import { getProductions, createProduction, deleteProduction, saveProduction } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X, ExternalLink, Pencil } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  live: "bg-green-600",
  beta: "bg-yellow-600",
  archived: "bg-gray-600",
  maintenance: "bg-orange-600",
};

function ProductionCard({
  production,
  editingId,
  setEditingId,
  productions,
  setProductions,
  handleUpdate,
  handleDelete,
  handleCancelEdit,
}: {
  production: Production;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  productions: Production[];
  setProductions: (p: Production[]) => void;
  handleUpdate: (p: Production) => void;
  handleDelete: (id: string) => void;
  handleCancelEdit: () => void;
}) {
  if (editingId === production.id) {
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Edit Production</h3>
          <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <ProductionForm
          value={production}
          onChange={(updated) => setProductions(productions.map((p) => (p.id === production.id ? { ...p, ...updated } : p)))}
          onSubmit={() => handleUpdate(production)}
          submitLabel="Save"
        />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-2 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">{production.name}</h3>
            <Badge className={STATUS_COLORS[production.status] || ""}>{production.status}</Badge>
            <Badge variant="outline">{production.platform}</Badge>
            {production.version && <Badge variant="secondary">v{production.version}</Badge>}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {production.url && (
            <a href={production.url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon"><ExternalLink className="w-4 h-4" /></Button>
            </a>
          )}
          <Button variant="ghost" size="icon" onClick={() => setEditingId(production.id)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(production.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {production.description && (
        <p className="text-sm text-muted-foreground">{production.description}</p>
      )}
      {production.notes && (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{production.notes}</p>
      )}
      {production.screenshotUrls && production.screenshotUrls.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {production.screenshotUrls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
              Screenshot {i + 1}
            </a>
          ))}
        </div>
      )}
      <div className="flex gap-3 text-xs text-muted-foreground">
        {production.releaseDate && <span>Released: {production.releaseDate}</span>}
        <span>Updated: {new Date(production.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

function ProductionForm({
  value,
  onChange,
  onSubmit,
  submitLabel,
}: {
  value: Partial<Production>;
  onChange: (v: Partial<Production>) => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  const [screenshotInput, setScreenshotInput] = useState("");

  return (
    <div className="space-y-3">
      <Input
        placeholder="App name *"
        value={value.name || ""}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <Input
        placeholder="URL (optional)"
        value={value.url || ""}
        onChange={(e) => onChange({ ...value, url: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Select value={value.platform || "Web"} onChange={(e) => onChange({ ...value, platform: e.target.value })}>
          {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </Select>
        <Select value={value.status || "live"} onChange={(e) => onChange({ ...value, status: e.target.value })}>
          {PRODUCTION_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Version (optional)"
          value={value.version || ""}
          onChange={(e) => onChange({ ...value, version: e.target.value })}
        />
        <Input
          type="date"
          placeholder="Release date"
          value={value.releaseDate || ""}
          onChange={(e) => onChange({ ...value, releaseDate: e.target.value })}
        />
      </div>
      <Input
        placeholder="Short description (optional)"
        value={value.description || ""}
        onChange={(e) => onChange({ ...value, description: e.target.value })}
      />
      <Textarea
        placeholder="Notes..."
        value={value.notes || ""}
        onChange={(e) => onChange({ ...value, notes: e.target.value })}
        rows={3}
      />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Screenshot URL"
            value={screenshotInput}
            onChange={(e) => setScreenshotInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && screenshotInput.trim()) {
                onChange({ ...value, screenshotUrls: [...(value.screenshotUrls || []), screenshotInput.trim()] });
                setScreenshotInput("");
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!screenshotInput.trim()}
            onClick={() => {
              onChange({ ...value, screenshotUrls: [...(value.screenshotUrls || []), screenshotInput.trim()] });
              setScreenshotInput("");
            }}
          >
            Add
          </Button>
        </div>
        {value.screenshotUrls && value.screenshotUrls.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {value.screenshotUrls.map((url, i) => (
              <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => {
                onChange({ ...value, screenshotUrls: value.screenshotUrls!.filter((_, j) => j !== i) });
              }}>
                Screenshot {i + 1} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Button onClick={onSubmit} disabled={!(value.name || "").trim()}>{submitLabel}</Button>
    </div>
  );
}

export default function ProductionsPage() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState<Partial<Production>>({ platform: "Web", status: "live", notes: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    getProductions().then(setProductions);
  }, []);

  const handleCreate = async () => {
    if (!(newData.name || "").trim()) return;
    await createProduction({
      name: newData.name!.trim(),
      url: newData.url || undefined,
      platform: newData.platform || "Web",
      status: newData.status || "live",
      version: newData.version || undefined,
      releaseDate: newData.releaseDate || undefined,
      description: newData.description || undefined,
      notes: newData.notes || "",
      screenshotUrls: newData.screenshotUrls,
    });
    setNewData({ platform: "Web", status: "live", notes: "" });
    setShowNew(false);
    setProductions(await getProductions());
    toast.success("Production added");
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteProduction(deleteId);
    setProductions(await getProductions());
    setDeleteId(null);
    toast.success("Production deleted");
  };

  const handleUpdate = async (production: Production) => {
    await saveProduction(production);
    setEditingId(null);
    setProductions(await getProductions());
    toast.success("Production updated");
  };

  const handleCancelEdit = async () => {
    setEditingId(null);
    setProductions(await getProductions());
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Production</h1>
          <p className="text-muted-foreground mt-1">Track your published and deployed apps</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="w-4 h-4 mr-2" /> New Production</Button>
      </div>

      {showNew && (
        <div className="border rounded-lg p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">New Production</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowNew(false)}><X className="w-4 h-4" /></Button>
          </div>
          <ProductionForm
            value={newData}
            onChange={setNewData}
            onSubmit={handleCreate}
            submitLabel="Add Production"
          />
        </div>
      )}

      {productions.length === 0 && !showNew ? (
        <div className="text-center py-20 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-4">No productions yet. Add your first deployed app!</p>
          <Button onClick={() => setShowNew(true)}><Plus className="w-4 h-4 mr-2" /> New Production</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productions.map((production) => (
            <ProductionCard
              key={production.id}
              production={production}
              editingId={editingId}
              setEditingId={setEditingId}
              productions={productions}
              setProductions={setProductions}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              handleCancelEdit={handleCancelEdit}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete production?"
        description="This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
