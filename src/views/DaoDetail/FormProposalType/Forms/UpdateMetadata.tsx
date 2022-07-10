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

interface UpdateMetadataInputs {
  logo: string;
  purpose: string;
  links?: {
    discord?: string;
    website?: string;
    youtube?: string;
    instagram?: string;
  };
}

const resolver = yupResolver(
  yup
    .object({
      purpose: yup.string().required(),
      logo: yup.string().notRequired(),
      links: yup.object().shape({
        instagram: yup.string().notRequired(),
        website: yup.string().notRequired(),
        youtube: yup.string().notRequired(),
        discord: yup.string().notRequired()
      })
    })
    .required()
);

const UpdateMetadata: React.FC = () => {
  const { register, handleSubmit, setValue, formState } = useForm<UpdateMetadataInputs>({ resolver });
  const { errors, isSubmitting } = formState;
  const setLogo = (logo: string) => setValue('logo', logo);
  const onSubmit: SubmitHandler<UpdateMetadataInputs> = async ({ ...metadata }) => {
    console.log(metadata);
  };
  return (
    <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-center h-[5rem] mb-2">
        <InputSubmit setLogo={setLogo} />
      </div>
      <TextArea label="Description" {...register('purpose')} error={errors.purpose?.message} />
      <div className="grid grid-cols-2 gap-5">
        <InputIcon type="text" placeholder="Website" {...register('links.website')} error={errors.links?.website} icon={<BiWorld />} />
        <InputIcon type="text" placeholder="Discord" {...register('links.discord')} error={errors.links?.discord} icon={<BsDiscord />} />
        <InputIcon
          type="text"
          placeholder="Instagram"
          {...register('links.instagram')}
          error={errors.links?.instagram}
          icon={<BsInstagram />}
        />
        <InputIcon type="text" placeholder="Youtube" {...register('links.youtube')} error={errors.links?.youtube} icon={<BsYoutube />} />
      </div>
      <LightButton disabled={formState.errors && !formState.dirtyFields ? true : false}>
        {isSubmitting ? 'Creating...' : 'Submit'}
        {isSubmitting && <Spinner tw="ml-1" />}
      </LightButton>
    </form>
  );
};

export default UpdateMetadata;
