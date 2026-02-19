import React, { useState, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Plus, MoreVertical, Link2, ChevronUp,
  LayoutDashboard, LayoutList, Grid3X3,
  Archive, Filter, Star, Calendar, BarChart3
} from 'lucide-react';
import { mockBoards, mockChildBoard, mockSearchWorkBoard } from '@/data/mockData';
import { KanbanCard } from '@/components/board/KanbanCard';
import { FilterPanel } from '@/components/board/FilterPanel';
import { RightPanel } from '@/components/board/RightPanel';
import type { KaitenColumn, KaitenBoard } from '@/data/mockData';

type ViewMode = 'board' | 'list' | 'table' | 'timeline';

const BoardPage: React.FC = () => {
  const { spaceId } = useParams();
  const currentSpaceId = spaceId ?? 'parent-child';
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const boardsConfig = useMemo(() => {
    if (currentSpaceId === 'work-search') {
      return {
        mode: 'single' as const,
        mainBoards: [mockSearchWorkBoard],
      };
    }
    // default: parent-child
    return {
      mode: 'parent-child' as const,
      parentBoard: mockBoards.find((b) => b.id === 'board-parent')!,
      moveBoard: mockBoards.find((b) => b.id === 'board-move')!,
      childBoard: mockChildBoard,
    };
  }, [currentSpaceId]);

  const [boardStates, setBoardStates] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {};
    // initialize with all known boards
    [...mockBoards, mockChildBoard, mockSearchWorkBoard].forEach((b) => {
      s[b.id] = b.collapsed ?? false;
    });
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
              <FilterPanel onClose={() => setFilterOpen(false)} currentSpace={currentSpaceId} />
            )}
          </div>
        </div>

        {/* Board content */}
        {/* Single scroll area for all boards (no per-board scrollbars) */}
        <div className="flex-1 overflow-auto flex flex-col">
          {boardsConfig.mode === 'single' ? (
            <div className="min-w-0">
              {boardsConfig.mainBoards.map((board) => (
                <BoardSection
                  key={board.id}
                  board={board}
                  collapsed={boardStates[board.id]}
                  onToggle={() => toggleBoard(board.id)}
                />
              ))}
            </div>
          ) : (
            <>
              {/* Top row: Родитель дочка and Дочки чек-листа - no scroll between them */}
              <div className="flex min-w-0">
                {/* Left board: Родитель дочка */}
                <div className="flex-1 min-w-0 border-r border-border">
                  <BoardSection
                    board={boardsConfig.parentBoard}
                    collapsed={boardStates[boardsConfig.parentBoard.id]}
                    onToggle={() => toggleBoard(boardsConfig.parentBoard.id)}
                  />
                </div>

                {/* Right board: Дочки чек-листа */}
                <div className="shrink-0" style={{ width: 420 }}>
                  <BoardSection
                    board={boardsConfig.childBoard}
                    collapsed={boardStates[boardsConfig.childBoard.id]}
                    onToggle={() => toggleBoard(boardsConfig.childBoard.id)}
                  />
                </div>
              </div>
              
              {/* Bottom board: Перемещение - separated */}
              <div className="min-w-0 border-t-2 border-border/50">
                <BoardSection
                  board={boardsConfig.moveBoard}
                  collapsed={boardStates[boardsConfig.moveBoard.id]}
                  onToggle={() => toggleBoard(boardsConfig.moveBoard.id)}
                />
              </div>
            </>
          )}
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
  // Check if this is one of the boards that should be separated
  const isSeparatedBoard = board.id === 'board-parent' || board.id === 'board-child-checklist' || board.id === 'board-move';
  
  return (
    <div className={`${isSeparatedBoard ? 'mb-6 border-b-2 border-border/50' : 'border-b border-border'}`}>
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
        <div className="flex">
          {board.lanes.map((lane) =>
            lane.columns.map((col) => (
              <ColumnView key={col.id} column={col} boardId={board.id} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const ColumnView: React.FC<{ column: KaitenColumn; boardId: string }> = ({ column, boardId }) => {
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
      <div className="flex-1 p-1.5 overflow-y-auto group/cards">
        {column.cards.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
        {column.cards.length === 0 && (
          <div className="flex items-center justify-center min-h-[50px] border border-dashed border-border rounded text-[11px] text-muted-foreground p-3">
            Нет карточек
          </div>
        )}
        {/* Quick add button - only visible on hover in area below cards */}
        <div className="px-1.5 py-2 mt-1 opacity-0 group-hover/cards:opacity-100 transition-opacity pointer-events-none group-hover/cards:pointer-events-auto">
          <button className="w-full rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground font-medium hover:brightness-110 transition-all flex items-center justify-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Сформулировать задачу
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
