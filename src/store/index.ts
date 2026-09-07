import React from 'react';
import type { User, Department, Position, Letter, Referral, Approval, Signature, DocumentVersion, Attachment, Workflow, Notification, AuditLog, TimelineEntry, LetterType, Priority, Confidentiality } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Seed Data
const departments: Department[] = [
  { id: 'dept-1', name: 'مدیریت', code: 'MGMT', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'dept-2', name: 'حسابداری', code: 'ACC', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'dept-3', name: 'مالی', code: 'FIN', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'dept-4', name: 'خرید', code: 'PUR', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'dept-5', name: 'انبار', code: 'WH', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'dept-6', name: 'منابع انسانی', code: 'HR', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'dept-7', name: 'فروش', code: 'SLS', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'dept-8', name: 'IT', code: 'IT', createdAt: '2026-01-01T00:00:00Z' },
];

const positions: Position[] = [
  { id: 'pos-1', title: 'مدیرعامل', departmentId: 'dept-1', level: 1 },
  { id: 'pos-2', title: 'مدیر مالی', departmentId: 'dept-3', level: 2 },
  { id: 'pos-3', title: 'کارشناس حسابداری', departmentId: 'dept-2', level: 3 },
  { id: 'pos-4', title: 'مدیر رستوران', departmentId: 'dept-1', level: 2 },
  { id: 'pos-5', title: 'مدیر منابع انسانی', departmentId: 'dept-6', level: 2 },
  { id: 'pos-6', title: 'کارشناس خرید', departmentId: 'dept-4', level: 3 },
  { id: 'pos-7', title: 'مدیر انبار', departmentId: 'dept-5', level: 2 },
  { id: 'pos-8', title: 'کارشناس IT', departmentId: 'dept-8', level: 3 },
];

