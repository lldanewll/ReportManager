// lib/types.ts
export type Role = "engineer" | "manager" | "viewer";

export type DefectStatus = "new" | "in_progress" | "review" | "closed" | "cancelled";
export type Priority = "low" | "medium" | "high";

export interface Attachment {
    id: string;
    name: string;
    url: string;
}

export interface HistoryEntry {
    when: string;
    who: number; // user id
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
