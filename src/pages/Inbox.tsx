import { useStore, store } from '../store';
import { useNavigate } from 'react-router-dom';
import { getStatusLabel, getStatusColor, getPriorityDot, timeAgo } from '../utils';
import { Inbox as InboxIcon, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Inbox() {
  const { currentUser, referrals, letters, users } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'READ' | 'COMPLETED'>('ALL');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const myRefs = referrals.filter(r => r.toUserId === currentUser?.id);
  const filtered = myRefs.filter(r => {
    const letter = letters.find(l => l.id === r.letterId);
    if (!letter) return false;
    if (search && !letter.subject.includes(search) && !letter.letterNumber.includes(search)) return false;
    if (filter !== 'ALL' && r.status !== filter) return false;
    if (showUnreadOnly && r.readAt) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleOpen = (refId: string, letterId: string) => {
    store.markReferralRead(refId);
    navigate(`/letters/${letterId}`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">صندوق ورودی</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">نامه‌های دریافتی و ارجاعات</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو در موضوع یا شماره..."
            className="w-full pr-9 pl-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors" />
        </div>
        <div className="flex gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-0.5">
          {[
            { key: 'ALL', label: 'همه' },
            { key: 'PENDING', label: 'در انتظار' },
            { key: 'READ', label: 'مشاهده شده' },
            { key: 'COMPLETED', label: 'تکمیل شده' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f.key ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${showUnreadOnly ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'}`}>
          {showUnreadOnly ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          فقط خوانده نشده
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-100 dark:border-slate-700 transition-colors duration-200">
          <InboxIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">صندوق ورودی خالی است</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm divide-y divide-slate-50 dark:divide-slate-700/50 transition-colors duration-200">
          {filtered.map(ref => {
            const letter = letters.find(l => l.id === ref.letterId);
            if (!letter) return null;
            const sender = users.find(u => u.id === letter.senderId);
            return (
              <div key={ref.id} onClick={() => handleOpen(ref.id, letter.id)}
                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors flex items-center gap-4 ${!ref.readAt ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${!ref.readAt ? 'bg-blue-500' : getPriorityDot(letter.priority)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{letter.subject}</p>
                    {!ref.readAt && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{letter.letterNumber}</span>
                    {sender && <span className="text-xs text-slate-400 dark:text-slate-500">از: {sender.firstName} {sender.lastName}</span>}
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(letter.status)}`}>
                    {getStatusLabel(letter.status)}
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{timeAgo(ref.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
