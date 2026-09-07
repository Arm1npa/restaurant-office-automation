import { useParams, useNavigate } from 'react-router-dom';
import { useStore, store } from '../store';
import { getStatusLabel, getStatusColor, getPriorityLabel, getPriorityColor, getLetterTypeLabel, getConfidentialityLabel, toPersianDateTime, timeAgo } from '../utils';
import { ArrowRight, CheckCircle2, XCircle, PenTool, Archive, Forward, Clock, User, Building2, Paperclip, GitBranch, AlertTriangle, Shield, FileText } from 'lucide-react';
import { useState } from 'react';

export default function LetterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, letters, users, departments, referrals, approvals, signatures, timeline, attachments, workflows } = useStore();
  const [showForward, setShowForward] = useState(false);
  const [forwardTo, setForwardTo] = useState('');
  const [forwardMsg, setForwardMsg] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [showSignConfirm, setShowSignConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const letter = letters.find(l => l.id === id);
  if (!letter) return <div className="text-center py-12 text-slate-500">نامه یافت نشد</div>;

  const sender = users.find(u => u.id === letter.senderId);
  const recipient = letter.recipientId ? users.find(u => u.id === letter.recipientId) : null;
  const senderDept = departments.find(d => d.id === letter.senderDepartmentId);
  const letterRefs = referrals.filter(r => r.letterId === letter.id);
  const letterApprovals = approvals.filter(a => a.letterId === letter.id);
  const letterSignatures = signatures.filter(s => s.letterId === letter.id);
  const letterTimeline = timeline.filter(t => t.letterId === letter.id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const letterAttachments = attachments.filter(a => a.letterId === letter.id);
  const workflow = letter.workflowId ? workflows.find(w => w.id === letter.workflowId) : null;

  const canApprove = currentUser?.permissions.includes('letters.approve') && (letter.status === 'PENDING' || letter.status === 'WAITING_APPROVAL' || letter.status === 'FORWARDED');
  const canReject = currentUser?.permissions.includes('letters.reject') && (letter.status === 'PENDING' || letter.status === 'WAITING_APPROVAL' || letter.status === 'FORWARDED');
  const canSign = currentUser?.permissions.includes('letters.sign') && letter.status === 'APPROVED';
  const canForward = currentUser?.permissions.includes('documents.forward') && letter.status !== 'ARCHIVED' && letter.status !== 'SIGNED' && letter.status !== 'CANCELLED';
  const canArchive = letter.status === 'APPROVED' || letter.status === 'SIGNED';
  const canRegister = letter.status === 'DRAFT' && letter.creatorId === currentUser?.id;
  const isLocked = letter.status === 'SIGNED' || letter.status === 'ARCHIVED';

  const handleForward = () => {
    if (!forwardTo) return;
    store.forwardLetter(letter.id, forwardTo, forwardMsg);
    setShowForward(false);
    setForwardTo('');
    setForwardMsg('');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    store.rejectLetter(letter.id, rejectReason);
    setShowReject(false);
    setRejectReason('');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={() => navigate('/letters')} className="hover:text-primary-600">نامه‌ها</button>
        <ArrowRight className="w-3 h-3" />
        <span className="text-slate-700">{letter.subject}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Letter Info Card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-lg font-bold text-slate-800">{letter.subject}</h1>
                <p className="text-xs text-slate-500 mt-1 font-mono">{letter.letterNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(letter.status)}`}>
                  {getStatusLabel(letter.status)}
                </span>
                {letter.confidentiality !== 'NORMAL' && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                    <Shield className="w-3 h-3" />
                    {getConfidentialityLabel(letter.confidentiality)}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500 text-xs">نوع</p>
                <p className="font-medium text-slate-700">{getLetterTypeLabel(letter.type)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">اولویت</p>
                <p className={`font-medium ${getPriorityColor(letter.priority)}`}>{getPriorityLabel(letter.priority)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">فرستنده</p>
                <p className="font-medium text-slate-700">{sender?.firstName} {sender?.lastName}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">گیرنده</p>
                <p className="font-medium text-slate-700">{recipient ? `${recipient.firstName} ${recipient.lastName}` : '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">واحد</p>
                <p className="font-medium text-slate-700">{senderDept?.name}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">تاریخ ثبت</p>
                <p className="font-medium text-slate-700">{letter.registeredAt ? toPersianDateTime(letter.registeredAt) : '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">نسخه</p>
                <p className="font-medium text-slate-700">{letter.version}</p>
              </div>
              {letter.dueDate && (
                <div>
                  <p className="text-slate-500 text-xs">مهلت پاسخ</p>
                  <p className="font-medium text-red-600">{toPersianDateTime(letter.dueDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">متن نامه</h3>
            <div className="text-sm text-slate-700 leading-7 whitespace-pre-wrap bg-slate-50 rounded-lg p-4 border border-slate-100">
              {letter.body}
            </div>
            {isLocked && (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5" />
                این سند امضا/بایگانی شده و قابل ویرایش نیست.
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              پیوست‌ها ({letterAttachments.length})
            </h3>
            {letterAttachments.length === 0 ? (
              <p className="text-xs text-slate-400">فایلی پیوست نشده است</p>
            ) : (
              <div className="space-y-2">
                {letterAttachments.map(att => (
                  <div key={att.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700 flex-1">{att.originalName}</span>
                    <span className="text-xs text-slate-400">{(att.size / 1024).toFixed(0)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workflow Steps */}
          {workflow && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                گردش کار: {workflow.name}
              </h3>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {workflow.steps.map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap ${idx < letter.currentStepIndex ? 'bg-green-50 text-green-700 border border-green-200' : idx === letter.currentStepIndex ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                      {idx < letter.currentStepIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx === letter.currentStepIndex ? <Clock className="w-3.5 h-3.5" /> : <span className="w-3.5 h-3.5 rounded-full border border-current" />}
                      {step.title}
                    </div>
                    {idx < workflow.steps.length - 1 && <div className="w-4 h-0.5 bg-slate-200" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">عملیات</h3>
            {canRegister && (
              <button onClick={() => store.registerLetter(letter.id)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                ثبت نامه
              </button>
            )}
            {canForward && (
              <button onClick={() => setShowForward(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                <Forward className="w-4 h-4" />
                ارجاع
              </button>
            )}
            {canApprove && (
              <button onClick={() => store.approveLetter(letter.id)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                <CheckCircle2 className="w-4 h-4" />
                تأیید
              </button>
            )}
            {canReject && (
              <button onClick={() => setShowReject(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                <XCircle className="w-4 h-4" />
                رد
              </button>
            )}
            {canSign && (
              <button onClick={() => setShowSignConfirm(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                <PenTool className="w-4 h-4" />
                امضا
              </button>
            )}
            {canArchive && (
              <button onClick={() => setShowArchiveConfirm(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
                <Archive className="w-4 h-4" />
                بایگانی
              </button>
            )}
            {letterSignatures.length > 0 && (
              <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-xs font-medium text-emerald-700 flex items-center gap-1"><PenTool className="w-3 h-3" /> امضا شده</p>
                <p className="text-[10px] text-emerald-600 mt-1">{toPersianDateTime(letterSignatures[0].signedAt)}</p>
              </div>
            )}
          </div>

          {/* Referrals */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">ارجاعات ({letterRefs.length})</h3>
            {letterRefs.length === 0 ? (
              <p className="text-xs text-slate-400">ارجاعی ثبت نشده</p>
            ) : (
              <div className="space-y-2">
                {letterRefs.map(ref => {
                  const from = users.find(u => u.id === ref.fromUserId);
                  const to = users.find(u => u.id === ref.toUserId);
                  return (
                    <div key={ref.id} className="p-2 bg-slate-50 rounded-lg text-xs">
                      <div className="flex items-center gap-1 text-slate-700">
                        <span>{from?.firstName} {from?.lastName}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span>{to?.firstName} {to?.lastName}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{timeAgo(ref.createdAt)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Approvals */}
          {letterApprovals.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">تأییدیه‌ها</h3>
              <div className="space-y-2">
                {letterApprovals.map(app => {
                  const approver = users.find(u => u.id === app.approverId);
                  return (
                    <div key={app.id} className={`p-2 rounded-lg text-xs ${app.status === 'APPROVED' ? 'bg-green-50' : app.status === 'REJECTED' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                      <p className="font-medium text-slate-700">{approver?.firstName} {approver?.lastName}</p>
                      <p className="text-slate-500">{app.status === 'APPROVED' ? '✅ تأیید' : app.status === 'REJECTED' ? '❌ رد' : '⏳ در انتظار'}</p>
                      {app.comment && <p className="text-slate-600 mt-1">«{app.comment}»</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">تاریخچه</h3>
            <div className="space-y-3">
              {letterTimeline.map((entry, idx) => {
                const user = users.find(u => u.id === entry.userId);
                return (
                  <div key={entry.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${idx === letterTimeline.length - 1 ? 'bg-primary-500' : 'bg-slate-300'}`} />
                      {idx < letterTimeline.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-1" />}
                    </div>
                    <div className="pb-3">
                      <p className="text-xs font-medium text-slate-700">{entry.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{user?.firstName} {user?.lastName} • {timeAgo(entry.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Forward Modal */}
      {showForward && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForward(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">ارجاع نامه</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ارجاع به</label>
                <select value={forwardTo} onChange={e => setForwardTo(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">انتخاب کاربر...</option>
                  {users.filter(u => u.id !== currentUser?.id).map(u => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName} - {departments.find(d => d.id === u.departmentId)?.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">پیام</label>
                <textarea value={forwardMsg} onChange={e => setForwardMsg(e.target.value)} rows={3} placeholder="توضیحات ارجاع..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleForward} className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">ارجاع</button>
                <button onClick={() => setShowForward(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showReject && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowReject(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">رد نامه</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">دلیل رد <span className="text-red-500">*</span></label>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="لطفاً دلیل رد نامه را وارد کنید..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleReject} disabled={!rejectReason.trim()} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">رد نامه</button>
                <button onClick={() => setShowReject(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Confirm Modal */}
      {showSignConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowSignConfirm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-2">تأیید امضا</h3>
            <p className="text-sm text-slate-600 mb-4">آیا از امضای این نامه اطمینان دارید؟ پس از امضا، تغییر محتوا امکان‌پذیر نخواهد بود.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-amber-700">شماره: {letter.letterNumber}</p>
              <p className="text-xs text-amber-700">موضوع: {letter.subject}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { store.signLetter(letter.id); setShowSignConfirm(false); }} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">امضا می‌کنم</button>
              <button onClick={() => setShowSignConfirm(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">انصراف</button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirm Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowArchiveConfirm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-2">بایگانی نامه</h3>
            <p className="text-sm text-slate-600 mb-4">آیا از بایگانی این نامه اطمینان دارید؟</p>
            <div className="flex gap-2">
              <button onClick={() => { store.archiveLetter(letter.id); setShowArchiveConfirm(false); }} className="flex-1 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800">بایگانی</button>
              <button onClick={() => setShowArchiveConfirm(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">انصراف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
