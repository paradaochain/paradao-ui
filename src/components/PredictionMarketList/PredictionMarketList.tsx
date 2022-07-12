import { PredictionMarket } from '@interfaces/PredictionMarket';
import clsx from 'clsx';
import React from 'react';
import PredictionMarketItem from './PredictionMarketItem/PredictionMarketItem';

interface Props {
  list: PredictionMarket[];
}

const PredictionMarketList: React.FC<Props> = ({ list }) => {
  const PMlist = list.map((e, i) => {
    return <PredictionMarketItem key={i} PM={e} />;
  });
  return <div className={clsx('flex flex-row gap-6 mb-4 pb-4 max-w-full', { 'overflow-x-scroll': list.length >= 4 })}>{PMlist}</div>;
};

export default PredictionMarketList;
