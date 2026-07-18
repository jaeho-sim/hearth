import * as admin from 'firebase-admin';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

admin.initializeApp();
const db = admin.firestore();

/**
 * Fires whenever a household owner creates an invite doc (see
 * src/services/inviteService.ts on the client). Writes a doc to the `mail`
 * collection, which the "Trigger Email" Firebase Extension picks up and
 * sends automatically. Install the extension and configure it to watch the
 * `mail` collection: https://extensions.dev/extensions/firebase/firestore-send-email
 */
export const onInviteCreated = onDocumentCreated('invites/{inviteId}', async (event) => {
  const snap = event.data;
  if (!snap) return;
  const invite = snap.data();

  const joinLink = `hearth://join/${event.params.inviteId}`;

  await db.collection('mail').add({
    to: [invite.invitedEmail],
    message: {
      subject: `${invite.invitedByName} invited you to join "${invite.householdName}" on Hearth`,
      html: `
        <p>${invite.invitedByName} invited you to join their household <strong>${invite.householdName}</strong> on Hearth.</p>
        <p>Open the Hearth app, sign in with Google using this email address, and the invite will be waiting for you to accept.</p>
        <p><a href="${joinLink}">Tap here to open Hearth</a> if you already have it installed.</p>
      `,
    },
  });
});

/**
 * Callable function used to accept an invite. Runs with elevated (admin)
 * privileges so it can add the invited user to a household they don't yet
 * have write access to, while still verifying the invite is genuinely theirs.
 */
export const acceptInvite = onCall(async (request) => {
  const uid = request.auth?.uid;
  const email = request.auth?.token.email;
  if (!uid || !email) {
    throw new HttpsError('unauthenticated', 'You must be signed in to accept an invite.');
  }

  const { inviteId } = request.data as { inviteId: string };
  if (!inviteId) {
    throw new HttpsError('invalid-argument', 'inviteId is required.');
  }

  const inviteRef = db.collection('invites').doc(inviteId);
  const userRef = db.collection('users').doc(uid);

  const householdId = await db.runTransaction(async (tx) => {
    const inviteSnap = await tx.get(inviteRef);
    if (!inviteSnap.exists) throw new HttpsError('not-found', 'Invite not found.');
    const invite = inviteSnap.data()!;

    if (invite.status !== 'pending') {
      throw new HttpsError('failed-precondition', 'This invite is no longer valid.');
    }
    if (invite.invitedEmail !== email.toLowerCase()) {
      throw new HttpsError('permission-denied', 'This invite was sent to a different email address.');
    }

    const userSnap = await tx.get(userRef);
    const user = userSnap.data() ?? {};

    const householdRef = db.collection('households').doc(invite.householdId);
    tx.update(householdRef, {
      memberIds: admin.firestore.FieldValue.arrayUnion(uid),
      [`members.${uid}`]: {
        uid,
        displayName: user.displayName ?? 'Household member',
        email,
        photoURL: user.photoURL ?? null,
        role: 'member',
        joinedAt: Date.now(),
      },
    });

    tx.update(userRef, { householdId: invite.householdId });
    tx.update(inviteRef, { status: 'accepted', respondedAt: admin.firestore.FieldValue.serverTimestamp() });

    return invite.householdId as string;
  });

  return { householdId };
});
