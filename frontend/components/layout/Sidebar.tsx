"use client";

import { useRouter } from 'next/navigation';

interface SidebarProps {
  userRole: string;
  userEmail: string;
}

export default function Sidebar({ userRole, userEmail }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('engineerId');
    router.push('/');
  };

  // Меню для инженера - только "Мои дефекты"
  const engineerMenu = [
    { label: 'Мои дефекты', path: '/dashboard', icon: '👷' },
  ];

  // Меню для менеджера
  const managerMenu = [
    { label: 'Управление дефектами', path: '/dashboard', icon: '📋' },
    { label: 'Проекты', path: '/projects', icon: '🏗️' },
    { label: 'Отчёты', path: '/reports', icon: '📊' },
  ];

  // Меню для руководителя
  const directorMenu = [
  { label: 'Аналитика и просмотр', path: '/dashboard', icon: '📊' },
];

  const getMenu = () => {
    switch (userRole) {
      case 'engineer': return engineerMenu;
      case 'manager': return managerMenu;
      case 'director': return directorMenu;
      default: return [];
    }
  };

  const getRoleName = () => {
    switch (userRole) {
      case 'engineer': return '👷 Инженер';
      case 'manager': return '🧭 Менеджер';
      case 'director': return '👑 Руководитель';
      default: return 'Пользователь';
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen sticky top-0 flex flex-col">
      {/* Заголовок */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">ReportManager</h1>
        <p className="text-sm text-gray-600 mt-1">{getRoleName()}</p>
        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
      </div>

      {/* Навигация */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {getMenu().map((item, index) => (
            <li key={index}>
              <button
                onClick={() => router.push(item.path)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors text-gray-700"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Выход */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors text-gray-700"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Выйти</span>
        </button>
      </div>
    </div>
  );
}