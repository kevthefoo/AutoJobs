export type AppType = "web" | "desktop" | "mobile" | "cli" | "api" | "browser-extension";
export type Priority = "must-have" | "nice-to-have";
export type UIStyle = "minimal" | "rich" | "dashboard";
export type DocType = "prd" | "tdd";

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: Priority;
}

export interface UserPersona {
  id: string;
  name: string;
  description: string;
}

export interface UserFlow {
  id: string;
  title: string;
  steps: string;
}

export interface ProjectBasics {
  name: string;
  description: string;
  appType: AppType;
  targetAudience: string;
  coreProblem: string;
}

export interface ProjectFeatures {
  features: Feature[];
  personas: UserPersona[];
  userFlows: UserFlow[];
}

export interface ProjectTech {
  language: string[];
  framework: string[];
  uiux: string[];
  database: string[];
  storage: string[];
  cicd: string[];
  payment: string[];
  integrations: string[];
  performanceRequirements: string[];
  authNeeds: string[];
  authMethod: string[];
}

export interface ProjectDesign {
  uiStyle: UIStyle;
  responsiveRequirements: string;
  accessibilityNeeds: string;
  referenceApps: string;
}

export interface WizardData {
  basics: ProjectBasics;
  features: ProjectFeatures;
  tech: ProjectTech;
  design: ProjectDesign;
}

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;
  wizardData: WizardData;
  generatedPRD?: string;
  generatedTDD?: string;
}

export interface Draft {
  id: string;
  createdAt: string;
  updatedAt: string;
  wizardData: WizardData;
  currentStep: number;
}

export interface Idea {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechTemplate {
  id: string;
  name: string;
  description: string;
  tech: ProjectTech;
  createdAt: string;
}

export interface Production {
  id: string;
  name: string;
  url?: string;
  platform: string;
  status: string;
  version?: string;
  releaseDate?: string;
  description?: string;
  notes: string;
  screenshotUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export const PLATFORM_OPTIONS = ["App Store", "Play Store", "Web", "Desktop", "Other"] as const;
export const PRODUCTION_STATUS_OPTIONS = ["live", "beta", "archived", "maintenance"] as const;

export const DEFAULT_WIZARD_DATA: WizardData = {
  basics: {
    name: "",
    description: "",
    appType: "web",
    targetAudience: "",
    coreProblem: "",
  },
  features: {
    features: [],
    personas: [],
    userFlows: [],
  },
  tech: {
    language: [],
    framework: [],
    uiux: [],
    database: [],
    storage: [],
    cicd: [],
    payment: [],
    integrations: [],
    performanceRequirements: [],
    authNeeds: [],
    authMethod: [],
  },
  design: {
    uiStyle: "minimal",
    responsiveRequirements: "",
    accessibilityNeeds: "",
    referenceApps: "",
  },
};
