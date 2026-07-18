import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { UserProfile } from '@/types/models';

/** Exchanges a Google ID token for a Firebase session, then ensures a user profile doc exists. */
export async function signInWithGoogleIdToken(idToken: string) {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  await ensureUserProfile(result.user.uid, result.user.displayName ?? 'Unnamed', result.user.email ?? '', result.user.photoURL ?? undefined);
  return result.user;
}

async function ensureUserProfile(uid: string, displayName: string, email: string, photoURL?: string) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const profile: Omit<UserProfile, 'createdAt'> & { createdAt: unknown } = {
      uid,
      displayName,
      email,
      photoURL,
      householdId: null,
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, profile);
  }
}

export function signOut() {
  return firebaseSignOut(auth);
}
