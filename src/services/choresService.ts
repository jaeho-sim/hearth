import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Chore } from '@/types/models';
import { nextDueDate } from '@/utils/recurrence';

export type NewChore = Omit<Chore, 'id' | 'createdAt' | 'completed' | 'completedBy' | 'completedAt'>;

export function addChore(householdId: string, chore: NewChore) {
  return addDoc(collection(db, 'households', householdId, 'chores'), {
    ...chore,
    completed: false,
    completedBy: null,
    completedAt: null,
    createdAt: serverTimestamp(),
  });
}

export function updateChore(householdId: string, choreId: string, changes: Partial<NewChore>) {
  return updateDoc(doc(db, 'households', householdId, 'chores', choreId), changes);
}

export function deleteChore(householdId: string, choreId: string) {
  return deleteDoc(doc(db, 'households', householdId, 'chores', choreId));
}

/**
 * Marking a recurring chore done resets it to incomplete with a rolled-forward
 * due date, rather than leaving a completed doc behind — keeps a single doc
 * per recurring chore instead of spawning a new one each cycle.
 */
export function completeChore(householdId: string, chore: Chore, completedByUid: string, completedByName: string) {
  const ref = doc(db, 'households', householdId, 'chores', chore.id);
  const next = nextDueDate(chore.dueDate, chore.recurrence);

  if (next) {
    return updateDoc(ref, {
      dueDate: next,
      completed: false,
      completedBy: completedByUid,
      completedAt: serverTimestamp(),
    });
  }
  return updateDoc(ref, {
    completed: true,
    completedBy: completedByUid,
    completedAt: serverTimestamp(),
  });
}

export function uncompleteChore(householdId: string, choreId: string) {
  return updateDoc(doc(db, 'households', householdId, 'chores', choreId), {
    completed: false,
    completedBy: null,
    completedAt: null,
  });
}
