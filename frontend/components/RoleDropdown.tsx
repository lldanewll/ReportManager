"use client";

import { mockUsers } from "@/data/mock/mockUsers";

interface RoleDropdownProps {
    onSelect: (email: string, password: string) => void;
}

export default function RoleDropdown({ onSelect }: RoleDropdownProps) {
    return (
        <div className="mt-6">
            <label className="block text-gray-700 mb-2">Быстрый вход по роли:</label>
            <select
                onChange={(e) => {
                    const user = mockUsers.find((u) => u.email === e.target.value);
                    if (user) onSelect(user.email, user.password);
                }}
                className="border border-gray-300 rounded-md p-2 w-64"
            >
                <option value="">Выбери роль</option>
                {mockUsers.map((user) => (
                    <option key={user.email} value={user.email}>
                        {user.role} — {user.email}
                    </option>
                ))}
            </select>
        </div>
    );
}
