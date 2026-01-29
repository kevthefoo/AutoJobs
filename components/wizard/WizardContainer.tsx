"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WizardData, DEFAULT_WIZARD_DATA, DocType } from "@/lib/types";
import { createProject, saveProject, getProject } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import StepBasics from "./StepBasics";
import StepFeatures from "./StepFeatures";
import StepTech from "./StepTech";
import StepDesign from "./StepDesign";
import StepReview from "./StepReview";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEP_LABELS = ["Basics", "Features", "Tech", "Design", "Review"];

interface Props {
  projectId?: string;
}

export default function WizardContainer({ projectId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(DEFAULT_WIZARD_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (projectId) {
      const project = getProject(projectId);
      if (project) setData(project.wizardData);
    }
  }, [projectId]);

  const handleGenerate = async (docTypes: DocType[]) => {
    setIsGenerating(true);
    setError("");

    try {
      const project = projectId ? getProject(projectId) : createProject(data);
      if (!project) throw new Error("Failed to create project");

      for (const docType of docTypes) {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wizardData: data, docType }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Generation failed");
        }

        const result = await res.json();
        if (docType === "prd") project.generatedPRD = result.content;
        if (docType === "tdd") project.generatedTDD = result.content;
      }

      project.wizardData = data;
      saveProject(project);
      router.push(`/project/${project.id}`);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Project</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <button
              onClick={() => setStep(i)}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
            <span className={`ml-1 text-xs hidden sm:inline ${i === step ? "font-medium" : "text-muted-foreground"}`}>{label}</span>
            {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-primary/40" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 mb-4 text-sm">{error}</div>}

      {/* Step Content */}
      {step === 0 && <StepBasics data={data.basics} onChange={(basics) => setData({ ...data, basics })} />}
      {step === 1 && <StepFeatures data={data.features} onChange={(features) => setData({ ...data, features })} />}
      {step === 2 && <StepTech data={data.tech} onChange={(tech) => setData({ ...data, tech })} />}
      {step === 3 && <StepDesign data={data.design} onChange={(design) => setData({ ...data, design })} />}
      {step === 4 && <StepReview data={data} onGenerate={handleGenerate} isGenerating={isGenerating} onEditStep={setStep} />}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button onClick={() => setStep(step + 1)}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
