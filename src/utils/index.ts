// Persian date utilities
export function toPersianDate(dateStr: string): string {
  const date = new Date(dateStr);
  try {
    return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  } catch {
    return date.toLocaleDateString('fa-IR');
  }
}

export function toPersianDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  try {
    return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
  } catch {
    return date.toLocaleString('fa-IR');
  }
}

export function toPersianNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'همین الان';
  if (minutes < 60) return `${toPersianNumber(minutes)} دقیقه پیش`;
  if (hours < 24) return `${toPersianNumber(hours)} ساعت پیش`;
  if (days < 30) return `${toPersianNumber(days)} روز پیش`;
  return toPersianDate(dateStr);
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'پیش‌نویس', REGISTERED: 'ثبت شده', PENDING: 'در انتظار', IN_PROGRESS: 'در حال بررسی',
    FORWARDED: 'ارجاع شده', WAITING_APPROVAL: 'در انتظار تأیید', REJECTED: 'رد شده',
    APPROVED: 'تأیید شده', SIGNED: 'امضا شده', ARCHIVED: 'بایگانی شده', CANCELLED: 'لغو شده',
  };
  return map[status] || status;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700', REGISTERED: 'bg-blue-100 text-blue-700',
    PENDING: 'bg-yellow-100 text-yellow-700', IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
    FORWARDED: 'bg-purple-100 text-purple-700', WAITING_APPROVAL: 'bg-orange-100 text-orange-700',
    REJECTED: 'bg-red-100 text-red-700', APPROVED: 'bg-green-100 text-green-700',
    SIGNED: 'bg-emerald-100 text-emerald-800', ARCHIVED: 'bg-slate-100 text-slate-700',
    CANCELLED: 'bg-gray-200 text-gray-600',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}

export function getPriorityLabel(priority: string): string {
  const map: Record<string, string> = { LOW: 'کم', NORMAL: 'عادی', HIGH: 'بالا', URGENT: 'فوری' };
  return map[priority] || priority;
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = { LOW: 'text-slate-500', NORMAL: 'text-blue-600', HIGH: 'text-orange-600', URGENT: 'text-red-600' };
  return map[priority] || 'text-gray-600';
}

export function getPriorityDot(priority: string): string {
  const map: Record<string, string> = { LOW: 'bg-slate-400', NORMAL: 'bg-blue-500', HIGH: 'bg-orange-500', URGENT: 'bg-red-500' };
  return map[priority] || 'bg-gray-500';
}

export function getLetterTypeLabel(type: string): string {
  const map: Record<string, string> = { INCOMING: 'وارده', OUTGOING: 'صادره', INTERNAL: 'داخلی' };
  return map[type] || type;
}

export function getConfidentialityLabel(c: string): string {
  const map: Record<string, string> = { NORMAL: 'عادی', CONFIDENTIAL: 'محرمانه', HIGHLY_CONFIDENTIAL: 'خیلی محرمانه' };
  return map[c] || c;
}

export function getConfidentialityColor(c: string): string {
  const map: Record<string, string> = { NORMAL: 'text-gray-600', CONFIDENTIAL: 'text-amber-600', HIGHLY_CONFIDENTIAL: 'text-red-600' };
  return map[c] || 'text-gray-600';
}

export function getRoleLabel(role: string): string {
  const map: Record<string, string> = { SUPER_ADMIN: 'مدیر ارشد', ADMIN: 'مدیر سیستم', MANAGER: 'مدیر', STAFF: 'کارمند', ACCOUNTANT: 'حسابدار', AUDITOR: 'بازرس' };
  return map[role] || role;
}

export function getNotificationTypeLabel(type: string): string {
  const map: Record<string, string> = { NEW_LETTER: 'نامه جدید', NEW_REFERRAL: 'ارجاع جدید', NEEDS_APPROVAL: 'نیاز به تأیید', NEEDS_SIGNATURE: 'نیاز به امضا', REJECTED: 'رد شده', STATUS_CHANGE: 'تغییر وضعیت', DUE_DATE_APPROACHING: 'نزدیک شدن مهلت', WORKFLOW_COMPLETE: 'تکمیل گردش' };
  return map[type] || type;
}
