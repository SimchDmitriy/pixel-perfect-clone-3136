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
  dateRange?: string;
  commentCount?: number;
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

export interface KaitenBoard {
  id: string;
  title: string;
  cardCount: number;
  lanes: KaitenLane[];
  collapsed?: boolean;
}

export interface SidebarSpace {
  id: string;
  name: string;
  icon: 'folder' | 'board' | 'globe' | 'community' | 'workflow' | 'automation' | 'doc' | 'funnel';
  color: string;
  children?: SidebarSpace[];
  expanded?: boolean;
  emoji?: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  lastActive: string;
  access: string;
}

// Sidebar spaces matching the reference screenshots
export const mockSpaces: SidebarSpace[] = [
  {
    id: 'personal', name: 'Личное', icon: 'folder', color: 'hsl(240 5% 55%)',
  },
  {
    id: 'favorites', name: 'Избранное (1)', icon: 'folder', color: 'hsl(45 93% 47%)',
  },
  {
    id: 'all-examples', name: 'Все примеры', icon: 'folder', color: 'hsl(270 60% 55%)',
    expanded: true,
    children: [
      {
        id: 'demo', name: 'Демо Макеты', icon: 'folder', color: 'hsl(142 71% 45%)',
        children: [
          { id: 'kanban-example', name: 'Канбан_Пример 🎃', icon: 'board', color: 'hsl(210 80% 55%)' },
          { id: 'project-mgmt', name: 'Управление Проектами', icon: 'folder', color: 'hsl(142 71% 45%)' },
          { id: 'workflow-example', name: 'Workflow_Пример', icon: 'workflow', color: 'hsl(270 60% 55%)' },
          { id: 'dynamic-boards', name: '⚙ Динамические Доски⬇️', icon: 'automation', color: 'hsl(322 85% 50%)' },
          { id: 'documents', name: 'Документы', icon: 'doc', color: 'hsl(0 72% 51%)' },
          { id: 'funnel', name: 'Воронка', icon: 'funnel', color: 'hsl(240 5% 55%)' },
          { id: 'automations', name: '⚡ Автоматизации 🔥', icon: 'automation', color: 'hsl(45 93% 47%)' },
        ],
      },
      {
        id: 'support', name: '⚙ Служба Поддержки', icon: 'folder', color: 'hsl(142 71% 45%)',
      },
      { id: 'throughput', name: 'Throughput', icon: 'board', color: 'hsl(270 60% 55%)' },
      { id: 'reports-kanban', name: '📊 Отчеты_Канбан ☑️', icon: 'board', color: 'hsl(210 80% 55%)' },
      { id: 'reports-scrum', name: '📊 Отчеты_Скрам ☑️', icon: 'board', color: 'hsl(210 80% 55%)' },
      { id: 'doc-approval', name: '🤝 Согласование документов', icon: 'board', color: 'hsl(210 80% 55%)' },
      { id: 'marketing', name: '🏪 Маркетинг', icon: 'board', color: 'hsl(210 80% 55%)' },
      { id: 'legal', name: '🏛 Юр Отдел 🧐', icon: 'board', color: 'hsl(210 80% 55%)' },
      { id: 'presale', name: 'Пресейл', icon: 'board', color: 'hsl(210 80% 55%)' },
      {
        id: 'shared-boards', name: '🔗Общие/Связанные Доски', icon: 'folder', color: 'hsl(45 93% 47%)',
      },
      {
        id: 'it-dev', name: '💻 ИТ и Разработка ПО', icon: 'folder', color: 'hsl(142 71% 45%)',
      },
      {
        id: 'heavy-industry', name: '🏭 Тяжелая промышленность', icon: 'folder', color: 'hsl(0 72% 51%)',
      },
      {
        id: 'production', name: '🏭 Производство', icon: 'folder', color: 'hsl(142 71% 45%)',
      },
      {
        id: 'real-estate', name: '🏠 🏗Недвижимость / Строитель...', icon: 'folder', color: 'hsl(210 80% 55%)',
      },
      {
        id: 'knowledge', name: '📚База Знаний 📖', icon: 'globe', color: 'hsl(210 80% 55%)',
      },
      { id: 'root-menu', name: 'Пример корневого меню', icon: 'folder', color: 'hsl(45 93% 47%)' },
      { id: 'various', name: 'Разное', icon: 'folder', color: 'hsl(322 85% 50%)' },
      { id: 'custom', name: 'Кастомизации', icon: 'folder', color: 'hsl(45 93% 47%)' },
      { id: 'community', name: '🏢 Комьюнити', icon: 'community', color: 'hsl(210 80% 55%)' },
    ],
  },
  {
    id: 'test-scenarios', name: 'Тест сценариев', icon: 'board', color: 'hsl(210 80% 55%)',
    expanded: true,
    children: [
      {
        id: 'parent-child', name: 'родитель дочка', icon: 'board', color: 'hsl(210 80% 55%)',
        expanded: true,
        children: [
          { id: 'usm', name: 'USM', icon: 'board', color: 'hsl(210 80% 55%)' },
        ],
      },
      {
        id: 'scenarios', name: 'Сценарии', icon: 'board', color: 'hsl(210 80% 55%)',
        expanded: true,
        children: [
          { id: 'folder-2', name: '2', icon: 'folder', color: 'hsl(240 5% 55%)' },
          { id: 'folder-1', name: '1', icon: 'folder', color: 'hsl(240 5% 55%)' },
        ],
      },
    ],
  },
  {
    id: 'metafor', name: '🏢 Метафорический USM "Мужчина д...', icon: 'community', color: 'hsl(210 80% 55%)',
  },
];

