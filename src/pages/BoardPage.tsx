import React, { useState } from 'react';
import { Plus, MoreVertical, Link2, ChevronUp, LayoutDashboard, LayoutList, Grid3X3, SlidersHorizontal, Archive, Filter } from 'lucide-react';
import { mockLanes, mockChildCards } from '@/data/mockData';
import { KanbanCard } from '@/components/board/KanbanCard';
import { FilterPanel } from '@/components/board/FilterPanel';
import { RightPanel } from '@/components/board/RightPanel';
import type { KaitenColumn } from '@/data/mockData';

type ViewMode = 'board' | 'list' | 'table' | 'timeline';

const BoardPage: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [laneCollapsed, setLaneCollapsed] = useState(false);

  const viewButtons: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'board', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Доски' },
    { mode: 'list', icon: <LayoutList className="h-4 w-4" />, label: '' },
    { mode: 'table', icon: <Grid3X3 className="h-4 w-4" />, label: '' },
    { mode: 'timeline', icon: <SlidersHorizontal className="h-4 w-4" />, label: '' },
  ];

  return (
    <div className="flex h-full">
      {/* Main board area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-1.5 shrink-0">
          <div className="flex items-center gap-1">
            {viewButtons.map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded p-1.5 transition-colors ${
                  viewMode === mode ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {icon}
              </button>
            ))}
            <span className="mx-2 h-4 w-px bg-border" />
            <button className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1">
              <Archive className="h-3.5 w-3.5" />
              Отчёты
            </button>
            <button className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1">
              <Archive className="h-3.5 w-3.5" />
              Архив
            </button>
            <button className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" />
              Добавить
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                filterOpen ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Фильтры
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <Star className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Board title */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 shrink-0">
          <span className="text-foreground font-medium text-sm">⊞ Родитель дочка</span>
          <span className="rounded bg-primary px-2 py-0.5 text-[10px] text-primary-foreground font-medium">
            10 карточек
          </span>
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Board content */}
        <div className="flex-1 overflow-auto p-4">
          {mockLanes.map((lane) => (
            <div key={lane.id} className="mb-4">
              {/* Lane header */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setLaneCollapsed(!laneCollapsed)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {laneCollapsed ? (
                    <ChevronUp className="h-4 w-4 rotate-180" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </button>
                <span className="text-foreground font-medium text-sm">⊞ {lane.title}</span>
                <div className="ml-auto flex items-center gap-1">
                  <button className="text-muted-foreground hover:text-foreground">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Link2 className="h-4 w-4" />
                  </button>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setLaneCollapsed(!laneCollapsed)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {!laneCollapsed && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {lane.columns.map((col) => (
                    <ColumnView key={col.id} column={col} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Quick add */}
          <div className="mt-2">
            <input
              placeholder="Сформулируйте задачу"
              className="w-[300px] rounded bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Right panel */}
      {rightPanelOpen && <RightPanel onClose={() => setRightPanelOpen(false)} />}

      {/* Filter panel overlay */}
      {filterOpen && <FilterPanel onClose={() => setFilterOpen(false)} />}
    </div>
  );
};

const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ColumnView: React.FC<{ column: KaitenColumn }> = ({ column }) => {
  const isOverWip = column.wipLimit && column.wipCurrent && column.wipCurrent >= column.wipLimit;

  return (
    <div className="w-[280px] shrink-0">
      {/* Column header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground font-medium">{column.title}</span>
          <span
            className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
              isOverWip ? 'bg-badge-red text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}
          >
            {column.wipCurrent}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="text-muted-foreground hover:text-foreground">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {column.cards.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
      </div>

      {column.cards.length === 0 && (
        <div className="flex h-20 items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground">
          Нет карточек
        </div>
      )}
    </div>
  );
};

export default BoardPage;
