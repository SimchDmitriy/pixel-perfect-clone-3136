import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'Администратор' | 'Редактор' | 'Комментатор';

export interface SpaceUser {
  id: string;
  fullName: string;
  role: UserRole;
}

export interface AppUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  lastActive: string;
  role: UserRole;
}

const allUsers: AppUser[] = [
  { id: '1', fullName: 'Иванов Алексей', username: 'a.ivanov', email: 'a.ivanov@company.ru', lastActive: '18.02.2026 14:30', role: 'Администратор' },
  { id: '2', fullName: 'Петрова Мария', username: 'm.petrova', email: 'm.petrova@company.ru', lastActive: '17.02.2026 09:15', role: 'Администратор' },
  { id: '3', fullName: 'Сидоров Дмитрий', username: 'd.sidorov', email: 'd.sidorov@company.ru', lastActive: '16.02.2026 18:45', role: 'Комментатор' },
  { id: '4', fullName: 'Козлова Анна', username: 'a.kozlova', email: 'a.kozlova@company.ru', lastActive: '15.02.2026 12:00', role: 'Редактор' },
  { id: '5', fullName: 'Новиков Сергей', username: 's.novikov', email: 's.novikov@company.ru', lastActive: '14.02.2026 16:20', role: 'Комментатор' },
];

interface UserContextType {
  currentUser: AppUser;
  setCurrentUserId: (id: string) => void;
  allUsers: AppUser[];
  updateUserRole: (userId: string, role: UserRole) => void;
  spaceUsers: SpaceUser[];
  addSpaceUser: (userId: string) => void;
  removeSpaceUser: (userId: string) => void;
  canSavePublicFilter: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AppUser[]>(allUsers);
  const [currentUserId, setCurrentUserId] = useState('1'); // Иванов Алексей by default
  const [spaceUserIds, setSpaceUserIds] = useState<string[]>(['1']); // owner added

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  const spaceUsers: SpaceUser[] = spaceUserIds
    .map(id => {
      const u = users.find(usr => usr.id === id);
      if (!u) return null;
      return { id: u.id, fullName: u.fullName, role: u.role };
    })
    .filter(Boolean) as SpaceUser[];

  const addSpaceUser = (userId: string) => {
    if (!spaceUserIds.includes(userId)) {
      setSpaceUserIds(prev => [...prev, userId]);
    }
  };

  const removeSpaceUser = (userId: string) => {
    setSpaceUserIds(prev => prev.filter(id => id !== userId));
  };

  const canSavePublicFilter = currentUser.role === 'Администратор';

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUserId,
      allUsers: users,
      updateUserRole,
      spaceUsers,
      addSpaceUser,
      removeSpaceUser,
      canSavePublicFilter,
    }}>
      {children}
    </UserContext.Provider>
  );
};
