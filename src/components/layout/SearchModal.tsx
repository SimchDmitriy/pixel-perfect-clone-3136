import React, { useState } from 'react';
import { X, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'cards' | 'docs'>('cards');
  const [nameOnly, setNameOnly] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative z-10 w-[680px] max-h-[70vh] rounded-lg bg-popover border border-border shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Текст для поиска"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-border px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setTab('cards')}
              className={`py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === 'cards' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              КАРТОЧКИ
            </button>
            <button
              onClick={() => setTab('docs')}
              className={`py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === 'docs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              ДОКУМЕНТЫ
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <div
              className={`relative w-8 h-4 rounded-full transition-colors cursor-pointer ${
                nameOnly ? 'bg-primary' : 'bg-secondary'
              }`}
              onClick={() => setNameOnly(!nameOnly)}
            >
              <div
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-primary-foreground transition-transform ${
                  nameOnly ? 'left-[18px]' : 'left-0.5'
                }`}
              />
            </div>
            Искать только в названии
          </label>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-4 border-b border-border px-4 py-2">
          <div>
            <span className="text-xs text-muted-foreground">В пространстве</span>
            <select className="ml-2 rounded bg-secondary text-foreground text-sm px-2 py-1 border border-border outline-none">
              <option>Во всех</option>
            </select>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Карточки</span>
            <select className="ml-2 rounded bg-secondary text-foreground text-sm px-2 py-1 border border-border outline-none">
              <option>Любые</option>
            </select>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center py-16 text-muted-foreground text-sm">
          {query ? 'Ничего не найдено' : 'Введите текст для поиска'}
        </div>
      </div>
    </div>
  );
};
