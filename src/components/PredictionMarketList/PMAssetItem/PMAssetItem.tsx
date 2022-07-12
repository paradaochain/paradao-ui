import React, { useEffect, useState } from 'react';
import { Asset } from '@zeitgeistpm/types/dist/interfaces';
import Button from '@components/Button/Button';
import { usePolkadot } from '@context/polkadot';
import toast from 'react-hot-toast';
import Spinner from '@components/Spinner/Spinner';

interface Props {
  asset: Asset;
  marketId: number;
  price: string;
  name: string;
  ticker?: string;
  img?: string;
  color?: string;
  closeModal: () => void;
}

const PMAssetItem: React.FC<Props> = ({ asset, name, color, marketId, closeModal }) => {
  const [amount, setAmount] = React.useState('0');
  const [balance, setBalance] = React.useState<string>('0');
  const [price, setPrice] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { zeitgeistService, address } = usePolkadot();
  const buyAsset = async () => {
    setLoading(true);
    try {
      await zeitgeistService.buyAsset(marketId, asset, parseFloat(amount), address as string);
      toast.success('Token Bought');
      setAmount('0');
      await fetchBalancesAndPrice();
    } catch (err) {
      toast.error('Error Buying Token');
      console.log(err);
    }
    setLoading(false);
    closeModal();
  };

  const fetchBalancesAndPrice = () => {
    zeitgeistService.getAssetBalanceFromAddress(address as string, asset).then(setBalance);
    zeitgeistService.getAssetSpotPrice(marketId, asset).then((e) => setPrice(e));
  };

  useEffect(() => {
    fetchBalancesAndPrice();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 p-3 rounded-lg">
      <div className="flex gap-3 justify-center items-center">
        <div className="h-10 w-10 shadow-md" css={{ background: `#${color}` }}></div>
        <p>{name}</p>
      </div>
      <div className="flex gap-3 items-center justify-center  mt-6 mb-6 ">
        <input
          type="text"
          value={amount}
          onChange={({ target }) => setAmount(target.value)}
          className="max-w-[7rem] h-full rounded-md border border-purple-500 outline-purple-700 p-2"
        />
        <Button disabled={loading} onClick={() => buyAsset()}>
          {loading ? 'Buying...' : 'Buy'}
          {loading && <Spinner tw="ml-1" />}
        </Button>
      </div>
      <p>Asset price: {price.toFixed(4)} ZTG</p>
      <p>Your asset balance: {balance.toString()}</p>
    </div>
  );
};

export default PMAssetItem;
