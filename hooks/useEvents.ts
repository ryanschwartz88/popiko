import { useSession } from "@/hooks/useSession";
import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types/event";
import { isWithinInterval, addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const useEvents = (startDate: Date, instructorAccount?: boolean) => {
    const { session } = useSession();
    const [events, setEvents] = useState<CalendarEvent[]>([]);


    const fetchBookings = async () => {
        if (session) {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    children(name)
                `)
                .gte('date', startDate.toISOString().split('T')[0]);

    
            if (error) {
                console.error('Error fetching bookings:', error);
                return [];
            }
    
            if (data) {
                const formattedBookings: CalendarEvent[] = data.map((booking: any) => {
                    const isCurrentUser = instructorAccount ? booking.instructor_id === session?.user.id : booking.user_id === session?.user.id || booking.instructor_id === session?.user.id;
                    const startDateTime = new Date(`${booking.date}T${booking.start_time}`);
                    const endDateTime = new Date(`${booking.date}T${booking.end_time}`);

                    return {
                        id: booking.id,
                        user_id: booking.user_id,
                        title: `${formatTime(startDateTime)} to ${formatTime(endDateTime)}`,
                        start: startDateTime,
                        end: endDateTime,
                        cost: booking.cost,
                        status: isCurrentUser ? 'booked' : 'reserved',
                        childID: booking.child_id,
                        skill_group: booking.skill_group,
                        private: booking.private,
                        instructorID: booking.instructor_id,
                        childName: booking.children.name
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

            const [bookings] = await Promise.all([
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

            const filteredEvents = [...bookings].filter(event => {
                const eventDate = new Date(event.start);
                const eventDay = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
                
                return schedules.some(schedule => schedule.days.includes(eventDay));
            });

            // Find the lastest occuring event
            const endDate = filteredEvents.reduce((latest, event) => {
                return event.start > latest ? event.start : latest;
            }, new Date(startDate));


            
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
    }, [session, startDate]);

    return events;
};

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
