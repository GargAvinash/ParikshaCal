import { endOfMonth, format, startOfMonth } from 'date-fns';
import type { ExamEvent } from '../types';

function eventsInRange(events: readonly ExamEvent[], start: string, end: string): ExamEvent[] {
  // Source dates are ISO calendar dates with inclusive end dates, so comparisons
  // do not need UTC conversion and remain stable in every local time zone.
  return events
    .filter(event => event.date <= end && event.end_date >= start)
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}

export function getEventsOnDay(events: readonly ExamEvent[], date: string): ExamEvent[] {
  return eventsInRange(events, date, date);
}

export function getEventsInMonth(events: readonly ExamEvent[], month: Date): ExamEvent[] {
  return eventsInRange(
    events,
    format(startOfMonth(month), 'yyyy-MM-dd'),
    format(endOfMonth(month), 'yyyy-MM-dd'),
  );
}
