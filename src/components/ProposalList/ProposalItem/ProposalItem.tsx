import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';
import { Proposal } from '@interfaces/Proposal';
import React, { useState } from 'react';

const ProposalItem: React.FC<Proposal> = ({ title, metadata_url, proposer, expires, tx, threshold, votes }) => {
  const [modal, setModal] = useState<boolean>(false);
  return (
    <>
      <div className="w-full bg-white rounded-lg p-3 ">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <Button onClick={() => setModal(true)}>See Votes</Button>
        </div>
        <div className="grid grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p>{tx}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p>{tx}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Proposer</p>
            <p>{proposer}</p>
          </div>
        </div>
      </div>
      <Modal status={modal} closeModal={() => setModal(false)}>
        <div className="space-y-5">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Proposal Detail</h2>
            <p className="text-md font-semibold text-gray-500">{title}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Required</p>
            <p>{threshold * 100}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Current votes</p>
            <p>{votes * 100}%</p>
          </div>
          <Button onClick={() => setModal(true)}>Vote</Button>
        </div>
      </Modal>
    </>
  );
};

export default ProposalItem;
