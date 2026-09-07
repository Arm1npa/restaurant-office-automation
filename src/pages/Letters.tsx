import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { getStatusLabel, getStatusColor, getPriorityDot, getLetterTypeLabel, toPersianDate } from '../utils';
import { FileText, Search, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Letters() {
  const { currentUser, letters } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filtered = letters.filter(l => {
    if (search && !l.subject.includes(search) && !l.letterNumber.includes(search)) return false;
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && l.type !== typeFilter) return false;
    if (priorityFilter !== 'ALL' && l.priority !== priorityFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">نامه‌ها</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">مدیریت تمام نامه‌های سیستم</p>
        </div>
        {currentUser?.permissions.includes('letters.create') && (
          <button onClick={() => navigate('/letters/create')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            نامه جدید
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو در موضوع یا شماره..."
            className="w-full pr-9 pl-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
          <option value="ALL">همه وضعیت‌ها</option>
          <option value="DRAFT">پیش‌نویس</option>
          <option value="REGISTERED">ثبت شده</option>
          <option value="PENDING">در انتظار</option>
          <option value="FORWARDED">ارجاع شده</option>
          <option value="WAITING_APPROVAL">در انتظار تأیید</option>
          <option value="APPROVED">تأیید شده</option>
          <option value="REJECTED">رد شده</option>
          <option value="SIGNED">امضا شده</option>
          <option value="ARCHIVED">بایگانی شده</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
          <option value="ALL">همه انواع</option>
          <option value="INCOMING">وارده</option>
          <option value="OUTGOING">صادره</option>
          <option value="INTERNAL">داخلی</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
          <option value="ALL">همه اولویت‌ها</option>
          <option value="LOW">کم</option>
          <option value="NORMAL">عادی</option>
          <option value="HIGH">بالا</option>
          <option value="URGENT">فوری</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-100 dark:border-slate-700 transition-colors duration-200">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">نامه‌ای یافت نشد</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-200">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="text-right text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">شماره</th>
                <th className="text-right text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">موضوع</th>
                <th className="text-right text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">نوع</th>
                <th className="text-right text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">اولویت</th>
                <th className="text-right text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">وضعیت</th>
                <th className="text-right text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">تاریخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {filtered.map(letter => (
                <tr key={letter.id} onClick={() => navigate(`/letters/${letter.id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 font-mono">{letter.letterNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityDot(letter.priority)}`} />
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{letter.subject}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{getLetterTypeLabel(letter.type)}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{letter.priority === 'URGENT' ? '🔴 فوری' : letter.priority === 'HIGH' ? '🟠 بالا' : letter.priority === 'NORMAL' ? '🔵 عادی' : '⚪ کم'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(letter.status)}`}>
                      {getStatusLabel(letter.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{toPersianDate(letter.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
