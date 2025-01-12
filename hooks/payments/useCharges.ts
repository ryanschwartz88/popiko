import { useSession } from "@/hooks/account/useSession";
import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import { Charge } from "@/types/charge";

export const useCharges = (userID: string, startDate: Date, endDate?: Date) => {
    const { session } = useSession();
    const [charges, setCharges] = useState<Charge[]>([]);


    const fetchCharges = async () => {
        if (session) {
            let query = supabase
                .from('charges')
                .select(`
                    *
                `)
                .eq('user_id', userID)
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
                const formattedCharges: Charge[] = data.map((charge: any) => {
                    return {
                        id: charge.id,
                        user_id: charge.user_id,
                        title: charge.title,
                        date: new Date(charge.date),
                        amount: charge.amount,
                        discount: charge.discount
                    };
                });
    
                return formattedCharges;
            }

        }
        return [];
    };
    

    useEffect(() => {
        const fetchAllCharges = async () => {
            if (!session) return;

            const charges = await fetchCharges();

            setCharges(charges);
        };

        fetchAllCharges();
    }, [session]);

    return charges;
};


