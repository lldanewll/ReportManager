"use client";

import React, { useState, useEffect } from "react";
import type { Defect, Priority } from "@/lib/types";

interface Props {
  defect: Defect;
  onUpdate: (updatedDefect: Defect) => void;
  onClose: () => void;
}

export default function EditDefectModal({ defect, onUpdate, onClose }: Props) {
  const [title, setTitle] = useState(defect.title);
  const [description, setDescription] = useState(defect.description);
  const [priority, setPriority] = useState<Priority>(defect.priority);
  const [dueDate, setDueDate] = useState(defect.dueDate || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(defect.title);
    setDescription(defect.description);
    setPriority(defect.priority);
    setDueDate(defect.dueDate || "");
  }, [defect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/defects/${defect.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          dueDate: dueDate || undefined
        }),
      });

      if (response.ok) {
        const updatedDefect = await response.json();
        onUpdate(updatedDefect);
        onClose();
      } else {
        console.error('Failed to update defect');
      }
    } catch (error) {
      console.error('Error updating defect:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex text-black items-center justify-center bg-black/40 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3">Редактировать дефект</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Заголовок</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Приоритет</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full p-2 border rounded"
            >
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Срок выполнения</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded hover:bg-gray-50"
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
}