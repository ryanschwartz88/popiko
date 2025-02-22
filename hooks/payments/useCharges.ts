import { useEffect, useState } from "react";
import { supabase } from "@/hooks/account/client";
import { Charge } from "@/types/charge";
import { Session } from "@supabase/supabase-js";

export const useCharges = (userID: string, session: Session, startDate: Date, endDate?: Date) => {
    const [charges, setCharges] = useState<Charge[]>([]);

    useEffect(() => {
        if (!session) return;

        const fetchCharges = async () => {
            let query = supabase
                .from("charges")
                .select("*")
                .eq("user_id", userID)
                .gte("date", startDate.toISOString().split("T")[0]);

            if (endDate) {
                query = query.lte("date", endDate.toISOString().split("T")[0]);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching charges:", error);
                return;
            }

            if (data) {
                const formattedCharges: Charge[] = data.map((charge: any) => ({
                    id: charge.id,
                    user_id: charge.user_id,
                    title: charge.title,
                    date: new Date(charge.date),
                    amount: charge.amount,
                    discount: charge.discount,
                }));
                setCharges(formattedCharges);
            }
        };

        fetchCharges();
    }, [session, userID, startDate, endDate]);

    return charges;
};
