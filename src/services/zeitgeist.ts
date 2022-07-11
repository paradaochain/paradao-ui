import { CategoryMetadata, DecodedMarketMetadata } from '@zeitgeistpm/sdk/dist/types';
import SDK from '@zeitgeistpm/sdk';
import { CreateCpmmMarketAndDeployAssetsParams } from '@zeitgeistpm/sdk/dist/types/market';
import { Asset } from '@zeitgeistpm/types/dist/interfaces';
import ms from 'ms';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { Market, Swap } from '@zeitgeistpm/sdk/dist/models';
import { Decimal } from 'decimal.js';

class ZeitgeistService {
  public sdk!: SDK;
  public ZTG: number;
  public ztgAsset: { ztg: null };
  constructor(sdk: SDK) {
    this.sdk = sdk;
    this.ZTG = 10 ** 10;
    this.ztgAsset = { ztg: null };
  }

  public async getMarketInfo(marketId: number): Promise<Market> {
    return await this.sdk.models.fetchMarketData(marketId);
  }

  public createCategoryMeatadata(names: string[], tickers: string[]) {
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

  public calculateGi(
    tokenBalanceIn: number, // amount of 'in' asset in the pool
    tokenWeightIn: number, // weight of 'in' asset on the pool
    tokenBalanceOut: number, // amount of 'out' asset in the pool
    tokenWeightOut: number, // weight of 'out' asset on the pool
    tokenAmountIn: number, // amount in for the swap
    swapFee = 0 //0 for now
  ) {
    const weightRatio = new Decimal(tokenWeightIn).div(new Decimal(tokenWeightOut));
    const adjustedIn = new Decimal(tokenAmountIn).times(new Decimal(1).minus(new Decimal(swapFee)));
    const y = new Decimal(tokenBalanceIn).div(new Decimal(tokenBalanceIn).plus(adjustedIn));
    const foo = y.pow(weightRatio);
    const bar = new Decimal(1).minus(foo);
    const tokenAmountOut = new Decimal(tokenBalanceOut).times(bar);
    return tokenAmountOut;
  }

  public async getAssetSpotPrice(pool: Swap, assetInfo: Asset) {
    return pool.getSpotPrice(JSON.stringify(this.ztgAsset), assetInfo);
  }

  public async buyAsset(marketId: number, asset: Asset, tokenAmount: number, addr: string) {
    const market = await this.getMarketInfo(marketId);
    const pool = await market.getPool();

    if (!pool) throw new Error('We could not find any pool assigned to this prediction market');

    const amount = new Decimal(tokenAmount).mul(this.ZTG).toFixed(0);
    const slippage = new Decimal(0.98);
    const maxPrice = 9999 * this.ZTG;

    const poolAccountId = await pool.accountId();

    const ztgWeight = new Decimal(pool.weights.toHuman()['Ztg'].replace(/\,/g, '')).toNumber();
    const poolZtgBalance: any = await this.sdk.api.query.system.account(poolAccountId.toString());

    const assetWeight = new Decimal(pool.weights.toHuman()[JSON.stringify(asset)].replace(/\,/g, '')).toNumber();
    const poolAssetBalance: any = await this.sdk.api.query.tokens.accounts(poolAccountId.toString(), this.sdk.api.createType('Asset', asset));

    const minOut = this.calculateGi(
      poolZtgBalance.data.free.toNumber(),
      ztgWeight,
      poolAssetBalance.free.toNumber(),
      assetWeight,
      parseInt(amount)
    );

    await this.sdk.api.tx.swaps
      .swapExactAmountIn(pool.poolId, this.ztgAsset, amount, asset, minOut.mul(slippage).toFixed(0), maxPrice)
      .signAndSend(addr);
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
