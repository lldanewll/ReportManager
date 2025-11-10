// app/api/defects/route.ts
import fs from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";
import type { Defect, DefectStatus } from "@/lib/types";

export async function GET(request: Request) {
    const dataPath = path.join(process.cwd(), "data", "mock", "defects.json");
    const raw = await fs.promises.readFile(dataPath, "utf-8");
    const defects: Defect[] = JSON.parse(raw);
    return NextResponse.json(defects);
}

type Params = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    
    const dataPath = path.join(process.cwd(), "data", "mock", "defects.json");
    const raw = await fs.promises.readFile(dataPath, "utf-8");
    const defects: Defect[] = JSON.parse(raw);
    
    const defectIndex = defects.findIndex(d => d.id === id);
    if (defectIndex === -1) {
      return NextResponse.json({ error: 'Дефект не найден' }, { status: 404 });
    }
    
    // Обновляем статус
    defects[defectIndex] = { 
      ...defects[defectIndex], 
      status: status as DefectStatus,
      history: [
        ...defects[defectIndex].history,
        {
          when: new Date().toISOString(),
          who: 1, // TODO: использовать ID текущего пользователя
          action: `status changed to: ${status}`
        }
      ]
    };
    
    await fs.promises.writeFile(dataPath, JSON.stringify(defects, null, 2), 'utf-8');
    
    return NextResponse.json(defects[defectIndex]);
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Ошибка обновления статуса' }, { status: 500 });
  }
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