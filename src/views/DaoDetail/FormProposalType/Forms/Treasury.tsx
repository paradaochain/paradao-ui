import Input from '@components/Input/Input';
import React, { useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextArea from '@components/Input/Textarea';
import LightButton from '@components/Button/LightButton';
import Spinner from '@components/Spinner/Spinner';
import { usePolkadot } from '@context/polkadot';
import { DAOService } from '@services/dao';
import toast from 'react-hot-toast';

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

const TreasuryForm: React.FC<{ daoService: DAOService; close: () => void }> = ({ daoService, close }) => {
  const { register, handleSubmit, setError, formState } = useForm<TreasuryInputs>({ resolver });
  const { errors, isSubmitting } = formState;
  const { address } = usePolkadot();
  const [isProposing, setIsProposing] = useState<boolean>(false);

  const onSubmit: SubmitHandler<TreasuryInputs> = async ({ title, balance, address, ...metadata }) => {
    const proposal = { Treasury: [address, balance] };
    setIsProposing(true);
    setTimeout(() => {
      setIsProposing(false);
      toast.error('Could not propose now :( Try again?');
    }, 120000);
    toast('Proposing... :)');
    try {
      await daoService.propose(proposal, title, metadata);
      setIsProposing(false);
      toast.success('Successfully proposed!');
      setTimeout(() => close(), 1000);
    } catch (e) {
      console.log(e);
      setIsProposing(false);
      toast.error(`Could not propose ${e}`);
    }
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
        {isSubmitting || isProposing ? 'Creating...' : 'Submit'}
        {(isSubmitting || isProposing) && <Spinner tw="ml-1" />}
      </LightButton>
    </form>
  );
};

export default TreasuryForm;
