"use client";

import { useState, useRef, useEffect } from "react";
import { ProjectTech, TechTemplate } from "@/lib/types";
import { getTechTemplates, createTechTemplate } from "@/lib/storage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Save } from "lucide-react";

const LANGUAGE_OPTIONS = [
    "TypeScript",
    "JavaScript",
    "Python",
    "PHP",
    "Java",
    "C#",
    "Go",
    "Rust",
    "Ruby",
    "Kotlin",
    "Swift",
    "Dart",
    "Elixir",
    "Scala",
];

const FRAMEWORK_OPTIONS = [
    "React",
    "Next.js",
    "Laravel",
    "Vue",
    "Angular",
    "Svelte",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "FastAPI",
    "Spring Boot",
    "Rails",
    ".NET",
    "Nuxt",
    "Remix",
];

const UIUX_OPTIONS = [
    "Tailwind CSS",
    "HeroUI",
    "Shadcn/ui",
    "Material UI",
    "Chakra UI",
    "Ant Design",
    "Bootstrap",
    "Radix UI",
    "DaisyUI",
    "Mantine",
];

const DATABASE_OPTIONS = [
    "Firebase",
    "SQLite",
    "Supabase",
    "MongoDB",
    "Neon",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "PlanetScale",
    "CockroachDB",
    "DynamoDB",
    "Prisma ORM",
    "Drizzle ORM",
];

const STORAGE_OPTIONS = [
    "AWS S3",
    "Google Cloud Storage",
    "Cloudflare R2",
    "Firebase Storage",
    "Supabase Storage",
    "Cloudinary",
    "Vercel Blob",
    "UploadThing",
    "MinIO",
];

const CICD_OPTIONS = [
    "GitHub Actions",
    "Docker",
    "Kubernetes",
    "Vercel",
    "Netlify",
    "AWS (EC2/ECS/Lambda)",
    "Railway",
    "Fly.io",
    "Render",
    "GitLab CI",
    "Jenkins",
    "Terraform",
];

const PAYMENT_OPTIONS = [
    "Stripe",
    "PayPal",
    "Paddle",
    "LemonSqueezy",
    "Square",
    "Razorpay",
    "Braintree",
    "Coinbase Commerce",
];

const INTEGRATION_OPTIONS = [
    "Google Maps / Geolocation",
    "SendGrid / Email service",
    "Twilio / SMS",
    "OpenAI / LLM API",
    "Google Analytics",
    "Sentry / Error tracking",
    "GitHub API",
    "Slack / Discord webhooks",
    "Google Workspace",
    "Resend",
    "Pusher / Ably (Realtime)",
];

const PERFORMANCE_OPTIONS = [
    "Low latency (<200ms response)",
    "High throughput (10k+ concurrent users)",
    "Offline support",
    "Real-time updates (WebSockets)",
    "CDN / Edge caching",
    "Database indexing & optimization",
    "Lazy loading / Code splitting",
    "Rate limiting",
];

const AUTH_NEEDS_OPTIONS = [
    "Email / Password",
    "OAuth (Google, GitHub, etc.)",
    "Magic link / Passwordless",
    "JWT tokens",
    "SSO (SAML / OIDC)",
    "Two-factor authentication (2FA)",
    "Role-based access control (RBAC)",
    "API key authentication",
    "No authentication needed",
];

const AUTH_METHOD_OPTIONS = [
    "NextAuth (Auth.js)",
    "Clerk",
    "Supabase Auth",
    "Firebase Auth",
    "Auth0",
    "Lucia",
    "Passport.js",
    "Kinde",
    "WorkOS",
    "Custom implementation",
];

interface CheckboxGroupProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

const AI_DECIDE = "__ai_decide__";

