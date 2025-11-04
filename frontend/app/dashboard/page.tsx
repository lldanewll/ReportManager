"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const userRole = localStorage.getItem("userRole");
        if (!userRole) {
            router.push("/login");
        } else {
            setRole(userRole);
        }
    }, [router]);

    if (!role) return null;

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h1 className="text-3xl font-bold">Добро пожаловать, {role}!</h1>
            <button
                onClick={() => {
                    localStorage.removeItem("userRole");
                    router.push("/login");
                }}
                className="mt-6 bg-red-500 hover:bg-red-600 text-white rounded-md py-2 px-4"
            >
                Выйти
            </button>
        </div>
    );
}
