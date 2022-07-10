import { ProposalTypes } from '@interfaces/ProposalTypes';
import React from 'react';
import TreasuryForm from './Forms/Treasury';
import UpdateFee from './Forms/UpdateFee';
import UpdateMetadata from './Forms/UpdateMetadata';

const FormProposalType: React.FC<{ type: ProposalTypes }> = ({ type }) => {
  switch (type) {
    case ProposalTypes.Membership:
      return <>Membership</>;
    case ProposalTypes.Treasury:
      return <TreasuryForm />;
    case ProposalTypes.UpdateMetadata:
      return <UpdateMetadata />;
    case ProposalTypes.UpdateFee:
      return <UpdateFee />;
    default:
      return null;
  }
};
export default FormProposalType;
