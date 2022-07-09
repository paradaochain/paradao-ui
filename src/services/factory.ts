import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import factoryAbi from '@abis/factoryMeta.json';

const factoryCodeStoredAccount = '5DopGdTXKkTv1N94QL8moa9GqEvSkPasnAq8UyPjnYMt2fXW';

export class FactoryService extends ContractPromise {
  constructor(api: ApiPromise) {
    super(api, factoryAbi, factoryCodeStoredAccount);
  }

  async getDaos(): Promise<string[] | null> {
    const { output } = await this.query.getDaos('', {});
    if (!output) return null;
    return output.toJSON() as string[];
  }
}
