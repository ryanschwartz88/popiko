import { useSession } from "@/hooks/useSession";
import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types/event";
import { isWithinInterval, addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const useEvents = (startDate: Date, endDate: Date) => {
    const { session } = useSession();
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const fetchReservations = async () => {
        if (session) {
            const { data, error } = await supabase
                .from('recurring_reservations')
                .select('user_id, start, end, day_of_week, child_id, skill_group, private, instructor_id');

            if (error) {
                console.error('Error fetching events:', error);
            }

            if (data) {
                // Generate all occurrences of an event between startDate and endDate
                function generateOccurrences(event: any): CalendarEvent[] {
                    const occurrences: CalendarEvent[] = [];
                    let occurrenceDate = getNextDateForDay(event.day_of_week, startDate);

                    // Add events weekly until we exceed endDate
                    while (occurrenceDate <= endDate) {
                        const startDateTime = new Date(`${occurrenceDate.toISOString().split('T')[0]}T${event.start}`);
                        const endDateTime = new Date(`${occurrenceDate.toISOString().split('T')[0]}T${event.end}`);
                        const isCurrentUser = event.user_id === session?.user.id;

                        occurrences.push({
                                id: event.user_id,
                                title: `${formatTime(startDateTime)} to ${formatTime(endDateTime)}`,
                                start: startDateTime,
                                end: endDateTime,
                                status: isCurrentUser ? 'booked' : 'reserved',
                                childID: event.child_id,
                                skill_group: event.skill_group,
                                private: event.private,
                                instructorID: event.instructor_id
                            });

                        // Increment the date by 7 days for the next occurrence
                        occurrenceDate.setDate(occurrenceDate.getDate() + 7);
                    }

                    return occurrences;
                }
            
                // Map through the data and generate occurrences for each event
                return data.flatMap((event) => generateOccurrences(event));
            }
        }
        return [];
    };

    const fetchBookings = async () => {
        if (session) {
            const { data, error } = await supabase
                .from('bookings')
                .select('user_id, child_id, date, start, end, skill_group, private, instructor_id')
                .gte('date', startDate.toISOString().split('T')[0]) // Filter for dates >= startDate
                .lte('date', endDate.toISOString().split('T')[0]); // Filter for dates <= endDate
    
            if (error) {
                console.error('Error fetching bookings:', error);
                return [];
            }
    
            if (data) {
                const formattedBookings: CalendarEvent[] = data.map((booking: any) => {
                    const isCurrentUser = booking.user_id === session?.user.id;
                    const startDateTime = new Date(`${booking.date}T${booking.start}`);
                    const endDateTime = new Date(`${booking.date}T${booking.end}`);

                    return {
                        id: booking.user_id,
                        title: `${formatTime(startDateTime)} to ${formatTime(endDateTime)}`,
                        start: startDateTime,
                        end: endDateTime,
                        status: isCurrentUser ? 'booked' : 'reserved',
                        childID: booking.child_id,
                        skill_group: booking.skill_group,
                        private: booking.private,
                        instructorID: booking.instructor_id
                    };
                });
    
                return formattedBookings;
            }

        }
        return [];
    };
    

    useEffect(() => {
        const fetchAllEvents = async () => {
            if (!session) return;

            const [reservations, bookings] = await Promise.all([
                fetchReservations(),
                fetchBookings(),
            ]);


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

            const filteredEvents = [...bookings, ...reservations].filter(event => {
                const eventDate = new Date(event.start);
                const eventDay = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
                
                return schedules.some(schedule => schedule.days.includes(eventDay));
            });

            // Iterate through each day in the range
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const currentDayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                for (const schedule of schedules) {
                    if (schedule.days.includes(currentDayName)) {
                        for (const timeSlot of generateTimeSlots(date, schedule.times, schedule.duration)) {
                            if (isTimeSlotAvailable(filteredEvents, timeSlot.start, timeSlot.end)) {
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


            setEvents([...newEvents, ...filteredEvents]);
        };

        fetchAllEvents();
    }, [session, startDate, endDate]);

    return events;
};

// Utility to calculate the next date for a specific day_of_week
function getNextDateForDay(dayOfWeek: string, fromDate: Date): Date {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const fromDateIndex = fromDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const targetIndex = daysOfWeek.indexOf(dayOfWeek);

    // Calculate days to add to reach the target day
    const daysToAdd = (targetIndex - fromDateIndex + 7) % 7;
    const targetDate = new Date(fromDate);
    targetDate.setDate(fromDate.getDate() + daysToAdd);

    return targetDate;
}

const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert 0 or 24 to 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${period}`;
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
