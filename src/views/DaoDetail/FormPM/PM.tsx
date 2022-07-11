import Input from '@components/Input/Input';
import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextArea from '@components/Input/Textarea';
import LightButton from '@components/Button/LightButton';
import Spinner from '@components/Spinner/Spinner';
import { usePolkadot } from '@context/polkadot';
import ZeitgeistService from '@services/zeitgeist';

interface PMForm {
  question: string;
  description: string;
  assetName1: string;
  assetTicker1: string;
  assetName2: string;
  assetTicker2: string;
  assetName3: string;
  assetTicker3: string;
}

const resolver = yupResolver(
  yup
    .object({
      question: yup.string().required(),
      description: yup.string().required(),
      assetNames: yup.array().required(),
      assetTickers: yup.array().required()
    })
    .required()
);

const PMForm: React.FC = () => {
  const { register, handleSubmit, setError, formState } = useForm<PMForm>({ resolver });
  const { errors, isSubmitting } = formState;
  const { address } = usePolkadot();

  // const zg_ws = import.meta.env.VITE_ZG_WS_URL;
  // const zg_service = new ZeitgeistService(zg_ws);

  const onSubmit: SubmitHandler<PMForm> = async ({ question, assetName1, assetTicker1, assetName2, assetTicker2, assetName3, assetTicker3, ...metadata }) => {
    try {
			let assetsNames = [assetName1, assetName2, assetName3];
			let assetsTickers = [assetTicker1, assetTicker2, assetTicker3];
			// call zeitgeist

    } catch (e) {
      console.log(e);
    }
  };
  return (
    <form className="flex flex-col w-full">
      <div className="grid ">
        <Input type="text" placeholder="Question" {...register('question')} error={errors.question} />
        <Input type="text" placeholder="Description" {...register('description')} error={errors.description} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Input type="text" placeholder="Asset Name" {...register('assetName1')} error={errors.question} />
        <Input type="text" placeholder="Asset Ticker" {...register('assetTicker1')} error={errors.description} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Input type="text" placeholder="Asset Name" {...register('assetName2')} error={errors.question} />
        <Input type="text" placeholder="Asset Ticker" {...register('assetTicker2')} error={errors.description} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Input type="text" placeholder="Asset Name" {...register('assetName3')} error={errors.question} />
        <Input type="text" placeholder="Asset Ticker" {...register('assetTicker3')} error={errors.description} />
      </div>
      <LightButton disabled={!address || (formState.errors && !formState.dirtyFields) ? true : false}>
        {isSubmitting ? 'Creating...' : 'Submit'}
        {isSubmitting && <Spinner tw="ml-1" />}
      </LightButton>
    </form>
  );
};

export default PMForm;