const users: User[] = [
  { id: 'user-1', firstName: 'علی', lastName: 'محمدی', username: 'admin', email: 'admin@restaurant.ir', phone: '09121234567', status: 'ACTIVE', departmentId: 'dept-1', positionId: 'pos-1', role: 'SUPER_ADMIN', permissions: ['documents.create','documents.read','documents.update','documents.delete','documents.forward','letters.create','letters.read','letters.approve','letters.reject','letters.sign','users.manage','departments.manage','workflows.manage','archive.read','audit.read','notifications.manage'], createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'user-2', firstName: 'رضا', lastName: 'احمدی', username: 'finance_mgr', email: 'finance@restaurant.ir', phone: '09121234568', status: 'ACTIVE', departmentId: 'dept-3', positionId: 'pos-2', role: 'MANAGER', permissions: ['documents.create','documents.read','documents.update','documents.forward','letters.create','letters.read','letters.approve','letters.reject','letters.sign','archive.read'], createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'user-3', firstName: 'مریم', lastName: 'حسینی', username: 'accountant', email: 'accountant@restaurant.ir', phone: '09121234569', status: 'ACTIVE', departmentId: 'dept-2', positionId: 'pos-3', role: 'ACCOUNTANT', permissions: ['documents.create','documents.read','documents.update','letters.create','letters.read','archive.read'], createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'user-4', firstName: 'حسن', lastName: 'کریمی', username: 'restaurant_mgr', email: 'manager@restaurant.ir', phone: '09121234570', status: 'ACTIVE', departmentId: 'dept-1', positionId: 'pos-4', role: 'MANAGER', permissions: ['documents.create','documents.read','documents.update','documents.forward','letters.create','letters.read','letters.approve','letters.reject','letters.sign','archive.read'], createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'user-5', firstName: 'زهرا', lastName: 'نوری', username: 'hr_mgr', email: 'hr@restaurant.ir', phone: '09121234571', status: 'ACTIVE', departmentId: 'dept-6', positionId: 'pos-5', role: 'MANAGER', permissions: ['documents.create','documents.read','documents.update','documents.forward','letters.create','letters.read','letters.approve','letters.reject','archive.read'], createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'user-6', firstName: 'محمد', lastName: 'رضایی', username: 'auditor', email: 'auditor@restaurant.ir', phone: '09121234572', status: 'ACTIVE', departmentId: 'dept-1', positionId: 'pos-1', role: 'AUDITOR', permissions: ['documents.read','letters.read','archive.read','audit.read'], createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
];

const workflows: Workflow[] = [
  { id: 'wf-1', name: 'تأیید خرید', description: 'گردش تأیید درخواست خرید', steps: [
    { id: 'step-1', workflowId: 'wf-1', order: 1, targetId: 'dept-2', targetType: 'DEPARTMENT', action: 'REVIEW', required: true, title: 'بررسی حسابداری' },
    { id: 'step-2', workflowId: 'wf-1', order: 2, targetId: 'user-2', targetType: 'USER', action: 'APPROVE', required: true, title: 'تأیید مدیر مالی' },
    { id: 'step-3', workflowId: 'wf-1', order: 3, targetId: 'user-1', targetType: 'USER', action: 'SIGN', required: true, title: 'امضای مدیرعامل' },
  ], createdAt: '2026-01-01T00:00:00Z', createdBy: 'user-1', isActive: true },
  { id: 'wf-2', name: 'تأیید درخواست مرخصی', description: 'گردش تأیید درخواست مرخصی کارکنان', steps: [
    { id: 'step-4', workflowId: 'wf-2', order: 1, targetId: 'user-5', targetType: 'USER', action: 'APPROVE', required: true, title: 'تأیید مدیر منابع انسانی' },
    { id: 'step-5', workflowId: 'wf-2', order: 2, targetId: 'user-4', targetType: 'USER', action: 'APPROVE', required: true, title: 'تأیید مدیر رستوران' },
  ], createdAt: '2026-01-01T00:00:00Z', createdBy: 'user-1', isActive: true },
];

// Generate letter number
let letterCounter = 100;
function generateLetterNumber(deptCode: string): string {
  letterCounter++;
  return `1405/${deptCode}/${String(letterCounter).padStart(6, '0')}`;
}

// Sample letters
const now = new Date().toISOString();
const sampleLetters: Letter[] = [
  { id: 'let-1', letterNumber: '1405/ACC/000101', subject: 'درخواست خرید مواد اولیه', type: 'INTERNAL', priority: 'HIGH', status: 'PENDING', confidentiality: 'NORMAL', senderId: 'user-3', senderDepartmentId: 'dept-2', recipientId: 'user-2', recipientDepartmentId: 'dept-3', creatorId: 'user-3', body: 'با سلام و احترام،\nبدینوسیله درخواست خرید مواد اولیه برای ماه آینده شامل:\n- گوشت ۱۰۰ کیلوگرم\n- مرغ ۸۰ کیلوگرم\n- سبزیجات ۵۰ کیلوگرم\nارسال می‌گردد.', description: 'خرید ماهانه', createdAt: '2026-09-01T08:00:00Z', registeredAt: '2026-09-01T08:05:00Z', updatedAt: now, version: 1, workflowId: 'wf-1', currentStepIndex: 1 },
  { id: 'let-2', letterNumber: '1405/MGMT/000102', subject: 'گزارش عملکرد ماهانه رستوران', type: 'INTERNAL', priority: 'NORMAL', status: 'APPROVED', confidentiality: 'NORMAL', senderId: 'user-4', senderDepartmentId: 'dept-1', recipientId: 'user-1', recipientDepartmentId: 'dept-1', creatorId: 'user-4', body: 'گزارش عملکرد ماه شهریور ماه ۱۴۰۵ به پیوست ارسال می‌گردد.', description: 'گزارش ماهانه', createdAt: '2026-08-28T10:00:00Z', registeredAt: '2026-08-28T10:05:00Z', updatedAt: now, version: 1, currentStepIndex: 0 },
  { id: 'let-3', letterNumber: '1405/FIN/000103', subject: 'محرمانه - گزارش مالی فصلی', type: 'INTERNAL', priority: 'URGENT', status: 'WAITING_APPROVAL', confidentiality: 'CONFIDENTIAL', senderId: 'user-2', senderDepartmentId: 'dept-3', recipientId: 'user-1', recipientDepartmentId: 'dept-1', creatorId: 'user-2', body: 'گزارش مالی فصل تابستان به پیوست تقدیم می‌گردد. لطفاً بررسی و تأیید فرمایید.', description: 'گزارش محرمانه', createdAt: '2026-09-10T09:00:00Z', registeredAt: '2026-09-10T09:02:00Z', updatedAt: now, version: 1, currentStepIndex: 0 },
  { id: 'let-4', letterNumber: '1405/HR/000104', subject: 'درخواست استخدام آشپز جدید', type: 'INTERNAL', priority: 'NORMAL', status: 'FORWARDED', confidentiality: 'NORMAL', senderId: 'user-5', senderDepartmentId: 'dept-6', recipientId: 'user-4', recipientDepartmentId: 'dept-1', creatorId: 'user-5', body: 'با توجه به نیاز شعبه مرکزی به یک آشپز با تجربه، درخواست استخدام صادر می‌گردد.', description: 'استخدام', createdAt: '2026-09-12T11:00:00Z', registeredAt: '2026-09-12T11:03:00Z', updatedAt: now, version: 1, currentStepIndex: 0 },
  { id: 'let-5', letterNumber: '1405/ACC/000105', subject: 'صورت‌حساب تأمین‌کننده', type: 'INCOMING', priority: 'HIGH', status: 'REGISTERED', confidentiality: 'NORMAL', senderId: 'user-6', senderDepartmentId: 'dept-1', recipientId: 'user-3', recipientDepartmentId: 'dept-2', creatorId: 'user-3', body: 'صورت‌حساب شماره ۱۲۳۴ از تأمین‌کننده مواد غذایی دریافت شد.', description: 'صورت‌حساب', createdAt: '2026-09-14T14:00:00Z', registeredAt: '2026-09-14T14:01:00Z', updatedAt: now, version: 1, currentStepIndex: 0 },
  { id: 'let-6', letterNumber: '1405/MGMT/000106', subject: 'دستورالعمل جدید بهداشتی', type: 'OUTGOING', priority: 'URGENT', status: 'SIGNED', confidentiality: 'NORMAL', senderId: 'user-1', senderDepartmentId: 'dept-1', creatorId: 'user-1', body: 'دستورالعمل جدید بهداشتی جهت اجرا در تمامی شعب ابلاغ می‌گردد.', description: 'بهداشت', createdAt: '2026-09-05T08:00:00Z', registeredAt: '2026-09-05T08:02:00Z', updatedAt: now, version: 1, currentStepIndex: 0 },
  { id: 'let-7', letterNumber: '1405/WH/000107', subject: 'گزارش موجودی انبار', type: 'INTERNAL', priority: 'NORMAL', status: 'ARCHIVED', confidentiality: 'NORMAL', senderId: 'user-4', senderDepartmentId: 'dept-5', recipientId: 'user-2', recipientDepartmentId: 'dept-3', creatorId: 'user-4', body: 'گزارش موجودی انبار تا پایان شهریور ماه.', description: 'انبار', createdAt: '2026-08-30T09:00:00Z', registeredAt: '2026-08-30T09:05:00Z', updatedAt: now, version: 1, currentStepIndex: 0 },
];

const sampleReferrals: Referral[] = [
  { id: 'ref-1', letterId: 'let-1', fromUserId: 'user-3', toUserId: 'user-2', message: 'لطفاً بررسی و تأیید فرمایید', priority: 'HIGH', status: 'PENDING', createdAt: '2026-09-01T08:10:00Z' },
  { id: 'ref-2', letterId: 'let-4', fromUserId: 'user-5', toUserId: 'user-4', message: 'لطفاً تأیید فرمایید', priority: 'NORMAL', status: 'PENDING', createdAt: '2026-09-12T11:10:00Z' },
];

const sampleApprovals: Approval[] = [
  { id: 'app-1', letterId: 'let-2', approverId: 'user-1', status: 'APPROVED', comment: 'تأیید می‌شود', createdAt: '2026-08-29T10:00:00Z', approvedAt: '2026-08-29T10:00:00Z' },
  { id: 'app-2', letterId: 'let-3', approverId: 'user-1', status: 'PENDING', createdAt: '2026-09-10T09:05:00Z' },
];

const sampleSignatures: Signature[] = [
  { id: 'sig-1', letterId: 'let-6', userId: 'user-1', signedAt: '2026-09-05T09:00:00Z', signatureType: 'DIGITAL', signatureHash: 'abc123def456', ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0' },
];

const sampleTimeline: TimelineEntry[] = [
  { id: 'tl-1', letterId: 'let-1', action: 'CREATE', description: 'نامه ایجاد شد', userId: 'user-3', createdAt: '2026-09-01T08:00:00Z' },
  { id: 'tl-2', letterId: 'let-1', action: 'REGISTER', description: 'نامه ثبت شد', userId: 'user-3', createdAt: '2026-09-01T08:05:00Z' },
  { id: 'tl-3', letterId: 'let-1', action: 'FORWARD', description: 'به مدیر مالی ارجاع شد', userId: 'user-3', createdAt: '2026-09-01T08:10:00Z' },
  { id: 'tl-4', letterId: 'let-6', action: 'CREATE', description: 'نامه ایجاد شد', userId: 'user-1', createdAt: '2026-09-05T08:00:00Z' },
  { id: 'tl-5', letterId: 'let-6', action: 'REGISTER', description: 'نامه ثبت شد', userId: 'user-1', createdAt: '2026-09-05T08:02:00Z' },
  { id: 'tl-6', letterId: 'let-6', action: 'SIGN', description: 'نامه امضا شد', userId: 'user-1', createdAt: '2026-09-05T09:00:00Z' },
];

const sampleNotifications: Notification[] = [
  { id: 'notif-1', userId: 'user-2', type: 'NEW_REFERRAL', title: 'ارجاع جدید', message: 'نامه «درخواست خرید مواد اولیه» به شما ارجاع شد', letterId: 'let-1', isRead: false, createdAt: '2026-09-01T08:10:00Z' },
  { id: 'notif-2', userId: 'user-1', type: 'NEEDS_APPROVAL', title: 'نیاز به تأیید', message: 'نامه «گزارش مالی فصلی» نیاز به تأیید شما دارد', letterId: 'let-3', isRead: false, createdAt: '2026-09-10T09:05:00Z' },
  { id: 'notif-3', userId: 'user-4', type: 'NEW_REFERRAL', title: 'ارجاع جدید', message: 'نامه «درخواست استخدام» به شما ارجاع شد', letterId: 'let-4', isRead: false, createdAt: '2026-09-12T11:10:00Z' },
];

const sampleAuditLogs: AuditLog[] = [
  { id: 'audit-1', userId: 'user-3', action: 'CREATE_DOCUMENT', entityType: 'Letter', entityId: 'let-1', description: 'ایجاد نامه درخواست خرید', ipAddress: '192.168.1.10', userAgent: 'Mozilla/5.0', createdAt: '2026-09-01T08:00:00Z' },
  { id: 'audit-2', userId: 'user-3', action: 'REGISTER_DOCUMENT', entityType: 'Letter', entityId: 'let-1', description: 'ثبت نامه', ipAddress: '192.168.1.10', userAgent: 'Mozilla/5.0', createdAt: '2026-09-01T08:05:00Z' },
  { id: 'audit-3', userId: 'user-1', action: 'LOGIN', entityType: 'User', entityId: 'user-1', description: 'ورود به سیستم', ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0', createdAt: '2026-09-14T07:00:00Z' },
];

// Store
interface StoreState {
  currentUser: User | null;
  users: User[];
  departments: Department[];
  positions: Position[];
  letters: Letter[];
  referrals: Referral[];
  approvals: Approval[];
  signatures: Signature[];
  versions: DocumentVersion[];
  attachments: Attachment[];
  workflows: Workflow[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  timeline: TimelineEntry[];
}

const STORAGE_KEY = 'office_automation_store';

function loadState(): StoreState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {
    currentUser: null,
    users,
    departments,
    positions,
    letters: sampleLetters,
    referrals: sampleReferrals,
    approvals: sampleApprovals,
    signatures: sampleSignatures,
    versions: [],
    attachments: [],
    workflows,
    notifications: sampleNotifications,
    auditLogs: sampleAuditLogs,
    timeline: sampleTimeline,
  };
}

function saveState(state: StoreState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state: StoreState = loadState();
let listeners: Array<() => void> = [];

function notify() {
  saveState(state);
  listeners.forEach(l => l());
}

export const store = {
  getState: () => state,
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  },

  // Auth
  login: (username: string, _password: string): User | null => {
    const user = state.users.find(u => u.username === username && u.status === 'ACTIVE');
    if (user) {
      state.currentUser = user;
      state.auditLogs.push({ id: uuidv4(), userId: user.id, action: 'LOGIN', entityType: 'User', entityId: user.id, description: 'ورود به سیستم', ipAddress: '192.168.1.1', userAgent: navigator.userAgent, createdAt: new Date().toISOString() });
      notify();
      return user;
    }
    return null;
  },
  logout: () => { state.currentUser = null; notify(); },

  // Letters
  createLetter: (data: { subject: string; type: LetterType; priority: Priority; confidentiality: Confidentiality; body: string; description?: string; recipientId?: string; recipientDepartmentId?: string; dueDate?: string; workflowId?: string }): Letter => {
    if (!state.currentUser) throw new Error('Not authenticated');
    const dept = state.departments.find(d => d.id === state.currentUser!.departmentId);
    const letter: Letter = {
      id: uuidv4(), letterNumber: generateLetterNumber(dept?.code || 'GEN'), subject: data.subject, type: data.type, priority: data.priority, status: 'DRAFT', confidentiality: data.confidentiality, senderId: state.currentUser.id, senderDepartmentId: state.currentUser.departmentId, recipientId: data.recipientId, recipientDepartmentId: data.recipientDepartmentId, creatorId: state.currentUser.id, body: data.body, description: data.description, dueDate: data.dueDate, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1, workflowId: data.workflowId, currentStepIndex: 0,
    };
    state.letters.push(letter);
    state.timeline.push({ id: uuidv4(), letterId: letter.id, action: 'CREATE', description: 'نامه ایجاد شد', userId: state.currentUser.id, createdAt: new Date().toISOString() });
    state.auditLogs.push({ id: uuidv4(), userId: state.currentUser.id, action: 'CREATE_DOCUMENT', entityType: 'Letter', entityId: letter.id, description: `ایجاد نامه: ${data.subject}`, ipAddress: '192.168.1.1', userAgent: navigator.userAgent, createdAt: new Date().toISOString() });
    notify();
    return letter;
  },

  registerLetter: (letterId: string): void => {
    if (!state.currentUser) return;
    const letter = state.letters.find(l => l.id === letterId);
    if (!letter || letter.status !== 'DRAFT') return;
    letter.status = 'REGISTERED';
    letter.registeredAt = new Date().toISOString();
    letter.updatedAt = new Date().toISOString();
    state.timeline.push({ id: uuidv4(), letterId, action: 'REGISTER', description: 'نامه ثبت شد', userId: state.currentUser.id, createdAt: new Date().toISOString() });
    state.auditLogs.push({ id: uuidv4(), userId: state.currentUser.id, action: 'REGISTER_DOCUMENT', entityType: 'Letter', entityId: letterId, description: 'ثبت نامه', ipAddress: '192.168.1.1', userAgent: navigator.userAgent, createdAt: new Date().toISOString() });
    notify();
  },

  forwardLetter: (letterId: string, toUserId: string, message?: string): void => {
    if (!state.currentUser) return;
    const letter = state.letters.find(l => l.id === letterId);
    if (!letter) return;
    letter.status = 'FORWARDED';
    letter.recipientId = toUserId;
    letter.updatedAt = new Date().toISOString();
    const referral: Referral = { id: uuidv4(), letterId, fromUserId: state.currentUser.id, toUserId, message, priority: letter.priority, status: 'PENDING', createdAt: new Date().toISOString() };
    state.referrals.push(referral);
    const toUser = state.users.find(u => u.id === toUserId);
    state.timeline.push({ id: uuidv4(), letterId, action: 'FORWARD', description: `ارجاع به ${toUser?.firstName} ${toUser?.lastName}`, userId: state.currentUser.id, createdAt: new Date().toISOString() });
    state.notifications.push({ id: uuidv4(), userId: toUserId, type: 'NEW_REFERRAL', title: 'ارجاع جدید', message: `نامه «${letter.subject}» به شما ارجاع شد`, letterId, isRead: false, createdAt: new Date().toISOString() });
    state.auditLogs.push({ id: uuidv4(), userId: state.currentUser.id, action: 'FORWARD_DOCUMENT', entityType: 'Letter', entityId: letterId, description: `ارجاع نامه به ${toUser?.firstName} ${toUser?.lastName}`, ipAddress: '192.168.1.1', userAgent: navigator.userAgent, createdAt: new Date().toISOString() });
    notify();
  },

  markReferralRead: (referralId: string): void => {
    const referral = state.referrals.find(r => r.id === referralId);
    if (!referral || referral.readAt) return;
    referral.readAt = new Date().toISOString();
    referral.status = 'READ';
    state.timeline.push({ id: uuidv4(), letterId: referral.letterId, action: 'READ', description: 'نامه مشاهده شد', userId: referral.toUserId, createdAt: new Date().toISOString() });
    state.auditLogs.push({ id: uuidv4(), userId: referral.toUserId, action: 'READ_DOCUMENT', entityType: 'Letter', entityId: referral.letterId, description: 'مشاهده نامه', ipAddress: '192.168.1.1', userAgent: navigator.userAgent, createdAt: new Date().toISOString() });
    notify();
  },

  approveLetter: (letterId: string, comment?: string): void => {
    if (!state.currentUser) return;
    const letter = state.letters.find(l => l.id === letterId);
    if (!letter) return;
    letter.status = 'APPROVED';
    letter.updatedAt = new Date().toISOString();
    const approval: Approval = { id: uuidv4(), letterId, approverId: state.currentUser.id, status: 'APPROVED', comment, createdAt: new Date().toISOString(), approvedAt: new Date().toISOString() };
    state.approvals.push(approval);
    state.timeline.push({ id: uuidv4(), letterId, action: 'APPROVE', description: 'تأیید شد', userId: state.currentUser.id, createdAt: new Date().toISOString() });
    state.notifications.push({ id: uuidv4(), userId: letter.creatorId, type: 'STATUS_CHANGE', title: 'تأیید نامه', message: `نامه «${letter.subject}» تأیید شد`, letterId, isRead: false, createdAt: new Date().toISOString() });
    state.auditLogs.push({ id: uuidv4(), userId: state.currentUser.id, action: 'APPROVE_DOCUMENT', entityType: 'Letter', entityId: letterId, description: 'تأیید نامه', ipAddress: '192.168.1.1', userAgent: navigator.userAgent, createdAt: new Date().toISOString() });
    notify();
  },

  rejectLetter: (letterId: string, comment: string): void => {
    if (!state.currentUser) return;
    const letter = state.letters.find(l => l.id === letterId);
    if (!letter) return;
    letter.status = 'REJECTED';
    letter.updatedAt = new Date().toISOString();
    const approval: Approval = { id: uuidv4(), letterId, approverId: state.currentUser.id, status: 'REJECTED', comment, createdAt: new Date().toISOString(), rejectedAt: new Date().toISOString() };
    state.approvals.push(approval);
    state.timeline.push({ id: uuidv4(), letterId, action: 'REJECT', description: `رد شد: ${comment}`, userId: state.currentUser.id, createdAt: new Date().toISOString() });
    state.notifications.push({ id: uuidv4(), userId: letter.creatorId, type: 'REJECTED', title: 'رد نامه', message: `نامه «${letter.subject}» رد شد. دلیل: ${comment}`, letterId, isRead: false, createdAt: new Date().toISOString() });
    state.auditLogs.push({ id: uuidv4(), userId: state.currentUser.id, action: 'REJECT_DOCUMENT', entityType: 'Letter', entityId: letterId, description: `رد نامه: ${comment}`, ipAddress: '192.168.1.1', userAgent: navigator.userAgent, createdAt: new Date().toISOString() });
    notify();
  },

  signLetter: (letterId: string): void => {
    if (!state.currentUser) return;
    const letter = state.letters.find(l => l.id === letterId);
    if (!letter) return;
    letter.status = 'SIGNED';
    letter.updatedAt = new Date().toISOString();
    const signature: Signature = { id: uuidv4(), letterId, userId: state.currentUser.id, signedAt: new Date().toISOString(), signatureType: 'DIGITAL', signatureHash: uuidv4(), ipAddress: '192.168.1.1', userAgent: navigator.userAgent };
    state.signatures.push(signature);
    state.timeline.push({ id: uuidv4(), letterId, action: 'SIGN', description: 'نامه امضا شد', userId: state.currentUser.id, createdAt: new Date().toISOString() });
    state.auditLogs.push({ id: uuidv4(), userId: state.currentUser.id, action: 'SIGN_DOCUMENT', entityType: 'Letter', entityId: letterId, description: 'امضای نامه', ipAddress: '192.168.1.1', userAgent: navigator.userAgent, createdAt: new Date().toISOString() });
    notify();
  },

  archiveLetter: (letterId: string): void => {
    if (!state.currentUser) return;
    const letter = state.letters.find(l => l.id === letterId);
    if (!letter || (letter.status !== 'APPROVED' && letter.status !== 'SIGNED')) return;
    letter.status = 'ARCHIVED';
    letter.updatedAt = new Date().toISOString();
    state.timeline.push({ id: uuidv4(), letterId, action: 'ARCHIVE', description: 'بایگانی شد', userId: state.currentUser.id, createdAt: new Date().toISOString() });
    state.auditLogs.push({ id: uuidv4(), userId: state.currentUser.id, action: 'ARCHIVE_DOCUMENT', entityType: 'Letter', entityId: letterId, description: 'بایگانی نامه', ipAddress: '192.168.1.1', userAgent: navigator.userAgent, createdAt: new Date().toISOString() });
    notify();
  },

  readReferral: (referralId: string): void => {
    const ref = state.referrals.find(r => r.id === referralId);
    if (ref && ref.status === 'PENDING') {
      ref.status = 'READ';
      ref.readAt = new Date().toISOString();
      notify();
    }
  },

  markNotificationRead: (notifId: string): void => {
    const n = state.notifications.find(n => n.id === notifId);
    if (n) { n.isRead = true; notify(); }
  },

  // Users
  addUser: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const user: User = { ...data, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    state.users.push(user);
    notify();
    return user;
  },

  updateUser: (id: string, data: Partial<User>): void => {
    const user = state.users.find(u => u.id === id);
    if (user) { Object.assign(user, data, { updatedAt: new Date().toISOString() }); notify(); }
  },

  // Departments
  addDepartment: (data: Omit<Department, 'id' | 'createdAt'>): Department => {
    const dept: Department = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    state.departments.push(dept);
    notify();
    return dept;
  },

  // Workflows
  addWorkflow: (data: Omit<Workflow, 'id' | 'createdAt'>): Workflow => {
    const wf: Workflow = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    state.workflows.push(wf);
    notify();
    return wf;
  },

  // Attachments
  addAttachment: (letterId: string, file: { name: string; type: string; size: number }): Attachment => {
    if (!state.currentUser) throw new Error('Not authenticated');
    const att: Attachment = { id: uuidv4(), letterId, originalName: file.name, storedName: `${uuidv4()}.${file.name.split('.').pop()}`, mimeType: file.type, size: file.size, uploadedBy: state.currentUser.id, createdAt: new Date().toISOString(), hash: uuidv4() };
    state.attachments.push(att);
    state.auditLogs.push({ id: uuidv4(), userId: state.currentUser.id, action: 'UPLOAD_ATTACHMENT', entityType: 'Attachment', entityId: att.id, description: `آپلود فایل: ${file.name}`, ipAddress: '192.168.1.1', userAgent: navigator.userAgent, createdAt: new Date().toISOString() });
    notify();
    return att;
  },

  // Versions
  createVersion: (letterId: string, body: string, changeDescription: string): DocumentVersion => {
    if (!state.currentUser) throw new Error('Not authenticated');
    const letter = state.letters.find(l => l.id === letterId);
    if (!letter) throw new Error('Letter not found');
    const version: DocumentVersion = { id: uuidv4(), letterId, versionNumber: letter.version + 1, createdBy: state.currentUser.id, createdAt: new Date().toISOString(), changeDescription, body, hash: uuidv4() };
    state.versions.push(version);
    letter.version += 1;
    letter.body = body;
    letter.updatedAt = new Date().toISOString();
    state.timeline.push({ id: uuidv4(), letterId, action: 'VERSION', description: `نسخه ${letter.version} ایجاد شد: ${changeDescription}`, userId: state.currentUser.id, createdAt: new Date().toISOString() });
    notify();
    return version;
  },
};

export function useStore() {
  const [, forceUpdate] = React.useState(0);
  React.useEffect(() => store.subscribe(() => forceUpdate(n => n + 1)), []);
  return state;
}
