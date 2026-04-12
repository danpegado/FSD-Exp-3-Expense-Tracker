import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Ghost, Bot, Cat, Rocket, Zap, Star, Flame } from 'lucide-react';
import { AVATAR_STORAGE_KEY } from '../utils/avatarConfig';

const AVATAR_ICON_MAP = {
  User,
  Ghost,
  Bot,
  Cat,
  Rocket,
  Zap,
  Star,
  Flame,
};

const Sidebar = ({ userName }) => {
  const [avatarName, setAvatarName] = useState('User');

  useEffect(() => {
    const syncAvatar = () => {
      const saved = window.localStorage.getItem(AVATAR_STORAGE_KEY);
      setAvatarName(saved || 'User');
    };

    syncAvatar();
    window.addEventListener('storage', syncAvatar);
    window.addEventListener('avatarchange', syncAvatar);

    return () => {
      window.removeEventListener('storage', syncAvatar);
      window.removeEventListener('avatarchange', syncAvatar);
    };
  }, []);

  const AvatarIcon = useMemo(() => AVATAR_ICON_MAP[avatarName] || User, [avatarName]);

  const navItems = [
    { label: 'Dashboard', to: '/' },
    { label: 'Transactions', to: '/transactions' },
    { label: 'Analytics', to: '/analytics' },
    { label: 'Budgets', to: '/budgets' },
    { label: 'Reports', to: '/reports' },
    { label: 'Settings', to: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2 className="neon-text-cyan">FIN<span className="neon-text-purple">CORE</span></h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar"><AvatarIcon size={20} color="var(--icon-contrast)" /></div>
          <span>{userName || 'User Profile'}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;