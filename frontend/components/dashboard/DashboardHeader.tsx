"use client";

import { useRouter } from 'next/navigation';

export default function DashboardHeader({ userRole, userEmail }: { userRole: string, userEmail: string }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const getRoleInfo = (role: string) => {
    switch(role) {
      case 'engineer': return { name: '👷 Инженер', desc: 'Создание и обновление дефектов' };
      case 'manager': return { name: '🧭 Менеджер', desc: 'Назначение задач, контроль сроков' };
      case 'director': return { name: '👑 Руководитель', desc: 'Просмотр прогресса и отчётов' };
      default: return { name: 'Пользователь', desc: '' };
    }
  };

  const roleInfo = getRoleInfo(userRole);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ReportManager</h1>
            <p className="text-gray-600">{roleInfo.name} • {userEmail}</p>
            <p className="text-sm text-gray-500">{roleInfo.desc}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex gap-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-700 hover:text-blue-600"
              >
                Дашборд
              </button>
              <button 
                onClick={() => router.push('/projects')}
                className="text-gray-700 hover:text-blue-600"
              >
                Проекты
              </button>
              <button 
                onClick={() => router.push('/defects')}
                className="text-gray-700 hover:text-blue-600"
              >
                Дефекты
              </button>
              {(userRole === 'manager' || userRole === 'director') && (
                <button 
                  onClick={() => router.push('/reports')}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Отчёты
                </button>
              )}
            </nav>
            
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}