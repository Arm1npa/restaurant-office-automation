import { useStore } from '../store';
import { toPersianNumber, getStatusLabel, getStatusColor, getPriorityDot, toPersianDate } from '../utils';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Clock, CheckCircle2, AlertTriangle, PenTool, Archive as ArchiveIcon, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { currentUser, letters, referrals, approvals, notifications } = useStore();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const myReferrals = referrals.filter(r => r.toUserId === currentUser?.id);
  const myPending = myReferrals.filter(r => r.status === 'PENDING' || r.status === 'READ');
  const needsApproval = approvals.filter(a => a.approverId === currentUser?.id && a.status === 'PENDING');
  const urgentLetters = letters.filter(l => l.priority === 'URGENT' && l.status !== 'ARCHIVED' && l.status !== 'SIGNED');
  const unreadNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.isRead);

  const cards = [
    { label: 'کل نامه‌ها', value: letters.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'در انتظار اقدام', value: myPending.length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { label: 'نیازمند تأیید', value: needsApproval.length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30' },
    { label: 'فوری', value: urgentLetters.length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30' },
    { label: 'امضا شده', value: letters.filter(l => l.status === 'SIGNED').length, icon: PenTool, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'بایگانی شده', value: letters.filter(l => l.status === 'ARCHIVED').length, icon: ArchiveIcon, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-700/50' },
  ];

  // Chart data
  const statusData = Object.entries(
    letters.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: getStatusLabel(name), value }));

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#6366f1', '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#64748b'];

  const priorityData = [
    { name: 'کم', count: letters.filter(l => l.priority === 'LOW').length },
    { name: 'عادی', count: letters.filter(l => l.priority === 'NORMAL').length },
    { name: 'بالا', count: letters.filter(l => l.priority === 'HIGH').length },
    { name: 'فوری', count: letters.filter(l => l.priority === 'URGENT').length },
  ];

  const recentLetters = [...letters].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  const isDark = theme === 'dark';
  const chartTextColor = isDark ? '#94a3b8' : '#64748b';
  const chartGridColor = isDark ? '#334155' : '#f1f5f9';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">داشبورد</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">خوش آمدید، {currentUser?.firstName} {currentUser?.lastName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{toPersianNumber(card.value)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">نامه‌ها بر اساس وضعیت</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" 
                  label={({ name, value }) => `${name}: ${toPersianNumber(value)}`}
                  labelLine={false}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '8px', color: isDark ? '#e2e8f0' : '#1e293b' }}
                  formatter={(value: number) => toPersianNumber(value)} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">داده‌ای موجود نیست</div>
          )}
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">نامه‌ها بر اساس اولویت</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: chartTextColor }} />
              <YAxis tick={{ fontSize: 12, fill: chartTextColor }} />
              <Tooltip 
                contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '8px', color: isDark ? '#e2e8f0' : '#1e293b' }}
                formatter={(value: number) => toPersianNumber(value)} 
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="تعداد" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Letters */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">آخرین نامه‌ها</h3>
            <button onClick={() => navigate('/letters')} className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">مشاهده همه</button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {recentLetters.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">نامه‌ای وجود ندارد</div>
            ) : (
              recentLetters.map(letter => (
                <div key={letter.id} onClick={() => navigate(`/letters/${letter.id}`)} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getPriorityDot(letter.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{letter.subject}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{letter.letterNumber}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${getStatusColor(letter.status)}`}>
                    {getStatusLabel(letter.status)}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{toPersianDate(letter.updatedAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">اعلان‌های اخیر</h3>
            <button onClick={() => navigate('/notifications')} className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">همه</button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {unreadNotifs.length === 0 && notifications.filter(n => n.userId === currentUser?.id).length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 dark:text-slate-500">اعلانی وجود ندارد</p>
              </div>
            ) : (
              notifications.filter(n => n.userId === currentUser?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5).map(notif => (
                <div key={notif.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors" onClick={() => { if (notif.letterId) navigate(`/letters/${notif.letterId}`); }}>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{notif.title}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
