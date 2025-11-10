import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Engineer } from '@/lib/types';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "data", "mock", "engineers.json");
    
    console.log('🔍 Looking for engineers file at:', dataPath);
    
    if (!fs.existsSync(dataPath)) {
      console.error('❌ Engineers file not found at:', dataPath);
      
      const defaultEngineers: Engineer[] = [
        {
          id: 1,
          name: "Алексей Петров",
          email: "engineer1@example.com",
          specialization: "Строительные работы"
        },
        {
          id: 2,
          name: "Иван Сидоров",
          email: "engineer2@example.com",
          specialization: "Электромонтаж"
        },
        {
          id: 3,
          name: "Мария Иванова",
          email: "engineer3@example.com",
          specialization: "Отделочные работы"
        }
      ];
      
      const dir = path.dirname(dataPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      await fs.promises.writeFile(dataPath, JSON.stringify(defaultEngineers, null, 2), 'utf-8');
      console.log('✅ Created engineers file with default data');
      
      return NextResponse.json(defaultEngineers);
    }
    
    const raw = await fs.promises.readFile(dataPath, "utf-8");
    const engineers: Engineer[] = JSON.parse(raw);
    
    console.log('✅ Loaded engineers:', engineers.length);
    return NextResponse.json(engineers);
  } catch (error) {
    console.error('❌ Error loading engineers:', error);
    
    return NextResponse.json([], { status: 200 });
  }
}