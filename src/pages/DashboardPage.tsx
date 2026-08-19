import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ChevronDown, Plus } from 'react-bootstrap-icons';
import { StatCard } from '../components/ui/StatCard';
import { RecentActivity, type ActivityItem } from '../components/domain/RecentActivity';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip as RechartsTooltip,
} from 'recharts';

interface DashboardPageProps {
  onViewChange: (view: string, action?: string | null) => void;
}

type DashboardRange = 'Hoy' | 'Última semana' | 'Últimos 30 días' | 'Últimos 90 días' | 'Este año';

const dateRangeOptions: DashboardRange[] = ['Hoy', 'Última semana', 'Últimos 30 días', 'Últimos 90 días', 'Este año'];

const activityDataByRange: Record<DashboardRange, Array<{ name: string; p: number; fullDate: string; displayP: number }>> = {
  Hoy: [
    { name: '08:00', p: 4, fullDate: 'Hoy 08:00', displayP: 4 },
    { name: '10:00', p: 8, fullDate: 'Hoy 10:00', displayP: 8 },
    { name: '12:00', p: 10, fullDate: 'Hoy 12:00', displayP: 10 },
    { name: '14:00', p: 14, fullDate: 'Hoy 14:00', displayP: 14 },
    { name: '16:00', p: 18, fullDate: 'Hoy 16:00', displayP: 18 },
    { name: '18:00', p: 22, fullDate: 'Hoy 18:00', displayP: 22 },
  ],
  'Última semana': [
    { name: 'Lun', p: 8, fullDate: 'Lunes', displayP: 8 },
    { name: 'Mar', p: 11, fullDate: 'Martes', displayP: 11 },
    { name: 'Mié', p: 9, fullDate: 'Miércoles', displayP: 9 },
    { name: 'Jue', p: 15, fullDate: 'Jueves', displayP: 15 },
    { name: 'Vie', p: 18, fullDate: 'Viernes', displayP: 18 },
    { name: 'Sáb', p: 16, fullDate: 'Sábado', displayP: 16 },
    { name: 'Dom', p: 20, fullDate: 'Domingo', displayP: 20 },
  ],
  'Últimos 30 días': [
    { name: '1', p: 8, fullDate: '1 de marzo', displayP: 8 },
    { name: '7', p: 11, fullDate: '7 de marzo', displayP: 11 },
    { name: '12', p: 14, fullDate: '12 de marzo', displayP: 14 },
    { name: '18', p: 12, fullDate: '18 de marzo', displayP: 12 },
    { name: '24', p: 19, fullDate: '24 de marzo', displayP: 19 },
    { name: '30', p: 22, fullDate: '30 de marzo', displayP: 22 },
  ],
  'Últimos 90 días': [
    { name: 'Ene', p: 14, fullDate: 'Enero', displayP: 14 },
    { name: 'Feb', p: 17, fullDate: 'Febrero', displayP: 17 },
    { name: 'Mar', p: 15, fullDate: 'Marzo', displayP: 15 },
    { name: 'Abr', p: 19, fullDate: 'Abril', displayP: 19 },
    { name: 'May', p: 21, fullDate: 'Mayo', displayP: 21 },
    { name: 'Jun', p: 24, fullDate: 'Junio', displayP: 24 },
  ],
  'Este año': [
    { name: 'Ene', p: 12, fullDate: 'Enero', displayP: 12 },
    { name: 'Feb', p: 18, fullDate: 'Febrero', displayP: 18 },
    { name: 'Mar', p: 15, fullDate: 'Marzo', displayP: 15 },
    { name: 'Abr', p: 21, fullDate: 'Abril', displayP: 21 },
    { name: 'May', p: 19, fullDate: 'Mayo', displayP: 19 },
    { name: 'Jun', p: 24, fullDate: 'Junio', displayP: 24 },
    { name: 'Jul', p: 26, fullDate: 'Julio', displayP: 26 },
    { name: 'Ago', p: 23, fullDate: 'Agosto', displayP: 23 },
  ],
};

const barChartDataFull = [
  { name: 'L1', enUso: 18, disponible: 12 },
  { name: 'L2', enUso: 15, disponible: 9 },
  { name: 'L3', enUso: 20, disponible: 8 },
  { name: 'L4', enUso: 11, disponible: 13 },
  { name: 'L5', enUso: 17, disponible: 10 },
  { name: 'L6', enUso: 14, disponible: 12 },
];

const barChartDataEmpty = barChartDataFull.map((item) => ({ ...item, enUso: 0, disponible: 0 }));

