"use client";

import { WizardData, DocType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function displayTech(values: string[]): string {
  if (values.includes("__ai_decide__")) return "AI will decide";
  const clean = values.filter((v) => v !== "__ai_decide__");
  return clean.length > 0 ? clean.join(", ") : "—";
}
import { useState } from "react";

interface Props {
  data: WizardData;
  onGenerate: (docTypes: DocType[]) => void;
  isGenerating: boolean;
  onEditStep: (step: number) => void;
}

export default function StepReview({ data, onGenerate, isGenerating, onEditStep }: Props) {
  const [selectedDocs, setSelectedDocs] = useState<DocType[]>(["prd", "tdd"]);

  const toggleDoc = (doc: DocType) => {
    setSelectedDocs((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const mustHave = data.features.features.filter((f) => f.priority === "must-have");
  const niceToHave = data.features.features.filter((f) => f.priority === "nice-to-have");

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Review & Generate</h2>

      {/* Basics */}
      <section className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Project Basics</h3>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(0)}>Edit</Button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-muted-foreground">Name:</span> {data.basics.name || "—"}</div>
          <div><span className="text-muted-foreground">Type:</span> {data.basics.appType}</div>
          <div className="col-span-2"><span className="text-muted-foreground">Description:</span> {data.basics.description || "—"}</div>
          <div><span className="text-muted-foreground">Audience:</span> {data.basics.targetAudience || "—"}</div>
          <div className="col-span-2"><span className="text-muted-foreground">Problem:</span> {data.basics.coreProblem || "—"}</div>
        </div>
      </section>

      {/* Features */}
      <section className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Features & Requirements</h3>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(1)}>Edit</Button>
        </div>
        <div className="text-sm space-y-1">
          <p><span className="text-muted-foreground">Must-Have:</span> {mustHave.length > 0 ? mustHave.map((f) => f.name).join(", ") : "—"}</p>
          <p><span className="text-muted-foreground">Nice-to-Have:</span> {niceToHave.length > 0 ? niceToHave.map((f) => f.name).join(", ") : "—"}</p>
          <p><span className="text-muted-foreground">Personas:</span> {data.features.personas.length > 0 ? data.features.personas.map((p) => p.name).join(", ") : "—"}</p>
          <p><span className="text-muted-foreground">User Flows:</span> {data.features.userFlows.length > 0 ? data.features.userFlows.map((f) => f.title).join(", ") : "—"}</p>
        </div>
      </section>

      {/* Tech */}
      <section className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Technical Preferences</h3>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(2)}>Edit</Button>
        </div>
        <div className="text-sm space-y-1">
          <p><span className="text-muted-foreground">Language:</span> {displayTech(data.tech.language)}</p>
          <p><span className="text-muted-foreground">Framework:</span> {displayTech(data.tech.framework)}</p>
          <p><span className="text-muted-foreground">UI/UX:</span> {displayTech(data.tech.uiux)}</p>
          <p><span className="text-muted-foreground">Database:</span> {displayTech(data.tech.database)}</p>
          <p><span className="text-muted-foreground">Storage:</span> {displayTech(data.tech.storage)}</p>
          <p><span className="text-muted-foreground">CI/CD:</span> {displayTech(data.tech.cicd)}</p>
          <p><span className="text-muted-foreground">Payment:</span> {displayTech(data.tech.payment)}</p>
          <p><span className="text-muted-foreground">Integrations:</span> {displayTech(data.tech.integrations)}</p>
          <p><span className="text-muted-foreground">Performance:</span> {displayTech(data.tech.performanceRequirements)}</p>
          <p><span className="text-muted-foreground">Auth Needs:</span> {displayTech(data.tech.authNeeds)}</p>
          <p><span className="text-muted-foreground">Auth Method:</span> {displayTech(data.tech.authMethod)}</p>
        </div>
      </section>

      {/* Design */}
      <section className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Design & UX</h3>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(3)}>Edit</Button>
        </div>
        <div className="text-sm space-y-1">
          <p><span className="text-muted-foreground">Style:</span> {data.design.uiStyle}</p>
          <p><span className="text-muted-foreground">Responsive:</span> {data.design.responsiveRequirements || "—"}</p>
          <p><span className="text-muted-foreground">Accessibility:</span> {data.design.accessibilityNeeds || "—"}</p>
          <p><span className="text-muted-foreground">References:</span> {data.design.referenceApps || "—"}</p>
        </div>
      </section>

      {/* Generate */}
      <section className="border rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-semibold">Generate Documents</h3>
        <div className="flex gap-3">
          <button
            onClick={() => toggleDoc("prd")}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${selectedDocs.includes("prd") ? "bg-primary text-primary-foreground" : "bg-background"}`}
          >
            PRD (Product Requirements)
          </button>
          <button
            onClick={() => toggleDoc("tdd")}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${selectedDocs.includes("tdd") ? "bg-primary text-primary-foreground" : "bg-background"}`}
          >
            TDD (Technical Design)
          </button>
        </div>
        <Button
          size="lg"
          disabled={selectedDocs.length === 0 || isGenerating}
          onClick={() => onGenerate(selectedDocs)}
          className="w-full"
        >
          {isGenerating ? "Generating..." : `Generate ${selectedDocs.length} Document${selectedDocs.length !== 1 ? "s" : ""}`}
        </Button>
      </section>
    </div>
  );
}
