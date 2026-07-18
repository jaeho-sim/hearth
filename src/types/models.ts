export type ID = string;

export interface UserProfile {
  uid: ID;
  displayName: string;
  email: string;
  photoURL?: string;
  householdId?: ID | null;
  createdAt: number;
}

export type MemberRole = 'owner' | 'member';

export interface HouseholdMember {
  uid: ID;
  displayName: string;
  email: string;
  photoURL?: string;
  role: MemberRole;
  joinedAt: number;
}

export interface Household {
  id: ID;
  name: string;
  createdBy: ID;
  createdAt: number;
  memberIds: ID[]; // denormalized for Firestore array-contains queries
  members: Record<ID, HouseholdMember>;
}

export type InviteStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

export interface Invite {
  id: ID;
  householdId: ID;
  householdName: string;
  invitedEmail: string;
  invitedBy: ID;
  invitedByName: string;
  status: InviteStatus;
  createdAt: number;
  respondedAt?: number;
}

export interface Category {
  id: ID;
  name: string;
  icon: string; // ionicons name
  order: number;
  createdAt: number;
}

export interface InventoryItem {
  id: ID;
  categoryId: ID;
  name: string;
  quantity: number;
  unit?: string; // e.g. "pcs", "lbs", "boxes"
  expirationDate?: number | null;
  notes?: string;
  lowStockThreshold?: number | null;
  addedBy: ID;
  addedByName: string;
  createdAt: number;
  updatedAt: number;
}

export interface ShoppingListItem {
  id: ID;
  name: string;
  quantity: number;
  unit?: string;
  categoryId?: ID | null;
  notes?: string;
  checked: boolean;
  addedBy: ID;
  addedByName: string;
  createdAt: number;
  checkedAt?: number | null;
}

export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Recurrence {
  frequency: RecurrenceFrequency;
  interval: number; // every N days/weeks/months
  daysOfWeek?: number[]; // 0=Sun..6=Sat, used when frequency = weekly
}

export interface Chore {
  id: ID;
  title: string;
  notes?: string;
  assignedTo?: ID | null;
  assignedToName?: string | null;
  dueDate: number;
  recurrence: Recurrence;
  completed: boolean;
  completedBy?: ID | null;
  completedAt?: number | null;
  createdBy: ID;
  createdAt: number;
}
