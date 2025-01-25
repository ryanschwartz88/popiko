// Hook to get clients from Supabase

import { supabase } from '@/hooks/account/client';

export const getClients = async (id?: string | null | string[]) => {
    const { data, error } = await supabase
        .from('parents')
        .select('id, name, plan, created_at, profiles(email)');

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }

    return data || [];
};