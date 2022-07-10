import { ProposalStatus } from './ProposalStatus';

export interface Proposal {
  title: string;
  metadata_url: string;
  proposer: string;
  expires: number;
  status: ProposalStatus;
  tx: Record<string, unknown>;
  threshold: number;
}

export interface ProposalWithId extends Proposal {
  id: number;
}
