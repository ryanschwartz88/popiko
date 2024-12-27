export interface CalendarEvent {
  id: string;
  user_id?: string;
  title: string;
  start: Date;
  end: Date;
  status: 'available' | 'booked' | 'reserved';
  cost?: number;
  skill_group?: 'waterSafety' | 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly';
  childID?: string;
  instructorID?: string;
  childName?: string;
}
