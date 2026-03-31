import { useLayoutEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'theme';

export function getInitialIsDark() {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme ? savedTheme === 'dark' : true;
  } catch {
    return true;
  }
}

export function applyTheme(isDark) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage failures and keep the in-memory theme state.
    }
  }
}

export function useThemePreference() {
  const [isDark, setIsDark] = useState(getInitialIsDark);

  useLayoutEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  return [isDark, setIsDark];
}
