import React, { useState } from 'react';

const Sidebar = ({ userName }) => {
  const [active, setActive] = useState('Dashboard');
  const navItems = ['Dashboard', 'Transactions', 'Analytics', 'Budgets', 'Reports', 'Settings'];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2 className="neon-text-cyan">FIN<span className="neon-text-purple">CORE</span></h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button 
            key={item} 
            className={`nav-item ${active === item ? 'active' : ''}`}
            onClick={() => setActive(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{userName ? userName.charAt(0).toUpperCase() : 'U'}</div>
          <span>{userName || 'User Profile'}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;