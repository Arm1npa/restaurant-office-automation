export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'ACCOUNTANT' | 'AUDITOR';

export type Permission =
  | 'documents.create' | 'documents.read' | 'documents.update' | 'documents.delete' | 'documents.forward'
  | 'letters.create' | 'letters.read' | 'letters.approve' | 'letters.reject' | 'letters.sign'
  | 'users.manage' | 'departments.manage' | 'workflows.manage'
  | 'archive.read' | 'audit.read' | 'notifications.manage';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  departmentId: string;
  positionId: string;
  role: Role;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  createdAt: string;
}

export interface Position {
  id: string;
  title: string;
  departmentId: string;
  level: number;
}

export type LetterType = 'INCOMING' | 'OUTGOING' | 'INTERNAL';
export type LetterStatus = 'DRAFT' | 'REGISTERED' | 'PENDING' | 'IN_PROGRESS' | 'FORWARDED' | 'WAITING_APPROVAL' | 'REJECTED' | 'APPROVED' | 'SIGNED' | 'ARCHIVED' | 'CANCELLED';
export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type Confidentiality = 'NORMAL' | 'CONFIDENTIAL' | 'HIGHLY_CONFIDENTIAL';

export interface Letter {
  id: string;
  letterNumber: string;
  subject: string;
  type: LetterType;
  priority: Priority;
  status: LetterStatus;
  confidentiality: Confidentiality;
  senderId: string;
  senderDepartmentId: string;
  recipientId?: string;
  recipientDepartmentId?: string;
  creatorId: string;
  body: string;
  description?: string;
  dueDate?: string;
  createdAt: string;
  registeredAt?: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
  version: number;
  workflowId?: string;
  currentStepIndex: number;
}

export interface Referral {
  id: string;
  letterId: string;
  fromUserId: string;
  toUserId: string;
  toDepartmentId?: string;
  message?: string;
  priority: Priority;
  dueDate?: string;
  status: 'PENDING' | 'READ' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  readAt?: string;
  completedAt?: string;
}

export interface Approval {
  id: string;
  letterId: string;
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comment?: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface Signature {
  id: string;
  letterId: string;
  userId: string;
  signedAt: string;
  signatureType: 'DIGITAL' | 'ELECTRONIC';
  signatureHash: string;
  ipAddress: string;
  userAgent: string;
}

export interface DocumentVersion {
  id: string;
  letterId: string;
  versionNumber: number;
  createdBy: string;
  createdAt: string;
  changeDescription: string;
  body: string;
  hash: string;
}

export interface Attachment {
  id: string;
  letterId: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
  hash: string;
}

export type WorkflowAction = 'APPROVE' | 'REJECT' | 'FORWARD' | 'SIGN' | 'REVIEW';
export type WorkflowStepTarget = 'USER' | 'DEPARTMENT' | 'ROLE';

export interface WorkflowStep {
  id: string;
  workflowId: string;
  order: number;
  targetId: string;
  targetType: WorkflowStepTarget;
  action: WorkflowAction;
  required: boolean;
  title: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

export type NotificationType = 'NEW_LETTER' | 'NEW_REFERRAL' | 'NEEDS_APPROVAL' | 'NEEDS_SIGNATURE' | 'REJECTED' | 'STATUS_CHANGE' | 'DUE_DATE_APPROACHING' | 'WORKFLOW_COMPLETE';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  letterId?: string;
  isRead: boolean;
  createdAt: string;
}

export type AuditAction = 'LOGIN' | 'CREATE_DOCUMENT' | 'UPDATE_DOCUMENT' | 'REGISTER_DOCUMENT' | 'FORWARD_DOCUMENT' | 'READ_DOCUMENT' | 'APPROVE_DOCUMENT' | 'REJECT_DOCUMENT' | 'SIGN_DOCUMENT' | 'UPLOAD_ATTACHMENT' | 'DOWNLOAD_ATTACHMENT' | 'DELETE_ATTACHMENT' | 'ARCHIVE_DOCUMENT' | 'CHANGE_PERMISSION';

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface TimelineEntry {
  id: string;
  letterId: string;
  action: string;
  description: string;
  userId: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}
