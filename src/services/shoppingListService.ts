import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ShoppingListItem } from '@/types/models';

export type NewShoppingItem = Omit<ShoppingListItem, 'id' | 'createdAt' | 'checked' | 'checkedAt'>;

export function addShoppingItem(householdId: string, item: NewShoppingItem) {
  return addDoc(collection(db, 'households', householdId, 'shoppingList'), {
    ...item,
    checked: false,
    checkedAt: null,
    createdAt: serverTimestamp(),
  });
}

export function toggleShoppingItem(householdId: string, itemId: string, checked: boolean) {
  return updateDoc(doc(db, 'households', householdId, 'shoppingList', itemId), {
    checked,
    checkedAt: checked ? serverTimestamp() : null,
  });
}

export function deleteShoppingItem(householdId: string, itemId: string) {
  return deleteDoc(doc(db, 'households', householdId, 'shoppingList', itemId));
}

export function clearCheckedItems(householdId: string, itemIds: string[]) {
  return Promise.all(itemIds.map((id) => deleteShoppingItem(householdId, id)));
}
