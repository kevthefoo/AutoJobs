import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/server-storage";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    const data = readData();
    if (id) {
        const item = data.projects.find((p: any) => p.id === id);
        return NextResponse.json(item ?? null);
    }
    return NextResponse.json(data.projects);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = readData();
    const idx = data.projects.findIndex((p: any) => p.id === body.id);
    if (idx >= 0) {
        data.projects[idx] = body;
    } else {
        data.projects.push(body);
    }
    writeData(data);
    return NextResponse.json(body);
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const data = readData();
    data.projects = data.projects.filter((p: any) => p.id !== id);
    writeData(data);
    return NextResponse.json({ ok: true });
}
