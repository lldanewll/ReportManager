import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Defect } from '@/lib/types';

type Params = {
  params: Promise<{ id: string }>
}

// GET - получить дефект по ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const dataPath = path.join(process.cwd(), "data", "mock", "defects.json");
    const raw = await fs.promises.readFile(dataPath, "utf-8");
    const defects: Defect[] = JSON.parse(raw);
    const defect = defects.find(d => d.id === id);
    
    if (!defect) {
      return NextResponse.json({ error: 'Дефект не найден' }, { status: 404 });
    }
    
    return NextResponse.json(defect);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка загрузки дефекта' }, { status: 500 });
  }
}

// PUT - обновить дефект
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    console.log('🔄 Updating defect:', id, 'with:', updates);
    
    const dataPath = path.join(process.cwd(), "data", "mock", "defects.json");
    const raw = await fs.promises.readFile(dataPath, "utf-8");
    const defects: Defect[] = JSON.parse(raw);
    
    const defectIndex = defects.findIndex(d => d.id === id);
    if (defectIndex === -1) {
      return NextResponse.json({ error: 'Дефект не найден' }, { status: 404 });
    }
    
    // Обновляем дефект
    const updatedDefect = { 
      ...defects[defectIndex], 
      ...updates,
      history: [
        ...defects[defectIndex].history,
        {
          when: new Date().toISOString(),
          who: 1,
          action: `updated: ${Object.keys(updates).join(', ')}`
        }
      ]
    };

    defects[defectIndex] = updatedDefect;
    
    await fs.promises.writeFile(dataPath, JSON.stringify(defects, null, 2), 'utf-8');
    
    return NextResponse.json(updatedDefect);
  } catch (error) {
    console.error('Error updating defect:', error);
    return NextResponse.json({ error: 'Ошибка обновления дефекта' }, { status: 500 });
  }
}Response.json({ error: 'Ошибка обновления дефекта' }, { status: 500 });
