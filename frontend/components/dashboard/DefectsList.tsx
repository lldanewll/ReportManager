"use client";

import { useState } from 'react';
import DefectCard from '@/components/defects/DefectCard';
import FilterBar from '@/components/defects/FilterBar';
import ModalCreate from '@/components/defects/CreateDefectModal';
import AssignEngineerModal from '@/components/defects/AssignEngineerModal';
import type { Defect, DefectStatus, Priority, Engineer } from '@/lib/types';

interface Props {
  defects: Defect[];
  userRole: string;
  onDefectUpdate: () => void;
  engineers?: Engineer[];
  onAssignEngineer?: (defect: Defect) => void; // Добавьте эту строку
}

export default function DefectsList({ 
  defects, 
  userRole, 
  onDefectUpdate, 
  engineers = [],
  onAssignEngineer 
}: Props) {
  const [statusFilter, setStatusFilter] = useState<DefectStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);

  const filteredDefects = defects.filter(defect => {
    if (statusFilter && defect.status !== statusFilter) return false;
    if (priorityFilter && defect.priority !== priorityFilter) return false;
    return true;
  });

  const handleCreateDefect = (newDefect: Defect) => {
    onDefectUpdate();
    setShowCreateModal(false);
  };

  const handleAssignEngineer = (defect: Defect) => {
    setSelectedDefect(defect);
    setShowAssignModal(true);
  };

  const handleEngineerAssigned = () => {
    onDefectUpdate(); // Перезагружаем данные
    setShowAssignModal(false);
    setSelectedDefect(null);
  };

  const canCreateDefects = userRole === 'engineer';
  const canAssignEngineers = userRole === 'manager';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-black font-semibold">
          {userRole === 'engineer' ? 'Мои дефекты' : 'Все дефекты'}
        </h2>
        
        {canCreateDefects && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Создать дефект
          </button>
        )}
      </div>

      <FilterBar
        status={statusFilter}
        priority={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      {showCreateModal && (
        <ModalCreate 
          onCreate={handleCreateDefect}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showAssignModal && selectedDefect && (
        <AssignEngineerModal
          defect={selectedDefect}
          engineers={engineers}
          onAssign={handleEngineerAssigned}
          onClose={() => setShowAssignModal(false)}
        />
      )}

      <div className="mb-4 text-sm text-gray-600">
        Показано {filteredDefects.length} из {defects.length} дефектов
      </div>

      {filteredDefects.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
          Дефекты не найдены
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDefects.map((defect) => (
            <DefectCard 
              key={defect.id} 
              defect={defect} 
              userRole={userRole}
              onDefectUpdate={onDefectUpdate}
              showPhotoButton={userRole === 'engineer'}
              onAssignEngineer={canAssignEngineers ? handleAssignEngineer : undefined}
              engineers={engineers}
            />
          ))}
        </div>
      )}
    </div>
  );
}