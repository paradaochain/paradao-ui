import React, { FC, useContext } from 'react';
import { useLocation } from 'wouter';
import tw from 'twin.macro';
import { ApiPromise } from '@polkadot/api';
import { ContractPromise, } from '@polkadot/api-contract';
// import { web3FromAddress } from '@polkadot/extension-dapp';
import { Keyring } from '@polkadot/api';
// import { AccountContext, AccoutContextType } from '@context/wallet';
import factoryAbi from '@abis/factoryMeta.json';
import Button from '@components/Button';
// import { CircleComplete, CircleOutline, Next } from '@icons/mui';
import { daoList } from '@views/fakeData';

export const getDaos = async () => {
  const api = await ApiPromise.create();
  // const injector = await web3FromAddress(injAddr);
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
  const factoryCodeStoredAccount = '5Fxj4rishzAD767k7NgMKDzRz6BipekLmbq2Ufu4W3mp61kN';
  const contract = new ContractPromise(api, factoryAbi, factoryCodeStoredAccount);

  const gasLimit = 3000n * 1000000n;
  const storageDepositLimit = null;

  // (We perform the send from an account, here using Alice's address)
  // const { gasRequired, storageDeposit, result, output } = await contract.query.getNextIndex(
  const { gasRequired, storageDeposit, result, output } = await contract.query.getDaos(
    alice.address,
    {
      gasLimit,
      storageDepositLimit,
    }
  );

  // The actual result from RPC as `ContractExecResult`
  console.log('RPC result', result.toHuman());

  // the gas consumed for contract execution
  console.log('gas', gasRequired.toHuman());

  // check if the call was successful
  if (result.isOk && output) {
    // output the return value
    console.log('Success', output.toHuman());
  } else {
    console.error('Error', result.asErr);
  }
};

const AllDaos: React.FC = () => {
  const [location, setLocation] = useLocation();
  // const { account } = useContext(AccountContext) as AccoutContextType;

  const testData = [...daoList, ...daoList, ...daoList, ...daoList, ...daoList, ...daoList, ...daoList, ...daoList];

  return (
    <div tw="ml-4 my-8 space-y-8 flex flex-col justify-center items-start">
      <div tw="flex flex-row justify-start items-center space-x-12">
        <h1 tw="ml-2 text-2xl text-blue-800">All DAOs</h1>
        <Button onClick={ () => setLocation('/create') }>Create a new DAO</Button>
      </div>
      <Button onClick={ () => getDaos() }>Test Get DAOs</Button>
      <div tw="flex flex-wrap justify-center items-center h-full w-full overflow-auto">
        {testData.map((dao, i) => (
          <DaoCard key={`${dao.token}${i}`} {...dao} />
        ))}
      </div>
    </div>
  );
};

export default AllDaos;

type DaoProps = {
  name: string;
  token: string;
  daoAddress: string;
  descrip?: string;
  logo: string;
  funds: string;
  members: number;
  activeProposals: number;
  totalProposals: number;
  links?: Record<string, unknown>;
};

const CardContainer = tw.div`block p-6 m-4 height[28rem] width[440px] bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100`;
const CardHeader = tw.div`flex flex-row justify-start items-start space-x-4 w-full`;
const CardDescrip = tw.div`w-full`;
const CardStats = tw.div`w-full flex flex-row justify-around`;
const CardStat = tw.div`flex flex-col justify-center items-center`;
const CardStatTitle = tw.p`text-xs font-bold text-gray-400 tracking-tight`;
const CardStatData = tw.p`text-lg font-bold text-gray-800 tracking-wider`;
const CardProposals = tw.div`flex flex-col w-full justify-center items-center`;

const DaoCard: FC<DaoProps> = ({ name, daoAddress, descrip, logo, funds, members, activeProposals, totalProposals }) => {
  return (
    <CardContainer>
      <div tw="flex flex-col justify-between items-center w-full h-full">
        <CardHeader>
          <div tw="w-20 h-20">
            <img tw="w-full h-full rounded-full pointer-events-none" src={logo} alt={`${name}-card-logo`} />
          </div>
          <div tw="flex flex-col space-y-2 font-medium justify-start items-start">
            <div tw="text-2xl font-bold tracking-tight">{name}</div>
            <div tw="text-sm text-gray-500">{daoAddress}</div>
          </div>
        </CardHeader>
        <CardDescrip>
          <p tw="w-full h-full font-normal text-gray-700 truncate">{descrip}</p>
        </CardDescrip>
        <CardStats>
          <CardStat>
            <CardStatTitle>DAO funds</CardStatTitle>
            <CardStatData>{funds}</CardStatData>
          </CardStat>
          <CardStat>
            <CardStatTitle>Members</CardStatTitle>
            <CardStatData>{members}</CardStatData>
          </CardStat>
        </CardStats>
        <CardProposals>
          <p tw="tracking-widest text-xl">
            <span tw="font-bold">{activeProposals}</span>
            {` active proposal${activeProposals === 0 || activeProposals > 1 ? 's' : ''}`}
          </p>
          <CardStatTitle>{`${totalProposals} proposal${totalProposals === 0 || (totalProposals > 1 && 's')} in total`}</CardStatTitle>
        </CardProposals>
      </div>
    </CardContainer>
  );
};
