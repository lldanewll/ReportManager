"use client";

import { useMemo, useState } from 'react';
import type { Defect, Engineer } from '@/lib/types';
import StatusChart from '@/components/charts/StatusChart';
import PriorityChart from '@/components/charts/PriorityChart';
import DefectCard from '@/components/defects/DefectCard';

interface Props {
  defects: Defect[];
  engineers?: Engineer[];
}

type ViewMode = 'analytics' | 'defects';

export default function DirectorDashboard({ defects, engineers }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('analytics');

  const stats = useMemo(() => {
    const statusCount = {
      new: defects.filter(d => d.status === 'new').length,
      inProgress: defects.filter(d => d.status === 'inProgress').length,
      resolved: defects.filter(d => d.status === 'resolved').length,
      closed: defects.filter(d => d.status === 'closed').length,
    };

    const priorityCount = {
      high: defects.filter(d => d.priority === 'high').length,
      medium: defects.filter(d => d.priority === 'medium').length,
      low: defects.filter(d => d.priority === 'low').length,
    };

    const totalProjects = new Set(defects.map(d => d.projectId)).size;
    
    const resolvedDefects = defects.filter(d => d.status === 'resolved' || d.status === 'closed');
    const avgResolutionTime = resolvedDefects.length > 0 ? 48 : 0;

    return { statusCount, priorityCount, totalProjects, avgResolutionTime };
  }, [defects]);

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode('analytics')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'analytics' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📈 Аналитика
        </button>
        <button
          onClick={() => setViewMode('defects')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'defects' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          👀 Просмотр дефектов
        </button>
      </div>

      {viewMode === 'analytics' ? (
        <>
          <h2 className="text-xl text-black font-semibold mb-6">Аналитика дефектов</h2>
          
          {/* Большие плашки статистики */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{defects.length}</div>
              <div className="text-gray-600">Всего дефектов</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalProjects}</div>
              <div className="text-gray-600">Проектов</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.avgResolutionTime}ч</div>
              <div className="text-gray-600">Среднее время устранения</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {defects.filter(d => d.priority === 'high').length}
              </div>
              <div className="text-gray-600">Критических дефектов</div>
            </div>
          </div>

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg text-black font-semibold mb-4">Дефекты по статусам</h3>
              <StatusChart data={stats.statusCount} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg text-black font-semibold mb-4">Дефекты по приоритетам</h3>
              <PriorityChart data={stats.priorityCount} />
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-6">Просмотр дефектов</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Все дефекты ({defects.length})</h3>
            {defects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Дефекты не найдены
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {defects.map((defect) => (
                  <DefectCard 
                    key={defect.id} 
                    defect={defect} 
                    userRole="director"
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}