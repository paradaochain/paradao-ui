import React, { PropsWithChildren } from 'react';
import Modal from './Modal';
import { PredictionMarket } from '@interfaces/PredictionMarket';
import PMAssetItem from '@components/PredictionMarketList/PMAssetItem/PMAssetItem';

export interface IModalOptions {
  status: boolean;
  closeModal: () => void;
  PM: PredictionMarket;
}

const PMVotesModal: React.FC<PropsWithChildren<IModalOptions>> = ({ status, closeModal, PM }) => {
  const categoriesItem = PM.options.assets.map((asset, i) => (
    <PMAssetItem
      key={asset.toString() + i}
      asset={asset}
      price={PM.options.assetsPrice[i]}
      {...PM.options.assetsInfo[i]}
      closeModal={closeModal}
    />
  ));
  return (
    <Modal status={status} closeModal={closeModal}>
      <div className="flex flex-col items-center justify-center gap-4 max-w-[1000px]">
        <h2 className="font-bold text-lg text-center">Vote Prediction Market</h2>
        <h3 className="text-3xl">{PM.question}</h3>
        <p className="text-gray-700">{PM.description}</p>
        <div className="flex gap-5 flex-wrap justify-center items-center">{categoriesItem}</div>
      </div>
    </Modal>
  );
};

export default PMVotesModal;
