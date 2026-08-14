import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar3 } from 'react-bootstrap-icons';
import { getMonthMatrix, formatDate, isSameDay } from '../../utils/date';

interface DatePickerProps {
  initialDate?: Date | null;
  onApply: (date: Date | null) => void;
  onCancel: () => void;
}

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const DatePicker: React.FC<DatePickerProps> = ({ initialDate, onApply, onCancel }) => {
  const [currentMonth, setCurrentMonth] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const matrix = getMonthMatrix(currentMonth.getFullYear(), currentMonth.getMonth());
  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-3 w-[260px] animate-in zoom-in-95 duration-200">
      {/* Header Input */}
      <div className="flex items-center mb-3">
        <div className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 border border-gray-200 rounded-md bg-gray-50/50">
          <Calendar3 className="text-[#0a2a5e] w-3 h-3" />
          <span className="text-xs text-[#0a2a5e] font-bold tracking-wide">
            {formatDate(selectedDate) || <span className="text-gray-400 font-medium">Seleccionar</span>}
          </span>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-3 px-1">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="font-bold text-xs text-gray-800">{monthName}</span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-1.5">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-[9px] font-bold text-gray-400 tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-0.5 gap-x-0.5 mb-3">
        {matrix.map((date, i) => {
          if (!date) return <div key={i} className="h-6" />;
          
          const isSelected = isSameDay(date, selectedDate);

          return (
            <div key={i} className="h-6 relative flex items-center justify-center">
              <button
                onClick={() => handleDateClick(date)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors
                  ${isSelected 
                    ? 'bg-[#0a2a5e] text-white font-bold shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-200 font-medium'
                  }
                `}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <button onClick={onCancel} className="px-3 py-1 text-[11px] font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button onClick={() => onApply(selectedDate)} className="px-3 py-1 text-[11px] font-medium text-white bg-[#0a2a5e] rounded-md hover:bg-[#133369] transition-colors">
          Aplicar
        </button>
      </div>
    </div>
  );
};
