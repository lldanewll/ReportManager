"use client";

import React, { useEffect, useMemo, useState } from "react";
import DefectCard from "@/components/defects/DefectCard";
import FilterBar from "@/components/defects/FilterBar";
import type { Defect, DefectStatus, Priority } from "@/lib/types";

export default function DefectsPage() {
    const [defects, setDefects] = useState<Defect[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<DefectStatus | "">("");
    const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");

    useEffect(() => {
        fetch("/api/defects")
            .then((r) => r.json())
            .then((data: Defect[]) => setDefects(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        return defects.filter((d) => {
            if (statusFilter && d.status !== statusFilter) return false;
            if (priorityFilter && d.priority !== priorityFilter) return false;
            return true;
        });
    }, [defects, statusFilter, priorityFilter]);

    if (loading) return <div className="p-6">Загрузка...</div>;
    if (!defects.length) return <div className="p-6">Дефекты не найдены</div>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Дефекты</h1>

            <FilterBar
                status={statusFilter}
                priority={priorityFilter}
                onStatusChange={(s) => setStatusFilter(s)}
                onPriorityChange={(p) => setPriorityFilter(p)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((d) => (
                    <DefectCard key={d.id} defect={d} />
                ))}
            </div>
        </main>
    );
}
