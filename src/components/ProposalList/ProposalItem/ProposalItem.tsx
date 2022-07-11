import Button from '@components/Button/Button';
import LightButton from '@components/Button/LightButton';
import Modal from '@components/Modal/Modal';
import { ProposalWithId } from '@interfaces/Proposal';
import { ProposalStatus } from '@interfaces/ProposalStatus';
import { DAOService } from '@services/dao';
import { IntlAddress } from '@utils/Intl';
import React, { useCallback, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { usePolkadot } from '@context/polkadot';
import { WhiteSpinner } from '@components/Spinner/Spinner';

interface Props {
  daoService: DAOService;
}

const ProposalItem: React.FC<ProposalWithId & Props> = ({ id, title, proposer, tx, status, expires, threshold, daoService }) => {
  const [modal, setModal] = useState<boolean>(false);
  const [votingYes, setIsVotingYes] = useState<boolean>(false);
  const [votingNo, setIsVotingNo] = useState<boolean>(false);
  const { address } = usePolkadot();
  // const vote = useCallback(async (vote: boolean) => daoService.vote(id, vote), []);
  console.log('vote-id', id);

  const handleVote = (vote: boolean) => {
    const callJoin = async () => {
      if (vote) setIsVotingYes(true);
      else setIsVotingNo(true);
      setTimeout(() => {
        setIsVotingYes(false);
        setIsVotingNo(false);
        toast.error('Could not vote now :( Try again?');
      }, 120000);
      toast('Your voice will be heard! Voting... :)');
      try {
        const confirm = await daoService.vote(id, vote);
        setIsVotingYes(false);
        setIsVotingNo(false);
        toast.success('Successfully voted!');
        setTimeout(() => setModal(false), 1000);
      } catch (e) {
        // display err
        console.log(e);
        setIsVotingYes(false);
        setIsVotingNo(false);
        toast.error(`Could not vote ${e}`);
      }
    };
    callJoin();
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg p-3 ">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <Button onClick={() => setModal(true)}>Details</Button>
        </div>
        <div className="grid grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p>{status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p>{Object.keys(tx)[0]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Expire at block</p>
            <p>{expires.toString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Proposer</p>
            <p>{IntlAddress(proposer, 25)}</p>
          </div>
        </div>
      </div>
      <Modal status={modal} closeModal={() => setModal(false)}>
        <div className="space-y-5">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Proposal Detail</h2>
            <p className="text-md font-semibold text-gray-500">{title}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Required</p>
            <p>{threshold * 100}%</p>
          </div>
          <p className="text-xs text-gray-500">Votes Option</p>
          <div className="flex justify-between">
            <LightButton className="min-w-[50px]" onClick={() => handleVote(true)} disabled={!address || votingYes || votingNo}>
              {votingYes ? <WhiteSpinner /> : 'Yes'}
            </LightButton>
            <LightButton className="min-w-[50px" onClick={() => handleVote(false)} disabled={!address || votingYes || votingNo}>
              {votingNo ? <WhiteSpinner /> : 'No'}
            </LightButton>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProposalItem;
