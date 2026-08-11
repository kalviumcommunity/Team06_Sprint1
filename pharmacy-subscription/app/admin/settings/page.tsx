'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark';

export default function AdminSettingsPage() {
  const [theme, setTheme] = useState<Theme>('light');
  const [saved, setSaved] = useState(false);

  // Read current theme from localStorage on mount
  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme) ?? 'light';
    setTheme(stored);
  }, []);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const options: { value: Theme; label: string; description: string; icon: React.ElementType }[] = [
    {
      value: 'light',
      label: 'Light Theme',
      description: 'Clean white dashboard with light backgrounds.',
      icon: Sun,
    },
    {
      value: 'dark',
      label: 'Dark Theme',
      description: 'Dark slate dashboard, easy on the eyes.',
      icon: Moon,
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your Admin Dashboard preferences.
        </p>
      </div>

      {/* Theme selection card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/40">
            <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Appearance</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose your preferred theme. Changes take effect immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map(({ value, label, description, icon: Icon }) => {
            const isActive = theme === value;
            return (
              <button
                key={value}
                type="button"
                id={`theme-${value}`}
                onClick={() => applyTheme(value)}
                className={`group flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-300 dark:ring-blue-600'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-slate-600'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300 group-hover:bg-blue-100 dark:group-hover:bg-slate-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className={`font-bold ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
                </div>
                {isActive && (
                  <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10.28 2.28a.75.75 0 0 0-1.06 0L4.5 7 2.78 5.28a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06Z" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {saved && (
          <p className="mt-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            ✓ Theme saved and applied.
          </p>
        )}
      </div>

      {/* Info note */}
      <div className="rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
        Theme selection is stored in your browser and persists across page reloads and navigation.
      </div>
    </div>
  );
}
