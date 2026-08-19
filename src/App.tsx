import { useState } from 'react';
import { LoansPage } from './pages/LoansPage';
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const handleViewChange = (nextView: string, action?: string | null) => {
    setCurrentView(nextView);
    setPendingAction(action ?? null);
  };

  const consumePendingAction = () => setPendingAction(null);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {currentView === 'dashboard' && (
          <DashboardPage onViewChange={handleViewChange} />
        )}
        {currentView === 'loans' && (
          <LoansPage
            onViewChange={handleViewChange}
            initialAction={pendingAction}
            onActionConsumed={consumePendingAction}
          />
        )}
        {currentView === 'catalog' && (
          <CatalogPage
            onViewChange={handleViewChange}
            initialAction={pendingAction}
            onActionConsumed={consumePendingAction}
          />
        )}
        {currentView === 'templates' && (
          <TemplatesPage
            onViewChange={handleViewChange}
            initialAction={pendingAction}
            onActionConsumed={consumePendingAction}
          />
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
