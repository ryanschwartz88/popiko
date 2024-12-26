import React, { useState, useMemo, useCallback } from 'react';
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
  CalendarUtils
} from 'react-native-calendars';

import { useEvents } from '@/hooks/useEvents';
import { CalendarEvent } from '@/types/event';
import { SafeAreaView } from 'react-native-safe-area-context';

const INITIAL_TIME = { hour: 9, minutes: 0 };

const TimelineCalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(
    CalendarUtils.getCalendarDateString(new Date())
  );

  // Calculate the current month's start and end dates
  const getMonthRange = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0); 
    return { start, end };
  };

  const { start, end } = useMemo(() => getMonthRange(new Date()), [getMonthRange]);

  // Ensure `useEvents` is stable
  const events: CalendarEvent[] = useEvents(start, end);

  const eventsByDate = () => {
    console.log('Recomputing eventsByDate...');
    const grouped: { [key: string]: TimelineEventProps[] } = {};
    events.forEach(event => {
      const date = CalendarUtils.getCalendarDateString(event.start);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push({
        ...event,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
      });
    });
    return grouped;
  };

  const marked = () => {
    console.log('Recomputing marked dates...');
    const newMarked: { [key: string]: { marked: boolean } } = {};
    Object.keys(eventsByDate).forEach(date => {
      newMarked[date] = { marked: true };
    });
    return newMarked;
  };

  const onDateChanged = (date: string, source: string) => {
    console.log('onDateChanged:', date, source);
    setCurrentDate(date);
  };

  const onMonthChange = (month: any, updateSource: any) => {
    console.log('onMonthChange:', month, updateSource);
  };

  const timelineProps: Partial<TimelineProps> = {
    format24h: false,
    unavailableHours: [{ start: 0, end: 9 }, { start: 20, end: 24 }],
    start: 9,
    end: 20,
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <CalendarProvider
      date={currentDate}
      onDateChanged={onDateChanged}
      onMonthChange={onMonthChange}
      showTodayButton
      disabledOpacity={0.6}
    >
      <ExpandableCalendar firstDay={1} markedDates={marked()} />
      <TimelineList
        events={eventsByDate()}
        timelineProps={timelineProps}
        showNowIndicator
        scrollToFirst
        initialTime={INITIAL_TIME}
      />
    </CalendarProvider>
    </SafeAreaView>
  );
};

export default TimelineCalendarScreen;
