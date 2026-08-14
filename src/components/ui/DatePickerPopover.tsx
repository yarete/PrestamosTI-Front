import React, { useState, useRef, useEffect } from 'react';
import { DatePicker } from './DatePicker';

interface DatePickerPopoverProps {
  children: React.ReactNode;
  initialDate?: Date | null;
  onApply: (date: Date | null) => void;
  align?: 'left' | 'right';
  position?: 'top' | 'bottom';
  className?: string;
}

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({ 
  children, 
  initialDate,
  onApply,
  align = 'right',
  position = 'bottom',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleApply = (date: Date | null) => {
    onApply(date);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div className={`absolute z-50 ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <DatePicker 
            initialDate={initialDate}
            onApply={handleApply}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
