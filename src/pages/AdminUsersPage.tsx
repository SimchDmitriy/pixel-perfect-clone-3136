import React, { useState } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { mockRoles } from '@/data/mockData';
import { useUser, type UserRole } from '@/context/UserContext';

type AdminTab = 'users' | 'days' | 'roles' | 'groups' | 'access' | 'invites' | 'sessions';

const tabs: { key: AdminTab; label: string; icon: string }[] = [
  { key: 'users', label: 'ПОЛЬЗОВАТЕЛИ', icon: '👥' },
  { key: 'days', label: 'НЕРАБОЧИЕ ДНИ', icon: '📅' },
  { key: 'roles', label: 'РОЛИ', icon: '✅' },
  { key: 'groups', label: 'ГРУППЫ', icon: '🌐' },
  { key: 'access', label: 'ЗАПРОСЫ НА ДОСТУП', icon: '👥' },
  { key: 'invites', label: 'ПРИГЛАШЕНИЯ', icon: '📧' },
  { key: 'sessions', label: 'СЕССИИ', icon: '💻' },
];

const AdminUsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRoleUserId, setEditingRoleUserId] = useState<string | null>(null);
  const { allUsers, updateUserRole } = useUser();

  const filteredUsers = allUsers.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleOptions: UserRole[] = ['Администратор', 'Редактор', 'Комментатор'];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border bg-header-bg shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center gap-1 px-6 py-3 text-[11px] font-medium tracking-wide transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'users' && (
          <div>
            {/* Owner section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-foreground font-medium text-sm">Владелец</h3>
                <button className="text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1">
                  ИЗМЕНИТЬ
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left text-xs font-medium text-foreground">Полное имя</th>
                    <th className="py-2 text-left text-xs font-medium text-foreground">Имя пользователя</th>
                    <th className="py-2 text-left text-xs font-medium text-foreground">Эл. почта</th>
                    <th className="py-2 text-left text-xs font-medium text-foreground">Последняя активность</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 text-sm text-foreground" colSpan={4}>
                      <span className="text-muted-foreground text-xs italic">Данные скрыты</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* All users */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-foreground font-medium text-sm">Всего: {allUsers.length}</h3>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1">
                  <Search className="h-3 w-3" />
                  ОТКРЫТЬ ФИЛЬТРЫ
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left text-xs font-medium text-foreground">Полное имя</th>
                    <th className="py-2 text-left text-xs font-medium text-foreground">Имя пользователя</th>
                    <th className="py-2 text-left text-xs font-medium text-foreground">Эл. почта</th>
                    <th className="py-2 text-left text-xs font-medium text-foreground">Последняя активность</th>
                    <th className="py-2 text-left text-xs font-medium text-foreground">Роль</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer">
                      <td className="py-2.5 text-sm text-foreground">{user.fullName}</td>
                      <td className="py-2.5 text-sm text-muted-foreground">{user.username}</td>
                      <td className="py-2.5 text-sm text-muted-foreground">{user.email}</td>
                      <td className="py-2.5 text-sm text-muted-foreground">{user.lastActive}</td>
                      <td className="py-2.5 text-sm relative">
                        <button
                          onClick={() => setEditingRoleUserId(editingRoleUserId === user.id ? null : user.id)}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          {user.role}
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        {editingRoleUserId === user.id && (
                          <div className="absolute right-0 top-full mt-1 w-[180px] bg-popover border border-border rounded-lg shadow-xl z-50">
                            {roleOptions.map(role => (
                              <button
                                key={role}
                                onClick={() => { updateUserRole(user.id, role); setEditingRoleUserId(null); }}
                                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-card-hover transition-colors ${
                                  user.role === role ? 'text-primary' : 'text-foreground'
                                }`}
                              >
                                {role} {user.role === role && '✓'}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 rounded bg-secondary px-3 py-1.5 w-[300px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Найти..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              <button
                onClick={() => setRoleModalOpen(true)}
                className="flex items-center gap-1 rounded border border-primary text-primary px-3 py-1.5 text-xs font-medium hover:bg-primary/10 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                СОЗДАТЬ РОЛЬ
              </button>
            </div>

            <div>
              <h3 className="text-foreground font-medium text-sm mb-3">Стандартные</h3>
              {mockRoles.slice(1, 6).map((role) => (
                <button
                  key={role}
                  className="block w-full text-left py-2.5 px-2 text-sm text-foreground hover:bg-secondary/50 border-b border-border/30 transition-colors"
                >
                  {role}
                </button>
              ))}
              <h3 className="text-foreground font-medium text-sm mt-6 mb-3">Пользовательские</h3>
              <div className="flex h-32 items-center justify-center rounded bg-secondary/30 border border-dashed border-border text-sm text-muted-foreground">
                Нет пользовательских ролей
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'users' && activeTab !== 'roles' && (
          <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
            Раздел «{tabs.find((t) => t.key === activeTab)?.label}» — в разработке
          </div>
        )}
      </div>

      {/* Create role modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setRoleModalOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 w-[560px] max-h-[80vh] rounded-lg bg-popover border border-border shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-foreground font-medium text-lg mb-4">Создать роль</h2>
              <div className="mb-4">
                <label className="text-xs text-muted-foreground">Название *</label>
                <input
                  placeholder="Введите название"
                  className="mt-1 w-full rounded bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary transition-colors"
                />
              </div>
              <div className="rounded bg-secondary/50 border border-border p-3 mb-4 text-xs text-muted-foreground">
                ℹ️ Новая роль будет недоступна к использованию напрямую из сущностей. Для изменения доступа к роли внесите изменения в Настройки ролей в разделе Администрирование/Настройки компании.
              </div>

              {/* Permissions */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                <h3 className="text-sm text-foreground font-medium">Корень меню</h3>
                {['Создание в корне меню', 'Перемещение в корне меню', 'Импорт в корне меню'].map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="checkbox" className="accent-primary" />
                    {p}
                  </label>
                ))}
                <h3 className="text-sm text-foreground font-medium mt-3">Разделы</h3>
                {['Создание', 'Чтение', 'Редактирование', 'Перемещение внутри иерархии', 'Перемещение за пределы иерархии', 'Удаление', 'Управление доступом'].map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="checkbox" className="accent-primary" />
                    {p}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-6 py-3">
              <button
                onClick={() => setRoleModalOpen(false)}
                className="rounded px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                ОТМЕНА
              </button>
              <button className="rounded px-4 py-2 text-sm text-muted-foreground">
                СОЗДАТЬ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
