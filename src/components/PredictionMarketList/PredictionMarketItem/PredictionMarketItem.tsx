import Button from '@components/Button/Button';
import PMVotesModal from '@components/Modal/PMVotesModal';
import { PredictionMarket } from '@interfaces/PredictionMarket';
import React, { useState } from 'react';

interface Props {
  PM: PredictionMarket;
}

const PredictionMarketItem: React.FC<Props> = ({ PM }) => {
  const [openVoteModal, setOpenCloseModal] = useState<boolean>(false);
  return (
    <div className="bg-white rounded-lg p-5 text-center flex items-center justify-center gap-4 flex-col min-w-[300px]">
      <h3 className="font-bold text-xl">{PM.question}</h3>
      <p className="text-gray-700 max-w-[18rem] truncate-3-lines">{PM.description}</p>
      <div className="flex gap-4 items-center justify-center">
        <p>
          <span className="font-bold">Ends in:</span> {PM.ends}
        </p>
        <Button onClick={() => setOpenCloseModal(true)}>Vote</Button>
      </div>
      <PMVotesModal status={openVoteModal} closeModal={() => setOpenCloseModal(false)} PM={PM} />
    </div>
  );
};

export default PredictionMarketItem;
