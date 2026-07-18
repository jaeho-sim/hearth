import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Household } from '@/types/models';

export function useHousehold(householdId: string | null | undefined) {
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(!!householdId);

  useEffect(() => {
    if (!householdId) {
      setHousehold(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = onSnapshot(doc(db, 'households', householdId), (snap) => {
      setHousehold(snap.exists() ? ({ id: snap.id, ...snap.data() } as Household) : null);
      setLoading(false);
    });
    return unsub;
  }, [householdId]);

  return { household, loading };
}
