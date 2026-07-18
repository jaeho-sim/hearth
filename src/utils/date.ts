import { differenceInCalendarDays, format } from 'date-fns';

export function formatDate(timestamp: number | null | undefined) {
  if (!timestamp) return '';
  return format(new Date(timestamp), 'MMM d, yyyy');
}

/** Returns a short human label + urgency tone for an expiration date. */
export function expiryLabel(timestamp: number | null | undefined): { label: string; tone: 'ok' | 'soon' | 'expired' } | null {
  if (!timestamp) return null;
  const days = differenceInCalendarDays(new Date(timestamp), new Date());
  if (days < 0) return { label: 'Expired', tone: 'expired' };
  if (days === 0) return { label: 'Expires today', tone: 'soon' };
  if (days <= 3) return { label: `Expires in ${days}d`, tone: 'soon' };
  return { label: `Exp. ${formatDate(timestamp)}`, tone: 'ok' };
}
