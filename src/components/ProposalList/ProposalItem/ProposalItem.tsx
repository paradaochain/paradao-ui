import Button from '@components/Button/Button';
import LightButton from '@components/Button/LightButton';
import Modal from '@components/Modal/Modal';
import { ProposalWithId } from '@interfaces/Proposal';
import { ProposalStatus } from '@interfaces/ProposalStatus';
import { DAOService } from '@services/dao';
import { IntlAddress } from '@utils/Intl';
import React, { useCallback, useState } from 'react';

interface Props {
  daoService: DAOService;
}

const ProposalItem: React.FC<ProposalWithId & Props> = ({ id, title, proposer, tx, status, expires, threshold, daoService }) => {
  const [modal, setModal] = useState<boolean>(false);
  const vote = useCallback(async (vote: boolean) => daoService.vote(id, vote), []);

  return (
    <>
      <div className="w-full bg-white rounded-lg p-3 ">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <Button onClick={() => setModal(true)}>Details</Button>
        </div>
        <div className="grid grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p>{status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p>{Object.keys(tx)[0]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Expire at block</p>
            <p>{expires.toString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Proposer</p>
            <p>{IntlAddress(proposer, 25)}</p>
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
          <p className="text-xs text-gray-500">Votes Option</p>
          <div className="flex justify-between">
            <LightButton className="min-w-[50px]" onClick={() => vote(true)}>
              Yes
            </LightButton>
            <LightButton className="min-w-[50px" onClick={() => vote(false)}>
              No
            </LightButton>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProposalItem;
