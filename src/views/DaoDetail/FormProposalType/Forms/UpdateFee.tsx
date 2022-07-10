import Input from '@components/Input/Input';
import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextArea from '@components/Input/Textarea';
import LightButton from '@components/Button/LightButton';
import Spinner from '@components/Spinner/Spinner';
import InputSubmit from '@components/Input/InputSubmit';
import { BsDiscord } from 'react-icons/bs';
import { BsInstagram } from 'react-icons/bs';
import { BsYoutube } from 'react-icons/bs';
import { BiWorld } from 'react-icons/bi';
import InputIcon from '@components/Input/InputIcon';

interface UpdateFeeInputs {
  fee: number;
}

const resolver = yupResolver(
  yup
    .object({
      fee: yup.number().notRequired()
    })
    .required()
);

const UpdateFee: React.FC = () => {
  const { register, handleSubmit, setValue, formState } = useForm<UpdateFeeInputs>({ resolver });
  const { errors, isSubmitting } = formState;
  const onSubmit: SubmitHandler<UpdateFeeInputs> = async ({ ...metadata }) => {
    console.log(metadata);
  };
  return (
    <form className="flex flex-col w-full mb-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between flex-wrap">
        <Input type="text" placeholder="Fee" {...register('fee')} error={errors.fee} className="w-full" />
        <LightButton disabled={formState.errors && !formState.dirtyFields ? true : false}>
          {isSubmitting ? 'Creating...' : 'Submit'}
          {isSubmitting && <Spinner tw="ml-1" />}
        </LightButton>
      </div>
    </form>
  );
};

export default UpdateFee;
