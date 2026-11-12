import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format,
  isSameMonth, isToday, parseISO, startOfMonth, startOfWeek,
} from 'date-fns';
import { ExamEvent } from '../types';
import { cn } from '../lib/utils';
import { getEventsInMonth, getEventsInWeek, getEventsOnDay, getWeekDays } from '../lib/calendarEvents';

interface MobileCalendarProps {
  month: Date;
  events: ExamEvent[];
  onMonthChange: (date: Date) => void;
  onEventClick: (event: ExamEvent) => void;
}

const priorityStyles = {
  high: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200' },
  medium: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  low: { dot: 'bg-blue-400', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
};

function eventDates(event: ExamEvent) {
  const start = parseISO(event.date);
  const end = parseISO(event.end_date);
  if (event.date === event.end_date) return format(start, 'EEE, d MMM');
  if (start.getFullYear() !== end.getFullYear()) {
    return `${format(start, 'd MMM yyyy')} – ${format(end, 'd MMM yyyy')}`;
  }
  return `${format(start, 'd MMM')} – ${format(end, 'd MMM')}`;
}

function initialWeekDate(month: Date, events: ExamEvent[]) {
  if (isSameMonth(month, new Date())) return new Date();
  const firstEvent = getEventsInMonth(events, month)[0];
  return firstEvent && firstEvent.date > format(month, 'yyyy-MM-dd') ? parseISO(firstEvent.date) : month;
}

function weekTitle(days: Date[]) {
  const first = days[0];
  const last = days[6];
  if (first.getFullYear() !== last.getFullYear()) return `${format(first, 'd MMM yyyy')} – ${format(last, 'd MMM yyyy')}`;
  if (!isSameMonth(first, last)) return `${format(first, 'd MMM')} – ${format(last, 'd MMM yyyy')}`;
  return `${format(first, 'd')}–${format(last, 'd MMM yyyy')}`;
}

function EventRow({ event, compact = false, onEventClick }: {
  event: ExamEvent;
  compact?: boolean;
  onEventClick: (event: ExamEvent) => void;
}) {
  return (
    <button type="button" onClick={() => onEventClick(event)} data-agenda-event={event.exam_id}
      className={cn('w-full flex items-start gap-3 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600', compact ? 'rounded-lg px-2 py-2.5' : 'p-4')}>
      <span className={cn('w-1 self-stretch shrink-0 rounded-full', priorityStyles[event.importance_level].dot)} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-5 text-slate-800 [overflow-wrap:anywhere]">{event.title}</span>
        <span className="block mt-1 text-xs text-slate-500">{eventDates(event)}{compact && <span className="capitalize"> · {event.mode}</span>}</span>
        {compact ? <span className="sr-only">{event.importance_level} priority</span> : (
          <span className="mt-2 flex items-center gap-2 text-[10px]">
            <span className={cn('rounded border px-1.5 py-0.5 font-medium capitalize', priorityStyles[event.importance_level].badge)}>{event.importance_level} priority</span>
            <span className="text-slate-500 capitalize">{event.mode}</span>
          </span>
        )}
      </span>
      <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
    </button>
  );
}

function PriorityLegend() {
  return (
    <div className="flex items-center justify-center gap-4 border-t border-slate-100 px-3 py-2.5 text-[10px] font-medium text-slate-500" aria-label="Event priority">
      {(['high', 'medium', 'low'] as const).map(priority => (
        <span key={priority} className="flex items-center gap-1.5 capitalize">
          <span className={cn('w-1.5 h-1.5 rounded-full', priorityStyles[priority].dot)} />{priority}
        </span>
      ))}
    </div>
  );
}

export function MobileCalendar({ month, events, onMonthChange, onEventClick }: MobileCalendarProps) {
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weekAnchor, setWeekAnchor] = useState(() => initialWeekDate(month, events));
  // Preserve toolbar focus and the current week when navigation crosses a month.
  useEffect(() => {
    setSelectedDate(null);
    setWeekAnchor(current => isSameMonth(current, month) ? current : initialWeekDate(month, events));
  }, [month]);

  const days = eachDayOfInterval({ start: startOfWeek(month, { weekStartsOn: 0 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }) });
  const weekDays = getWeekDays(weekAnchor);
  const weekEvents = getEventsInWeek(events, weekAnchor);
  const visibleEvents = selectedDate ? getEventsOnDay(events, selectedDate) : getEventsInMonth(events, month);
  const agendaTitle = selectedDate ? format(parseISO(selectedDate), 'EEE, d MMMM') : `${format(month, 'MMMM')} events`;

  const changeView = (nextView: 'month' | 'week') => {
    if (nextView === 'week' && selectedDate) setWeekAnchor(parseISO(selectedDate));
    setView(nextView);
  };
  const navigate = (direction: number) => {
    setSelectedDate(null);
    if (view === 'month') {
      onMonthChange(addMonths(month, direction));
    } else {
      const next = addWeeks(weekAnchor, direction);
      setWeekAnchor(next);
      if (!isSameMonth(next, month)) onMonthChange(startOfMonth(next));
    }
  };

  return (
    <div className="sm:hidden space-y-3" data-testid="mobile-calendar">
      <section aria-label={view === 'month' ? 'Month calendar' : 'Week calendar'} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
          <h2 className="min-w-0 text-base font-semibold tracking-tight text-slate-900" aria-live="polite">
            {view === 'month' ? format(month, 'MMMM yyyy') : weekTitle(weekDays)}
          </h2>
          <div className="flex shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <button type="button" aria-label={`Previous ${view}`} onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button type="button" aria-label={`Next ${view}`} onClick={() => navigate(1)}
              className="w-10 h-10 flex items-center justify-center border-l border-slate-200 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mx-4 mb-4 flex rounded-lg bg-slate-100 p-1" role="group" aria-label="Calendar view">
          {(['month', 'week'] as const).map(option => (
            <button key={option} type="button" aria-pressed={view === option} onClick={() => changeView(option)}
              className={cn('flex-1 min-h-9 rounded-md text-xs font-semibold capitalize transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600',
                view === option ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
              {option}
            </button>
          ))}
        </div>

        {view === 'month' ? (
          <>
            <div className="grid grid-cols-7 pt-3 pb-2 border-t border-slate-100" aria-hidden="true">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <span key={day} className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 px-1 pb-2">
              {days.map(day => {
                const date = format(day, 'yyyy-MM-dd');
                const dayEvents = getEventsOnDay(events, date);
                const selected = selectedDate === date;
                const inMonth = isSameMonth(day, month);
                const dots = dayEvents.slice(0, dayEvents.length > 3 ? 2 : 3);
                return (
                  <button key={date} type="button" data-date={date} disabled={!inMonth}
                    aria-label={`${format(day, 'EEEE, d MMMM yyyy')}, ${dayEvents.length} ${dayEvents.length === 1 ? 'event' : 'events'}`}
                    aria-pressed={selected} aria-current={isToday(day) ? 'date' : undefined}
                    onClick={() => setSelectedDate(selected ? null : date)}
                    className={cn('min-w-0 h-12 flex flex-col items-center justify-center gap-1 rounded-lg enabled:hover:bg-slate-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600', selected && 'bg-indigo-50')}>
                    <span className={cn('w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium',
                      inMonth ? 'text-slate-600' : 'text-slate-300', isToday(day) && 'bg-blue-50 text-blue-600', selected && '!bg-indigo-600 !text-white')}>
                      {format(day, 'd')}
                    </span>
                    <span className="h-2 flex items-center justify-center gap-0.5" aria-hidden="true">
                      {inMonth && dots.map(event => <span key={event.exam_id} className={cn('w-1.5 h-1.5 rounded-full', priorityStyles[event.importance_level].dot)} />)}
                      {inMonth && dayEvents.length > 3 && <span className="text-[9px] leading-none text-slate-500">+{dayEvents.length - 2}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            <PriorityLegend />
          </>
        ) : (
          <>
            <div className="px-4 pb-3 text-[11px] text-slate-500" aria-live="polite">{weekEvents.length} {weekEvents.length === 1 ? 'event' : 'events'} this week</div>
            <PriorityLegend />
            {events.length === 0 && <p className="px-4 py-4 text-center text-sm text-slate-500">No events match your filters.</p>}
            <div className="border-t border-slate-100 divide-y divide-slate-100">
              {weekDays.map(day => {
                const date = format(day, 'yyyy-MM-dd');
                const dayEvents = getEventsOnDay(events, date);
                return (
                  <section key={date} data-week-date={date} aria-label={format(day, 'EEEE, d MMMM yyyy')}
                    className={cn('flex gap-2 px-3', dayEvents.length ? 'py-3' : 'py-2', isToday(day) && 'bg-blue-50/40')}>
                    <h3 className="w-11 shrink-0 text-center pt-2">
                      <span className={cn('block text-[10px] font-semibold uppercase tracking-wider', isToday(day) ? 'text-blue-600' : 'text-slate-500')}>{format(day, 'EEE')}</span>
                      <span className={cn('block text-xl font-semibold leading-7', isToday(day) ? 'text-blue-600' : 'text-slate-700')}>{format(day, 'd')}</span>
                    </h3>
                    {dayEvents.length ? (
                      <ul className="min-w-0 flex-1 space-y-1">
                        {dayEvents.map(event => <li key={event.exam_id}><EventRow event={event} compact onEventClick={onEventClick} /></li>)}
                      </ul>
                    ) : <p className="self-center pl-2 text-xs text-slate-400">No events</p>}
                  </section>
                );
              })}
            </div>
          </>
        )}
      </section>

      {view === 'month' && (
        <section aria-label="Events" className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-4 border-b border-slate-100">
            <div aria-live="polite">
              <h3 className="text-sm font-semibold text-slate-900">{agendaTitle}</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">{visibleEvents.length} {visibleEvents.length === 1 ? 'event' : 'events'}</p>
            </div>
            {selectedDate && <button type="button" onClick={() => setSelectedDate(null)} className="min-h-10 px-2 text-xs font-semibold text-indigo-600 rounded-md hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-indigo-600">Show month</button>}
          </div>
          {visibleEvents.length ? (
            <ul className="divide-y divide-slate-100">
              {visibleEvents.map(event => <li key={event.exam_id}><EventRow event={event} onEventClick={onEventClick} /></li>)}
            </ul>
          ) : <p className="px-4 py-8 text-center text-sm text-slate-500">{events.length === 0 ? 'No events match your filters.' : selectedDate ? 'No events on this day.' : 'No events this month.'}</p>}
        </section>
      )}
    </div>
  );
}
