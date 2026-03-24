import React, { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/categoryMap';

const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setCategory(type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }, [type]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc.trim() || !amount || amount <= 0) return alert("Valid description and positive amount required.");

    onAdd({ id: Date.now(), description: desc, amount: parseFloat(amount), type, category, date });
    
    // Reset and close
    setDesc(''); setAmount(''); onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="cyber-card modal-content fade-in">
        <div className="modal-header">
          <h3 className="card-title m-0">Add Transaction</h3>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="input-group">
              <label>Type</label>
              <select className="tech-input" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="input-group">
              <label>Category</label>
              <select className="tech-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Description</label>
            <input className="tech-input" type="text" placeholder="E.g., Groceries" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label>Amount (₹)</label>
              <input className="tech-input" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Date</label>
              <input className="tech-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="tech-button outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="tech-button">Save Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;