import React from 'react';
import { type Icon } from 'react-bootstrap-icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: Icon;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({ 
  icon: Icon, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`relative flex items-center ${containerClassName}`}>
      {Icon && (
        <div className="absolute left-3 text-gray-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        className={`w-full bg-gray-100/80 shadow-[0_4px_14px_0_rgb(0,0,0,0.05)] border-none rounded-md py-2 text-sm focus:ring-2 focus:ring-[#0a2a5e] focus:bg-white transition-colors outline-none text-gray-700 placeholder-gray-500
          ${Icon ? 'pl-9 pr-3' : 'px-3'} 
          ${className}`}
        {...props}
      />
    </div>
  );
};
