import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Chore } from '@/types/models';

export function useChores(householdId: string | null | undefined) {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!householdId) {
      setChores([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'households', householdId, 'chores'), orderBy('dueDate', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setChores(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Chore)));
      setLoading(false);
    });
    return unsub;
  }, [householdId]);

  return { chores, loading };
}