function CheckboxGroup({
    label,
    options,
    selected,
    onChange,
}: CheckboxGroupProps) {
    const isAiDecide = selected.includes(AI_DECIDE);
    const customValues = selected.filter(
        (s) => !options.includes(s) && s !== AI_DECIDE,
    );
    const [showOther, setShowOther] = useState(customValues.length > 0);
    const [otherText, setOtherText] = useState(customValues.join(", "));
    const [confirmed, setConfirmed] = useState(false);

    const toggleAiDecide = () => {
        if (isAiDecide) {
            onChange([]);
        } else {
            onChange([AI_DECIDE]);
            setShowOther(false);
            setOtherText("");
        }
    };

    const toggle = (option: string) => {
        if (isAiDecide) return;
        onChange(
            selected.includes(option)
                ? selected.filter((s) => s !== option)
                : [...selected, option],
        );
    };

    const handleOtherToggle = () => {
        if (isAiDecide) return;
        if (showOther) {
            onChange(selected.filter((s) => options.includes(s)));
            setOtherText("");
            setShowOther(false);
        } else {
            setShowOther(true);
        }
    };

    const handleOtherChange = (value: string) => {
        setOtherText(value);
        const knownSelected = selected.filter((s) => options.includes(s));
        const customs = value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        onChange([...knownSelected, ...customs]);
    };

    const displayValues = isAiDecide
        ? "AI will decide"
        : selected.filter((s) => s !== AI_DECIDE).join(", ") || "None selected";

    if (confirmed) {
        const items = isAiDecide
            ? ["AI will decide"]
            : selected.filter((s) => s !== AI_DECIDE);
        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>{label}</Label>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmed(false)}>Edit</Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {items.length > 0 ? items.map((v) => (
                        <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>
                    )) : (
                        <span className="text-sm text-muted-foreground">None selected</span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <Label>{label}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors hover:bg-accent text-sm col-span-1 sm:col-span-2 bg-primary/5 border-primary/20">
                    <input
                        type="checkbox"
                        checked={isAiDecide}
                        onChange={toggleAiDecide}
                        className="h-4 w-4 rounded border-input accent-primary"
                    />
                    <span className="text-primary font-medium">
                        Let AI decide for me
                    </span>
                </label>
                {options.map((option) => (
                    <label
                        key={option}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors text-sm ${isAiDecide ? "opacity-40 cursor-not-allowed" : "hover:bg-accent"}`}
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onChange={() => toggle(option)}
                            disabled={isAiDecide}
                            className="h-4 w-4 rounded border-input accent-primary"
                        />
                        {option}
                    </label>
                ))}
                <label
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors text-sm ${isAiDecide ? "opacity-40 cursor-not-allowed" : "hover:bg-accent"}`}
                >
                    <input
                        type="checkbox"
                        checked={showOther}
                        onChange={handleOtherToggle}
                        disabled={isAiDecide}
                        className="h-4 w-4 rounded border-input accent-primary"
                    />
                    Other
                </label>
            </div>
            {showOther && !isAiDecide && (
                <Input
                    placeholder="Enter custom values, comma-separated..."
                    value={otherText}
                    onChange={(e) => handleOtherChange(e.target.value)}
                />
            )}
            <Button size="sm" onClick={() => setConfirmed(true)}>
                Confirm
            </Button>
        </div>
    );
}

interface Template {
    name: string;
    description: string;
    tech: ProjectTech;
}

const TEMPLATES: Template[] = [
    {
        name: "Next.js Full-Stack",
        description: "Next.js + Tailwind + Supabase + Vercel",
        tech: {
            language: ["TypeScript"],
            framework: ["React", "Next.js"],
            uiux: ["Tailwind CSS", "Shadcn/ui"],
            database: ["Supabase", "Prisma ORM"],
            storage: ["Supabase Storage"],
            cicd: ["Vercel", "GitHub Actions"],
            payment: ["Stripe"],
            integrations: ["Resend"],
            performanceRequirements: ["Low latency (<200ms response)", "Lazy loading / Code splitting"],
            authNeeds: ["Email / Password", "OAuth (Google, GitHub, etc.)"],
            authMethod: ["Supabase Auth"],
        },
    },
    {
        name: "MERN Stack",
        description: "React + Express + MongoDB + Docker",
        tech: {
            language: ["JavaScript"],
            framework: ["React", "Node.js", "Express"],
            uiux: ["Tailwind CSS"],
            database: ["MongoDB"],
            storage: ["AWS S3"],
            cicd: ["Docker", "GitHub Actions"],
            payment: [],
            integrations: [],
            performanceRequirements: ["Low latency (<200ms response)"],
            authNeeds: ["Email / Password", "JWT tokens"],
            authMethod: ["Passport.js"],
        },
    },
    {
        name: "Laravel + Vue",
        description: "Laravel + Vue + MySQL + Docker",
        tech: {
            language: ["PHP", "JavaScript"],
            framework: ["Laravel", "Vue"],
            uiux: ["Tailwind CSS"],
            database: ["MySQL", "Redis"],
            storage: ["AWS S3"],
            cicd: ["Docker", "GitHub Actions"],
            payment: ["Stripe"],
            integrations: [],
            performanceRequirements: ["Low latency (<200ms response)", "CDN / Edge caching"],
            authNeeds: ["Email / Password", "OAuth (Google, GitHub, etc.)"],
            authMethod: ["Custom implementation"],
        },
    },
    {
        name: "Django + React",
        description: "Django + React + PostgreSQL + AWS",
        tech: {
            language: ["Python", "TypeScript"],
            framework: ["Django", "React"],
            uiux: ["Material UI"],
            database: ["PostgreSQL", "Redis"],
            storage: ["AWS S3"],
            cicd: ["Docker", "GitHub Actions", "AWS (EC2/ECS/Lambda)"],
            payment: [],
            integrations: ["Sentry / Error tracking"],
            performanceRequirements: ["High throughput (10k+ concurrent users)", "Database indexing & optimization"],
            authNeeds: ["Email / Password", "OAuth (Google, GitHub, etc.)", "Role-based access control (RBAC)"],
            authMethod: ["Custom implementation"],
        },
    },
    {
        name: "Next.js + Firebase",
        description: "Next.js + Firebase + Vercel",
        tech: {
            language: ["TypeScript"],
            framework: ["React", "Next.js"],
            uiux: ["Tailwind CSS", "Shadcn/ui"],
            database: ["Firebase"],
            storage: ["Firebase Storage"],
            cicd: ["Vercel", "GitHub Actions"],
            payment: ["Stripe"],
            integrations: ["Google Analytics"],
            performanceRequirements: ["Low latency (<200ms response)", "Real-time updates (WebSockets)"],
            authNeeds: ["Email / Password", "OAuth (Google, GitHub, etc.)"],
            authMethod: ["Firebase Auth"],
        },
    },
    {
        name: "SaaS Starter",
        description: "Next.js + Clerk + Neon + Stripe",
        tech: {
            language: ["TypeScript"],
            framework: ["React", "Next.js"],
            uiux: ["Tailwind CSS", "Shadcn/ui"],
            database: ["Neon", "Drizzle ORM"],
            storage: ["Vercel Blob"],
            cicd: ["Vercel", "GitHub Actions"],
            payment: ["Stripe"],
            integrations: ["Resend", "Sentry / Error tracking", "Google Analytics"],
            performanceRequirements: ["Low latency (<200ms response)", "Rate limiting", "Lazy loading / Code splitting"],
            authNeeds: ["Email / Password", "OAuth (Google, GitHub, etc.)", "Role-based access control (RBAC)"],
            authMethod: ["Clerk"],
        },
    },
];

interface Props {
    data: ProjectTech;
    onChange: (data: ProjectTech) => void;
}

export default function StepTech({ data, onChange }: Props) {
    const [showTemplates, setShowTemplates] = useState(false);
    const [showSave, setShowSave] = useState(false);
    const [saveName, setSaveName] = useState("");
    const [saveDesc, setSaveDesc] = useState("");
    const [userTemplates, setUserTemplates] = useState<TechTemplate[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setUserTemplates(getTechTemplates());
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowTemplates(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const applyTemplate = (tech: ProjectTech) => {
        onChange(tech);
        setShowTemplates(false);
    };

    const handleSaveTemplate = () => {
        if (!saveName.trim()) return;
        createTechTemplate(saveName.trim(), saveDesc.trim(), data);
        setUserTemplates(getTechTemplates());
        setSaveName("");
        setSaveDesc("");
        setShowSave(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-2xl font-bold">Technical Preferences</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSave(!showSave)}
                    >
                        <Save className="w-4 h-4 mr-1" /> Save as template
                    </Button>
                    <div className="relative" ref={dropdownRef}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTemplates(!showTemplates)}
                        >
                            Use a template <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                        {showTemplates && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-card border rounded-lg shadow-lg z-50 py-1 max-h-96 overflow-y-auto">
                                {userTemplates.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">My Templates</div>
                                        {userTemplates.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => applyTemplate(t.tech)}
                                                className="w-full text-left px-4 py-3 hover:bg-accent transition-colors"
                                            >
                                                <div className="text-sm font-medium">{t.name}</div>
                                                {t.description && <div className="text-xs text-muted-foreground">{t.description}</div>}
                                            </button>
                                        ))}
                                        <div className="border-t my-1" />
                                    </>
                                )}
                                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Presets</div>
                                {TEMPLATES.map((t) => (
                                    <button
                                        key={t.name}
                                        onClick={() => applyTemplate(t.tech)}
                                        className="w-full text-left px-4 py-3 hover:bg-accent transition-colors"
                                    >
                                        <div className="text-sm font-medium">{t.name}</div>
                                        <div className="text-xs text-muted-foreground">{t.description}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showSave && (
                <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-sm">Save current selections as template</h3>
                    <Input
                        placeholder="Template name"
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                    />
                    <Input
                        placeholder="Description (optional)"
                        value={saveDesc}
                        onChange={(e) => setSaveDesc(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveTemplate} disabled={!saveName.trim()}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowSave(false)}>Cancel</Button>
                    </div>
                </div>
            )}

            <CheckboxGroup
                label="Programming Language"
                options={LANGUAGE_OPTIONS}
                selected={data.language}
                onChange={(language) => onChange({ ...data, language })}
            />

            <CheckboxGroup
                label="Framework"
                options={FRAMEWORK_OPTIONS}
                selected={data.framework}
                onChange={(framework) => onChange({ ...data, framework })}
            />

            <CheckboxGroup
                label="UI/UX"
                options={UIUX_OPTIONS}
                selected={data.uiux}
                onChange={(uiux) => onChange({ ...data, uiux })}
            />

            <CheckboxGroup
                label="Database"
                options={DATABASE_OPTIONS}
                selected={data.database}
                onChange={(database) => onChange({ ...data, database })}
            />

            <CheckboxGroup
                label="Storage"
                options={STORAGE_OPTIONS}
                selected={data.storage}
                onChange={(storage) => onChange({ ...data, storage })}
            />

            <CheckboxGroup
                label="CI/CD"
                options={CICD_OPTIONS}
                selected={data.cicd}
                onChange={(cicd) => onChange({ ...data, cicd })}
            />

            <CheckboxGroup
                label="Payment"
                options={PAYMENT_OPTIONS}
                selected={data.payment}
                onChange={(payment) => onChange({ ...data, payment })}
            />

            <CheckboxGroup
                label="Third-Party Integrations"
                options={INTEGRATION_OPTIONS}
                selected={data.integrations}
                onChange={(integrations) => onChange({ ...data, integrations })}
            />

            <CheckboxGroup
                label="Performance / Scalability Requirements"
                options={PERFORMANCE_OPTIONS}
                selected={data.performanceRequirements}
                onChange={(performanceRequirements) =>
                    onChange({ ...data, performanceRequirements })
                }
            />

            <CheckboxGroup
                label="Authentication Needs"
                options={AUTH_NEEDS_OPTIONS}
                selected={data.authNeeds}
                onChange={(authNeeds) => onChange({ ...data, authNeeds })}
            />

            <CheckboxGroup
                label="Authentication Method"
                options={AUTH_METHOD_OPTIONS}
                selected={data.authMethod}
                onChange={(authMethod) => onChange({ ...data, authMethod })}
            />
        </div>
    );
}
