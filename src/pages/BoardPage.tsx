import React, { useState, useRef } from 'react';
import {
  Plus, MoreVertical, Link2, ChevronUp, ChevronDown,
  LayoutDashboard, LayoutList, Grid3X3, SlidersHorizontal,
  Archive, Filter, Star, Calendar
} from 'lucide-react';
import { mockBoards, mockChildBoard, filterOptions } from '@/data/mockData';
import { KanbanCard } from '@/components/board/KanbanCard';
import { FilterPanel } from '@/components/board/FilterPanel';
import { RightPanel } from '@/components/board/RightPanel';
import type { KaitenColumn, KaitenBoard } from '@/data/mockData';

type ViewMode = 'board' | 'list' | 'table' | 'timeline';

const BoardPage: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [boardStates, setBoardStates] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {};
    mockBoards.forEach(b => { s[b.id] = b.collapsed ?? false; });
    s[mockChildBoard.id] = mockChildBoard.collapsed ?? false;
    return s;
  });
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  const toggleBoard = (id: string) => {
    setBoardStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const collapseAll = () => {
    const newState: Record<string, boolean> = {};
    Object.keys(boardStates).forEach(k => { newState[k] = true; });
    setBoardStates(newState);
  };

  const expandAll = () => {
    const newState: Record<string, boolean> = {};
    Object.keys(boardStates).forEach(k => { newState[k] = false; });
    setBoardStates(newState);
  };

  const allCollapsed = Object.values(boardStates).every(v => v);

  const viewButtons: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'board', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Доски' },
    { mode: 'list', icon: <LayoutList className="h-4 w-4" />, label: '' },
    { mode: 'table', icon: <Grid3X3 className="h-4 w-4" />, label: '' },
    { mode: 'timeline', icon: <Calendar className="h-4 w-4" />, label: '' },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main board area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-1.5 shrink-0">
          <div className="flex items-center gap-1">
            {viewButtons.map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                  viewMode === mode
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {icon}
                {label && <span>{label}</span>}
              </button>
            ))}
            <span className="mx-2 h-4 w-px bg-border" />
            <button className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
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
          <div className="flex items-center gap-2 relative">
            <button
              ref={filterBtnRef}
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                filterOpen ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Фильтры
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <Star className="h-4 w-4" />
            </button>
            {/* Filter dropdown */}
            {filterOpen && (
              <FilterPanel onClose={() => setFilterOpen(false)} />
            )}
          </div>
        </div>

        {/* Board content - scrollable */}
        <div className="flex-1 overflow-auto">
          <div className="flex min-h-full">
            {/* Left boards section */}
            <div className="flex-1 min-w-0">
              {mockBoards.map((board) => (
                <BoardSection
                  key={board.id}
                  board={board}
                  collapsed={boardStates[board.id]}
                  onToggle={() => toggleBoard(board.id)}
                />
              ))}
            </div>

            {/* Right board: Дочки чек-листа */}
            <div className="border-l border-border shrink-0" style={{ width: '420px' }}>
              <BoardSection
                board={mockChildBoard}
                collapsed={boardStates[mockChildBoard.id]}
                onToggle={() => toggleBoard(mockChildBoard.id)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right icon strip */}
      <RightPanel />
    </div>
  );
};

/* Board section - collapsible board header + kanban content */
const BoardSection: React.FC<{
  board: KaitenBoard;
  collapsed: boolean;
  onToggle: () => void;
}> = ({ board, collapsed, onToggle }) => {
  return (
    <div className="border-b border-border">
      {/* Board header row */}
      <div
        className="flex items-center gap-2 px-4 py-2 hover:bg-secondary/30 cursor-pointer group"
        onClick={onToggle}
      >
        <span className="text-muted-foreground">⊞</span>
        <span className="text-foreground font-medium text-sm">{board.title}</span>
        <span className="rounded bg-primary px-2 py-0.5 text-[10px] text-primary-foreground font-medium ml-2">
          {board.cardCount} карточек
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground ml-1 transition-transform ${
            collapsed ? '' : 'rotate-180'
          }`}
        />
        {/* Hover actions */}
        <div className="ml-auto hidden group-hover:flex items-center gap-1">
          <button
            onClick={e => { e.stopPropagation(); }}
            className="text-muted-foreground hover:text-foreground p-0.5"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); }}
            className="text-muted-foreground hover:text-foreground p-0.5"
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); }}
            className="text-muted-foreground hover:text-foreground p-0.5"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronUp className={`h-3.5 w-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Board content (expanded) */}
      {!collapsed && (
        <div className="px-4 pb-4">
          {board.lanes.map((lane) => (
            <div key={lane.id}>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {lane.columns.map((col) => (
                  <ColumnView key={col.id} column={col} />
                ))}
              </div>
            </div>
          ))}

          {/* Quick add input */}
          <div className="mt-2">
            <input
              placeholder="Сформулируйте задачу"
              className="w-full max-w-[300px] rounded bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ColumnView: React.FC<{ column: KaitenColumn }> = ({ column }) => {
  const isOverWip = column.wipLimit && column.wipCurrent && column.wipCurrent >= column.wipLimit;

  return (
    <div className="w-[200px] lg:w-[240px] shrink-0">
      {/* Column header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground font-medium">{column.title}</span>
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
            <Plus className="h-3 w-3" />
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-3 w-3" />
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
        <div className="flex h-16 items-center justify-center rounded border border-dashed border-border text-[10px] text-muted-foreground">
          Нет карточек
        </div>
      )}
    </div>
  );
};

export default BoardPage;
