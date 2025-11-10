"use client";

import type { Defect } from '@/lib/types';

interface DefectStats {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
  closed: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

interface Props {
  defects: Defect[];
  userRole: string;
}

export default function DefectSummaryPanel({ defects, userRole }: Props) {
  const calculateStats = (defects: Defect[]): DefectStats => {
    return {
      total: defects.length,
      new: defects.filter(d => d.status === 'new').length,
      inProgress: defects.filter(d => d.status === 'inProgress').length,
      resolved: defects.filter(d => d.status === 'resolved').length,
      closed: defects.filter(d => d.status === 'closed').length,
      highPriority: defects.filter(d => d.priority === 'high').length,
      mediumPriority: defects.filter(d => d.priority === 'medium').length,
      lowPriority: defects.filter(d => d.priority === 'low').length,
    };
  };

  const stats = calculateStats(defects);

  const getTitle = () => {
    switch (userRole) {
      case 'engineer': return 'Мои дефекты';
      case 'manager': return 'Все дефекты';
      case 'director': return 'Общая статистика';
      default: return 'Дефекты';
    }
  };

  return (
    <div>
      <h2 className="text-xl text-black font-semibold mb-4">{getTitle()}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-gray-600 text-sm">Всего</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">{stats.new}</div>
          <div className="text-gray-600 text-sm">Новые</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
          <div className="text-gray-600 text-sm">В работе</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{stats.resolved + stats.closed}</div>
          <div className="text-gray-600 text-sm">Исправлено</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
          <div className="text-gray-600 text-sm">Высокий приор.</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">{stats.mediumPriority}</div>
          <div className="text-gray-600 text-sm">Средний приор.</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{stats.lowPriority}</div>
          <div className="text-gray-600 text-sm">Низкий приор.</div>
        </div>
      </div>
    </div>
  );
}