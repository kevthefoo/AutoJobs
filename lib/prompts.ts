import { WizardData } from "./types";

const AI_DECIDE = "__ai_decide__";

function formatTechField(values: string[]): string {
  if (values.includes(AI_DECIDE)) return "Let AI decide the most suitable option";
  const clean = values.filter((v) => v !== AI_DECIDE);
  return clean.length > 0 ? clean.join(", ") : "Not specified";
}

function formatWizardContext(data: WizardData): string {
  const mustHave = data.features.features.filter((f) => f.priority === "must-have");
  const niceToHave = data.features.features.filter((f) => f.priority === "nice-to-have");

  return `
## Project Information
- **Name**: ${data.basics.name}
- **Type**: ${data.basics.appType}
- **Description**: ${data.basics.description}
- **Target Audience**: ${data.basics.targetAudience}
- **Core Problem**: ${data.basics.coreProblem}

## Features
### Must-Have
${mustHave.map((f) => `- **${f.name}**: ${f.description}`).join("\n") || "- None specified"}

### Nice-to-Have
${niceToHave.map((f) => `- **${f.name}**: ${f.description}`).join("\n") || "- None specified"}

## User Personas
${data.features.personas.map((p) => `- **${p.name}**: ${p.description}`).join("\n") || "- None specified"}

## User Flows
${data.features.userFlows.map((f) => `### ${f.title}\n${f.steps}`).join("\n\n") || "- None specified"}

## Technical Preferences
- **Framework**: ${formatTechField(data.tech.framework)}
- **UI/UX**: ${formatTechField(data.tech.uiux)}
- **Database**: ${formatTechField(data.tech.database)}
- **Storage**: ${formatTechField(data.tech.storage)}
- **CI/CD**: ${formatTechField(data.tech.cicd)}
- **Payment**: ${formatTechField(data.tech.payment)}
- **Integrations**: ${formatTechField(data.tech.integrations)}
- **Performance Requirements**: ${formatTechField(data.tech.performanceRequirements)}
- **Authentication Needs**: ${formatTechField(data.tech.authNeeds)}
- **Authentication Method**: ${formatTechField(data.tech.authMethod)}

## Design & UX
- **UI Style**: ${data.design.uiStyle}
- **Responsive Requirements**: ${data.design.responsiveRequirements || "Not specified"}
- **Accessibility**: ${data.design.accessibilityNeeds || "Not specified"}
- **Reference Apps**: ${data.design.referenceApps || "Not specified"}
`.trim();
}

export function getPRDPrompt(data: WizardData): { system: string; user: string } {
  return {
    system: `You are a senior product manager. Generate a comprehensive Product Requirements Document (PRD) in Markdown format. The document must be well-structured, detailed, and optimized for consumption by LLMs and developers.

Output the PRD using this exact structure:

# PRD: {App Name}
## Meta
- Type: {app type}
- Target Platform: {platforms}
- Generated: {current date}

## Problem Statement
## Target Users
## User Personas
## Feature Requirements
### Must Have
### Nice to Have
## User Flows
## Non-Functional Requirements
## Success Metrics
## Constraints & Assumptions

Be thorough, specific, and actionable. Fill in every section with meaningful content based on the provided project information. If information is missing, make reasonable assumptions and note them.`,
    user: `Generate a PRD for the following project:\n\n${formatWizardContext(data)}`,
  };
}

export function getTDDPrompt(data: WizardData): { system: string; user: string } {
  return {
    system: `You are a senior software architect. Generate a comprehensive Technical Design Document (TDD) in Markdown format. The document must be well-structured, detailed, and optimized for consumption by LLMs and developers.

Output the TDD using this exact structure:

# TDD: {App Name}
## Meta
- Type: {app type}
- Generated: {current date}

## System Architecture
## Tech Stack
### Frontend
### Backend
### Database
### Infrastructure
## Component Breakdown
## API Design
## Data Models
## Authentication & Authorization
## Third-Party Integrations
## Testing Strategy
## Deployment Plan
## File/Folder Structure
## Development Phases

Be thorough, specific, and actionable. Provide concrete technical decisions, code structure recommendations, and implementation details. If information is missing, make reasonable technical choices and explain the rationale.`,
    user: `Generate a TDD for the following project:\n\n${formatWizardContext(data)}`,
  };
}
