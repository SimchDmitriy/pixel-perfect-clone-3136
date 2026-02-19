import React, { useState } from 'react';
import { X, Users, Clock, History, FileText, Settings, Ban, Globe, Share2, Bot } from 'lucide-react';
import { rightSidebarIcons } from '@/data/mockData';
import { useUser } from '@/context/UserContext';

type PanelId = string | null;

export const RightPanel: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelId>(null);
  const { allUsers, spaceUsers, addSpaceUser, removeSpaceUser } = useUser();
  const [userSearch, setUserSearch] = useState('');

  const iconComponents: Record<string, React.ReactNode> = {
    users: <Users className="h-4 w-4" />,
    time: <Clock className="h-4 w-4" />,
    history: <History className="h-4 w-4" />,
    docs: <FileText className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />,
    block: <Ban className="h-4 w-4" />,
    globe: <Globe className="h-4 w-4" />,
    share: <Share2 className="h-4 w-4" />,
    automation: <Bot className="h-4 w-4" />,
  };

  const spaceUserIds = new Set(spaceUsers.map(u => u.id));
  const filteredAllUsers = allUsers.filter(u =>
    !spaceUserIds.has(u.id) &&
    (u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
     u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <>
      {/* Slide-out panel */}
      {activePanel && (
        <div className="w-[300px] border-l border-border bg-popover flex flex-col shrink-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-foreground font-medium text-sm capitalize">
              {rightSidebarIcons.find(i => i.id === activePanel)?.label || activePanel}
            </span>
            <button onClick={() => setActivePanel(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {activePanel === 'users' && (
              <div>
                <input
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Введите имя, id или email"
                  className="w-full rounded bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary mb-3"
                />

                {/* Search results - users not yet added */}
                {userSearch && filteredAllUsers.length > 0 && (
                  <div className="mb-3 border border-border rounded-md bg-secondary/50">
                    {filteredAllUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => { addSpaceUser(user.id); setUserSearch(''); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-card-hover transition-colors"
                      >
                        <div className="h-5 w-5 rounded-full bg-card-surface border border-border flex items-center justify-center shrink-0">
                          <span className="text-[9px]">{user.fullName.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                        </div>
                        <div className="text-left">
                          <div>{user.fullName}</div>
                          <div className="text-[10px] text-muted-foreground">{user.email}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Added space users */}
                <p className="text-xs text-muted-foreground mb-2">Участники пространства</p>
                {spaceUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between py-1.5 group">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-card-surface border border-border flex items-center justify-center shrink-0">
                        <span className="text-[9px] text-foreground">{user.fullName.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                      </div>
                      <div>
                        <div className="text-xs text-foreground">{user.fullName}</div>
                        <div className="text-[10px] text-muted-foreground">{user.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSpaceUser(user.id)}
                      className="text-[10px] text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <p className="text-xs text-muted-foreground mt-4">Деактивированные пользователи</p>
                <button className="mt-2 text-xs text-primary hover:text-primary/80">ЗАГРУЗИТЬ СПИСОК</button>
              </div>
            )}
            {activePanel === 'share' && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Внутренняя ссылка на пространство</p>
                <div className="flex items-center gap-2 rounded bg-secondary px-3 py-2 text-sm text-foreground">
                  <span className="truncate">https://demo4presale.kaiten.ru/s</span>
                  <button className="text-muted-foreground hover:text-foreground shrink-0">📋</button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-foreground">Публичный доступ</span>
                  <button className="w-10 h-5 rounded-full bg-secondary relative">
                    <span className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-muted-foreground transition-transform" />
                  </button>
                </div>
              </div>
            )}
            {activePanel === 'settings' && (
              <div className="text-xs text-muted-foreground">
                Настройки пространства
              </div>
            )}
            {activePanel !== 'users' && activePanel !== 'share' && activePanel !== 'settings' && (
              <div className="text-xs text-muted-foreground">
                Содержимое панели «{rightSidebarIcons.find(i => i.id === activePanel)?.label}»
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vertical icon strip */}
      <div className="w-10 border-l border-border bg-card flex flex-col items-center py-3 gap-2 shrink-0">
        {rightSidebarIcons.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePanel(activePanel === item.id ? null : item.id)}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              activePanel === item.id
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
            title={item.label}
          >
            {iconComponents[item.id] || <span className="text-sm">{item.emoji}</span>}
          </button>
        ))}
      </div>
    </>
  );
};
