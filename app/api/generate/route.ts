import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getPRDPrompt, getTDDPrompt } from "@/lib/prompts";
import { WizardData, DocType } from "@/lib/types";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const { wizardData, docType } = (await req.json()) as {
      wizardData: WizardData;
      docType: DocType;
    };

    const prompt = docType === "prd" ? getPRDPrompt(wizardData) : getTDDPrompt(wizardData);

    const response = await openai.responses.create({
      model: "gpt-5.2-2025-12-11",
      instructions: prompt.system,
      input: prompt.user,
      temperature: 0.7,
    });

    const content = response.output_text;
    if (!content) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (e: any) {
    const message = e?.message || "Generation failed";
    const status = message.includes("API key") || message.includes("auth") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
