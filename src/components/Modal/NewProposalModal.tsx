import Dropdown from '@components/Dropdown/Dropdown';
import { ProposalTypes } from '@interfaces/ProposalTypes';
import FormProposalType from '@views/DaoDetail/FormProposalType/FormProposalType';
import React, { PropsWithChildren, useState } from 'react';
import Modal from './Modal';
import { DAOService } from '@services/dao';

export interface IModalOptions {
  status: boolean;
  closeModal: () => void;
  daoService: DAOService
}

const NewProposalModal: React.FC<PropsWithChildren<IModalOptions>> = ({ status, closeModal, daoService }) => {
  const [type, setType] = useState<ProposalTypes>(ProposalTypes.Membership);
  const proposalTypesOptions = [
    {
      name: ProposalTypes.Membership,
      click: () => setType(ProposalTypes.Membership)
    },
    {
      name: ProposalTypes.Treasury,
      click: () => setType(ProposalTypes.Treasury)
    },
    {
      name: ProposalTypes.UpdateMetadata,
      click: () => setType(ProposalTypes.UpdateMetadata)
    },
    {
      name: ProposalTypes.UpdateFee,
      click: () => setType(ProposalTypes.UpdateFee)
    }
  ];

  return (
    <Modal status={status} closeModal={closeModal}>
      <div>
        <h3 className="font-bold text-xl text-center">Add new proposal</h3>
      </div>
      <div className="flex justify-between min-w-[30rem] my-4">
        <p>Choose a proposal type:</p>
        <Dropdown options={proposalTypesOptions}>{type}</Dropdown>
      </div>
      <div>
		 <FormProposalType type={type as ProposalTypes} daoService={daoService as DAOService}/>
      </div>
    </Modal>
  );
};

export default NewProposalModal;
