import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import factoryAbi from '@abis/factoryMeta.json';
import { uploadMetada } from './ipfs';

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

  async createDao(name: string, metadata: unknown, daoType: number, fee: number): Promise<void> {
    const metadataUrl = await uploadMetada(metadata);
    const index = await this.getNextIndex();
    if (!index || !metadataUrl) throw new Error('Something went wrong');
    await this.tx
      .createDao({ storageDepositLimit, gasLimit }, name, metadataUrl, daoType, fee, null, +index)
      .signAndSend(this._address as string);
  }
}
