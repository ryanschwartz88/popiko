import { Session } from '@supabase/supabase-js';

export interface SessionContextType {
    session: Session | null;
    isLoading: boolean;
}
