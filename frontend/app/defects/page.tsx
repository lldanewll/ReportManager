"use client";

import React, { useEffect, useState } from "react";
import DefectCard from "@/components/defects/DefectCard";
import type { Defect } from "@/lib/types";

export default function DefectsPage() {
    const [defects, setDefects] = useState<Defect[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/defects")
            .then((r) => r.json())
            .then((data: Defect[]) => {
                setDefects(data);
            })
            .catch((err) => {
                console.error("Failed to fetch defects", err);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-6">Загрузка...</div>;
    if (!defects || defects.length === 0) return <div className="p-6">Дефекты не найдены</div>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Дефекты</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {defects.map((d) => (
                    <DefectCard key={d.id} defect={d} />
                ))}
            </div>
        </main>
    );
}
