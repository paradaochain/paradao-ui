import React, { FC,  useEffect, useState } from 'react';
import tw from 'twin.macro';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Text } from '@polkadot/types';

type TestTypes = {
  chain: Text, 
  nodeName: Text, 
  nodeVersion: Text
}

const Home: React.FC = () => {
  const [ api, setApi ] = useState<TestTypes>();

  useEffect(() => {
    const getApi = async (): Promise<void> => {
      console.log('getting api');
      // const provider = new WsProvider('wss://rpc.polkadot.io');
      // const provider = new WsProvider('ws://127.0.0.1:6644'); // i guess this is the rococo local testnet 
      const provider = new WsProvider('ws://127.0.0.1:9944');
      const tempApi = await ApiPromise.create({ provider });
      const [chain, nodeName, nodeVersion] = await Promise.all([
        tempApi.rpc.system.chain(),
        tempApi.rpc.system.name(),
        tempApi.rpc.system.version()
      ]);
      setApi({chain, nodeName, nodeVersion});
      console.log('has api??', chain as String, nodeName, nodeVersion);
      console.log('gen hash??', tempApi.genesisHash.toHex());
    };
    getApi();
  }, []);

  return (
    <div>
      <h1 tw="mt-12 text-4xl text-gray-700">Welcome to Para Dao!</h1>
      { api && Object.keys(api).length > 0 && 
        <div tw="mt-12 space-y-2">
          <p>{ `${api.chain}` }</p>
          <p>{ `${api.nodeName}` }</p>
          <p>{ `${api.nodeVersion}` }</p>
        </div> }
    </div>
  );
};

export default Home;
