import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { supabase } from '@/supabase/client';
import { Session } from '@supabase/supabase-js';
import { SessionContextType } from '@/types/session';


const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setSession(data?.session || null);
      }

      setIsLoading(false);
    };

    initializeSession();

    // Subscribe to session changes
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    // Clean up subscription on unmount
    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const contextValue = useMemo(() => ({ session, isLoading }), [session, isLoading]);
  
  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};