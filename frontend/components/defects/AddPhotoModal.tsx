// components/defects/AddPhotoModal.tsx
"use client";

import React, { useState } from 'react';
import type { Defect } from '@/lib/types';

interface Props {
  defect: Defect;
  onAdd: (defectId: string, file: File) => void;
  onClose: () => void;
}

export default function AddPhotoModal({ defect, onAdd, onClose }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверяем что это изображение
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите файл изображения');
        return;
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой. Максимальный размер: 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Создаем превью
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddPhoto = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      await onAdd(defect.id, selectedFile);
      onClose();
    } catch (error) {
      console.error('Error adding photo:', error);
      alert('Ошибка при добавлении фото');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Добавить фото к дефекту</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Дефект: <strong>{defect.title}</strong></p>
          
          <label className="block text-sm font-medium mb-2">
            Выберите фото:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full p-2 border rounded"
          />
          
          {previewUrl && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Предпросмотр:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded hover:bg-gray-50"
            disabled={loading}
          >
            Отмена
          </button>
          <button
            onClick={handleAddPhoto}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !selectedFile}
          >
            {loading ? 'Добавление...' : 'Добавить фото'}
          </button>
        </div>
      </div>
    </div>
  );
}