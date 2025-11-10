"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface TestUser {
  email: string;
  password: string;
  role: string;
  name: string;
  engineerId?: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const testUsers: TestUser[] = [
    {
      email: "engineer1@example.com",
      password: "12345",
      role: "engineer",
      name: "Алексей Петров",
      engineerId: 1
    },
    {
      email: "engineer2@example.com", 
      password: "12345",
      role: "engineer",
      name: "Иван Сидоров",
      engineerId: 2
    },
    {
      email: "engineer3@example.com",
      password: "12345", 
      role: "engineer",
      name: "Мария Иванова",
      engineerId: 3
    },
    {
      email: "manager@example.com",
      password: "12345",
      role: "manager", 
      name: "Менеджер Системы"
    },
    {
      email: "boss@example.com",
      password: "12345",
      role: "director",
      name: "Руководитель"
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== "12345") {
      setError("Неверный пароль");
      setLoading(false);
      return;
    }

    const user = testUsers.find(u => u.email === email);
    
    if (!user) {
      setError("Пользователь не найден");
      setLoading(false);
      return;
    }

    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.name);
    if (user.engineerId) {
      localStorage.setItem('engineerId', user.engineerId.toString());
    }
  
    router.push('/dashboard');
    setLoading(false);
  };

  const fillTestCredentials = (testEmail: string) => {
    setEmail(testEmail);
    setPassword("12345");
  };

  const getRoleDisplayName = (user: TestUser) => {
    const roleNames = {
      engineer: '👷 Инженер',
      manager: '🧭 Менеджер', 
      director: '👑 Руководитель'
    };
    return `${roleNames[user.role as keyof typeof roleNames]} - ${user.name}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ReportManager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Система управления дефектами
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Email адрес"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <div className="mt-6">
          <div className="text-center text-sm text-gray-600 mb-3">
            Тестовые аккаунты (кликните для заполнения):
          </div>
          <div className="space-y-2">
            {testUsers.map((user, index) => (
              <button
                key={index}
                type="button"
                onClick={() => fillTestCredentials(user.email)}
                className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">
                  {getRoleDisplayName(user)}
                </div>
                <div className="text-sm text-gray-600">
                  {user.email} / 12345
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}