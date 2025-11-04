export type Role = 'engineer' | 'manager' | 'viewer';

export interface User {
    id: number;
    name: string;
    role: Role;
    phone?: string;
}

export interface Project {
    id: number;
    name: string;
    stage: string;
    location?: string;
    managerId?: number;
}

export type DefectStatus = 'new' | 'in_progress' | 'review' | 'closed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high';

export interface Attachment {
    id: string;
    name: string;
    url: string;
}

export interface HistoryEntry {
    when: string;
    who: number;
    action: string;
    note?: string;
}

export interface Defect {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: DefectStatus;
    projectId: number;
    assigneeId?: number;
    createdAt: string;
    dueDate?: string;
    attachments?: Attachment[];
    history?: HistoryEntry[];
}
