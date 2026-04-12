import React from 'react';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { CATEGORY_COLORS } from '../utils/categoryMap';

const TransactionTable = ({
  transactions,
  onDelete,
  onEdit,
  title = 'Recent Transactions',
  currencySymbol = window.localStorage.getItem('fincore_currency') || '₹',
  sortConfig,
  onSort,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) => {
  const isSortable = typeof onSort === 'function';

  const renderSortableHeader = (label, key) => {
    if (!isSortable) return label;

    const isActive = sortConfig?.key === key;
    const direction = isActive ? sortConfig.direction : null;

    return (
      <button
        type="button"
        onClick={() => onSort(key)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          padding: 0,
          font: 'inherit',
          textTransform: 'inherit',
        }}
      >
        <span>{label}</span>
        <ArrowUpDown size={14} style={{ opacity: isActive ? 1 : 0.6 }} />
        {isActive ? <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({direction})</span> : null}
      </button>
    );
  };

  return (
    <div className="cyber-card table-container">
      <h3 className="card-title">{title}</h3>
      <div className="table-wrapper">
        <table className="tech-table">
          <thead>
            <tr>
              <th>{renderSortableHeader('Date', 'date')}</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>{renderSortableHeader('Amount', 'amount')}</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="6" className="empty-state">No transactions match the current filter.</td></tr>
            ) : (
              transactions.map(t => (
                <tr key={t.id} className="table-row">
                  <td className="text-secondary">
                    {new Date(t.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
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
                    {t.type === 'income' ? '+' : '-'}{currencySymbol} {t.amount.toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => onEdit(t)} className="btn-icon" title="Edit" aria-label="Edit transaction">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => onDelete(t.id)} className="btn-icon delete" title="Delete" aria-label="Delete transaction">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {typeof currentPage === 'number' && typeof totalPages === 'number' ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
          <button
            type="button"
            className="tech-button outline small"
            onClick={onPreviousPage}
            disabled={currentPage <= 1}
            style={{ opacity: currentPage <= 1 ? 0.5 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span className="text-secondary">Page {currentPage} of {totalPages}</span>
          <button
            type="button"
            className="tech-button outline small"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            style={{ opacity: currentPage >= totalPages ? 0.5 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default TransactionTable;