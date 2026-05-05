import { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ExamEvent } from '../types';
import { parseISO, addDays, format, isPast } from 'date-fns';

interface CalendarWidgetProps {
  events: ExamEvent[];
  onEventClick: (event: ExamEvent) => void;
}

export function CalendarWidget({ events, onEventClick }: CalendarWidgetProps) {
  const calendarRef = useRef<FullCalendar>(null);

  // Map our ExamEvent to FullCalendar's Event Input
  const fcEvents = events.map(event => {
    // FullCalendar end dates are exclusive for all-day events.
    // If our data has end_date inclusive, we add 1 day to end_date.
    const isMultiDay = event.date !== event.end_date;
    const fcEndDate = isMultiDay 
      ? format(addDays(parseISO(event.end_date), 1), 'yyyy-MM-dd')
      : event.date; // single day

    let color = 'transparent';

    return {
      id: event.exam_id,
      title: event.title,
      start: event.date,
      end: isMultiDay ? fcEndDate : undefined,
      allDay: true, // Assuming exams are mostly full day or time is not specified in current schema
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        originalEvent: event
      }
    };
  });

  return (
    <div className="w-full bg-slate-100 flex flex-col">
      <div className="bg-white sm:bg-transparent rounded-xl sm:rounded-none overflow-hidden sm:border-none border border-slate-200 calendar-wrapper">
        {/* @ts-ignore: React 19 typing compat */}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'title prev,next',
            center: '',
            right: ''
          }}
          events={fcEvents}
          eventContent={(eventInfo) => {
             const ev = eventInfo.event.extendedProps.originalEvent as ExamEvent;
             const eventPast = isPast(parseISO(ev.end_date));
             let bgColor = "bg-blue-100";
             let textColor = "text-blue-800";
             let borderColor = "border-blue-500";
             
             if (ev.importance_level === "high") {
               bgColor = "bg-red-100";
               textColor = "text-red-800";
               borderColor = "border-red-500";
             } else if (ev.importance_level === "medium") {
               bgColor = "bg-amber-100";
               textColor = "text-amber-900";
               borderColor = "border-amber-500";
             }

             return (
               <div className={`w-full px-1.5 py-0.5 rounded sm:rounded-md text-[10px] sm:text-xs font-bold border border-l-4 truncate ${bgColor} ${borderColor} ${textColor} ${eventPast ? 'opacity-50' : ''}`}>
                 {eventInfo.event.title}
               </div>
             )
          }}
          eventClick={(info) => {
            onEventClick(info.event.extendedProps.originalEvent as ExamEvent);
          }}
          height="auto"
          eventClassNames="cursor-pointer font-medium hover:opacity-80 transition-opacity !rounded-sm px-1"
          dayMaxEvents={3}
        />
        {/* Importance legend — positioned inside toolbar via CSS */}
        <div className="calendar-legend hidden md:flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> High</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Low</span>
        </div>
      </div>
    </div>
  );
}
