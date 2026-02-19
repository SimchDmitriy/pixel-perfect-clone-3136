import React, { useState, useRef } from 'react';
import {
  Plus, MoreVertical, Link2, ChevronUp,
  LayoutDashboard, LayoutList, Grid3X3,
  Archive, Filter, Star, Calendar, BarChart3
} from 'lucide-react';
import { mockBoards, mockChildBoard } from '@/data/mockData';
import { KanbanCard } from '@/components/board/KanbanCard';
import { FilterPanel } from '@/components/board/FilterPanel';
import { RightPanel } from '@/components/board/RightPanel';
import type { KaitenColumn, KaitenBoard } from '@/data/mockData';

type ViewMode = 'board' | 'list' | 'table' | 'timeline';

const BoardPage: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [boardStates, setBoardStates] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {};
    mockBoards.forEach(b => { s[b.id] = b.collapsed ?? false; });
    s[mockChildBoard.id] = mockChildBoard.collapsed ?? false;
    return s;
  });

  const toggleBoard = (id: string) => {
    setBoardStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const viewButtons: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'board', icon: <LayoutDashboard className="h-3.5 w-3.5" />, label: 'Доски' },
    { mode: 'list', icon: <LayoutList className="h-3.5 w-3.5" />, label: '' },
    { mode: 'table', icon: <Grid3X3 className="h-3.5 w-3.5" />, label: '' },
    { mode: 'timeline', icon: <Calendar className="h-3.5 w-3.5" />, label: '' },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border px-3 h-[34px] shrink-0">
          <div className="flex items-center gap-0.5">
            {viewButtons.map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] transition-colors ${
                  viewMode === mode
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {icon}
                {label && <span>{label}</span>}
              </button>
            ))}
            <span className="mx-1 h-4 w-px bg-border" />
            <button className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary/50">
              <BarChart3 className="h-3.5 w-3.5" />
              Отчёты
            </button>
            <button className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary/50">
              <Archive className="h-3.5 w-3.5" />
              Архив
            </button>
            <button className="flex items-center gap-1 rounded bg-primary px-2.5 py-1 text-[11px] text-primary-foreground font-medium hover:brightness-110 transition-all">
              + Добавить
            </button>
          </div>
          <div className="flex items-center gap-0.5 relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] transition-colors ${
                filterOpen ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Фильтры
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50">
              <Star className="h-3.5 w-3.5" />
            </button>
            {filterOpen && (
              <FilterPanel onClose={() => setFilterOpen(false)} />
            )}
          </div>
        </div>

        {/* Board content */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex flex-1 min-w-0">
            {/* Left boards */}
            <div className="flex-1 min-w-0 overflow-auto">
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
            <div className="border-l border-border shrink-0 overflow-auto" style={{ width: 420 }}>
              <BoardSection
                board={mockChildBoard}
                collapsed={boardStates[mockChildBoard.id]}
                onToggle={() => toggleBoard(mockChildBoard.id)}
              />
            </div>
          </div>
        </div>
      </div>

      <RightPanel />
    </div>
  );
};

/* Board section */
const BoardSection: React.FC<{
  board: KaitenBoard;
  collapsed: boolean;
  onToggle: () => void;
}> = ({ board, collapsed, onToggle }) => {
  return (
    <div className="border-b border-border">
      {/* Board header */}
      <div
        className="flex items-center gap-1.5 px-3.5 py-1.5 cursor-pointer select-none group hover:bg-white/[0.015]"
        onClick={onToggle}
      >
        <span className="text-muted-foreground text-sm">⊞</span>
        <span className="text-foreground font-semibold text-[13px] flex-1">{board.title}</span>
        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground font-semibold">
          {board.cardCount} карточек
        </span>
        {/* Hover actions */}
        <div className="hidden group-hover:flex items-center gap-1 ml-1">
          <button onClick={e => { e.stopPropagation(); }} className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-secondary/50 text-xs">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button onClick={e => { e.stopPropagation(); }} className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-secondary/50 text-xs">
            <Link2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={e => { e.stopPropagation(); }} className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-secondary/50 text-xs">
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className={`text-muted-foreground transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}>
          <ChevronUp className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Expanded content */}
      {!collapsed && (
        <>
          <div className="flex">
            {board.lanes.map((lane) =>
              lane.columns.map((col) => (
                <ColumnView key={col.id} column={col} />
              ))
            )}
          </div>
          {/* Quick add */}
          <div className="px-3.5 py-2">
            <input
              placeholder="Сформулируйте задачу"
              className="w-full max-w-[300px] rounded bg-secondary px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary transition-colors"
            />
          </div>
        </>
      )}
    </div>
  );
};

const ColumnView: React.FC<{ column: KaitenColumn }> = ({ column }) => {
  const isOverWip = column.wipLimit && column.wipCurrent !== undefined && column.wipCurrent >= column.wipLimit;
  const isZero = column.wipCurrent === 0;

  return (
    <div className="min-w-[220px] w-[220px] shrink-0 border-r border-border last:border-r-0 flex flex-col">
      {/* Column header */}
      <div className="flex items-center px-2.5 py-1.5 border-b border-border text-[11px] text-muted-foreground gap-1 shrink-0 group/col">
        <span className="flex-1">{column.title}</span>
        <span
          className={`inline-flex items-center justify-center min-w-[22px] h-[18px] rounded-full text-[10px] font-semibold px-1.5 ${
            isOverWip
              ? 'text-primary-foreground'
              : isZero
              ? 'bg-secondary text-muted-foreground'
              : 'text-primary-foreground'
          }`}
          style={{
            backgroundColor: isOverWip
              ? 'hsl(0 72% 51%)'
              : isZero
              ? undefined
              : 'hsl(142 71% 45%)',
          }}
        >
          {column.wipCurrent}{column.wipLimit ? `/${column.wipLimit}` : ''}
        </span>
        <div className="flex gap-0.5 opacity-0 group-hover/col:opacity-100 transition-opacity">
          <button className="text-muted-foreground hover:text-foreground p-0.5">
            <Plus className="h-3 w-3" />
          </button>
          <button className="text-muted-foreground hover:text-foreground p-0.5">
            <MoreVertical className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-1.5 overflow-y-auto">
        {column.cards.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
        {column.cards.length === 0 && (
          <div className="flex items-center justify-center min-h-[50px] border border-dashed border-border rounded text-[11px] text-muted-foreground p-3">
            Нет карточек
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardPage;
