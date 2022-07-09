import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { IKeyringPair } from '@polkadot/types/types';
import { getMetadata } from './ipfs';
import daoAbi from '@abis/daoMeta.json';

const gasLimit = 300000n * 1000000n;
const storageDepositLimit = null;

export class DAOService extends ContractPromise {
  private _keypair?: IKeyringPair;
  constructor(api: ApiPromise, address: string, keypair?: IKeyringPair) {
    super(api, daoAbi, address);
    this._keypair = keypair;
  }

  setKeypair(keypair: IKeyringPair) {
    this._keypair = keypair;
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
    await this.tx.voteOf({ storageDepositLimit, gasLimit }, proposalId, account).signAndSend(this._keypair as IKeyringPair);
  }

  async execute(proposalId: number) {
    await this.tx.join({ storageDepositLimit, gasLimit }, proposalId).signAndSend(this._keypair as IKeyringPair);
  }

  async join(did: string) {
    await this.tx.join({ storageDepositLimit, gasLimit }, did).signAndSend(this._keypair as IKeyringPair);
  }

  async propose(proposalType: unknown, title: string, metadataUrl: string) {
    await this.tx.propose({ storageDepositLimit, gasLimit }, proposalType, title, metadataUrl).signAndSend(this._keypair as IKeyringPair);
  }

  async createTreasuryProsal(address: string, balance: number, title: string, metadataUrl: string) {
    // await this.propose();
  }

  async vote(proposalId: number, vote: boolean) {
    await this.tx.vote({ storageDepositLimit, gasLimit }, proposalId, vote).signAndSend(this._keypair as IKeyringPair);
  }
}
