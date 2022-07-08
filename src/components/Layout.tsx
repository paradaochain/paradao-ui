import React, { FC, PropsWithChildren, useState } from 'react';
import tw from 'twin.macro';
import { useLocation } from 'wouter';
import logo from './paradao-icon.svg';
import { AccountProvider } from '@context/wallet';
import Sidebar from '@components/Sidebar';
import Breadcrumbs from '@components/Breadcrumbs';
import Button from '@components/Button';
import WalletModal from '@components/WalletModal';
import { useMobile } from '@utils/responsive';
import { SearchIcon, MenuIcon, WalletIcon } from '@icons/mui';

const ScreenContainer = tw.main`h-screen flex flex-col`;
const ContentContainer = tw.div`p-6 flex flex-col flex-1 justify-start items-start bg-blue-50 overflow-y-auto`;

const Layout: FC<PropsWithChildren> = ({ children: Component }) => {
  const isMobile = useMobile();
  const [ showWalletModal, setShowWalletModal ] = useState<boolean>(false);

  return (
    <AccountProvider>
      <ScreenContainer>
        <div tw="flex flex-1 overflow-hidden">
          {/* TODO  mobile menu */}
          {!isMobile && <Sidebar />}
          <div tw="flex flex-1 flex-col">
            <Header showModal={ () => setShowWalletModal(true) } />
            <ContentContainer>
              <Breadcrumbs />
              <div>
                { Component }
                <WalletModal isOpened={ showWalletModal } onClose={ () => setShowWalletModal(false) } />
              </div>
            </ContentContainer>
          </div>
        </div>
        {/* <div tw="flex">Footer</div> */}
      </ScreenContainer>
    </AccountProvider>

  );
};

export default Layout;

const LogoButton = tw.button`flex justify-center items-center md:hidden hover:bg-gray-100 rounded-lg`;

const Logo: FC = () => {
  const [ location, setLocation ] = useLocation();
  return (
    <LogoButton onClick={() => setLocation('/')}>
      <div tw="h-12 w-12">
        <img tw="pointer-events-none" src={logo} />
      </div>
    </LogoButton>
  );
};

const IconContainer = tw.div`flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none`;
const SearchBox = tw.div`hidden relative md:block`;
const SearchInput = tw.input`block p-2 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500`;
const MobileMenuBtn =       tw.button`md:hidden text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-gray-200 rounded-lg inline-flex items-center p-2 focus:ring-2 `;
const MobileBtn = tw.button`md:hidden text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-gray-200 rounded-lg focus:ring-4 text-sm p-2.5 mr-1`;
const NavContentContainer = tw.div`hidden md:flex md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium`;

const Header: FC<{ showModal: () => void }> = ({ showModal }) => {
  return (
      <nav tw="flex bg-gray-200 h-16 px-2 sm:px-4 py-2.5">
        <div tw="container flex flex-wrap justify-between items-center mx-auto">
          <Logo />
          <div tw="flex md:order-2">
            <MobileBtn aria-expanded="false">
              <WalletIcon />
            </MobileBtn>
            <MobileBtn aria-expanded="false">
              <SearchIcon />
            </MobileBtn>
            <SearchBox>
              <IconContainer>
                <SearchIcon />
              </IconContainer>
              <SearchInput type="text" id="search-navbar" placeholder="Search..." />
            </SearchBox>
            <MobileMenuBtn aria-expanded="false">
              <MenuIcon />
            </MobileMenuBtn>
          </div>
          <div tw="hidden justify-between items-center w-full md:flex md:w-auto md:order-1">
            <NavContentContainer>
              <Button color="light" onClick={ showModal }>Connect Wallet</Button>
            </NavContentContainer>
          </div>
        </div>
      </nav>
  );
};
