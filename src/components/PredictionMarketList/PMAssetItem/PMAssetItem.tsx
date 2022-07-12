import React, { useEffect } from 'react';
import { Asset } from '@zeitgeistpm/types/dist/interfaces';
import Button from '@components/Button/Button';
import { usePolkadot } from '@context/polkadot';

interface Props {
  asset: Asset;
  price: string;
  name: string;
  ticker?: string;
  img?: string;
  color?: string;
}

const PMAssetItem: React.FC<Props> = ({ asset, price, name, color }) => {
  const [amount, setAmount] = React.useState(0);
  const [balance, setBalance] = React.useState<string>('0');
  const { zeitgeistService, address } = usePolkadot();
  const buyAsset = async (asset: Asset, quantity: number) => {
    await zeitgeistService.buyAsset(0, asset, quantity, address as string);
  };

  useEffect(() => {
    zeitgeistService.getAssetBalanceFromAddress(address as string, asset).then(setBalance);
  });
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 p-3 rounded-lg">
      <div className="flex gap-3 justify-center items-center">
        <div className="h-10 w-10 shadow-md" css={{ background: `#${color}` }}></div>
        <p>{name}</p>
      </div>
      <div className="flex gap-3 items-center justify-center  mt-6 mb-6 ">
        <input
          type="number"
          value={amount}
          onChange={({ target }) => setAmount(Number(target.value))}
          className="max-w-[7rem] h-full rounded-md border border-purple-500 outline-purple-700 p-2"
        />
        <Button onClick={() => buyAsset(asset, amount)}>Buy</Button>
      </div>
      <p>Asset price: {price} ZTG</p>
      <p>Your asset balance: {balance.toString()}</p>
    </div>
  );
};

export default PMAssetItem;
