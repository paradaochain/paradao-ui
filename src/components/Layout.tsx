import React, { FC, PropsWithChildren } from 'react';
import { useLocation } from 'wouter';
import tw from 'twin.macro';
import { useMobile } from '@utils/responsive';
import logo from './paradao-icon.svg';
import { View, Add } from '@icons/mui';

const LogoContainer = tw.div`w-full mb-4 flex justify-center items-center pointer-events-none`;
const ScreenContainer = tw.div`h-screen w-screen flex flex-row overflow-auto`;
const SideBarBtn = tw.button`flex w-full items-center p-2 text-base font-normal rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700`;
const SideBarAside = tw.aside`w-64 bg-gray-50 h-screen`;
const SideBarContainer = tw.div`overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-50`;
const SideBarTxt = tw.span`ml-3 text-blue-900`;

const Layout: React.FC<PropsWithChildren> = ({ children: Component }) => {
  const isMobile = useMobile();

  return (
    <ScreenContainer>
      {/* TODO  mobile menu */}
      { !isMobile && <LayoutSidebar /> }
      <main tw="m-6 flex flex-col flex-1 justify-start items-start">{Component}</main>
    </ScreenContainer>
  );
};

export default Layout;

const LayoutSidebar: FC = () => {
  return (
    <div tw="width[fit-content]">
      <Sidebar />
    </div>
  );
};

const Sidebar: FC = () => {
  const [ location, setLocation ] = useLocation();

  return (
    <SideBarAside aria-label="ParaDAO sidebar">
      <SideBarContainer>
        <LogoContainer>
          <div tw="h-20 w-20">
              <img src={ logo } />
          </div>
        </LogoContainer>
        <ul tw="space-y-2">
          <li>
              <SideBarBtn onClick={() => setLocation("/")}>
                <View />
                <SideBarTxt>View all DAOs</SideBarTxt>
              </SideBarBtn>
          </li>
          <li>
            <SideBarBtn onClick={() => setLocation("/create")}>
                <Add/>
                <SideBarTxt>Create DAO</SideBarTxt>
              </SideBarBtn >
          </li>
        </ul>
      </SideBarContainer>
    </SideBarAside>
  );
};
