"use client";

import { ProjectDesign, UIStyle } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const UI_STYLES: { value: UIStyle; label: string }[] = [
  { value: "minimal", label: "Minimal / Clean" },
  { value: "rich", label: "Rich / Feature-heavy" },
  { value: "dashboard", label: "Dashboard-style" },
];

interface Props {
  data: ProjectDesign;
  onChange: (data: ProjectDesign) => void;
}

export default function StepDesign({ data, onChange }: Props) {
  const update = (field: keyof ProjectDesign, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Design & UX Preferences</h2>

      <div className="space-y-2">
        <Label htmlFor="uiStyle">UI Style</Label>
        <Select id="uiStyle" value={data.uiStyle} onChange={(e) => update("uiStyle", e.target.value)}>
          {UI_STYLES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsive">Responsive Requirements</Label>
        <Textarea id="responsive" placeholder="e.g., Must work on mobile, tablet, and desktop..." value={data.responsiveRequirements} onChange={(e) => update("responsiveRequirements", e.target.value)} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="a11y">Accessibility Needs</Label>
        <Textarea id="a11y" placeholder="e.g., WCAG 2.1 AA compliance, screen reader support..." value={data.accessibilityNeeds} onChange={(e) => update("accessibilityNeeds", e.target.value)} rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Reference Apps / Inspiration</Label>
        <Textarea id="reference" placeholder="e.g., Notion, Linear, Figma..." value={data.referenceApps} onChange={(e) => update("referenceApps", e.target.value)} rows={2} />
      </div>
    </div>
  );
}
