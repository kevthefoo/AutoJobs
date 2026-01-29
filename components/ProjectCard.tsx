"use client";

import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Eye } from "lucide-react";
import Link from "next/link";

interface Props {
  project: Project;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: Props) {
  const { wizardData, generatedPRD, generatedTDD } = project;
  const created = new Date(project.createdAt).toLocaleDateString();

  return (
    <div className="border rounded-lg p-4 space-y-3 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{wizardData.basics.name || "Untitled Project"}</h3>
          <p className="text-sm text-muted-foreground">{wizardData.basics.description || "No description"}</p>
        </div>
        <Badge variant="secondary">{wizardData.basics.appType}</Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Created {created}</span>
        {generatedPRD && <Badge variant="outline" className="text-xs">PRD</Badge>}
        {generatedTDD && <Badge variant="outline" className="text-xs">TDD</Badge>}
      </div>
      <div className="flex gap-2">
        <Link href={`/project/${project.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full"><Eye className="w-3 h-3 mr-1" /> View</Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => onDelete(project.id)}><Trash2 className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}
