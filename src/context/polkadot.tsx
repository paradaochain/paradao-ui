import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { ApiPromise } from '@polkadot/api';
import { FactoryService } from '@services/factory';
import { deleteSession, getSession, setSession } from '@services/localStorage';

interface PolkadotContextState {
  api: ApiPromise;
  factoryService: FactoryService;
  address?: string;
  loadWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

interface Props {
  fallback: React.ReactElement;
}

export const PolakdotContext = createContext<PolkadotContextState | null>(null);

const PolkadorProvider: React.FC<PropsWithChildren<Props>> = ({ children, fallback }) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [factoryService, setFactoryService] = useState<FactoryService | null>(null);
  const [address, setAddress] = useState<string>();

  const loadWallet = useCallback(async () => {
    await web3Enable('Para DAO');
    const [{ address }] = await web3Accounts();
    const { signer } = await web3FromAddress(address);
    if (!api || !factoryService) return;
    setAddress(address);
    api.setSigner(signer);
    factoryService.setUserAddress(address);
    setSession({ allowConnection: true });
  }, [api, factoryService]);

  const disconnectWallet = useCallback(() => {
    setAddress(undefined);
    deleteSession();
  }, []);

  useEffect(() => {
    const session = getSession();
    if (session?.allowConnection) loadWallet();
  }, [api, factoryService]);

  useEffect(() => {
    loadApi().then(async (api: ApiPromise) => {
      setApi(api);
      setFactoryService(new FactoryService(api));
    });
  }, []);

  if (!api?.isConnected) return fallback;

  return (
    <PolakdotContext.Provider value={{ api, factoryService, loadWallet, address, disconnectWallet } as PolkadotContextState}>
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
