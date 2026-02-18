import React from 'react';

const ReportsPage: React.FC = () => {
  const reports = [
    { title: 'Суммарный отчёт', color: 'hsl(240 5% 17%)' },
    { title: 'Сроки по задачам', color: 'hsl(142 71% 45%)' },
    { title: 'Накопительная диаграмма потока', color: 'hsl(142 71% 45%)' },
    { title: 'Контрольный график', color: 'hsl(270 60% 55%)' },
    { title: 'Спектральная диаграмма', color: 'hsl(270 60% 55%)' },
    { title: 'Динамика изменений времени цикла', color: 'hsl(210 80% 55%)' },
    { title: 'Пропускная способность', color: 'hsl(210 80% 55%)' },
    { title: 'Распределение карточек', color: 'hsl(0 72% 51%)' },
    { title: 'Время цикла', color: 'hsl(45 93% 47%)' },
    { title: 'Время разрешения блокировок', color: 'hsl(142 71% 45%)' },
    { title: 'Спринты', color: 'hsl(322 85% 50%)' },
    { title: 'Скорость выполнения', color: 'hsl(210 80% 55%)' },
  ];

  return (
    <div className="h-full overflow-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reports.map((report) => (
          <button
            key={report.title}
            className="group rounded-lg border border-border bg-card-surface hover:bg-card-hover transition-colors overflow-hidden text-left"
          >
            {/* Chart placeholder */}
            <div className="h-40 bg-secondary/30 flex items-center justify-center relative">
              <div className="flex gap-1 items-end h-20">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 rounded-t transition-all"
                    style={{
                      height: `${20 + Math.random() * 60}%`,
                      backgroundColor: report.color,
                      opacity: 0.6 + Math.random() * 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="px-3 py-2">
              <span className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                {report.title}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
