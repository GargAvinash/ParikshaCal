export interface ExamEvent {
  exam_id: string;
  title: string;
  category: string;
  mode: 'online' | 'offline';
  scope: 'all-india' | 'state-level' | 'local';
  date: string;
  end_date: string; // usually inclusive for full day events
  importance_level: 'high' | 'medium' | 'low';
  location: string[];
  official_source: string;
  notes?: string;
}
