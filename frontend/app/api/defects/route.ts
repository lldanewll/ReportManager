// app/api/defects/route.ts
import fs from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";
import type { Defect } from "@/lib/types";

export async function GET(request: Request) {
    const dataPath = path.join(process.cwd(), "data", "mock", "defects.json");
    const raw = await fs.promises.readFile(dataPath, "utf-8");
    const defects: Defect[] = JSON.parse(raw);
    return NextResponse.json(defects);
}

export async function POST(request: NextRequest) {
    try {
        const newDefect: Defect = await request.json();

        const dataPath = path.join(process.cwd(), "data", "mock", "defects.json");

        const raw = await fs.promises.readFile(dataPath, "utf-8");
        const defects: Defect[] = JSON.parse(raw);

        defects.unshift(newDefect);

        await fs.promises.writeFile(dataPath, JSON.stringify(defects, null, 2), 'utf-8');

        return NextResponse.json(newDefect, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create defect' }, { status: 500 });
    }
}