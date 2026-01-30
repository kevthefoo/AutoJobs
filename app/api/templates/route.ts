import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/server-storage";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    const data = readData();
    if (id) {
        const item = data.templates.find((t: any) => t.id === id);
        return NextResponse.json(item ?? null);
    }
    return NextResponse.json(data.templates);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = readData();
    const idx = data.templates.findIndex((t: any) => t.id === body.id);
    if (idx >= 0) {
        data.templates[idx] = body;
    } else {
        data.templates.push(body);
    }
    writeData(data);
    return NextResponse.json(body);
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const data = readData();
    data.templates = data.templates.filter((t: any) => t.id !== id);
    writeData(data);
    return NextResponse.json({ ok: true });
}
