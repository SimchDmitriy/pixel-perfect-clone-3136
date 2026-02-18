import React from 'react';
import type { KaitenCard } from '@/data/mockData';
import { Users, MoreVertical } from 'lucide-react';

interface KanbanCardProps {
  card: KaitenCard;
  compact?: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, compact }) => {
  return (
    <div className="group rounded-md border border-border bg-card-surface hover:bg-card-hover transition-colors cursor-pointer relative overflow-hidden">
      {/* Color line at top */}
      {card.colorLine && (
        <div className="h-0.5 w-8" style={{ backgroundColor: card.colorLine }} />
      )}

      <div className="p-3">
        {/* Parent title */}
        {card.parentTitle && (
          <div className="text-[11px] text-muted-foreground mb-1 truncate">{card.parentTitle}</div>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex gap-1 mb-1.5">
            {card.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium text-primary-foreground"
                style={{ backgroundColor: tag.color }}
              >
                🔥 {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* Blocker badge */}
        {card.blockerCount && card.blockerCount > 0 && (
          <div className="mb-1.5">
            <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold bg-badge-red text-primary-foreground">
              <Users className="h-3 w-3" /> 0/{card.blockerCount}
            </span>
          </div>
        )}

        {/* Title */}
        {card.title && (
          <div className="text-sm text-foreground mb-2 leading-tight">{card.title}</div>
        )}

        {/* Assignee */}
        {card.assignee && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[11px] text-foreground">
              <Users className="h-3 w-3" /> {card.assignee}
            </span>
          </div>
        )}

        {/* Bottom row: progress + avatar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            {card.progressValue !== undefined && <span>{card.progressValue}</span>}
            {card.subtasksTotal !== undefined && (
              <span>
                {card.subtasksDone}/{card.subtasksTotal}
              </span>
            )}
          </div>
          <div
            className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] text-primary-foreground font-bold"
            style={{ backgroundColor: card.avatarColor }}
          >
            ДС
          </div>
        </div>

        {/* Subtask progress bar */}
        {card.subtasksTotal !== undefined && card.subtasksTotal > 0 && (
          <div className="mt-1.5 h-1 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${((card.subtasksDone || 0) / card.subtasksTotal) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Hover actions */}
      <button className="absolute right-1 top-1 hidden group-hover:block text-muted-foreground hover:text-foreground">
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  );
};
