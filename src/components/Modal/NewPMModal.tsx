
import React, { PropsWithChildren } from 'react';
import Modal from './Modal';

import PMForm from '@views/DaoDetail/FormPM/PM';
import ZeitgeistService from '@services/zeitgeist';

export interface IModalOptions {
  status: boolean;
  closeModal: () => void;
}

const NewPMModal: React.FC<{status: boolean, closeModal: () => void, zeitgeist: ZeitgeistService}> = ({ status, closeModal, zeitgeist }) => {
  return (
    <Modal status={status} closeModal={closeModal}>
      <div>
        <h3 className="font-bold text-xl text-center">Create new prediction market</h3>
      </div>
      <div>
        <PMForm zeitgeist={zeitgeist}/>
      </div>
    </Modal>
  );
};

export default NewPMModal;
