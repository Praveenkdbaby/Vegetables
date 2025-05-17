import React from 'react';
import { Leaf } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function Header() {
  const { activeView, setActiveView } = useAppContext();

  return (
    <header className="bg-green-400 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Leaf className="h-8 w-8 text-green-800 mr-2" />
            <h1 className="text-2xl font-bold text-green-900">FreshTrack</h1>
          </div>
          
          <nav className="flex space-x-1 bg-white/20 p-1 rounded-full backdrop-blur-sm">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeView === 'dashboard' 
                  ? 'bg-white text-green-800 shadow-sm' 
                  : 'text-green-900 hover:bg-white/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('sales')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeView === 'sales' 
                  ? 'bg-white text-green-800 shadow-sm' 
                  : 'text-green-900 hover:bg-white/50'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setActiveView('customers')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeView === 'customers' 
                  ? 'bg-white text-green-800 shadow-sm' 
                  : 'text-green-900 hover:bg-white/50'
              }`}
            >
              Customers
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}