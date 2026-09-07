import { useStore, store } from '../store';
import { GitBranch, Plus, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toPersianDate } from '../utils';

export default function Workflows() {
  const { currentUser, workflows, users, departments } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', steps: [] as Array<{ title: string; targetId: string; targetType: 'USER' | 'DEPARTMENT' | 'ROLE'; action: 'APPROVE' | 'REJECT' | 'FORWARD' | 'SIGN' | 'REVIEW'; required: boolean }> });

  const addStep = () => {
    setForm({ ...form, steps: [...form.steps, { title: '', targetId: '', targetType: 'USER', action: 'APPROVE', required: true }] });
  };

  const updateStep = (idx: number, data: Partial<typeof form.steps[0]>) => {
    const steps = [...form.steps];
    steps[idx] = { ...steps[idx], ...data };
    setForm({ ...form, steps });
  };

  const removeStep = (idx: number) => {
    setForm({ ...form, steps: form.steps.filter((_, i) => i !== idx) });
  };

  const handleCreate = () => {
    if (!form.name || form.steps.length === 0) return;
    store.addWorkflow({
      name: form.name, description: form.description, isActive: true, createdBy: currentUser!.id,
      steps: form.steps.map((s, i) => ({ id: `step-${Date.now()}-${i}`, workflowId: '', order: i + 1, ...s })),
    });
    setShowCreate(false);
    setForm({ name: '', description: '', steps: [] });
  };

  const getTargetLabel = (step: { targetId: string; targetType: string }) => {
    if (step.targetType === 'USER') return users.find(u => u.id === step.targetId)?.firstName + ' ' + users.find(u => u.id === step.targetId)?.lastName || '-';
    if (step.targetType === 'DEPARTMENT') return departments.find(d => d.id === step.targetId)?.name || '-';
    return step.targetId;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">گردش کار</h1>
          <p className="text-sm text-slate-500 mt-0.5">مدیریت گردش‌های کاری سازمان</p>
        </div>
        {currentUser?.permissions.includes('workflows.manage') && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">
            <Plus className="w-4 h-4" /> گردش کار جدید
          </button>
        )}
      </div>

      <div className="space-y-4">
        {workflows.map(wf => (
          <div key={wf.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-primary-600" />
                  {wf.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{wf.description}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${wf.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {wf.isActive ? 'فعال' : 'غیرفعال'}
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {wf.steps.sort((a, b) => a.order - b.order).map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-slate-50 border border-slate-200 whitespace-nowrap">
                    <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                    <div>
                      <p className="font-medium text-slate-700">{step.title}</p>
                      <p className="text-[10px] text-slate-500">{getTargetLabel(step)} • {step.action}</p>
                    </div>
                  </div>
                  {idx < wf.steps.length - 1 && <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 rotate-180" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">ایجاد گردش کار جدید</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">نام</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="نام گردش کار" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">توضیحات</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="توضیحات" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">مراحل</label>
                  <button onClick={addStep} className="text-xs text-primary-600 hover:text-primary-700">+ افزودن مرحله</button>
                </div>
                <div className="space-y-3">
                  {form.steps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500">مرحله {idx + 1}</span>
                        <button onClick={() => removeStep(idx)} className="text-xs text-red-500">حذف</button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input value={step.title} onChange={e => updateStep(idx, { title: e.target.value })} className="px-2 py-1.5 border border-slate-200 rounded text-xs" placeholder="عنوان" />
                        <select value={step.action} onChange={e => updateStep(idx, { action: e.target.value as any })} className="px-2 py-1.5 border border-slate-200 rounded text-xs">
                          <option value="APPROVE">تأیید</option>
                          <option value="REJECT">رد</option>
                          <option value="FORWARD">ارجاع</option>
                          <option value="SIGN">امضا</option>
                          <option value="REVIEW">بررسی</option>
                        </select>
                        <select value={step.targetType} onChange={e => updateStep(idx, { targetType: e.target.value as any })} className="px-2 py-1.5 border border-slate-200 rounded text-xs">
                          <option value="USER">کاربر</option>
                          <option value="DEPARTMENT">واحد</option>
                        </select>
                        <select value={step.targetId} onChange={e => updateStep(idx, { targetId: e.target.value })} className="px-2 py-1.5 border border-slate-200 rounded text-xs">
                          <option value="">انتخاب...</option>
                          {step.targetType === 'USER' ? users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>) : departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleCreate} className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">ایجاد</button>
                <button onClick={() => setShowCreate(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
