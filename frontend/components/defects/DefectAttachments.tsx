// components/defects/DefectAttachments.tsx
"use client";

import type { Attachment } from '@/lib/types';

interface Props {
  attachments: Attachment[];
  onDelete?: (attachmentId: string) => void;
  canDelete?: boolean;
}

export default function DefectAttachments({ attachments, onDelete, canDelete = false }: Props) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Прикрепленные фото:</h4>
      <div className="grid grid-cols-2 gap-2">
        {attachments.map(attachment => (
          <div key={attachment.id} className="relative group">
            <img
              src={attachment.url}
              alt={attachment.filename}
              className="w-full h-24 object-cover rounded border"
            />
            {canDelete && (
              <button
                onClick={() => onDelete?.(attachment.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}