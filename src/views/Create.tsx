import Input from '@components/Input/Input';
import React from 'react';
import * as yup from 'yup';
import { useLocation } from 'wouter';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextArea from '@components/Input/Textarea';
import Dropdown from '@components/Dropdown/Dropdown';
import InputSubmit from '@components/Input/InputSubmit';
import InputIcon from '@components/Input/InputIcon';
import { BsDiscord } from 'react-icons/bs';
import { BsInstagram } from 'react-icons/bs';
import { BsYoutube } from 'react-icons/bs';
import { BiWorld } from 'react-icons/bi';
import Spinner from '@components/Spinner/Spinner';
import LightButton from '@components/Button/LightButton';
import { usePolkadot } from '@context/polkadot';
interface CreateDaoInputs {
  name: string;
  purpose: string;
  logo: string;
  type: number;
  fee: number;
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
      name: yup.string().required(),
      purpose: yup.string().required(),
      type: yup.number().required(),
      fee: yup.string().required(),
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

const Create: React.FC = () => {
  const { register, handleSubmit, formState, setValue, watch } = useForm<CreateDaoInputs>({});
  const { factoryService } = usePolkadot();
  const { errors, isSubmitting } = formState;
  const [, setLocation] = useLocation();
  const type = watch('type');

  const setType = (type: boolean) => setValue('type', +type);
  const setLogo = (logo: string) => setValue('logo', logo);

  const onSubmit: SubmitHandler<CreateDaoInputs> = async ({ name, type, fee, ...metadata }) => {
    try {
      const daoAddr = await factoryService.createDao(name, metadata, type, fee);
      setLocation(`/dao/${daoAddr}`);
    } catch (e) {
      // display err
      console.log(e);
    }
  };

  const displayType = type ? 'Community' : 'SuperStar';
  const typeOptions = [
    { name: 'SuperStar', click: () => setType(false) },
    { name: 'Community', click: () => setType(true) }
  ];

  return (
    <div className="p-5 flex flex-col justify-center items-start w-full">
      <h1 className="mb-5 text-2xl text-blue-800">Create DAO</h1>
      <form className="max-w-[55rem] my-0 mx-auto bg-white rounded-lg px-3 py-8 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center h-[5rem] mb-2">
          <InputSubmit setLogo={setLogo} />
        </div>
        <div className="flex justify-between w-full">
          <Input type="text" placeholder="Dao Name" {...register('name')} error={errors.name} />
          <Dropdown options={typeOptions}>{type === null ? 'Type...' : displayType}</Dropdown>
        </div>
        <div className="w-full">
          <TextArea label="Purpose" {...register('purpose')} error={errors.purpose?.message} />
        </div>
        <div className="grid grid-cols-4">
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
        <div>
          <LightButton disabled={formState.errors && !formState.dirtyFields ? true : false}>
            {isSubmitting ? 'Creating...' : 'Submit'}
            {isSubmitting && <Spinner tw="ml-1" />}
          </LightButton>
        </div>
      </form>
    </div>
  );
};

export default Create;
