export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'available' | 'booked' | 'reserved';
  skill_group?: 'waterSafety' | 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly';
  private?: boolean;
  childID?: string;
  instructorID?: string;
}
