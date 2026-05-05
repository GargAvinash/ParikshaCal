import { ExamEvent } from '../types';

const VALID_MODES = ['online', 'offline', 'hybrid'];
const VALID_SCOPES = ['all-india', 'state-level', 'multi-state', 'regional', 'state', 'district', 'local'];
const VALID_IMPORTANCE = ['high', 'medium', 'low'];

// ISO date format: YYYY-MM-DD
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

interface ValidationError {
  index: number;
  exam_id?: string;
  errors: string[];
}

/**
 * Validates an array of raw event objects against the ExamEvent schema.
 * Returns validated events and any errors found.
 * Invalid entries are filtered out so the app can still render.
 */
export function validateEvents(raw: unknown[]): { events: ExamEvent[]; errors: ValidationError[] } {
  const events: ExamEvent[] = [];
  const errors: ValidationError[] = [];

  for (let i = 0; i < raw.length; i++) {
    const entry = raw[i] as Record<string, unknown>;
    const entryErrors: string[] = [];

    // Required string fields
    for (const field of ['exam_id', 'title', 'category', 'date', 'end_date'] as const) {
      if (typeof entry[field] !== 'string' || !entry[field]) {
        entryErrors.push(`Missing or invalid "${field}"`);
      }
    }

    // Mode
    if (!VALID_MODES.includes(entry.mode as string)) {
      entryErrors.push(`Invalid mode "${entry.mode}" (expected: ${VALID_MODES.join(', ')})`);
    }

    // Scope
    if (!VALID_SCOPES.includes(entry.scope as string)) {
      entryErrors.push(`Invalid scope "${entry.scope}" (expected: ${VALID_SCOPES.join(', ')})`);
    }

    // Importance
    if (!VALID_IMPORTANCE.includes(entry.importance_level as string)) {
      entryErrors.push(`Invalid importance_level "${entry.importance_level}" (expected: ${VALID_IMPORTANCE.join(', ')})`);
    }

    // Date format
    if (typeof entry.date === 'string' && !ISO_DATE_RE.test(entry.date)) {
      entryErrors.push(`Invalid date format "${entry.date}" (expected YYYY-MM-DD)`);
    }
    if (typeof entry.end_date === 'string' && !ISO_DATE_RE.test(entry.end_date)) {
      entryErrors.push(`Invalid end_date format "${entry.end_date}" (expected YYYY-MM-DD)`);
    }

    // Location must be a non-empty array of strings
    if (!Array.isArray(entry.location) || entry.location.length === 0) {
      entryErrors.push('Missing or empty "location" array');
    }

    // official_source must be a string (can be empty)
    if (typeof entry.official_source !== 'string') {
      entryErrors.push('Missing "official_source" (use empty string if unavailable)');
    }

    if (entryErrors.length > 0) {
      errors.push({ index: i, exam_id: entry.exam_id as string | undefined, errors: entryErrors });
    } else {
      events.push(entry as unknown as ExamEvent);
    }
  }

  if (errors.length > 0) {
    console.warn(
      `[ParikshaCal] ${errors.length} event(s) failed validation and were skipped:`,
      errors
    );
  }

  return { events, errors };
}
