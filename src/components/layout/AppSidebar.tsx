import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, ChevronsLeft, ChevronsRight,
  Search, Plus, Star, FolderClosed, Globe, Users,
  LayoutDashboard, Settings, MoreVertical, Workflow, Zap, FileText, Filter as FunnelIcon
} from 'lucide-react';
import { mockSpaces, adminMenuItems } from '@/data/mockData';
import type { SidebarSpace } from '@/data/mockData';
import { useUser } from '@/context/UserContext';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const SpaceIcon: React.FC<{ icon: string; color: string; size?: number }> = ({ icon, color, size = 13 }) => {
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
  return <span className="shrink-0 inline-flex items-center" style={{ color }}>{icons[icon] || <FolderClosed size={size} />}</span>;
};

const SidebarItem: React.FC<{
  space: SidebarSpace;
  depth: number;
  selectedId: string;
  onSelect: (id: string) => void;
  expandedMap: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
}> = ({ space, depth, selectedId, onSelect, expandedMap, onToggleExpand }) => {
  const [hovered, setHovered] = useState(false);
  const hasChildren = space.children && space.children.length > 0;
  const isSelected = selectedId === space.id;
  const isExpanded = expandedMap[space.id] ?? false;

  return (
    <div>
      <div
        className={`relative flex w-full items-center gap-1 rounded px-2 py-[3px] text-left text-[12px] transition-colors cursor-pointer ${
          isSelected
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
        }`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={() => {
          onSelect(space.id);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Chevron for expandable items */}
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleExpand(space.id); }}
            className="w-[14px] shrink-0 inline-flex items-center justify-center text-muted-foreground"
          >
            {isExpanded
              ? <ChevronDown className="h-3 w-3" />
              : <ChevronRight className="h-3 w-3" />
            }
          </button>
        ) : (
          <span className="w-[14px] shrink-0" />
        )}
        <SpaceIcon icon={space.icon} color={space.color} />
        <span className="truncate flex-1">{space.name}</span>

        {/* Hover action buttons */}
        {hovered && (
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
      {/* Children - only rendered when expanded */}
      {hasChildren && isExpanded && (
        <div>
          {space.children!.map((child) => (
            <SidebarItem
              key={child.id}
              space={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedMap={expandedMap}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Build initial expanded state from mockSpaces
function buildInitialExpanded(spaces: SidebarSpace[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  function walk(items: SidebarSpace[]) {
    items.forEach(s => {
      if (s.expanded) map[s.id] = true;
      if (s.children) walk(s.children);
    });
  }
  walk(spaces);
  return map;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { visibleSpaceIds } = useUser();
  const [selectedSpace, setSelectedSpace] = useState('parent-child');
  const [adminExpanded, setAdminExpanded] = useState(true);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(() => buildInitialExpanded(mockSpaces));

  // Filter spaces by user visibility (empty array = see everything)
  const hasVisibilityLimit = visibleSpaceIds.length > 0;
  const visibleSet = new Set(visibleSpaceIds);

  const pruneSpaces = (spaces: SidebarSpace[]): SidebarSpace[] => {
    if (!hasVisibilityLimit) return spaces;
    const result: SidebarSpace[] = [];
    for (const s of spaces) {
      if (visibleSet.has(s.id)) {
        result.push(s);
      } else if (s.children) {
        const pruned = pruneSpaces(s.children);
        if (pruned.length > 0) {
          result.push({ ...s, children: pruned });
        }
      }
    }
    return result;
  };

  const filteredSpaces = pruneSpaces(mockSpaces);

  const toggleExpand = (id: string) => {
    setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
      {/* Top: Menu + collapse */}
      <div className="flex items-center justify-between px-3 py-[7px] border-b border-sidebar-border shrink-0">
        <span className="text-foreground font-medium text-[13px]">Меню</span>
        <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-1.5 mx-2.5 my-1.5 bg-secondary rounded px-2 py-1 shrink-0">
        <Search className="h-3 w-3 text-muted-foreground" />
        <input
          value={sidebarSearchQuery}
          onChange={e => setSidebarSearchQuery(e.target.value)}
          placeholder="Найти..."
          className="flex-1 bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button className="text-muted-foreground hover:text-foreground text-sm">+</button>
      </div>

      {/* Navigation tree */}
      <div className="flex-1 overflow-y-auto px-1">
        {/* Quick links */}
        <div className="mb-0.5">
          <button
            onClick={() => { setSelectedSpace('personal'); navigate('/space/personal'); }}
            className={`flex w-full items-center gap-1.5 rounded px-2 py-[3px] text-[12px] transition-colors ${
              selectedSpace === 'personal' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <span className="w-[14px] shrink-0" />
            <LayoutDashboard className="h-3 w-3 shrink-0" />
            <span>Личное</span>
          </button>
          <button
            className="flex w-full items-center gap-1.5 rounded px-2 py-[3px] text-[12px] text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <span className="w-[14px] shrink-0" />
            <Star className="h-3 w-3 shrink-0" style={{ color: 'hsl(45 93% 47%)' }} />
            <span>Избранное (1)</span>
          </button>
        </div>

        {/* Spaces tree */}
        <div className="mb-2">
          {filteredSpaces.filter(s => s.id !== 'personal' && s.id !== 'favorites').map((space) => (
            <SidebarItem
              key={space.id}
              space={space}
              depth={0}
              selectedId={selectedSpace}
              onSelect={(id) => {
                setSelectedSpace(id);
                if (id === 'parent-child') navigate('/space/parent-child');
                if (id === 'work-search') navigate('/space/work-search');
              }}
              expandedMap={expandedMap}
              onToggleExpand={toggleExpand}
            />
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border shrink-0">
        <button className="flex w-full items-center gap-1.5 px-3 py-1.5 text-[12px] text-sidebar-foreground hover:bg-sidebar-accent/50">
          <span className="text-[13px]">📁</span>
          <span>Шаблоны пространств</span>
        </button>

        {/* Administration */}
        <div>
          <button
            onClick={() => setAdminExpanded(!adminExpanded)}
            className="flex w-full items-center gap-1.5 px-3 py-1.5 text-[12px] text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <span className="text-[13px]">⚙️</span>
            {adminExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <span>Администрирование</span>
          </button>
          {adminExpanded && (
            <div className="max-h-[200px] overflow-y-auto pb-1">
              {adminMenuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Пользователи') navigate('/admin/users');
                    else if (item === 'Роли пользователей') navigate('/admin/roles');
                    else navigate('/admin/users');
                  }}
                  className={`block w-full text-left px-3 py-[3px] pl-7 text-[11px] whitespace-nowrap transition-colors ${
                    (item === 'Пользователи' && location.pathname === '/admin/users') ||
                    (item === 'Роли пользователей' && location.pathname === '/admin/roles')
                      ? 'text-primary bg-primary/[0.08]'
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
