"use client";

import React, { useState } from "react";
import type { Defect, Engineer } from "@/lib/types";

interface Props {
  defect: Defect;
  engineers: Engineer[];
  onAssign: () => void;
  onClose: () => void;
}

export default function AssignEngineerModal({ defect, engineers, onAssign, onClose }: Props) {
  const [selectedEngineerId, setSelectedEngineerId] = useState<number>(defect.assigneeId || 0);
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedEngineerId) return;
    
    setLoading(true);
    try {
      console.log('🔄 Assigning engineer:', selectedEngineerId, 'to defect:', defect.id);
      
      const response = await fetch(`/api/defects/${defect.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assigneeId: selectedEngineerId
        }),
      });

      if (response.ok) {
        console.log('✅ Engineer assigned successfully');
        onAssign();
        onClose();
      } else {
        console.error('❌ Failed to assign engineer');
      }
    } catch (error) {
      console.error('❌ Error assigning engineer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-lg text-black font-semibold mb-3">Назначить исполнителя</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Дефект: <strong>{defect.title}</strong></p>
          
          <label className="block text-sm text-black font-medium mb-2">
            Выберите инженера:
          </label>
          <select 
            value={selectedEngineerId}
            onChange={(e) => setSelectedEngineerId(Number(e.target.value))}
            className="w-full p-2 text-black border rounded"
          >
            <option value={0}>Не назначен</option>
            {engineers.map(engineer => (
              <option key={engineer.id} value={engineer.id}>
                {engineer.name} ({engineer.specialization})
              </option>
            ))}
          </select>
          
          <div className="mt-2 text-xs text-gray-500">
            Доступно инженеров: {engineers.length}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-black border rounded hover:bg-gray-50"
            disabled={loading}
          >
            Отмена
          </button>
          <button
            onClick={handleAssign}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !selectedEngineerId}
          >
            {loading ? 'Назначение...' : 'Назначить'}
          </button>
        </div>
      </div>
    </div>
  );
}