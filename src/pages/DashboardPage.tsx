import React, { useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ChevronDown, Plus } from 'react-bootstrap-icons';
import { StatCard } from '../components/ui/StatCard';
import { RecentActivity } from '../components/domain/RecentActivity';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, Tooltip as RechartsTooltip
} from 'recharts';

interface DashboardPageProps {
  onViewChange: (v: string) => void;
}

// Data ranges with high granularity (daily)
const generateData = (days: number, values: number[]) => {
  const data = [];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const daysPerVal = days / (values.length - 1);
  
  for (let i = 0; i < days; i++) {
    const segment = Math.floor(i / daysPerVal);
    const startVal = values[segment];
    const endVal = values[Math.min(segment + 1, values.length - 1)];
    
    // Smooth interpolation (no rounding to keep the curve perfectly smooth!)
    const t = (i % daysPerVal) / daysPerVal;
    const smoothT = (1 - Math.cos(t * Math.PI)) / 2;
    const val = startVal + (endVal - startVal) * smoothT;
    
    // Date calculation
    const date = new Date(2024, 0, i + 1);
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    data.push({
      id: i,
      name: `${day} ${month}`,
      monthName: month,
      fullDate: `${day} ${month.toUpperCase()}`,
      p: val,
      displayP: Math.round(val) // Use this for the tooltip text
    });
  }
  return data;
};

