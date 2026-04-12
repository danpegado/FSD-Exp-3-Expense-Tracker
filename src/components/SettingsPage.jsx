import React, { useEffect, useState } from 'react';
import { User, Ghost, Bot, Cat, Rocket, Zap, Star, Flame } from 'lucide-react';
import { NEON_THEMES } from '../utils/themeConfig';
import { AVATAR_OPTIONS, AVATAR_STORAGE_KEY } from '../utils/avatarConfig';

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

const SettingsPage = ({ activeTheme, onThemeChange }) => {
  const [selectedAvatar, setSelectedAvatar] = useState('User');
  const [currency, setCurrency] = useState(() => window.localStorage.getItem('fincore_currency') || '₹');

  useEffect(() => {
    const savedAvatar = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    setSelectedAvatar(savedAvatar || 'User');
  }, []);

  const handleAvatarSelect = (avatarName) => {
    setSelectedAvatar(avatarName);
    window.localStorage.setItem(AVATAR_STORAGE_KEY, avatarName);
    window.dispatchEvent(new Event('avatarchange'));
  };

  const handleCurrencyChange = (newSymbol) => {
    setCurrency(newSymbol);
    window.localStorage.setItem('fincore_currency', newSymbol);
    window.dispatchEvent(new CustomEvent('currencychange', { detail: { symbol: newSymbol } }));
  };

  return (
    <>
      <header className="top-header">
        <h1 className="page-title fade-in">Settings</h1>
      </header>

      <div className="dashboard-body fade-in">
        <div className="cyber-card">
          <h3 className="card-title">Neon Theme Switcher</h3>
          <p className="text-secondary" style={{ marginBottom: '18px' }}>
            Pick a neon palette. Changes apply instantly across FINCORE and are saved for next time.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
            }}
          >
            {Object.entries(NEON_THEMES).map(([key, theme]) => {
              const isActive = key === activeTheme;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onThemeChange(key)}
                  className="tech-button outline"
                  style={{
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    justifyContent: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderColor: isActive ? theme.primary : undefined,
                    boxShadow: isActive ? `0 0 12px ${theme.primary}66` : undefined,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: theme.primary,
                      boxShadow: `0 0 10px ${theme.primary}AA`,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: theme.secondary,
                      boxShadow: `0 0 10px ${theme.secondary}AA`,
                      flexShrink: 0,
                    }}
                  />
                  <span>{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="cyber-card">
          <h3 className="card-title">Avatar Selector</h3>
          <p className="text-secondary" style={{ marginBottom: '18px' }}>
            Choose your profile icon for the sidebar.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
            }}
          >
            {AVATAR_OPTIONS.map((avatar) => {
              const IconComponent = AVATAR_ICON_MAP[avatar.key] || User;
              const isSelected = selectedAvatar === avatar.key;

              return (
                <button
                  key={avatar.key}
                  type="button"
                  onClick={() => handleAvatarSelect(avatar.key)}
                  className="tech-button outline"
                  style={{
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderColor: isSelected ? 'var(--primary)' : '#374151',
                    color: isSelected ? 'var(--primary)' : '#9ca3af',
                    boxShadow: isSelected ? '0 0 12px rgba(var(--accent-primary-rgb),0.5)' : 'none',
                  }}
                >
                  <IconComponent size={18} color={isSelected ? 'var(--primary)' : '#9ca3af'} />
                  <span>{avatar.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="cyber-card">
          <h3 className="card-title">Currency Preferences</h3>
          <p className="text-secondary" style={{ marginBottom: '12px' }}>
            Select your default currency symbol for FINCORE.
          </p>

          <select
            className="tech-input"
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            style={{
              maxWidth: '280px',
              background: 'rgba(0, 0, 0, 0.55)',
              borderColor: 'rgba(255, 255, 255, 0.18)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="¥">JPY (¥)</option>
            <option value="₹">INR (₹)</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