const mockActivities: ActivityItem[] = [
  { id: 'act-product-1', action: 'Producto creado', date: 'Hace 20 min', type: 'product', targetView: 'catalog', targetAction: 'create-product' },
  { id: 'act-loan-1', action: 'Préstamo activado', date: 'Hace 1 h', type: 'loan', targetView: 'loans', targetAction: 'filter-active' },
  { id: 'act-template-1', action: 'Plantilla creada', date: 'Hace 3 h', type: 'template', targetView: 'templates', targetAction: 'create-template' },
  { id: 'act-user-1', action: 'Usuario agregado', date: 'Ayer', type: 'user', targetView: 'dashboard' },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onViewChange }) => {
  const [timeRange, setTimeRange] = useState<DashboardRange>('Últimos 30 días');
  const [isRangeDropdownOpen, setIsRangeDropdownOpen] = useState(false);
  const [hasData] = useState(true);

  const chartData = useMemo(() => activityDataByRange[timeRange], [timeRange]);

  const statCards = [
    {
      title: 'Préstamos activos',
      value: 156,
      trendValue: '+12.4%',
      trendType: 'up' as const,
      chartType: 'bar' as const,
      chartData: [{ value: 10 }, { value: 14 }, { value: 12 }, { value: 18 }, { value: 22 }],
      action: 'loans:filter-active' as const,
    },
    {
      title: 'Productos totales',
      value: 248,
      trendValue: '+8.2%',
      trendType: 'up' as const,
      chartType: 'line' as const,
      chartData: [{ value: 12 }, { value: 14 }, { value: 18 }, { value: 16 }, { value: 22 }],
      action: 'catalog' as const,
    },
    {
      title: 'Préstamos vencidos',
      value: 34,
      trendValue: '-6.1%',
      trendType: 'down' as const,
      chartType: 'bar' as const,
      chartData: [{ value: 28 }, { value: 24 }, { value: 19 }, { value: 18 }, { value: 15 }],
      action: 'loans:filter-overdue' as const,
    },
    {
      title: 'Unidades físicas totales',
      value: 632,
      trendValue: '+4.7%',
      trendType: 'up' as const,
      chartType: 'line' as const,
      chartData: [{ value: 16 }, { value: 18 }, { value: 17 }, { value: 21 }, { value: 24 }],
      action: 'catalog:open-units' as const,
    },
  ];

  const topbarRightContent = (
    <div className="relative mr-4" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsRangeDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
      >
        {timeRange}
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isRangeDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-lg z-50 overflow-hidden">
          {dateRangeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setTimeRange(option);
                setIsRangeDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                timeRange === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const handleQuickAction = (action: string) => {
    const [view, actionName] = action.split(':');
    if (view === 'loans') {
      onViewChange('loans', actionName ?? 'filter-active');
      return;
    }

    if (view === 'catalog') {
      onViewChange('catalog', actionName ?? 'create-product');
      return;
    }

    if (view === 'templates') {
      onViewChange('templates', actionName ?? 'create-template');
      return;
    }

    onViewChange(view);
  };

  return (
    <DashboardLayout
      currentView="dashboard"
      onViewChange={onViewChange}
      topbarProps={{
        title: '¡Bienvenido User123!',
        subtitle: 'Gestiona y monitorea tus préstamos de equipos IT',
        rightContent: topbarRightContent,
      }}
    >
      <div className="flex flex-col gap-6" onClick={() => setIsRangeDropdownOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => handleQuickAction(card.action)}
              className="text-left cursor-pointer hover:-translate-y-0.5 transition-transform duration-150"
            >
              <StatCard
                title={card.title}
                value={card.value}
                trendValue={card.trendValue}
                trendType={card.trendType}
                chartType={card.chartType}
                chartData={card.chartData}
                hasData={hasData}
              />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-900">Acciones Rápidas</h2>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onViewChange('catalog', 'create-product')}
                className="flex-1 bg-[#0a2a5e] text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#133369] transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" /> Nuevo producto
              </button>
              <button
                type="button"
                onClick={() => onViewChange('loans', 'create-loan')}
                className="flex-1 bg-[#0a2a5e] text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#133369] transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" /> Nuevo préstamo
              </button>
              <button
                type="button"
                onClick={() => onViewChange('templates', 'create-template')}
                className="flex-1 bg-[#0a2a5e] text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#133369] transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" /> Nueva plantilla
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 mt-2 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Actividad de Préstamos</h3>

                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setIsRangeDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                  >
                    {timeRange}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {isRangeDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-50 overflow-hidden">
                      {dateRangeOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setTimeRange(option);
                            setIsRangeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                            timeRange === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrestamos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.06} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      dy={10}
                      minTickGap={24}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      domain={[0, 30]}
                      ticks={[0, 5, 10, 15, 20, 25, 30]}
                    />
                    <RechartsTooltip
                      cursor={{ stroke: '#dbeafe', strokeWidth: 1 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const point = payload[0].payload;
                          return (
                            <div className="bg-[#0a2a5e] text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl text-center flex flex-col items-center min-w-[72px] relative">
                              <div className="text-[8px] font-normal opacity-75 uppercase tracking-wider mb-0.5">{point.fullDate}</div>
                              <div className="text-lg leading-tight">{point.displayP}</div>
                              <div className="text-[9px] font-normal opacity-80 leading-tight">Préstamos</div>
                              <div className="w-2 h-2 bg-[#0a2a5e] absolute -bottom-1 rotate-45" />
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="p"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPrestamos)"
                      activeDot={{ r: 6, fill: '#0a2a5e', stroke: 'white', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-span-1 pt-9">
            <RecentActivity
              hasData={hasData}
              activities={mockActivities}
              onViewAction={(view, action) => onViewChange(view, action ?? null)}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-2 relative">
          <h3 className="font-bold text-gray-900 mb-4">Uso por tipo de equipo</h3>
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
              <span className="text-xs font-semibold text-gray-700">En uso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#93c5fd]" />
              <span className="text-xs font-semibold text-gray-700">Disponible</span>
            </div>
          </div>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hasData ? barChartDataFull : barChartDataEmpty} barGap={0} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 30]} ticks={[0, 5, 10, 15, 20, 25, 30]} />
                <RechartsTooltip
                  cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const point = payload[0].payload;
                      return (
                        <div className="bg-white border border-gray-100 p-2 rounded-lg shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] text-center flex flex-col items-center relative">
                          <div className="text-sm font-bold text-gray-900 leading-tight">{point.enUso} {point.name}</div>
                          <div className="text-[10px] text-gray-500 leading-tight">en uso</div>
                          <div className="w-2 h-2 bg-white border-b border-r border-gray-100 absolute -bottom-1.5 rotate-45" />
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="enUso" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={8} />
                <Bar dataKey="disponible" fill="#93c5fd" radius={[2, 2, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
