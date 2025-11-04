export type Role = "admin" | "manager" | "tester";

export interface MockUser {
    email: string;
    password: string;
    role: Role;
    name: string;
}

export const mockUsers = [
    {
        role: "Инженер",
        email: "engineer@example.com",
        password: "12345",
    },
    {
        role: "Менеджер",
        email: "manager@example.com",
        password: "12345",
    },
    {
        role: "Руководитель",
        email: "boss@example.com",
        password: "12345",
    },
];

