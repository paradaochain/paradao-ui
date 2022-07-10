import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { ApiPromise } from '@polkadot/api';
import { DAOService } from '@services/dao';
import { FactoryService } from '@services/factory';

interface PolkadotContextState {
  api: ApiPromise;
  daoService: DAOService;
  factoryService: FactoryService;
  address: string | null;
  loadWallet: () => Promise<void>;
}

export const PolakdotContext = createContext<PolkadotContextState | null>(null);

const PolkadorProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [daoService, setDaoService] = useState<DAOService | null>(null);
  const [factoryService, setFactoryService] = useState<FactoryService | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    await web3Enable('Para DAO');
    const [{ address }] = await web3Accounts();
    const { signer } = await web3FromAddress(address);
    if (!api || !daoService || !factoryService) throw new Error('services or api is not loaded');
    setAddress(address);
    api.setSigner(signer);
    daoService.setUserAddress(address);
    factoryService.setUserAddress(address);
  }, [api, daoService, factoryService]);

  useEffect(() => {
    loadApi().then(async (api: ApiPromise) => {
      setApi(api);
      setDaoService(new DAOService(api, '5CroH23f8X9HT9YozAFFe9wUZWP4wZrucbnvyMmwGwB8S1gN'));
      setFactoryService(new FactoryService(api));
    });
  }, []);

  return (
    <PolakdotContext.Provider value={{ api, daoService, factoryService, loadWallet, address } as PolkadotContextState}>
      {children}
    </PolakdotContext.Provider>
  );
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
