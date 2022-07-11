
import React, { PropsWithChildren } from 'react';
import Modal from './Modal';

import PMForm from '@views/DaoDetail/FormPM/PM';

export interface IModalOptions {
  status: boolean;
  closeModal: () => void;
}

const NewPMModal: React.FC<PropsWithChildren<IModalOptions>> = ({ status, closeModal }) => {
  return (
    <Modal status={status} closeModal={closeModal}>
      <div>
        <h3 className="font-bold text-xl text-center">Create new prediction market</h3>
      </div>
      <div>
        <PMForm />
      </div>
    </Modal>
  );
};

export default NewPMModal;
