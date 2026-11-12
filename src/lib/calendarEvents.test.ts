import assert from 'node:assert/strict';
import test from 'node:test';
import type { ExamEvent } from '../types';
import { getEventsInMonth, getEventsOnDay } from './calendarEvents';

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
