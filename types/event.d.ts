export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  user_id?: string;
  cost?: number;
  skill_group?: string;
  childID?: string;
  instructorID?: string;
  childName?: string;
  instructorName?: string;
  available_instructor?: Instructor[];
}

export interface Instructor {
  id: string;
  name: string;
}
