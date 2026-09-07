import { useStore, store } from '../store';
import { getRoleLabel } from '../utils';
import { Users as UsersIcon, Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function Users() {
  const { currentUser, users, departments, positions } = useStore();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', phone: '', departmentId: '', positionId: '', role: 'STAFF' as const });

  if (!currentUser?.permissions.includes('users.manage')) {
    return <div className="text-center py-12 text-slate-500">دسترسی غیرمجاز</div>;
  }

  const filtered = users.filter(u => {
    if (search && !`${u.firstName} ${u.lastName} ${u.username}`.includes(search)) return false;
    return true;
  });

  const handleCreate = () => {
    if (!form.firstName || !form.username) return;
    store.addUser({ ...form, status: 'ACTIVE', permissions: ['documents.read', 'letters.read'] });
    setShowCreate(false);
    setForm({ firstName: '', lastName: '', username: '', email: '', phone: '', departmentId: '', positionId: '', role: 'STAFF' });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">کاربران</h1>
          <p className="text-sm text-slate-500 mt-0.5">مدیریت کاربران سیستم</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
          <Plus className="w-4 h-4" /> کاربر جدید
        </button>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..."
          className="w-full pr-9 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">نام</th>
              <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">نام کاربری</th>
              <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">واحد</th>
              <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">سمت</th>
              <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">نقش</th>
              <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(user => {
              const dept = departments.find(d => d.id === user.departmentId);
              const pos = positions.find(p => p.id === user.positionId);
              return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-[10px]">{user.firstName[0]}</div>
                      <span className="text-sm font-medium text-slate-800">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 font-mono">{user.username}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{dept?.name || '-'}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{pos?.title || '-'}</td>
                  <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{getRoleLabel(user.role)}</span></td>
                  <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{user.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">کاربر جدید</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="نام" />
                <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="نام خانوادگی" />
              </div>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="نام کاربری" />
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="ایمیل" />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="تلفن" />
              <select value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option value="">واحد سازمانی...</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option value="STAFF">کارمند</option>
                <option value="MANAGER">مدیر</option>
                <option value="ACCOUNTANT">حسابدار</option>
                <option value="ADMIN">مدیر سیستم</option>
                <option value="AUDITOR">بازرس</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button onClick={handleCreate} className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">ایجاد</button>
                <button onClick={() => setShowCreate(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
