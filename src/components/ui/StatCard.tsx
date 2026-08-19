import React from 'react';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer } from 'recharts';

export type TrendType = 'up' | 'down' | 'neutral';
export type ChartType = 'bar' | 'line';

interface StatCardProps {
  title: string;
  value: number;
  trendValue?: string;
  trendType?: TrendType;
  chartType?: ChartType;
  chartData?: any[];
  hasData?: boolean;
}

const emptyData = [
  { value: 10 }, { value: 10 }, { value: 10 }, { value: 10 }, { value: 10 }
];

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  trendValue = "Sin cambios", 
  trendType = "neutral",
  chartType = "bar",
  chartData = emptyData,
  hasData = false
}) => {
  const getTrendColor = () => {
    if (!hasData) return 'text-gray-400';
    if (trendType === 'up') return 'text-blue-600';
    if (trendType === 'down') return 'text-rose-500';
    return 'text-gray-400';
  };

  const getChartColor = () => {
    if (!hasData) return '#e5e7eb';
    if (trendType === 'down') return '#fb7185';
    if (trendType === 'up' && chartType === 'line') return '#60a5fa';
    return '#60a5fa';
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-end">
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 leading-tight mb-1">{hasData ? value : 0}</p>
        <p className={`text-xs font-semibold ${getTrendColor()}`}>
          {hasData ? trendValue : "Sin cambios"}
        </p>
      </div>

      <div className="w-20 h-10">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={hasData ? chartData : emptyData}>
              <Bar dataKey="value" fill={getChartColor()} radius={[2, 2, 0, 0]} barSize={4} />
            </BarChart>
          ) : (
            <LineChart data={hasData ? chartData : emptyData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={getChartColor()} 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
