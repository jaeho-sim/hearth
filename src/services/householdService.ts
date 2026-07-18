import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Household, HouseholdMember } from '@/types/models';

const DEFAULT_CATEGORIES = [
  { name: 'Fridge', icon: 'snow-outline' },
  { name: 'Freezer', icon: 'cube-outline' },
  { name: 'Pantry', icon: 'file-tray-stacked-outline' },
  { name: 'Bathroom', icon: 'water-outline' },
];

export async function createHousehold(name: string, owner: HouseholdMember) {
  const householdRef = await addDoc(collection(db, 'households'), {
    name,
    createdBy: owner.uid,
    createdAt: serverTimestamp(),
    memberIds: [owner.uid],
    members: { [owner.uid]: owner },
  });

  await Promise.all(
    DEFAULT_CATEGORIES.map((c, i) =>
      addDoc(collection(db, 'households', householdRef.id, 'categories'), {
        name: c.name,
        icon: c.icon,
        order: i,
        createdAt: serverTimestamp(),
      })
    )
  );

  await updateDoc(doc(db, 'users', owner.uid), { householdId: householdRef.id });
  return householdRef.id;
}

export async function renameHousehold(householdId: string, name: string) {
  await updateDoc(doc(db, 'households', householdId), { name });
}

export async function getHousehold(householdId: string): Promise<Household | null> {
  const snap = await getDoc(doc(db, 'households', householdId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Household) : null;
}

export async function removeMember(householdId: string, uid: string) {
  await updateDoc(doc(db, 'households', householdId), {
    memberIds: arrayRemove(uid),
    [`members.${uid}`]: null,
  });
  await updateDoc(doc(db, 'users', uid), { householdId: null });
}

export async function leaveHousehold(householdId: string, uid: string) {
  await removeMember(householdId, uid);
}
