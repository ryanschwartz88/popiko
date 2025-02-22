import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Session } from '@supabase/supabase-js';
import { SessionContextType, AccountContextType, userData, accountData } from '@/types/session';
import { supabase } from '@/hooks/account/client';

// Combined Context Type
interface CombinedContextType extends SessionContextType, AccountContextType {}

// Create the Context
const CombinedContext = createContext<CombinedContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAccountUuid, setCurrentAccountUuid] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<userData | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
	
	const fetchSessionAndData = async (currentSession: Session | null) => {
	  try {
		// Update session state
		setSession(currentSession);
  
		if (currentSession !== null) {
  
		  const userId = currentSession.user.id;
  
		  const { data: roleData, error: roleError } = await supabase
			.from('profiles')
			.select('role, created_at')
			.eq('id', userId)
			.single();
  
		  if (roleError) {
			console.error('Error fetching role:', roleError);
			setRole(null);
		  } else {
			setRole(roleData?.role);
  
			if (roleData?.role === 'parent') {
			  const { data: parentData, error: parentError } = await supabase
				.from('parents')
				.select('id, name, plan, skill_group, last_obtained_skill, created_at')
				.eq('id', userId)
				.single();
  
			  if (!parentError && parentData) {
				const { data: childrenData, error: childrenError } = await supabase
				  .from('children')
				  .select('id, name, skill_group, last_obtained_skill')
				  .eq('parent_id', userId);
  
				if (childrenError) {
				  console.error('Error fetching children data:', childrenError);
				} else {
				  const accounts: accountData[] = [
					{
					  id: parentData.id,
					  name: parentData.name,
					  skill_group: parentData.skill_group,
					  last_obtained_skill: parentData.last_obtained_skill,
					},
					...(childrenData || []).map(child => ({
					  id: child.id,
					  name: child.name,
					  skill_group: child.skill_group,
					  last_obtained_skill: child.last_obtained_skill,
					})),
				  ];
  
				  const user: userData = {
					plan: parentData.plan,
					created_at: parentData.created_at,
					accounts,
				  };
  
				  setAccountData(user);
				  setCurrentAccountUuid(parentData.id);
				}
			  } else {
				console.error('Error fetching parent data:', parentError);
			  }
			} else {
				const { data, error } = await supabase
					.from('instructors')
					.select('name')
					.eq('id', userId)
					.single();

				if (error) {
					console.error('Error fetching instructor name:', error);
				} else {
					const account: accountData = {
						id: userId,
						name: data.name
					}
					const user: userData = {
						created_at: roleData.created_at,
						accounts: [account]
					}
					setAccountData(user);
				}
			}
		  }
		} else {
		  setRole(null);
		  setAccountData(null);
		  setCurrentAccountUuid(null);
		}
	  } catch (error) {
		console.error('Error in fetchSessionAndData:', error);
	  } finally {
		setIsLoading(false);
	  }
	};
  
	// Fetch the session and data initially
	supabase.auth
	  .getSession()
	  .then(({ data: sessionData, error }) => {
		if (error) {
		  console.error('Error fetching initial session:', error);
		} else {
		  fetchSessionAndData(sessionData?.session || null);
		}
	  });
  
	// Listen for auth state changes
	const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
	  fetchSessionAndData(newSession);
	});
  
	// Cleanup subscription
	return () => {
	  subscription?.subscription.unsubscribe();
	};
  }, []);
  

  const contextValue = useMemo(
    () => ({
      session,
      setSession,
      isLoading,
      role,
      setRole,
      setAccountData,
      currentAccountUuid,
      setCurrentAccountUuid,
      accountData,
    }),
    [session, isLoading, currentAccountUuid, accountData, role]
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
