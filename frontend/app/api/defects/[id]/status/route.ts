import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Defect, DefectStatus } from '@/lib/types';

type Params = {
  params: Promise<{ id: string }>
}

// Экспортируем PATCH метод
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    
    console.log('🔄 Updating status for defect:', id, 'to:', status);
    
    const dataPath = path.join(process.cwd(), "data", "mock", "defects.json");
    
    // Читаем файл
    const raw = await fs.promises.readFile(dataPath, "utf-8");
    const defects: Defect[] = JSON.parse(raw);
    
    // Находим дефект
    const defectIndex = defects.findIndex(d => d.id === id);
    if (defectIndex === -1) {
      console.error('❌ Defect not found:', id);
      return NextResponse.json({ error: 'Дефект не найден' }, { status: 404 });
    }
    
    // Обновляем статус
    const updatedDefect: Defect = { 
      ...defects[defectIndex], 
      status: status as DefectStatus,
      history: [
        ...defects[defectIndex].history,
        {
          when: new Date().toISOString(),
          who: 1,
          action: `status changed to: ${status}`
        }
      ]
    };
    
    defects[defectIndex] = updatedDefect;
    
    // Записываем обратно
    await fs.promises.writeFile(dataPath, JSON.stringify(defects, null, 2), 'utf-8');
    
    console.log('✅ Status updated successfully');
    return NextResponse.json(updatedDefect);
  } catch (error) {
    console.error('❌ Error updating status:', error);
    return NextResponse.json({ error: 'Ошибка обновления статуса' }, { status: 500 });
  }
}

// Также можно экспортировать OPTIONS для CORS если нужно
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}