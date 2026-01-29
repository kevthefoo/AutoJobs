"use client";

import { ProjectFeatures, Feature, UserPersona, UserFlow, Priority } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: ProjectFeatures;
  onChange: (data: ProjectFeatures) => void;
}

export default function StepFeatures({ data, onChange }: Props) {
  const addFeature = () => {
    onChange({
      ...data,
      features: [...data.features, { id: uuidv4(), name: "", description: "", priority: "must-have" }],
    });
  };

  const updateFeature = (id: string, field: keyof Feature, value: string) => {
    onChange({
      ...data,
      features: data.features.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    });
  };

  const removeFeature = (id: string) => {
    onChange({ ...data, features: data.features.filter((f) => f.id !== id) });
  };

  const addPersona = () => {
    onChange({
      ...data,
      personas: [...data.personas, { id: uuidv4(), name: "", description: "" }],
    });
  };

  const updatePersona = (id: string, field: keyof UserPersona, value: string) => {
    onChange({
      ...data,
      personas: data.personas.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const removePersona = (id: string) => {
    onChange({ ...data, personas: data.personas.filter((p) => p.id !== id) });
  };

  const addFlow = () => {
    onChange({
      ...data,
      userFlows: [...data.userFlows, { id: uuidv4(), title: "", steps: "" }],
    });
  };

  const updateFlow = (id: string, field: keyof UserFlow, value: string) => {
    onChange({
      ...data,
      userFlows: data.userFlows.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    });
  };

  const removeFlow = (id: string) => {
    onChange({ ...data, userFlows: data.userFlows.filter((f) => f.id !== id) });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Features & Requirements</h2>

      {/* Features */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Features</h3>
          <Button variant="outline" size="sm" onClick={addFeature}><Plus className="w-4 h-4 mr-1" /> Add Feature</Button>
        </div>
        {data.features.length === 0 && <p className="text-muted-foreground text-sm">No features added yet.</p>}
        {data.features.map((f) => (
          <div key={f.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Input placeholder="Feature name" value={f.name} onChange={(e) => updateFeature(f.id, "name", e.target.value)} className="flex-1" />
              <Select value={f.priority} onChange={(e) => updateFeature(f.id, "priority", e.target.value as Priority)} className="w-36">
                <option value="must-have">Must Have</option>
                <option value="nice-to-have">Nice to Have</option>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => removeFeature(f.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
            <Textarea placeholder="Feature description..." value={f.description} onChange={(e) => updateFeature(f.id, "description", e.target.value)} rows={2} />
          </div>
        ))}
      </div>

      {/* Personas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">User Personas</h3>
          <Button variant="outline" size="sm" onClick={addPersona}><Plus className="w-4 h-4 mr-1" /> Add Persona</Button>
        </div>
        {data.personas.length === 0 && <p className="text-muted-foreground text-sm">No personas added yet.</p>}
        {data.personas.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Input placeholder="Persona name" value={p.name} onChange={(e) => updatePersona(p.id, "name", e.target.value)} className="flex-1" />
              <Button variant="ghost" size="icon" onClick={() => removePersona(p.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
            <Textarea placeholder="Describe this persona..." value={p.description} onChange={(e) => updatePersona(p.id, "description", e.target.value)} rows={2} />
          </div>
        ))}
      </div>

      {/* User Flows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Key User Flows</h3>
          <Button variant="outline" size="sm" onClick={addFlow}><Plus className="w-4 h-4 mr-1" /> Add Flow</Button>
        </div>
        {data.userFlows.length === 0 && <p className="text-muted-foreground text-sm">No user flows added yet.</p>}
        {data.userFlows.map((f) => (
          <div key={f.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Input placeholder="Flow title" value={f.title} onChange={(e) => updateFlow(f.id, "title", e.target.value)} className="flex-1" />
              <Button variant="ghost" size="icon" onClick={() => removeFlow(f.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
            <Textarea placeholder="Describe the steps..." value={f.steps} onChange={(e) => updateFlow(f.id, "steps", e.target.value)} rows={3} />
          </div>
        ))}
      </div>
    </div>
  );
}
