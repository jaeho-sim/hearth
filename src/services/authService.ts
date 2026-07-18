import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
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

/**
 * Exchanges an Apple identity token for a Firebase session. Apple only returns
 * the user's name on their very first sign-in (it's on the native credential,
 * not the token), so `fullName` is passed in separately and written onto the
 * Firebase user + profile doc the first time we see them.
 */
export async function signInWithApple(identityToken: string, rawNonce: string, fullName?: string | null) {
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken: identityToken, rawNonce });
  const result = await signInWithCredential(auth, credential);

  if (fullName && !result.user.displayName) {
    await updateProfile(result.user, { displayName: fullName });
  }

  await ensureUserProfile(
    result.user.uid,
    fullName ?? result.user.displayName ?? 'Unnamed',
    result.user.email ?? '',
    result.user.photoURL ?? undefined
  );
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
