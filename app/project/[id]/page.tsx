"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project } from "@/lib/types";
import { getProject } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import MarkdownPreview from "@/components/MarkdownPreview";
import { ArrowLeft, Download, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"prd" | "tdd">("prd");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const p = getProject(id);
    if (!p) {
      router.push("/");
      return;
    }
    setProject(p);
    if (!p.generatedPRD && p.generatedTDD) setActiveTab("tdd");
  }, [params.id, router]);

  if (!project) return null;

  const content = activeTab === "prd" ? project.generatedPRD : project.generatedTDD;

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.wizardData.basics.name || "document"}-${activeTab.toUpperCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project.wizardData.basics.name || "Untitled"}</h1>
          <p className="text-sm text-muted-foreground">{project.wizardData.basics.appType} app</p>
        </div>
        <Link href={`/new?edit=${project.id}`}>
          <Button variant="outline" size="sm">Re-generate</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b">
        {project.generatedPRD && (
          <button
            onClick={() => setActiveTab("prd")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === "prd" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            PRD
          </button>
        )}
        {project.generatedTDD && (
          <button
            onClick={() => setActiveTab("tdd")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === "tdd" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            TDD
          </button>
        )}
        <div className="flex-1" />
        {content && (
          <div className="flex gap-2 pb-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-3 h-3 mr-1" /> Download .md
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {content ? (
        <div className="border rounded-lg p-6">
          <MarkdownPreview content={content} />
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No {activeTab.toUpperCase()} generated yet.
        </div>
      )}
    </div>
  );
}
