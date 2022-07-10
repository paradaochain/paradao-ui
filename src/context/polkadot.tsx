import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { DAOService } from '@services/dao';
import { FactoryService } from '@services/factory';

interface PolkadotContextState {
  api: ApiPromise;
  daoService: DAOService;
  factoryService: FactoryService;
}

export const PolakdotContext = createContext<PolkadotContextState | null>(null);

const PolkadorProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [daoService, setDaoService] = useState<DAOService | null>(null);
  const [factoryService, setFactoryService] = useState<FactoryService | null>(null);

  useEffect(() => {
    loadApi().then((api: ApiPromise) => {
      setApi(api);
      setDaoService(new DAOService(api, '5CroH23f8X9HT9YozAFFe9wUZWP4wZrucbnvyMmwGwB8S1gN'));
      setFactoryService(new FactoryService(api));
    });
  }, []);

  return <PolakdotContext.Provider value={{ api, daoService, factoryService } as PolkadotContextState}>{children}</PolakdotContext.Provider>;
};

export default PolkadorProvider;

export const usePolkadot = () => {
  const context = useContext(PolakdotContext);
  if (!context) throw new Error('You must define a polkadot provider');
  return context;
};

const loadApi = async () => {
  return await ApiPromise.create({
    types: {
      Balance: 'u64',
      AccountId: 'String',
      ProposalType: {
        _enum: {
          Treasury: 'Treasury',
          Membership: 'Membership',
          Proxy: 'Proxy',
          UpdateMetadata: 'String',
          UpdateFee: 'u128'
        }
      },
      Treasury: '(AccountId, Balance)',
      Membership: '(Vec<String>, Vec<(String, Role)>)',
      Proxy: 'Transaction'
    }
  });
};
