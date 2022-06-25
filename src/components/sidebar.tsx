import React, { FC } from 'react';
import { useLocation } from 'wouter';
import tw from 'twin.macro';
import logo from './paradao-icon.svg';
import { View, Add } from '@icons/mui';

const LogoButton = tw.button`w-full mb-4 flex justify-center items-center`;
const SideBarBtn = tw.button`flex w-full items-center p-2 text-base font-normal rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`;
const SideBarAside = tw.aside`w-64 bg-gray-50 h-screen`;
const SideBarContainer = tw.div`overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-50`;
const SideBarTxt = tw.span`ml-3 text-blue-900`;

const LayoutSidebar: FC = () => {
  return (
    <div tw="width[fit-content] h-screen">
      <Sidebar />
    </div>
  );
};

export default LayoutSidebar;

const Sidebar: FC = () => {
  const [location, setLocation] = useLocation();

  return (
    <SideBarAside aria-label="ParaDAO sidebar">
      <SideBarContainer>
        <LogoButton onClick={() => setLocation('/')}>
          <div tw="h-20 w-20">
            <img tw="pointer-events-none" src={logo} />
          </div>
        </LogoButton>
        <ul tw="space-y-2">
          <li>
            <SideBarBtn onClick={() => setLocation('/all-daos')}>
              <View />
              <SideBarTxt>View all DAOs</SideBarTxt>
            </SideBarBtn>
          </li>
          <li>
            <SideBarBtn onClick={() => setLocation('/create')}>
              <Add />
              <SideBarTxt>Create DAO</SideBarTxt>
            </SideBarBtn>
          </li>
        </ul>
      </SideBarContainer>
    </SideBarAside>
  );
};
