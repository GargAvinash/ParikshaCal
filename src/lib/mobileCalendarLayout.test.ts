import assert from 'node:assert/strict';
import test from 'node:test';
import type { ExamEvent } from '../types';
import { layoutCalendarWeek } from './mobileCalendarLayout';

const week = ['2026-08-23', '2026-08-24', '2026-08-25', '2026-08-26', '2026-08-27', '2026-08-28', '2026-08-29'];
const monthStart = '2026-08-01';
const monthEnd = '2026-08-31';

function event(title: string, date: string, endDate = date): ExamEvent {
  return {
    exam_id: title, title, date, end_date: endDate,
    category: 'recruitment', mode: 'offline', scope: 'all-india',
    importance_level: 'high', location: ['All India'], official_source: '',
  };
}

test('fits a full title across its dates and keeps an unfitting title in that day’s indicators', () => {
  const window = event('SSC CGL 2026', '2026-08-24', '2026-08-28');
  const single = event('UPSC Civil Services (Prelims) 2026', '2026-08-25');
  const layout = layoutCalendarWeek([window, single], week, monthStart, monthEnd, 350, title => title.length * 6);
  assert.deepEqual(layout.segments, [{ event: window, startColumn: 1, span: 5, lane: 0, continuesBefore: false, continuesAfter: false }]);
  assert.deepEqual(layout.hiddenEventsByDay, [[], [], [single], [], [], [], []]);
  assert.equal(layout.laneCount, 1);
});

test('clips a multi-day exam at a week boundary and identifies both continuation directions', () => {
  const exam = event('AFCAT 2 2026', '2026-08-28', '2026-08-30');
  const first = layoutCalendarWeek([exam], week, monthStart, monthEnd, 350, () => 40);
  assert.deepEqual(first.segments[0], { event: exam, startColumn: 5, span: 2, lane: 0, continuesBefore: false, continuesAfter: true });
  const nextWeek = ['2026-08-30', '2026-08-31', '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05'];
  const second = layoutCalendarWeek([exam], nextWeek, monthStart, monthEnd, 350, () => 20);
  assert.deepEqual(second.segments[0], { event: exam, startColumn: 0, span: 1, lane: 0, continuesBefore: true, continuesAfter: false });
});

test('clips to the displayed month across New Year and excludes adjacent-month events', () => {
  const exam = event('UGC NET', '2026-12-31', '2027-01-07');
  const outside = event('December exam', '2026-12-30');
  const dates = ['2026-12-27', '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02'];
  const layout = layoutCalendarWeek([exam, outside], dates, '2027-01-01', '2027-01-31', 350, () => 40);
  assert.deepEqual(layout.segments, [{ event: exam, startColumn: 5, span: 2, lane: 0, continuesBefore: true, continuesAfter: true }]);
  assert.deepEqual(layout.hiddenEventsByDay, dates.map(() => []));
});

test('adjacent nonoverlapping exams share a lane, prioritizing the longer span first', () => {
  const early = event('Early', '2026-08-23', '2026-08-25');
  const later = event('Later', '2026-08-26', '2026-08-29');
  const layout = layoutCalendarWeek([early, later], week, monthStart, monthEnd, 350, () => 30);
  assert.deepEqual(layout.segments.map(({ event, lane }) => [event.title, lane]), [['Early', 0], ['Later', 0]]);
  assert.equal(layout.laneCount, 1);
});

test('limits overlapping bars to two lanes and counts only hidden events on affected days', () => {
  const long = event('Long', '2026-08-23', '2026-08-29');
  const medium = event('Medium', '2026-08-24', '2026-08-28');
  const short = event('Short', '2026-08-25', '2026-08-27');
  const layout = layoutCalendarWeek([short, medium, long], week, monthStart, monthEnd, 350, () => 30);
  assert.deepEqual(layout.segments.map(({ event, lane }) => [event.title, lane]), [['Long', 0], ['Medium', 1]]);
  assert.deepEqual(layout.hiddenEventsByDay, [[], [], [short], [short], [short], [], []]);
  assert.equal(layout.laneCount, 2);
});

test('uses measured title width and preserves the required border, inset, and gutter space', () => {
  const exam = event('Two days', '2026-08-24', '2026-08-25');
  assert.equal(layoutCalendarWeek([exam], week, monthStart, monthEnd, 350, () => 80).segments.length, 1);
  const tooWide = layoutCalendarWeek([exam], week, monthStart, monthEnd, 350, () => 81);
  assert.equal(tooWide.segments.length, 0);
  assert.deepEqual(tooWide.hiddenEventsByDay, [[], [exam], [exam], [], [], [], []]);
  const short = event('CAT', '2026-08-26');
  assert.equal(layoutCalendarWeek([short], week, monthStart, monthEnd, 350, () => 20).segments[0].span, 1);
});

test('zero width or no available lanes conservatively keeps every event in indicators', () => {
  const exam = event('Window', '2026-08-24', '2026-08-25');
  for (const [width, lanes] of [[0, 2], [350, 0]]) {
    const layout = layoutCalendarWeek([exam], week, monthStart, monthEnd, width, () => 20, lanes);
    assert.deepEqual(layout.segments, []);
    assert.equal(layout.laneCount, 0);
    assert.deepEqual(layout.hiddenEventsByDay, [[], [exam], [exam], [], [], [], []]);
  }
});

test('unavailable font measurement keeps the complete event accessible in indicators', () => {
  const exam = event('Window', '2026-08-24', '2026-08-25');
  const layout = layoutCalendarWeek([exam], week, monthStart, monthEnd, 350, () => Number.NaN);
  assert.equal(layout.segments.length, 0);
  assert.deepEqual(layout.hiddenEventsByDay[1], [exam]);
});

test('layout is deterministic and never mutates its input', () => {
  const a = Object.freeze(event('A', '2026-08-24', '2026-08-25'));
  const b = Object.freeze(event('B', '2026-08-24', '2026-08-25'));
  const source = Object.freeze([b, a]);
  const dates = Object.freeze([...week]);
  const layout = layoutCalendarWeek(source, dates, monthStart, monthEnd, 350, () => 20);
  assert.deepEqual(layout.segments.map(({ event, lane }) => [event.title, lane]), [['A', 0], ['B', 1]]);
  assert.deepEqual(source, [b, a]);
  assert.deepEqual(dates, week);
});
