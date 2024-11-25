import { Session } from '@supabase/supabase-js';

export interface SessionContext {
    session: Session | null;
    isLoading: boolean;
}
