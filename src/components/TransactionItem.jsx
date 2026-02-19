import React from 'react';

const TransactionItem = ({ t, onDelete }) => (
  <div className={`transaction-item ${t.type === 'income' ? 'border-income' : 'border-expense'}`}>
    <span className="item-desc">{t.description}</span>
    <div className="item-right">
      <span className={`item-amount ${t.type === 'income' ? 'income-text' : 'expense-text'}`}>
        {t.type === 'income' ? '+' : '-'}₹ {t.amount.toFixed(2)}
      </span>
      <button onClick={() => onDelete(t.id)} className="delete-btn" aria-label="Delete transaction">×</button>
    </div>
  </div>
);

export default TransactionItem;