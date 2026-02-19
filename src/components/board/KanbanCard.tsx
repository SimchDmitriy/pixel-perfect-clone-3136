import React from 'react';
import type { KaitenCard } from '@/data/mockData';
import { Users, Calendar, CheckSquare } from 'lucide-react';

interface KanbanCardProps {
  card: KaitenCard;
  compact?: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, compact }) => {
  return (
    <div className="group rounded-lg bg-card-surface hover:bg-card-hover transition-colors cursor-pointer relative overflow-hidden border border-transparent hover:border-border mb-1.5">
      {/* Color line at bottom-left */}
      {card.colorLine && (
        <div
          className="absolute bottom-0 left-0 h-0.5 w-8 rounded-br"
          style={{ backgroundColor: card.colorLine }}
        />
      )}

      <div className="p-2.5">
        {/* Parent title box */}
        {card.parentTitle && (
          <div className="rounded-md bg-white/[0.06] border border-white/[0.06] px-2.5 py-1.5 text-[11px] text-muted-foreground mb-1.5">
            {card.parentTitle}
          </div>
        )}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {card.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded px-2 py-0.5 text-[10px] font-semibold text-primary-foreground"
                style={{ backgroundColor: tag.color }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        {card.title && (
          <div className="text-xs leading-snug text-foreground mb-1.5">{card.title}</div>
        )}

        {/* Blocker badge */}
        {card.blockerCount && card.blockerCount > 0 && (
          <div className="mb-1.5">
            <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground" style={{ backgroundColor: 'hsl(0 72% 51%)' }}>
              <Users className="h-3 w-3" /> 0/{card.blockerCount}
            </span>
          </div>
        )}

        {/* Assignee */}
        {card.assignee && (
          <div className="mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] text-foreground">
              <Users className="h-3 w-3" /> {card.assignee}
            </span>
          </div>
        )}

        {/* Bottom row: meta + avatar */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            {card.subtasksTotal !== undefined && (
              <>
                <CheckSquare className="h-3 w-3" />
                <span>{card.subtasksDone || 0}/{card.subtasksTotal}</span>
              </>
            )}
            {card.progressValue !== undefined && (
              <span>{card.progressValue}</span>
            )}
            {card.dateRange && (
              <>
                <Calendar className="h-3 w-3" />
                <span>{card.dateRange}</span>
              </>
            )}
          </div>
          <div
            className="h-[22px] w-[22px] rounded-full flex items-center justify-center text-[9px] text-primary-foreground font-semibold"
            style={{ background: `linear-gradient(135deg, ${card.avatarColor}, #e8833a)` }}
          >
            ДС
          </div>
        </div>

        {/* Subtask progress bar */}
        {card.subtasksTotal !== undefined && card.subtasksTotal > 0 && (
          <div className="mt-1.5 h-[3px] w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${((card.subtasksDone || 0) / card.subtasksTotal) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
