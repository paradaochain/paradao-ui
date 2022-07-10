import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { usePolkadot } from '@context/polkadot';
import Button from '@components/Button/Button';
import tw from 'twin.macro';
import { DAOService } from '@services/dao';
import DAO from '@interfaces/Dao';
import { IntlAddress } from '@utils/Intl';

const AllDaos: React.FC = () => {
  const [, setLocation] = useLocation();
  const [daos, setDaos] = useState<DAO[]>([]);
  const { api, factoryService } = usePolkadot();

  useEffect(() => {
    const loadDaos = async () => {
      const daosAddresses = await factoryService.getDaos();
      if (!daosAddresses) return;
      const daos = await Promise.all(
        daosAddresses.map(async (address) => {
          const service = new DAOService(api, address);
          return await service.getInfoPopulated();
        })
      );
      setDaos(daos);
    };
    loadDaos();
  }, []);

  return (
    <div tw="ml-4 my-8 space-y-8 flex flex-col justify-center items-start">
      <div tw="flex flex-row justify-start items-center space-x-12">
        <h1 tw="ml-2 text-2xl text-blue-800">All DAOs</h1>
        <Button onClick={() => setLocation('/create')}>Create a new DAO</Button>
      </div>
      <div tw="flex flex-wrap justify-center items-center h-full w-full overflow-auto">
        {daos.map((dao, i) => (
          <DaoCard key={`${dao.name}${i}`} {...dao} />
        ))}
      </div>
    </div>
  );
};

export default AllDaos;

const CardContainer = tw.div`block p-6 m-4 height[28rem] width[440px] bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 cursor-pointer`;
const CardHeader = tw.div`flex flex-row justify-start items-start space-x-4 w-full`;
const CardDescrip = tw.div`w-full`;
const CardStats = tw.div`w-full flex flex-row justify-around`;
const CardStat = tw.div`flex flex-col justify-center items-center`;
const CardStatTitle = tw.p`text-xs font-bold text-gray-400 tracking-tight`;
const CardStatData = tw.p`text-lg font-bold text-gray-800 tracking-wider`;
const CardProposals = tw.div`flex flex-col w-full justify-center items-center`;

const DaoCard: React.FC<DAO> = ({ name, address, purpose, logo, funds, members, totalProposals }) => {
  const [, setLocation] = useLocation();
  return (
    <CardContainer onClick={() => setLocation(`/dao/${address}`)}>
      <div tw="flex flex-col justify-between items-center w-full h-full">
        <CardHeader>
          <div tw="w-20 h-20">
            <img tw="w-full h-full rounded-full pointer-events-none" src={logo} alt={`${name}-card-logo`} />
          </div>
          <div tw="flex flex-col space-y-2 font-medium justify-start items-start">
            <div tw="text-2xl font-bold tracking-tight">{name}</div>
            <div tw="text-sm text-gray-500">{IntlAddress(address)}</div>
          </div>
        </CardHeader>
        <CardDescrip>
          <p tw="w-full h-full font-normal text-gray-700 truncate">{purpose}</p>
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
            <span tw="font-bold">Proposals</span>
          </p>
          <CardStatTitle>{`${totalProposals} in total`}</CardStatTitle>
        </CardProposals>
      </div>
    </CardContainer>
  );
};
