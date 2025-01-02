import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from '@/hooks/account/useSession';
import { supabase } from '@/supabase/client';
import { AccountContextType, userData, accountData } from '@/types/account';

// Create the context
const AccountContext = createContext<AccountContextType | undefined>(undefined);

// Create the provider component
export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();
  const [currentAccountUuid, setCurrentAccountUuid] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<any | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      if (session) {
        const { data, error } = await supabase
          .from('parents')
          .select('id, name, plan, skill_group, last_obtained_skill, created_at')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching account:', error);
        } 
        if (data) {
            const { data: childrenData, error: childrenError } = await supabase
                .from('children')
                .select('id, name, skill_group, last_obtained_skill')
                .eq('parent_id', session.user.id);
            if (childrenError) {
                console.error('Error fetching children:', childrenError);
            }
            if (childrenData) {
                const accounts: accountData[] = childrenData.map((child: any) => ({
                    id: child.id,
                    name: child.name,
                    skill_group: child.skill_group,
                    last_obtained_skill: child.last_obtained_skill,
                }));
                accounts.push({
                    id: data.id,
                    name: data.name,
                    skill_group: data.skill_group,
                    last_obtained_skill: data.last_obtained_skill,
                });
                const user: userData = {
                    plan: data.plan,
                    created_at: data.created_at,
                    accounts: accounts,
                };
                setAccountData(user);
                setCurrentAccountUuid(data.id);
            }
        }
      }
    };

    fetchAccount();
  }, [session]);

  return (
    <AccountContext.Provider
      value={{
        currentAccountUuid,
        setCurrentAccountUuid,
        accountData,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

// Create a custom hook to access the context
export const useAccount = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};