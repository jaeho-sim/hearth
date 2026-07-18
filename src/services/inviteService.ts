import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Invite } from '@/types/models';

/**
 * Creates a pending invite doc. A Cloud Function (see functions/src/index.ts,
 * `onInviteCreated`) listens for new docs in this collection and emails the
 * invitee a join link via the Trigger Email extension.
 */
export async function inviteMemberByEmail(params: {
  householdId: string;
  householdName: string;
  invitedEmail: string;
  invitedBy: string;
  invitedByName: string;
}) {
  const ref = await addDoc(collection(db, 'invites'), {
    householdId: params.householdId,
    householdName: params.householdName,
    invitedEmail: params.invitedEmail.trim().toLowerCase(),
    invitedBy: params.invitedBy,
    invitedByName: params.invitedByName,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Finds pending invites addressed to this email — shown to the user right after they sign in. */
export async function findPendingInvitesForEmail(email: string): Promise<Invite[]> {
  const q = query(
    collection(db, 'invites'),
    where('invitedEmail', '==', email.trim().toLowerCase()),
    where('status', '==', 'pending')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Invite));
}

/**
 * Accepting an invite is done through a callable Cloud Function (`acceptInvite`)
 * rather than a direct client write, because it needs to atomically add the
 * user to the household's members map, which the invited user doesn't yet
 * have write access to under the security rules.
 */
export async function revokeInvite(inviteId: string) {
  await updateDoc(doc(db, 'invites', inviteId), { status: 'revoked' });
}
