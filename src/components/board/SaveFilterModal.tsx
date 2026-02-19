import React, { useState, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import { mockSpaces, type FilterChip } from '@/data/mockData';
import type { SidebarSpace } from '@/data/mockData';

interface SaveFilterModalProps {
  chips: FilterChip[];
  onClose: () => void;
  onSave: (name: string, isPublic: boolean, spaces: string[]) => void;
}

export const SaveFilterModal: React.FC<SaveFilterModalProps> = ({ chips, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(true); // Active by default
  // No preselected spaces (user requested this can be removed)
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [spaceSearch, setSpaceSearch] = useState('');

  // Flatten spaces tree
  const flattenSpaces = (spaces: SidebarSpace[], level = 0): Array<SidebarSpace & { level: number }> => {
    const result: Array<SidebarSpace & { level: number }> = [];
    spaces.forEach((space) => {
      result.push({ ...space, level });
      if (space.children) {
        result.push(...flattenSpaces(space.children, level + 1));
      }
    });
    return result;
  };

  // Expose spaces hierarchy for public filters.
  // Exclude "personal" and "favorites" from the tree like in the prototype.
  const EXCLUDED_SPACE_IDS = new Set(['personal', 'favorites', 'folder-1', 'folder-2']);

  const pruneExcluded = (spaces: SidebarSpace[]): SidebarSpace[] => {
    return spaces
      .filter((s) => !EXCLUDED_SPACE_IDS.has(s.id))
      .map((s) => ({
        ...s,
        children: s.children ? pruneExcluded(s.children) : undefined,
      }));
  };

  const hierarchyRoots = pruneExcluded(mockSpaces);
  const allSpaces = flattenSpaces(hierarchyRoots);
  // Add root space option
  const spacesWithRoot = [
    { id: 'root', name: 'Вся организация', level: 0, icon: 'folder' as const, color: '' },
    ...allSpaces,
  ];
  const filteredSpaces = spaceSearch
    ? spacesWithRoot.filter((s) => s.name.toLowerCase().includes(spaceSearch.toLowerCase()))
    : spacesWithRoot;

  const visibleSpaceIds = new Set(allSpaces.map((s) => s.id));

  // Get descendants of a space
  const getDescendants = (spaceId: string): string[] => {
    if (spaceId === 'root') {
      // Root includes all spaces
      return allSpaces.map((s) => s.id);
    }
    const result: string[] = [];
    const findSpace = (spaces: SidebarSpace[], targetId: string): SidebarSpace | null => {
      for (const space of spaces) {
        if (space.id === targetId) return space;
        if (space.children) {
          const found = findSpace(space.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const space = findSpace(hierarchyRoots, spaceId);
    if (space?.children) {
      const flatten = flattenSpaces(space.children);
      flatten.forEach((s) => {
        result.push(s.id);
        if (s.children) {
          const subFlatten = flattenSpaces(s.children);
          subFlatten.forEach((sub) => result.push(sub.id));
        }
      });
    }
    // Safety: keep only ids that exist in current visible hierarchy
    return result.filter((id) => visibleSpaceIds.has(id));
  };

  // Toggle space selection with cascade
  const toggleSpace = (spaceId: string) => {
    if (selectedSpaces.includes(spaceId)) {
      // Deselect space and its descendants
      const descendants = getDescendants(spaceId);
      setSelectedSpaces((prev) => prev.filter((id) => id !== spaceId && !descendants.includes(id)));
    } else {
      // Select space and its descendants (cascade down)
      const descendants = getDescendants(spaceId);
      setSelectedSpaces((prev) => {
        const newSet = new Set([...prev, spaceId, ...descendants]);
        return Array.from(newSet);
      });
    }
  };

  // Check if space is partially selected (has selected children)
  const isPartiallySelected = (spaceId: string): boolean => {
    const descendants = getDescendants(spaceId);
    const hasSelectedChild = descendants.some((id) => selectedSpaces.includes(id));
    return hasSelectedChild && !selectedSpaces.includes(spaceId);
  };

  // Deselect space cascade
  const deselectCascade = (spaceId: string) => {
    const descendants = getDescendants(spaceId);
    setSelectedSpaces((prev) => prev.filter((id) => id !== spaceId && !descendants.includes(id)));
  };

  // Get spaces label
  const getSpacesLabel = (): string => {
    if (selectedSpaces.includes('root')) return 'Вся орг.';
    if (selectedSpaces.length === 1) {
      const space = allSpaces.find((s) => s.id === selectedSpaces[0]);
      return space?.name || '1 простр.';
    }
    return `${selectedSpaces.length} простр.`;
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (isPublic && selectedSpaces.length === 0) {
      // Show error toast in real app
      return;
    }
    onSave(name.trim(), isPublic, isPublic ? selectedSpaces : []);
  };

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
      className="fixed inset-0 bg-black/55 z-[300] flex items-center justify-center"
      data-save-filter-modal
      onClick={onClose}
    >
      <div
        className="bg-popover border border-border rounded-xl w-[480px] max-h-[80vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">Сохранить набор фильтров</h2>
        </div>

        {/* Body */}
        <div className="px-5 py-5 overflow-y-auto flex-1">
          {/* Name input */}
          <div className="mb-3">
            <label className="text-[11px] text-muted-foreground block mb-1">Название</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название"
              className="w-full px-2.5 py-2 rounded-md bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>

          {/* Public toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary mb-3">
            <span className="text-xs text-foreground">
              🌐 Публичный <span className="text-[10px] text-muted-foreground">(виден другим)</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsPublic((p) => !p);
              }}
              className={`relative w-[38px] h-5 rounded-full transition-colors ${
                isPublic ? 'bg-blue-500' : 'bg-border'
              }`}
            >
              <div
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                  isPublic ? 'left-[18px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Space picker (only if public) */}
          {isPublic && (
            <div className="mb-3">
              <label className="text-[11px] text-muted-foreground block mb-1.5">
                Где доступен фильтр
              </label>
              <div className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5 mb-1.5 border border-border">
                <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                <input
                  value={spaceSearch}
                  onChange={(e) => setSpaceSearch(e.target.value)}
                  placeholder="Поиск пространств..."
                  className="flex-1 bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              <div className="max-h-[180px] overflow-y-auto rounded-lg border border-border bg-secondary">
                {filteredSpaces.map((space) => {
                  const isSelected = selectedSpaces.includes(space.id);
                  const isPartial = isPartiallySelected(space.id);
                  return (
                    <div
                      key={space.id}
                      onClick={() => toggleSpace(space.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer text-[11px] transition-colors hover:bg-card-hover ${
                        space.level === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'
                      }`}
                      style={{ paddingLeft: `${10 + space.level * 16}px` }}
                    >
                      <div
                        className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : isPartial
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'border-border'
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                        {isPartial && <span className="text-[9px]">—</span>}
                      </div>
                      <span>{space.name}</span>
                    </div>
                  );
                })}
              </div>
              {/* Selected chips */}
              {selectedSpaces.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {selectedSpaces.map((id) => {
                    const space = id === 'root' 
                      ? { id: 'root', name: 'Вся организация' }
                      : spacesWithRoot.find((s) => s.id === id);
                    if (!space) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px]"
                      >
                        <span>{space.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deselectCascade(id);
                          }}
                          className="opacity-70 hover:opacity-100 text-[9px] leading-none"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-2.5 border-t border-border shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            ОТМЕНА
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-md text-[11px] font-medium bg-primary text-primary-foreground hover:brightness-110 transition-all"
          >
            СОХРАНИТЬ
          </button>
        </div>
      </div>
    </div>
  );
};
