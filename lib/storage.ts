import {
    Project,
    Draft,
    Idea,
    TechTemplate,
    ProjectTech,
    WizardData,
    DEFAULT_WIZARD_DATA,
} from "./types";
import { v4 as uuidv4 } from "uuid";

const PROJECTS_KEY = "auto-jobs-projects";
const DRAFTS_KEY = "auto-jobs-drafts";
const IDEAS_KEY = "auto-jobs-ideas";
const TEMPLATES_KEY = "auto-jobs-templates";

// --- Projects ---

export function getProjects(): Project[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function getProject(id: string): Project | undefined {
    return getProjects().find((p) => p.id === id);
}

export function saveProject(project: Project): void {
    const projects = getProjects();
    const idx = projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
        projects[idx] = { ...project, updatedAt: new Date().toISOString() };
    } else {
        projects.push(project);
    }
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function createProject(wizardData: WizardData): Project {
    const project: Project = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wizardData,
    };
    saveProject(project);
    return project;
}

export function deleteProject(id: string): void {
    const projects = getProjects().filter((p) => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

// --- Drafts ---

export function getDrafts(): Draft[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(DRAFTS_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function getDraft(id: string): Draft | undefined {
    return getDrafts().find((d) => d.id === id);
}

export function saveDraft(draft: Draft): void {
    const drafts = getDrafts();
    const idx = drafts.findIndex((d) => d.id === draft.id);
    if (idx >= 0) {
        drafts[idx] = { ...draft, updatedAt: new Date().toISOString() };
    } else {
        drafts.push(draft);
    }
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function createDraft(): Draft {
    const draft: Draft = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wizardData: DEFAULT_WIZARD_DATA,
        currentStep: 0,
    };
    saveDraft(draft);
    return draft;
}

export function deleteDraft(id: string): void {
    const drafts = getDrafts().filter((d) => d.id !== id);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

// --- Ideas ---

export function getIdeas(): Idea[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(IDEAS_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function getIdea(id: string): Idea | undefined {
    return getIdeas().find((i) => i.id === id);
}

export function saveIdea(idea: Idea): void {
    const ideas = getIdeas();
    const idx = ideas.findIndex((i) => i.id === idea.id);
    if (idx >= 0) {
        ideas[idx] = { ...idea, updatedAt: new Date().toISOString() };
    } else {
        ideas.push(idea);
    }
    localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
}

export function createIdea(title: string, content: string): Idea {
    const idea: Idea = {
        id: uuidv4(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    saveIdea(idea);
    return idea;
}

export function deleteIdea(id: string): void {
    const ideas = getIdeas().filter((i) => i.id !== id);
    localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
}

export function saveIdeas(ideas: Idea[]): void {
    localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
}

// --- Tech Templates ---

export function getTechTemplates(): TechTemplate[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function saveTechTemplate(template: TechTemplate): void {
    const templates = getTechTemplates();
    const idx = templates.findIndex((t) => t.id === template.id);
    if (idx >= 0) {
        templates[idx] = template;
    } else {
        templates.push(template);
    }
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function createTechTemplate(
    name: string,
    description: string,
    tech: ProjectTech,
): TechTemplate {
    const template: TechTemplate = {
        id: uuidv4(),
        name,
        description,
        tech,
        createdAt: new Date().toISOString(),
    };
    saveTechTemplate(template);
    return template;
}

export function deleteTechTemplate(id: string): void {
    const templates = getTechTemplates().filter((t) => t.id !== id);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}
