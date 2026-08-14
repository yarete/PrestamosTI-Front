import { useState } from 'react';
import { LoansPage } from './pages/LoansPage';
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  const [currentView, setCurrentView] = useState('catalog');

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {currentView === 'dashboard' && <DashboardPage onViewChange={setCurrentView} />}
        {currentView === 'loans' && <LoansPage onViewChange={setCurrentView} />}
        {currentView === 'catalog' && <CatalogPage onViewChange={setCurrentView} />}
      </div>
    </ToastProvider>
  );
}

export default App;
