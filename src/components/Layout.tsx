import React, { FC, PropsWithChildren } from 'react';
import { useLocation } from 'wouter';
import tw from 'twin.macro';
import { useMobile } from '@utils/responsive';
import logo from './paradao-icon.svg';
import { View, Add,  Home as HomeIcon, NextCrumb } from '@icons/mui';

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
      <main tw="m-6 flex flex-col flex-1 justify-start items-start">
        <Breadcrumbs />
        <div>{Component}</div>
      </main>
    </ScreenContainer>
  );
};

export default Layout;

const BcBtn = tw.button`text-sm font-medium text-gray-700 hover:text-gray-900 capitalize`;
const BcSpan = tw.span`ml-1 text-sm font-medium text-gray-500 md:ml-2 capitalize`;
const Breadcrumbs: FC = () => {
  const [ location, setLocation ] = useLocation();
  const crumbs = location.replace(/^\//, "").split('/');

  return (
    <nav tw="flex h-6" aria-label="Breadcrumb">
      <ol tw="inline-flex items-center space-x-1 md:space-x-2">
        <li tw="inline-flex items-center">
          <BcBtn tw="inline-flex items-center" onClick={ () => setLocation('/') }>
            <HomeIcon />
            Home
          </BcBtn>
        </li>
        {/* Note this works for now, not sure what the current page structure will look like, prob need to adjust */}
        {/* always will have home, the current page (last one in the array) is not a button, the rest should be buttons */}
        { crumbs.length > 0 && crumbs.map((loc, i) => {
          console.log('ummm', crumbs, location);
          if (loc) {
            // if (i === crumbs.length - 1) {
            //   return (
            //     <li aria-current="page">
            //       <div tw="flex items-center">
            //         < NextCrumb />
            //         <BcSpan>{ loc }</BcSpan>
            //       </div>
            //     </li>
            //   );
            // } else {
              return (
                <li>
                  <div tw="flex items-center">
                    < NextCrumb />
                    <BcBtn tw="ml-1 md:ml-2" onClick={ () => setLocation(loc) }> { loc }</BcBtn>
                  </div>
                </li>
              );
            // }
          }
        }) }
      </ol>
    </nav>
  );
};

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
