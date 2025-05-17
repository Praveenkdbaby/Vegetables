import React, { useState } from 'react';
import { Customer } from '../../types';
import { Edit, Trash2, UserPlus, Search } from 'lucide-react';
import { CustomerForm } from './CustomerForm';

interface CustomerListProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export function CustomerList({ 
  customers, 
  onAddCustomer, 
  onUpdateCustomer, 
  onDeleteCustomer 
}: CustomerListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAdd = (customer: Omit<Customer, 'id'>) => {
    onAddCustomer(customer);
    setShowAddForm(false);
  };

  const handleUpdate = (customer: Customer) => {
    onUpdateCustomer(customer);
    setEditingCustomer(null);
  };

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDeleteCustomer(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Customer Directory</h3>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <CustomerForm 
            onSubmit={handleAdd} 
            onCancel={() => setShowAddForm(false)} 
          />
        </div>
      )}
      
      {editingCustomer && (
        <div className="mb-6">
          <CustomerForm 
            initialData={editingCustomer} 
            onSubmit={handleUpdate} 
            onCancel={() => setEditingCustomer(null)} 
          />
        </div>
      )}
      
      {filteredCustomers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.address || '—'}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingCustomer(customer)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit customer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className={`p-1 rounded transition-colors ${
                          confirmDelete === customer.id 
                            ? 'bg-red-100 text-red-600' 
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                        title={confirmDelete === customer.id ? 'Click again to confirm' : 'Delete customer'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'No customers match your search. Try a different term.' 
              : 'No customers added yet.'}
          </p>
          {!showAddForm && !searchTerm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Your First Customer
            </button>
          )}
        </div>
      )}
    </div>
  );
}