import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import AddTransactionModal from './components/AddTransactionModal';
import WelcomeModal from './components/WelcomeModal';
import BudgetModal from './components/BudgetModal';
import DashboardPage from './components/DashboardPage';
import TransactionsPage from './components/TransactionsPage';
import AnalyticsPage from './components/AnalyticsPage';
import BudgetsPage from './components/BudgetsPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import { filterByMonth, calculateTotals } from './utils/analyticsHelpers';
import { applyTheme, NEON_THEMES, THEME_STORAGE_KEY } from './utils/themeConfig';
import { Routes, Route, Navigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
const USERNAME_STORAGE_KEY = 'expense_tracker_username';

const getBudgetsForUser = (name) => {
  if (!name) return {};

  try {
    const saved = window.localStorage.getItem(`budgets_${name}`);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.error('Failed to parse budgets from localStorage:', error);
    return {};
  }
};

const PlaceholderPage = ({ title }) => (
  <>
    <header className="top-header">
      <h1 className="page-title fade-in">{title}</h1>
    </header>
    <div className="dashboard-body fade-in">
      <div className="cyber-card">
        <h3 className="card-title">{title}</h3>
        <p className="text-secondary">This page is reserved for the next phase of your FINCORE build.</p>
      </div>
    </div>
  </>
);

function App() {
  const [transactions, setTransactions] = useState([]);
  const [username, setUsername] = useState('');
  const [budgets, setBudgets] = useState(() => {
    const savedUsername = window.localStorage.getItem(USERNAME_STORAGE_KEY) || 'guest';
    return getBudgetsForUser(savedUsername);
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeTheme, setActiveTheme] = useState('voidrunner');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) || 'voidrunner';
    const validTheme = NEON_THEMES[savedTheme] ? savedTheme : 'voidrunner';
    applyTheme(validTheme);
    setActiveTheme(validTheme);
  }, []);

  useEffect(() => {
    const savedUsername = window.localStorage.getItem(USERNAME_STORAGE_KEY);

    if (savedUsername && savedUsername.trim()) {
      setUsername(savedUsername.trim());
      return;
    }

    const prompted = window.prompt('Who is tracking expenses today?');
    const finalUsername = prompted && prompted.trim() ? prompted.trim() : 'guest';
    window.localStorage.setItem(USERNAME_STORAGE_KEY, finalUsername);
    setUsername(finalUsername);
  }, []);

  useEffect(() => {
    if (!username) return;
    setBudgets(getBudgetsForUser(username));
  }, [username]);

  useEffect(() => {
    if (!username) return;
    window.localStorage.setItem(`budgets_${username}`, JSON.stringify(budgets));
  }, [budgets, username]);

  useEffect(() => {
    if (!username) return;

    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/expenses?username=${encodeURIComponent(username)}`);
        if (!response.ok) throw new Error('Failed to fetch expenses');
        const data = await response.json();
        const normalized = data.map((item) => ({
          ...item,
          id: item._id,
        }));
        setTransactions(normalized);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [username]);

  // Derived calculations
  const filteredTransactions = useMemo(() => filterByMonth(transactions, selectedMonth), [transactions, selectedMonth]);
  const { income, expense, balance } = useMemo(() => calculateTotals(filteredTransactions), [filteredTransactions]);

  // Actions
  const handleAddTransaction = async (transaction) => {
    try {
      const isEditing = Boolean(transaction._id);
      const response = await fetch(
        isEditing ? `${API_BASE_URL}/expenses/${transaction._id}` : `${API_BASE_URL}/expenses`,
        {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          amount: transaction.amount,
          category: transaction.category,
          date: transaction.date,
          type: transaction.type,
          description: transaction.description,
        }),
      }
      );

      if (!response.ok) throw new Error(isEditing ? 'Failed to update expense' : 'Failed to add expense');

      const savedExpense = await response.json();
      if (isEditing) {
        setTransactions((prev) => prev.map((t) => (t.id === savedExpense._id ? { ...savedExpense, id: savedExpense._id } : t)));
      } else {
        setTransactions((prev) => [{ ...savedExpense, id: savedExpense._id }, ...prev]);
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Could not save transaction. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete expense');
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Could not delete expense. Please try again.');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleOpenNewTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleCloseTransactionModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleThemeChange = (themeKey) => {
    const appliedTheme = applyTheme(themeKey);
    setActiveTheme(appliedTheme);
  };
  
  return (
    <div className="dashboard-layout">
      <WelcomeModal isOpen={isWelcomeOpen} onSave={(name) => { setUsername(name); setIsWelcomeOpen(false); window.localStorage.setItem(USERNAME_STORAGE_KEY, name); }} />
      <Sidebar userName={username} />
      
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                onOpenNewTransaction={handleOpenNewTransaction}
                balance={balance}
                income={income}
                expense={expense}
                transactions={filteredTransactions}
                budgets={budgets}
                activeTheme={activeTheme}
              />
            }
          />
          <Route
            path="/transactions"
            element={
              <TransactionsPage
                transactions={transactions}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onOpenNewTransaction={handleOpenNewTransaction}
              />
            }
          />
          <Route
            path="/analytics"
            element={<AnalyticsPage transactions={transactions} activeTheme={activeTheme} />}
          />
          <Route
            path="/budgets"
            element={<BudgetsPage budgets={budgets} onSaveBudgets={setBudgets} transactions={transactions} />}
          />
          <Route path="/reports" element={<ReportsPage username={username} />} />
          <Route
            path="/settings"
            element={<SettingsPage activeTheme={activeTheme} onThemeChange={handleThemeChange} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseTransactionModal}
        onAdd={handleAddTransaction}
        initialData={editingTransaction}
      />
      <BudgetModal isOpen={isBudgetOpen} onClose={() => setIsBudgetOpen(false)} currentBudgets={budgets} onSave={setBudgets} />
    </div>
  );
}

export default App;