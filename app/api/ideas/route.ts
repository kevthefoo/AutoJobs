import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/server-storage";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    const data = readData();
    if (id) {
        const item = data.ideas.find((i: any) => i.id === id);
        return NextResponse.json(item ?? null);
    }
    return NextResponse.json(data.ideas);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = readData();
    // Support bulk save (array)
    if (Array.isArray(body)) {
        data.ideas = body;
        writeData(data);
        return NextResponse.json(body);
    }
    const idx = data.ideas.findIndex((i: any) => i.id === body.id);
    if (idx >= 0) {
        data.ideas[idx] = body;
    } else {
        data.ideas.push(body);
    }
    writeData(data);
    return NextResponse.json(body);
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const data = readData();
    data.ideas = data.ideas.filter((i: any) => i.id !== id);
    writeData(data);
    return NextResponse.json({ ok: true });
}
