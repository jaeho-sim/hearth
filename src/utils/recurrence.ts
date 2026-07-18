import { addDays, addMonths, addWeeks } from 'date-fns';
import { Recurrence } from '@/types/models';

/** Computes the next due date after a chore is completed, based on its recurrence rule. */
export function nextDueDate(currentDue: number, recurrence: Recurrence): number | null {
  const base = new Date(currentDue);
  switch (recurrence.frequency) {
    case 'daily':
      return addDays(base, recurrence.interval || 1).getTime();
    case 'weekly':
      return addWeeks(base, recurrence.interval || 1).getTime();
    case 'monthly':
      return addMonths(base, recurrence.interval || 1).getTime();
    case 'custom':
      return addDays(base, recurrence.interval || 1).getTime();
    case 'none':
    default:
      return null;
  }
}

export function recurrenceLabel(recurrence: Recurrence): string {
  if (recurrence.frequency === 'none') return 'One-time';
  const n = recurrence.interval || 1;
  const unit = { daily: 'day', weekly: 'week', monthly: 'month', custom: 'day' }[recurrence.frequency];
  return n === 1 ? `Every ${unit}` : `Every ${n} ${unit}s`;
}
