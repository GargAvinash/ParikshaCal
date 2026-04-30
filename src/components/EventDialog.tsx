import { ExamEvent } from '../types';
import { Calendar, MapPin, Globe, Monitor, ExternalLink, CalendarDays } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';

interface EventDialogProps {
  event: ExamEvent | null;
  onClose: () => void;
}

export function EventDialog({ event, onClose }: EventDialogProps) {
  if (!event) return null;

  const startDate = parseISO(event.date);
  const endDate = parseISO(event.end_date);
  const isMultiDay = event.date !== event.end_date;

  const dateDisplay = isMultiDay 
    ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
    : format(startDate, 'MMMM d, yyyy');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className={cn(
          "h-1.5 w-full",
          event.importance_level === 'high' ? "bg-red-500" :
          event.importance_level === 'medium' ? "bg-amber-500" : "bg-indigo-500"
        )} />
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight pr-8">
              {event.title}
            </h2>
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              &times;
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-slate-600">
              <CalendarDays className="w-5 h-5 mr-3 text-slate-400" />
              <span className="text-sm font-medium">{dateDisplay}</span>
            </div>

            <div className="flex items-start text-slate-600">
              <MapPin className="w-5 h-5 mr-3 mt-0.5 text-slate-400" />
              <div className="flex flex-wrap gap-1">
                {event.location.map((loc, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center text-slate-600">
              <Monitor className="w-5 h-5 mr-3 text-slate-400" />
              <span className="text-sm capitalize">{event.mode} Mode</span>
            </div>

            <div className="flex items-center text-slate-600">
              <Globe className="w-5 h-5 mr-3 text-slate-400" />
              <span className="text-sm capitalize">{event.scope.replace('-', ' ')}</span>
            </div>

            {event.notes && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl text-sm text-slate-700">
                <p className="font-medium mb-1">Notes</p>
                <p>{event.notes}</p>
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                 <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
                    event.importance_level === 'high' ? "bg-red-50 text-red-700 border border-red-200" :
                    event.importance_level === 'medium' ? "bg-amber-50 text-amber-700 border border-amber-200" : 
                    "bg-blue-50 text-blue-700 border border-blue-200"
                  )}>
                    {event.importance_level} Priority
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 uppercase tracking-wider">
                  {event.category}
                </span>
              </div>
              <a 
                href={event.official_source} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Official Notice
                <ExternalLink className="w-4 h-4 ml-1.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
