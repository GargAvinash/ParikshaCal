import React from 'react';
import { Search, Globe, Library, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterScope: string;
  onScopeChange: (scope: string) => void;
  filterCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  filterMode: string;
  onModeChange: (mode: string) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  filterScope,
  onScopeChange,
  filterCategory,
  onCategoryChange,
  categories,
  filterMode,
  onModeChange,
}: SidebarProps) {
  return (
    <aside className={cn(
      "bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 w-64 lg:w-72",
      "fixed inset-y-0 left-0",
      "lg:sticky lg:top-2 lg:h-[calc(100vh-16px)]",
      isOpen ? "translate-x-0" : "-translate-x-full"
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
          onClick={onClose}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
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
                  onClick={() => onScopeChange(scope.id)}
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
                  onClick={() => onCategoryChange(item.id)}
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
                onClick={() => onModeChange(mode.id)}
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
  );
}
