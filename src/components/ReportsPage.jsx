import React, { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const convertTransactionsToCsv = (expenses) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = expenses.map((item) => [
    item.date ? String(item.date).split('T')[0] : '',
    (item.description || '').replaceAll('"', '""'),
    item.category || '',
    item.type || '',
    Number(item.amount || 0).toFixed(2),
  ]);

  const csvBody = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  return [headers.join(','), csvBody].join('\n');
};

const ReportsPage = ({ username }) => {
  const currencySymbol = window.localStorage.getItem('fincore_currency') || '₹';
  const formatCurrency = (value) => `${currencySymbol} ${Number(value || 0).toFixed(2)}`;

  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getDateKey = (value) => {
    if (!value) return '';
    return String(value).split('T')[0];
  };

  useEffect(() => {
    if (!username) return;

    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/expenses?username=${encodeURIComponent(username)}`);
        if (!response.ok) throw new Error('Failed to fetch report data');
        const data = await response.json();
        setExpenses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [username]);

  const filteredExpenses = useMemo(() => {
    if (!startDate && !endDate) return expenses;

    return expenses.filter((item) => {
      const txDate = getDateKey(item.date);
      if (!txDate) return false;

      const isAfterStart = !startDate || txDate >= startDate;
      const isBeforeEnd = !endDate || txDate <= endDate;
      return isAfterStart && isBeforeEnd;
    });
  }, [expenses, startDate, endDate]);

  const summary = useMemo(() => {
    const income = filteredExpenses
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expense = filteredExpenses
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [filteredExpenses]);

  const handleDownloadCsv = () => {
    if (filteredExpenses.length === 0) {
      alert('No transactions available to export.');
      return;
    }

    const csvString = convertTransactionsToCsv(filteredExpenses);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'FINCORE_Report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="top-header">
        <h1 className="page-title fade-in">Reports</h1>
      </header>

      <div className="dashboard-body fade-in">
        <div className="reports-summary-grid">
          <div className="cyber-card metric-card">
            <div className="metric-header">
              <span className="text-secondary">Total Income</span>
            </div>
            <h2 className="metric-value cyan">+{formatCurrency(summary.income)}</h2>
          </div>

          <div className="cyber-card metric-card">
            <div className="metric-header">
              <span className="text-secondary">Total Expenses</span>
            </div>
            <h2 className="metric-value purple">-{formatCurrency(summary.expense)}</h2>
          </div>

          <div className="cyber-card metric-card">
            <div className="metric-header">
              <span className="text-secondary">Net Balance</span>
            </div>
            <h2 className={`metric-value ${summary.balance >= 0 ? 'cyan' : 'purple'}`}>
              {formatCurrency(summary.balance)}
            </h2>
          </div>
        </div>

        <div className="cyber-card reports-export-card">
          <h3 className="card-title">Export Report</h3>
          <p className="text-secondary reports-export-text">
            Download a transaction report for {username || 'current user'} in CSV format.
          </p>

          <div className="reports-date-range">
            <div className="reports-date-field">
              <label className="text-secondary">Start Date</label>
              <input
                type="date"
                className="tech-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="reports-date-field">
              <label className="text-secondary">End Date</label>
              <input
                type="date"
                className="tech-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <button className="tech-button reports-download-button" onClick={handleDownloadCsv}>
            <Download size={18} />
            <span>Download CSV Report</span>
          </button>

          {isLoading ? <p className="text-secondary" style={{ marginTop: '12px' }}>Loading report data...</p> : null}
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
