import React, { PropsWithChildren, useState } from 'react';
import Modal from './Modal';
import Input from '@components/Input/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { usePolkadot } from '@context/polkadot';
import toast from 'react-hot-toast';
import LightButton from '@components/Button/LightButton';
import Spinner from '@components/Spinner/Spinner';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export interface IModalOptions {
  status: boolean;
  daoAddress: string;
  closeModal: () => void;
}

interface IAsset {
  name: string;
  ticker: string;
}

interface PMForm {
  question: string;
  description: string;
  assets: IAsset[];
}

const resolver = yupResolver(
  yup
    .object({
      question: yup.string().required(),
      description: yup.string().required(),
      assets: yup.object().shape({
        name: yup.string().required(),
        ticker: yup.string().required()
      })
    })
    .required()
);

const NewPMModal: React.FC<PropsWithChildren<IModalOptions>> = ({ status, daoAddress, closeModal }) => {
  const { register, handleSubmit, formState, getValues } = useForm<PMForm>({ resolver });
  const { errors, isSubmitting } = formState;
  const { address, zeitgeistService } = usePolkadot();
  const [assets, setAssets] = useState<IAsset[]>([
    { name: '', ticker: '' },
    { name: '', ticker: '' }
  ]);

  const onSubmit: SubmitHandler<PMForm> = async ({ question, description, assets }) => {
    try {
      const assetsName = [] as string[];
      const assetsTicker = [] as string[];
      assets.map((e) => {
        assetsName.push(e.name);
        assetsTicker.push(e.ticker);
      });
      await zeitgeistService.createMetadataAndPM(question, description, assetsName, assetsTicker, address as string, daoAddress, '1 day');
      toast.success('Prediction Market Created');
      closeModal();
    } catch (e) {
      console.log(e);
    }
  };

  const addAsset = () => {
    const newAssets = assets.push({ name: '', ticker: '' } as IAsset);
    console.log(newAssets);
  };

  const assetsInputs = assets.map((asset, i) => (
    <div className="grid grid-cols-2 gap-5" key={i}>
      <Input type="text" placeholder="Asset Name" {...register(`assets.${i}.name`)} error={errors.question} value={asset.name} />
      <Input type="text" placeholder="Asset Ticker" {...register(`assets.${i}.ticker`)} error={errors.description} value={asset.ticker} />
    </div>
  ));

  return (
    <Modal status={status} closeModal={closeModal}>
      <div className="py-5">
        <h3 className="font-bold text-xl text-center">Create new prediction market</h3>
      </div>
      <div>
        <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <Input type="text" placeholder="Question" {...register('question')} error={errors.question} />
            <Input type="text" placeholder="Description" {...register('description')} error={errors.description} />
          </div>
          <div className="flex flex-col">{assetsInputs}</div>
          <LightButton disabled={!address} onClick={() => getValues()}>
            {isSubmitting ? 'Creating...' : 'Submit'}
            {isSubmitting && <Spinner tw="ml-1" />}
          </LightButton>
        </form>
      </div>
    </Modal>
  );
};

export default NewPMModal;
