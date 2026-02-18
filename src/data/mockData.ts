export interface KaitenCard {
  id: string;
  title: string;
  parentTitle?: string;
  assignee?: string;
  avatarColor: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: { label: string; color: string }[];
  subtasksTotal?: number;
  subtasksDone?: number;
  progressValue?: number;
  progressColor?: string;
  blockerCount?: number;
  colorLine?: string;
}

export interface KaitenColumn {
  id: string;
  title: string;
  cards: KaitenCard[];
  wipLimit?: number;
  wipCurrent?: number;
}

export interface KaitenLane {
  id: string;
  title: string;
  columns: KaitenColumn[];
  collapsed?: boolean;
}

export interface SidebarSpace {
  id: string;
  name: string;
  icon: 'folder' | 'board' | 'globe' | 'community';
  color: string;
  children?: SidebarSpace[];
  expanded?: boolean;
}

export interface AdminUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  lastActive: string;
  access: string;
}

export const mockSpaces: SidebarSpace[] = [
  {
    id: 'personal', name: 'Личное', icon: 'folder', color: 'hsl(240 5% 55%)',
    children: [],
  },
  {
    id: 'all-examples', name: 'Все примеры', icon: 'folder', color: 'hsl(270 60% 55%)',
    expanded: true,
    children: [
      { id: 'demo', name: 'Демо Макеты', icon: 'folder', color: 'hsl(142 71% 45%)' },
      {
        id: 'knowledge', name: 'База Знаний', icon: 'globe', color: 'hsl(210 80% 55%)',
      },
      { id: 'root-menu', name: 'Пример корневого меню', icon: 'folder', color: 'hsl(45 93% 47%)' },
      { id: 'various', name: 'Разное', icon: 'folder', color: 'hsl(322 85% 50%)' },
      { id: 'custom', name: 'Кастомизации', icon: 'folder', color: 'hsl(322 85% 50%)' },
      { id: 'community', name: 'Комьюнити', icon: 'community', color: 'hsl(210 80% 55%)' },
    ],
  },
  {
    id: 'test-scenarios', name: 'Тест сценариев', icon: 'board', color: 'hsl(210 80% 55%)',
    expanded: true,
    children: [
      {
        id: 'parent-child', name: 'родитель дочка', icon: 'board', color: 'hsl(210 80% 55%)',
        children: [
          { id: 'usm', name: 'USM', icon: 'board', color: 'hsl(210 80% 55%)' },
        ],
      },
      {
        id: 'scenarios', name: 'Сценарии', icon: 'board', color: 'hsl(210 80% 55%)',
        children: [
          { id: 'folder-2', name: '2', icon: 'folder', color: 'hsl(240 5% 55%)' },
          { id: 'folder-1', name: '1', icon: 'folder', color: 'hsl(240 5% 55%)' },
        ],
      },
    ],
  },
];

export const mockLanes: KaitenLane[] = [
  {
    id: 'lane-move',
    title: 'Перемещение',
    columns: [
      {
        id: 'queue',
        title: 'Очередь',
        wipLimit: undefined,
        wipCurrent: 3,
        cards: [
          {
            id: 'c1',
            parentTitle: 'Родитель 1',
            title: 'Дочерняя 1',
            assignee: 'Дмитрий Смирнов',
            avatarColor: 'hsl(45 93% 47%)',
            subtasksTotal: 3,
            subtasksDone: 0,
            progressValue: 111,
            colorLine: 'hsl(210 80% 55%)',
          },
          {
            id: 'c2',
            parentTitle: 'Родитель 1',
            title: 'Дочерняя 3',
            avatarColor: 'hsl(45 93% 47%)',
            subtasksTotal: 3,
            subtasksDone: 0,
            progressValue: 111,
            tags: [{ label: '1111', color: 'hsl(0 72% 51%)' }],
            colorLine: 'hsl(322 85% 50%)',
          },
          {
            id: 'c3',
            parentTitle: 'Родитель 1',
            title: 'Дочерняя 2',
            avatarColor: 'hsl(45 93% 47%)',
            subtasksTotal: 3,
            subtasksDone: 0,
            progressValue: 111,
            colorLine: 'hsl(142 71% 45%)',
          },
        ],
      },
      {
        id: 'in-progress',
        title: 'В работе',
        wipLimit: 1,
        wipCurrent: 1,
        cards: [
          {
            id: 'c4',
            parentTitle: 'Родитель 1',
            title: '',
            avatarColor: 'hsl(45 93% 47%)',
            blockerCount: 6,
            subtasksTotal: 3,
            subtasksDone: 1,
            progressValue: 111,
            colorLine: 'hsl(210 80% 55%)',
          },
        ],
      },
      {
        id: 'done',
        title: '✓ Готово',
        wipLimit: undefined,
        wipCurrent: 0,
        cards: [],
      },
    ],
  },
];

