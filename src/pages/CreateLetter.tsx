import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store, useStore } from '../store';
import { ArrowRight } from 'lucide-react';

export default function CreateLetter() {
  const { currentUser, users, departments, workflows } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: '', type: 'INTERNAL' as const, priority: 'NORMAL' as const, confidentiality: 'NORMAL' as const,
    body: '', description: '', recipientId: '', recipientDepartmentId: '', dueDate: '', workflowId: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.body.trim()) { setError('موضوع و متن نامه الزامی است'); return; }
    try {
      const letter = store.createLetter({
        subject: form.subject, type: form.type, priority: form.priority, confidentiality: form.confidentiality,
        body: form.body, description: form.description, recipientId: form.recipientId || undefined,
        recipientDepartmentId: form.recipientDepartmentId || undefined, dueDate: form.dueDate || undefined,
        workflowId: form.workflowId || undefined,
      });
      navigate(`/letters/${letter.id}`);
    } catch (err) { setError('خطا در ایجاد نامه'); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={() => navigate('/letters')} className="hover:text-primary-600">نامه‌ها</button>
        <ArrowRight className="w-3 h-3" />
        <span className="text-slate-700">ایجاد نامه جدید</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-lg font-bold text-slate-800 mb-6">ایجاد نامه جدید</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">موضوع <span className="text-red-500">*</span></label>
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="موضوع نامه" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">نوع نامه</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="INTERNAL">داخلی</option>
                <option value="INCOMING">وارده</option>
                <option value="OUTGOING">صادره</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">اولویت</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="LOW">کم</option>
                <option value="NORMAL">عادی</option>
                <option value="HIGH">بالا</option>
                <option value="URGENT">فوری</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">محرمانگی</label>
              <select value={form.confidentiality} onChange={e => setForm({ ...form, confidentiality: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="NORMAL">عادی</option>
                <option value="CONFIDENTIAL">محرمانه</option>
                <option value="HIGHLY_CONFIDENTIAL">خیلی محرمانه</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">گیرنده</label>
              <select value={form.recipientId} onChange={e => setForm({ ...form, recipientId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">انتخاب کاربر...</option>
                {users.filter(u => u.id !== currentUser?.id).map(u => (
                  <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">واحد گیرنده</label>
              <select value={form.recipientDepartmentId} onChange={e => setForm({ ...form, recipientDepartmentId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">انتخاب واحد...</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">مهلت پاسخ</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">گردش کار</label>
              <select value={form.workflowId} onChange={e => setForm({ ...form, workflowId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">بدون گردش کار</option>
                {workflows.filter(w => w.isActive).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">توضیحات</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="توضیحات کوتاه" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">متن نامه <span className="text-red-500">*</span></label>
              <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={8}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="متن نامه را وارد کنید..." />
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              ایجاد نامه
            </button>
            <button type="button" onClick={() => navigate('/letters')} className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
