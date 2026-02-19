import React, { useState } from 'react';

const TransactionForm = ({ onAdd }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc.trim() || !amount || amount <= 0) {
      alert("Please provide a valid description and a positive amount.");
      return;
    }

    onAdd({
      id: Date.now(),
      description: desc,
      amount: parseFloat(amount),
      type
    });

    setDesc('');
    setAmount('');
  };

  return (
    <div className="cyber-card fade-in" style={{ animationDelay: '0.2s' }}>
      <h3 className="section-title">
        <svg className="icon-svg" style={{color: '#00e5ff'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
        Add Transaction
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Description</label>
          <input 
            className="tech-input" 
            type="text" 
            placeholder="Enter description..." 
            value={desc} 
            onChange={(e) => setDesc(e.target.value)} 
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">Amount (₹)</label>
          <input 
            className="tech-input" 
            type="number" 
            placeholder="Enter amount..." 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
        </div>

        <div className="input-group">
          <label className="input-label">Type</label>
          <select className="tech-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        <button type="submit" className="tech-button">ADD</button>
      </form>
    </div>
  );
};

export default TransactionForm;