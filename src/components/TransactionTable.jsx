import React from 'react';
import { CATEGORY_COLORS } from '../utils/categoryMap';

const TransactionTable = ({ transactions, onDelete }) => {
  return (
    <div className="cyber-card table-container">
      <h3 className="card-title">Recent Transactions</h3>
      <div className="table-wrapper">
        <table className="tech-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="6" className="empty-state">No transactions match the current filter.</td></tr>
            ) : (
              transactions.map(t => (
                <tr key={t.id} className="table-row">
                  <td className="text-secondary">{t.date}</td>
                  <td className="fw-bold">{t.description}</td>
                  <td>
                    <span className="category-badge" style={{ borderColor: CATEGORY_COLORS[t.category], color: CATEGORY_COLORS[t.category] }}>
                      {t.category}
                    </span>
                  </td>
                  <td>
                    <span className={`type-badge ${t.type === 'income' ? 'cyan-bg' : 'purple-bg'}`}>
                      {t.type.toUpperCase()}
                    </span>
                  </td>
                  <td className={t.type === 'income' ? 'cyan fw-bold' : 'purple fw-bold'}>
                    {t.type === 'income' ? '+' : '-'}₹ {t.amount.toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => onDelete(t.id)} className="btn-icon delete" title="Delete">×</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;