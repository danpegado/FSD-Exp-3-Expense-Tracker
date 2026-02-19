import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TransactionCharts = ({ income, expense, transactions }) => {
  // Pie Chart Data
  const pieData = [
    { name: 'Income', value: income > 0 ? income : 0.1 }, 
    { name: 'Expense', value: expense > 0 ? expense : 0.1 }
  ];
  const COLORS = ['#00e5ff', '#bd00ff'];

  // Bar Chart Data (Process last 5 transactions for comparison)
  const recentTransactions = transactions.slice(0, 5).reverse().map(t => ({
    name: t.description.substring(0, 8) + (t.description.length > 8 ? '...' : ''),
    Income: t.type === 'income' ? t.amount : 0,
    Expense: t.type === 'expense' ? t.amount : 0,
  }));

  const tooltipStyle = {
    backgroundColor: 'rgba(2, 2, 4, 0.95)',
    border: '1px solid #00e5ff',
    borderRadius: '8px',
    color: '#fff',
    boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)'
  };

  return (
    <div className="cyber-card fade-in" style={{ animationDelay: '0.1s' }}>
      <h3 className="section-title">
        <svg className="icon-svg" style={{color: '#00e5ff'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        Analytics
      </h3>
      
      <div className="charts-grid">
        {/* PIE CHART */}
        <div className="chart-wrapper">
          <p className="chart-label">Income vs Expense (%)</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" stroke="none">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} formatter={(value) => `₹ ${value === 0.1 ? 0 : value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="chart-wrapper">
          <p className="chart-label">Recent Transactions Trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={recentTransactions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#a0a0a0" fontSize={12} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={tooltipStyle} />
              <Bar dataKey="Income" fill="#00e5ff" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Expense" fill="#bd00ff" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TransactionCharts;