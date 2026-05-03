export interface ExamEvent {
  exam_id: string;
  title: string;
  category: string;
  mode: 'online' | 'offline' | 'hybrid';
  scope: 'all-india' | 'state-level' | 'multi-state' | 'regional' | 'state' | 'district' | 'local';
  date: string;
  end_date: string; // required, same as date for single-day events
  importance_level: 'high' | 'medium' | 'low';
  location: string[];
  official_source: string;
  notes?: string;
}
