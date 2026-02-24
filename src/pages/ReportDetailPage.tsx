import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ReferenceLine, ComposedChart,
} from 'recharts';
import * as mock from '@/data/reportsMockData';

const REPORT_CONFIGS: Record<string, { title: string; description: string }> = {
  'summary': { title: 'Суммарный отчёт', description: 'Показывает завершённые задачи за указанный период.' },
  'deadlines': { title: 'Сроки по задачам', description: 'Карточки с чек-листами, сроками и прогрессом выполнения.' },
  'cfd': { title: 'Накопительная диаграмма потока', description: 'Показывает состояние рабочего процесса: сколько задач выполнено, в работе и в очереди.' },
  'control': { title: 'Контрольный график', description: 'Время выполнения задач за период с линией SLA.' },
  'spectral': { title: 'Спектральная диаграмма', description: 'Распределение задач по времени выполнения с перцентилями.' },
  'cycle-trends': { title: 'Динамика изменений времени цикла', description: 'Как менялось среднее время выполнения задач.' },
  'throughput': { title: 'Пропускная способность', description: 'Объём работы, выполненной за определённый период.' },
  'distribution': { title: 'Распределение карточек', description: 'Распределение задач по типам, ответственным и колонкам.' },
  'cycle-time': { title: 'Время цикла', description: 'Время нахождения задачи на каждом этапе.' },
  'block-resolution': { title: 'Время разрешения блокировок', description: 'Сколько времени карточки были заблокированы.' },
  'sprints': { title: 'Спринты', description: 'Диаграмма сгорания (Burndown Chart) для спринта.' },
  'velocity': { title: 'Скорость выполнения', description: 'Velocity: объём работы, который команда выполняет за спринт.' },
};

const FilterPanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-72 shrink-0 border-l border-border bg-card p-4 overflow-auto space-y-4">
    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
      <Settings2 size={14} /> Фильтры
    </h3>
    {children}
  </div>
);

const FilterField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div>
    <label className="text-xs text-muted-foreground block mb-1">{label}</label>
    <div className="bg-secondary/50 border border-border rounded px-2 py-1.5 text-xs text-foreground">
      {value || 'Все'}
    </div>
  </div>
);

const PeriodFilter: React.FC = () => (
  <>
    <FilterField label="Период" value="3 месяца" />
    <FilterField label="Начальная колонка" value="Родитель дочка / Очередь" />
    <FilterField label="Конечная колонка" value="Родитель дочка / Готово" />
  </>
);

const TypesFilter: React.FC = () => (
  <>
    <FilterField label="Типы карточек" value="Все" />
    <FilterField label="Метки" />
    <FilterField label="Параметры" value="Только срочные карточки" />
  </>
);

const SummaryReport: React.FC = () => {
  const data = useMemo(() => mock.generateSummaryData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-2">Доска</th>
              <th className="text-left py-2 px-2">Название</th>
              <th className="text-left py-2 px-2">Тип</th>
              <th className="text-left py-2 px-2">Дата создания</th>
              <th className="text-left py-2 px-2">В работу</th>
              <th className="text-left py-2 px-2">Выполнена</th>
              <th className="text-left py-2 px-2">Колонка</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="py-2 px-2 text-foreground">{row.board}</td>
                <td className="py-2 px-2 text-foreground">{row.name}</td>
                <td className="py-2 px-2 text-muted-foreground">{row.type}</td>
                <td className="py-2 px-2 text-muted-foreground">{row.createdAt}</td>
                <td className="py-2 px-2 text-muted-foreground">{row.startedAt}</td>
                <td className="py-2 px-2 text-muted-foreground">{row.completedAt}</td>
                <td className="py-2 px-2">
                  <span className="text-[hsl(var(--success))]">{row.column}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 text-xs text-muted-foreground">Выполнено задач: {data.length}</div>
      </div>
      <FilterPanel>
        <FilterField label="Период" value="3 месяца" />
        <FilterField label="Доски" value="Все" />
        <FilterField label="Группировка" value="Не группировать" />
      </FilterPanel>
    </div>
  );
};

