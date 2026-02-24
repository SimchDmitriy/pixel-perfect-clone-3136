import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();

  const reports = useMemo(() => [
    { id: 'summary', title: 'Суммарный отчёт', color: 'hsl(240 5% 40%)', chartType: 'table' },
    { id: 'deadlines', title: 'Сроки по задачам', color: 'hsl(142 71% 45%)', chartType: 'table' },
    { id: 'cfd', title: 'Накопительная диаграмма потока', color: 'hsl(142 71% 45%)', chartType: 'area' },
    { id: 'control', title: 'Контрольный график', color: 'hsl(270 60% 55%)', chartType: 'scatter' },
    { id: 'spectral', title: 'Спектральная диаграмма', color: 'hsl(270 60% 55%)', chartType: 'bar' },
    { id: 'cycle-trends', title: 'Динамика изменений времени цикла', color: 'hsl(210 80% 55%)', chartType: 'line' },
    { id: 'throughput', title: 'Пропускная способность', color: 'hsl(210 80% 55%)', chartType: 'bar' },
    { id: 'distribution', title: 'Распределение карточек', color: 'hsl(0 72% 51%)', chartType: 'bar' },
    { id: 'cycle-time', title: 'Время цикла', color: 'hsl(45 93% 47%)', chartType: 'stacked' },
    { id: 'block-resolution', title: 'Время разрешения блокировок', color: 'hsl(142 71% 45%)', chartType: 'bar' },
    { id: 'sprints', title: 'Спринты', color: 'hsl(322 85% 50%)', chartType: 'burndown' },
    { id: 'velocity', title: 'Скорость выполнения', color: 'hsl(210 80% 55%)', chartType: 'bar' },
  ], []);

  const renderMiniChart = (report: typeof reports[0]) => {
    const bars = Array.from({ length: 8 });
    if (report.chartType === 'scatter') {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full" style={{
              backgroundColor: report.color,
              left: `${10 + Math.random() * 75}%`,
              top: `${15 + Math.random() * 60}%`,
              opacity: 0.5 + Math.random() * 0.5,
            }} />
          ))}
          <div className="absolute left-[8%] right-[8%] border-t border-dashed" style={{ borderColor: 'hsl(0 72% 51%)', top: '55%' }} />
        </div>
      );
    }
    if (report.chartType === 'line') {
      return (
        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
          <polyline fill="none" stroke={report.color} strokeWidth="1.5" points="5,40 20,30 35,35 50,20 65,25 80,15 95,18" />
          <polyline fill="none" stroke="hsl(142 71% 45%)" strokeWidth="1.5" strokeDasharray="3 2" points="5,38 20,33 35,30 50,28 65,22 80,20 95,22" />
        </svg>
      );
    }
    if (report.chartType === 'area') {
      return (
        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
          <path d="M5,45 L20,38 L35,35 L50,30 L65,25 L80,22 L95,20 L95,50 L5,50Z" fill={report.color} opacity="0.3" />
          <path d="M5,42 L20,35 L35,30 L50,22 L65,18 L80,15 L95,12 L95,50 L5,50Z" fill="hsl(210 80% 55%)" opacity="0.3" />
          <polyline fill="none" stroke={report.color} strokeWidth="1" points="5,45 20,38 35,35 50,30 65,25 80,22 95,20" />
        </svg>
      );
    }
    if (report.chartType === 'table') {
      return (
        <div className="flex flex-col gap-1.5 px-4 pt-3 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="h-1.5 rounded-full bg-muted-foreground/20" style={{ width: `${30 + Math.random() * 40}%` }} />
              <div className="h-1.5 rounded-full bg-muted-foreground/10" style={{ width: `${15 + Math.random() * 20}%` }} />
            </div>
          ))}
        </div>
      );
    }
    if (report.chartType === 'burndown') {
      return (
        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
          <line x1="5" y1="8" x2="95" y2="42" stroke="hsl(210 80% 55%)" strokeWidth="1" strokeDasharray="3 2" />
          <polyline fill="none" stroke={report.color} strokeWidth="1.5" points="5,8 15,10 25,14 35,12 45,18 55,22 65,25 75,30 85,28 95,35" />
        </svg>
      );
    }
    return (
      <div className="flex gap-1 items-end h-20 px-4">
        {bars.map((_, i) => (
          <div key={i} className="flex-1 rounded-t transition-all" style={{
            height: `${20 + Math.random() * 60}%`,
            backgroundColor: report.color,
            opacity: 0.5 + Math.random() * 0.5,
          }} />
        ))}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => navigate(`/reports/${report.id}`)}
            className="group rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors overflow-hidden text-left"
          >
            <div className="h-32 bg-secondary/20 flex items-center justify-center relative overflow-hidden">
              {renderMiniChart(report)}
            </div>
            <div className="px-3 py-2 border-t border-border/50">
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
