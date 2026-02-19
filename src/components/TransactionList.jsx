import React from 'react';
import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions, onDelete }) => (
  <div className="cyber-card fade-in" style={{ animationDelay: '0.3s' }}>
    <h3 className="section-title">
      <svg className="icon-svg" style={{color: '#00e5ff'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
      Transaction History
    </h3>
    <div className="history-list">
      {transactions.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a0a0a0', margin: '30px 0' }}>No transactions available.</p>
      ) : (
        transactions.map(t => (
          <TransactionItem key={t.id} t={t} onDelete={onDelete} />
        ))
      )}
    </div>
  </div>
);

export default TransactionList;