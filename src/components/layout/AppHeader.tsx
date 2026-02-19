import React, { useState, useRef, useEffect } from 'react';
import { Search, HelpCircle, Bell } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface AppHeaderProps {
  onSearchOpen: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onSearchOpen }) => {
  const { currentUser, allUsers, setCurrentUserId } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showUserMenu]);

  const initials = currentUser.fullName.split(' ').map(w => w[0]).join('').slice(0, 2);

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
        {/* Avatar with role switcher */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="h-7 w-7 rounded-full bg-card-surface border border-border overflow-hidden flex items-center justify-center hover:border-primary transition-colors"
            title={`${currentUser.fullName} — ${currentUser.role}`}
          >
            <span className="text-xs text-foreground font-medium">{initials}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-[240px] bg-popover border border-border rounded-lg shadow-2xl z-[200] overflow-hidden">
              <div className="px-3 py-2 border-b border-border">
                <div className="text-xs text-foreground font-medium">{currentUser.fullName}</div>
                <div className="text-[10px] text-muted-foreground">{currentUser.role}</div>
              </div>
              <div className="py-1">
                <div className="px-3 py-1 text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
                  Переключить пользователя
                </div>
                {allUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => { setCurrentUserId(user.id); setShowUserMenu(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-card-hover transition-colors ${
                      user.id === currentUser.id ? 'bg-secondary text-foreground' : 'text-foreground'
                    }`}
                  >
                    <div className="h-5 w-5 rounded-full bg-card-surface border border-border flex items-center justify-center shrink-0">
                      <span className="text-[9px]">{user.fullName.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs">{user.fullName}</div>
                      <div className="text-[10px] text-muted-foreground">{user.role}</div>
                    </div>
                    {user.id === currentUser.id && <span className="text-primary text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
