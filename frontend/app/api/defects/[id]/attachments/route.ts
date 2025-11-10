// app/api/defects/[id]/attachments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

type Params = {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get('photo') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Читаем файл
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Создаем уникальное имя файла
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);

    // Создаем директорию если не существует
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Сохраняем файл
    await fs.promises.writeFile(filePath, buffer);

    // Обновляем дефект
    const dataPath = path.join(process.cwd(), "data", "mock", "defects.json");
    const raw = await fs.promises.readFile(dataPath, "utf-8");
    const defects = JSON.parse(raw);

    const defectIndex = defects.findIndex((d: any) => d.id === id);
    if (defectIndex === -1) {
      return NextResponse.json({ error: 'Defect not found' }, { status: 404 });
    }

    const newAttachment = {
      id: uuidv4(),
      filename: file.name,
      url: `/uploads/${fileName}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 1 // TODO: Получить из сессии
    };

    defects[defectIndex].attachments = [
      ...(defects[defectIndex].attachments || []),
      newAttachment
    ];

    await fs.promises.writeFile(dataPath, JSON.stringify(defects, null, 2));

    return NextResponse.json(defects[defectIndex]);
  } catch (error) {
    console.error('Error uploading attachment:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}