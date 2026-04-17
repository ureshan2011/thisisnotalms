export interface PlaygroundSession {
  id: string;
  intake: string;
  subject: string;
  status: 'active' | 'expired';
  activatedBy: string;
  activatedByName: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface PresenceEntry {
  userId: string;
  name: string;
  role: string;
  joinedAt: Date;
}

export interface CanvasSnapshot {
  data: string; // base64 PNG data URL
  updatedAt: Date;
  updatedBy: string;
}

export interface Poll {
  id: string;
  question: string;
  createdAt: Date;
  votes: Record<string, boolean>; // userId -> true (👍) or false (👎)
}

export interface ChecklistItem {
  id: string;
  label: string;
  order: number;
  createdAt: Date;
}

export interface ChecklistCompletion {
  id: string; // "${itemId}_${userId}"
  itemId: string;
  userId: string;
  userName: string;
  completedAt: Date;
}
