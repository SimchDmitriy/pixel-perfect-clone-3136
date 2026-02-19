import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Lock, Globe } from 'lucide-react';
import { filterOptions, mockMyFilters, mockPublicFilters, mockSpaces, type FilterChip, type SavedFilter, type SidebarSpace } from '@/data/mockData';
import { SaveFilterModal } from './SaveFilterModal';
import { FilterContextMenu } from './FilterContextMenu';

interface FilterPanelProps {
  onClose: () => void;
  currentSpace?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose, currentSpace = 'parent-child' }) => {
  const [query, setQuery] = useState('');
  const [chips, setChips] = useState<FilterChip[]>([]);
  const [activeTab, setActiveTab] = useState<'my' | 'pub'>('my');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; filter: SavedFilter; isPublic: boolean } | null>(null);
  const [myFilters, setMyFilters] = useState<SavedFilter[]>(mockMyFilters);
  const [publicFilters, setPublicFilters] = useState<SavedFilter[]>(mockPublicFilters);
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter options based on search
  const filteredOptions = filterOptions.filter((f) =>
    f.label.toLowerCase().includes(query.toLowerCase())
  );

  // Get ancestors of a space
  const getAncestors = (spaceId: string, spaces: SidebarSpace[] = mockSpaces, path: string[] = []): string[] => {
    for (const space of spaces) {
      const currentPath = [...path, space.id];
      if (space.id === spaceId) {
        return path; // Return ancestors (path without current)
      }
      if (space.children) {
        const found = getAncestors(spaceId, space.children, currentPath);
        if (found.length >= 0) return found;
      }
    }
    return [];
  };

  // Check if filter is visible in current space
  const isFilterVisible = (filter: SavedFilter): boolean => {
    if (!filter.spaces || !filter.spaces.length) return false;
    if (filter.spaces.includes('root')) return true;
    if (filter.spaces.includes(currentSpace)) return true;
    // Check if any ancestor is in filter spaces
    const ancestors = getAncestors(currentSpace);
    return filter.spaces.some((spaceId) => ancestors.includes(spaceId));
  };

  // Filter saved filters based on visibility
  const visiblePublicFilters = publicFilters.filter(isFilterVisible);

  // Get spaces label
  const getSpacesLabel = (spaces?: string[]): string => {
    if (!spaces || !spaces.length) return '';
    if (spaces.includes('root')) return 'Вся орг.';
    if (spaces.length === 1) {
      // In real app, would look up space name
      return '1 простр.';
    }
    return `${spaces.length} простр.`;
  };

  // Add filter chip
  const addChip = (name: string, icon: string) => {
    if (chips.find((c) => c.name === name)) return;
    setChips([...chips, { name, icon }]);
  };

  // Remove filter chip
  const removeChip = (name: string) => {
    setChips(chips.filter((c) => c.name !== name));
  };

  // Clear all chips
  const clearChips = () => {
    setChips([]);
  };

  // Calculate filtered count (mock)
  const filteredCount = chips.length > 0 ? Math.max(1, Math.floor(145 / (chips.length + 1))) : 0;
  const totalCount = 145;

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // If save modal is open, interactions should not close the filter panel.
      if (showSaveModal) return;

      // Clicks inside the save modal should not close the filter panel
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('[data-save-filter-modal]')) return;

      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        if (!contextMenu) {
          onClose();
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, contextMenu, showSaveModal]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSaveModal) {
          setShowSaveModal(false);
        } else if (contextMenu) {
          setContextMenu(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, contextMenu, showSaveModal]);

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, filter: SavedFilter, isPublic: boolean) => {
    e.stopPropagation();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 100),
      filter,
      isPublic,
    });
  };

  // Handle delete filter
  const handleDeleteFilter = (filterId: string, isPublic: boolean) => {
    if (isPublic) {
      setPublicFilters(publicFilters.filter((f) => f.id !== filterId));
    } else {
      setMyFilters(myFilters.filter((f) => f.id !== filterId));
    }
    setContextMenu(null);
  };

  // Handle edit filter
  const handleEditFilter = (filter: SavedFilter, isPublic: boolean) => {
    // Would open edit modal in real app
    setContextMenu(null);
  };

  return (
    <>
      <div
        ref={panelRef}
        className="absolute right-0 top-full mt-1 z-50 w-[300px] max-h-[calc(100vh-100px)] bg-popover border border-border rounded-[10px] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border shrink-0">
          <span className="text-foreground font-medium text-[13px]">Добавить фильтр</span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-card-hover transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Active filters section */}
        {chips.length > 0 && (
          <div className="px-3.5 py-2.5 bg-white/[0.02] border-b border-border shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
                Применённые
              </span>
              <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[10px]">
                ≡ {filteredCount}/{totalCount}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {chips.map((chip) => (
                <div
                  key={chip.name}
                  className="flex items-center gap-1 bg-card-surface border border-border rounded-xl px-2 py-0.5 text-[11px]"
                >
                  <span>{chip.icon}</span>
                  <span>{chip.name}</span>
                  <button
                    onClick={() => removeChip(chip.name)}
                    className="text-muted-foreground hover:text-destructive text-[9px] p-0 leading-none"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setShowSaveModal(true)}
                className="px-2 py-1 rounded text-[11px] bg-primary text-primary-foreground border border-primary hover:brightness-110 flex items-center gap-1"
              >
                💾 Сохранить
              </button>
              <button
                onClick={clearChips}
                className="px-2 py-1 rounded text-[11px] border border-border bg-transparent text-destructive hover:border-primary hover:text-foreground flex items-center gap-1"
              >
                ✕ Очистить
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-3.5 py-2 shrink-0">
          <div className="flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти..."
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mx-3.5 mb-1.5 rounded-lg overflow-hidden border border-border shrink-0">
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-1.5 text-center text-[11px] transition-colors ${
              activeTab === 'my'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card-surface text-muted-foreground hover:text-foreground'
            }`}
          >
            🔒 Мои
            <span className="text-[9px] bg-white/20 px-1 rounded-md ml-0.5">
              {myFilters.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('pub')}
            className={`flex-1 py-1.5 text-center text-[11px] transition-colors ${
              activeTab === 'pub'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card-surface text-muted-foreground hover:text-foreground'
            }`}
          >
            🌐 Публичные
            <span className="text-[9px] bg-white/20 px-1 rounded-md ml-0.5">
              {visiblePublicFilters.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === 'my' ? (
            <>
              {/* My saved filters */}
              <div className="px-3.5 py-1.5">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider mb-1">
                  Мои наборы
                </div>
                {myFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className={`flex items-center gap-1.5 px-0 py-1 text-xs text-foreground cursor-pointer rounded hover:bg-card-hover group ${
                      filter.highlight ? 'animate-pulse bg-primary/20' : ''
                    }`}
                    onClick={() => addChip('Участник', '👤')}
                  >
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {filter.name}
                    </span>
                    <button
                      onClick={(e) => handleContextMenu(e, filter, false)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-1 rounded text-sm shrink-0"
                    >
                      ⋯
                    </button>
                  </div>
                ))}
              </div>

              {/* Filter options */}
              <div className="px-3.5 py-1.5 border-t border-border">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider mb-1">
                  Фильтры
                </div>
                {filteredOptions.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => addChip(f.label, f.icon)}
                    className="flex w-full items-center gap-2 px-0 py-1 text-xs text-foreground hover:bg-card-hover rounded transition-colors"
                  >
                    <span className="w-5 text-center text-muted-foreground text-xs shrink-0">
                      {f.icon}
                    </span>
                    <span className="text-left">{f.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Public saved filters */}
              <div className="px-3.5 py-1.5">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider mb-1">
                  Публичные фильтры
                </div>
                {visiblePublicFilters.length > 0 ? (
                  visiblePublicFilters.map((filter) => (
                    <div
                      key={filter.id}
                      className={`flex items-center gap-1.5 px-0 py-1 text-xs text-foreground cursor-pointer rounded hover:bg-card-hover group ${
                        filter.highlight ? 'animate-pulse bg-primary/20' : ''
                      }`}
                      onClick={() => addChip('Участник', '👤')}
                    >
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {filter.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {getSpacesLabel(filter.spaces)}
                      </span>
                      <button
                        onClick={(e) => handleContextMenu(e, filter, true)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-1 rounded text-sm shrink-0"
                      >
                        ⋯
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-0 py-2.5 text-[11px] text-muted-foreground">
                    Нет публичных фильтров
                  </div>
                )}
              </div>

              {/* Filter options */}
              <div className="px-3.5 py-1.5 border-t border-border">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider mb-1">
                  Фильтры
                </div>
                {filteredOptions.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => addChip(f.label, f.icon)}
                    className="flex w-full items-center gap-2 px-0 py-1 text-xs text-foreground hover:bg-card-hover rounded transition-colors"
                  >
                    <span className="w-5 text-center text-muted-foreground text-xs shrink-0">
                      {f.icon}
                    </span>
                    <span className="text-left">{f.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Save Filter Modal */}
      {showSaveModal && (
        <SaveFilterModal
          chips={chips}
          onClose={() => setShowSaveModal(false)}
          onSave={(name, isPublic, spaces) => {
            const newFilter: SavedFilter = {
              id: Date.now().toString(),
              name,
              isPublic,
              spaces: isPublic ? spaces : undefined,
              author: 'me',
              highlight: true,
            };
            if (isPublic) {
              setPublicFilters([...publicFilters, newFilter]);
            } else {
              setMyFilters([...myFilters, newFilter]);
            }
            setActiveTab(isPublic ? 'pub' : 'my');
            setShowSaveModal(false);
            setChips([]);
            setTimeout(() => {
              if (isPublic) {
                setPublicFilters((prev) =>
                  prev.map((f) => (f.id === newFilter.id ? { ...f, highlight: false } : f))
                );
              } else {
                setMyFilters((prev) =>
                  prev.map((f) => (f.id === newFilter.id ? { ...f, highlight: false } : f))
                );
              }
            }, 2500);
          }}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <FilterContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          filter={contextMenu.filter}
          isPublic={contextMenu.isPublic}
          onClose={() => setContextMenu(null)}
          onEdit={() => handleEditFilter(contextMenu.filter, contextMenu.isPublic)}
          onDelete={() => handleDeleteFilter(contextMenu.filter.id, contextMenu.isPublic)}
        />
      )}
    </>
  );
};
