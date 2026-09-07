import { useStore, store } from '../store';
import { useNavigate } from 'react-router-dom';
import { getStatusLabel, getStatusColor, getPriorityDot, toPersianDate, timeAgo } from '../utils';
import { Inbox as InboxIcon, Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function Inbox() {
  const { currentUser, referrals, letters, users } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const myRefs = referrals.filter(r => r.toUserId === currentUser?.id);
  const myLetters = myRefs.map(r => {
    const letter = letters.find(l => l.id === r.letterId);
    return letter ? { ...letter, referral: r } : null;
  }).filter(Boolean) as Array<typeof letters[0] & { referral: typeof referrals[0] }>;

  const filtered = myLetters.filter(l => {
    if (search && !l.subject.includes(search) && !l.letterNumber.includes(search)) return false;
    if (statusFilter !== 'ALL' && l.referral.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.referral.createdAt).getTime() - new Date(a.referral.createdAt).getTime());

  const handleRead = (refId: string, letterId: string) => {
    store.readReferral(refId);
    navigate(`/letters/${letterId}`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">صندوق ورودی</h1>
          <p className="text-sm text-slate-500 mt-0.5">نامه‌های دریافتی و ارجاعات</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..."
            className="w-full pr-9 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="ALL">همه وضعیت‌ها</option>
          <option value="PENDING">در انتظار</option>
          <option value="READ">خوانده شده</option>
          <option value="COMPLETED">تکمیل شده</option>
          <option value="REJECTED">رد شده</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <InboxIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">صندوق ورودی خالی است</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {filtered.map(item => {
            const sender = users.find(u => u.id === item.senderId);
            return (
              <div key={item.id} onClick={() => handleRead(item.referral.id, item.id)}
                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-4 ${!item.referral.readAt ? 'bg-blue-50/30' : ''}`}>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getPriorityDot(item.priority)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.subject}</p>
                    {!item.referral.readAt && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">{item.letterNumber}</span>
                    <span className="text-xs text-slate-400">از: {sender?.firstName} {sender?.lastName}</span>
                  </div>
                  {item.referral.message && <p className="text-xs text-slate-500 mt-1 truncate">«{item.referral.message}»</p>}
                </div>
                <div className="text-left shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{timeAgo(item.referral.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
