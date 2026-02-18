import React from 'react';
import { Search, HelpCircle, Bell } from 'lucide-react';

interface AppHeaderProps {
  onSearchOpen: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onSearchOpen }) => {
  return (
    <header className="flex h-11 items-center justify-between border-b border-border bg-header-bg px-4 shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-[10px] font-bold">K</span>
          </div>
          <span className="text-foreground font-semibold text-sm">Kaiten</span>
        </div>
      </div>

      {/* Center: Search bar */}
      <button
        onClick={onSearchOpen}
        className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-muted-foreground hover:bg-card-hover transition-colors w-[280px] md:w-[400px]"
      >
        <span className="text-sm">Найти</span>
        <Search className="ml-auto h-4 w-4" />
      </button>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground font-bold">
            32
          </span>
        </button>
        <div className="h-7 w-7 rounded-full bg-card-surface border border-border overflow-hidden flex items-center justify-center">
          <span className="text-xs text-foreground">АИ</span>
        </div>
      </div>
    </header>
  );
};
