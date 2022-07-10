import React from 'react';
import { DAOService } from '@services/dao';
import { ProposalWithId } from '@interfaces/Proposal';
import ProposalItem from './ProposalItem/ProposalItem';

interface ProposalListProps {
  proposalList: ProposalWithId[];
  daoService: DAOService;
}

const ProposalList: React.FC<ProposalListProps> = ({ proposalList, daoService }) => {
  const Proposals = proposalList.map((e, i) => <ProposalItem daoService={daoService} key={i} {...e} />);
  return <div className="flex flex-col w-full gap-3">{Proposals}</div>;
};

export default ProposalList;
