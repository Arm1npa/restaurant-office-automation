import { useStore, store } from '../store';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { timeAgo, getNotificationTypeLabel } from '../utils';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const { currentUser, notifications } = useStore();
  const navigate = useNavigate();

  const myNotifs = notifications.filter(n => n.userId === currentUser?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = myNotifs.filter(n => !n.isRead).length;

  const markAllRead = () => {
    myNotifs.filter(n => !n.isRead).forEach(n => store.markNotificationRead(n.id));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">اعلان‌ها</h1>
          <p className="text-sm text-slate-500 mt-0.5">{unreadCount > 0 ? `${unreadCount} اعلان خوانده نشده` : 'همه اعلان‌ها خوانده شده'}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <CheckCheck className="w-4 h-4" />
            خواندن همه
          </button>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">اعلانی وجود ندارد</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {myNotifs.map(notif => (
            <div key={notif.id} onClick={() => { if (notif.letterId) { store.markNotificationRead(notif.id); navigate(`/letters/${notif.letterId}`); } else { store.markNotificationRead(notif.id); } }}
              className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{getNotificationTypeLabel(notif.type)}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                <p className="text-[10px] text-slate-400 mt-1">{timeAgo(notif.createdAt)}</p>
              </div>
              {!notif.isRead && (
                <button onClick={(e) => { e.stopPropagation(); store.markNotificationRead(notif.id); }}
                  className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-primary-600">
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
