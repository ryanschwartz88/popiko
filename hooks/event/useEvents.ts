import { useSession } from "@/hooks/account/useSession";
import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types/event";
import { formatTime } from "@/hooks/event/formatTime";

export const useEvents = (startDate: Date, endDate?: Date, instructorAccount: boolean = false) => {
    const { session } = useSession();
    const [events, setEvents] = useState<CalendarEvent[]>([]);


    const fetchBookings = async () => {
        if (session) {
            let query = supabase
                .from('bookings')
                .select(`
                    *,
                    children(name)
                `)
                .gte('date', startDate.toISOString().split('T')[0]);

            if (endDate) {
                query = query.lte('date', endDate.toISOString().split('T')[0]);
            }

            const { data, error } = await query;
    
            if (error) {
                console.error('Error fetching bookings:', error);
                return [];
            }
    
            if (data) {
                const formattedBookings: CalendarEvent[] = data.map((booking: any) => {
                    const isCurrentUser = instructorAccount ? booking.instructor_id === session?.user.id : booking.user_id === session?.user.id;
                    const startDateTime = new Date(`${booking.date}T${booking.start_time}`);
                    const endDateTime = new Date(`${booking.date}T${booking.end_time}`);

                    return {
                        id: booking.id,
                        user_id: booking.user_id,
                        title: `${formatTime(startDateTime)} to ${formatTime(endDateTime)}`,
                        start: startDateTime,
                        end: endDateTime,
                        cost: booking.cost,
                        status: isCurrentUser ? 'booked' : 'unavailable',
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



            setEvents(filteredEvents);
        };

        fetchAllEvents();
    }, [session, startDate]);

    return events;
};