// Board data: space "родитель дочка" contains multiple boards
export const mockBoards: KaitenBoard[] = [
  {
    id: 'board-parent',
    title: 'Родитель дочка',
    cardCount: 12,
    collapsed: false,
    lanes: [
      {
        id: 'lane-parent-default',
        title: '',
        columns: [
          {
            id: 'parent-queue',
            title: 'Очередь',
            wipCurrent: 6,
            cards: [
              {
                id: 'pc1', title: '222', parentTitle: 'Тест заявки', avatarColor: 'hsl(45 93% 47%)',
                tags: [
                  { label: '-165ч 26м', color: 'hsl(0 72% 51%)' },
                  { label: '-129ч 31м', color: 'hsl(0 72% 51%)' },
                ],
                subtasksTotal: 2, subtasksDone: 0,
                dateRange: '11 февр. 9:00 - 11 февр. 18:00',
                blockerCount: 13,
              },
              {
                id: 'pc2', title: '111', parentTitle: 'Тест заявки', avatarColor: 'hsl(45 93% 47%)',
                tags: [
                  { label: '-164ч 24м', color: 'hsl(0 72% 51%)' },
                  { label: '-130ч 29м', color: 'hsl(0 72% 51%)' },
                ],
                subtasksTotal: 1, subtasksDone: 0,
                dateRange: '12 февр. 9:00 - 12 февр. 18:00',
                blockerCount: 12,
              },
              {
                id: 'pc3', title: '', parentTitle: 'Тест заявки', avatarColor: 'hsl(45 93% 47%)',
                tags: [
                  { label: '-60ч 51м', color: 'hsl(210 80% 55%)' },
                  { label: '-18ч 51м', color: 'hsl(210 80% 55%)' },
                ],
                blockerCount: 12,
              },
              {
                id: 'pc4', title: 'СЛА', avatarColor: 'hsl(45 93% 47%)',
                blockerCount: 12,
              },
              {
                id: 'pc5', title: 'срок +2', avatarColor: 'hsl(45 93% 47%)',
                dateRange: '12 февр. 9:00 - 16 февр. 18:00',
                blockerCount: 14,
              },
              {
                id: 'pc6', title: 'Ежедневный отчёт', avatarColor: 'hsl(240 5% 55%)',
                dateRange: '19 февр.',
              },
              {
                id: 'pc6b', title: 'Ежедневный отчёт', avatarColor: 'hsl(240 5% 55%)',
                dateRange: '20 февр.',
              },
            ],
          },
          {
            id: 'parent-inwork',
            title: 'В работе',
            wipCurrent: 4,
            wipLimit: 4,
            cards: [
              {
                id: 'pw1', title: 'Написать страницу 1', avatarColor: 'hsl(45 93% 47%)',
                tags: [{ label: '1', color: 'hsl(0 72% 51%)' }],
                subtasksTotal: 1, subtasksDone: 0,
                colorLine: 'hsl(322 85% 50%)',
              },
              {
                id: 'pw2', title: 'Написать страницу 2', avatarColor: 'hsl(45 93% 47%)',
                colorLine: 'hsl(210 80% 55%)',
              },
              {
                id: 'pw3', title: '', parentTitle: 'Тест заявки', avatarColor: 'hsl(45 93% 47%)',
                tags: [{ label: 'Тест заявки', color: 'hsl(322 85% 50%)' }],
                colorLine: 'hsl(322 85% 50%)',
              },
              {
                id: 'pw4', title: 'Заявка', avatarColor: 'hsl(45 93% 47%)',
                subtasksTotal: 1, subtasksDone: 0,
                blockerCount: 11,
              },
            ],
          },
          {
            id: 'parent-done',
            title: '✓ Готово',
            wipCurrent: 2,
            cards: [
              {
                id: 'pd1', title: 'Выбрать шрифт', avatarColor: 'hsl(45 93% 47%)',
                subtasksTotal: 1, subtasksDone: 1,
                colorLine: 'hsl(210 80% 55%)',
              },
              {
                id: 'pd2', title: 'Выбрать шрифт', avatarColor: 'hsl(45 93% 47%)',
                colorLine: 'hsl(210 80% 55%)',
              },
              {
                id: 'pd3', title: 'Выбрать бумагу', avatarColor: 'hsl(45 93% 47%)',
                subtasksTotal: 1, subtasksDone: 0,
                progressValue: 55555,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'board-move',
    title: 'Перемещение',
    cardCount: 4,
    collapsed: false,
    lanes: [
      {
        id: 'lane-move-default',
        title: '',
        columns: [
          {
            id: 'move-queue',
            title: 'Очередь',
            wipCurrent: 3,
            cards: [
              {
                id: 'mc1', parentTitle: 'Родитель 1', title: 'Дочерняя 1',
                assignee: 'Дмитрий Смирнов', avatarColor: 'hsl(45 93% 47%)',
                subtasksTotal: 3, subtasksDone: 0,
                progressValue: 111,
                colorLine: 'hsl(210 80% 55%)',
              },
              {
                id: 'mc2', parentTitle: 'Родитель 1', title: 'Дочерняя 3',
                avatarColor: 'hsl(45 93% 47%)',
                subtasksTotal: 3, subtasksDone: 0,
                progressValue: 111,
                tags: [{ label: '1111', color: 'hsl(0 72% 51%)' }],
                colorLine: 'hsl(322 85% 50%)',
              },
              {
                id: 'mc3', parentTitle: 'Родитель 1', title: 'Дочерняя 2',
                avatarColor: 'hsl(45 93% 47%)',
                subtasksTotal: 3, subtasksDone: 0,
                progressValue: 111,
                colorLine: 'hsl(142 71% 45%)',
              },
            ],
          },
          {
            id: 'move-inwork',
            title: 'В работе',
            wipLimit: 1,
            wipCurrent: 1,
            cards: [
              {
                id: 'mc4', parentTitle: 'Родитель 1', title: '',
                avatarColor: 'hsl(45 93% 47%)',
                blockerCount: 6,
                subtasksTotal: 3, subtasksDone: 1,
                progressValue: 111,
                colorLine: 'hsl(210 80% 55%)',
              },
            ],
          },
          {
            id: 'move-done',
            title: '✓ Готово',
            wipCurrent: 0,
            cards: [],
          },
        ],
      },
    ],
  },
];

// Right side board: "Дочки чек-листа"
export const mockChildBoard: KaitenBoard = {
  id: 'board-child-checklist',
  title: 'Дочки чек-листа',
  cardCount: 3,
  collapsed: false,
  lanes: [
    {
      id: 'lane-child-default',
      title: '',
      columns: [
        {
          id: 'child-queue',
          title: 'Очередь',
          wipCurrent: 2,
          cards: [
            { id: 'cc1', parentTitle: 'Родитель 1', title: 'дочь чек лист 2', avatarColor: 'hsl(240 5% 55%)' },
            { id: 'cc2', parentTitle: 'Родитель 1', title: 'дочь чек лист 3', avatarColor: 'hsl(240 5% 55%)' },
          ],
        },
        {
          id: 'child-work',
          title: 'В работе',
          wipCurrent: 1,
          wipLimit: 1,
          cards: [
            { id: 'cc3', parentTitle: 'Родитель 1', title: 'дочь чек лист 1', avatarColor: 'hsl(45 93% 47%)' },
          ],
        },
        {
          id: 'child-done',
          title: '✓ Готово',
          wipCurrent: 0,
          cards: [],
        },
      ],
    },
  ],
};

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

// Right sidebar icon items for the vertical strip
export const rightSidebarIcons = [
  { id: 'users', label: 'Пользователи', emoji: '👥' },
  { id: 'time', label: 'Учёт времени', emoji: '⏱️' },
  { id: 'history', label: 'История', emoji: '🕐' },
  { id: 'docs', label: 'Документы', emoji: '📄' },
  { id: 'settings', label: 'Настройки', emoji: '⚙️' },
  { id: 'block', label: 'Блокировки', emoji: '🚫' },
  { id: 'globe', label: 'Публичный доступ', emoji: '🌐' },
  { id: 'share', label: 'Поделиться', emoji: '🔗' },
  { id: 'automation', label: 'Автоматизация', emoji: '🤖' },
];
