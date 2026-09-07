import { useStore, store } from '../store';
import { Building2, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { toPersianNumber } from '../utils';

export default function Departments() {
  const { currentUser, departments, users } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', code: '' });

  const handleCreate = () => {
    if (!form.name || !form.code) return;
    store.addDepartment({ name: form.name, code: form.code });
    setShowCreate(false);
    setForm({ name: '', code: '' });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">واحدهای سازمانی</h1>
          <p className="text-sm text-slate-500 mt-0.5">مدیریت ساختار سازمانی</p>
        </div>
        {currentUser?.permissions.includes('departments.manage') && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
            <Plus className="w-4 h-4" /> واحد جدید
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(dept => {
          const memberCount = users.filter(u => u.departmentId === dept.id).length;
          return (
            <div key={dept.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{dept.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{dept.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5" />
                <span>{toPersianNumber(memberCount)} عضو</span>
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">واحد جدید</h3>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="نام واحد" />
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="کد (مثلاً HR)" />
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
