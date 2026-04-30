import { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ExamEvent } from '../types';
import { parseISO, addDays, format } from 'date-fns';

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
      <div className="bg-white sm:bg-transparent rounded-xl sm:rounded-none overflow-hidden sm:border-none border border-slate-200">
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
               <div className={`w-full px-1.5 py-0.5 rounded sm:rounded-md text-[10px] sm:text-xs font-bold border border-l-4 truncate ${bgColor} ${borderColor} ${textColor}`}>
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
      </div>
      
      {/* Custom styles to make FullCalendar look modern */}
      <style>{`
        .fc {
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: #f8fafc;
          --fc-neutral-text-color: #94a3b8;
          --fc-border-color: #e2e8f0;
          --fc-button-text-color: #64748b;
          --fc-button-bg-color: transparent;
          --fc-button-border-color: transparent;
          --fc-button-hover-bg-color: #f1f5f9;
          --fc-button-hover-border-color: transparent;
          --fc-button-active-bg-color: #e2e8f0;
          --fc-button-active-border-color: transparent;
          --fc-event-bg-color: #3b82f6;
          --fc-event-border-color: #3b82f6;
          --fc-today-bg-color: #f8fafc;
          font-family: inherit;
        }

        .fc .fc-toolbar {
          background-color: #ffffff;
          padding: 1rem 1rem;
          margin-bottom: 0 !important;
          border-bottom: 1px solid #e2e8f0;
        }

        @media (min-width: 640px) {
          .fc .fc-toolbar {
            padding: 1rem 2rem;
          }
        }
        
        @media (max-width: 640px) {
          .fc .fc-toolbar {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }
          .fc .fc-toolbar-title {
            font-size: 1.25rem !important;
            margin-right: 0 !important;
          }
          .fc .fc-toolbar-chunk:last-child {
            width: 100%;
            justify-content: flex-start;
          }
        }
        
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.025em;
          margin-right: 1rem;
          width: 140px;
          text-align: left;
        }

        @media (min-width: 640px) {
          .fc .fc-toolbar-title {
            font-size: 1.5rem;
            margin-right: 1.5rem;
            width: 220px;
          }
        }

        .fc .fc-toolbar-chunk {
          display: flex;
          align-items: center;
        }

        .fc .fc-button {
          font-weight: 600;
          text-transform: capitalize;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          box-shadow: none;
          transition: all 0.2s;
        }
        
        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
          color: #0f172a;
          background-color: #e2e8f0;
        }

        .fc .fc-button-primary:not(:disabled):focus {
          box-shadow: none;
        }

        .fc-theme-standard th {
          padding: 0.75rem 0;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          border-color: transparent !important;
          border-bottom-color: #e2e8f0 !important;
          background-color: #ffffff;
        }

        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #e2e8f0;
        }

        .fc-daygrid-day {
          background-color: #ffffff;
        }
        
        .fc-day-other {
          background-color: #f8fafc !important;
        }
        
        .fc-day-other .fc-daygrid-day-number {
          color: #cbd5e1 !important;
        }

        .fc-daygrid-day-number {
          padding: 0.5rem !important;
          color: #1e293b;
          font-weight: 700;
        }

        .fc-col-header-cell {
          background-color: transparent;
        }

        .fc-day-today .fc-daygrid-day-number {
          background-color: transparent;
          color: #3b82f6;
          border-radius: 0;
          min-width: auto;
          height: auto;
          display: inline-block;
          margin: 0;
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 2px;
        }

        .fc-h-event {
          border-radius: 4px;
          border: none;
          padding: 0;
          margin-bottom: 2px;
          background-color: transparent !important;
        }

        .fc-event-main {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0;
        }
        
        /* Make scrollbars minimal */
        .fc-scroller::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .fc-scroller::-webkit-scrollbar-track {
          background: transparent;
        }
        .fc-scroller::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
