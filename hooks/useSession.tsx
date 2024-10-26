import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LargeSecureStore } from '@/supabase/client';
import { Session } from '@supabase/supabase-js';

interface SessionContextProps {
  session: Session | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const largeSecureStore = new LargeSecureStore();
      const storedSession = await largeSecureStore.getItem('supabase.session');
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);
          if (parsedSession && parsedSession.user) {
            const formattedSession: Session = {
              access_token: parsedSession.access_token,
              refresh_token: parsedSession.refresh_token,
              expires_at: parsedSession.expires_at,
              user: {
                id: parsedSession.user.id,
                email: parsedSession.user.email,
                last_sign_in_at: parsedSession.user.last_sign_in_at,
                app_metadata: parsedSession.user.app_metadata,
                user_metadata: parsedSession.user.user_metadata,
                aud: parsedSession.user.aud,
                created_at: parsedSession.user.created_at
              },
              expires_in: parsedSession.expires_in,
              token_type: parsedSession.token_type
            };
            setSession(formattedSession);
          } else {
            console.error("Session data is not structured as expected.");
          }
        } catch (error) {
          console.error("Error parsing session data:", error);
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
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