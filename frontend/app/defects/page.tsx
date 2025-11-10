"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import DefectCard from "@/components/defects/DefectCard";
import FilterBar from "@/components/defects/FilterBar";
import ModalCreate from "@/components/defects/CreateDefectModal"
import type { Defect, DefectStatus, Priority } from "@/lib/types";

export default function DefectsPage() {
    const [defects, setDefects] = useState<Defect[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<DefectStatus | "">("");
    const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
    const [userRole, setUserRole] = useState<string>('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (!role) {
            router.push('/');
            return;
        }
        setUserRole(role);
    }, [router]);

    // Проверяем возможности
    const canCreateDefects = userRole === 'engineer';
    const canEditDefects = userRole === 'manager' || userRole === 'engineer';
    const canViewOnly = userRole === 'director';

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

    const handleCreateDefect = (newDefect: Defect) => {
        setDefects(prev => [newDefect, ...prev]);
        setShowCreateModal(false);
    };

    if (loading) return <div className="p-6">Загрузка дефектов...</div>;

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Дефекты</h1>
                
                {/* Кнопка создания только для инженера */}
                {canCreateDefects && (
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Создать дефект
                    </button>
                )}
                
                {/* Для руководителя показываем инфо */}
                {canViewOnly && (
                    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                        👑 Режим просмотра
                    </div>
                )}
            </div>

            <FilterBar
                status={statusFilter}
                priority={priorityFilter}
                onStatusChange={(s) => setStatusFilter(s)}
                onPriorityChange={(p) => setPriorityFilter(p)}
            />

            {/* Модалка создания дефекта */}
            {showCreateModal && (
                <ModalCreate 
                    onCreate={handleCreateDefect}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {/* Статистика по фильтрам */}
            <div className="mb-4 text-sm text-gray-600">
                Показано {filtered.length} из {defects.length} дефектов
                {(statusFilter || priorityFilter) && (
                    <span className="ml-2">
                        ({statusFilter && `Статус: ${statusFilter}`} 
                        {statusFilter && priorityFilter && ', '}
                        {priorityFilter && `Приоритет: ${priorityFilter}`})
                    </span>
                )}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Дефекты не найдены
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((defect) => (
                        <DefectCard 
                            key={defect.id} 
                            defect={defect} 
                            canEdit={canEditDefects}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}