import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { filterOptions } from '@/data/mockData';

interface FilterPanelProps {
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');

  const filtered = filterOptions.filter((f) =>
    f.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed right-0 top-0 z-40 h-full w-[320px] bg-popover border-l border-border shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-foreground font-medium text-sm">Добавить фильтр</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2 rounded bg-secondary px-2 py-1">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Saved filters */}
      <div className="px-4 py-2 border-b border-border">
        <div className="text-xs text-muted-foreground mb-1">Мои наборы фильтров</div>
        <button className="w-full text-left py-1 text-sm text-foreground hover:text-primary transition-colors">
          один участник публичный
        </button>
        <button className="w-full text-left py-1 text-sm text-foreground hover:text-primary transition-colors">
          один участник
        </button>
      </div>

      {/* Filter list */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="text-xs text-muted-foreground mb-2">Фильтры</div>
        {filtered.map((f, i) => (
          <button
            key={i}
            className="flex w-full items-center gap-3 rounded px-2 py-1.5 text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <span className="w-5 text-center text-muted-foreground">{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
