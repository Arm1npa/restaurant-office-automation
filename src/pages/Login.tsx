import { useState } from 'react';
import { store } from '../store';
import { FileText, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = store.login(username, password);
    if (!user) setError('نام کاربری یا رمز عبور اشتباه است');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">سیستم اتوماسیون اداری</h1>
          <p className="text-slate-500 mt-1">مجموعه رستورانی</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">نام کاربری</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="نام کاربری"
                  className="w-full pr-10 pl-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="رمز عبور"
                  className="w-full pr-10 pl-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">{error}</div>}

            <button type="submit" className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200">
              ورود به سیستم
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center mb-3">کاربران نمونه:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { u: 'admin', r: 'مدیر ارشد' },
                { u: 'finance_mgr', r: 'مدیر مالی' },
                { u: 'accountant', r: 'حسابدار' },
                { u: 'restaurant_mgr', r: 'مدیر رستوران' },
                { u: 'hr_mgr', r: 'مدیر منابع انسانی' },
                { u: 'auditor', r: 'بازرس' },
              ].map(item => (
                <button key={item.u} onClick={() => { setUsername(item.u); setPassword('1234'); }}
                  className="text-right px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                  <span className="font-medium">{item.r}</span>
                  <span className="text-slate-400 mr-1">({item.u})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
