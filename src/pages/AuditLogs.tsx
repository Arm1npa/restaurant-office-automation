import { useStore } from '../store';
import { ScrollText, Search } from 'lucide-react';
import { useState } from 'react';
import { toPersianDateTime } from '../utils';

export default function AuditLogs() {
  const { currentUser, auditLogs, users } = useStore();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  if (!currentUser?.permissions.includes('audit.read')) {
    return <div className="text-center py-12 text-slate-500">دسترسی غیرمجاز</div>;
  }

  const filtered = auditLogs.filter(log => {
    if (search && !log.description.includes(search)) return false;
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const actions = [...new Set(auditLogs.map(l => l.action))];

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">گزارش عملکرد</h1>
        <p className="text-sm text-slate-500 mt-0.5">تاریخچه عملیات سیستم</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..."
            className="w-full pr-9 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="ALL">همه عملیات</option>
          {actions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <ScrollText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">موردی یافت نشد</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">زمان</th>
                <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">کاربر</th>
                <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">عملیات</th>
                <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">توضیحات</th>
                <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.slice(0, 50).map(log => {
                const user = users.find(u => u.id === log.userId);
                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-600">{toPersianDateTime(log.createdAt)}</td>
                    <td className="px-4 py-3 text-xs text-slate-700 font-medium">{user?.firstName} {user?.lastName}</td>
                    <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">{log.action}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-600">{log.description}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">{log.ipAddress}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
