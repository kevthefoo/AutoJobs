"use client";

import { useEffect, useState } from "react";
import { TechTemplate, ProjectTech } from "@/lib/types";
import { getTechTemplates, deleteTechTemplate, saveTechTemplate } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil, ChevronDown, ChevronRight } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import StepTech from "@/components/wizard/StepTech";
import { toast } from "sonner";

const FIELD_LABELS: Record<string, string> = {
    language: "Language",
    framework: "Framework",
    uiux: "UI/UX",
    database: "Database",
    storage: "Storage",
    cicd: "CI/CD",
    payment: "Payment",
    integrations: "Integrations",
    performanceRequirements: "Performance",
    authNeeds: "Auth Needs",
    authMethod: "Auth Method",
};

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<TechTemplate[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editTech, setEditTech] = useState<ProjectTech | null>(null);

    useEffect(() => {
        setTemplates(getTechTemplates());
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (!deleteId) return;
        deleteTechTemplate(deleteId);
        setTemplates(getTechTemplates());
        setDeleteId(null);
        toast.success("Template deleted");
    };

    const startEdit = (t: TechTemplate) => {
        setEditingId(t.id);
        setEditName(t.name);
        setEditDesc(t.description);
        setEditTech({ ...t.tech });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTech(null);
    };

    const saveEdit = () => {
        if (!editingId || !editTech) return;
        const t = templates.find((t) => t.id === editingId);
        if (!t) return;
        saveTechTemplate({ ...t, name: editName.trim() || t.name, description: editDesc.trim(), tech: editTech });
        setTemplates(getTechTemplates());
        setEditingId(null);
        setEditTech(null);
        toast.success("Template updated");
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Templates</h1>
                <p className="text-muted-foreground mt-1">
                    Your saved tech preference templates. Create new ones from the Technical Preferences step in the wizard.
                </p>
            </div>

            {templates.length === 0 ? (
                <div className="text-center py-20 border rounded-lg border-dashed">
                    <p className="text-muted-foreground mb-2">No templates yet.</p>
                    <p className="text-muted-foreground text-sm">
                        Go to a project wizard &rarr; Technical Preferences step &rarr; click &quot;Save as template&quot;
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {templates.map((t) =>
                        editingId === t.id && editTech ? (
                            <div key={t.id} className="border rounded-lg p-4 space-y-4 border-primary/40">
                                <div className="space-y-3">
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Template name"
                                    />
                                    <Input
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        placeholder="Description (optional)"
                                    />
                                </div>
                                <StepTech data={editTech} onChange={setEditTech} />
                                <div className="flex gap-2 pt-2">
                                    <Button size="sm" onClick={saveEdit}>Save</Button>
                                    <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div key={t.id} className="border rounded-lg p-4 space-y-3 hover:border-primary/40 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => toggleExpand(t.id)}>
                                        {expandedIds.has(t.id) ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                                        <div>
                                            <h3 className="font-semibold text-lg">{t.name}</h3>
                                            {t.description && (
                                                <p className="text-sm text-muted-foreground">{t.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => startEdit(t)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                {expandedIds.has(t.id) && (
                                    <>
                                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm items-start">
                                            {Object.entries(FIELD_LABELS).map(([key, label]) => {
                                                const values = t.tech[key as keyof typeof t.tech] as string[];
                                                if (!values || values.length === 0) return null;
                                                return (
                                                    <div key={key} className="contents">
                                                        <span className="text-muted-foreground whitespace-nowrap pt-0.5">{label}</span>
                                                        <div className="flex flex-wrap gap-1">
                                                            {values.map((v) => (
                                                                <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Created {new Date(t.createdAt).toLocaleDateString()}
                                        </p>
                                    </>
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
            <ConfirmDialog
                open={!!deleteId}
                title="Delete template?"
                description="This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
