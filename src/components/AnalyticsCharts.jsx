import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS } from '../utils/categoryMap';

const AnalyticsCharts = ({ transactions }) => {
  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Aggregate monthly data for Bar Chart
  const monthlyData = useMemo(() => {
    const totals = {};
    transactions.forEach(t => {
      const month = t.date ? t.date.substring(0, 7) : 'Unknown';
      if (!totals[month]) totals[month] = { name: month, Income: 0, Expense: 0 };
      if (t.type === 'income') totals[month].Income += t.amount;
      if (t.type === 'expense') totals[month].Expense += t.amount;
    });
    // Return last 6 months sorted chronologically
    return Object.values(totals).sort((a, b) => a.name.localeCompare(b.name)).slice(-6);
  }, [transactions]);

  const tooltipStyle = { backgroundColor: 'rgba(2, 2, 4, 0.95)', border: '1px solid #00e5ff', borderRadius: '8px', color: '#fff' };

  return (
    <div className="analytics-grid">
      <div className="cyber-card">
        <h3 className="card-title">Expense Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          {expensesByCategory.length > 0 ? (
            <PieChart>
              <Pie data={expensesByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" stroke="none">
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#bd00ff'} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} formatter={(value) => `₹ ${value}`} />
            </PieChart>
          ) : <p className="empty-state">No expenses found.</p>}
        </ResponsiveContainer>
      </div>

      <div className="cyber-card">
        <h3 className="card-title">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          {monthlyData.length > 0 ? (
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#a0a0a0" fontSize={12} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={tooltipStyle} />
              <Bar dataKey="Income" fill="#00e5ff" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Expense" fill="#bd00ff" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          ) : <p className="empty-state">No data available.</p>}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCharts;