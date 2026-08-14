import React, { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
  currentView: string;
  onViewChange: (v: string) => void;
  topbarProps?: {
    title?: string;
    subtitle?: string;
    rightContent?: ReactNode;
  };
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentView, onViewChange, topbarProps }) => {
  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar {...topbarProps} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
