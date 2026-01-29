"use client";

import { ProjectBasics, AppType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const APP_TYPES: { value: AppType; label: string }[] = [
  { value: "web", label: "Web Application" },
  { value: "desktop", label: "Desktop Application" },
  { value: "mobile", label: "Mobile (Android/iOS/Cross-platform)" },
  { value: "cli", label: "CLI Tool" },
  { value: "api", label: "API / Backend Service" },
  { value: "browser-extension", label: "Browser Extension" },
];

interface Props {
  data: ProjectBasics;
  onChange: (data: ProjectBasics) => void;
}

export default function StepBasics({ data, onChange }: Props) {
  const update = (field: keyof ProjectBasics, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Basics</h2>

      <div className="space-y-2">
        <Label htmlFor="name">App Name</Label>
        <Input id="name" placeholder="My Awesome App" value={data.name} onChange={(e) => update("name", e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="A brief description of your app..." value={data.description} onChange={(e) => update("description", e.target.value)} rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appType">App Type</Label>
        <Select id="appType" value={data.appType} onChange={(e) => update("appType", e.target.value)}>
          {APP_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="audience">Target Audience</Label>
        <Input id="audience" placeholder="e.g., Small business owners, developers..." value={data.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="problem">Core Problem Being Solved</Label>
        <Textarea id="problem" placeholder="What problem does this app solve?" value={data.coreProblem} onChange={(e) => update("coreProblem", e.target.value)} rows={3} />
      </div>
    </div>
  );
}
