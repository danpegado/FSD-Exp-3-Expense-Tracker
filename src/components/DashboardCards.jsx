import React from 'react';

const DashboardCards = ({ balance, income, expense }) => {
  return (
    <div className="dashboard-cards-grid">
      <div className="cyber-card metric-card">
        <div className="metric-header">
          <span className="text-secondary">Current Balance</span>
          <svg className="icon-svg cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
        </div>
        <h2 className={`metric-value ${balance >= 0 ? 'cyan' : 'purple'}`}>₹ {balance.toFixed(2)}</h2>
      </div>

      <div className="cyber-card metric-card">
        <div className="metric-header">
          <span className="text-secondary">Total Income</span>
          <svg className="icon-svg cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
        </div>
        <h2 className="metric-value cyan">+₹ {income.toFixed(2)}</h2>
      </div>

      <div className="cyber-card metric-card">
        <div className="metric-header">
          <span className="text-secondary">Total Expenses</span>
          <svg className="icon-svg purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
        </div>
        <h2 className="metric-value purple">-₹ {expense.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default DashboardCards;