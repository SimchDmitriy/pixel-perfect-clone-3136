import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, ChevronsLeft, ChevronsRight,
  Search, Plus, Star, FolderOpen, FolderClosed, Globe, Users,
  LayoutDashboard, Settings, MoreVertical, Workflow, Zap, FileText, Filter as FunnelIcon
} from 'lucide-react';
import { mockSpaces, adminMenuItems } from '@/data/mockData';
import type { SidebarSpace } from '@/data/mockData';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const SpaceIcon: React.FC<{ icon: string; color: string; size?: number }> = ({ icon, color, size = 14 }) => {
  const icons: Record<string, React.ReactNode> = {
    folder: <FolderClosed size={size} />,
    board: <LayoutDashboard size={size} />,
    globe: <Globe size={size} />,
    community: <Users size={size} />,
    workflow: <Workflow size={size} />,
    automation: <Zap size={size} />,
    doc: <FileText size={size} />,
    funnel: <FunnelIcon size={size} />,
  };
  return <span style={{ color }}>{icons[icon] || <FolderClosed size={size} />}</span>;
};

const SidebarItem: React.FC<{
  space: SidebarSpace;
  depth: number;
  selectedId: string;
  onSelect: (id: string) => void;
}> = ({ space, depth, selectedId, onSelect }) => {
  const [expanded, setExpanded] = useState(space.expanded ?? false);
  const [hovered, setHovered] = useState(false);
  const hasChildren = space.children && space.children.length > 0;
  const isSelected = selectedId === space.id;

  return (
    <div>
      <div
        className={`relative flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-[13px] transition-colors cursor-pointer ${
          isSelected
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect(space.id);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <SpaceIcon icon={space.icon} color={space.color} />
        <span className="truncate flex-1">{space.name}</span>

        {/* Hover actions for selected/hovered items */}
        {(hovered || isSelected) && (
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={e => { e.stopPropagation(); }}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-sidebar-accent"
            >
              <Plus className="h-3 w-3" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); }}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-sidebar-accent"
            >
              <Settings className="h-3 w-3" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); }}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-sidebar-accent"
            >
              <MoreVertical className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      {hasChildren && expanded && (
        <div>
          {space.children!.map((child) => (
            <SidebarItem
              key={child.id}
              space={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSpace, setSelectedSpace] = useState('parent-child');
  const [adminExpanded, setAdminExpanded] = useState(true);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');

  if (collapsed) {
    return (
      <div className="flex w-10 flex-col items-center border-r border-sidebar-border bg-sidebar py-2 shrink-0">
        <button
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-[220px] flex-col border-r border-sidebar-border bg-sidebar shrink-0">
      {/* Top: Logo + collapse */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-sidebar-border">
        <span className="text-foreground font-medium text-sm">Меню</span>
        <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-md bg-secondary px-2 py-1">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={sidebarSearchQuery}
            onChange={e => setSidebarSearchQuery(e.target.value)}
            placeholder="Найти..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="text-muted-foreground hover:text-foreground">
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation tree */}
      <div className="flex-1 overflow-y-auto px-1">
        {/* Quick links */}
        <div className="mb-1">
          <button
            onClick={() => { setSelectedSpace('personal'); navigate('/'); }}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-1 text-[13px] transition-colors ${
              selectedSpace === 'personal' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Личное</span>
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-md px-3 py-1 text-[13px] text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <Star className="h-3.5 w-3.5" />
            <span>Избранное (1)</span>
          </button>
        </div>

        {/* Spaces tree */}
        <div className="mb-2">
          {mockSpaces.filter(s => s.id !== 'personal' && s.id !== 'favorites').map((space) => (
            <SidebarItem
              key={space.id}
              space={space}
              depth={0}
              selectedId={selectedSpace}
              onSelect={(id) => {
                setSelectedSpace(id);
                if (id === 'parent-child') navigate('/');
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border">
        <button className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-sidebar-foreground hover:bg-sidebar-accent/50">
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>Шаблоны пространств</span>
        </button>

        {/* Administration */}
        <div>
          <button
            onClick={() => setAdminExpanded(!adminExpanded)}
            className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <Settings className="h-3.5 w-3.5" />
            {adminExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <span>Администрирование</span>
          </button>
          {adminExpanded && (
            <div className="max-h-[200px] overflow-y-auto pb-2">
              {adminMenuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Пользователи') navigate('/admin/users');
                    else if (item === 'Роли пользователей') navigate('/admin/roles');
                    else navigate('/admin/users');
                  }}
                  className={`flex w-full items-center px-6 py-1 text-[12px] transition-colors ${
                    (item === 'Пользователи' && location.pathname === '/admin/users') ||
                    (item === 'Роли пользователей' && location.pathname === '/admin/roles')
                      ? 'text-primary bg-sidebar-accent'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
