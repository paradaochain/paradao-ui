import Input from '@components/Input/Input';
import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextArea from '@components/Input/Textarea';
import LightButton from '@components/Button/LightButton';
import Spinner from '@components/Spinner/Spinner';
import { usePolkadot } from '@context/polkadot';

interface TreasuryInputs {
  title: string;
  address: string;
  balance: number;
  description: string;
}

const resolver = yupResolver(
  yup
    .object({
      title: yup.string().required(),
      address: yup.string().required(),
      balance: yup.number().required(),
      description: yup.string().required()
    })
    .required()
);

const TreasuryForm: React.FC = () => {
  const { register, handleSubmit, setError, formState } = useForm<TreasuryInputs>({ resolver });
  const { errors, isSubmitting } = formState;
  const { address } = usePolkadot();
  const onSubmit: SubmitHandler<TreasuryInputs> = async ({ ...metadata }) => {
    console.log(metadata);
  };
  return (
    <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-5">
        <Input type="text" placeholder="Title" {...register('title')} error={errors.title} />
        <Input type="text" placeholder="Balance" {...register('balance')} error={errors.balance} />
      </div>
      <Input type="text" placeholder="Address" {...register('address')} error={errors.address} className="w-full" />
      <TextArea label="Description" {...register('description')} error={errors.description?.message} />
      <LightButton disabled={!address || (formState.errors && !formState.dirtyFields)}>
        {isSubmitting ? 'Creating...' : 'Submit'}
        {isSubmitting && <Spinner tw="ml-1" />}
      </LightButton>
    </form>
  );
};

export default TreasuryForm;
