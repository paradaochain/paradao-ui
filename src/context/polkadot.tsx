import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { FactoryService } from '@services/factory';
import { deleteSession, getSession, setSession } from '@services/localStorage';
import { AccountType } from '@context/wallet';

interface PolkadotContextState {
  api: ApiPromise;
  factoryService: FactoryService;
  address?: string;
  loadWallet: () => Promise<void>;
  disconnectWallet: () => void;
  hasExtension: boolean;
  accounts: Array<AccountType>;
  setAddress: (addr: string) => Promise<void>;
}

interface Props {
  fallback: React.ReactElement;
}

export const PolakdotContext = createContext<PolkadotContextState | null>(null);

const PolkadorProvider: React.FC<PropsWithChildren<Props>> = ({ children, fallback }) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [factoryService, setFactoryService] = useState<FactoryService | null>(null);
  const [address, setAddr] = useState<string>();
  const [hasExtension, setHasExtension] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<Array<AccountType>>();

  const loadWallet = useCallback(async () => {
    const extensions = await web3Enable('Para DAO');
    if (extensions.length > 0) {
      setHasExtension(true)
    } else {
      return;
    }
    const accounts = await web3Accounts();
    if (accounts.length > 0) {
      setAccounts(accounts.map(a => ({name: a.meta.name as string, address: a.address as string})));
    };
  }, [api, factoryService]);

  const setAddress = useCallback(async (this_addr: string) => {
    const { signer } = await web3FromAddress(this_addr);
    if (!api || !factoryService) return;
    setAddr(this_addr);
    api.setSigner(signer);
    factoryService.setUserAddress(this_addr);
    setSession({ allowConnection: true });
  }, [api, factoryService]);

  const disconnectWallet = useCallback(() => {
    setAddr(undefined);
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
    <PolakdotContext.Provider value={{
      api, factoryService, loadWallet, address, disconnectWallet, hasExtension, accounts, setAddress 
    } as PolkadotContextState}>
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
  const provider = new WsProvider('ws://127.0.0.1:9944');
  return await ApiPromise.create({
    provider,
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
