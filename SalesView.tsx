import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { SalesList } from './SalesList';

export function SalesView() {
  const { 
    salesRecords, 
    customers, 
    addSaleRecord, 
    updateSaleRecord, 
    deleteSaleRecord 
  } = useAppContext();
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales</h2>
      <SalesList 
        salesRecords={salesRecords}
        customers={customers}
        onAddSale={addSaleRecord}
        onUpdateSale={updateSaleRecord}
        onDeleteSale={deleteSaleRecord}
      />
    </div>
  );
}