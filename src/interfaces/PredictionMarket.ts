import { Asset } from '@zeitgeistpm/types/dist/interfaces';
import { CategoryMetadata } from '@zeitgeistpm/sdk/dist/types';

export interface PMOptions {
  assets: Asset[];
  assetsInfo: CategoryMetadata[];
  assetsPrice: string[];
}
export interface PredictionMarket {
  id: number;
  question: string;
  description: string;
  ends: string;
  options: PMOptions;
}
