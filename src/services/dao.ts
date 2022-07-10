import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { getMetadata, uploadMetada } from './ipfs';
import daoAbi from '@abis/daoMeta.json';
import DAO from '@interfaces/dao';
import { Proposal } from '@interfaces/Proposal';

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

  async info(): Promise<Record<string, unknown>> {
    const { output } = await this.query.info('', {});
    if (!output) throw new Error('there was an error fetch dao info');
    const { metadataUrl, ...info } = output.toJSON() as Record<string, string>;
    if (metadataUrl.length < 20) return info;
    return { ...info, metadata: await getMetadata(metadataUrl) };
  }

  async getInfoPopulated(): Promise<DAO> {
    const { metadata, ...info } = await this.info();
    const members = await this.totalMembers();
    const totalProposals = await this.totalProposals();
    const funds = await this.getBalance();
    return { ...info, ...(metadata as object), address: this.address.toString(), members, totalProposals, funds } as DAO;
  }

  async getBalance() {
    const result = await this.api.query.system.account(this.address);
    const parsedResult = result.toJSON() as Record<string, Record<string, string>>;
    return parsedResult.data.free;
  }

  async proposalInfo(proposalId: number): Promise<Proposal | null> {
    const { output } = await this.query.proposalInfo('', {}, proposalId);
    if (!output) return null;
    return output.toJSON() as unknown as Proposal;
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

  async totalProposals(): Promise<number | null> {
    const { output } = await this.query.totalProposals('', {});
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
    let promiseResolve: (value: string) => void, promiseReject: (reason?: string) => void | undefined;
    const joinPromise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
      setTimeout(function () {
        reject('joining Dao timed out');
      }, 180000); //180 secs
    });
    try {
      const unsubscribe = await this.tx.join({ storageDepositLimit, gasLimit }, did).signAndSend(this._address as string, (result) => {
        if (result.status.isInBlock) {
          // result.events.forEach(({ event: { data, method, section }, phase }) => {
          //   console.log("\t", phase.toString(), `: ${section}.${method}`, data.toString());
          // });
          promiseResolve('dao joined');
          // console.log(JSON.stringify(result.contractEvents));
        } else if (result.status.isFinalized) {
          unsubscribe();
        } else if (result.isError) {
          promiseReject(result.status.toString());
        }
      });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      promiseReject!(e as string);
    }
    const confirmation = await joinPromise;
    return confirmation as string;
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
    await this.tx.vote({ storageDepositLimit, gasLimit }, proposalId, +vote).signAndSend(this._address as string);
  }
}
