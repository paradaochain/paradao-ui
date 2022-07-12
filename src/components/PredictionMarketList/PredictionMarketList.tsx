import { PredictionMarket } from '@interfaces/PredictionMarket';
import React from 'react';
import PredictionMarketItem from './PredictionMarketItem/PredictionMarketItem';

interface Props {
  list: PredictionMarket[];
}

const PredictionMarketList: React.FC<Props> = ({ list }) => {
  const PMlist = list.map((e, i) => {
    return <PredictionMarketItem key={i} PM={e} />;
  });
  return <div className="flex flex-row overflow-x-scroll gap-6">{PMlist}</div>;
};

export default PredictionMarketList;
