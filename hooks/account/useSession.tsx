import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { supabase } from '@/supabase/client';
import { Session } from '@supabase/supabase-js';
import { SessionContextType, AccountContextType, userData, accountData } from '@/types/session';

// Combined Context Type
interface CombinedContextType extends SessionContextType, AccountContextType {}

// Create the Context
const CombinedContext = createContext<CombinedContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAccountUuid, setCurrentAccountUuid] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<userData | null>(null);

  // Handle Session Initialization and Subscriptions
  useEffect(() => {
    const initializeSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setSession(data?.session || null);
      }
      setIsLoading(false);
    };

    initializeSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  // Fetch Account Data
  useEffect(() => {
    const fetchAccountData = async () => {
      if (!session) return;

      try {
        const { data: parentData, error: parentError } = await supabase
          .from('parents')
          .select('id, name, plan, skill_group, last_obtained_skill, created_at')
          .eq('id', session.user.id)
          .single();

        if (parentError) {
          console.error('Error fetching parent data:', parentError);
          return;
        }

        const { data: childrenData, error: childrenError } = await supabase
          .from('children')
          .select('id, name, skill_group, last_obtained_skill')
          .eq('parent_id', session.user.id);

        if (childrenError) {
          console.error('Error fetching children data:', childrenError);
          return;
        }

        const accounts: accountData[] = childrenData?.map(child => ({
          id: child.id,
          name: child.name,
          skill_group: child.skill_group,
          last_obtained_skill: child.last_obtained_skill,
        })) || [];

        accounts.push({
          id: parentData.id,
          name: parentData.name,
          skill_group: parentData.skill_group,
          last_obtained_skill: parentData.last_obtained_skill,
        });

        const user: userData = {
          plan: parentData.plan,
          created_at: parentData.created_at,
          accounts,
        };

        setAccountData(user);
        setCurrentAccountUuid(parentData.id);
      } catch (error) {
        console.error('Error fetching account data:', error);
      }
    };

    fetchAccountData();
  }, [session]);

  // Combined Context Value
  const contextValue = useMemo(
    () => ({
      session,
      isLoading,
      currentAccountUuid,
      setCurrentAccountUuid,
      accountData,
    }),
    [session, isLoading, currentAccountUuid, accountData]
  );

  return <CombinedContext.Provider value={contextValue}>{children}</CombinedContext.Provider>;
};

// Custom Hook to Access Combined Context
export const useSession = () => {
  const context = useContext(CombinedContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
