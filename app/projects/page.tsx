"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/types";
import { getProjects, deleteProject } from "@/lib/storage";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(getProjects());
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Projects with generated PRD & TDD documents</p>
        </div>
        <Link href="/new">
          <Button><Plus className="w-4 h-4 mr-2" /> New Project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-4">No projects yet. Create your first one!</p>
          <Link href="/new">
            <Button><Plus className="w-4 h-4 mr-2" /> New Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
