import type { ExamEvent } from '../types';

export interface MobileCalendarSegment {
  event: ExamEvent;
  /** Zero-based weekday column. */
  startColumn: number;
  span: number;
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
}

export interface CalendarWeekLayout {
  segments: MobileCalendarSegment[];
  hiddenEventsByDay: ExamEvent[][];
  laneCount: number;
}

/**
 * Place readable, single-line event bars within one seven-day calendar row.
 * Source dates are inclusive. Titles that cannot fit comfortably, and events
 * beyond the lane limit, remain available through each day's hidden indicators.
 * `gridWidth` is the inner width of all seven columns, measured by the caller.
 */
export function layoutCalendarWeek(
  events: readonly ExamEvent[],
  weekDates: readonly string[],
  monthStart: string,
  monthEnd: string,
  gridWidth: number,
  measureTitle: (title: string) => number,
  maxLanes = 2,
): CalendarWeekLayout {
  const candidates = events.flatMap(event => {
    const coveredColumns = weekDates.flatMap((date, column) =>
      date >= monthStart && date <= monthEnd && event.date <= date && event.end_date >= date
        ? [column]
        : [],
    );
    if (!coveredColumns.length) return [];
    const startColumn = coveredColumns[0];
    const endColumn = coveredColumns[coveredColumns.length - 1];
    return [{
      event,
      startColumn,
      span: endColumn - startColumn + 1,
      continuesBefore: event.date < weekDates[startColumn],
      continuesAfter: event.end_date > weekDates[endColumn],
    }];
  }).sort((a, b) => b.span - a.span
    || a.event.date.localeCompare(b.event.date)
    || a.event.title.localeCompare(b.event.title)
    || a.event.exam_id.localeCompare(b.event.exam_id));

  const laneLimit = Number.isFinite(maxLanes) ? Math.max(0, Math.floor(maxLanes)) : 2;
  const occupied: boolean[][] = [];
  const segments: MobileCalendarSegment[] = [];
  const hiddenEventsByDay: ExamEvent[][] = weekDates.map(() => []);

  for (const candidate of candidates) {
    const { event, startColumn, span } = candidate;
    const titleWidth = measureTitle(event.title);
    // Four pixels of space between bars, plus sixteen for border and text inset.
    const availableWidth = gridWidth * span / 7 - 4;
    let lane = -1;
    if (gridWidth > 0 && Number.isFinite(titleWidth) && titleWidth >= 0 && titleWidth + 16 <= availableWidth) {
      lane = Array.from({ length: laneLimit }, (_, index) => index).find(index =>
        !occupied[index]?.slice(startColumn, startColumn + span).some(Boolean),
      ) ?? -1;
    }

    if (lane === -1) {
      for (let column = startColumn; column < startColumn + span; column++) {
        hiddenEventsByDay[column].push(event);
      }
      continue;
    }

    occupied[lane] ??= weekDates.map(() => false);
    occupied[lane].fill(true, startColumn, startColumn + span);
    segments.push({ ...candidate, lane });
  }

  for (const hiddenEvents of hiddenEventsByDay) {
    hiddenEvents.sort((a, b) => a.date.localeCompare(b.date)
      || a.title.localeCompare(b.title)
      || a.exam_id.localeCompare(b.exam_id));
  }

  return {
    segments: segments.sort((a, b) => a.lane - b.lane || a.startColumn - b.startColumn),
    hiddenEventsByDay,
    laneCount: occupied.length,
  };
}
