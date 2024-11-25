export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'available' | 'booked' | 'reserved';
  childID: string;
}
