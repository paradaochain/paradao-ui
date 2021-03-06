import React, { FC, PropsWithChildren, useRef, useState } from 'react';
import tw from 'twin.macro';
import { CircleComplete, CircleOutline, Next } from '@icons/mui';
import Button from '@components/Button/Button';
import { usePolkadot } from '@context/polkadot';

type Sections = 'DaoInfo' | 'Links' | 'Members' | 'Voting';

const Create: React.FC = () => {
  const [visibleSection, setVisibleSection] = useState<Sections>('DaoInfo');

  return (
    <div tw="ml-4 my-8 space-y-8 flex flex-col justify-center items-start">
      <h1 tw="ml-2 text-2xl text-blue-800">Lets fucking do this</h1>
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
      <StepLiLast onClick={() => setVisible('DaoInfo')}>
        {false ? <Done /> : <Todo />}
        <StepH3>DAO Info</StepH3>
      </StepLiLast>
      {/*  <StepLiLast onClick={() => setVisible('Links')}>
        {false ? <Done /> : <Todo />}
        <StepH3>Social Media</StepH3>
      </StepLiLast>
      <StepLi onClick={() => setVisible('Members')}>
        {false ? <Done /> : <Todo />}
        <StepH3>Members</StepH3>
      </StepLi>
      <StepLiLast onClick={() => setVisible('Voting')}>
        {false ? <Done /> : <Todo />}
        <StepH3>Voting</StepH3>
      </StepLiLast> */}
    </StepsOl>
  );
};

const DaoForm: FC<{ setVisible: (x: Sections) => void; visibleSection: string }> = ({ setVisible, visibleSection }) => {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <FormCard>
      <form tw="w-full h-full relative" ref={formRef}>
        {visibleSection === 'DaoInfo' && <DaoInfoFormSection formRef={formRef} />}
        {visibleSection === 'Links' && <LinksFormSection />}
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
// const Button = tw.button`inline-flex items-center absolute right-0 bottom-0 py-2 px-3 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300`;
const AdminCheckBox = tw.input`w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring focus:ring-blue-300`;
const AdminCheckLabel = tw.label`ml-2 text-sm font-medium text-gray-500`;

const DaoInfoFormSection: FC<{ formRef: React.RefObject<HTMLFormElement> }> = ({ formRef }) => {
  const { factoryService } = usePolkadot();
  const createDao = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!formRef.current) return;
    e.preventDefault();
    const { name, type, fee, ...metadata } = Object.fromEntries(new FormData(formRef.current).entries());
    await factoryService.createDao(name as string, metadata, +type, +fee);
  };
  return (
    <>
      <FormHeader>Dao Name and description</FormHeader>
      <InputContainer className="group">
        <Input tw="w-48" className="peer" type="text" name="dao_name" placeholder=" " required />
        <Label htmlFor="dao_name">Dao Name</Label>
      </InputContainer>
      <InputContainer>
        <TextArea id="purpose" rows={2} maxLength={410} tw="w-96" className="peer" name="purpose" placeholder={' '} required />
        <Label htmlFor="purpose">Purpose</Label>
      </InputContainer>
      <InputContainer>
        <Input tw="w-36" className="peer" type="text" name="type" placeholder=" " required />
        <Label htmlFor="type">DAO Type</Label>
      </InputContainer>
      <InputContainer>
        <Input tw="w-36" className="peer" type="text" name="fee" placeholder=" " required />
        <Label htmlFor="fee">Joining Fee</Label>
      </InputContainer>
      <Button onClick={createDao}>
        Submit
        <Next />
      </Button>
    </>
  );
};
/* createDao (name: String, metadataUrl: String, ty: u32, joiningFee: Balance, initMembers: Option<Vec<(AccountId,Text,DaoRole)>>, salt: u32) */
const LinksFormSection: FC = () => {
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
      <Button>
        Submit
        <Next />
      </Button>
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
      <Button onClick={() => setVisible('Voting')}>
        Next
        <Next />
      </Button>
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
      <Button>
        Submit
        <Next />
      </Button>
    </>
  );
};
