import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { store, useStore } from '../store';
import { toPersianNumber } from '../utils';
import { Home, Inbox, Send, FileText, CheckSquare, Archive, GitBranch, Users, Building2, ScrollText, Bell, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { currentUser, notifications } = useStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.isRead).length;

  const handleLogout = () => { store.logout(); navigate('/login'); };

  const navItems = [
    { to: '/', icon: Home, label: 'داشبورد', end: true },
    { to: '/inbox', icon: Inbox, label: 'صندوق ورودی' },
    { to: '/outbox', icon: Send, label: 'صندوق خروجی' },
    { to: '/letters', icon: FileText, label: 'نامه‌ها' },
    { to: '/approvals', icon: CheckSquare, label: 'تأییدیه‌ها' },
    { to: '/archive', icon: Archive, label: 'بایگانی' },
    { to: '/workflows', icon: GitBranch, label: 'گردش کار' },
    { to: '/notifications', icon: Bell, label: 'اعلان‌ها', badge: unreadCount },
    ...(currentUser?.permissions.includes('users.manage') ? [{ to: '/users', icon: Users, label: 'کاربران' }] : []),
    { to: '/departments', icon: Building2, label: 'واحدها' },
    ...(currentUser?.permissions.includes('audit.read') ? [{ to: '/audit-logs', icon: ScrollText, label: 'گزارش عملکرد' }] : []),
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white border-l border-slate-200 flex flex-col transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-slate-800">اتوماسیون اداری</h1>
                <p className="text-[10px] text-slate-500">مجموعه رستورانی</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded hover:bg-slate-100">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <item.icon className="w-4.5 h-4.5" />
              <span>{item.label}</span>
              {item.badge ? <span className="mr-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{toPersianNumber(item.badge)}</span> : null}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs">
              {currentUser?.firstName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{currentUser?.firstName} {currentUser?.lastName}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="خروج">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-lg hover:bg-slate-100">
              <Bell className="w-5 h-5 text-slate-500" />
              {unreadCount > 0 && <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