const DeadlinesReport: React.FC = () => {
  const { rows, statuses, statusColors } = useMemo(() => mock.generateDeadlinesData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          {statuses.map((s, i) => (
            <span key={s} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: statusColors[i], color: '#fff' }}>{s}</span>
          ))}
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-2">ID</th>
              <th className="text-left py-2 px-2">Название</th>
              <th className="text-left py-2 px-2">Срок</th>
              <th className="text-left py-2 px-2">Статус</th>
              <th className="text-left py-2 px-2">Ответственный</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="py-2 px-2 text-muted-foreground">{r.id}</td>
                <td className="py-2 px-2 text-foreground">{r.name}</td>
                <td className="py-2 px-2 text-muted-foreground">{r.deadline}</td>
                <td className="py-2 px-2"><span style={{ color: r.statusColor }}>{r.status}</span></td>
                <td className="py-2 px-2 text-muted-foreground">{r.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 text-xs text-muted-foreground">Всего задач: {rows.length}</div>
      </div>
      <FilterPanel>
        <FilterField label="Период" value="Месяц" />
        <FilterField label="Доски" value="Все" />
        <FilterField label="Типы карточек" value="Все" />
      </FilterPanel>
    </div>
  );
};

const CFDReport: React.FC = () => {
  const data = useMemo(() => mock.generateCFDData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
            <XAxis dataKey="date" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: 'hsl(240 5% 14%)', border: '1px solid hsl(240 4% 20%)', borderRadius: 6, fontSize: 12 }} />
            <Legend />
            <Area type="monotone" dataKey="Готово" stackId="1" fill="hsl(142 71% 45%)" stroke="hsl(142 71% 45%)" fillOpacity={0.6} />
            <Area type="monotone" dataKey="В работе" stackId="1" fill="hsl(210 80% 55%)" stroke="hsl(210 80% 55%)" fillOpacity={0.6} />
            <Area type="monotone" dataKey="Очередь" stackId="1" fill="hsl(45 93% 47%)" stroke="hsl(45 93% 47%)" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span>Колонка (среднее время нахождения карточки в колонке)</span>
        </div>
      </div>
      <FilterPanel>
        <PeriodFilter />
        <FilterField label="Ось Y" value="Кол-во карточек" />
        <TypesFilter />
      </FilterPanel>
    </div>
  );
};

const ControlChartReport: React.FC = () => {
  const data = useMemo(() => mock.generateControlChartData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
            <XAxis dataKey="date" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} name="Дата" />
            <YAxis dataKey="days" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} name="Дни" label={{ value: 'Дни', angle: -90, position: 'insideLeft', fill: 'hsl(240 5% 55%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(240 5% 14%)', border: '1px solid hsl(240 4% 20%)', borderRadius: 6, fontSize: 12 }} formatter={(v: any, n: string) => [v, n === 'days' ? 'Дней' : n]} />
            <ReferenceLine y={5} stroke="hsl(0 72% 51%)" strokeDasharray="5 5" label={{ value: 'SLA, 89%', fill: 'hsl(0 72% 51%)', fontSize: 11, position: 'right' }} />
            <Scatter data={data} fill="hsl(322 85% 50%)">
              {data.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <FilterPanel>
        <PeriodFilter />
        <FilterField label="SLA (дни)" value="5" />
        <FilterField label="Размеры" value="Все" />
        <TypesFilter />
      </FilterPanel>
    </div>
  );
};

