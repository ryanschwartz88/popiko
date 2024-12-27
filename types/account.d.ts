export type AccountContextType = {
    currentAccountUuid: string | null;
    setCurrentAccountUuid: (uuid: string) => void;
    accountData: userData;
  };

export type userData = {
    plan?: string;
    accounts: accountData[];
};

export type accountData = {
    id: string;
    name: string;
    skill_group: string;
    last_obtained_skill: string;
};  