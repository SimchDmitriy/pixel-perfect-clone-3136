import React, { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { filterOptions } from '@/data/mockData';

interface FilterPanelProps {
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  const filtered = filterOptions.filter((f) =>
    f.label.toLowerCase().includes(query.toLowerCase())
  );

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
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
      ref={panelRef}
      className="absolute right-0 top-full mt-1 z-50 w-[280px] max-h-[500px] bg-popover border border-border rounded-md shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-foreground font-medium text-sm">Добавить фильтр</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2 rounded bg-secondary px-2 py-1">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            autoFocus
          />
        </div>
      </div>

      {/* Saved filters */}
      <div className="px-3 py-2 border-b border-border shrink-0">
        <div className="text-[11px] text-muted-foreground mb-1">Мои наборы фильтров</div>
        <button className="w-full text-left py-0.5 text-sm text-foreground hover:text-primary transition-colors">
          один участник публичный
        </button>
        <button className="w-full text-left py-0.5 text-sm text-foreground hover:text-primary transition-colors">
          один участник
        </button>
      </div>

      {/* Filter list */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="text-[11px] text-muted-foreground mb-1">Фильтры</div>
        {filtered.map((f, i) => (
          <button
            key={i}
            className="flex w-full items-center gap-2.5 rounded px-2 py-1 text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <span className="w-4 text-center text-muted-foreground text-xs">{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
