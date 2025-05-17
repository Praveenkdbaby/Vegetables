import React, { useState, useMemo } from 'react';
import { SaleRecord, Customer } from '../../types';
import { Edit, Trash2, FileText, Search, PlusSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { SaleForm } from './SaleForm';

interface SalesListProps {
  salesRecords: SaleRecord[];
  customers: Customer[];
  onAddSale: (sale: Omit<SaleRecord, 'id'>) => void;
  onUpdateSale: (sale: SaleRecord) => void;
  onDeleteSale: (id: string) => void;
}

export function SalesList({ 
  salesRecords, 
  customers, 
  onAddSale, 
  onUpdateSale, 
  onDeleteSale 
}: SalesListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSale, setEditingSale] = useState<SaleRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedSale, setExpandedSale] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'date' | 'customer' | 'totalAmount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAdd = (sale: Omit<SaleRecord, 'id'>) => {
    onAddSale(sale);
    setShowAddForm(false);
  };

  const handleUpdate = (sale: SaleRecord) => {
    onUpdateSale(sale);
    setEditingSale(null);
  };

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDeleteSale(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const toggleSort = (field: 'date' | 'customer' | 'totalAmount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSale(expandedSale === id ? null : id);
  };

  const filteredSales = useMemo(() => {
    return salesRecords.filter(sale => {
      // Filter by search term
      const matchesSearch = 
        sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.items.some(item => item.vegetableName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by date
      const matchesDate = dateFilter ? sale.date === dateFilter : true;
      
      return matchesSearch && matchesDate;
    });
  }, [salesRecords, searchTerm, dateFilter]);

  const sortedSales = useMemo(() => {
    return [...filteredSales].sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'customer') {
        return sortDirection === 'asc' 
          ? a.customer.name.localeCompare(b.customer.name)
          : b.customer.name.localeCompare(a.customer.name);
      } else {
        return sortDirection === 'asc' 
          ? a.totalAmount - b.totalAmount
          : b.totalAmount - a.totalAmount;
      }
    });
  }, [filteredSales, sortField, sortDirection]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Sales Records</h3>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
          >
            <PlusSquare className="h-4 w-4" />
            <span>New Sale</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <SaleForm 
            customers={customers}
            onSubmit={handleAdd} 
            onCancel={() => setShowAddForm(false)} 
          />
        </div>
      )}
      
      {editingSale && (
        <div className="mb-6">
          <SaleForm 
            customers={customers}
            initialData={editingSale} 
            onSubmit={handleUpdate} 
            onCancel={() => setEditingSale(null)} 
          />
        </div>
      )}
      
      {sortedSales.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('customer')}
                >
                  <div className="flex items-center gap-1">
                    <span>Customer</span>
                    {sortField === 'customer' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('totalAmount')}
                >
                  <div className="flex items-center gap-1">
                    <span>Total</span>
                    {sortField === 'totalAmount' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedSales.map(sale => (
                <React.Fragment key={sale.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="pl-4 py-3 text-center">
                      <button 
                        onClick={() => toggleExpand(sale.id)}
                        className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                      >
                        {expandedSale === sale.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{sale.customer.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{sale.items.length} items</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{sale.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingSale(sale)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit sale"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sale.id)}
                          className={`p-1 rounded transition-colors ${
                            confirmDelete === sale.id 
                              ? 'bg-red-100 text-red-600' 
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                          title={confirmDelete === sale.id ? 'Click again to confirm' : 'Delete sale'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedSale === sale.id && (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 bg-gray-50">
                        <div className="py-2">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Sale Details</span>
                          </h4>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="py-2 font-medium text-gray-500 text-left">Vegetable</th>
                                <th className="py-2 font-medium text-gray-500 text-right">Weight</th>
                                <th className="py-2 font-medium text-gray-500 text-right">Price/kg</th>
                                <th className="py-2 font-medium text-gray-500 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sale.items.map(item => (
                                <tr key={item.id} className="border-b border-gray-100">
                                  <td className="py-2 text-gray-900">{item.vegetableName}</td>
                                  <td className="py-2 text-gray-700 text-right">{item.weight.toFixed(2)} kg</td>
                                  <td className="py-2 text-gray-700 text-right">₹{item.pricePerUnit.toFixed(2)}</td>
                                  <td className="py-2 text-gray-900 font-medium text-right">₹{item.totalPrice.toFixed(2)}</td>
                                </tr>
                              ))}
                              <tr className="font-medium">
                                <td colSpan={3} className="py-2 text-right text-gray-700">Total:</td>
                                <td className="py-2 text-right text-gray-900">₹{sale.totalAmount.toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                          
                          <div className="mt-3 text-sm text-gray-500">
                            <div><strong>Customer:</strong> {sale.customer.name}</div>
                            <div><strong>Phone:</strong> {sale.customer.phone}</div>
                            {sale.customer.address && <div><strong>Address:</strong> {sale.customer.address}</div>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            {searchTerm || dateFilter 
              ? 'No sales records match your search criteria.' 
              : 'No sales records added yet.'}
          </p>
          {!showAddForm && !searchTerm && !dateFilter && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Your First Sale
            </button>
          )}
        </div>
      )}
    </div>
  );
}