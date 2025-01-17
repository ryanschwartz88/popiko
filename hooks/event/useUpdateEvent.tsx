import { supabase } from "@/hooks/account/client";
import { useState } from "react";
import { CalendarEvent } from "@/types/event";

export const useUpdateEvent = () => {
    const [isLoading, setIsLoading] = useState(false);

    const updateEvent = async (
        event: CalendarEvent,
        skill_group?: string,
        last_skill?: string
    ) => {
        setIsLoading(true);
        try {
            const { data: updatedEvent, error: updateError } = await supabase
                .from("bookings")
                .update({
                    skill_group: event.skill_group,
                    status: event.status,
                })
                .eq("id", event.id)
                .single();

            if (updateError) {
                console.error("Error updating event:", updateError.message);
            }

            if (last_skill) {
                const { data: childData, error: childError } = await supabase
                    .from("children")
                    .update({
                        skill_group: skill_group,
                        last_obtained_skill: last_skill,
                    })
                    .eq("id", event.childID)
                    .single();

                if (childError) {
                    console.error("Error updating child:", childError.message);
                }
            }
        } catch (error) {
            console.error("Error updating event:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { updateEvent, isLoading };
};
