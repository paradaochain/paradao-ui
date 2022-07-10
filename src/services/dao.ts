import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { getMetadata, uploadMetada } from './ipfs';
import daoAbi from '@abis/daoMeta.json';

const gasLimit = 300000n * 1000000n;
const storageDepositLimit = null;

export class DAOService extends ContractPromise {
  private _address?: string;
  constructor(api: ApiPromise, contractAddress: string, userAddress?: string) {
    super(api, daoAbi, contractAddress);
    this._address = userAddress;
  }

  setUserAddress(address: string) {
    this._address = address;
  }

  async info() {
    const { output } = await this.query.info('', {});
    if (!output) return null;
    const { metadataUrl, ...info } = output.toJSON() as { metadataUrl: string };
    return { ...info, metadata: await getMetadata(metadataUrl) };
  }

  async proposalInfo(proposalId: number) {
    const { output } = await this.query.proposalInfo('', {}, proposalId);
    if (!output) return null;
    return output.toJSON();
  }

  async roleOf(address: string) {
    const { output } = await this.query.roleOf('', {}, address);
    if (!output) return null;
    return output.toJSON();
  }

  async totalMembers(): Promise<number | null> {
    const { output } = await this.query.totalMembers('', {});
    if (!output) return null;
    return output.toJSON() as number;
  }

  async totalProposal(): Promise<number | null> {
    const { output } = await this.query.totalProposal('', {});
    if (!output) return null;
    return output.toJSON() as number;
  }

  async voteOf(proposalId: number, account: string) {
    await this.tx.voteOf({ storageDepositLimit, gasLimit }, proposalId, account).signAndSend(this._address as string);
  }

  async execute(proposalId: number) {
    await this.tx.execute({ storageDepositLimit, gasLimit }, proposalId).signAndSend(this._address as string);
  }

  async join(did: string) {
    await this.tx.join({ storageDepositLimit, gasLimit }, did).signAndSend(this._address as string);
  }

  async propose(proposalType: unknown, title: string, proposalMetadata: unknown) {
    const metadataUrl = await uploadMetada(proposalMetadata);
    await this.tx.propose({ storageDepositLimit, gasLimit }, proposalType, title, metadataUrl).signAndSend(this._address as string);
  }

  async createTreasuryProposal(daoInfoMetadata: unknown, title: string, proposalMetadata: unknown) {
    const metadataUrl = await uploadMetada(daoInfoMetadata);
    const proposalType = this.api.createType('ProposalType', {
      UpdateMetadata: metadataUrl
    });
    await this.propose(proposalType, title, proposalMetadata);
  }

  async createFeePorposal(fee: number, title: string, proposalMetadata: unknown) {
    const proposalType = this.api.createType('ProposalType', {
      UpdateFee: fee
    });
    await this.propose(proposalType, title, proposalMetadata);
  }

  async createMembersPorposal([members, roles]: [string[], [string, unknown]], title: string, proposalMetadata: unknown) {
    const proposalType = this.api.createType('ProposalType', {
      Membership: [members, roles]
    });
    await this.propose(proposalType, title, proposalMetadata);
  }

  async createMetadataProposal(address: string, balance: number, title: string, proposalMetadata: unknown) {
    const proposalType = this.api.createType('ProposalType', {
      Treasury: [this.api.createType('AccountId', address), this.api.createType('Balance', balance)]
    });
    await this.propose(proposalType, title, proposalMetadata);
  }

  async vote(proposalId: number, vote: boolean) {
    await this.tx.vote({ storageDepositLimit, gasLimit }, proposalId, vote).signAndSend(this._address as string);
  }
}