const SpectralReport: React.FC = () => {
  const data = useMemo(() => mock.generateSpectralData(), []);
  const mean = data.reduce((s, d) => s + d.days * d.count, 0) / data.reduce((s, d) => s + d.count, 0);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
            <XAxis dataKey="days" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} label={{ value: 'Время цикла (дни)', position: 'bottom', fill: 'hsl(240 5% 55%)' }} />
            <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: 'hsl(240 5% 14%)', border: '1px solid hsl(240 4% 20%)', borderRadius: 6, fontSize: 12 }} />
            <Bar dataKey="count" fill="hsl(270 60% 55%)" name="Карточек" radius={[2, 2, 0, 0]} />
            <ReferenceLine x={Math.round(mean)} stroke="hsl(210 80% 55%)" strokeDasharray="5 5" label={{ value: `Среднее: ${mean.toFixed(1)}д`, fill: 'hsl(210 80% 55%)', fontSize: 11 }} />
            <ReferenceLine x={Math.round(mean * 1.5)} stroke="hsl(0 72% 51%)" strokeDasharray="5 5" label={{ value: '85 перц.', fill: 'hsl(0 72% 51%)', fontSize: 11 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <FilterPanel>
        <PeriodFilter />
        <FilterField label="Percentile #1" value="85" />
        <FilterField label="Percentile #2" value="50" />
        <TypesFilter />
      </FilterPanel>
    </div>
  );
};

const CycleTrendsReport: React.FC = () => {
  const data = useMemo(() => mock.generateCycleTimeTrendsData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} label={{ value: 'Дни', angle: -90, position: 'insideLeft', fill: 'hsl(240 5% 55%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(240 5% 14%)', border: '1px solid hsl(240 4% 20%)', borderRadius: 6, fontSize: 12 }} />
            <Legend />
            <Line type="monotone" dataKey="Среднее" stroke="hsl(210 80% 55%)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Медиана" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="85 перцентиль" stroke="hsl(0 72% 51%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <FilterPanel>
        <FilterField label="Группировка по" value="Месяцу" />
        <PeriodFilter />
        <TypesFilter />
      </FilterPanel>
    </div>
  );
};

const ThroughputReport: React.FC = () => {
  const data = useMemo(() => mock.generateThroughputData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
            <XAxis dataKey="period" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: 'hsl(240 5% 14%)', border: '1px solid hsl(240 4% 20%)', borderRadius: 6, fontSize: 12 }} />
            <Legend />
            <Bar dataKey="Создано" fill="hsl(210 80% 55%)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Выполнено" fill="hsl(142 71% 45%)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <FilterPanel>
        <FilterField label="Период" value="Выбранные даты" />
        <FilterField label="Группировка по" value="Месяцу" />
        <PeriodFilter />
        <FilterField label="Ось Y" value="Кол-во карточек" />
        <FilterField label="Группировка" value="Дорожкам" />
      </FilterPanel>
    </div>
  );
};

const DistributionReport: React.FC = () => {
  const data = useMemo(() => mock.generateDistributionData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
            <XAxis type="number" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} width={100} />
            <Tooltip contentStyle={{ background: 'hsl(240 5% 14%)', border: '1px solid hsl(240 4% 20%)', borderRadius: 6, fontSize: 12 }} />
            <Bar dataKey="value" name="Карточек" radius={[0, 4, 4, 0]}>
              {data.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-3 mt-2 flex-wrap">
          {data.map((d) => (
            <span key={d.name} className="text-xs flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: d.color }} />
              {d.name}: {d.value}
            </span>
          ))}
        </div>
      </div>
      <FilterPanel>
        <FilterField label="Критерий" value="Типы" />
        <FilterField label="Доски" value="Все" />
        <FilterField label="Колонки" value="Все" />
        <FilterField label="Дорожки" value="Все" />
        <TypesFilter />
      </FilterPanel>
    </div>
  );
};

const CycleTimeReport: React.FC = () => {
  const { cards, stages, stageColors } = useMemo(() => mock.generateCycleTimeData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={cards}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10 }} />
            <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} label={{ value: 'Дни', angle: -90, position: 'insideLeft', fill: 'hsl(240 5% 55%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(240 5% 14%)', border: '1px solid hsl(240 4% 20%)', borderRadius: 6, fontSize: 12 }} />
            <Legend />
            {stages.map((s, i) => (
              <Bar key={s} dataKey={s} stackId="a" fill={stageColors[i]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          {stages.map((s, i) => (
            <span key={s} className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: stageColors[i] }} /> {s}
            </span>
          ))}
        </div>
      </div>
      <FilterPanel>
        <PeriodFilter />
        <FilterField label="Учитывать дни" value="Пн Вт Ср Чт Пт" />
        <TypesFilter />
      </FilterPanel>
    </div>
  );
};

