"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import DefectSummaryPanel from '@/components/dashboard/DefectSummaryPanel';
import DefectsList from '@/components/dashboard/DefectsList';
import DirectorDashboard from '@/components/dashboard/DirectorDashboard';
import type { Defect, Engineer } from '@/lib/types';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [defects, setDefects] = useState<Defect[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    
    if (!role || !email) {
      router.push('/');
      return;
    }
    
    setUserRole(role);
    setUserEmail(email);
  }, [router]);

  // Загружаем данные после установки userRole
  useEffect(() => {
    if (userRole) {
      loadData();
    }
  }, [userRole]);

  const loadData = async () => {
    try {
      console.log('🔄 Loading data for role:', userRole);
      setLoading(true);
      
      // Загружаем engineers ПЕРВЫМИ для менеджера и директора
      if (userRole === 'manager' || userRole === 'director') {
        console.log('1. Loading engineers...');
        const engineersResponse = await fetch('/api/engineers');
        
        if (engineersResponse.ok) {
          const engineersData = await engineersResponse.json();
          console.log('✅ Loaded engineers:', engineersData.length);
          setEngineers(engineersData);
        } else {
          console.error('❌ Failed to load engineers, status:', engineersResponse.status);
          // Устанавливаем пустой массив чтобы избежать ошибок
          setEngineers([]);
        }
      }

      // Затем загружаем дефекты
      console.log('2. Loading defects...');
      const defectsResponse = await fetch('/api/defects');
      if (defectsResponse.ok) {
        const defectsData = await defectsResponse.json();
        console.log('✅ Loaded defects:', defectsData.length);
        setDefects(defectsData);
      } else {
        console.error('❌ Failed to load defects');
      }

    } catch (error) {
      console.error('❌ Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Получаем ID текущего инженера
  const getCurrentEngineerId = () => {
    if (userRole !== 'engineer') return null;
    const engineerId = localStorage.getItem('engineerId');
    return engineerId ? parseInt(engineerId) : null;
  };

  // Фильтруем дефекты для инженера
  const getFilteredDefects = () => {
    if (userRole === 'engineer') {
      const engineerId = getCurrentEngineerId();
      console.log('🔍 Filtering defects for engineer:', engineerId);
      return defects.filter(defect => defect.assigneeId === engineerId);
    }
    return defects;
  };

  const handleDefectUpdate = () => {
    loadData(); // Перезагружаем данные при обновлении дефекта
  };

  const handleAssignEngineer = (defect: Defect) => {
    console.log('Assign engineer for defect:', defect.id);
    // Здесь будет логика открытия модалки назначения
  };

  if (!userRole || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredDefects = getFilteredDefects();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar userRole={userRole} userEmail={userEmail} />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <DefectSummaryPanel 
            defects={userRole === 'engineer' ? filteredDefects : defects}
            userRole={userRole}
          />

          {userRole === 'engineer' && (
            <DefectsList 
              defects={filteredDefects} 
              userRole={userRole}
              onDefectUpdate={handleDefectUpdate}
              engineers={engineers}
            />
          )}

          {userRole === 'manager' && (
            <DefectsList 
              defects={defects} 
              userRole={userRole}
              onDefectUpdate={handleDefectUpdate}
              engineers={engineers}
              onAssignEngineer={handleAssignEngineer}
            />
          )}

          {userRole === 'director' && (
            <DirectorDashboard defects={defects} engineers={engineers} />
          )}
        </div>
      </div>
    </div>
  );
}