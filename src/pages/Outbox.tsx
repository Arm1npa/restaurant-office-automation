import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { getStatusLabel, getStatusColor, getPriorityDot, toPersianDate } from '../utils';
import { Send, Search } from 'lucide-react';
import { useState } from 'react';

export default function Outbox() {
  const { currentUser, letters, referrals, users } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const myLetters = letters.filter(l => l.creatorId === currentUser?.id || l.senderId === currentUser?.id);
  const filtered = myLetters.filter(l => {
    if (search && !l.subject.includes(search) && !l.letterNumber.includes(search)) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">صندوق خروجی</h1>
        <p className="text-sm text-slate-500 mt-0.5">نامه‌های ارسالی و ایجاد شده</p>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..."
          className="w-full pr-9 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">هنوز نامه‌ای ارسال نکرده‌اید</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {filtered.map(letter => {
            const recipient = letter.recipientId ? users.find(u => u.id === letter.recipientId) : null;
            const refCount = referrals.filter(r => r.letterId === letter.id).length;
            return (
              <div key={letter.id} onClick={() => navigate(`/letters/${letter.id}`)}
                className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getPriorityDot(letter.priority)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{letter.subject}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">{letter.letterNumber}</span>
                    {recipient && <span className="text-xs text-slate-400">به: {recipient.firstName} {recipient.lastName}</span>}
                    {refCount > 0 && <span className="text-xs text-primary-600">{refCount} ارجاع</span>}
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(letter.status)}`}>
                    {getStatusLabel(letter.status)}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{toPersianDate(letter.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
