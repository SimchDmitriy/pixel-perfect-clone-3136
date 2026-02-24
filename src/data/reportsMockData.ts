// Mock data generators for all report types

export const generateCFDData = () => {
  const data = [];
  const startDate = new Date(2026, 0, 1);
  let queue = 40, inProgress = 15, done = 5;
  for (let i = 0; i < 45; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    queue += Math.round(Math.random() * 3 - 1);
    inProgress += Math.round(Math.random() * 3 - 1);
    done += Math.round(Math.random() * 2 + 0.5);
    data.push({
      date: `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`,
      'Очередь': Math.max(queue, 5),
      'В работе': Math.max(inProgress, 3),
      'Готово': done,
    });
  }
  return data;
};

export const generateControlChartData = () => {
  const data = [];
  const types = ['Задача', 'Баг', 'Фича', 'Техдолг'];
  const colors = ['hsl(322 85% 50%)', 'hsl(0 72% 51%)', 'hsl(210 80% 55%)', 'hsl(45 93% 47%)'];
  for (let i = 0; i < 40; i++) {
    const ti = Math.floor(Math.random() * types.length);
    data.push({
      id: 60800000 + i,
      name: `Задача #${i + 1}`,
      days: Math.round(Math.random() * 10 + 0.5 + (Math.random() > 0.9 ? 8 : 0)),
      type: types[ti],
      color: colors[ti],
      date: `${Math.floor(Math.random() * 14 + 1).toString().padStart(2, '0')}.02`,
    });
  }
  return data;
};

export const generateSpectralData = () => {
  const buckets: Record<number, number> = {};
  for (let i = 0; i < 80; i++) {
    const d = Math.max(1, Math.round(Math.random() * Math.random() * 20 + 1));
    buckets[d] = (buckets[d] || 0) + 1;
  }
  return Object.entries(buckets)
    .map(([days, count]) => ({ days: Number(days), count }))
    .sort((a, b) => a.days - b.days);
};

export const generateCycleTimeData = () => {
  const cards = [];
  const stages = ['Очередь', 'В работе', 'Ревью', 'Готово'];
  const stageColors = ['hsl(210 80% 55%)', 'hsl(142 71% 45%)', 'hsl(45 93% 47%)', 'hsl(270 60% 55%)'];
  for (let i = 0; i < 15; i++) {
    const card: Record<string, any> = { name: `#${60800000 + i}` };
    stages.forEach((s, si) => {
      card[s] = Math.round(Math.random() * 8 + 0.5);
      card[`${s}_color`] = stageColors[si];
    });
    card.total = stages.reduce((sum, s) => sum + (card[s] as number), 0);
    cards.push(card);
  }
  return { cards: cards.sort((a, b) => b.total - a.total), stages, stageColors };
};

export const generateCycleTimeTrendsData = () => {
  const data = [];
  const months = ['Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев'];
  for (const m of months) {
    data.push({
      month: m,
      'Среднее': Math.round(Math.random() * 5 + 3),
      'Медиана': Math.round(Math.random() * 4 + 2),
      '85 перцентиль': Math.round(Math.random() * 5 + 6),
    });
  }
  return data;
};

export const generateThroughputData = () => {
  const data = [];
  const periods = ['01.01-15.01', '16.01-31.01', '01.02-15.02'];
  for (const p of periods) {
    data.push({
      period: p,
      'Создано': Math.round(Math.random() * 30 + 20),
      'Выполнено': Math.round(Math.random() * 25 + 15),
    });
  }
  return data;
};

export const generateDistributionData = () => [
  { name: 'Задача', value: 35, color: 'hsl(322 85% 50%)' },
  { name: 'Баг', value: 18, color: 'hsl(0 72% 51%)' },
  { name: 'Фича', value: 22, color: 'hsl(210 80% 55%)' },
  { name: 'Техдолг', value: 10, color: 'hsl(45 93% 47%)' },
  { name: 'Исследование', value: 8, color: 'hsl(270 60% 55%)' },
];

export const generateBlockResolutionData = () => {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      name: `Задача #${i + 1}`,
      'Ожидание ответа': Math.round(Math.random() * 4 + 0.5),
      'Внешняя зависимость': Math.round(Math.random() * 3),
      'Технические проблемы': Math.round(Math.random() * 2),
    });
  }
  return data;
};

export const generateBurndownData = () => {
  const data = [];
  let remaining = 27;
  for (let i = 0; i <= 14; i++) {
    const ideal = 27 - (27 / 14) * i;
    const completed = Math.max(0, Math.round(Math.random() * 3));
    const added = Math.random() > 0.8 ? Math.round(Math.random() * 2 + 1) : 0;
    remaining = remaining - completed + added;
    data.push({
      day: `День ${i}`,
      'Идеал': Math.round(ideal * 10) / 10,
      'Осталось': Math.max(0, remaining),
      'Выполнено': completed,
      'Добавлено': added,
    });
  }
  return data;
};

export const generateVelocityData = () => {
  const data = [];
  for (let i = 1; i <= 8; i++) {
    const planned = Math.round(Math.random() * 10 + 10);
    data.push({
      sprint: `Sprint ${i}`,
      'Запланировано': planned,
      'Выполнено': Math.round(planned * (0.6 + Math.random() * 0.4)),
    });
  }
  return data;
};

export const generateSummaryData = () => {
  const boards = ['Родитель дочка', 'Перемещение', 'Модуль чек-листа'];
  const types = ['Card', 'Работа', 'Договор'];
  const data = [];
  for (let i = 0; i < 12; i++) {
    data.push({
      id: 60795619 + i * 1000,
      board: boards[Math.floor(Math.random() * boards.length)],
      name: `Задача ${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      createdAt: `${Math.floor(Math.random() * 15 + 1).toString().padStart(2, '0')}.02.2026`,
      startedAt: `${Math.floor(Math.random() * 15 + 1).toString().padStart(2, '0')}.02.2026`,
      completedAt: `${Math.floor(Math.random() * 15 + 5).toString().padStart(2, '0')}.02.2026`,
      column: 'Готово',
    });
  }
  return data;
};

export const generateDeadlinesData = () => {
  const statuses = ['Выполнено в срок', 'Выполнено не в срок', 'Ожидает выполнения', 'Не выполнено'];
  const statusColors = ['hsl(142 71% 45%)', 'hsl(45 93% 47%)', 'hsl(210 80% 55%)', 'hsl(0 72% 51%)'];
  const data = [];
  for (let i = 0; i < 8; i++) {
    const si = Math.floor(Math.random() * statuses.length);
    data.push({
      id: 60828568 + i,
      name: `Задача ${i + 1}`,
      deadline: `${Math.floor(Math.random() * 14 + 5).toString().padStart(2, '0')}.02.2026`,
      status: statuses[si],
      statusColor: statusColors[si],
      responsible: ['Иванов А.', 'Петрова М.', 'Смирнов К.'][Math.floor(Math.random() * 3)],
    });
  }
  return { rows: data, statuses, statusColors };
};
