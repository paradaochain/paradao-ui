import React, { FC } from 'react';
import { useLocation } from 'wouter';
import tw from 'twin.macro';
import logo from './icons/paradao-icon.svg';
import { View, Add } from '@icons/mui';
import { usePolkadot } from '@context/polkadot';
import LightButton from './Button/LightButton';
import { IntlAddress } from '@utils/Intl';

const LogoButton = tw.button`w-full mb-4 flex justify-center items-center`;
const SideBarBtn = tw.button`flex w-full items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100`;
const SideBarAside = tw.aside`w-64 bg-gray-50 min-h-screen`;
const SideBarContainer = tw.div`overflow-y-auto py-4 px-3 bg-gray-50 rounded h-full flex flex-col`;
const SideBarTxt = tw.span`ml-3 text-blue-900`;
const SideAddress = tw.p`text-sm text-center`;

const LayoutSidebar: FC<{ showModal: () => void }> = ({ showModal }) => {
  return (
    <div tw="flex width[fit-content]">
      <Sidebar showModal={showModal}/>
    </div>
  );
};

export default LayoutSidebar;

const Sidebar: FC<{ showModal: () => void }> = ({ showModal }) => {
  const [, setLocation] = useLocation();
  const { loadWallet, address, disconnectWallet } = usePolkadot();

  return (
    <SideBarAside aria-label="ParaDAO sidebar">
      <SideBarContainer>
        <LogoButton onClick={() => setLocation('/')}>
          <div tw="h-20 w-20">
            <img tw="pointer-events-none" src={logo} />
          </div>
        </LogoButton>
        <ul tw="space-y-2" className="h-full">
          <li>
            <SideBarBtn onClick={() => setLocation('/')}>
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
        <div className="flex justify-center flex-col px-6 gap-2">
          {address ? (
            <LightButton onClick={disconnectWallet}>Disconnect</LightButton>
          ) : (
            <LightButton onClick={showModal}>Connect Wallet</LightButton>
          )}
          {address && <SideAddress>Address: {IntlAddress(address, 20)}</SideAddress>}
        </div>
      </SideBarContainer>
    </SideBarAside>
  );
};
