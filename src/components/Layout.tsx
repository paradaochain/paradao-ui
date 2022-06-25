import React, { FC, PropsWithChildren } from 'react';
import tw from 'twin.macro';
import Sidebar from '@components/sidebar';
import Breadcrumbs from '@components/breadcrumbs';
import { useMobile } from '@utils/responsive';

const ScreenContainer = tw.div`h-screen w-screen flex flex-row overflow-auto`;

const Layout: React.FC<PropsWithChildren> = ({ children: Component }) => {
  const isMobile = useMobile();

  return (
    <ScreenContainer>
      {/* TODO  mobile menu */}
      {!isMobile && <Sidebar />}
      <main tw="p-6 flex flex-col flex-1 justify-start items-start bg-blue-50 h-full w-full">
        <Breadcrumbs />
        <div>{Component}</div>
      </main>
    </ScreenContainer>
  );
};

export default Layout;
