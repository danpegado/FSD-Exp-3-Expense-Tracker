import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import DashboardCards from './components/DashboardCards';
import AnalyticsCharts from './components/AnalyticsCharts';
import TransactionTable from './components/TransactionTable';
import AddTransactionModal from './components/AddTransactionModal';
import WelcomeModal from './components/WelcomeModal';
import BudgetModal from './components/BudgetModal';
import DashboardWidgets from './components/DashboardWidgets';
import { useLocalStorage } from './hooks/useLocalStorage';
import { filterByMonth, calculateTotals, generateCSV } from './utils/analyticsHelpers';

function App() {
  // Persistence States
  const [transactions, setTransactions] = useLocalStorage('finance_pro_v2_tx', []);
  const [userName, setUserName] = useLocalStorage('finance_pro_v2_user', '');
  const [budgets, setBudgets] = useLocalStorage('finance_pro_v2_budgets', {});

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));

  // Check for first time user
  useEffect(() => {
    if (!userName) setIsWelcomeOpen(true);
  }, [userName]);

  // Derived calculations
  const filteredTransactions = useMemo(() => filterByMonth(transactions, selectedMonth), [transactions, selectedMonth]);
  const { income, expense, balance } = useMemo(() => calculateTotals(filteredTransactions), [filteredTransactions]);

  // Actions
  const handleAddTransaction = (t) => setTransactions([t, ...transactions]);
  const handleDelete = (id) => setTransactions(transactions.filter(t => t.id !== id));
  
  const handleExportCSV = () => {
    const csvData = generateCSV(filteredTransactions);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `transactions_${selectedMonth}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="dashboard-layout">
      <WelcomeModal isOpen={isWelcomeOpen} onSave={(name) => { setUserName(name); setIsWelcomeOpen(false); }} />
      <Sidebar userName={userName} />
      
      <main className="main-content">
        <header className="top-header">
          <h1 className="page-title fade-in">Dashboard</h1>
          
          <div className="header-controls">
            <input 
              type="month" 
              className="tech-input month-picker" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)} 
            />
            <div className="quick-actions">
              <button className="tech-button outline small" onClick={handleExportCSV}>
                Download CSV
              </button>
              <button className="tech-button outline small" onClick={() => setIsBudgetOpen(true)}>
                Set Budget
              </button>
              <button className="tech-button small" onClick={() => setIsModalOpen(true)}>
                + Add Transaction
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-body fade-in">
          <DashboardCards balance={balance} income={income} expense={expense} />
          
          <DashboardWidgets transactions={filteredTransactions} budgets={budgets} onAddClick={() => setIsModalOpen(true)} />

          {filteredTransactions.length > 0 && (
            <AnalyticsCharts transactions={filteredTransactions} />
          )}

          <TransactionTable transactions={filteredTransactions} onDelete={handleDelete} />
        </div>
      </main>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddTransaction} />
      <BudgetModal isOpen={isBudgetOpen} onClose={() => setIsBudgetOpen(false)} currentBudgets={budgets} onSave={setBudgets} />
    </div>
  );
}

export default App;