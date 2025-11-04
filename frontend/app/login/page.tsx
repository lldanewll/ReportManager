"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockUsers } from "@/data/mock/mockUsers";
import RoleDropdown from "@/components/RoleDropdown";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        const user = mockUsers.find(
            (u) => u.email === email && u.password === password
        );

        if (user) {
            localStorage.setItem("userRole", user.role);
            router.push("/dashboard");
        } else {
            setError("Неверная почта или пароль");
        }
    };

    const handleSelectRole = (email: string, password: string) => {
        setEmail(email);
        setPassword(password);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-80">
                <h1 className="text-2xl font-bold text-center mb-6">Вход в систему</h1>

                <input
                    type="email"
                    placeholder="Почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full mb-3"
                />

                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full mb-3"
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button
                    onClick={handleLogin}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-md w-full py-2 transition"
                >
                    Войти
                </button>

                <RoleDropdown onSelect={handleSelectRole} />
            </div>
        </div>
    );
}
