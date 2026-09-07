import { useStore, store } from '../store';
import { useNavigate } from 'react-router-dom';
import { getStatusLabel, getStatusColor, toPersianDateTime, timeAgo } from '../utils';
import { CheckSquare, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Approvals() {
  const { currentUser, approvals, letters, users } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const myApprovals = approvals.filter(a => a.approverId === currentUser?.id);
  const filtered = myApprovals.filter(a => a.status === tab.toUpperCase());

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">تأییدیه‌ها</h1>
        <p className="text-sm text-slate-500 mt-0.5">مدیریت درخواست‌های تأیید</p>
      </div>

      <div className="flex gap-2">
        {[
          { key: 'pending', label: 'در انتظار', icon: Clock, count: myApprovals.filter(a => a.status === 'PENDING').length },
          { key: 'approved', label: 'تأیید شده', icon: CheckCircle2, count: myApprovals.filter(a => a.status === 'APPROVED').length },
          { key: 'rejected', label: 'رد شده', icon: XCircle, count: myApprovals.filter(a => a.status === 'REJECTED').length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-primary-50 text-primary-700' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
            <t.icon className="w-4 h-4" />
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">موردی یافت نشد</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {filtered.map(approval => {
            const letter = letters.find(l => l.id === approval.letterId);
            if (!letter) return null;
            return (
              <div key={approval.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/letters/${letter.id}`)}>
                    <p className="text-sm font-medium text-slate-800">{letter.subject}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{letter.letterNumber} • {timeAgo(approval.createdAt)}</p>
                    {approval.comment && <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded">«{approval.comment}»</p>}
                  </div>
                  <div className="flex items-center gap-2 mr-4">
                    {approval.status === 'PENDING' && (
                      <>
                        <button onClick={() => store.approveLetter(letter.id)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">تأیید</button>
                      </>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(letter.status)}`}>
                      {getStatusLabel(letter.status)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
