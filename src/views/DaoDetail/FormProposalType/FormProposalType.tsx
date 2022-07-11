import { ProposalTypes } from '@interfaces/ProposalTypes';
import React from 'react';
import TreasuryForm from './Forms/Treasury';
import UpdateFee from './Forms/UpdateFee';
import UpdateMetadata from './Forms/UpdateMetadata';
import { DAOService } from '@services/dao';

const FormProposalType: React.FC<{ type: ProposalTypes; daoService: DAOService; close: () => void }> = ({ type, daoService, close }) => {
  switch (type) {
    case ProposalTypes.Membership:
      return <>Membership</>;
    case ProposalTypes.Treasury:
      return <TreasuryForm daoService={daoService as DAOService} close={close} />;
    case ProposalTypes.UpdateMetadata:
      return <UpdateMetadata daoService={daoService as DAOService} close={close} />;
    case ProposalTypes.UpdateFee:
      return <UpdateFee close={close} />;
    default:
      return null;
  }
};
export default FormProposalType;
