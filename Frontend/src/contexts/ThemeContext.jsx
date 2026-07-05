import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage, THEME_KEY } from '../utils/storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => storage.get(THEME_KEY, 'dark'));

  useEffect(() => {
    storage.set(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  const value = useMemo(() => ({ theme, toggle }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
