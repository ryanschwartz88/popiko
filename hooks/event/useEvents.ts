import { useSession } from "@/hooks/account/useSession";
import { supabase } from "@/hooks/account/client";
import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types/event";
import { weekdaySchedule, weekendSchedule } from "@/constants/schedule";

export const useEvents = (startDate: Date, endDate?: Date) => {
    const { session } = useSession();
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const fetchBookings = async () => {
        if (session) {
            let query = supabase
                .from('bookings')
                .select(`
                    *,
                    children(name, last_obtained_skill),
                    instructor:instructors(name)
                `);
            if (endDate?.getDate() === startDate.getDate()) {
                query = query.eq('date', startDate.toISOString().split('T')[0]);
            } else if (endDate) {
                query = query.gte('date', startDate.toISOString().split('T')[0]);
                query = query.lte('date', endDate.toISOString().split('T')[0]);
            } else {
                query = query.gte('date', startDate.toISOString().split('T')[0]);
            }

            const { data, error } = await query;
    
            if (error) {
                console.error('Error fetching bookings:', error);
                return [];
            }
    
            if (data) {
                const formattedBookings: CalendarEvent[] = data.map((booking: any) => {
                    const startDateTime = new Date(`${booking.date}T${booking.start_time}`);
                    const endDateTime = new Date(`${booking.date}T${booking.end_time}`);

                    return {
                        id: booking.id,
                        user_id: booking.user_id,
                        title: `Lesson for ${booking.children.name}`,
                        start: startDateTime,
                        end: endDateTime,
                        cost: booking.cost,
                        status: booking.status,
                        childID: booking.child_id,
                        skill_group: booking.skill_group,
                        private: booking.private,
                        instructorID: booking.instructor_id,
                        childName: booking.children.name,
                        last_obtained_skill: booking.children.last_obtained_skill,
                        instructorName: booking.instructor.name

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

            const bookings = await fetchBookings();

            /* const summerMonths = [5, 6, 7]; // June - August
            const isSummer = summerMonths.includes(startDate.getMonth());

            const schedules = isSummer
                ? [weekdaySchedule, weekendSchedule]
                : [weekendSchedule];

            const filteredEvents = [...bookings].filter(event => {
                const eventDate = new Date(event.start);
                const eventDay = eventDate.toLocaleDateString('en-US', { weekday: 'short' });
                
                return schedules.some(schedule => schedule.days.includes(eventDay));
            }); */



            setEvents(bookings);
        };

        fetchAllEvents();
    }, [session]);

    return events;
};


