import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { usePolkadot } from '@context/polkadot';
import Button from '@components/Button/Button';
import { DAOService } from '@services/dao';
import DAO from '@interfaces/dao';
import Spinner from '@components/Spinner/Spinner';
import DaoCard from './DaoCard/DaoCard';
import tw from 'twin.macro';

const AllDaos: React.FC = () => {
  const [, setLocation] = useLocation();
  const [daos, setDaos] = useState<DAO[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const { api, factoryService, zeitgeistService, address } = usePolkadot();

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
    setIsLoading(true);
    loadDaos();
    setIsLoading(false);
  }, []);

  const x = async (t) => {
    const metadata = zeitgeistService.createMetadata(
      'What video is gonna be deleted first?',
      'I do a lot strange videos and most of them are deleted by the platforms',
      ['save your life', 'none', 'blabla'],
      ['VID1', 'VID2', 'NONE']
    );

    // await zeitgeistService.createPM(address as string, address as string, '2 days', metadata);
    const m = await zeitgeistService.getMarketInfo(7);
    const p = await m.getPool();
    console.log(await zeitgeistService.getAssets(m));
    // await zeitgeistService.buyAsset(7, p?.assets[0], 10, address as string);
  };

  return (
    <div tw="ml-4 my-8 space-y-8 flex flex-col justify-center items-start">
      <div tw="flex w-full justify-between items-center space-x-12">
        <h1 tw="ml-2 text-2xl text-blue-800">All DAOs</h1>
        <Button onClick={() => setLocation('/create')}>Create a new DAO</Button>
        <Button onClick={() => x('/create')}>MAGIIC</Button>
      </div>
      <div tw="w-full grid grid-cols-[repeat(auto-fit,minmax(384px,1fr))] gap-14">
        {daos.map((dao, i) => (
          <DaoCard key={`${dao.name}${i}`} {...dao} />
        ))}
        {isloading && (
          <h2>
            Getting Daos...
            <Spinner />
          </h2>
        )}
      </div>
    </div>
  );
};

export default AllDaos;
