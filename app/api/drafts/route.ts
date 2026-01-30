import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/server-storage";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    const data = readData();
    if (id) {
        const item = data.drafts.find((d: any) => d.id === id);
        return NextResponse.json(item ?? null);
    }
    return NextResponse.json(data.drafts);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = readData();
    const idx = data.drafts.findIndex((d: any) => d.id === body.id);
    if (idx >= 0) {
        data.drafts[idx] = body;
    } else {
        data.drafts.push(body);
    }
    writeData(data);
    return NextResponse.json(body);
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const data = readData();
    data.drafts = data.drafts.filter((d: any) => d.id !== id);
    writeData(data);
    return NextResponse.json({ ok: true });
}
