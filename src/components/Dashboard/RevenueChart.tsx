import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export const RevenueChart: React.FC = () => {
  // Mock data for revenue chart
  const monthlyData = [
    { month: 'Eki 2023', revenue: 24000, expenses: 18000 },
    { month: 'Kas 2023', revenue: 28000, expenses: 19500 },
    { month: 'Ara 2023', revenue: 32000, expenses: 21000 },
    { month: 'Oca 2024', revenue: 29000, expenses: 22000 },
    { month: 'Şub 2024', revenue: 35000, expenses: 24000 },
    { month: 'Mar 2024', revenue: 31000, expenses: 26700 }
  ];

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.expenses)));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Gelir & Gider Trendi</h3>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12.5%</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-end justify-between h-64 mb-4">
          {monthlyData.map((data, index) => {
            const revenueHeight = (data.revenue / maxValue) * 200;
            const expenseHeight = (data.expenses / maxValue) * 200;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex items-end mb-2" style={{ height: 200 }}>
                  <div className="flex items-end space-x-1">
                    <div 
                      className="bg-blue-500 rounded-t-md min-w-[16px]"
                      style={{ height: revenueHeight }}
                      title={`Gelir: ${data.revenue.toLocaleString('tr-TR')} ₺`}
                    />
                    <div 
                      className="bg-red-400 rounded-t-md min-w-[16px]"
                      style={{ height: expenseHeight }}
                      title={`Gider: ${data.expenses.toLocaleString('tr-TR')} ₺`}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-600 text-center">{data.month}</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Gelir</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Gider</span>
          </div>
        </div>
      </div>
    </div>
  );
};