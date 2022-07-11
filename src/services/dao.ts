import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { getMetadata, uploadMetada } from './ipfs';
import { getItem, setItem } from './localStorage';
import daoAbi from '@abis/daoMeta.json';
import DAO from '@interfaces/dao';
import { Proposal } from '@interfaces/Proposal';

const gasLimit = 300000n * 1000000n;
const storageDepositLimit = null;
const fundsFormatter = 10000000000.0;

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
    const formattedFunds = `${Number(funds) / fundsFormatter}`;
    let pms = getItem(this.address.toString());
    if (pms === null) {
      pms = { totalPms: 0, proposalPms: {} };
    }
    return {
      ...info,
      ...(metadata as object),
      address: this.address.toString(),
      members,
      totalProposals,
      funds: formattedFunds,
      ...(pms as Object)
    } as DAO;
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
    const { fee, ...info } = await this.info();
    return await new Promise(async (resolve, reject) => {
      setTimeout(reject, 120000);
      const unsubscribe = await this.tx
        .join({ storageDepositLimit, gasLimit, value: (fee as number) * fundsFormatter }, did)
        .signAndSend(this._address as string, (result) => {
          if (result.status.isInBlock) {
            result.events.forEach(({ event: { data, method, section }, phase }) => {
              // console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
              if (method.toLowerCase().includes('fail')) {
                reject(`${method}`);
                console.log(' ~ FAILED TO JOIN DAO ~', `${phase.toString()} : ${method} --> ${data.toString()}`);
              } else if (method.toLowerCase().includes('success')) {
                resolve('dao joined');
              }
            });
          } else if (result.status.isFinalized) {
            unsubscribe();
          } else if (result.isError) {
            reject(result.status.toString());
          }
        });
    });
  }

  async propose(proposalType: unknown, title: string, proposalMetadata: unknown) {
    const metadataUrl = await uploadMetada(proposalMetadata);
    return await new Promise(async (resolve, reject) => {
      setTimeout(reject, 120000);
      const unsubscribe = await this.tx
        .propose({ storageDepositLimit, gasLimit }, proposalType, title, metadataUrl)
        .signAndSend(this._address as string, (result) => {
          if (result.status.isInBlock) {
            result.events.forEach(({ event: { data, method, section }, phase }) => {
              // console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
              if (method.toLowerCase().includes('fail')) {
                reject(`Failed to propose ${title}`);
                console.log(` ~ FAILED TO VOTE ON ${title} ~`, `${phase.toString()} : ${method} --> ${data.toString()}`);
              } else if (method.toLowerCase().includes('success')) {
                resolve(`proposed ${title}}`);
              }
            });
          } else if (result.status.isFinalized) {
            unsubscribe();
          } else if (result.isError) {
            reject(result.status.toString());
          }
        });
    });
  }

  async createTreasuryProposal(daoInfoMetadata: unknown, title: string, proposalMetadata: unknown) {
    const metadataUrl = await uploadMetada(daoInfoMetadata);
    const proposalType = this.api.createType('ProposalType', {
      UpdateMetadata: metadataUrl
    });
    await this.propose(proposalType, title, proposalMetadata);
  }

  async createFeeProposal(fee: number, title: string, proposalMetadata: unknown) {
    const proposalType = this.api.createType('ProposalType', {
      UpdateFee: fee
    });
    await this.propose(proposalType, title, proposalMetadata);
  }

  async createMembersPrpposal([members, roles]: [string[], [string, unknown]], title: string, proposalMetadata: unknown) {
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
    return await new Promise(async (resolve, reject) => {
      setTimeout(reject, 120000);
      const unsubscribe = await this.tx
        .vote({ storageDepositLimit, gasLimit }, proposalId, +vote)
        .signAndSend(this._address as string, (result) => {
          if (result.status.isInBlock) {
            result.events.forEach(({ event: { data, method, section }, phase }) => {
              // console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
              if (method.toLowerCase().includes('fail')) {
                reject(`Failed to vote on ${proposalId}`);
                console.log(` ~ FAILED TO VOTE ON ${proposalId} ~`, `${phase.toString()} : ${method} --> ${data.toString()}`);
              } else if (method.toLowerCase().includes('success')) {
                resolve(`voted on ${proposalId} - ${vote}`);
              }
            });
          } else if (result.status.isFinalized) {
            unsubscribe();
          } else if (result.isError) {
            reject(result.status.toString());
          }
        });
    });
  }
}
