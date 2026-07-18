import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export function addCategory(householdId: string, name: string, icon: string, order: number) {
  return addDoc(collection(db, 'households', householdId, 'categories'), {
    name,
    icon,
    order,
    createdAt: serverTimestamp(),
  });
}

export function renameCategory(householdId: string, categoryId: string, name: string) {
  return updateDoc(doc(db, 'households', householdId, 'categories', categoryId), { name });
}

export function deleteCategory(householdId: string, categoryId: string) {
  return deleteDoc(doc(db, 'households', householdId, 'categories', categoryId));
}

export function reorderCategory(householdId: string, categoryId: string, order: number) {
  return updateDoc(doc(db, 'households', householdId, 'categories', categoryId), { order });
}
