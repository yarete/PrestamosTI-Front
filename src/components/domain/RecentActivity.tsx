import React from 'react';
import { BellSlash, PersonFill } from 'react-bootstrap-icons';

interface ActivityItem {
  id: string;
  action: string;
  date: string;
}

interface RecentActivityProps {
  hasData?: boolean;
  activities?: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  hasData = false,
  activities = []
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Actividad Reciente</h2>
        <button className="text-sm text-blue-500 font-medium hover:text-blue-700 flex items-center gap-1">
          Ver todos <span className="text-lg leading-none">→</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        {!hasData || activities.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <BellSlash className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-sm font-medium">No se han registrado actividades recientes.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activities.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 -mx-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0a2a5e] flex items-center justify-center text-white">
                    <PersonFill className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{item.action}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-500 font-medium">{item.date}</span>
                  <button className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full hover:bg-blue-600 transition-colors shadow-sm active:scale-95">
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
