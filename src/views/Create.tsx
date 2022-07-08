import React, { FC, PropsWithChildren, useState, useContext } from 'react';
import tw from 'twin.macro';
import { ApiPromise } from '@polkadot/api';
import { ContractPromise, } from '@polkadot/api-contract';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { AccountContext, AccoutContextType } from '@context/wallet';
import factoryAbi from '@abis/factoryMeta.json';
import { CircleComplete, CircleOutline, Next } from '@icons/mui';
import Button, { CreateFormButton as SectionBtn } from '@components/Button';

type Sections = 'DaoInfo' | 'Links' | 'Members' | 'Voting';

// need to manually upload the dao.wasm file once onto the chain
// const daoCodeStoredHash = '0xdf80ef2242ae49f22c76ccb386588fd11a7d845817b772a0f8f3a99a071095be';

// for now also need to manually upload/deploy 'factory.contract' -- and save the hash here  -- should we code this??
// NOTE UPDATE THIS WITH THE HASH FROM YOUR LOCAL CHAIN
const factoryCodeStoredHash = '0xe0264b7255a7766423dce3c62b28a832096fd40d9bb1c157165687abd69722fb';

export const createDao = async (injAddr: string) => {
  const api = await ApiPromise.create();
  const injector = await web3FromAddress(injAddr);
  const contract = new ContractPromise(api, factoryAbi, factoryCodeStoredHash);

  const gasLimit = 100000n * 1000000n;
  const storageDepositLimit = null;
  const name = 'testdao5';
  const ty = 0;
  const salt = 0;
  const stars = null;

  await contract.tx
    .createDao({ storageDepositLimit, gasLimit }, name, ty, stars, salt)
    .signAndSend(injAddr, { signer: injector.signer }, result => {
      if (result.status.isInBlock) {
        console.log(`${ name } in a block`);
      } else if (result.status.isFinalized) {
        console.log(`${ name } finalized`);
      }
    });
};

const Create: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<Sections>('DaoInfo');
  const { account } = useContext(AccountContext) as AccoutContextType;

  return (
    <div tw="ml-4 my-8 space-y-8 flex flex-col justify-center items-start">
      <h1 tw="ml-2 text-2xl text-blue-800">Lets fucking do this</h1>
      <Button onClick={ () => createDao(account.address) }>Test Create</Button>
      <div tw="space-x-12 flex flex-row justify-center items-start">
        <FormSteps setVisible={setVisibleSection} />
        <DaoForm setVisible={setVisibleSection} visibleSection={visibleSection} />
      </div>
    </div>
  );
};

export default Create;

const StepsOl = tw.ol`m-4 relative border-l border-gray-200 dark:border-gray-700 border-dashed`;
const StepLiLast = tw.li`ml-6 cursor-pointer`;
const StepLi = tw(StepLiLast)`mb-10`;
const StepSvgContainer = tw.div`flex absolute -left-3 justify-center items-center w-6 h-6 rounded-full ring-8 ring-blue-50`;
const StepDoneSvgContainer = tw(StepSvgContainer)`bg-green-400`;
const StepTodoSvgContainer = tw(StepSvgContainer)`bg-gray-300`;
const StepH3 = tw.h3`text-base font-semibold text-gray-900 dark:text-gray-900`;

// similar to https://app.astrodao.com/create-dao-new
const FormSteps: FC<{ setVisible: (x: Sections) => void }> = ({ setVisible }) => {
  // TODO add validation to check that inputs are filled in, and then mark sections as complete
  const Done = () => (
    <StepDoneSvgContainer>
      <CircleComplete />
    </StepDoneSvgContainer>
  );
  const Todo = () => (
    <StepTodoSvgContainer>
      <CircleOutline />
    </StepTodoSvgContainer>
  );

  return (
    <StepsOl>
      <StepLi onClick={() => setVisible('DaoInfo')}>
        {true ? <Done /> : <Todo />}
        <StepH3>DAO Info</StepH3>
      </StepLi>
      <StepLi onClick={() => setVisible('Links')}>
        {true ? <Done /> : <Todo />}
        <StepH3>Social Media</StepH3>
      </StepLi>
      <StepLi onClick={() => setVisible('Members')}>
        {false ? <Done /> : <Todo />}
        <StepH3>Members</StepH3>
      </StepLi>
      <StepLiLast onClick={() => setVisible('Voting')}>
        {false ? <Done /> : <Todo />}
        <StepH3>Voting</StepH3>
      </StepLiLast>
    </StepsOl>
  );
};

const DaoForm: FC<{ setVisible: (x: Sections) => void; visibleSection: string }> = ({ setVisible, visibleSection }) => {
  return (
    <FormCard>
      <form tw="w-full h-full relative">
        {visibleSection === 'DaoInfo' && <DaoInfoFormSection setVisible={setVisible} />}
        {visibleSection === 'Links' && <LinksFormSection setVisible={setVisible} />}
        {visibleSection === 'Members' && <MembersFormSection setVisible={setVisible} />}
        {visibleSection === 'Voting' && <VotingFormSection />}
      </form>
    </FormCard>
  );
};

