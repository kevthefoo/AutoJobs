import {
    Project,
    Draft,
    Idea,
    TechTemplate,
    Production,
    ProjectTech,
    WizardData,
    DEFAULT_WIZARD_DATA,
} from "./types";
import { v4 as uuidv4 } from "uuid";

// --- Projects ---

export async function getProjects(): Promise<Project[]> {
    const res = await fetch("/api/projects");
    return res.json();
}

export async function getProject(id: string): Promise<Project | undefined> {
    const res = await fetch(`/api/projects?id=${id}`);
    const data = await res.json();
    return data ?? undefined;
}

export async function saveProject(project: Project): Promise<void> {
    await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...project, updatedAt: new Date().toISOString() }),
    });
}

export async function createProject(wizardData: WizardData): Promise<Project> {
    const project: Project = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wizardData,
    };
    await saveProject(project);
    return project;
}

export async function deleteProject(id: string): Promise<void> {
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
}

// --- Drafts ---

export async function getDrafts(): Promise<Draft[]> {
    const res = await fetch("/api/drafts");
    return res.json();
}

export async function getDraft(id: string): Promise<Draft | undefined> {
    const res = await fetch(`/api/drafts?id=${id}`);
    const data = await res.json();
    return data ?? undefined;
}

export async function saveDraft(draft: Draft): Promise<void> {
    await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, updatedAt: new Date().toISOString() }),
    });
}

export async function createDraft(): Promise<Draft> {
    const draft: Draft = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wizardData: DEFAULT_WIZARD_DATA,
        currentStep: 0,
    };
    await saveDraft(draft);
    return draft;
}

export async function deleteDraft(id: string): Promise<void> {
    await fetch(`/api/drafts?id=${id}`, { method: "DELETE" });
}

// --- Ideas ---

export async function getIdeas(): Promise<Idea[]> {
    const res = await fetch("/api/ideas");
    return res.json();
}

export async function getIdea(id: string): Promise<Idea | undefined> {
    const res = await fetch(`/api/ideas?id=${id}`);
    const data = await res.json();
    return data ?? undefined;
}

export async function saveIdea(idea: Idea): Promise<void> {
    await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...idea, updatedAt: new Date().toISOString() }),
    });
}

export async function createIdea(title: string, content: string): Promise<Idea> {
    const idea: Idea = {
        id: uuidv4(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await saveIdea(idea);
    return idea;
}

export async function deleteIdea(id: string): Promise<void> {
    await fetch(`/api/ideas?id=${id}`, { method: "DELETE" });
}

export async function saveIdeas(ideas: Idea[]): Promise<void> {
    await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ideas),
    });
}

// --- Tech Templates ---

export async function getTechTemplates(): Promise<TechTemplate[]> {
    const res = await fetch("/api/templates");
    return res.json();
}

export async function saveTechTemplate(template: TechTemplate): Promise<void> {
    await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
    });
}

export async function createTechTemplate(
    name: string,
    description: string,
    tech: ProjectTech,
): Promise<TechTemplate> {
    const template: TechTemplate = {
        id: uuidv4(),
        name,
        description,
        tech,
        createdAt: new Date().toISOString(),
    };
    await saveTechTemplate(template);
    return template;
}

export async function deleteTechTemplate(id: string): Promise<void> {
    await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
}

// --- Productions ---

export async function getProductions(): Promise<Production[]> {
    const res = await fetch("/api/productions");
    return res.json();
}

export async function getProduction(id: string): Promise<Production | undefined> {
    const res = await fetch(`/api/productions?id=${id}`);
    const data = await res.json();
    return data ?? undefined;
}

export async function saveProduction(production: Production): Promise<void> {
    await fetch("/api/productions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...production, updatedAt: new Date().toISOString() }),
    });
}

export async function createProduction(data: Omit<Production, "id" | "createdAt" | "updatedAt">): Promise<Production> {
    const production: Production = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await saveProduction(production);
    return production;
}

export async function deleteProduction(id: string): Promise<void> {
    await fetch(`/api/productions?id=${id}`, { method: "DELETE" });
}
