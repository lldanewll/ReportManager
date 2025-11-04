// app/api/defects/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import type { Defect } from "@/lib/types";

export async function GET(request: Request) {
    const dataPath = path.join(process.cwd(), "data", "mock", "defects.json");
    const raw = await fs.promises.readFile(dataPath, "utf-8");
    const defects: Defect[] = JSON.parse(raw);
    return NextResponse.json(defects);
}