const areaDataAnual = generateData(365, [10, 14, 15, 18, 14, 19, 12, 14, 22, 9, 16, 25]);
const areaData6Meses = generateData(180, [15, 18, 14, 20, 24, 19]);
const areaDataMes = generateData(30, [2, 8, 14, 10, 18, 22, 15]);
const areaDataSemana = generateData(7, [5, 12, 8, 15, 20, 18, 22]);
const areaDataEmpty = generateData(365, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

const barChartDataEmpty = Array.from({ length: 20 }).map(() => ({ name: `Laptops`, enUso: 0, disponible: 0 }));
const barChartDataFull = Array.from({ length: 20 }).map(() => ({ name: `Laptops`, enUso: 20, disponible: 15 }));

const mockActivities = [
  { id: '1', action: 'Usuario creado', date: '02 may' },
  { id: '2', action: 'Usuario creado', date: '02 may' },
  { id: '3', action: 'Usuario creado', date: '02 may' },
  { id: '4', action: 'Usuario creado', date: '02 may' },
  { id: '5', action: 'Usuario creado', date: '02 may' },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onViewChange }) => {
  const [hasData, setHasData] = useState(true);
  const [timeRange, setTimeRange] = useState('Este año');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Custom click tooltips removed since they are unused

  const getChartData = () => {
    if (!hasData) return areaDataEmpty;
    switch (timeRange) {
      case 'Esta semana': return areaDataSemana;
      case 'Este mes': return areaDataMes;
      case 'Últimos 6 meses': return areaData6Meses;
      case 'Este año': return areaDataAnual;
      default: return areaDataAnual;
    }
  };

  const topbarRightContent = (
    <div className="flex items-center gap-4 mr-4">
      <button 
        onClick={() => setHasData(!hasData)} 
        className="px-3 py-1 bg-gray-100 text-xs font-bold rounded hover:bg-gray-200 cursor-pointer"
      >
        Toggle Data
      </button>
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 bg-white">
        Últimos 30 días
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      currentView="dashboard" 
      onViewChange={onViewChange}
      topbarProps={{
        title: "¡Bienvenido User123!",
        subtitle: "Gestiona y monitorea tus préstamos de equipos IT",
        rightContent: topbarRightContent
      }}
    >
      <div className="flex flex-col gap-6" onClick={() => { setIsDropdownOpen(false); }}>
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Préstamos activos" value={156} trendValue="+12%" trendType="up" chartType="bar" hasData={hasData} chartData={[{value:10},{value:15},{value:8},{value:20},{value:25}]} />
          <StatCard title="Solicitudes pendientes" value={156} trendValue="+12%" trendType="up" chartType="bar" hasData={hasData} chartData={[{value:5},{value:15},{value:10},{value:18},{value:20}]} />
          <StatCard title="Solicitudes pendientes" value={156} trendValue="-12%" trendType="down" chartType="line" hasData={hasData} chartData={[{value:25},{value:20},{value:22},{value:15},{value:10}]} />
          <StatCard title="Solicitudes pendientes" value={156} trendValue="+0%" trendType="neutral" chartType="line" hasData={hasData} chartData={[{value:10},{value:15},{value:12},{value:18},{value:20}]} />
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-900">Acciones Rápidas</h2>
            <div className="flex gap-4">
              <button className="flex-1 bg-[#0a2a5e] text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#133369] transition-colors cursor-pointer">
                <Plus className="w-5 h-5" /> Nuevo Equipo
              </button>
              <button className="flex-1 bg-[#0a2a5e] text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#133369] transition-colors cursor-pointer">
                <Plus className="w-5 h-5" /> Nuevo préstamo
              </button>
              <button className="flex-1 bg-[#0a2a5e] text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#133369] transition-colors cursor-pointer">
                <Plus className="w-5 h-5" /> Generar Reporte
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 mt-2 relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Actividad de Préstamos</h3>
                
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                  >
                    {timeRange}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 shadow-lg rounded-md z-50 overflow-hidden">
                      {['Esta semana', 'Este mes', 'Últimos 6 meses', 'Este año'].map(opt => (
                        <button 
                          key={opt}
                          onClick={() => { setTimeRange(opt); setIsDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-64 w-full relative">
                
                {/* Removed custom click HTML in favor of Recharts standard tooltip */}

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={getChartData()} 
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPrestamos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#9ca3af'}} 
                      dy={10}
                      minTickGap={30}
                      tickFormatter={(val) => {
                        // Extract month name for annual/6months, or keep day for week/month
                        if (timeRange === 'Este año' || timeRange === 'Últimos 6 meses') {
                          return val.split(' ')[1];
                        }
                        return val;
                      }}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]} />
                    
                    {hasData && (
                      <RechartsTooltip 
                        cursor={{ stroke: '#f3f4f6', strokeWidth: 1 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-[#0a2a5e] text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl text-center flex flex-col items-center min-w-[70px]">
                                <div className="text-[8px] font-normal opacity-75 uppercase tracking-wider mb-0.5">{payload[0].payload.fullDate}</div>
                                <div className="text-lg leading-tight">{payload[0].payload.displayP}</div>
                                <div className="text-[9px] font-normal opacity-80 leading-tight">Préstamos</div>
                                {/* Triangle Pointer */}
                                <div className="w-2 h-2 bg-[#0a2a5e] absolute -bottom-1 rotate-45"></div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    )}
                    
                    <Area 
                      type="monotone" 
                      dataKey="p" 
                      stroke={hasData ? "#3b82f6" : "#f3f4f6"} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPrestamos)" 
                      activeDot={hasData ? { r: 6, fill: '#0a2a5e', stroke: 'white', strokeWidth: 2 } : false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-span-1 pt-9">
            <RecentActivity hasData={hasData} activities={mockActivities} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-2 relative">
          <h3 className="font-bold text-gray-900 mb-4">Uso por tipo de equipo</h3>
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
              <span className="text-xs font-semibold text-gray-700">En uso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#93c5fd]"></div>
              <span className="text-xs font-semibold text-gray-700">Disponible</span>
            </div>
          </div>
          <div className="h-48 w-full relative">

            {/* Removed custom click HTML */}

            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={hasData ? barChartDataFull : barChartDataEmpty} 
                barGap={0} 
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]} />
                
                {hasData && (
                  <RechartsTooltip 
                    cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-gray-100 p-2 rounded-lg shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] text-center flex flex-col items-center">
                            <div className="text-sm font-bold text-gray-900 leading-tight">{payload[0].payload.enUso} {payload[0].payload.name}</div>
                            <div className="text-[10px] text-gray-500 leading-tight">en uso</div>
                            {/* Triangle Pointer */}
                            <div className="w-2 h-2 bg-white border-b border-r border-gray-100 absolute -bottom-1.5 rotate-45 shadow-[2px_2px_2px_0_rgb(0,0,0,0.02)]"></div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                )}
                
                <Bar dataKey="enUso" fill={hasData ? "#3b82f6" : "#f3f4f6"} radius={[2, 2, 0, 0]} barSize={8} />
                <Bar dataKey="disponible" fill={hasData ? "#93c5fd" : "#f3f4f6"} radius={[2, 2, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
