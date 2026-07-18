import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { InventoryItem } from '@/types/models';

export function useInventoryByCategory(householdId: string | null | undefined, categoryId: string | null | undefined) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId || !categoryId) {
      setItems([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'households', householdId, 'inventory'),
      where('categoryId', '==', categoryId),
      orderBy('name', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as InventoryItem)));
      setLoading(false);
    });
    return unsub;
  }, [householdId, categoryId]);

  return { items, loading };
}
