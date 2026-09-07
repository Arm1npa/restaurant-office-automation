import { useState } from 'react';
import { store, useStore } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FileText, Moon, Sun } from 'lucide-react';

export default function Login() {
  const { users } = useStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = store.login(form.username, form.password);
    if (success) navigate('/');
    else setError('نام کاربری یا رمز عبور اشتباه است');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 transition-colors duration-200">
      <button onClick={toggleTheme} className="absolute top-4 left-4 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all">
        {theme === 'light' ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Sun className="w-5 h-5 text-slate-400" />}
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 transition-colors duration-200">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">سیستم اتوماسیون اداری</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">مجموعه رستورانی</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">نام کاربری</label>
              <input type="text" value={form.username} onChange={e => { setForm({ ...form, username: e.target.value }); setError(''); }}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="نام کاربری" autoComplete="username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">رمز عبور</label>
              <input type="password" value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="رمز عبور" autoComplete="current-password" />
            </div>

            {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-800">{error}</div>}

            <button type="submit" className="w-full py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
              ورود به سیستم
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">حساب‌های آزمایشی:</p>
            <div className="grid grid-cols-2 gap-2">
              {users.slice(0, 4).map(u => (
                <button key={u.id} onClick={() => { setForm({ username: u.username, password: '123456' }); setError(''); }}
                  className="text-xs px-2 py-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                  {u.firstName} ({u.username})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
