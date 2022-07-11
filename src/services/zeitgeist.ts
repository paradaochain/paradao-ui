import { CategoryMetadata, DecodedMarketMetadata } from '@zeitgeistpm/sdk/dist/types';
import SDK from '@zeitgeistpm/sdk';
import { CreateCpmmMarketAndDeployAssetsParams } from '@zeitgeistpm/sdk/dist/types/market';
import ms from 'ms';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { Market } from '@zeitgeistpm/sdk/dist/models';
import { Decimal } from 'decimal.js';

class ZeitgeistService {
  public sdk!: SDK;
  constructor(endpoint: string) {
    SDK.initialize(endpoint).then((sdk) => (this.sdk = sdk));
  }
  // fetchPoolSpotPrices
  //
  // swapexactamountout
  // https://docs.zeitgeist.pm/docs/build/sdk/swap#swapexactamountout
  public async getMarketInfo(marketId: number): Promise<Market> {
    return await this.sdk.models.fetchMarketData(marketId);
  }

  //createCategoryMeatadata(names: string[], tickers: string[]) {
  //  const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
  //  for name in names
  //}

  public createMetadata(question: string, description: string, categories: CategoryMetadata[]): DecodedMarketMetadata {
    return {
      slug: crypto.randomUUID(),
      question,
      description,
      categories
    };
  }

  public async buyAsset(poolId: number, amount: number) {
    const Decimals = 10 ** 10;
    const ammount = new Decimal(amount).mul(Decimals).toFixed(0);
    const slippage = new Decimal(0.98);
    const maxPrice = 9999 * Decimals;

    // https://docs.zeitgeist.pm/docs/build/sdk/swap#swapexactamountin
    const tx = await this.sdk.api.tx.swaps.swapExactAmountIn();
  }

  public async createPM(
    creatorAddress: string,
    oracle: string,
    duration: string,
    metadata: DecodedMarketMetadata & { categories: CategoryMetadata[] }
  ) {
    try {
      const injected = await web3FromAddress(creatorAddress);

      const sdk = await SDK.initialize('');
      const amount = (10 ** 10 * 100).toString();

      const params: CreateCpmmMarketAndDeployAssetsParams = {
        // The actual signer provider to sign the transaction
        signer: { address: creatorAddress, signer: injected.signer },
        // The address that will be responsible for reporting the market
        oracle,
        // Start and end block numbers or milliseconds since epoch
        period: { timestamp: [Date.now(), Date.now() + ms(duration)] },
        // Categorical or Scalar
        marketType: { Categorical: metadata.categories.length },
        // Dispute settlement can only be Authorized currently
        mdm: { Authorized: 0 },
        // A hash pointer to the metadata of the market
        metadata,
        // The amount of each token to add to the pool (MIN 100 ZTG)
        amount,
        // List of relative denormalized weights of each asset
        weights: Array.from({ length: metadata.categories.length }, () => amount),
        // true to get txn fee estimation otherwise false
        callbackOrPaymentInfo: false
      };

      const marketId = await sdk.models.createCpmmMarketAndDeployAssets(params);
      return marketId;
    } catch (error) {}
  }
}

export default ZeitgeistService;
