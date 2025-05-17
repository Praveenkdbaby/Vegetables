import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Header } from './components/Layout/Header';
import { DashboardView } from './components/Dashboard/DashboardView';
import { SalesView } from './components/Sales/SalesView';
import { CustomersView } from './components/Customers/CustomersView';

function MainApp() {
  const { activeView } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'sales' && <SalesView />}
        {activeView === 'customers' && <CustomersView />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;