import React, { FC, useEffect, useRef } from 'react';
import tw from 'twin.macro';
import styled from "styled-components";
import { Close as CloseIcon, QuestionCircle } from '@icons/mui';
import { MetaMask, Coinbase, Opera, WalletConnect, Fortmatic } from '@icons/wallet';

const WalletModal: FC<{ isOpened: boolean, onClose: () => void }> = ({ isOpened, onClose }) => {
    const ref = useRef<HTMLDialogElement>(null);

    const Container = styled.dialog`
        ::backdrop {
            background: rgba(0, 0, 0, 0.6);
        }
    `;

    useEffect(() => {
        if (isOpened) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [isOpened]);

    return (
        <Container ref={ ref } onCancel={ onClose } onClick={ onClose } >
            <Wallet hideModal={ onClose } />
        </Container>
    );
};

const ModalDiv = tw.div`relative overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:mx-auto md:inset-0 md:h-full`;
const ModalContainer = tw.div`relative p-4 w-full max-w-md h-full md:h-auto fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`;
const CloseButton = tw.button`absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center`;
const ModalHeaderDiv = tw.div`py-4 px-6 rounded-t border-b`;
const ModalHeader = tw.h3`text-base font-semibold text-gray-900 lg:text-xl`;
const HelperText = tw.p`text-sm font-normal text-gray-500`;
const WalletButton = tw.div`flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow cursor-pointer`;
const WalletText = tw.span`flex-1 ml-3 whitespace-nowrap`;
const InfoSection = tw.div`inline-flex items-center text-xs font-normal text-gray-500 hover:underline cursor-pointer`;

const Wallet: FC<{ hideModal: () => void }> = ({ hideModal }) => {
  const preventAutoClose = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <ModalDiv tabIndex={ -1 } aria-hidden="true">
      <ModalContainer onClick={ preventAutoClose }>
        <div tw="relative bg-white rounded-lg shadow">
          <CloseButton onClick={ hideModal }><CloseIcon /></CloseButton>
          <ModalHeaderDiv>
            <ModalHeader>Connect wallet</ModalHeader>
          </ModalHeaderDiv>
          <div tw="p-6">
              <HelperText>Connect with one of our available wallet providers or create a new one.</HelperText>
              <ul tw="my-4 space-y-3">
                <li>
                  <WalletButton className="group" >
                    <MetaMask />
                    <WalletText>MetaMask</WalletText>
                  </WalletButton>
                </li>
                <li>
                  <WalletButton className="group" >
                    <Coinbase />
                    <WalletText>Coinbase Wallet</WalletText>
                  </WalletButton>
                </li>
                <li>
                  <WalletButton className="group" >
                    <Opera />
                    <WalletText>Opera Wallet</WalletText>
                  </WalletButton>
                </li>
                <li>
                  <WalletButton className="group" >
                    <WalletConnect />
                    <WalletText>WalletConnect</WalletText>
                  </WalletButton>
                </li>
                <li>
                  <WalletButton className="group" >
                    <Fortmatic />
                    <WalletText>Fortmatic</WalletText>
                  </WalletButton>
                </li>
              </ul>
              <InfoSection>
                <QuestionCircle />
                Why do I need to connect with my wallet?
              </InfoSection>
          </div>
        </div>
      </ModalContainer>
    </ModalDiv>
  );
};

export default WalletModal;