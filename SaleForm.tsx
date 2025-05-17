import React, { useState, useEffect } from 'react';
import { Customer, SaleRecord, VegetableSaleItem } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id'> | Customer) => void;
  onCancel: () => void;
  initialData?: Customer;
}

const defaultItem: Omit<VegetableSaleItem, 'id'> = {
  vegetableName: '',
  weight: 1,
  pricePerUnit: 0,
  totalPrice: 0
};

export function CustomerForm({ onSubmit, onCancel, initialData }: CustomerFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<VegetableSaleItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setCustomerId(initialData.customerId);
      setItems(initialData.items);
      setTotalAmount(initialData.totalAmount);
    } else if (items.length === 0) {
      handleAddItem();
    }
  }, [initialData]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  }, [items]);

  const handleAddItem = () => {
    const newItem: VegetableSaleItem = {
      ...defaultItem,
      id: uuidv4(),
      totalPrice: 0
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    const newItemErrors = { ...itemErrors };
    delete newItemErrors[id];
    setItemErrors(newItemErrors);
  };

  const handleItemChange = (id: string, field: keyof VegetableSaleItem, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'weight' || field === 'pricePerUnit') {
          updatedItem.totalPrice = Number(updatedItem.weight) * Number(updatedItem.pricePerUnit);
        }
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
    validateItem(id, updatedItems.find(item => item.id === id)!);
  };

  const validateItem = (id: string, item: VegetableSaleItem) => {
    const errors: Record<string, string> = {};
    
    if (!item.vegetableName.trim()) {
      errors.vegetableName = 'Vegetable name is required';
    }
    
    if (item.weight <= 0) {
      errors.weight = 'Weight must be greater than 0';
    }
    
    if (item.pricePerUnit <= 0) {
      errors.pricePerUnit = 'Price must be greater than 0';
    }
    
    setItemErrors(prev => ({
      ...prev,
      [id]: errors
    }));
    
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const formErrors: Record<string, string> = {};
    
    if (!date) {
      formErrors.date = 'Date is required';
    }
    
    if (!customerId) {
      formErrors.customerId = 'Please select a customer';
    }
    
    if (items.length === 0) {
      formErrors.items = 'At least one item is required';
    }
    
    setErrors(formErrors);
    
    let allItemsValid = true;
    const newItemErrors: Record<string, Record<string, string>> = {};
    
    items.forEach(item => {
      const itemValid = validateItem(item.id, item);
      if (!itemValid) {
        allItemsValid = false;
        newItemErrors[item.id] = itemErrors[item.id] || {};
      }
    });
    
    setItemErrors(newItemErrors);
    
    return Object.keys(formErrors).length === 0 && allItemsValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (!selectedCustomer) return;
    
    const saleData: Omit<SaleRecord, 'id'> = {
      date,
      customerId,
      customer: selectedCustomer,
      items,
      totalAmount
    };
    
    onSubmit(saleData);
  };

  const hasItemErrors = (id: string) => {
    return itemErrors[id] && Object.keys(itemErrors[id]).length > 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {initialData ? 'Edit Sale Record' : 'New Sale Record'}
        </h3>
        <button 
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date*
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>
          
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
              Customer*
            </label>
            <select
              id="customer"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                errors.customerId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.phone})
                </option>
              ))}
            </select>
            {errors.customerId && <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-700">Items*</h4>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>
          
          {errors.items && <p className="text-red-500 text-xs mb-2">{errors.items}</p>}
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={`p-4 border rounded-lg transition-all ${
                  hasItemErrors(item.id) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between mb-2">
                  <h5 className="font-medium text-gray-700">Item {index + 1}</h5>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label htmlFor={`vegetable-${item.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                      Vegetable*
                    </label>
                    <input
                      type="text"
                      id={`vegetable-${item.id}`}
                      value={item.vegetableName}
                      onChange={(e) => handleItemChange(item.id, 'vegetableName', e.target.value)}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                        itemErrors[item.id]?.vegetableName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter vegetable name"
                    />
                    {itemErrors[item.id]?.vegetableName && (
                      <p className="text-red-500 text-xs mt-1">{itemErrors[item.id].vegetableName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor={`weight-${item.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                      Weight (kg)*
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id={`weight-${item.id}`}
                        value={item.weight}
                        onChange={(e) => handleItemChange(item.id, 'weight', parseFloat(e.target.value) || 0)}
                        min="0.01"
                        step="0.01"
                        className={`w-full p-2 pr-8 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                          itemErrors[item.id]?.weight ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter weight"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">kg</span>
                    </div>
                    {itemErrors[item.id]?.weight && (
                      <p className="text-red-500 text-xs mt-1">{itemErrors[item.id].weight}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor={`price-${item.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                      Price/kg (₹)*
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        id={`price-${item.id}`}
                        value={item.pricePerUnit}
                        onChange={(e) => handleItemChange(item.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                        min="0.01"
                        step="0.01"
                        className={`w-full p-2 pl-7 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                          itemErrors[item.id]?.pricePerUnit ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter price per kg"
                      />
                    </div>
                    {itemErrors[item.id]?.pricePerUnit && (
                      <p className="text-red-500 text-xs mt-1">{itemErrors[item.id].pricePerUnit}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Total (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="text"
                        value={item.totalPrice.toFixed(2)}
                        readOnly
                        className="w-full p-2 pl-7 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg mb-6">
          <span className="font-medium text-gray-700">Total Amount:</span>
          <span className="text-xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {initialData ? 'Update Sale' : 'Save Sale'}
          </button>
        </div>
      </form>
    </div>
  );
}