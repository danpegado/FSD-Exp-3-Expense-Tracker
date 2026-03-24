import React, { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES } from '../utils/categoryMap';

const BudgetModal = ({ isOpen, onClose, currentBudgets, onSave }) => {
  const [budgets, setBudgets] = useState(currentBudgets || {});

  useEffect(() => { setBudgets(currentBudgets || {}); }, [currentBudgets, isOpen]);

  if (!isOpen) return null;

  const handleUpdate = (cat, val) => {
    setBudgets(prev => ({ ...prev, [cat]: parseFloat(val) || 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(budgets);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="cyber-card modal-content fade-in">
        <div className="modal-header">
          <h3 className="card-title m-0">Set Monthly Budgets</h3>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
          {EXPENSE_CATEGORIES.map(cat => (
            <div className="input-group" key={cat} style={{ marginBottom: '10px' }}>
              <label>{cat} Limit (₹)</label>
              <input 
                className="tech-input" 
                type="number" 
                placeholder="0" 
                value={budgets[cat] || ''} 
                onChange={(e) => handleUpdate(cat, e.target.value)} 
              />
            </div>
          ))}
          <div className="modal-actions">
            <button type="button" className="tech-button outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="tech-button">Save Budgets</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;