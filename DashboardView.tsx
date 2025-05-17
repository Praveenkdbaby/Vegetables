import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { BarChart, TrendingUp, Users } from 'lucide-react';

export function DashboardView() {
  const { salesRecords, customers } = useAppContext();

  // Calculate today's sales
  const today = new Date().toISOString().split('T')[0];
  const todaySales = useMemo(() => {
    return salesRecords.filter(sale => sale.date === today);
  }, [salesRecords]);

  // Calculate total sales amount for today
  const todayTotalAmount = useMemo(() => {
    return todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  }, [todaySales]);

  // Find most sold vegetable today
  const mostSoldVegetable = useMemo(() => {
    const vegetableCounts: Record<string, { count: number; weight: number }> = {};
    
    todaySales.forEach(sale => {
      sale.items.forEach(item => {
        if (!vegetableCounts[item.vegetableName]) {
          vegetableCounts[item.vegetableName] = { count: 0, weight: 0 };
        }
        vegetableCounts[item.vegetableName].count += 1;
        vegetableCounts[item.vegetableName].weight += item.weight;
      });
    });
    
    let mostSold = { name: 'None', count: 0, weight: 0 };
    
    Object.entries(vegetableCounts).forEach(([name, { count, weight }]) => {
      if (count > mostSold.count) {
        mostSold = { name, count, weight };
      }
    });
    
    return mostSold;
  }, [todaySales]);

  // Get recent sales
  const recentSales = useMemo(() => {
    return [...salesRecords]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [salesRecords]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Today's Sales</h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <BarChart className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">₹{todayTotalAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">{todaySales.length} transactions today</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Most Sold Today</h3>
            <div className="bg-amber-100 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{mostSoldVegetable.name}</p>
          <p className="text-sm text-gray-500 mt-2">
            {mostSoldVegetable.weight.toFixed(2)} kg ({mostSoldVegetable.count} sales)
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Customers</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{customers.length}</p>
          <p className="text-sm text-gray-500 mt-2">
            {todaySales.length > 0 ? `${new Set(todaySales.map(s => s.customerId)).size} customers today` : 'No customers today'}
          </p>
        </div>
      </div>
      
      {/* Recent Sales */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-semibold mb-4">Recent Sales</h3>
        
        {recentSales.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{sale.customer.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{sale.items.length} items</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{sale.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 py-4 text-center">No sales records yet.</p>
        )}
      </div>
    </div>
  );
}