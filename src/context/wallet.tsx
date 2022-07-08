import React, { createContext, FC, PropsWithChildren, useState } from 'react';

export type AccountType = {
    name: string;
    address: string;
};

export type AccoutContextType = {
    account: AccountType;
    useSetAccount: (act: AccountType) => void;
};

export const AccountContext = createContext<AccoutContextType | null>(null);

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
    const [account, setAccount] = useState<AccountType>({} as AccountType);

    return (
        <AccountContext.Provider value={{ account, useSetAccount: setAccount }}>
            { children }
        </AccountContext.Provider>
    );
};
