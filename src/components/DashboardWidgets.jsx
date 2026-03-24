import React from 'react';
import { getTransactionStats, getCategoryTotals } from '../utils/analyticsHelpers';

const DashboardWidgets = ({ transactions, budgets, onAddClick }) => {
  const stats = getTransactionStats(transactions);
  const categoryTotals = getCategoryTotals(transactions);
  const recentExpenses = transactions.filter(t => t.type === 'expense').slice(0, 5);

  // Calculate Budget Alerts
  const alerts = Object.entries(budgets).map(([cat, limit]) => {
    const spent = categoryTotals[cat] || 0;
    const isExceeded = spent > limit && limit > 0;
    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    return { cat, spent, limit, isExceeded, percentage };
  }).filter(b => b.limit > 0);

  return (
    <div className="widgets-grid">
      {/* Widget 1: Statistics */}
      <div className="cyber-card widget">
        <h3 className="card-title">Transaction Statistics</h3>
        <ul className="stats-list">
          <li><span className="text-secondary">Total This Month:</span> <strong className="cyan">{stats.totalCount}</strong></li>
          <li><span className="text-secondary">Avg Daily Spend:</span> <strong className="purple">₹{stats.avgDaily.toFixed(0)}</strong></li>
          <li><span className="text-secondary">Largest Expense:</span> <strong className="purple">₹{stats.largestExpense}</strong></li>
          <li><span className="text-secondary">Top Category:</span> <strong className="cyan">{stats.mostCommonCategory}</strong></li>
        </ul>
      </div>

      {/* Widget 2: Budget / Pending Tasks */}
      <div className="cyber-card widget">
        <h3 className="card-title">Pending Tasks & Budgets</h3>
        <div className="budget-list">
          {alerts.length === 0 ? <p className="text-secondary">No budgets set.</p> : null}
          {alerts.map(b => (
            <div key={b.cat} className="budget-item" style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>{b.cat} {b.isExceeded && <strong style={{color: '#ff4d4d'}}>(Exceeded!)</strong>}</span>
                <span>₹{b.spent} / ₹{b.limit}</span>
              </div>
              <div className="budget-track">
                <div className="budget-fill" style={{ 
                  width: `${b.percentage}%`, 
                  background: b.isExceeded ? '#ff4d4d' : (b.percentage > 80 ? '#bd00ff' : '#00e5ff') 
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 3: Quick Access */}
      <div className="cyber-card widget" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px' }}>
        <h3 className="card-title" style={{ marginBottom: '5px' }}>Quick Access</h3>
        <button className="tech-button outline" onClick={onAddClick}>+ Add Expense</button>
        <button className="tech-button outline cyan" onClick={onAddClick}>+ Add Income</button>
        <button className="tech-button" onClick={() => window.print()}>Generate Report</button>
      </div>
    </div>
  );
};

export default DashboardWidgets;