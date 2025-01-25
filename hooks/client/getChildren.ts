//Fetch the children for a client from Supabase
import { supabase } from '@/hooks/account/client';

export const getChildren = async (id?: string | null | string[]) => {
    const { data, error } = await supabase
        .from('children')
        .select('id, name, skill_group, last_obtained_skill')
        .eq('parent_id', id);

    if (error) {
        console.error('Error fetching children:', error);
        return [];
    }

    return data || [];
};