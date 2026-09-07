import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';
const KEY = 'office_theme';

function getInitial(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* ignore */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

let current: Theme = getInitial();
const subscribers = new Set<() => void>();

function apply() {
  document.documentElement.classList.toggle('dark', current === 'dark');
  try { localStorage.setItem(KEY, current); } catch { /* ignore */ }
}
apply();

export function toggleTheme() {
  current = current === 'dark' ? 'light' : 'dark';
  apply();
  subscribers.forEach(fn => fn());
}

export function useTheme() {
  const theme = useSyncExternalStore(
    (cb) => { subscribers.add(cb); return () => { subscribers.delete(cb); }; },
    () => current
  );
  return { theme, isDark: theme === 'dark', toggle: toggleTheme };
}
