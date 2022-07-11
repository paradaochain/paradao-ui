import Input from '@components/Input/Input';
import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextArea from '@components/Input/Textarea';
import LightButton from '@components/Button/LightButton';
import Spinner from '@components/Spinner/Spinner';

import ZeitgeistService from '@services/zeitgeist';


interface PMForm {
  question: string;
  description: string;
  assetNames: string[];
  assetTickers: string[];
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

const PMForm: React.FC<{ zeitgeist: ZeitgeistService }> = ({ zeitgeist }) => {
  const { register, handleSubmit, setError, formState } = useForm<PMForm>({ resolver });
  const { errors, isSubmitting } = formState;
  const onSubmit: SubmitHandler<PMForm> = async ({ question, assetNames, assetTickers, ...metadata }) => {
    try {

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
        <Input type="text" placeholder="Asset Name" {...register('assetNames')} error={errors.question} />
        <Input type="text" placeholder="Asset Ticker" {...register('assetTickers')} error={errors.description} />
      </div>
      <LightButton disabled={formState.errors && !formState.dirtyFields ? true : false}>
        {isSubmitting ? 'Creating...' : 'Submit'}
        {isSubmitting && <Spinner tw="ml-1" />}
      </LightButton>
    </form>
  );
};

export default PMForm;
