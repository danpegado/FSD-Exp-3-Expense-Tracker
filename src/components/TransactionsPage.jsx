import React, { useMemo, useState, useEffect } from 'react';
import TransactionTable from './TransactionTable';

const TransactionsPage = ({ transactions, onEdit, onDelete, onOpenNewTransaction }) => {
  const currencySymbol = window.localStorage.getItem('fincore_currency') || '₹';
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 8;

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return transactions.filter((t) => {
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesSearch =
        !query ||
        String(t.description || '').toLowerCase().includes(query) ||
        String(t.category || '').toLowerCase().includes(query) ||
        String(t.date || '').toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  }, [transactions, searchTerm, typeFilter]);

  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      if (sortConfig.key === 'date') {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      if (sortConfig.key === 'amount') {
        const aAmount = Number(a.amount || 0);
        const bAmount = Number(b.amount || 0);
        return sortConfig.direction === 'asc' ? aAmount - bAmount : bAmount - aAmount;
      }

      return 0;
    });

    return sorted;
  }, [filteredTransactions, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / transactionsPerPage));

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    return sortedTransactions.slice(startIndex, startIndex + transactionsPerPage);
  }, [sortedTransactions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, sortConfig]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }

      return { key, direction: 'desc' };
    });
  };

  return (
    <>
      <header className="top-header">
        <h1 className="page-title fade-in">Transactions</h1>

        <div className="header-controls">
          <input
            type="text"
            className="tech-input"
            placeholder="Search by description, category, or date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="tech-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button className="tech-button small" onClick={onOpenNewTransaction}>
            + Add Transaction
          </button>
        </div>
      </header>

      <div className="dashboard-body fade-in" style={{ flex: 1 }}>
        <TransactionTable
          title="Transactions Ledger"
          transactions={paginatedTransactions}
          onDelete={onDelete}
          onEdit={onEdit}
          currencySymbol={currencySymbol}
          sortConfig={sortConfig}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        />
      </div>
    </>
  );
};

export default TransactionsPage;
