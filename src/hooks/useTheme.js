import { useCallback, useEffect, useState } from 'react';
import { readStored, writeStored } from '../utils/storage';

const THEME_KEY = 'sayless-theme';

function getInitialTheme() {
  const saved = readStored(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    writeStored(THEME_KEY, next);
  }, [theme]);

  return { theme, toggleTheme };
}
