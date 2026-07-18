import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { InventoryItem } from '@/types/models';

export type NewInventoryItem = Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>;

export function addInventoryItem(householdId: string, item: NewInventoryItem) {
  return addDoc(collection(db, 'households', householdId, 'inventory'), {
    ...item,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function updateInventoryItem(householdId: string, itemId: string, changes: Partial<NewInventoryItem>) {
  return updateDoc(doc(db, 'households', householdId, 'inventory', itemId), {
    ...changes,
    updatedAt: serverTimestamp(),
  });
}

export function deleteInventoryItem(householdId: string, itemId: string) {
  return deleteDoc(doc(db, 'households', householdId, 'inventory', itemId));
}
