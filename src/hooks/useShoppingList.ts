import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ShoppingListItem } from '@/types/models';

export function useShoppingList(householdId: string | null | undefined) {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) {
      setItems([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'households', householdId, 'shoppingList'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ShoppingListItem)));
      setLoading(false);
    });
    return unsub;
  }, [householdId]);

  return { items, loading };
}
