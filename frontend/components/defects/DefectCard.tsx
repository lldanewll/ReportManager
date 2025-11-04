"use client";

import React from "react";
import type { Defect } from "@/lib/types";

export default function DefectCard({ defect }: { defect: Defect }) {
    return (
        <article className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h3 className="text-lg font-semibold">{defect.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{defect.description}</p>
                </div>
                <div className="text-right text-xs">
                    <div className="mb-1">Приоритет: <strong className="uppercase">{defect.priority}</strong></div>
                    <div>Статус: <span className="font-medium">{defect.status}</span></div>
                </div>
            </div>
            <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                <div>Срок: {defect.dueDate ? new Date(defect.dueDate).toLocaleDateString("ru-RU") : "—"}</div>
                <div>ID: {defect.id}</div>
            </div>
        </article>
    );
}
