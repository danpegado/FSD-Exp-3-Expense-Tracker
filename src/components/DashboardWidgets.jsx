import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { getTransactionStats } from '../utils/analyticsHelpers';

const DashboardWidgets = ({ transactions, budgets, onAddClick }) => {
  const currencySymbol = window.localStorage.getItem('fincore_currency') || '₹';
  const stats = getTransactionStats(transactions);

  const storedBudgets = useMemo(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem('budgets'));
      if (parsed && typeof parsed === 'object') return parsed;
      return budgets || {};
    } catch (error) {
      console.error('Failed to parse budgets from localStorage:', error);
      return budgets || {};
    }
  }, [budgets]);

  const currentMonthKey = useMemo(() => new Date().toISOString().substring(0, 7), []);

  const currentMonthExpenseTotals = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense' && t.date && String(t.date).startsWith(currentMonthKey))
      .reduce((acc, t) => {
        const category = t.category || 'Other';
        acc[category] = (acc[category] || 0) + Number(t.amount || 0);
        return acc;
      }, {});
  }, [transactions, currentMonthKey]);

  const warnings = Object.entries(storedBudgets)
    .map(([cat, limit]) => {
      const parsedLimit = Number(limit || 0);
      const spent = Number(currentMonthExpenseTotals[cat] || 0);
      const rawPercentage = parsedLimit > 0 ? (spent / parsedLimit) * 100 : 0;
      const percentage = Math.min(rawPercentage, 100);
      const color = rawPercentage >= 100 ? '#ff4d4d' : '#ffaa00';

      return {
        cat,
        spent,
        limit: parsedLimit,
        rawPercentage,
        percentage,
        color,
      };
    })
    .filter((item) => item.limit > 0 && item.spent >= item.limit * 0.8)
    .sort((a, b) => b.rawPercentage - a.rawPercentage);

  return (
    <div className="widgets-grid">
      {/* Widget 1: Statistics */}
      <div className="cyber-card widget">
        <h3 className="card-title">Transaction Statistics</h3>
        <ul className="stats-list">
          <li><span className="text-secondary">Total This Month:</span> <strong className="cyan">{stats.totalCount}</strong></li>
          <li><span className="text-secondary">Avg Daily Spend:</span> <strong className="purple">{currencySymbol}{stats.avgDaily.toFixed(0)}</strong></li>
          <li><span className="text-secondary">Largest Expense:</span> <strong className="purple">{currencySymbol}{stats.largestExpense}</strong></li>
          <li><span className="text-secondary">Top Category:</span> <strong className="cyan">{stats.mostCommonCategory}</strong></li>
        </ul>
      </div>

      {/* Widget 2: Budget / Pending Tasks */}
      <div className="cyber-card widget">
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} />
          <span>Budget Warnings</span>
        </h3>
        <div className="budget-list">
          {warnings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px 8px', color: 'var(--text-secondary)' }}>
              <CheckCircle size={20} style={{ marginBottom: '8px' }} />
              <p>All budgets are looking healthy!</p>
            </div>
          ) : null}
          {warnings.map((warning) => (
            <div key={warning.cat} className="budget-item" style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>
                  {warning.cat}
                  {warning.rawPercentage >= 100 ? <strong style={{ color: '#ff4d4d' }}> (Exceeded!)</strong> : null}
                </span>
                <span>{currencySymbol}{warning.spent.toFixed(2)} / {currencySymbol}{warning.limit.toFixed(2)}</span>
              </div>
              <div className="budget-track">
                <div
                  className="budget-fill"
                  style={{
                    width: `${warning.percentage}%`,
                    backgroundColor: warning.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;