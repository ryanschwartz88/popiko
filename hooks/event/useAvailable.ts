import { useSession } from "@/hooks/account/useSession";
import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types/event";
import { isWithinInterval, addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { formatTime } from "@/hooks/event/formatTime";

export const useAvailable = (events: CalendarEvent[], startDate: Date) => {
    const { session } = useSession();
    const [available, setAvailable] = useState<CalendarEvent[]>([]);


    useEffect(() => {
        const fetchAllAvailable = async () => {
            if (!session) return;


            const newEvents: CalendarEvent[] = [];

            const summerMonths = [5, 6, 7]; // June - August
            const isSummer = summerMonths.includes(startDate.getMonth());

            const weekdaySchedule = {
                days: ['Mon', 'Tue', 'Thu'],
                times: ['13:15', '14:00', '14:45', '15:30', '16:15', '17:15'],
                duration: 30, // minutes
            };

            const weekendSchedule = {
                days: ['Sat', 'Sun'],
                times: ['10:15', '11:00', '11:45', '12:30', '13:15', '14:00', '14:45', '15:45', '16:30'],
                duration: 30, // minutes
            };

            const schedules = isSummer
                ? [weekdaySchedule, weekendSchedule]
                : [weekendSchedule];


            // Find the lastest occuring event
            const endDate = events.reduce((latest, event) => {
                return event.start > latest ? event.start : latest;
            }, new Date(startDate));


            
            // Iterate through each day in the range
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const currentDayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                for (const schedule of schedules) {
                    if (schedule.days.includes(currentDayName)) {
                        for (const timeSlot of generateTimeSlots(date, schedule.times, schedule.duration)) {
                            if (isTimeSlotAvailable(events, timeSlot.start, timeSlot.end)) {
                                newEvents.push({
                                    id: uuidv4(),
                                    title: `${formatTime(timeSlot.start)} to ${formatTime(timeSlot.end)}`,
                                    start: timeSlot.start,
                                    end: timeSlot.end,
                                    status: 'available',
                                });
                            }
                        }
                    }
                }
            }


            setAvailable(newEvents);
        };

        fetchAllAvailable();
    }, [session, events, startDate]);

    return available;
};

// Assume helper functions are defined to handle date operations and check for overlaps.
const isTimeSlotAvailable = (existingEvents: CalendarEvent[], start: Date, end: Date) => {
    return !existingEvents.some(event =>
        isWithinInterval(start, { start: event.start, end: event.end }) ||
        isWithinInterval(end, { start: event.start, end: event.end })
    );
};

const generateTimeSlots = (baseDate: Date, times: string[], duration: number) => {
    return times.map(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const start = new Date(baseDate.setHours(hours, minutes));
        const end = addMinutes(start, duration);
        return { start, end };
    });
};
