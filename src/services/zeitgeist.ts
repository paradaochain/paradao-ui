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


  createCategoryMeatadata(names: string[], tickers: string[]) {
    const categories = [];
    for (let i = 0; i < names.length; i++) {
      const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
      const c = {
        name: names[i],
        tickets: tickers[i],
        color: randomColor()
      } as CategoryMetadata;
      categories.push(c);
    }
    return categories;
  }

  public createMetadata(question: string, description: string, names: string[], tickers: string[]): DecodedMarketMetadata {
    const categories = this.createCategoryMeatadata(names, tickers);

  
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

  public async createMetadataAndPM(
    question: string,
    description: string,
    names: string[],
    tickers: string[],
    creatorAddress: string,
    oracle: string,
    duration: string
  ) {
    const metadata = this.createMetadata(question, description, names, tickers);
    await this.createPM(creatorAddress, oracle, duration, metadata);
  }

  public async createPM(creatorAddress: string, oracle: string, duration: string, metadata: DecodedMarketMetadata) {
    try {
      const tokenDecimals = 10 ** 10;
      const injected = await web3FromAddress(creatorAddress);
      const amount = (tokenDecimals * 100).toString();
      if (!metadata.categories) {
        throw new Error('Category must be defined');
      }
      const optionsLength = metadata.categories?.length;
      const weights = Array.from({ length: optionsLength }, () => (tokenDecimals * (10 / optionsLength)).toFixed());

      const params: CreateCpmmMarketAndDeployAssetsParams = {
        // The actual signer provider to sign the transaction
        signer: { address: creatorAddress, signer: injected.signer },
        // The address that will be responsible for reporting the market
        oracle,
        // Start and end block numbers or milliseconds since epoch
        period: { timestamp: [Date.now(), Date.now() + ms(duration)] },
        // Categorical or Scalar
        marketType: { Categorical: optionsLength },
        // Dispute settlement can only be Authorized currently
        mdm: { Authorized: 0 },
        // A hash pointer to the metadata of the market
        metadata,
        // The amount of each token to add to the pool (MIN 100 ZTG)
        amount,
        // List of relative denormalized weights of each asset
        weights: weights,
        // true to get txn fee estimation otherwise false
        callbackOrPaymentInfo: false
      };

      await this.sdk.models.createCpmmMarketAndDeployAssets(params);
    } catch (error) {}
  }
}

export default ZeitgeistService;
