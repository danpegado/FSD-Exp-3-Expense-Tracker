import React, { useState } from 'react';

const WelcomeModal = ({ isOpen, onSave }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onSave(name);
  };

  return (
    <div className="modal-overlay">
      <div className="cyber-card modal-content fade-in" style={{ textAlign: 'center' }}>
        <h2 className="card-title" style={{ fontSize: '2rem', color: '#00e5ff' }}>SYSTEM_INITIALIZATION</h2>
        <p className="text-secondary" style={{ marginBottom: '20px' }}>Welcome! Please identify yourself to proceed.</p>
        <form onSubmit={handleSubmit}>
          <input 
            className="tech-input" 
            style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '20px' }}
            type="text" 
            placeholder="Enter your name..." 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            autoFocus
          />
          <button type="submit" className="tech-button">START DASHBOARD</button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeModal;