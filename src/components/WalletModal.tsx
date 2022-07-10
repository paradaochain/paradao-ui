import React, { FC, useContext, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import Identicon from '@polkadot/react-identicon';
import { Close as CloseIcon } from '@icons/mui';
import { usePolkadot } from '@context/polkadot';
import { IntlAddress } from '@utils/Intl';
import { HorizontalSpinner } from './Spinner/Spinner';

const WalletModal: FC<{ isOpened: boolean; onClose: () => void }> = ({ isOpened, onClose }) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpened) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [isOpened]);

  const Container = styled.dialog`
    ::backdrop {
      background: rgba(0, 0, 0, 0.6);
    }
  `;

  return (
    <Container ref={ref} onCancel={onClose} onClick={onClose}>
      <Wallet hideModal={onClose} />
    </Container>
  );
};

export default WalletModal;

const ModalDiv = tw.div`relative overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:mx-auto md:inset-0 md:h-full`;
const ModalContainer = tw.div`relative p-4 w-full max-w-md h-full md:h-auto fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 `;
const CloseButton = tw.button`absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`;
const ModalHeaderDiv = tw.div`py-4 px-6 rounded-t border-b`;
const ModalHeader = tw.h3`text-base font-semibold text-gray-900 lg:text-xl`;
const HelperText = tw.p`text-sm font-normal text-gray-500`;
const WalletButton = tw.div`flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow cursor-pointer`;
const WalletText = tw.p`whitespace-nowrap`;
const WalletAddrText = tw.p`whitespace-nowrap text-xs text-gray-500`;
const InfoSection = tw.div`inline-flex items-center text-xs font-normal text-gray-500 hover:underline cursor-pointer`;

const Wallet: FC<{ hideModal: () => void }> = ({ hideModal }) => {
  const preventAutoClose = (e: React.MouseEvent) => e.stopPropagation();
  const { loadWallet, accounts, setAddress, hasExtension } = usePolkadot();

  useEffect(() => {
    loadWallet();
  }, []);

  const setAndClose = (addr: string) => {
    setAddress(addr);
    hideModal();
  };

  if (!hasExtension) return <HelperText>Please install the Polkadot browser Extension</HelperText>;

  return (
    <ModalDiv tabIndex={-1} aria-hidden="true">
      <ModalContainer onClick={preventAutoClose}>
        <div tw="relative bg-white rounded-lg shadow ">
          <CloseButton onClick={hideModal}>
            <CloseIcon />
          </CloseButton>
          <ModalHeaderDiv>
            <ModalHeader>Connect wallet</ModalHeader>
          </ModalHeaderDiv>
          <div tw="p-6 overflow-y-auto max-height[400px]">
            <HelperText>Choose an account from your Polkadot browser Extension</HelperText>
            {(!accounts || accounts.length === 0) ? <h1>Loading... <HorizontalSpinner/></h1> :
              accounts.map(act => {
                return (
                  <ul tw="my-4 space-y-3" key={act.address}>
                    <li>
                      <WalletButton className="group" onClick={() => setAndClose(act.address)}>
                        <Identicon value={act.address} size={32} theme={'substrate'}/>
                        <div tw="ml-3 flex-1">
                          <WalletText>{act.name}</WalletText>
                          <WalletAddrText>{IntlAddress(act.address, 36)}</WalletAddrText>
                        </div>
                      </WalletButton>
                    </li>
                  </ul>
                );
              }) 
            }
            {/* <InfoSection>
              <QuestionCircle />
              Why do I need to connect with my wallet?
            </InfoSection> */}
          </div>
        </div>
      </ModalContainer>
    </ModalDiv>
  );
};
