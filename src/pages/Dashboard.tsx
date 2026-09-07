import { useStore } from '../store';
import { toPersianNumber, getStatusLabel, getStatusColor, getPriorityDot, toPersianDate } from '../utils';
import { FileText, Clock, CheckCircle2, AlertTriangle, PenTool, Archive as ArchiveIcon, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { currentUser, letters, referrals, approvals, notifications } = useStore();
  const navigate = useNavigate();

  const myReferrals = referrals.filter(r => r.toUserId === currentUser?.id);
  const myPending = myReferrals.filter(r => r.status === 'PENDING' || r.status === 'READ');
  const needsApproval = approvals.filter(a => a.approverId === currentUser?.id && a.status === 'PENDING');
  const urgentLetters = letters.filter(l => l.priority === 'URGENT' && l.status !== 'ARCHIVED' && l.status !== 'SIGNED');
  const unreadNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.isRead);

  const cards = [
    { label: 'کل نامه‌ها', value: letters.length, icon: FileText, color: 'bg-blue-500', bg: 'bg-blue-50' },
    { label: 'در انتظار اقدام', value: myPending.length, icon: Clock, color: 'bg-amber-500', bg: 'bg-amber-50' },
    { label: 'نیازمند تأیید', value: needsApproval.length, icon: CheckCircle2, color: 'bg-green-500', bg: 'bg-green-50' },
    { label: 'فوری', value: urgentLetters.length, icon: AlertTriangle, color: 'bg-red-500', bg: 'bg-red-50' },
    { label: 'امضا شده', value: letters.filter(l => l.status === 'SIGNED').length, icon: PenTool, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
    { label: 'بایگانی شده', value: letters.filter(l => l.status === 'ARCHIVED').length, icon: ArchiveIcon, color: 'bg-slate-500', bg: 'bg-slate-50' },
    { label: 'اعلان‌های خوانده نشده', value: unreadNotifs.length, icon: TrendingUp, color: 'bg-purple-500', bg: 'bg-purple-50' },
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">داشبورد</h1>
        <p className="text-sm text-slate-500 mt-1">خوش آمدید، {currentUser?.firstName} {currentUser?.lastName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon className={`w-4 h-4 ${card.color.replace('bg-', 'text-')}`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{toPersianNumber(card.value)}</p>
            <p className="text-xs text-slate-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">نامه‌ها بر اساس وضعیت</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${toPersianNumber(value)}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: number) => toPersianNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">نامه‌ها بر اساس اولویت</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => toPersianNumber(value)} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="تعداد" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Letters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">آخرین نامه‌ها</h3>
          <button onClick={() => navigate('/letters')} className="text-xs text-primary-600 hover:text-primary-700">مشاهده همه</button>
        </div>
        <div className="divide-y divide-slate-50">
          {recentLetters.map(letter => (
            <div key={letter.id} onClick={() => navigate(`/letters/${letter.id}`)} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${getPriorityDot(letter.priority)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{letter.subject}</p>
                <p className="text-xs text-slate-500 mt-0.5">{letter.letterNumber}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(letter.status)}`}>
                {getStatusLabel(letter.status)}
              </span>
              <span className="text-xs text-slate-400">{toPersianDate(letter.updatedAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
