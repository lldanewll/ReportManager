"use client";

import React from "react";
import type { DefectStatus, Priority } from "@/lib/types";

export default function FilterBar({
    status,
    priority,
    onStatusChange,
    onPriorityChange,
}: {
    status: DefectStatus | "";
    priority: Priority | "";
    onStatusChange: (s: DefectStatus | "") => void;
    onPriorityChange: (p: Priority | "") => void;
}) {
    return (
        <div className="flex gap-2 items-center mb-4">
            <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value as DefectStatus | "")}
                className="border rounded p-2"
            >
                <option value="">Все статусы</option>
                <option value="new">Новая</option>
                <option value="in_progress">В работе</option>
                <option value="review">На проверке</option>
                <option value="closed">Закрыта</option>
                <option value="cancelled">Отменена</option>
            </select>

            <select
                value={priority}
                onChange={(e) => onPriorityChange(e.target.value as Priority | "")}
                className="border rounded p-2"
            >
                <option value="">Все приоритеты</option>
                <option value="high">Высокий</option>
                <option value="medium">Средний</option>
                <option value="low">Низкий</option>
            </select>
        </div>
    );
}
