import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/config/firebase';

interface AcceptInviteResult {
  householdId: string;
}

export async function acceptInvite(inviteId: string): Promise<AcceptInviteResult> {
  const functions = getFunctions(app);
  const call = httpsCallable<{ inviteId: string }, AcceptInviteResult>(functions, 'acceptInvite');
  const res = await call({ inviteId });
  return res.data;
}
