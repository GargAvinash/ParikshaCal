import { useState, useMemo } from 'react';
import { ExamEvent } from '../types';

export function useExamFilters(exams: ExamEvent[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterScope, setFilterScope] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');

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

  return {
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    filterScope, setFilterScope,
    filterMode, setFilterMode,
    categories,
    filteredExams,
  };
}
