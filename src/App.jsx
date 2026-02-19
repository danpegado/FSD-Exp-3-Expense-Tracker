import React, { useState } from 'react';
import './App.css';
import BalanceSummary from './components/BalanceSummary';
import TransactionCharts from './components/TransactionCharts';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

function App() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  return (
    <div className="app-container">
      <h1 className="main-title fade-in">Expense Tracker</h1>

      {/* 1. Balance Section */}
      <BalanceSummary 
        total={balance} 
        income={income} 
        expense={expense} 
      />

      {/* 2. Charts Section (Only visible after first transaction is added) */}
      {transactions.length > 0 && (
        <TransactionCharts 
          income={income} 
          expense={expense} 
          transactions={transactions} 
        />
      )}

      {/* 3. Add Transaction Section */}
      <TransactionForm onAdd={addTransaction} />

      {/* 4. Transaction History Section */}
      <TransactionList 
        transactions={transactions} 
        onDelete={deleteTransaction} 
      />
    </div>
  );
}

export default App;