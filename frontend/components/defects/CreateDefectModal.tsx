"use client";

import React, { useState } from "react";
import type { Defect, Priority, DefectStatus } from "@/lib/types";

interface Props {
  onCreate: (d: Defect) => void;
  onClose: () => void;
}

export default function CreateDefectModal({ onCreate, onClose }: Props) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [dueDate, setDueDate] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const newDefect: Defect = {
            id: `D-${Date.now()}`,
            title,
            description: desc,
            priority,
            status: "new" as DefectStatus,
            projectId: 101,
            assigneeId: undefined, // Инженер создает дефект без исполнителя
            createdAt: new Date().toISOString(),
            dueDate: dueDate || undefined,
            attachments: [],
            history: [{
                when: new Date().toISOString(),
                who: 1, // TODO: использовать ID текущего пользователя
                action: "created"
            }],
        };

        try {
            const response = await fetch('/api/defects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDefect),
            });

            if (response.ok) {
                const createdDefect = await response.json();
                onCreate(createdDefect);
                // Сбрасываем форму
                setTitle("");
                setDesc("");
                setDueDate("");
                setPriority("medium");
                onClose();
            } else {
                console.error('Failed to create defect');
            }
        } catch (error) {
            console.error('Error creating defect:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setTitle("");
        setDesc("");
        setDueDate("");
        setPriority("medium");
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded shadow w-full max-w-md">
                <h2 className="text-lg font-semibold mb-3">Новый дефект</h2>

                <input
                    className="w-full p-2 border mb-2 rounded"
                    placeholder="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    className="w-full p-2 border mb-2 rounded"
                    placeholder="Описание"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                    rows={3}
                />

                <select
                    className="w-full p-2 border mb-2 rounded"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                >
                    <option value="high">Высокий</option>
                    <option value="medium">Средний</option>
                    <option value="low">Низкий</option>
                </select>

                <input
                    className="w-full p-2 border mb-4 rounded"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-3 py-1 border rounded hover:bg-gray-50"
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Создание...' : 'Создать'}
                    </button>
                </div>
            </form>
        </div>
    );
}