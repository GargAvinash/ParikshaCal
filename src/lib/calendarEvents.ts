import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
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

export function getWeekDays(anchorDate: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(anchorDate, { weekStartsOn: 0 }),
    end: endOfWeek(anchorDate, { weekStartsOn: 0 }),
  });
}

export function getEventsInWeek(events: readonly ExamEvent[], anchorDate: Date): ExamEvent[] {
  return eventsInRange(
    events,
    format(startOfWeek(anchorDate, { weekStartsOn: 0 }), 'yyyy-MM-dd'),
    format(endOfWeek(anchorDate, { weekStartsOn: 0 }), 'yyyy-MM-dd'),
  );
}
