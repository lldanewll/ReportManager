"use client";

import React, { useState } from "react";
import type { Defect, Priority, DefectStatus } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export default function CreateDefectModal({ onCreate }: { onCreate: (d: Defect) => void }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [dueDate, setDueDate] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const newDefect: Defect = {
            id: `D-${Math.floor(Math.random() * 100000)}`,
            title,
            description: desc,
            priority,
            status: "new" as DefectStatus,
            projectId: 101,
            assigneeId: undefined,
            createdAt: new Date().toISOString(),
            dueDate: dueDate || undefined,
            attachments: [],
            history: [{ when: new Date().toISOString(), who: 0, action: "created" }],
        };
        onCreate(newDefect);
        setOpen(false);
        setTitle(""); setDesc(""); setDueDate("");
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="bg-green-600 text-white px-3 py-1 rounded">
                Создать дефект
            </button>

            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-3">Новый дефект</h2>
                        <input className="w-full p-2 border mb-2" placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <textarea className="w-full p-2 border mb-2" placeholder="Описание" value={desc} onChange={(e) => setDesc(e.target.value)} required />
                        <select className="w-full p-2 border mb-2" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                            <option value="high">Высокий</option>
                            <option value="medium">Средний</option>
                            <option value="low">Низкий</option>
                        </select>
                        <input className="w-full p-2 border mb-4" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1 border rounded">Отмена</button>
                            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Создать</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
