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
	const [finishedFetchingSession, setFinishedFetchingSession] = useState(false);
	const [currentAccountUuid, setCurrentAccountUuid] = useState<string | null>(null);
	const [accountData, setAccountData] = useState<userData | null>(null);
	const [role, setRole] = useState<string | null>(null);

	// Handle Session Initialization and Subscriptions
	useEffect(() => {
		const initializeSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) {
				console.error('Error fetching session:', error);
			} else {
				setSession(data?.session || null);
			}
			setFinishedFetchingSession(true);
		};

		initializeSession();

		const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => {
			subscription?.subscription.unsubscribe();
		};
	}, []);

	// Fetch Account Data for Client portal
	const fetchAccountData = async () => {
		if (!session) {
			if (finishedFetchingSession) {
				setIsLoading(false);
			}
			return;
		}
		const { data: roleData, error: roleError } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', session.user.id)
			.single();

		if (roleError) {
			console.error('Error fetching role:', roleError);
			return;
		} else {
			setRole(roleData?.role);
		}
		if (roleData?.role == 'parent') {
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

				const accounts: accountData[] = [
					{
						id: parentData.id,
						name: parentData.name,
						skill_group: parentData.skill_group,
						last_obtained_skill: parentData.last_obtained_skill,
					},
					...childrenData?.map(child => ({
						id: child.id,
						name: child.name,
						skill_group: child.skill_group,
						last_obtained_skill: child.last_obtained_skill,
					})) || [],
				]

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
		}
		setIsLoading(false);
	};

	// Fetch Account Data
	useEffect(() => {
		fetchAccountData();
	}, [session, finishedFetchingSession]);

	// Combined Context Value
	const contextValue = useMemo(
		() => ({
			session,
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
