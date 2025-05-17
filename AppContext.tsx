import React, { createContext, useContext, useState } from 'react';
import { Customer, SaleRecord, VegetableSaleItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  customers: Customer[];
  salesRecords: SaleRecord[];
  addCustomer: (customer: Omit<Customer, 'id'>) => string;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addSaleRecord: (sale: Omit<SaleRecord, 'id'>) => void;
  updateSaleRecord: (sale: SaleRecord) => void;
  deleteSaleRecord: (id: string) => void;
  addSaleItem: (saleId: string, item: Omit<VegetableSaleItem, 'id'>) => void;
  updateSaleItem: (saleId: string, item: VegetableSaleItem) => void;
  deleteSaleItem: (saleId: string, itemId: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  activeView: 'dashboard' | 'sales' | 'customers';
  setActiveView: (view: 'dashboard' | 'sales' | 'customers') => void;
}

const defaultCustomers: Customer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '9876543210',
    address: 'Market Area, Delhi'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '8765432109',
    address: 'Gandhi Road, Mumbai'
  },
  {
    id: '3',
    name: 'Amit Patel',
    phone: '7654321098',
    address: 'Vegetable Market, Ahmedabad'
  },
  {
    id: '4',
    name: 'Sunita Verma',
    phone: '6543210987',
    address: 'Main Bazaar, Jaipur'
  },
  {
    id: '5',
    name: 'Mohammed Khan',
    phone: '5432109876',
    address: 'Wholesale Market, Lucknow'
  },
  {
    id: '6',
    name: 'Lakshmi Rao',
    phone: '4321098765',
    address: 'Market Complex, Bangalore'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', defaultCustomers);
  const [salesRecords, setSalesRecords] = useLocalStorage<SaleRecord[]>('salesRecords', []);
  const [activeView, setActiveView] = useState<'dashboard' | 'sales' | 'customers'>('dashboard');

  // Customer operations
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: uuidv4() };
    setCustomers([...customers, newCustomer]);
    return newCustomer.id;
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(customers.map(c => c.id === customer.id ? customer : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const getCustomerById = (id: string) => {
    return customers.find(c => c.id === id);
  };

  // Sale record operations
  const addSaleRecord = (sale: Omit<SaleRecord, 'id'>) => {
    const newSale = { ...sale, id: uuidv4() };
    setSalesRecords([...salesRecords, newSale]);
  };

  const updateSaleRecord = (sale: SaleRecord) => {
    setSalesRecords(salesRecords.map(s => s.id === sale.id ? sale : s));
  };

  const deleteSaleRecord = (id: string) => {
    setSalesRecords(salesRecords.filter(s => s.id !== id));
  };

  // Sale item operations
  const addSaleItem = (saleId: string, item: Omit<VegetableSaleItem, 'id'>) => {
    const newItem = { ...item, id: uuidv4(), totalPrice: item.weight * item.pricePerUnit };
    
    setSalesRecords(salesRecords.map(sale => {
      if (sale.id === saleId) {
        const updatedItems = [...sale.items, newItem];
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        return { ...sale, items: updatedItems, totalAmount };
      }
      return sale;
    }));
  };

  const updateSaleItem = (saleId: string, item: VegetableSaleItem) => {
    // Ensure total price is calculated correctly
    const updatedItem = {
      ...item,
      totalPrice: item.weight * item.pricePerUnit
    };
    
    setSalesRecords(salesRecords.map(sale => {
      if (sale.id === saleId) {
        const updatedItems = sale.items.map(i => i.id === item.id ? updatedItem : i);
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        return { ...sale, items: updatedItems, totalAmount };
      }
      return sale;
    }));
  };

  const deleteSaleItem = (saleId: string, itemId: string) => {
    setSalesRecords(salesRecords.map(sale => {
      if (sale.id === saleId) {
        const updatedItems = sale.items.filter(i => i.id !== itemId);
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        return { ...sale, items: updatedItems, totalAmount };
      }
      return sale;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        customers,
        salesRecords,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addSaleRecord,
        updateSaleRecord,
        deleteSaleRecord,
        addSaleItem,
        updateSaleItem,
        deleteSaleItem,
        getCustomerById,
        activeView,
        setActiveView
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}