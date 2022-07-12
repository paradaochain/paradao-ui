import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { usePolkadot } from '@context/polkadot';
import Button from '@components/Button/Button';
import { DAOService } from '@services/dao';
import DAO from '@interfaces/dao';
import Spinner from '@components/Spinner/Spinner';
import DaoCard from './DaoCard/DaoCard';
import tw from 'twin.macro';
import clsx from 'clsx';

const AllDaos: React.FC = () => {
  const [, setLocation] = useLocation();
  const [daos, setDaos] = useState<DAO[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);
    loadDaos();
    setIsLoading(false);
  }, []);

  return (
    <div tw="ml-4 my-8 space-y-8 flex flex-col justify-center items-start">
      <div tw="flex w-full justify-between items-center space-x-12">
        <h1 tw="ml-2 text-2xl text-blue-800">All DAOs</h1>
        <Button onClick={() => setLocation('/create')}>Create a new DAO</Button>
      </div>
      <div
        className={clsx('w-full gap-14 grid-cols-[repeat(auto-fit,minmax(440px,1fr))]', {
          'grid grid-cols-[repeat(auto-fit,minmax(440px,1fr))]': daos.length >= 4,
          ['flex flex-row justify-start' + daos.length]: daos.length < 4
        })}
      >
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
