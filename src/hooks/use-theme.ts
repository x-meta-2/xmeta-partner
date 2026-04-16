import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
const THEME_STORAGE_KEY = 'x-meta-theme';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme: ThemeMode) {
  const htmlElement = document.documentElement;
  if (theme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    htmlElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    htmlElement.removeAttribute('data-theme');
    htmlElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
}

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme());

  const toggleTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    // Dispatch a storage event to sync other components in the same window
    window.dispatchEvent(new Event('storage-theme'));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const current = getInitialTheme();
      setThemeState(current);
      applyTheme(current);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage-theme', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage-theme', handleStorageChange);
    };
  }, []);

  return { theme, toggleTheme };
};
