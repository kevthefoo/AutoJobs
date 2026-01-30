"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDraft, saveDraft } from "@/lib/storage";
import { Draft, WizardData, DEFAULT_WIZARD_DATA, DocType } from "@/lib/types";
import { createProject, saveProject } from "@/lib/storage";
import { deleteDraft } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import StepBasics from "@/components/wizard/StepBasics";
import StepFeatures from "@/components/wizard/StepFeatures";
import StepTech from "@/components/wizard/StepTech";
import StepDesign from "@/components/wizard/StepDesign";
import StepReview from "@/components/wizard/StepReview";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useUnsaved } from "@/lib/unsaved-context";

const STEP_LABELS = ["Basics", "Features", "Tech", "Design", "Review"];

export default function DraftEditPage() {
  const params = useParams();
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(DEFAULT_WIZARD_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const { setDirty } = useUnsaved();

  const updateData = (newData: WizardData) => {
    setData(newData);
    setDirty(true);
  };

  useEffect(() => {
    return () => setDirty(false);
  }, [setDirty]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  useEffect(() => {
    getDraft(params.id as string).then((d) => {
      if (!d) { router.push("/drafts"); return; }
      setDraft(d);
      setData(d.wizardData);
      setStep(d.currentStep);
    });
  }, [params.id, router]);

  const handleSave = async () => {
    if (!draft) return;
    await saveDraft({ ...draft, wizardData: data, currentStep: step });
    setDirty(false);
  };

  const handleStepChange = async (newStep: number) => {
    setStep(newStep);
    if (draft) await saveDraft({ ...draft, wizardData: data, currentStep: newStep });
  };

  const handleGenerate = async (docTypes: DocType[]) => {
    setIsGenerating(true);
    setError("");

    try {
      const project = await createProject(data);

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
      await saveProject(project);
      if (draft) await deleteDraft(draft.id);
      setDirty(false);
      router.push(`/project/${project.id}`);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!draft) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Draft</h1>
        <Button variant="outline" size="sm" onClick={handleSave}><Save className="w-4 h-4 mr-1" /> Save</Button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <button
              onClick={() => handleStepChange(i)}
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

      {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 mb-4 text-sm">{error}</div>}

      {step === 0 && <StepBasics data={data.basics} onChange={(basics) => updateData({ ...data, basics })} />}
      {step === 1 && <StepFeatures data={data.features} onChange={(features) => updateData({ ...data, features })} />}
      {step === 2 && <StepTech data={data.tech} onChange={(tech) => updateData({ ...data, tech })} />}
      {step === 3 && <StepDesign data={data.design} onChange={(design) => updateData({ ...data, design })} />}
      {step === 4 && <StepReview data={data} onGenerate={handleGenerate} isGenerating={isGenerating} onEditStep={handleStepChange} />}

      {step < 4 && (
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => handleStepChange(step - 1)} disabled={step === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button onClick={() => handleStepChange(step + 1)}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