export const mockChildCards: KaitenColumn[] = [
  {
    id: 'child-queue',
    title: 'Очередь',
    wipCurrent: 2,
    cards: [
      {
        id: 'cc1',
        parentTitle: 'Родитель 1',
        title: 'дочь чек лист 2',
        avatarColor: 'hsl(240 5% 55%)',
      },
      {
        id: 'cc2',
        parentTitle: 'Родитель 1',
        title: 'дочь чек лист 3',
        avatarColor: 'hsl(240 5% 55%)',
      },
    ],
  },
  {
    id: 'child-work',
    title: 'В работе',
    wipCurrent: 1,
    wipLimit: 1,
    cards: [
      {
        id: 'cc3',
        parentTitle: 'Родитель 1',
        title: 'дочь чек лист 1',
        avatarColor: 'hsl(45 93% 47%)',
      },
    ],
  },
  {
    id: 'child-done',
    title: 'Готово',
    wipCurrent: 0,
    cards: [],
  },
];

export const mockAdminUsers: AdminUser[] = [
  { id: '1', fullName: 'Иванов Алексей', username: 'a.ivanov', email: 'a.ivanov@company.ru', lastActive: '18.02.2026 14:30', access: 'Администратор' },
  { id: '2', fullName: 'Петрова Мария', username: 'm.petrova', email: 'm.petrova@company.ru', lastActive: '17.02.2026 09:15', access: 'Редактор' },
  { id: '3', fullName: 'Сидоров Дмитрий', username: 'd.sidorov', email: 'd.sidorov@company.ru', lastActive: '16.02.2026 18:45', access: 'Комментатор' },
  { id: '4', fullName: 'Козлова Анна', username: 'a.kozlova', email: 'a.kozlova@company.ru', lastActive: '15.02.2026 12:00', access: 'Редактор' },
  { id: '5', fullName: 'Новиков Сергей', username: 's.novikov', email: 's.novikov@company.ru', lastActive: '14.02.2026 16:20', access: 'Комментатор' },
];

export const mockRoles = [
  'Стандартные',
  'Администратор',
  'Редактор',
  'Комментатор',
  'Редактор в корне меню',
  'Пользователь для публичных сущностей',
  'Пользовательские',
];

export const adminMenuItems = [
  'Учёт времени',
  'Служба поддержки',
  'Типы карточек',
  'Виды карточек',
  'Метки',
  'Оплата',
  'Дерево сущностей',
  'Настройки компании',
  'Пользователи',
  'Роли пользователей',
  'Пользовательские поля',
  'Журнал событий',
  'Экспорт данных компании',
  'Календари',
  'Журнал аудита',
  'Ресурсное планирование',
  'Категории блокировки',
  'Workflows',
];

export const filterOptions = [
  { icon: 'A', label: 'Название' },
  { icon: '👤', label: 'Заказчик' },
  { icon: '👥', label: 'Заказчик заявки службы поддержки' },
  { icon: '👤', label: 'Участник' },
  { icon: '👥', label: 'Ответственный' },
  { icon: '🔵', label: 'ID' },
  { icon: '🔥', label: 'Срочность' },
  { icon: '⚠️', label: 'Статус блокировки' },
  { icon: '🏷️', label: 'Метка' },
  { icon: '👆', label: 'Родительская карточка' },
  { icon: '👇', label: 'Дочерняя карточка' },
  { icon: '📋', label: 'Статус' },
  { icon: 'T', label: 'Тип карточки' },
  { icon: '📏', label: 'Размер' },
  { icon: '✅', label: 'Завершена' },
  { icon: '📅', label: 'Создана' },
  { icon: '➡️', label: 'Последнее перемещение' },
  { icon: '🔄', label: 'Обновлена' },
  { icon: '▶️', label: 'Взята в работу' },
  { icon: '📋', label: 'Планируемое начало' },
  { icon: '📋', label: 'Запланированный конец' },
  { icon: '⏰', label: 'Срок' },
];
