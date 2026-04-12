import React, { useMemo, useState } from 'react';
import { EXPENSE_CATEGORIES } from '../utils/categoryMap';

const BudgetsPage = ({ budgets, onSaveBudgets, transactions }) => {
  const currencySymbol = window.localStorage.getItem('fincore_currency') || '₹';
  const formatCurrency = (value) => `${currencySymbol} ${Number(value || 0).toFixed(2)}`;

  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [limit, setLimit] = useState('');

  const expenseTotalsByCategory = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        const key = t.category || 'Other';
        acc[key] = (acc[key] || 0) + Number(t.amount || 0);
        return acc;
      }, {});
  }, [transactions]);

  const budgetCards = useMemo(() => {
    return Object.entries(budgets)
      .filter(([, value]) => Number(value) > 0)
      .map(([cat, budgetLimit]) => {
        const limitValue = Number(budgetLimit || 0);
        const spent = Number(expenseTotalsByCategory[cat] || 0);
        const remaining = limitValue - spent;
        const rawPercentage = limitValue > 0 ? (spent / limitValue) * 100 : 0;
        const percentage = Math.min(rawPercentage, 100);

        let progressColor = 'var(--primary)';
        if (rawPercentage >= 100) progressColor = '#ff4d4d';
        else if (rawPercentage >= 80) progressColor = '#ffaa00';

        return {
          category: cat,
          limit: limitValue,
          spent,
          remaining,
          percentage,
          rawPercentage,
          progressColor,
        };
      })
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [budgets, expenseTotalsByCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedLimit = Number(limit);

    if (!category || Number.isNaN(parsedLimit) || parsedLimit <= 0) {
      alert('Please choose a category and enter a positive budget limit.');
      return;
    }

    onSaveBudgets({
      ...budgets,
      [category]: parsedLimit,
    });

    setLimit('');
  };

  return (
    <>
      <header className="top-header">
        <h1 className="page-title fade-in">Budgets</h1>
      </header>

      <div className="dashboard-body fade-in">
        <div className="cyber-card">
          <h3 className="card-title">Set Budget Limit</h3>

          <form className="budgets-form" onSubmit={handleSubmit}>
            <select className="tech-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              step="0.01"
              className="tech-input"
              placeholder="Budget limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />

            <button type="submit" className="tech-button">
              Set Budget
            </button>
          </form>
        </div>

        <div className="budgets-grid">
          {budgetCards.length === 0 ? (
            <div className="cyber-card empty-state">No budgets set yet. Add your first category limit above.</div>
          ) : (
            budgetCards.map((item) => (
              <div key={item.category} className="cyber-card">
                <div className="budget-card-header">
                  <h3 className="card-title m-0">{item.category}</h3>
                  <span className="text-secondary">Limit: {formatCurrency(item.limit)}</span>
                </div>

                <p className="budget-summary-line">
                  <span>Spent:</span>
                  <strong className="purple">{formatCurrency(item.spent)}</strong>
                </p>
                <p className="budget-summary-line">
                  <span>Remaining:</span>
                  <strong className={item.remaining >= 0 ? 'cyan' : 'purple'}>
                    {formatCurrency(item.remaining)}
                  </strong>
                </p>

                <div className="budget-progress-track">
                  <div
                    className="budget-progress-fill"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.progressColor }}
                  />
                </div>

                <p className="text-secondary" style={{ marginTop: '10px' }}>
                  {item.rawPercentage.toFixed(1)}% utilized
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default BudgetsPage;
