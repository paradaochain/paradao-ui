import { ProposalStatus } from './ProposalStatus';

export interface Proposal {
  title: string;
  metadata_url: string;
  proposer: string;
  expires: Date;
  tx: ProposalStatus;
  threshold: number;
  votes: number;
}
