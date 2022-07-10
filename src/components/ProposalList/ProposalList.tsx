import { Proposal } from '@interfaces/Proposal';
import React from 'react';
import ProposalItem from './ProposalItem/ProposalItem';

interface ProposalListProps {
  proposalList: Proposal[];
}

const ProposalList: React.FC<ProposalListProps> = ({ proposalList }) => {
  const Proposals = proposalList.map((e, i) => <ProposalItem key={i} {...e} />);
  return <div className="flex flex-col w-full gap-3">{Proposals}</div>;
};

export default ProposalList;
