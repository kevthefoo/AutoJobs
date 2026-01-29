"use client";

import { useEffect, useState } from "react";
import { TechTemplate } from "@/lib/types";
import { getTechTemplates, deleteTechTemplate } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

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

    useEffect(() => {
        setTemplates(getTechTemplates());
    }, []);

    const handleDelete = (id: string) => {
        deleteTechTemplate(id);
        setTemplates(getTechTemplates());
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
                    {templates.map((t) => (
                        <div key={t.id} className="border rounded-lg p-4 space-y-3 hover:border-primary/40 transition-colors">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{t.name}</h3>
                                    {t.description && (
                                        <p className="text-sm text-muted-foreground">{t.description}</p>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                {Object.entries(FIELD_LABELS).map(([key, label]) => {
                                    const values = t.tech[key as keyof typeof t.tech] as string[];
                                    if (!values || values.length === 0) return null;
                                    return (
                                        <div key={key}>
                                            <span className="text-muted-foreground">{label}:</span>{" "}
                                            {values.map((v) => (
                                                <Badge key={v} variant="secondary" className="mr-1 mb-1 text-xs">{v}</Badge>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Created {new Date(t.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
