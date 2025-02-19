import { Session } from '@supabase/supabase-js';

export interface SessionContextType {
    session: Session | null;
    setSession: (session: Session | null) => void;
    isLoading: boolean;
}

export type AccountContextType = {
    role: string | null;
    setRole: (role: string) => void;
    setAccountData: (data: userData) => void;
    currentAccountUuid: string | null;
    setCurrentAccountUuid: (uuid: string) => void;
    accountData: userData | null;
  };

export type userData = {
    plan?: string;
    created_at: Date;
    accounts: accountData[];
};

export type accountData = {
    id: string;
    name: string;
    skill_group?: string;
    last_obtained_skill?: string;
};  