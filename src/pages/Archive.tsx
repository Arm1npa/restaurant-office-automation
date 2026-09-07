import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { getStatusLabel, getStatusColor, getPriorityDot, getLetterTypeLabel, toPersianDate } from '../utils';
import { Archive as ArchiveIcon, Search } from 'lucide-react';
import { useState } from 'react';

export default function Archive() {
  const { letters, users, departments } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const archived = letters.filter(l => l.status === 'ARCHIVED');
  const filtered = archived.filter(l => {
    if (search && !l.subject.includes(search) && !l.letterNumber.includes(search)) return false;
    if (deptFilter !== 'ALL' && l.senderDepartmentId !== deptFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">بایگانی</h1>
        <p className="text-sm text-slate-500 mt-0.5">نامه‌های بایگانی شده</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..."
            className="w-full pr-9 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="ALL">همه واحدها</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <ArchiveIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">نامه بایگانی شده‌ای یافت نشد</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">شماره</th>
                <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">موضوع</th>
                <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">واحد</th>
                <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">تاریخ بایگانی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(letter => {
                const dept = departments.find(d => d.id === letter.senderDepartmentId);
                return (
                  <tr key={letter.id} onClick={() => navigate(`/letters/${letter.id}`)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-600 font-mono">{letter.letterNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityDot(letter.priority)}`} />
                        <span className="text-sm font-medium text-slate-800">{letter.subject}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{dept?.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{toPersianDate(letter.updatedAt)}</td>
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
