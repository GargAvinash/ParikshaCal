import React, { useState, useMemo } from 'react';
import { CalendarWidget } from './components/CalendarWidget';
import { EventDialog } from './components/EventDialog';
import rawExams from '@/data/events.json';
import { ExamEvent } from './types';
import { Search, Globe, Library, Menu, X } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<ExamEvent | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterScope, setFilterScope] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');
  
  const exams = rawExams as ExamEvent[];

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(exams.map(e => e.category));
    return Array.from(cats).sort();
  }, [exams]);

  // Apply filters
  const filteredExams = useMemo(() => {
    return exams.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (event.notes && event.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = filterCategory === 'all' || event.category === filterCategory;
      
      let matchesScope = filterScope === 'all';
      if (!matchesScope) {
        if (filterScope === 'all-india') {
          matchesScope = event.scope === 'all-india';
        } else if (filterScope === 'state-level') {
          matchesScope = ['state-level', 'multi-state', 'state', 'regional'].includes(event.scope);
        } else if (filterScope === 'local') {
          matchesScope = ['local', 'district'].includes(event.scope);
        }
      }

      const matchesMode = filterMode === 'all' || event.mode === filterMode;
      
      return matchesSearch && matchesCat && matchesScope && matchesMode;
    });
  }, [exams, searchQuery, filterCategory, filterScope, filterMode]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 relative">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar / Filters */}
      <aside className={cn(
        "bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 w-64 lg:w-72",
        "fixed inset-y-0 left-0",
        "lg:sticky lg:top-2 lg:h-[calc(100vh-16px)]",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-100 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <h1 className="text-xl font-bold tracking-tight text-indigo-950">
              ParikshaCal
            </h1>
          </div>
          <button 
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 pt-2 pb-0">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Public Exam & Event Calendar</p>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Search */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Search</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. JEE Main..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-800 border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Scope */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Scope</h2>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'All Scopes' },
                { id: 'all-india', label: 'All India' },
                { id: 'state-level', label: 'State Level' },
                { id: 'local', label: 'Local Events' }
              ].map(scope => {
                const isActive = filterScope === scope.id;
                return (
                  <button
                    key={scope.id}
                    onClick={() => setFilterScope(scope.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      isActive ? "bg-indigo-600" : "bg-slate-300"
                    )}></span>
                    {scope.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Category</h2>
            <div className="space-y-1">
              {[{ id: 'all', label: 'All Categories' }, ...categories.map(cat => ({ id: cat, label: cat }))].map(item => {
                const isActive = filterCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFilterCategory(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize",
                      isActive 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      isActive ? "bg-indigo-600" : "bg-slate-300"
                    )}></span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Mode</h2>
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'all', label: 'All' },
                { id: 'online', label: 'Online' },
                { id: 'offline', label: 'Offline' },
                { id: 'hybrid', label: 'Hybrid' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setFilterMode(mode.id)}
                  className={cn(
                    "py-1.5 rounded-md text-xs font-medium transition-all shadow-sm",
                    filterMode === mode.id ? "bg-white text-indigo-700" : "text-slate-500 hover:text-slate-700 shadow-none"
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-3 h-3 text-amber-600" />
              <p className="text-xs font-bold text-amber-800">Why ParikshaCal?</p>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed italic mb-2">
              Many exams crash into each other making it hard to manage.
            </p>
            <a href="https://github.com/GargAvinash/ParikshaCal#readme" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-amber-700 underline">Learn More</a>
          </div>
        </nav>
        
        <div className="p-6 border-t border-slate-100 mt-auto flex-shrink-0">
          <a 
            href="https://github.com/GargAvinash/ParikshaCal/blob/main/docs/CONTRIBUTING.md" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            + Submit Event
          </a>
          <a 
            href="https://github.com/GargAvinash/ParikshaCal" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Library className="w-3.5 h-3.5" />
            Contribute on GitHub
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100">
        
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-3 z-10 flex-shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <h1 className="text-lg font-bold tracking-tight text-indigo-950">
              ParikshaCal
            </h1>
          </div>
        </header>

        {/* FullCalendar's toolbar will serve as the header. We just need a wrapper for the calendar component itself to fill the space. */}
        <section className="relative px-3 py-3 sm:px-0 sm:py-0 flex-1">
          <CalendarWidget 
            events={filteredExams} 
            onEventClick={event => setSelectedEvent(event)} 
          />
          {filteredExams.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-8 py-6 text-center shadow-sm border border-slate-200 pointer-events-auto">
                <p className="text-slate-600 text-sm font-semibold">No events match your filters</p>
                <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </section>

        {/* Bottom Stats Bar */}
        <footer className="h-12 bg-white border-t border-slate-200 flex items-center justify-between px-4 sm:px-8 text-[11px] font-medium text-slate-500 flex-shrink-0">
          <div className="flex gap-4 sm:gap-6">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {filteredExams.length === exams.length 
                ? `${exams.length} Events` 
                : `${filteredExams.length} of ${exams.length} Events`
              }
            </span>
          </div>
          <div className="hidden sm:block">
            Source: Official exam portals • <a href="https://github.com/GargAvinash/ParikshaCal" target="_blank" rel="noreferrer" className="text-indigo-600 cursor-pointer underline">View Source Repo</a>
          </div>
        </footer>
      </main>

      {/* Dialog */}
      {selectedEvent && (
        <EventDialog 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}