const BlockResolutionReport: React.FC = () => {
  const data = useMemo(() => mock.generateBlockResolutionData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 10 }} />
            <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} label={{ value: 'Дни', angle: -90, position: 'insideLeft', fill: 'hsl(240 5% 55%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(240 5% 14%)', border: '1px solid hsl(240 4% 20%)', borderRadius: 6, fontSize: 12 }} />
            <Legend />
            <Bar dataKey="Ожидание ответа" stackId="a" fill="hsl(45 93% 47%)" />
            <Bar dataKey="Внешняя зависимость" stackId="a" fill="hsl(210 80% 55%)" />
            <Bar dataKey="Технические проблемы" stackId="a" fill="hsl(0 72% 51%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <FilterPanel>
        <PeriodFilter />
        <TypesFilter />
      </FilterPanel>
    </div>
  );
};

const SprintsReport: React.FC = () => {
  const data = useMemo(() => mock.generateBurndownData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
            <XAxis dataKey="day" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: 'hsl(240 5% 14%)', border: '1px solid hsl(240 4% 20%)', borderRadius: 6, fontSize: 12 }} />
            <Legend />
            <Line type="monotone" dataKey="Идеал" stroke="hsl(210 80% 55%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Осталось" stroke="hsl(45 93% 47%)" strokeWidth={2} dot={{ r: 3 }} />
            <Bar dataKey="Выполнено" fill="hsl(270 60% 55%)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Добавлено" fill="hsl(0 72% 51%)" radius={[2, 2, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <div>Количество задач на начало спринта: {data[0]?.['Осталось']}</div>
          <div>Количество оставшейся работы: {data[data.length - 1]?.['Осталось']}</div>
        </div>
      </div>
      <FilterPanel>
        <FilterField label="Спринт" value="Sprint 1" />
        <FilterField label="Ось Y" value="Кол-во карточек" />
      </FilterPanel>
    </div>
  );
};

const VelocityReport: React.FC = () => {
  const data = useMemo(() => mock.generateVelocityData(), []);
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 20%)" />
            <XAxis dataKey="sprint" tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(240 5% 55%)', fontSize: 11 }} label={{ value: 'Story Points', angle: -90, position: 'insideLeft', fill: 'hsl(240 5% 55%)' }} />
            <Tooltip contentStyle={{ background: 'hsl(240 5% 14%)', border: '1px solid hsl(240 4% 20%)', borderRadius: 6, fontSize: 12 }} />
            <Legend />
            <Bar dataKey="Запланировано" fill="hsl(210 80% 55%)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Выполнено" fill="hsl(142 71% 45%)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <FilterPanel>
        <FilterField label="Доска" value="Sprint-доска Команды A" />
      </FilterPanel>
    </div>
  );
};

const REPORT_COMPONENTS: Record<string, React.FC> = {
  'summary': SummaryReport,
  'deadlines': DeadlinesReport,
  'cfd': CFDReport,
  'control': ControlChartReport,
  'spectral': SpectralReport,
  'cycle-trends': CycleTrendsReport,
  'throughput': ThroughputReport,
  'distribution': DistributionReport,
  'cycle-time': CycleTimeReport,
  'block-resolution': BlockResolutionReport,
  'sprints': SprintsReport,
  'velocity': VelocityReport,
};

const ReportDetailPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const config = REPORT_CONFIGS[reportId || ''];
  const ReportComponent = REPORT_COMPONENTS[reportId || ''];

  if (!config || !ReportComponent) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Отчёт не найден
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate('/reports')} className="gap-1.5">
          <ArrowLeft size={16} /> Отчёты
        </Button>
        <div className="h-4 w-px bg-border" />
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-foreground">{config.title}</h1>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Download size={14} /> Скачать отчёт
        </Button>
      </div>
      {/* Content */}
      <ReportComponent />
    </div>
  );
};

export default ReportDetailPage;
