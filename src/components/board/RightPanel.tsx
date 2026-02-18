import React from 'react';
import { X, Plus, MoreVertical, CheckCircle } from 'lucide-react';
import { mockChildCards } from '@/data/mockData';
import { KanbanCard } from './KanbanCard';

interface RightPanelProps {
  onClose: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ onClose }) => {
  return (
    <div className="w-[380px] border-l border-border bg-right-panel-bg flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium text-sm">⊞ Дочки чек-листа</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Child board columns */}
      <div className="flex-1 overflow-auto p-3">
        <div className="flex gap-3 min-w-max">
          {mockChildCards.map((col) => {
            const isOverWip = col.wipLimit && col.wipCurrent && col.wipCurrent >= col.wipLimit;
            return (
              <div key={col.id} className="w-[160px] shrink-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs text-foreground font-medium">{col.title}</span>
                  <span
                    className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                      isOverWip ? 'bg-badge-red text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {col.wipCurrent}
                  </span>
                </div>
                <div className="space-y-2">
                  {col.cards.map((card) => (
                    <KanbanCard key={card.id} card={card} compact />
                  ))}
                  {col.cards.length === 0 && (
                    <div className="flex h-12 items-center justify-center rounded border border-dashed border-border text-[10px] text-muted-foreground">
                      Пусто
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right sidebar icons */}
      <div className="absolute right-0 top-11 bottom-0 w-10 border-l border-border bg-header-bg flex flex-col items-center py-3 gap-3">
        {['👥', '⏱️', '📋', '⚙️', '🌐', '🚫', '🔗', '🤝', '🔧'].map((icon, i) => (
          <button key={i} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};
