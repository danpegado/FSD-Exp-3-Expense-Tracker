import React from 'react';

const BalanceSummary = ({ total, income, expense }) => {
  return (
    <div className="cyber-card balance-card fade-in">
      <p className="balance-label">
        <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
        Current Balance
      </p>
      <h2 className={`balance-amount ${total >= 0 ? 'balance-cyan' : 'balance-purple'}`}>
        ₹ {total.toFixed(2)}
      </h2>
      
      <div className="stats-container">
        <div className="stat-box">
          <h4>
            <svg className="icon-svg" style={{color: '#00e5ff'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
            Total Income
          </h4>
          <p className="income-text">+₹ {income.toFixed(2)}</p>
        </div>
        <div className="stat-box">
          <h4>
            <svg className="icon-svg" style={{color: '#bd00ff'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
            Total Expenses
          </h4>
          <p className="expense-text">-₹ {expense.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;