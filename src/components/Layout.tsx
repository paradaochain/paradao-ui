import React, { FC, PropsWithChildren, useState } from 'react';
import tw from 'twin.macro';
import { useLocation } from 'wouter';
import logo from './icons/paradao-icon.svg';
import Sidebar from '@components/Sidebar';
import Breadcrumbs from '@components/Breadcrumbs';
import { useMobile } from '@utils/responsive';
import { SearchIcon, MenuIcon, WalletIcon } from '@icons/mui';
import { usePolkadot } from '@context/polkadot';
import LightButton from './Button/LightButton';
import WalletModal from '@components/WalletModal';
import { Toaster } from 'react-hot-toast';

const ScreenContainer = tw.main`h-screen flex flex-col`;
const ContentContainer = tw.div`p-6 flex flex-col flex-1 justify-start items-start bg-blue-50 overflow-y-auto`;

const Layout: FC<PropsWithChildren> = ({ children: Component }) => {
  const isMobile = useMobile();
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  return (
    <ScreenContainer>
      <Toaster position="top-center" reverseOrder={false} />
      <div tw="flex flex-1 overflow-hidden">
        {/* TODO  mobile menu */}
        {!isMobile && <Sidebar showModal={() => setShowWalletModal(true)} />}
        <div tw="flex flex-1 flex-col overflow-auto">
          {/* <Header /> */}
          <ContentContainer>
            <Breadcrumbs />
            <main className="w-full my-0 mx-auto">{Component}</main>
            <WalletModal isOpened={showWalletModal} onClose={() => setShowWalletModal(false)} />
          </ContentContainer>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default Layout;

const LogoButton = tw.button`flex justify-center items-center md:hidden hover:bg-gray-100 rounded-lg`;

const Logo: FC = () => {
  const [, setLocation] = useLocation();
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
const MobileMenuBtn = tw.button`md:hidden text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-gray-200 rounded-lg inline-flex items-center p-2 focus:ring-2 `;
const MobileBtn = tw.button`md:hidden text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-gray-200 rounded-lg focus:ring-4 text-sm p-2.5 mr-1`;
const NavContentContainer = tw.div`hidden md:flex md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium`;

const Header: FC = () => {
  const { loadWallet, address } = usePolkadot();
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
            {address ? <p>{address}</p> : <LightButton onClick={loadWallet}>Connect Wallet</LightButton>}
          </NavContentContainer>
        </div>
      </div>
    </nav>
  );
};
