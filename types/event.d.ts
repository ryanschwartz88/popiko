export interface CalendarEvent {
  id: string;
  user_id?: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  cost?: number;
  skill_group?: string;
  childID?: string;
  instructorID?: string;
  childName?: string;
  instructorName?: string;
}
