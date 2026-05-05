import { useState, useMemo } from 'react';
import { CalendarWidget } from './components/CalendarWidget';
import { EventDialog } from './components/EventDialog';
import { Sidebar } from './components/Sidebar';
import rawExams from '@data/events.json';
import { ExamEvent } from './types';
import { Menu } from 'lucide-react';
import { useExamFilters } from './hooks/useExamFilters';
import { validateEvents } from './lib/validateEvents';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<ExamEvent | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const exams = useMemo(() => validateEvents(rawExams).events, []);

  const {
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterScope, setFilterScope,
    filterMode, setFilterMode,
    categories,
    filteredExams,
  } = useExamFilters(exams);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 relative">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterScope={filterScope}
        onScopeChange={setFilterScope}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        categories={categories}
        filterMode={filterMode}
        onModeChange={setFilterMode}
      />

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

        {/* Calendar */}
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
