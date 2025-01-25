import React, { useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useEvents } from '@/hooks/event/useEvents';
import { useAvailable } from '@/hooks/event/useAvailable';
import { CalendarEvent } from '@/types/event';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullViewCal from '@/components/admin/FullViewCal';


const FullViewCalendar = () => {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const events = useEvents(new Date()); 
  const today = useMemo(() => new Date(), []);
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const availableSlots = useAvailable(today, nextWeek, events);

  // Combine events and available slots into a unified format for the calendar
  useEffect(() => {
    if (!events || !availableSlots) {
      return;
    }
    const combinedEvents = [...events, ...availableSlots];
    setCalendarEvents(combinedEvents);
  }, [events, availableSlots]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <FullViewCal />
    </SafeAreaView>
  );
}

export default FullViewCalendar;