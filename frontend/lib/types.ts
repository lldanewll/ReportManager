// lib/types.ts
export type Role = "engineer" | "manager" | "viewer";

export type DefectStatus = "new" | "inProgress" | "resolved" | "closed";
export type Priority = "high" | "medium" | "low";

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
    attachments: Attachment[];
    history: HistoryEntry[];
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
  uploadedBy: number;
}


export interface Attachment {
    id: string;
    name: string;
    url: string;
}

export interface HistoryEntry {
    when: string;
    who: number;
    action: string;
}

export interface Engineer {
  id: number;
  name: string;
  email: string;
  specialization: string;
}