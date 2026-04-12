export const THEME_STORAGE_KEY = 'theme';

export const NEON_THEMES = {
  voidrunner: {
    name: 'Voidrunner',
    primary: '#00E5FF',
    secondary: '#BD00FF',
    iconContrast: '#ffffff',
  },
  neonshard: {
    name: 'NeonShard',
    primary: '#FF2D95',
    secondary: '#F8FF00',
    iconContrast: '#ffffff',
  },
  matrixpulse: {
    name: 'MatrixPulse',
    primary: '#39FF14',
    secondary: '#2F4F4F',
    iconContrast: '#ffffff',
  },
  stealthgrid: {
    name: 'StealthGrid',
    primary: '#7DF9FF',
    secondary: '#6A00FF',
    iconContrast: '#ffffff',
  },
  darktronix: {
    name: 'DarkTronix',
    primary: '#00B7FF',
    secondary: '#FFFFFF',
    iconContrast: '#ffffff',
  },
  sunfirexp: {
    name: 'SunfireXP',
    primary: '#FF6B00',
    secondary: '#FFD400',
    iconContrast: '#1a1a24',
  },
  arcadepop: {
    name: 'ArcadePop',
    primary: '#FF2D95',
    secondary: '#00E5FF',
    iconContrast: '#1a1a24',
  },
  auroradash: {
    name: 'AuroraDash',
    primary: '#00C49F',
    secondary: '#7B61FF',
    iconContrast: '#1a1a24',
  },
  pixelriot: {
    name: 'PixelRiot',
    primary: '#FF3D3D',
    secondary: '#39FF14',
    iconContrast: '#1a1a24',
  },
  vaporflash: {
    name: 'VaporFlash',
    primary: '#FF8C00',
    secondary: '#FF00CC',
    iconContrast: '#1a1a24',
  },
};

const hexToRgb = (hex) => {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;

  const int = parseInt(value, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

export const applyTheme = (themeKey = 'voidrunner') => {
  const selected = NEON_THEMES[themeKey] || NEON_THEMES.voidrunner;
  const primaryRgb = hexToRgb(selected.primary);
  const secondaryRgb = hexToRgb(selected.secondary);

  const root = document.documentElement;
  root.setAttribute('data-theme', themeKey);
  root.style.setProperty('--accent-primary', selected.primary);
  root.style.setProperty('--accent-secondary', selected.secondary);
  root.style.setProperty('--accent-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
  root.style.setProperty('--accent-secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);

  window.localStorage.setItem(THEME_STORAGE_KEY, themeKey);
  return themeKey;
};
