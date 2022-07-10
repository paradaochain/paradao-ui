import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import factoryAbi from '@abis/factoryMeta.json';
import { uploadMetada } from './ipfs';
import SubmittableResult from '@polkadot/types';

const factoryCodeStoredAccount = import.meta.env.VITE_FACTORY_ADDR;
const gasLimit = 300000n * 1000000n;
const storageDepositLimit = null;

export class FactoryService extends ContractPromise {
  private _address?: string;
  constructor(api: ApiPromise, userAddress?: string) {
    super(api, factoryAbi, factoryCodeStoredAccount);
    this._address = userAddress;
  }

  public setUserAddress(address: string) {
    this._address = address;
  }

  async getDaos(): Promise<string[] | null> {
    const { output } = await this.query.getDaos('', {});
    if (!output) return null;
    return output.toJSON() as string[];
  }

  async getNextIndex(): Promise<string | null> {
    const { output } = await this.query.getNextIndex('', {});
    if (!output) return null;
    return output.toJSON() as string;
  }

  async createDao(name: string, metadata: unknown, daoType: number, fee: number): Promise<string> {
    const metadataUrl = await uploadMetada(metadata);
    const index = await this.getNextIndex();
    if (index === null || !metadataUrl) throw new Error('Something went wrong');
    console.log(this._address);

    let promiseResolve: (value: string) => void, promiseReject: (reason?: string) => void;
    const addrPromise = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
      setTimeout(function () {
        reject('create Dao timed out');
      }, 45000); //45 secs, super long. should take ~10-15 sec? but if need to sign in to wallet...
    });

    const unsubscribe = await this.tx
      .createDao({ storageDepositLimit, gasLimit }, name, metadataUrl, daoType, fee, null, +index)
      .signAndSend(this._address as string, (result) => {
        if (result.status.isInBlock) {
          result.events.forEach(({ event: { data, method, section }, phase }) => {
            // console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
            if (section == 'contracts' && method == 'Instantiated') {
              promiseResolve(data[1].toString());
            }
          });
        } else if (result.status.isFinalized) {
          console.log('dao create finalized ');
          unsubscribe();
        } else if (result.isError) {
          promiseReject(result.status.toString());
        }
      });
    const addr = await addrPromise;
    return addr as string;
  }
}
