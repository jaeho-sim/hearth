import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Category } from '@/types/models';

export function useCategories(householdId: string | null | undefined) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) {
      setCategories([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'households', householdId, 'categories'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category)));
      setLoading(false);
    });
    return unsub;
  }, [householdId]);

  return { categories, loading };
}
