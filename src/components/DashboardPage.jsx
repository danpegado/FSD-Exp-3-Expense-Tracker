import React from 'react';
import { Calendar } from 'lucide-react';
import DashboardCards from './DashboardCards';
import AnalyticsCharts from './AnalyticsCharts';
import DashboardWidgets from './DashboardWidgets';

const DashboardPage = ({
  onOpenNewTransaction,
  balance,
  income,
  expense,
  transactions,
  budgets,
  activeTheme,
}) => {
  const currencySymbol = window.localStorage.getItem('fincore_currency') || '₹';

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const recentTransactions = transactions.slice(0, 5);

  return (
    <>
      <header className="top-header">
        <h1 className="page-title fade-in">Dashboard</h1>

        <div className="header-controls">
          <div className="month-today-pill" aria-label="Current date">
            <Calendar size={16} />
            <span>{today}</span>
          </div>
          <div className="quick-actions">
            <button className="tech-button small" onClick={onOpenNewTransaction}>
              + Add Transaction
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-body fade-in">
        <DashboardCards balance={balance} income={income} expense={expense} />

        <DashboardWidgets transactions={transactions} budgets={budgets} onAddClick={onOpenNewTransaction} />

        {transactions.length > 0 && <AnalyticsCharts transactions={transactions} themeKey={activeTheme} />}

        <div className="cyber-card table-container">
          <h3 className="card-title">Recent Transactions</h3>
          <div className="table-wrapper">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">No transactions match the current filter.</td>
                  </tr>
                ) : (
                  recentTransactions.map((t) => (
                    <tr key={t.id} className="table-row">
                      <td className="text-secondary">
                        {new Date(t.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="fw-bold">{t.description}</td>
                      <td>{t.category}</td>
                      <td className={t.type === 'income' ? 'cyan fw-bold' : 'purple fw-bold'}>
                        {t.type === 'income' ? '+' : '-'}{currencySymbol} {Number(t.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
