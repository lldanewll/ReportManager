"use client";

import React, { useState } from "react";
import type { Defect, DefectStatus, Engineer } from "@/lib/types";
import EditDefectModal from './EditDefectModal';
import AddPhotoModal from './AddPhotoModal';
import DefectAttachments from './DefectAttachments';

interface Props {
    defect: Defect;
    canEdit?: boolean;
    onDefectUpdate?: (updatedDefect: Defect) => void;
    showPhotoButton?: boolean;
    onAssignEngineer?: (defect: Defect) => void;
    engineers?: Engineer[];
    userRole?: string;
}

export default function DefectCard({ 
    defect, 
    canEdit = false, 
    onDefectUpdate, 
    showPhotoButton = false,
    onAssignEngineer,
    engineers = [],
    userRole = ''
}: Props) {
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(defect.status);

    const handleStatusChange = async (newStatus: DefectStatus) => {
        try {
            console.log('🔄 Starting status change for defect:', defect.id, 'to:', newStatus);
            
            const response = await fetch(`/api/defects/${defect.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            console.log('📡 Response status:', response.status);
            
            if (response.ok) {
                const updatedDefect = await response.json();
                console.log('✅ Status updated successfully:', updatedDefect);
                setCurrentStatus(newStatus);
                onDefectUpdate?.(updatedDefect);
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to update status:', response.status, errorText);
            }
        } catch (error) {
            console.error('❌ Error updating status:', error);
        } finally {
            setIsChangingStatus(false);
        }
    };

    const handleAddPhotoClick = () => {
        setShowAddPhotoModal(true);
    };

    const handleAddPhoto = async (defectId: string, file: File) => {
        try {
            const formData = new FormData();
            formData.append('photo', file);

            const response = await fetch(`/api/defects/${defectId}/attachments`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const updatedDefect = await response.json();
                console.log('✅ Photo added successfully');
                onDefectUpdate?.(updatedDefect);
            } else {
                throw new Error('Failed to upload photo');
            }
        } catch (error) {
            console.error('❌ Error uploading photo:', error);
            throw error;
        }
    };

    const handleDeletePhoto = async (attachmentId: string) => {
        try {
            const response = await fetch(`/api/defects/${defect.id}/attachments/${attachmentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedDefect = await response.json();
                console.log('✅ Photo deleted successfully');
                onDefectUpdate?.(updatedDefect);
            }
        } catch (error) {
            console.error('❌ Error deleting photo:', error);
        }
    };

    const handleAssignClick = () => {
        onAssignEngineer?.(defect);
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const getStatusOptions = (currentStatus: DefectStatus): DefectStatus[] => {
        const statusFlow: Record<DefectStatus, DefectStatus[]> = {
            'new': ['inProgress', 'closed'],
            'inProgress': ['resolved', 'closed'],
            'resolved': ['closed', 'inProgress'],
            'closed': ['inProgress']
        };
        return statusFlow[currentStatus] || [];
    };

    const statusDisplayNames: Record<DefectStatus, string> = {
        'new': 'Новый',
        'inProgress': 'В работе',
        'resolved': 'Решен',
        'closed': 'Закрыт'
    };

    const getAssigneeName = () => {
        if (!defect.assigneeId) return 'Не назначен';
        
        if (!engineers || engineers.length === 0) {
            return 'Загрузка...';
        }
        
        const engineer = engineers.find(eng => eng.id === defect.assigneeId);
        
        if (!engineer) {
            console.warn(`❌ Engineer with ID ${defect.assigneeId} not found`);
            return `Инженер #${defect.assigneeId}`;
        }
        
        return `${engineer.name} (${engineer.specialization})`;
    };

    // Определяем возможности
    const canChangeStatus = userRole === 'engineer' || userRole === 'manager';
    const canEditDefect = userRole === 'manager';
    const canAssignEngineer = userRole === 'manager';
    const isDirector = userRole === 'director';
    const canManagePhotos = userRole === 'engineer'; // Только инженер может управлять фото

    return (
        <>
            <article className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                        <h3 className="text-lg text-black font-medium font-semibold">{defect.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{defect.description}</p>
                    </div>
                    <div className="text-right text-xs min-w-[100px]">
                        <div className="mb-1 text-black">
                            Приоритет: <strong className={`uppercase ${
                                defect.priority === 'high' ? 'text-red-600' :
                                defect.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                                {defect.priority}
                            </strong>
                        </div>
                        <div className="text-black">
                            Статус: <span className={`font-medium ${
                                currentStatus === 'new' ? 'text-blue-600' :
                                currentStatus === 'inProgress' ? 'text-orange-600' : 
                                currentStatus === 'resolved' ? 'text-green-600' : 'text-gray-600'
                            }`}>
                                {statusDisplayNames[currentStatus]}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <div>Срок: {defect.dueDate ? new Date(defect.dueDate).toLocaleDateString("ru-RU") : "—"}</div>
                    <div>ID: {defect.id}</div>
                </div>
                
                {/* Информация о исполнителе */}
                {(canAssignEngineer || isDirector) && (
                    <div className="mt-2 text-xs text-gray-500">
                        Исполнитель: <span className="font-medium">{getAssigneeName()}</span>
                    </div>
                )}
                
                {/* Прикрепленные фото */}
                <DefectAttachments 
                    attachments={defect.attachments || []}
                    onDelete={canManagePhotos ? handleDeletePhoto : undefined}
                    canDelete={canManagePhotos}
                />
                
                {/* Кнопки действий */}
                {(canChangeStatus || showPhotoButton || canAssignEngineer || canEditDefect) && (
                    <div className="mt-3 flex gap-2 border-t pt-3 flex-wrap">
                        {/* Кнопка редактирования для менеджера */}
                        {canEditDefect && (
                            <button 
                                onClick={handleEditClick}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                            >
                                Редактировать
                            </button>
                        )}
                        
                        {/* Смена статуса для инженера и менеджера */}
                        {canChangeStatus && (
                            <>
                                {isChangingStatus ? (
                                    <div className="flex gap-1 flex-wrap">
                                        {getStatusOptions(currentStatus).map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(status)}
                                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                                            >
                                                {statusDisplayNames[status]}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setIsChangingStatus(false)}
                                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsChangingStatus(true)}
                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                                    >
                                        Сменить статус
                                    </button>
                                )}
                            </>
                        )}
                        
                        {/* Добавление фото для инженера */}
                        {showPhotoButton && (
                            <button 
                                onClick={handleAddPhotoClick}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                            >
                                📷 Добавить фото
                            </button>
                        )}

                        {/* Назначение инженера для менеджера */}
                        {canAssignEngineer && (
                            <button 
                                onClick={handleAssignClick}
                                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                            >
                                👷 Назначить
                            </button>
                        )}
                    </div>
                )}
            </article>

            {showEditModal && (
                <EditDefectModal
                    defect={defect}
                    onUpdate={onDefectUpdate!}
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {showAddPhotoModal && (
                <AddPhotoModal
                    defect={defect}
                    onAdd={handleAddPhoto}
                    onClose={() => setShowAddPhotoModal(false)}
                />
            )}
        </>
    );
}