import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { CustomerList } from './CustomerList';

export function CustomersView() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppContext();
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customers</h2>
      <CustomerList 
        customers={customers}
        onAddCustomer={addCustomer}
        onUpdateCustomer={updateCustomer}
        onDeleteCustomer={deleteCustomer}
      />
    </div>
  );
}