import React, { PropsWithChildren, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import tw from 'twin.macro';
import { useClickAway } from 'react-use';

export interface IModalOptions {
  status: boolean;
  closeModal: () => void;
}

const Modal: React.FC<PropsWithChildren<IModalOptions>> = ({ children, status, closeModal }) => {
  const visibility = status;
  const modalRef = useRef(null);

  useClickAway(modalRef, () => closeModal());

  return (
    <div
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 z-50 w-full h-full bg-[rgba(0,0,0,0.6)]"
      css={[visibility && tw`flex`, !visibility && tw`hidden`]}
    >
      <div className="flex w-full h-full items-center justify-center">
        <div className="bg-white rounded-lg relative py-7 px-5" ref={modalRef}>
          <div className="absolute top-2 right-2">
            <button onClick={() => closeModal()}>
              <IoClose className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
