import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, Lock } from 'lucide-react';
import type { SavedFilter } from '@/data/mockData';

interface FilterContextMenuProps {
  x: number;
  y: number;
  filter: SavedFilter;
  isPublic: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const FilterContextMenu: React.FC<FilterContextMenuProps> = ({
  x,
  y,
  filter,
  isPublic,
  onClose,
  onEdit,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const canEdit = !isPublic || filter.author === 'me';
  const canDelete = !isPublic || filter.author === 'me';

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[999] min-w-[200px] bg-card-surface border border-border rounded-lg py-1 shadow-2xl"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {!isPublic ? (
        <>
          <button
            onClick={() => {
              onEdit();
              onClose();
            }}
            className="flex w-full items-center gap-1.5 px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Редактировать
          </button>
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="flex w-full items-center gap-1.5 px-3 py-1.5 text-[11px] text-destructive hover:bg-card-hover transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Удалить
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              if (canEdit) {
                onEdit();
                onClose();
              }
            }}
            disabled={!canEdit}
            className={`flex w-full items-center gap-1.5 px-3 py-1.5 text-[11px] transition-colors ${
              canEdit
                ? 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
                : 'text-muted-foreground/50 cursor-not-allowed opacity-50'
            }`}
          >
            <Edit2 className="h-3.5 w-3.5" />
            Редактировать
            {!canEdit && <Lock className="h-3 w-3 ml-auto" />}
          </button>
          <button
            onClick={() => {
              if (canDelete) {
                onDelete();
                onClose();
              }
            }}
            disabled={!canDelete}
            className={`flex w-full items-center gap-1.5 px-3 py-1.5 text-[11px] transition-colors ${
              canDelete
                ? 'text-destructive hover:bg-card-hover'
                : 'text-destructive/50 cursor-not-allowed opacity-50'
            }`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Удалить
            {!canDelete && <Lock className="h-3 w-3 ml-auto" />}
          </button>
        </>
      )}
    </div>
  );
};
