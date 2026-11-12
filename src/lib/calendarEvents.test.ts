import assert from 'node:assert/strict';
import test from 'node:test';
import { format } from 'date-fns';
import type { ExamEvent } from '../types';
import { getEventsInMonth, getEventsInWeek, getEventsOnDay, getWeekDays } from './calendarEvents';

function event(title: string, date: string, endDate = date): ExamEvent {
  return {
    exam_id: title,
    title,
    date,
    end_date: endDate,
    category: 'recruitment',
    mode: 'offline',
    scope: 'all-india',
    importance_level: 'high',
    location: ['All India'],
    official_source: '',
  };
}

test('single-day exams appear only on their scheduled date', () => {
  const exam = event('NDA 2 2026', '2026-09-13');
  assert.deepEqual(getEventsOnDay([exam], '2026-09-12'), []);
  assert.deepEqual(getEventsOnDay([exam], '2026-09-13'), [exam]);
  assert.deepEqual(getEventsOnDay([exam], '2026-09-14'), []);
});

test('overlapping multi-day exams include both endpoints and every intervening day', () => {
  const afcat = event('AFCAT 2 2026', '2026-08-28', '2026-08-30');
  const neet = event('NEET (PG) 2026', '2026-08-30');
  const events = [neet, afcat];
  assert.deepEqual(getEventsOnDay(events, '2026-08-27'), []);
  assert.deepEqual(getEventsOnDay(events, '2026-08-28'), [afcat]);
  assert.deepEqual(getEventsOnDay(events, '2026-08-29'), [afcat]);
  assert.deepEqual(getEventsOnDay(events, '2026-08-30'), [afcat, neet]);
  assert.deepEqual(getEventsOnDay(events, '2026-08-31'), []);
});

test('month agenda excludes adjacent grid dates and includes each spanning event once', () => {
  const before = event('August exam', '2026-08-30');
  const first = event('First day exam', '2026-09-01');
  const spanning = event('Ongoing exam', '2026-08-31', '2026-09-02');
  const last = event('Last day exam', '2026-09-30');
  const after = event('October exam', '2026-10-01');
  assert.deepEqual(
    getEventsInMonth([before, first, spanning, last, after], new Date(2026, 8, 15)),
    [spanning, first, last],
  );
});

test('cross-year exams appear in both months until the inclusive end date', () => {
  const ugc = event('UGC NET December 2026', '2026-12-31', '2027-01-07');
  assert.deepEqual(getEventsInMonth([ugc], new Date(2026, 11, 1)), [ugc]);
  assert.deepEqual(getEventsInMonth([ugc], new Date(2027, 0, 1)), [ugc]);
  assert.deepEqual(getEventsOnDay([ugc], '2027-01-07'), [ugc]);
  assert.deepEqual(getEventsOnDay([ugc], '2027-01-08'), []);
  assert.deepEqual(getEventsInMonth([ugc], new Date(2027, 1, 1)), []);
});

test('an exam spanning the entire month appears once even without a start or end in that month', () => {
  const exam = event('Extended exam window', '2026-08-15', '2026-10-15');
  assert.deepEqual(getEventsInMonth([exam], new Date(2026, 8, 1)), [exam]);
});

test('results sort chronologically then by title without mutating the source array', () => {
  const nda = event('NDA 2 2026', '2026-09-13');
  const cds = event('CDS 2 2026', '2026-09-13');
  const first = event('Earlier exam', '2026-09-01', '2026-09-13');
  const source = Object.freeze([nda, cds, first]);
  assert.deepEqual(getEventsInMonth(source, new Date(2026, 8, 1)), [first, cds, nda]);
  assert.deepEqual(getEventsOnDay(source, '2026-09-13'), [first, cds, nda]);
  assert.deepEqual(source, [nda, cds, first]);
});

test('empty or already-filtered input produces the corresponding agenda', () => {
  const ganesh = event('Ganesh Chaturthi', '2026-09-14');
  assert.deepEqual(getEventsInMonth([], new Date(2026, 8, 1)), []);
  assert.deepEqual(getEventsOnDay([], '2026-09-14'), []);
  assert.deepEqual(getEventsInMonth([ganesh], new Date(2026, 8, 1)), [ganesh]);
});

test('week days run Sunday through Saturday across a month boundary without changing the anchor', () => {
  const anchor = new Date(2026, 8, 2, 15, 30);
  const originalTime = anchor.getTime();
  const days = getWeekDays(anchor);
  assert.deepEqual(days.map(day => format(day, 'yyyy-MM-dd')), [
    '2026-08-30', '2026-08-31', '2026-09-01', '2026-09-02',
    '2026-09-03', '2026-09-04', '2026-09-05',
  ]);
  assert.deepEqual(days.map(day => day.getDay()), [0, 1, 2, 3, 4, 5, 6]);
  assert.ok(days.every(day => day.getHours() === 0));
  assert.equal(anchor.getTime(), originalTime);
});

test('weekly agenda includes exams on both boundaries and excludes dates outside the week', () => {
  const before = event('Previous Saturday', '2026-08-29');
  const endingSunday = event('AFCAT 2 2026', '2026-08-28', '2026-08-30');
  const saturday = event('Saturday exam', '2026-09-05');
  const after = event('Next Sunday', '2026-09-06');
  assert.deepEqual(
    getEventsInWeek([before, endingSunday, saturday, after], new Date(2026, 8, 2)),
    [endingSunday, saturday],
  );
});

test('weekly overview includes a cross-year exam once with all seven calendar dates', () => {
  const ugc = event('UGC NET December 2026', '2026-12-31', '2027-01-07');
  const anchor = new Date(2027, 0, 1);
  assert.deepEqual(getEventsInWeek([ugc], anchor), [ugc]);
  assert.deepEqual(getWeekDays(anchor).map(day => format(day, 'yyyy-MM-dd')), [
    '2026-12-27', '2026-12-28', '2026-12-29', '2026-12-30',
    '2026-12-31', '2027-01-01', '2027-01-02',
  ]);
  assert.deepEqual(getEventsInWeek([ugc], new Date(2027, 0, 6)), [ugc]);
  assert.deepEqual(getEventsInWeek([ugc], new Date(2027, 0, 13)), []);
});

test('weekly events sort once by start date and title without mutating their source', () => {
  const spanning = event('Ongoing exam', '2026-08-01', '2026-09-30');
  const nda = event('NDA 2 2026', '2026-09-13');
  const cds = event('CDS 2 2026', '2026-09-13');
  const source = Object.freeze([nda, spanning, cds]);
  assert.deepEqual(getEventsInWeek(source, new Date(2026, 8, 15)), [spanning, cds, nda]);
  assert.deepEqual(source, [nda, spanning, cds]);
  assert.deepEqual(getEventsInWeek([], new Date(2026, 8, 15)), []);
});

test('week days remain consecutive local midnights across spring and autumn daylight-saving changes', () => {
  const previousTimezone = process.env.TZ;
  try {
    process.env.TZ = 'America/New_York';
    for (const [month, firstDay, initialOffset, finalOffset] of [
      [2, 8, 300, 240],
      [10, 1, 240, 300],
    ]) {
      const days = getWeekDays(new Date(2026, month, firstDay + 3, 12));
      assert.equal(days.length, 7);
      assert.deepEqual(days.map(day => day.getDate()), Array.from({ length: 7 }, (_, index) => firstDay + index));
      assert.ok(days.every(day => day.getHours() === 0 && day.getMinutes() === 0));
      assert.equal(days[0].getTimezoneOffset(), initialOffset);
      assert.equal(days[6].getTimezoneOffset(), finalOffset);
    }
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});
