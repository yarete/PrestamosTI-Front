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
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePopoverPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const popoverWidth = 260;
    const popoverHeight = 320;
    const gap = 8;

    const left = align === 'right'
      ? Math.min(window.innerWidth - popoverWidth - 12, rect.right - popoverWidth)
      : Math.max(12, rect.left);

    const top = position === 'top'
      ? Math.max(12, rect.top - popoverHeight - gap)
      : Math.min(window.innerHeight - popoverHeight - 12, rect.bottom + gap);

    setPopoverStyle({
      position: 'fixed',
      top,
      left,
      zIndex: 200,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      const frame = requestAnimationFrame(updatePopoverPosition);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        cancelAnimationFrame(frame);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return undefined;
  }, [isOpen, align, position]);

  const handleApply = (date: Date | null) => {
    onApply(date);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);

    if (next) {
      requestAnimationFrame(updatePopoverPosition);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div ref={triggerRef} onClick={toggleOpen} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div style={popoverStyle}>
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