const CardContainer = tw.div`block p-6 m-4 height[28rem] width[620px] bg-white rounded-lg border border-gray-200 shadow-md`;
const FormCard: FC<PropsWithChildren> = ({ children }) => {
  return <CardContainer>{children}</CardContainer>;
};

const FormHeader = tw.h1`mb-6 text-2xl text-gray-900`;
const InputContainer = tw.div`relative z-0 w-full mb-6`;
const Input = tw.input`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600`;
const Label = tw.label`peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`;
const TextArea = tw.textarea`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600`;
// const SectionBtn = tw.button`inline-flex items-center absolute right-0 bottom-0 py-2 px-3 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300`;
const AdminCheckBox = tw.input`w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring focus:ring-blue-300`;
const AdminCheckLabel = tw.label`ml-2 text-sm font-medium text-gray-500`;

const DaoInfoFormSection: FC<{ setVisible: (x: Sections) => void }> = ({ setVisible }) => {
  return (
    <>
      <FormHeader>Dao Name and description</FormHeader>
      <InputContainer className="group">
        <Input tw="w-48" className="peer" type="text" name="dao_name" placeholder=" " required />
        <Label htmlFor="dao_name">Dao Name</Label>
      </InputContainer>
      <InputContainer>
        <Input tw="w-36" className="peer" type="text" name="token" placeholder=" " required />
        <Label htmlFor="token">Token Name</Label>
      </InputContainer>
      <InputContainer>
        <TextArea id="descrip" rows={2} maxLength={410} tw="w-96" className="peer" name="descrip" placeholder={' '} required />
        <Label htmlFor="descrip">Description</Label>
      </InputContainer>
      <SectionBtn onClick={() => setVisible('Links')}>
        Next
        <Next />
      </SectionBtn>
    </>
  );
};

const LinksFormSection: FC<{ setVisible: (x: Sections) => void }> = ({ setVisible }) => {
  return (
    <>
      <FormHeader>Add Social Media Links</FormHeader>
      <InputContainer className="group">
        <Input tw="w-96" className="peer" type="text" name="facebook" placeholder=" " required />
        <Label htmlFor="facebook">Facebook Link</Label>
      </InputContainer>
      <InputContainer>
        <Input tw="w-96" className="peer" type="text" name="insta" placeholder=" " required />
        <Label htmlFor="insta">Instagram</Label>
      </InputContainer>
      <InputContainer>
        <Input tw="w-96" className="peer" type="text" name="discord" placeholder=" " required />
        <Label htmlFor="discord">Discord</Label>
      </InputContainer>
      <SectionBtn onClick={() => setVisible('Members')}>
        Next
        <Next />
      </SectionBtn>
    </>
  );
};

const MembersFormSection: FC<{ setVisible: (x: Sections) => void }> = ({ setVisible }) => {
  return (
    <>
      <FormHeader>Members and Roles</FormHeader>
      <InputContainer className="group">
        <Input tw="w-96" className="peer" type="text" name="member1" placeholder=" " required />
        <Label htmlFor="member1">Name</Label>
        <div tw="flex items-start mt-2">
          <div tw="flex items-center h-5">
            <AdminCheckBox id="admin" type="checkbox" value="" />
          </div>
          <AdminCheckLabel htmlFor="admin">Admin</AdminCheckLabel>
        </div>
      </InputContainer>
      <InputContainer>
        <Input tw="w-96" className="peer" type="text" name="member2" placeholder=" " required />
        <Label htmlFor="member2">Name</Label>
        <div tw="flex items-start mt-2">
          <div tw="flex items-center h-5">
            <AdminCheckBox id="admin" type="checkbox" value="" />
          </div>
          <AdminCheckLabel htmlFor="admin">Admin</AdminCheckLabel>
        </div>
      </InputContainer>
      <InputContainer>
        <Input tw="w-96" className="peer" type="text" name="member3" placeholder=" " required />
        <Label htmlFor="member3">Name</Label>
        <div tw="flex items-start mt-2">
          <div tw="flex items-center h-5">
            <AdminCheckBox id="admin" type="checkbox" value="" />
          </div>
          <AdminCheckLabel htmlFor="admin">Admin</AdminCheckLabel>
        </div>
      </InputContainer>
      <SectionBtn onClick={() => setVisible('Voting')}>
        Next
        <Next />
      </SectionBtn>
    </>
  );
};

// NOTE not sure what actually should go here
const VotingFormSection: FC = () => {
  return (
    <>
      <FormHeader>Voting Options</FormHeader>
      <InputContainer className="group">
        <Input tw="w-96" className="peer" type="text" name="facebook" placeholder=" " required />
        <Label htmlFor="facebook">Facebook Link</Label>
      </InputContainer>
      <InputContainer>
        <Input tw="w-96" className="peer" type="text" name="insta" placeholder=" " required />
        <Label htmlFor="insta">Instagram</Label>
      </InputContainer>
      <InputContainer>
        <Input tw="w-96" className="peer" type="text" name="discord" placeholder=" " required />
        <Label htmlFor="discord">Discord</Label>
      </InputContainer>
      <SectionBtn disabled onClick={(e) => e.preventDefault()}>
        Submit
        <Next />
      </SectionBtn>
    </>
  );
};
