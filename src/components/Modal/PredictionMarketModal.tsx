import Button from '@components/Button/Button';
import { usePolkadot } from '@context/polkadot';
import { getPmFromDao } from '@services/localStorage';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import Modal from './Modal';

export interface IModalOptions {
  status: boolean;
  daoAddress: string;
  closeModal: () => void;
}

const PredictionMarketModal: React.FC<PropsWithChildren<IModalOptions>> = ({ status, daoAddress, closeModal }) => {
  const [pmInfo, setPmInfo] = useState<any>();
  const [categories, setCategories] = useState<any[]>([]);
  const { zeitgeistService } = usePolkadot();

  useEffect(() => {
    const loadPm = async () => {
      const arr = getPmFromDao(daoAddress) as string[];
      const info = await zeitgeistService.getMarketInfo(+arr[arr.length - 1]);
      const pool = await info.getPool();
      setPmInfo(info);
      setCategories(info.categories as any);
      console.log(info);
    };
    loadPm();
  }, []);

  if (!pmInfo) return null;
  return (
    <Modal status={status} closeModal={closeModal}>
      <div className="w-[500px] h-[300px]">
        <h2 className="font-bold text-2xl text-center">{pmInfo.question}</h2>
        <div className="flex justify-evenly">
          <p>PM MarketId: {pmInfo.marketId}</p>
          <p>Status: {pmInfo.status}</p>
        </div>
        <div className="w-10 h-2/4">
          <p>Description</p>
          <p>{pmInfo.description}</p>
        </div>
        <div className="flex justify-between px-12">
          {categories &&
            categories.map((category) => {
              return (
                <div key={category.name}>
                  <Button key={category.name}>{category.tickets}</Button>
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
};

export default PredictionMarketModal;
